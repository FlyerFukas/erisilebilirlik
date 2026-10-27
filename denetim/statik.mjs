#!/usr/bin/env node
// Statik tarama: sayfayı açmadan kaynak kodda erişilebilirlik ihlali arar.
// Giriş arkasındaki ekranlar da taranır, çünkü kod oturuma bakmaz. Sayfa denetiminin (denetle.mjs) yerini tutmaz:
// yalnız metinden kesin okunabilen kalıpları yakalar, gerisini sayfa denetimi ölçer.
//
//   node statik.mjs <proje-klasörü> [--json dosya]
// Çıkış kodu: kritik bulgu varsa 1.
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { KURALLAR } from "./kurallar.mjs";

const sozluk = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "sozluk.json"), "utf8"));
const UZANTI = /\.(tsx|jsx|ts|js|mjs|html|vue|svelte|astro)$/;
const ATLA = new Set(["node_modules", ".next", ".git", "dist", "build", "out", ".vercel", "coverage", "erisim", "erisim-rapor", "yedek", "public",
  // Üçüncü taraf ya da örnek kod ürünün parçası değil. (Pilot kalibrasyonu: ornekproje/referans)
  "referans", "reference", "vendor", "third_party", "examples",
  // Komut satırı ve test kodu kullanıcıya görünmez: oradaki toLocaleString() ya da e.message bulgu değildir.
  "scripts", "botlar", "supabase", "test", "tests", "__tests__", "e2e"]);

function dosyalar(kok, kl = kok, liste = []) {
  for (const ad of readdirSync(kl)) {
    if (ATLA.has(ad) || ad.startsWith(".")) continue;
    const yol = join(kl, ad);
    const d = statSync(yol);
    // components/ui: hazır bileşen kütüphanesi (shadcn vb.), projenin kendi metni değil.
    if (d.isDirectory()) { if (!/[\\/]components[\\/]ui$/.test(yol)) dosyalar(kok, yol, liste); }
    else if (UZANTI.test(ad) && d.size < 400_000 && !/\.(test|spec|d)\.[tj]sx?$/.test(ad)) liste.push(yol);
  }
  return liste;
}

