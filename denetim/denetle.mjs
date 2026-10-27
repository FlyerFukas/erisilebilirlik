#!/usr/bin/env node
// Erişilebilirlik denetimi: bilişsel yük (B), sezgisel etkileşim (S), bilgi kokusu (K).
//
//   node denetle.mjs http://localhost:3000            ana sayfa + aynı sitedeki 8 sayfa
//   node denetle.mjs https://site.app /giris /panel   belirli sayfalar
//   seçenekler:  --tara N    gezilecek ek sayfa (varsayılan 8, 0 = yalnız verilenler)
//                --cikti D   rapor klasörü (varsayılan ./erisim-rapor)
//                --sessiz    yalnız özet yaz
//                --oturum F  Playwright storageState dosyası: giriş yapılmış sayfaları denetler
//                            (oluşturma: npx playwright-core codegen --channel msedge --save-storage=oturum.json <adres>)
//                --terimler F  projenin terim sözlüğü (varsayılan ./erisim/terimler.json varsa o)
//                --etkilesim   formları gerçekten gönderip hata mesajını, veri korumasını, tepki süresini ölç
//                              (yazma istekleri ağda kesilir: canlı sitede kayıt oluşmaz; bkz. etkilesim.mjs)
//                --taban-yaz   bu denetimin puanını ./erisim/taban.json'a taban çizgisi olarak yaz;
//                              dosya varsa her raporda tabana göre değişim gösterilir
// Çıkış kodu: kritik bulgu varsa 1 (CI'da derlemeyi durdurur), yoksa 0.
import { chromium } from "playwright-core";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { olc } from "./olcumler.js";
import { etkilesimOlc } from "./etkilesim.mjs";
import { KURALLAR, ESIK } from "./kurallar.mjs";

const KOK = dirname(fileURLToPath(import.meta.url));
const sozluk = JSON.parse(readFileSync(join(KOK, "sozluk.json"), "utf8"));

