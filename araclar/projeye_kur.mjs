#!/usr/bin/env node
// Erişilebilirlik sistemini bir projeye kurar ya da günceller. Tekrar çalıştırmak güvenlidir:
// denetim kopyası yenilenir, projenin doldurduğu dosyalara (terimler, niyet, taban) dokunulmaz.
//
//   node araclar/projeye_kur.mjs <proje-klasörü>          kur / güncelle
//   node araclar/projeye_kur.mjs <proje-klasörü> --ci     + GitHub Action (Vercel önizlemesine karşı)
//   node araclar/projeye_kur.mjs <proje-klasörü> --dene   yalnız ne yapacağını yaz, dosyaya dokunma
//
// Projede oluşanlar:
//   erisim/denetim/        denetim aracının kopyası (kendi package.json'ı; projenin bağımlılıklarına karışmaz)
//   erisim/terimler.json   projenin terim sözlüğü (S05): kullanılacak ve kullanılmayacak kelimeler
//   erisim/niyet.md        ürün kimin için, hangi 3 görev için (Ö01 senaryoları ve K02 buradan çıkar)
//   package.json           "erisim" ve "erisim:kur" betikleri
//   .gitignore             rapor, node_modules ve oturum dosyası (çerez içerir) dışarıda
//   CLAUDE.md              erişilebilirlik bölümü (Claude her arayüz işinde skill + denetim)
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DENETIM_DOSYALARI = ["denetle.mjs", "olcumler.js", "kurallar.mjs", "sozluk.json"];
const PLAYWRIGHT = "1.64.1";

const arg = process.argv.slice(2);
const proje = arg.find((x) => !x.startsWith("--"));
const ci = arg.includes("--ci"), dene = arg.includes("--dene");
if (!proje || !existsSync(proje)) {
  console.error("Kullanım: node araclar/projeye_kur.mjs <proje-klasörü> [--ci] [--dene]");
  process.exit(2);
}
const kok = resolve(proje);
const yapilan = [];
const yaz = (yol, icerik, neden) => {
  if (existsSync(yol) && readFileSync(yol, "utf8") === icerik) return yapilan.push(`aynı      ${relative(kok, yol)}`);
  yapilan.push(`${existsSync(yol) ? "güncelle" : "oluştur "} ${relative(kok, yol)}  (${neden})`);
  if (dene) return;
  mkdirSync(dirname(yol), { recursive: true });
  writeFileSync(yol, icerik, "utf8");
};
const yoksaYaz = (yol, icerik, neden) => { if (existsSync(yol)) yapilan.push(`dokunma   ${relative(kok, yol)}  (proje dolduruyor)`); else yaz(yol, icerik, neden); };

// 1 · Denetim kopyası + sürüm damgası
let surum = "bilinmiyor";
try { surum = execFileSync("git", ["-C", DEPO, "log", "-1", "--format=%h %cs"], { encoding: "utf8" }).trim(); } catch { /* git yoksa damgasız */ }
for (const d of DENETIM_DOSYALARI) {
  const hedef = join(kok, "erisim", "denetim", d);
  yapilan.push(`kopyala   ${relative(kok, hedef)}`);
  if (!dene) { mkdirSync(dirname(hedef), { recursive: true }); copyFileSync(join(DEPO, "denetim", d), hedef); }
}
yaz(join(kok, "erisim", "denetim", "package.json"), JSON.stringify({
  name: "erisim-denetim", private: true, type: "module",
  description: "Erişilebilirlik denetimi (kopya). Kaynağı: Music/Erisilebilirlik/denetim. Elle düzenleme, projeye_kur.mjs ile güncelle.",
  dependencies: { "playwright-core": PLAYWRIGHT },
}, null, 2) + "\n", "denetim bağımlılığı projeden ayrı");
yaz(join(kok, "erisim", "denetim", "SURUM"), `${surum}\n`, "hangi sürümün kopyası");

// 2 · Projenin dolduracağı şablonlar
yoksaYaz(join(kok, "erisim", "terimler.json"), JSON.stringify({
  _aciklama: "S05 terim sözlüğü. 'terimler': arayüzde kullanılan kavramlar ve tek cümlelik anlamları (her yerde aynı adla). 'kullanma': arayüzde görünmemesi gereken kelime → yerine kullanılacak. Denetim 'kullanma' listesini her sayfada arar.",
  terimler: {},
  kullanma: {},
}, null, 2) + "\n", "terim sözlüğü şablonu");
yoksaYaz(join(kok, "erisim", "niyet.md"), `# Ürün niyeti

Bu dosya arayüz kararlarının dayanağıdır. Claude her arayüz işinde buna bakar; Ö01 kullanıcı testinin görevleri buradan çıkar.

## Kim için
<!-- Tek cümle: kullanıcı kim, ürünü hangi durumda açıyor? (yaş değil, deneyim ve bağlam) -->

## Kilit görevler (en fazla 3)
<!-- Kullanıcının asıl gelme sebebi. Kullanıcının kelimeleriyle yaz, arayüzün kelimeleriyle değil. -->
1.
2.
3.

## Kullanıcının kelimeleri
<!-- Kullanıcı bu şeylere ne diyor? Menü ve etiketler buradan seçilir (K02). -->

## Asla
<!-- Bu üründe kabul edilmeyecek şeyler, ör. "kayıt olmadan fiyat görülemez olmasın". -->
`, "ürün niyeti şablonu");

