#!/usr/bin/env node
// Erişilebilirlik denetimi: bilişsel yük (B), sezgisel etkileşim (S), bilgi kokusu (K).
//
//   node denetle.mjs http://localhost:3000            ana sayfa + aynı sitedeki 8 sayfa
//   node denetle.mjs https://site.app /giris /panel   belirli sayfalar
//   seçenekler:  --tara N    gezilecek ek sayfa (varsayılan 8, 0 = yalnız verilenler)
//                --cikti D   rapor klasörü (varsayılan ./erisim-rapor)
//                --sessiz    yalnız özet yaz
// Çıkış kodu: kritik bulgu varsa 1 (CI'da derlemeyi durdurur), yoksa 0.
import { chromium } from "playwright-core";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { olc } from "./olcumler.js";
import { KURALLAR, ESIK } from "./kurallar.mjs";

const KOK = dirname(fileURLToPath(import.meta.url));
const sozluk = JSON.parse(readFileSync(join(KOK, "sozluk.json"), "utf8"));

function argumanlar(argv) {
  const a = { adresler: [], tara: 8, cikti: "erisim-rapor", sessiz: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--tara") a.tara = Number(argv[++i]);
    else if (argv[i] === "--cikti") a.cikti = argv[++i];
    else if (argv[i] === "--sessiz") a.sessiz = true;
    else a.adresler.push(argv[i]);
  }
  if (!a.adresler.length) {
    console.error("Kullanım: node denetle.mjs <adres> [/yol ...] [--tara N] [--cikti klasör]");
    process.exit(2);
  }
  const taban = new URL(a.adresler[0]);
  a.adresler = a.adresler.map((y) => new URL(y, taban).href);
  return a;
}

async function tarayici() {
  // Önce sistemdeki Edge/Chrome; indirme gerektirmez.
  for (const channel of ["msedge", "chrome", undefined]) {
    try { return await chromium.launch({ channel }); } catch { /* sıradakini dene */ }
  }
  throw new Error("Tarayıcı bulunamadı: Edge/Chrome kur ya da `npx playwright install chromium` çalıştır");
}

async function sayfaOlc(tr, url, mod, klasor, sira) {
  const ctx = await tr.newContext(mod === "mobil"
    ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, locale: "tr-TR" }
    : { viewport: { width: 1366, height: 800 }, locale: "tr-TR" });
  const p = await ctx.newPage();
  try {
    const yanit = await p.goto(url, { waitUntil: "networkidle", timeout: 30000 }).catch(() => p.goto(url, { waitUntil: "load", timeout: 30000 }));
    await p.waitForTimeout(1500);
    const sonuc = await p.evaluate(olc, { mod, sozluk, esik: ESIK });
    sonuc.durum = yanit?.status() ?? 0;
    sonuc.mod = mod;
    if (mod === "masaustu" || sira === 0) {
      sonuc.ekranGoruntusu = `${String(sira).padStart(2, "0")}-${mod}.png`;
      await p.screenshot({ path: join(klasor, sonuc.ekranGoruntusu) });
    }
    return sonuc;
  } catch (h) {
    return { url, mod, hata: String(h.message || h).split("\n")[0], bulgular: [], linkler: [] };
  } finally {
    await ctx.close();
  }
}