function argumanlar(argv) {
  const a = { adresler: [], tara: 8, cikti: "erisim-rapor", sessiz: false, oturum: null, terimler: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--tara") a.tara = Number(argv[++i]);
    else if (argv[i] === "--cikti") a.cikti = argv[++i];
    else if (argv[i] === "--sessiz") a.sessiz = true;
    else if (argv[i] === "--oturum") a.oturum = resolve(argv[++i]);
    else if (argv[i] === "--terimler") a.terimler = resolve(argv[++i]);
    else if (argv[i] === "--taban-yaz") a.tabanYaz = true;
    else if (argv[i] === "--etkilesim") a.etkilesim = true;
    else a.adresler.push(argv[i]);
  }
  if (!a.adresler.length) {
    console.error("Kullanım: node denetle.mjs <adres> [/yol ...] [--tara N] [--cikti klasör] [--oturum oturum.json] [--terimler terimler.json]");
    process.exit(2);
  }
  if (a.oturum && !existsSync(a.oturum)) { console.error(`Oturum dosyası yok: ${a.oturum}`); process.exit(2); }
  if (!a.terimler && existsSync(resolve("erisim/terimler.json"))) a.terimler = resolve("erisim/terimler.json");
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

// Sayfa yüklenmeden önce çalışır: düzen kayması (S18, oturum pencereli CLS) ve en büyük içerik boyaması (S14) toplanır.
function performansGozcusu() {
  const p = (window.__erisimPerf = { cls: 0, lcp: 0 });
  let pencere = 0, ilk = 0, son = 0;
  try {
    new PerformanceObserver((liste) => {
      for (const e of liste.getEntries()) {
        if (e.hadRecentInput) continue;
        if (pencere && e.startTime - son < 1000 && e.startTime - ilk < 5000) pencere += e.value;
        else { pencere = e.value; ilk = e.startTime; }
        son = e.startTime;
        p.cls = Math.max(p.cls, pencere);
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((liste) => { const e = liste.getEntries().at(-1); if (e) p.lcp = e.startTime; })
      .observe({ type: "largest-contentful-paint", buffered: true });
  } catch { /* gözcüyü desteklemeyen tarayıcı: ölçüm atlanır */ }
}

async function sayfaOlc(tr, url, mod, klasor, sira, a) {
  const ortak = { locale: "tr-TR", ...(a.oturum ? { storageState: a.oturum } : {}) };
  const ctx = await tr.newContext(mod === "mobil"
    ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, ...ortak }
    : { viewport: { width: 1366, height: 800 }, ...ortak });
  await ctx.addInitScript(performansGozcusu);
  const p = await ctx.newPage();
  try {
    const yanit = await p.goto(url, { waitUntil: "networkidle", timeout: 30000 }).catch(() => p.goto(url, { waitUntil: "load", timeout: 30000 }));
    await p.waitForTimeout(1500);
    const sonuc = await p.evaluate(olc, { mod, sozluk: a.sozluk, esik: ESIK, anaYol: a.anaYol });
    sonuc.durum = yanit?.status() ?? 0;
    sonuc.mod = mod;
    // Hata sayfası boş olduğu için öbür kuralların hiçbiri tetiklenmez ve puan 100 çıkardı (pilot: iliski-haritasi kökü 404).
    if (sonuc.durum >= 400) sonuc.bulgular.unshift({ kural: "K03", seviye: "kritik",
      mesaj: `Sayfa HTTP ${sonuc.durum} döndü: kullanıcı bu adreste aradığını değil hata sayfasını görüyor. Adresi düzelt ya da çalışan sayfaya yönlendir`, ornekler: [new URL(url).pathname] });
    if (mod === "masaustu" || sira === 0) {
      sonuc.ekranGoruntusu = `${String(sira).padStart(2, "0")}-${mod}.png`;
      await p.screenshot({ path: join(klasor, sonuc.ekranGoruntusu) });
    }
    // Ekran görüntüsünden sonra: ikisi de sayfayı değiştirir (bekleme, yazı boyutu).
    if (mod === "masaustu") {
      if (sonuc.slaytAday) sonuc.bulgular.push(...await slaytSina(p));
      sonuc.bulgular.push(...await yaziBoyutuSina(ctx, p));
    }
    return sonuc;
  } catch (h) {
    return { url, mod, hata: String(h.message || h).split("\n")[0], bulgular: [], linkler: [] };
  } finally {
    await ctx.close();
  }
}

// Kendiliğinden dönen slayt (B09) [COGA 4.6.1], [Krug-DMMT s.62-63]: 6 sn hiç dokunmadan bekle, slaytın içi yer değiştirdi mi?
// Adayları olcumler.js data-erisim-slayt ile işaretler; slayt yoksa beklenmez. Saniyede bir örnek alınır: tek karşılaştırma
// döngüsü 6 sn'ye denk gelen slaytı (2 slayt × 3 sn) kaçırır.
async function slaytSina(p) {
  const imza = () => p.evaluate(() => [...document.querySelectorAll("[data-erisim-slayt]")].map((e) => ({
    imza: [e.scrollLeft, ...[...e.querySelectorAll("*")].slice(0, 40).map((c) =>
      `${Math.round(c.getBoundingClientRect().left)}:${c.getAttribute("class") || ""}:${c.getAttribute("aria-hidden") || ""}`)].join("|"),
    durdur: [...e.querySelectorAll("button, [role=button]")].some((b) => /durdur|duraklat|pause|stop/i.test(`${b.innerText} ${b.getAttribute("aria-label") || ""}`)),
    ad: `${e.tagName.toLowerCase()}${typeof e.className === "string" && e.className ? "." + e.className.trim().split(/\s+/)[0] : ""}`,
  })));
  try {
    const once = await imza(), degisen = new Set();
    for (let t = 0; t < 6; t++) {
      await p.waitForTimeout(1000);
      (await imza()).forEach((s, i) => { if (once[i] && s.imza !== once[i].imza) degisen.add(i); });
    }
    const donen = once.filter((_, i) => degisen.has(i));
    if (!donen.length) return [];
    const durdursuz = donen.some((d) => !d.durdur);
    return [{ kural: "B09", seviye: durdursuz ? "uyari" : "bilgi", ornekler: donen.map((d) => d.ad),
      mesaj: durdursuz ? "Kendiliğinden dönen slayt var ve durdurma düğmesi yok: okumaya başlayan kişinin önünden içerik kayıp gidiyor"
        : "Kendiliğinden dönen slayt var: durdurma düğmesi görünür, ama en iyisi slaytı kullanıcı ilerletsin" }];
  } catch { return []; }
}

// Krug'un yazı boyutu sınaması [Krug-DMMT s.212-213], [COGA 4.9.4]: tarayıcının yazı boyutu ayarını (yakınlaştırma değil)
// 16'dan 32'ye çıkar. px ile sabitlenmiş metin bu ayara uymaz; büyük yazıya ihtiyacı olan kişi okuyamaz.
async function yaziBoyutuSina(ctx, p) {
  const olc = (isaretle) => p.evaluate((isaretle) => {
    if (isaretle) [...document.querySelectorAll("p, li, td, dd, label, blockquote")]
      .filter((e) => (e.innerText || "").trim().split(/\s+/).length >= 3 && e.getBoundingClientRect().height > 1).slice(0, 40)
      .forEach((e, i) => e.setAttribute("data-erisim-yazi", String(i)));
    return { boyut: [...document.querySelectorAll("[data-erisim-yazi]")].map((e) => parseFloat(getComputedStyle(e).fontSize)),
      tasma: document.scrollingElement.scrollWidth - innerWidth };
  }, isaretle);
  try {
    const once = await olc(true);
    if (!once.boyut.length) return [];
    const cdp = await ctx.newCDPSession(p);
    await cdp.send("Page.setFontSizes", { fontSizes: { standard: 32, fixed: 26 } });
    await p.waitForTimeout(400);
    const sonra = await olc(false);
    const sabit = once.boyut.filter((b, i) => !(sonra.boyut[i] >= b * 1.5)).length, oran = sabit / once.boyut.length;
    const bulgular = [];
    if (oran > 0.2) bulgular.push({ kural: "S12", seviye: oran > 0.5 ? "uyari" : "bilgi", ornekler: [],
      mesaj: `Tarayıcının yazı boyutu ayarı iki katına çıkınca ${sabit}/${once.boyut.length} metin aynı boyutta kaldı: yazı px ile sabitlenmiş, büyük yazıya ihtiyacı olan kişi okuyamaz. font-size için rem kullan` });
    if (sonra.tasma > 4 && once.tasma <= 4) bulgular.push({ kural: "S12", seviye: "bilgi", ornekler: [],
      mesaj: `Yazı büyütülünce sayfa ${sonra.tasma}px yana taşıyor: sabit genişlikli kutular büyüyen metni sığdırmıyor` });
    return bulgular;
  } catch { return []; }
}

// Sayfalar arası kurallar: tutarlılık (S05), koku sürekliliği (K04), aynı başlık (K03).
function sayfalarArasi(sonuclar, anaYol = "/") {
  const anaMi = (href) => { const y = new URL(href).pathname; return y === "/" || y === anaYol; };
  const bulgular = [];
  const masa = sonuclar.filter((s) => s.mod === "masaustu" && !s.hata);
  const hrefMetin = new Map();
  const sifirla = /^(tümü|hepsi|all|tüm .*)$/u;
  for (const s of masa) for (const l of s.linkler.filter((l) => l.navda && !anaMi(l.href) && !sifirla.test(l.metin))) {
    if (!hrefMetin.has(l.href)) hrefMetin.set(l.href, new Set());
    hrefMetin.get(l.href).add(l.metin);
  }
  const tutarsiz = [...hrefMetin].filter(([, m]) => m.size > 1);
  if (tutarsiz.length) bulgular.push({ kural: "S05", seviye: "uyari", url: "(site geneli)",
    mesaj: "Aynı sayfaya giden menü öğesi farklı adlarla anılıyor", ornekler: tutarsiz.slice(0, 5).map(([h, m]) => `${new URL(h).pathname}: ${[...m].map((x) => `"${x}"`).join(" / ")}`) });

  // Aynı işi yapan buton her sayfada aynı görünür [COGA 4.2.3].
  const dugmeGorunum = new Map();
  for (const s of masa) for (const d of s.dugmeler || []) {
    if (!dugmeGorunum.has(d.metin)) dugmeGorunum.set(d.metin, new Map());
    const g = dugmeGorunum.get(d.metin);
    g.set(d.gorunum, new Set([...(g.get(d.gorunum) || []), new URL(s.url).pathname]));
  }
  const farkliDugme = [...dugmeGorunum].filter(([, g]) => g.size > 1 && new Set([...g.values()].flatMap((y) => [...y])).size > 1);
  if (farkliDugme.length) bulgular.push({ kural: "S05", seviye: "uyari", url: "(site geneli)",
    mesaj: "Aynı adlı buton sayfadan sayfaya farklı görünüyor: kullanıcı aynı işi yaptığını anlamakta duraksar",
    ornekler: farkliDugme.slice(0, 5).map(([m, g]) => `"${m}": ${g.size} görünüm (${[...g.values()].map((y) => [...y].join(" ")).join(" / ")})`) });

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
    if (!h || h.url === s.url || anaMi(l.href)) continue;
    const k1 = kelimeler(l.metin), k2 = kelimeler([h.baslik, ...h.h1].join(" "));
    if (k1.size && ![...k1].some((w) => k2.has(w))) kopuk.push(`"${l.metin}" → varılan sayfa: "${h.h1[0] || h.baslik}"`);
  }
  const tekil = [...new Set(kopuk)];
  if (tekil.length) bulgular.push({ kural: "K04", seviye: "uyari", url: "(site geneli)",
    mesaj: "Tıklanan etiket ile varılan sayfanın adı örtüşmüyor: kullanıcı doğru yere geldiğinden emin olamaz", ornekler: tekil.slice(0, 5) });

  // K10: takılan kullanıcı hiçbir sayfadan insana ya da yardıma ulaşamıyorsa.
  if (masa.length && !sonuclar.some((s) => s.metrik?.yardim)) bulgular.push({ kural: "K10", seviye: "uyari", url: "(site geneli)",
    mesaj: "Denetlenen sayfaların hiçbirinde yardım, iletişim, SSS bağlantısı ya da e-posta/telefon yok: takılan kullanıcı çıkıp gider", ornekler: [] });
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
    .map((b) => ({ ...b, url: `${new URL(s.url).pathname}${{ mobil: " (mobil)", etkilesim: " (etkileşim)" }[s.mod] || ""}` }))), ...genel];
  const gruplar = grupla(tum);
  const say = (sev) => gruplar.filter((b) => b.seviye === sev).length;
  const puan = puanla(gruplar);
  const ad = { B: "Bilişsel yük", S: "Sezgisel etkileşim", K: "Bilgi kokusu" };
  const satir = [
    `# Erişilebilirlik denetimi`, ``,
    `Adres: ${a.adresler[0]}  `, `Tarih: ${new Date().toLocaleString("tr-TR")}  `,
    `Sayfa: ${new Set(sonuclar.map((s) => s.url)).size} (masaüstü + mobil${a.etkilesim ? " + etkileşim" : ""})`, ``,
    `| Boyut | Puan |`, `|---|---|`,
    ...Object.entries(puan).map(([k, v]) => `| ${ad[k]} (${k}) | ${v}/100 |`), ``,
    `**Kritik: ${say("kritik")} · Uyarı: ${say("uyari")} · Bilgi: ${say("bilgi")}**`, ``,
    ...(a.taban ? [`Taban çizgisi (${a.taban.tarih}): ${Object.entries(puan).map(([k, v]) => {
      const f = v - (a.taban.puan?.[k] ?? v);
      return `${k} ${a.taban.puan?.[k] ?? "-"} → ${v}${f ? ` (${f > 0 ? "+" : ""}${f})` : ""}`;
    }).join(" · ")} · kritik ${a.taban.kritik} → ${say("kritik")}`, ``] : []),
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
  satir.push(`## Sayfa ölçümleri`, ``, `| Sayfa | Mod | Durum | İlk ekran öğe | İlk ekran kelime | Okunabilirlik | Birincil buton | CLS | LCP ms | KB |`, `|---|---|---|---|---|---|---|---|---|---|`);
  for (const s of sonuclar.filter((s) => s.mod !== "etkilesim")) {
    const m = s.metrik || {};
    satir.push(`| ${new URL(s.url).pathname} | ${s.mod} | ${s.hata ? "HATA: " + s.hata : s.durum} | ${m.ilkEkranEtkilesim ?? ""} | ${m.ilkEkranKelime ?? ""} | ${m.okunabilirlik ?? "-"} | ${m.birincilButon ?? ""} | ${m.cls ?? "-"} | ${m.lcp ?? "-"} | ${m.agirlikKB ?? "-"} |`);
  }
  writeFileSync(join(klasor, "rapor.md"), satir.join("\n"), "utf8");
  writeFileSync(join(klasor, "rapor.json"), JSON.stringify({ puan, bulgular: gruplar, sonuclar }, null, 1), "utf8");
  return { tum: gruplar, puan, say };
}

async function main() {
  const a = argumanlar(process.argv.slice(2));
  a.sozluk = { ...sozluk, terimler: a.terimler ? JSON.parse(readFileSync(a.terimler, "utf8")) : null };
  const tabanYolu = resolve("erisim/taban.json");
  a.taban = !a.tabanYaz && existsSync(tabanYolu) ? JSON.parse(readFileSync(tabanYolu, "utf8")) : null;
  // Kök "/" başka bir yola yönleniyorsa (ör. /burslar) orası ana sayfadır: logo oraya gidebilir. (Pilot kalibrasyonu: Örnek Uygulama)
  a.anaYol = "/";
  try { a.anaYol = new URL((await fetch(new URL("/", a.adresler[0]), { redirect: "follow" })).url).pathname; } catch { /* ağ yoksa "/" */ }
  if (a.terimler && !a.sessiz) console.log(`Terim sözlüğü: ${a.terimler}`);
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
    const masa = await sayfaOlc(tr, url, "masaustu", klasor, sira, a);
    // Yönlendirilen sayfa (ör. oturum gerektiren her yol → /giris) bir kez denetlenir.
    const son = (masa.url || url).split("#")[0];
    if (son !== url.split("#")[0] && olculen.has(son)) {
      if (!a.sessiz) console.log(`  ↪ ${new URL(son).pathname} sayfasına yönlendirildi, zaten denetlendi`);
      continue;
    }
    olculen.add(son); gorulen.add(son.split("?")[0]);
    const mobil = await sayfaOlc(tr, url, "mobil", klasor, sira, a);
    sonuclar.push(masa, mobil);
    sira++;
    for (const l of masa.linkler || []) {
      if (ekBirakilan <= 0) break;
      const temiz = l.href.split("#")[0].split("?")[0];
      if (gorulen.has(temiz) || /\.(pdf|docx?|xlsx?|zip|png|jpe?g|svg)$/i.test(temiz) || /(cikis|logout|signout)/i.test(temiz)) continue;
      gorulen.add(temiz); kuyruk.push(temiz); ekBirakilan--;
    }
  }
  if (a.etkilesim) {
    for (const s of sonuclar.filter((s) => s.mod === "masaustu" && !s.hata)) {
      if (!a.sessiz) console.log(`⇢ etkileşim: ${new URL(s.url).pathname}`);
      sonuclar.push(await etkilesimOlc(tr, s.url, a));
    }
  }
  await tr.close();
  const { tum, puan, say } = raporYaz(a, sonuclar, sayfalarArasi(sonuclar, a.anaYol), klasor);
  console.log(`\nPuan  B ${puan.B} · S ${puan.S} · K ${puan.K}   Kritik ${say("kritik")} · Uyarı ${say("uyari")} · Bilgi ${say("bilgi")}`);
  if (a.taban) console.log(`Taban (${a.taban.tarih}): B ${a.taban.puan.B} · S ${a.taban.puan.S} · K ${a.taban.puan.K}   Kritik ${a.taban.kritik}`);
  if (a.tabanYaz) {
    mkdirSync(dirname(tabanYolu), { recursive: true });
    writeFileSync(tabanYolu, JSON.stringify({ tarih: new Date().toISOString().slice(0, 10), adres: a.adresler[0], puan,
      kritik: say("kritik"), uyari: say("uyari"), bilgi: say("bilgi") }, null, 2) + "\n", "utf8");
    console.log(`Taban çizgisi yazıldı: ${tabanYolu}`);
  }
  if (!a.sessiz) for (const b of tum.filter((b) => b.seviye === "kritik")) console.log(`  [KRİTİK ${b.kural}] ${b.url}: ${b.mesaj}`);
  console.log(`Rapor: ${join(klasor, "rapor.md")}`);
  process.exit(say("kritik") ? 1 : 0);
}

main().catch((h) => { console.error(h); process.exit(2); });
