// Denetimin kendi sınaması: kotu.html beklenen kuralları yakalamalı, iyi.html kritik vermemeli,
// kurallar.mjs'deki her kimlik katalogda tanımlı olmalı.   npm test
import { createServer } from "node:http";
import { readFileSync, mkdtempSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { KURALLAR } from "../kurallar.mjs";

const BURASI = dirname(fileURLToPath(import.meta.url));
let hata = 0;
const dogrula = (kosul, mesaj) => { console.log(`${kosul ? "✓" : "✗"} ${mesaj}`); if (!kosul) hata++; };

const katalog = readFileSync(join(BURASI, "../../skill/erisilebilirlik/references/katalog.md"), "utf8");
const eksik = Object.keys(KURALLAR).filter((id) => !new RegExp(`^### ${id}\\b`, "m").test(katalog));
dogrula(!eksik.length, `her denetim kuralı katalogda var${eksik.length ? ": eksik " + eksik.join(",") : ""}`);

const sunucu = createServer((istek, yanit) => {
  const ad = istek.url === "/" ? "iyi.html" : istek.url.slice(1);
  try { const icerik = readFileSync(join(BURASI, ad)); yanit.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(icerik); }
  catch { yanit.writeHead(404).end("<title>Bulunamadı</title><h1>Bulunamadı</h1>"); }
}).listen(0);
const port = sunucu.address().port;

// execFileSync olay döngüsünü kilitler ve aynı süreçteki sunucu yanıt veremez; eşzamansız çalıştır.
async function denetle(sayfa, ek = []) {
  const klasor = mkdtempSync(join(tmpdir(), "erisim-"));
  try {
    await promisify(execFile)("node", [join(BURASI, "../denetle.mjs"), `http://127.0.0.1:${port}/${sayfa}`, "--tara", "0", "--cikti", klasor, "--sessiz", ...ek]);
  } catch { /* kritik bulguda çıkış kodu 1 beklenir */ }
  return JSON.parse(readFileSync(join(klasor, "rapor.json"), "utf8"));
}

const kotu = await denetle("kotu.html", ["--terimler", join(BURASI, "terimler.json")]);
const yakalanan = new Set(kotu.bulgular.map((b) => `${b.kural}:${b.seviye}`));
for (const beklenen of ["K03:kritik", "B12:kritik", "B06:kritik", "K01:kritik", "K01:uyari", "S06:kritik", "S06:uyari",
  "B13:uyari", "B04:uyari", "B02:uyari", "B01:uyari", "S02:uyari", "K09:uyari", "B08:uyari", "B09:uyari", "S12:kritik", "B10:uyari", "S10:uyari", "S07:uyari",
  // katalog v0.2
  "B03:uyari", "B04:bilgi", "B05:uyari", "B07:uyari", "B09:bilgi", "B11:kritik", "B13:bilgi", "B14:uyari", "B16:bilgi", "B18:uyari", "B18:bilgi",
  "S03:uyari", "S05:uyari", "S08:uyari", "S08:bilgi", "S13:uyari", "S17:uyari", "S19:bilgi", "K06:bilgi", "K10:uyari"]) {
  dogrula(yakalanan.has(beklenen), `kotu.html → ${beklenen}`);
}
dogrula(kotu.bulgular.some((b) => b.kural === "S18"), "kotu.html → S18 (sonradan eklenen blok düzeni kaydırıyor)");
// Aynı kuralın farklı denetimleri tek tek: mesajın ayırt edici parçası aranır.
const mesajVar = (rapor, kural, parca) => rapor.bulgular.some((b) => b.kural === kural && b.mesaj.includes(parca));
for (const [kural, parca] of [["B04", "Türkçe karakteri bozulmuş"], ["B04", "Edilgen"], ["B04", "Açıklanmamış kısaltma"], ["B04", "50 kelimeden uzun"],
  ["B04", "Tamamı büyük harf"], ["B04", "Roma rakamı"], ["B05", "yapıştırma"], ["B05", 'autocomplete="off"'], ["B05", "CAPTCHA"],
  ["B07", "type=number"], ["B07", "deseni"], ["B08", "kod gösteriyor"], ["B09", "kendiliğinden yenileniyor"], ["B09", "uyarı kutusu"],
  ["B18", "Küçük ve soluk"], ["B18", "Görsel zemin"], ["B18", "yazı tipi ailesi"], ["B18", "16px'ten küçük"], ["B18", "Satır aralığı dar"],
  ["B18", "Satır çok uzun"], ["B18", "ünlem"], ["S02", "Çerçevesiz"], ["S02", "bağlantı renginde"], ["S08", "düzeyi atlıyor"], ["S08", "yüzüyor"],
  ["S10", "işaretli değil"], ["K10", "zorunlu alan"], ["K10", "hiçbirinde yardım"], ["S05", "terim sözlüğünde"]]) {
  dogrula(mesajVar(kotu, kural, parca), `kotu.html → ${kural} "${parca}"`);
}

const kotu2 = await denetle("kotu2.html");
for (const [kural, parca] of [["B13", "dili belirtilmemiş"], ["S08", "belirgin büyük"], ["S10", "zayıf"], ["S10", "breadcrumb"], ["K10", "zorunlu alan"], ["S17", "anlamıyla çelişiyor"], ["K07", "yalnız \"Veri yok\""], ["K07", "ilk adımı göstermiyor"], ["K07", "boş tablo"]]) {
  dogrula(mesajVar(kotu2, kural, parca), `kotu2.html → ${kural} "${parca}"`);
}
dogrula(!mesajVar(kotu2, "K10", "hiçbirinde yardım"), "kotu2.html → e-posta bağlantısı yardım sayılıyor (K10 site geneli yok)");
// Etkileşim senaryosu (--etkilesim): yazma istekleri kesilir, form gerçekten gönderilir.
const formKotu = await denetle("form-kotu.html", ["--etkilesim"]);
for (const [kural, parca] of [["B08", "hiçbir hata mesajı görünmedi"], ["B08", "girilen veri silindi"], ["B08", "doğrulama balonu"], ["S04", "1 sn içinde"]]) {
  dogrula(mesajVar(formKotu, kural, parca), `form-kotu.html (etkileşim) → ${kural} "${parca}"`);
}
const formIyi = await denetle("form-iyi.html", ["--etkilesim"]);
const formIyiSorun = formIyi.bulgular.filter((b) => b.sayfalar.some((y) => y.includes("etkileşim")));
dogrula(formIyiSorun.length === 0, `form-iyi.html (etkileşim) bulgu vermiyor${formIyiSorun.length ? ": " + formIyiSorun.map((b) => b.kural + " " + b.mesaj).join(" | ") : ""}`);

// Statik tarama: kaynak koddaki kalıplar (giriş arkası ekranlar da kapsanır).
async function statik(klasor) {
  const json = join(mkdtempSync(join(tmpdir(), "erisim-statik-")), "s.json");
  let kod = 0;
  try { await promisify(execFile)("node", [join(BURASI, "../statik.mjs"), join(BURASI, "statik", klasor), "--json", json]); } catch (h) { kod = h.code; }
  return { kod, bulgular: JSON.parse(readFileSync(json, "utf8")) };
}
const sKotu = await statik("kotu");
const sKural = new Set(sKotu.bulgular.map((b) => `${b.kural}:${b.seviye}`));
for (const beklenen of ["K01:kritik", "K01:uyari", "B11:kritik", "B13:uyari", "B05:uyari", "B09:uyari", "B12:uyari", "B12:bilgi", "S06:uyari"]) {
  dogrula(sKural.has(beklenen), `statik/kotu → ${beklenen}`);
}
dogrula(sKotu.kod === 1, "statik/kotu kritik bulguda çıkış kodu 1");
const sIyi = await statik("iyi");
dogrula(sIyi.kod === 0 && sIyi.bulgular.length === 0, `statik/iyi bulgu vermiyor${sIyi.bulgular.length ? ": " + sIyi.bulgular.map((b) => b.kural + " " + b.ornek).join(" | ") : ""}`);

const iyi = await denetle("iyi.html");
const iyiKritik = iyi.bulgular.filter((b) => b.seviye !== "bilgi");
dogrula(iyiKritik.length === 0, `iyi.html kritik ve uyarı vermiyor${iyiKritik.length ? ": " + iyiKritik.map((b) => b.kural + " " + b.mesaj).join(" | ") : ""}`);
console.log(`iyi.html puan: B ${iyi.puan.B} · S ${iyi.puan.S} · K ${iyi.puan.K}  (bulgu: ${iyi.bulgular.map((b) => b.kural + ":" + b.seviye).join(", ") || "yok"})`);
console.log(`kotu.html puan: B ${kotu.puan.B} · S ${kotu.puan.S} · K ${kotu.puan.K}`);

sunucu.close();
process.exit(hata ? 1 : 0);