// Her kural: [kimlik, seviye, desen, mesaj]. Desen tek satırda ya da (s bayrağıyla) birkaç satırda arar.
// JSX özniteliğinde ok fonksiyonu olabilir (onClick={() => {}}): ">" karakterini iki düzey süslü parantez içinde tanı.
const OZ = String.raw`(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*`;
const belirsiz = (liste) =>liste.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
// Beşinci öğe isteğe bağlı süzgeç (eşleşme, dosya metni, dosya adı) → true ise bulgu sayılır. Hepsi pilot kalibrasyonundan (KARARLAR K-03).
const ARAYUZ = /\.(tsx|jsx|html|vue|svelte|astro)$/; // işaretleme içeren dosya
const satiri = (metin, i) => metin.slice(metin.lastIndexOf("\n", i) + 1, (metin.indexOf("\n", i) + 1 || metin.length + 1) - 1);
const etiketi = (metin, i) => metin.slice(metin.lastIndexOf("<", i), metin.indexOf(">", i) + 1);
const KURAL = [
  // aria-label tam adı veriyorsa ("Seç" + "Erasmus+: ayrıntıyı aç") görünen kısa metin satır bağlamıyla anlaşılır.
  ["K01", "kritik", new RegExp(`<(button|a|Link)\\b${OZ}>\\s*(${belirsiz(sozluk.belirsiz_kritik)})\\s*</(button|a|Link)>`, "giu"),
    "Bağlantı/buton metni hedefini söylemiyor", (m, _, d) => ARAYUZ.test(d) && !/aria-label/.test(m[0])],
  ["K01", "uyari", new RegExp(`<(button|a|Link)\\b${OZ}>\\s*(${belirsiz(sozluk.belirsiz_uyari)})\\s*</(button|a|Link)>`, "giu"),
    "Belirsiz eylem etiketi: sonucu söyleyen fiil kullan", (m, _, d) => ARAYUZ.test(d) && !/aria-label/.test(m[0])],
  ["B13", "uyari", /\.toLocale(Date|Time)?String\(\s*\)/g, "Tarih/sayı biçimi dil belirtmeden: kullanıcının tarayıcısına göre değişir. 'tr-TR' ver"],
  // formatToParts ile saat dilimi hesabı ekrana yazılmaz, yalnız hesaptır.
  ["B13", "uyari", /Intl\.(NumberFormat|DateTimeFormat)\(\s*['"]en(-US)?['"]/g, "İngilizce yerel biçim: Türkçe arayüzde 1,250.50 ve 10/18/2026 görünür",
    (m, metin) => !/formatToParts/.test(metin.slice(m.index, m.index + 400))],
  ["B05", "uyari", /onPaste=\{[^}]*preventDefault|onpaste=["']return false/g, "Yapıştırma engelleniyor: şifre yöneticisi ve uzun kodlar elle yazılmak zorunda kalır"],
  // Arama kutusu, yazma alanı, "silmek için yaz" onayında kapatmak doğrudur; kural şifre ve e-posta için.
  ["B05", "uyari", /autoComplete=["']off["']|autocomplete=["']off["']/g, "Şifre/e-posta alanında otomatik doldurma kapatılmış: tarayıcı bilinen bilgiyi dolduramaz",
    (m, metin) => /type=["'](password|email)["']|name=["'][^"']*(e-?posta|email|mail|sifre|password)/i.test(etiketi(metin, m.index))],
  ["B09", "uyari", /<video\b(?![^>]*\bcontrols\b)[^>]*\bautoPlay\b|<video\b(?![^>]*\bcontrols\b)[^>]*\bautoplay\b/g, "Kendiliğinden oynayan, denetimsiz video"],
  ["B09", "uyari", /http-equiv=["']refresh["']/gi, "Sayfa kendiliğinden yenileniyor (meta refresh)"],
  ["S12", "uyari", /user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b|maximumScale:\s*1\b|userScalable:\s*false/g, "Yakınlaştırma kapatılmış"],
  // Yalnız JSX çocuğu olarak: value={JSON.stringify(...)} gizli alanı, SQL ve betik metni kullanıcıya görünmez.
  ["B12", "uyari", />\s*\{\s*JSON\.stringify\(/g, "JSON doğrudan arayüze yazılıyor: kullanıcı ham veri görür", (m, _, d) => ARAYUZ.test(d)],
  ["B12", "bilgi", />\s*\{\s*(e|err|error|hata|h)\??\.message\s*\}|>\s*\{\s*String\(\s*(e|err|error|hata|h)\s*\)\s*\}/g,
    "Ham hata mesajı (exception metni) kullanıcıya gösteriliyor: insan diliyle mesaj ve sonraki adım yaz", (m, _, d) => ARAYUZ.test(d)],
  // Sunucudan arayüze dönen metne gömülü ham hata: return { hata: `Eklenemedi: ${error.message}` }.
  // throw new Error(...) sayılmaz: Next.js canlıda sunucu hata metnini kullanıcıya göstermez.
  // Değişken adı serbest: okumaHatasi, yazmaHatasi, e2 de aynı ham metni taşır (pilot: İlişki Haritası 9 kaçak).
  // Tür dönüşümlü yazım da aynı metni taşır: ${(e as Error).message}.
  ["B12", "bilgi", /\$\{\s*(?:[A-Za-z_$][\w$]*|\(\s*[A-Za-z_$][\w$]*\s+as\s+Error\s*\))\??\.message\s*\}/g,
    "Ham hata mesajı (veritabanı/exception metni) arayüze dönen mesaja gömülü: kullanıcıya ne olduğunu ve ne yapacağını insan diliyle söyle",
    (m, metin) => { const s = satiri(metin, m.index); return /(hata|mesaj|message|error|uyari)\s*:|\.push\(|toast|alert\(/i.test(s) && !/throw\s|console\./.test(s); }],
  // İstemcide yakalanan sunucu hatası ekrana basılıyor. Next.js canlıda bu metni gizler ve yerine İngilizce genel
  // mesaj koyar ("An error occurred in the Server Components render..."). (Pilot: İlişki Haritası 5 bileşen)
  ["B12", "uyari", /set[A-Z]\w*\(\s*\(?\s*[A-Za-z_$][\w$]*(?:\s+as\s+Error)?\s*\)?\??\.message\s*\)/g,
    "Yakalanan hata metni doğrudan ekrana basılıyor: sunucu eyleminden geliyorsa canlıda İngilizce genel mesaja dönüşür. Eylem { hata } döndürsün ya da metni Türkçeye çevir",
    (m, _, d) => ARAYUZ.test(d)],
  ["S06", "uyari", new RegExp(String.raw`<button\b(?![^>]*aria-label)${OZ}>\s*<(svg|[A-Z]\w*Icon)\b(?:[^]*?<\/\1>|${OZ}\/>)\s*<\/button>`, "g"), "Yalnız ikonlu, adı olmayan buton",
    (m, _, d) => ARAYUZ.test(d) && !/aria-label|title=/.test(m[0])],
];
// Önceden işaretli pazarlama izni: checkbox 3 satır çevresinde pazarlama kelimesiyle birlikte varsayılan işaretli.
const IZIN = new RegExp(sozluk.pazarlama_onay.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "iu");

const kok = process.argv[2];
if (!kok) { console.error("Kullanım: node statik.mjs <proje-klasörü> [--json dosya]"); process.exit(2); }
const jsonYolu = process.argv.includes("--json") ? process.argv[process.argv.indexOf("--json") + 1] : null;
const bulgular = [];
for (const dosya of dosyalar(kok)) {
  const metin = readFileSync(dosya, "utf8");
  const satirNo = (i) => metin.slice(0, i).split("\n").length;
  const yer = relative(kok, dosya).replace(/\\/g, "/");
  for (const [kural, seviye, desen, mesaj, suzgec] of KURAL) {
    desen.lastIndex = 0;
    for (const m of metin.matchAll(desen)) if (!suzgec || suzgec(m, metin, dosya)) bulgular.push({ kural, seviye, mesaj, yer: `${yer}:${satirNo(m.index)}`, ornek: m[0].replace(/\s+/g, " ").slice(0, 90) });
  }
  const satirlar = metin.split("\n");
  satirlar.forEach((s, i) => {
    if (!/type=["']checkbox["']/.test(s) && !/<Checkbox\b/.test(s)) return;
    const cevre = satirlar.slice(Math.max(0, i - 3), i + 4).join(" ");
    if (/\b(defaultChecked|checked)(=\{true\}|(?=[\s/>]))/.test(cevre) && IZIN.test(cevre))
      bulgular.push({ kural: "B11", seviye: "kritik", mesaj: "Pazarlama/bülten izni varsayılan olarak işaretli", yer: `${yer}:${i + 1}`, ornek: s.trim().slice(0, 90) });
  });
}

const say = (sev) => bulgular.filter((b) => b.seviye === sev).length;
for (const sev of ["kritik", "uyari", "bilgi"]) for (const b of bulgular.filter((b) => b.seviye === sev))
  console.log(`[${{ kritik: "KRİTİK", uyari: "UYARI", bilgi: "BİLGİ" }[sev]} ${b.kural}] ${b.yer}  ${b.mesaj}\n    ${b.ornek}\n    → ${KURALLAR[b.kural]?.cozum || ""}`);
console.log(`\nStatik tarama: ${dosyalar(kok).length} dosya · Kritik ${say("kritik")} · Uyarı ${say("uyari")} · Bilgi ${say("bilgi")}`);
if (jsonYolu) { mkdirSync(dirname(resolve(jsonYolu)), { recursive: true }); writeFileSync(jsonYolu, JSON.stringify(bulgular, null, 1), "utf8"); }
process.exit(say("kritik") ? 1 : 0);