// Sayfalar arası kurallar: tutarlılık (S05), koku sürekliliği (K04), aynı başlık (K03).
function sayfalarArasi(sonuclar) {
  const bulgular = [];
  const masa = sonuclar.filter((s) => s.mod === "masaustu" && !s.hata);
  const hrefMetin = new Map();
  const sifirla = /^(tümü|hepsi|all|tüm .*)$/u;
  for (const s of masa) for (const l of s.linkler.filter((l) => l.navda && new URL(l.href).pathname !== "/" && !sifirla.test(l.metin))) {
    if (!hrefMetin.has(l.href)) hrefMetin.set(l.href, new Set());
    hrefMetin.get(l.href).add(l.metin);
  }
  const tutarsiz = [...hrefMetin].filter(([, m]) => m.size > 1);
  if (tutarsiz.length) bulgular.push({ kural: "S05", seviye: "uyari", url: "(site geneli)",
    mesaj: "Aynı sayfaya giden menü öğesi farklı adlarla anılıyor", ornekler: tutarsiz.slice(0, 5).map(([h, m]) => `${new URL(h).pathname}: ${[...m].map((x) => `"${x}"`).join(" / ")}`) });

  const basliklar = new Map();
  for (const s of masa) basliklar.set(s.baslik, [...(basliklar.get(s.baslik) || []), new URL(s.url).pathname]);
  const ayni = [...basliklar].filter(([, y]) => y.length > 1);
  if (ayni.length) bulgular.push({ kural: "K03", seviye: "uyari", url: "(site geneli)",
    mesaj: "Farklı sayfalar aynı sekme başlığını taşıyor: geçmişte ve sekmelerde ayırt edilemez", ornekler: ayni.map(([b, y]) => `"${b}" → ${y.join(", ")}`) });

  const kok = (w) => w.toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}]/gu, "").slice(0, 5);
  const kelimeler = (t) => new Set((t || "").split(/\s+/).map(kok).filter((w) => w.length >= 3));
  const hedefler = new Map(masa.map((s) => [s.url.split("#")[0], s]));
  const kopuk = [];
  for (const s of masa) for (const l of s.linkler) {
    const h = hedefler.get(l.href);
    if (!h || h.url === s.url || new URL(l.href).pathname === "/") continue;
    const k1 = kelimeler(l.metin), k2 = kelimeler([h.baslik, ...h.h1].join(" "));
    if (k1.size && ![...k1].some((w) => k2.has(w))) kopuk.push(`"${l.metin}" → varılan sayfa: "${h.h1[0] || h.baslik}"`);
  }
  const tekil = [...new Set(kopuk)];
  if (tekil.length) bulgular.push({ kural: "K04", seviye: "uyari", url: "(site geneli)",
    mesaj: "Tıklanan etiket ile varılan sayfanın adı örtüşmüyor: kullanıcı doğru yere geldiğinden emin olamaz", ornekler: tekil.slice(0, 5) });
  return bulgular;
}

// Ortak bileşendeki (menü, alt sekme çubuğu) bir sorun her sayfada çıkar ama tek düzeltmedir.
// Bu yüzden aynı kural + seviye + mesaj kalıbı (sayılar atılmış) tek bulguya toplanır, sayfaları listelenir,
// ceza bir kez kesilir. (Pilot kalibrasyonu, KARARLAR K-03)
function grupla(bulgular) {
  const gruplar = new Map();
  for (const b of bulgular) {
    const anahtar = `${b.kural}|${b.seviye}|${b.mesaj.replace(/\d+/g, "#")}`;
    if (!gruplar.has(anahtar)) gruplar.set(anahtar, { ...b, sayfalar: [] });
    gruplar.get(anahtar).sayfalar.push(b.url);
  }
  return [...gruplar.values()];
}

function puanla(gruplar) {
  const puan = { B: 100, S: 100, K: 100 };
  const ceza = { kritik: 15, uyari: 5, bilgi: 0 };
  for (const b of gruplar) puan[b.kural[0]] = Math.max(0, puan[b.kural[0]] - ceza[b.seviye]);
  return puan;
}

