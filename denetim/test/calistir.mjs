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
async function denetle(sayfa) {
  const klasor = mkdtempSync(join(tmpdir(), "erisim-"));
  try {
    await promisify(execFile)("node", [join(BURASI, "../denetle.mjs"), `http://127.0.0.1:${port}/${sayfa}`, "--tara", "0", "--cikti", klasor, "--sessiz"]);
  } catch { /* kritik bulguda çıkış kodu 1 beklenir */ }
  return JSON.parse(readFileSync(join(klasor, "rapor.json"), "utf8"));
}

const kotu = await denetle("kotu.html");
const yakalanan = new Set(kotu.bulgular.map((b) => `${b.kural}:${b.seviye}`));
for (const beklenen of ["K03:kritik", "B12:kritik", "B06:kritik", "K01:kritik", "K01:uyari", "S06:kritik", "S06:uyari",
  "B13:uyari", "B04:uyari", "B02:uyari", "B01:uyari", "S02:uyari", "K09:uyari", "B08:uyari", "B09:uyari", "S12:kritik", "B10:uyari", "S10:uyari", "S07:uyari"]) {
  dogrula(yakalanan.has(beklenen), `kotu.html → ${beklenen}`);
}
const iyi = await denetle("iyi.html");
const iyiKritik = iyi.bulgular.filter((b) => b.seviye === "kritik");
dogrula(iyiKritik.length === 0, `iyi.html kritik vermiyor${iyiKritik.length ? ": " + iyiKritik.map((b) => b.kural + " " + b.mesaj).join(" | ") : ""}`);
console.log(`iyi.html puan: B ${iyi.puan.B} · S ${iyi.puan.S} · K ${iyi.puan.K}  (bulgu: ${iyi.bulgular.map((b) => b.kural + ":" + b.seviye).join(", ") || "yok"})`);
console.log(`kotu.html puan: B ${kotu.puan.B} · S ${kotu.puan.S} · K ${kotu.puan.K}`);

sunucu.close();
process.exit(hata ? 1 : 0);
