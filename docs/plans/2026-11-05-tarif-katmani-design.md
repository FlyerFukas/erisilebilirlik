# Tarif katmanı: bulgu → öneri kartı → onay → skill ile uygulama

5 Kasım 2026 · Durum: **ONAYLANDI (Furkan, 5 Kasım 2026)**

## Neden

Denetim bugün "sorun bu, çözüm bu" diyor; düzeltmeyi Claude kendi kafasına göre seçip uyguluyor. Aynı soruna bir gün bir yol, ertesi gün başka bir yol seçilebiliyor ve Furkan hangi skill'in kullanıldığını görmüyor. İstenen: her bulgu için **yazılı bir tarif** (hangi skill, gerekirse hangi MCP, hangi adımlar), Furkan'a **sade bir öneri kartı**, onaylarsa kartta yazan yolla uygulama.

## Hedefler

1. Her kuralın (48 kural) depoda yazılı bir tarifi olur: skill + komut, varsa MCP, adımlar, kart cümlesi.
2. Denetim bittiğinde bulgular öneri kartlarına dönüşür. Kartta kural kodu, teknik terim ve dolgu yoktur.
3. Furkan her kart için seçer: **Uygula · Başka yolla uygula · Atla**. Onaysız hiçbir şey değişmez.
4. Onaylanan kart, kartta yazan skill ile uygulanır; sonra denetim yeniden çalışır ve puan farkı gösterilir.
5. Aynı sorun her projede aynı yolla düzelir.

## Hedef dışı

- Onaysız otomatik düzeltme.
- WCAG uyumluluk denetimi (tanımımız bilişsel yük + sezgisel etkileşim + bilgi kokusu).
- Yeni skill ya da MCP aramak (bu iş 5 Kasım'da yapıldı, aşağıda).

## Başarısızlık sayılır (çalışsa bile)

- Kartta "B16", "S05", "LCP", "hiyerarşi" gibi kod ya da terim görünmesi.
- Kartın ne değişeceğini söylememesi ("iyileştirilecek" gibi belirsiz fiil).
- Tarifin projenin niyetiyle çatışması (ör. "sakin" bir üründe `bolder` önermek).

## Yaklaşımlar

| | Yol | Karar |
|---|---|---|
| **A** | Her kurala sabit, yazılı tarif; kartlar tariften üretilir | **Seçildi (Furkan, 5 Kasım).** Karar yazılı ve tutarlı. |
| B | Tarif yok, Claude o an seçer, sadece onay sorar | Elendi: "Claude kendi karar veriyor" sorunu sürer. |
| C | İşi Impeccable'ın `critique`/`audit` komutuna bırak | Elendi: kitaplardan çıkan kurallar devre dışı kalır, ölçüt WCAG ağırlıklı. |

## Parçalar

### 1. `denetim/tarifler.json` (yeni)
Kural başına bir kayıt:
```json
"B08": {
  "beceri": "ux-copy",            // metni yazan
  "uygulayan": "impeccable harden", // koda işleyen
  "mcp": null,                     // gerekiyorsa "context7" ya da "chrome-devtools"
  "adimlar": ["Hata mesajının geçtiği bileşeni bul", "ux-copy ile 'ne oldu + nasıl düzelir' metnini yaz", "Mesajı alanın yanına taşı", "Denetimi --etkilesim ile yeniden çalıştır"],
  "kart": "{sayfa} sayfasında hata mesajı ne yapılacağını söylemiyor. Öneri: mesajı \"{ornek_duzeltme}\" gibi, çözümü söyleyen bir cümleyle değiştirmek. Bunu metin yazma skill'iyle yazıp formun yanına koyarım."
}
```
`test/calistir.mjs` her kuralın tarifi olduğunu ve kart cümlesinde kural kodu geçmediğini sınar.

### 2. Rapor (`denetle.mjs`)
`rapor.json`'a `oneriler` dizisi eklenir: `{sayfa, sorun, oneri, beceri, mcp, degisecek, seviye}`. `rapor.md`'ye en üste "Öneri kartları" bölümü. Kritik bulgular önce. "Bilgi" seviyesindekiler kart olmaz, tek satırlık listede kalır.

### 3. Skill (`skill/erisilebilirlik/SKILL.md`, bölüm 3'e ek)
Denetim bitince Claude:
1. `rapor.json → oneriler`'i okur, projenin `erisim/niyet.md`'sine aykırı olanı eler.
2. Kartları **soru kutusuyla** sorar (bir seferde en çok 4 kart). Seçenekler: Uygula · Başka yolla uygula (Furkan yazar) · Atla.
3. Onaylananı kartta yazan skill'i çağırarak uygular. Proje talimatı ek skill istiyorsa (ör. Örnek Proje'da `commerce-digital`) onu da çağırır.
4. Değişen dosyaları `web-design-guidelines` ile tarar.
5. Denetimi yeniden çalıştırır, puan farkını ve rapor yolunu gösterir.