// 3 · package.json betikleri
const pj = join(kok, "package.json");
if (existsSync(pj)) {
  const ham = readFileSync(pj, "utf8");
  const girinti = (ham.match(/^[ \t]+(?=")/m) || ["  "])[0];
  const p = JSON.parse(ham);
  p.scripts ||= {};
  const istenen = {
    "erisim:kur": "npm install --prefix erisim/denetim --no-audit --no-fund",
    erisim: "node erisim/denetim/denetle.mjs",
  };
  if (Object.entries(istenen).some(([k, v]) => p.scripts[k] !== v)) {
    Object.assign(p.scripts, istenen);
    yaz(pj, JSON.stringify(p, null, girinti) + (ham.endsWith("\n") ? "\n" : ""), "erisim betikleri");
  } else yapilan.push("dokunma   package.json  (betikler zaten var)");
} else yapilan.push("atla      package.json yok: denetimi `node erisim/denetim/denetle.mjs <adres>` ile çalıştır");

// 4 · .gitignore
const gi = join(kok, ".gitignore");
const satirlar = ["erisim-rapor/", "erisim/denetim/node_modules/", "erisim/oturum*.json"];
const mevcut = existsSync(gi) ? readFileSync(gi, "utf8") : "";
const eksik = satirlar.filter((s) => !mevcut.split(/\r?\n/).includes(s));
if (eksik.length) yaz(gi, `${mevcut}${mevcut && !mevcut.endsWith("\n") ? "\n" : ""}\n# Erişilebilirlik denetimi (oturum dosyası çerez içerir, asla commit'lenmez)\n${eksik.join("\n")}\n`, `${eksik.length} satır`);
else yapilan.push("dokunma   .gitignore  (satırlar var)");

// 5 · CLAUDE.md bölümü
const cm = join(kok, "CLAUDE.md");
const BASLIK = "## Erişilebilirlik (son kullanıcı)";
const bolum = `${BASLIK}

Erişilebilirlik burada bilişsel yük, sezgisel etkileşim ve bilgi kokusu demek: kullanıcı ürünü kılavuzsuz, destek aramadan, yorulmadan anlasın (WCAG değil).

- Kullanıcıya görünen her iş (sayfa, form, menü, metin, hata, boş durum) öncesinde \`erisilebilirlik\` skill'ini çağır; ürün niyeti \`erisim/niyet.md\`, terimler \`erisim/terimler.json\`.
- İş bitince denetim: \`npm run erisim -- <adres> --tara 4\` (ilk kez: \`npm run erisim:kur\`). Kritik bulgu varsa iş bitmemiştir. Puanı ve rapor yolunu kanıt olarak göster.
- Giriş arkasındaki ekranlar: \`npx --prefix erisim/denetim playwright-core codegen --channel msedge --save-storage=erisim/oturum.json <adres>\` ile giriş yap, sonra \`--oturum erisim/oturum.json\`. Oturum dosyası commit'lenmez.
- Taban çizgisi: ilk denetimde \`--taban-yaz\`; sonraki raporlar tabana göre değişimi gösterir.
- Denetim kopyasını elle düzenleme; güncellemek için Erisilebilirlik deposunda \`node araclar/projeye_kur.mjs <bu proje>\`.
`;
const cmMevcut = existsSync(cm) ? readFileSync(cm, "utf8") : "";
if (!cmMevcut.includes(BASLIK)) yaz(cm, `${cmMevcut}${cmMevcut ? (cmMevcut.endsWith("\n") ? "\n" : "\n\n") : ""}${bolum}`, "erişilebilirlik bölümü");
else yapilan.push("dokunma   CLAUDE.md  (bölüm var)");

// 6 · İsteğe bağlı CI: Vercel'in GitHub'a bildirdiği her başarılı önizleme dağıtımında denetim
if (ci) yaz(join(kok, ".github", "workflows", "erisim.yml"), `# Erişilebilirlik denetimi: Vercel önizlemesi hazır olunca çalışır, kritik bulguda kırmızı.
name: erisim
on: deployment_status
jobs:
  denetim:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install --prefix erisim/denetim --no-audit --no-fund
      - run: npx --prefix erisim/denetim playwright-core install --with-deps chromium
      - run: node erisim/denetim/denetle.mjs "\${{ github.event.deployment_status.target_url }}" --tara 4 --cikti erisim-rapor
      - if: always()
        uses: actions/upload-artifact@v4
        with:
          name: erisim-rapor
          path: erisim-rapor/
`, "Vercel önizlemesine karşı denetim");

console.log(`${dene ? "[deneme] " : ""}Proje: ${kok}\nDenetim sürümü: ${surum}\n`);
for (const y of yapilan) console.log(`  ${y}`);
if (!dene) console.log(`\nSıradaki adımlar:\n  1. erisim/niyet.md ve erisim/terimler.json'u doldur\n  2. npm run erisim:kur\n  3. npm run erisim -- <adres> --tara 4 --taban-yaz`);