function raporYaz(a, sonuclar, genel, klasor) {
  // Mobilde masaüstüyle aynı çıkan bulguyu tekrar yazma; yalnız mobile özgü olanı ekle.
  const anahtar = (s, b) => `${s.url}|${b.kural}|${b.mesaj}`;
  const masaustu = new Set(sonuclar.filter((s) => s.mod === "masaustu").flatMap((s) => s.bulgular.map((b) => anahtar(s, b))));
  const tum = [...sonuclar.flatMap((s) => s.bulgular
    .filter((b) => s.mod === "masaustu" || !masaustu.has(anahtar(s, b)))
    .map((b) => ({ ...b, url: `${new URL(s.url).pathname}${s.mod === "mobil" ? " (mobil)" : ""}` }))), ...genel];
  const gruplar = grupla(tum);
  const say = (sev) => gruplar.filter((b) => b.seviye === sev).length;
  const puan = puanla(gruplar);
  const ad = { B: "Bilişsel yük", S: "Sezgisel etkileşim", K: "Bilgi kokusu" };
  const satir = [
    `# Erişilebilirlik denetimi`, ``,
    `Adres: ${a.adresler[0]}  `, `Tarih: ${new Date().toLocaleString("tr-TR")}  `,
    `Sayfa: ${new Set(sonuclar.map((s) => s.url)).size} (masaüstü + mobil)`, ``,
    `| Boyut | Puan |`, `|---|---|`,
    ...Object.entries(puan).map(([k, v]) => `| ${ad[k]} (${k}) | ${v}/100 |`), ``,
    `**Kritik: ${say("kritik")} · Uyarı: ${say("uyari")} · Bilgi: ${say("bilgi")}**`, ``,
    `> Puan kıyas içindir: her ayrı sorun bir kez sayılır (kritik −15, uyarı −5). Otomatik denetim sorunların bir kısmını yakalar;`,
    `> 5 saniye testi, gövde testi ve 3 kişilik kullanım testi yerini tutmaz (katalog Ö bölümü).`, ``,
  ];
  for (const sev of ["kritik", "uyari", "bilgi"]) {
    const liste = gruplar.filter((b) => b.seviye === sev);
    if (!liste.length) continue;
    satir.push(`## ${{ kritik: "Kritik", uyari: "Uyarı", bilgi: "Bilgi" }[sev]}`, ``);
    for (const b of liste) {
      const k = KURALLAR[b.kural];
      const sayfa = b.sayfalar.length > 3 ? `${b.sayfalar.slice(0, 3).join("`, `")}\` ve ${b.sayfalar.length - 3} sayfa daha` : b.sayfalar.join("`, `") + "`";
      satir.push(`### ${b.kural} · ${k?.ad || ""}`, `Sayfa: \`${sayfa}  `, `${b.mesaj}  `, `**Çözüm:** ${k?.cozum || ""}`);
      for (const o of b.ornekler || []) satir.push(`- \`${String(o).replace(/`/g, "'")}\``);
      satir.push(``);
    }
  }
  satir.push(`## Sayfa ölçümleri`, ``, `| Sayfa | Mod | Durum | İlk ekran öğe | İlk ekran kelime | Okunabilirlik | Birincil buton |`, `|---|---|---|---|---|---|---|`);
  for (const s of sonuclar) {
    const m = s.metrik || {};
    satir.push(`| ${new URL(s.url).pathname} | ${s.mod} | ${s.hata ? "HATA: " + s.hata : s.durum} | ${m.ilkEkranEtkilesim ?? ""} | ${m.ilkEkranKelime ?? ""} | ${m.okunabilirlik ?? "-"} | ${m.birincilButon ?? ""} |`);
  }
  writeFileSync(join(klasor, "rapor.md"), satir.join("\n"), "utf8");
  writeFileSync(join(klasor, "rapor.json"), JSON.stringify({ puan, bulgular: gruplar, sonuclar }, null, 1), "utf8");
  return { tum: gruplar, puan, say };
}

async function main() {
  const a = argumanlar(process.argv.slice(2));
  const klasor = resolve(a.cikti);
  mkdirSync(klasor, { recursive: true });
  const tr = await tarayici();
  const sonuclar = [];
  const kuyruk = [...a.adresler], gorulen = new Set(kuyruk.map((u) => u.split("#")[0]));
  const olculen = new Set();
  let sira = 0, ekBirakilan = a.tara;
  while (kuyruk.length) {
    const url = kuyruk.shift();
    if (!a.sessiz) console.log(`→ ${url}`);
    const masa = await sayfaOlc(tr, url, "masaustu", klasor, sira);
    // Yönlendirilen sayfa (ör. oturum gerektiren her yol → /giris) bir kez denetlenir.
    const son = (masa.url || url).split("#")[0];
    if (son !== url.split("#")[0] && olculen.has(son)) {
      if (!a.sessiz) console.log(`  ↪ ${new URL(son).pathname} sayfasına yönlendirildi, zaten denetlendi`);
      continue;
    }
    olculen.add(son); gorulen.add(son.split("?")[0]);
    const mobil = await sayfaOlc(tr, url, "mobil", klasor, sira);
    sonuclar.push(masa, mobil);
    sira++;
    for (const l of masa.linkler || []) {
      if (ekBirakilan <= 0) break;
      const temiz = l.href.split("#")[0].split("?")[0];
      if (gorulen.has(temiz) || /\.(pdf|docx?|xlsx?|zip|png|jpe?g|svg)$/i.test(temiz) || /(cikis|logout|signout)/i.test(temiz)) continue;
      gorulen.add(temiz); kuyruk.push(temiz); ekBirakilan--;
    }
  }
  await tr.close();
  const { tum, puan, say } = raporYaz(a, sonuclar, sayfalarArasi(sonuclar), klasor);
  console.log(`\nPuan  B ${puan.B} · S ${puan.S} · K ${puan.K}   Kritik ${say("kritik")} · Uyarı ${say("uyari")} · Bilgi ${say("bilgi")}`);
  if (!a.sessiz) for (const b of tum.filter((b) => b.seviye === "kritik")) console.log(`  [KRİTİK ${b.kural}] ${b.url}: ${b.mesaj}`);
  console.log(`Rapor: ${join(klasor, "rapor.md")}`);
  process.exit(say("kritik") ? 1 : 0);
}

main().catch((h) => { console.error(h); process.exit(2); });