### 4. Kit
`araclar/projeye_kur.mjs` `tarifler.json`'u da kopyalar; beş projeye yeniden kurulur.

## Kural → skill eşlemesi (önerim, onayına)

| İhtiyaç | Kurallar | Yazan / uygulayan | MCP |
|---|---|---|---|
| Metin | B03, B04, B12, K01, K02, K03, K04, K06, K09, S06 | `ux-copy` → `impeccable clarify` | |
| Hata mesajı ve form | B05, B06, B07, B08, B10, B11, B14, B16, B17, S09 | `impeccable harden` (+ metin için `ux-copy`) | |
| Sadeleştirme | B01, B02, B09, B15, K08, S19 | `impeccable distill` | |
| Yerleşim ve hiyerarşi | S03, S08, S18 | `impeccable layout` | |
| Yazı ve renk | B18, S17 | `impeccable typeset`, renk için `accessibility-review` | |
| Geri bildirim ve durum | S01, S02, S04, S10, S13, S20 | `impeccable polish` | |
| Boş durum, ilk kullanım, yardım | K07, K10, S11, S16 | `impeccable onboard` | |
| Mobil | S07, S12 | `impeccable adapt` | |
| Hız | S14 | `impeccable optimize` | `chrome-devtools` |
| Tutarlılık | S05 | terim: `ux-copy` + `terimler.json`; görünüm: `impeccable extract` | |
| Kategoriler | K05 | `user-research` (kart sıralama) → `impeccable layout` | |
| Tarih, sayı biçimi | B13 | `impeccable harden` | `context7` (çerçeve belgesi) |
| Yeniden tasarım | S15 | skill yok: taban kıyası + `design-critique` | |
| İnsan testleri | Ö01-Ö08 | `user-research` | |

Kod değişikliği bir çerçevenin yeni sürümüne dokunuyorsa (Örnek Proje'daki Next.js gibi) her tarifte `context7` ile güncel belge okunur.

## 5 Kasım'da kurulanlar

Hepsi `~/.claude/skills/` altında, yalnızca talimat metni:
- `impeccable` (pbakaus/impeccable 4.8.0, Apache-2.0). İndirip her düzenlemede çalıştırdığı program ve kancaları **kurulmadı**; SKILL.md başına not eklendi.
- `web-design-guidelines` (vercel-labs/agent-skills).
- `ux-copy`, `design-critique`, `user-research`, `accessibility-review` (anthropics/knowledge-work-plugins/design, Apache-2.0). Eklentinin getirdiği 9 MCP kurulmadı.

**Onay bekleyen MCP'ler:** `context7` (uzak, kurulum yok) ve `chrome-devtools` (npx ile yerel). Otomatik güvenlik denetimi ekleme komutunu durdurdu; Furkan karar verecek. Tarifler MCP yoksa çalışmaya devam eder (S14: denetimin kendi açılış ölçümü; belge: WebFetch).

**Alınmayanlar:** UI UX Pro Max (estetik kütüphanesi, ücretli sürüme yönlendiriyor), Playwright MCP (denetim programı ve uygulama tarayıcısı aynı işi yapıyor), interface-design (Haziran'dan beri güncellenmemiş), Vercel writing-guidelines (İngilizce belge yazımı).

## Claude'un kendi kararları (işaretli)

- Kartlar soru kutusuyla sorulur, bir seferde en çok 4 kart (aracın sınırı).
- "Bilgi" seviyesi kart olmaz.
- Örnek Proje'nın CLAUDE.md'sindeki `design:ux-copy` gibi atıflar kurulan adlara (`ux-copy`) çevrilir.

## Uygulayana kalan

Kart cümlelerinin kural kural yazımı; `oneriler` alanının bulgu örneklerinden nasıl doldurulacağı.
