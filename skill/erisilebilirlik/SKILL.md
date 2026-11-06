---
name: erisilebilirlik
description: "Son kullanıcı erişilebilirliği: ürünün kılavuz okumadan, destek aramadan, zihinsel yorgunluk yaşamadan anlaşılması. Bilişsel erişilebilirlik (cognitive accessibility, cognitive load), sezgisel etkileşim (intuitive interaction, affordance, mental model) ve bilgi kokusu (information scent, information architecture) kuralları + otomatik sayfa denetimi. Kullanıcıya görünen HER arayüz işinde çağır: yeni sayfa/ekran/bileşen, form, menü/navigasyon, onboarding, hata mesajı, boş durum, ayarlar, buton/etiket metni, mikro metin, arayüz incelemesi, 'karmaşık', 'kullanıcı anlamıyor', 'sade', 'kolay kullanım', 'UX', 'kullanılabilirlik', 'usability'. Arayüz değişikliği bitince denetimi çalıştırmadan iş bitmiş sayılmaz."
---

# Erişilebilirlik

**Tanım (Furkan'ın):** nihai kullanıcı ürünü kılavuz okumadan, destek hattını aramadan, zihinsel yorgunluk yaşamadan anlar ve kullanır. Aşırı karmaşık bir sistem herkese satılamaz ve kullanılmaz. Bu yaşlılara ya da engellilere özel bir konu değil; **her kullanıcı** içindir. WCAG değildir.

Üç boyut, her kural bir kimlik taşır (tam metin, kaynak ve sayfa: `references/katalog.md`, 48 kural + 8 ölçüm):

- **B · Bilişsel yük:** anlamak ne kadar çaba istiyor?
- **S · Sezgisel etkileşim:** nasıl kullanılacağı ilk bakışta belli mi?
- **K · Bilgi kokusu:** tıklamadan önce doğru yere gideceğimden emin miyim?

Kaynak deposu: `C:\Users\furka\Music\Erisilebilirlik` (önce `HANDOFF.md` en üstteki günlük).

> **İstisna, ticari proje (`Music\ticari-proje`):** bu skill ve denetim orada isteğe bağlıdır. Yalnızca Furkan açıkça isterse çalıştır; "zorunlu" yazan her adım orada geçersizdir (6 Kasım 2026, KARARLAR K-11).

## Beş temel ilke (her kararın arkasında)

1. **Senin suçun değil.** Kullanıcı takıldıysa ürün kusurludur; "kullanıcı hatası" diye bir kayıt yok.
2. **Talimat gerekiyorsa tasarım başarısız.** "Buraya tıklayın", "Lütfen dikkat" yazmak zorunda kalıyorsan önce tasarımı düzelt.
3. **Hata için tasarla.** İnsan hata yapar: önle, fark ettir, geri aldır.
4. **Denge.** Sadeleştirme yararlılığı kesmez; işlevi atıp "kolay" yapmak hedef değil. Uzman için hızlandırıcı, acemiye görünmez (B15).
5. **Kapsam yaş değil deneyim.** Seyrek kullanan, yorgun, stresli, bölünen herkes için.

**Düzeltme kuralı:** önce bir şey **kaldır**, sonra ince ayar yap, yeniden tasarım en son.
**Önem:** kritik = görevi engeller, veri kaybettirir ya da güveni yıkar · uyarı = zorlaştırır · bilgi = olası sorun.

## 0. Projede ilk kez

- Projede `erisim/` klasörü yoksa kurmayı öner: `node C:/Users/furka/Music/Erisilebilirlik/araclar/projeye_kur.mjs <proje>` (`--ci` ile Vercel önizlemesine GitHub Action). Kopya denetim, `npm run erisim`, terim sözlüğü, niyet dosyası, `.gitignore`, CLAUDE.md bölümü gelir. Projeye dosya eklediği için Furkan'a sor.
- Varsa **önce oku:** `erisim/niyet.md` (kim için, 3 kilit görev, kullanıcının kelimeleri) ve `erisim/terimler.json` (S05: aynı şeye her yerde aynı ad).

## 1. Yazmadan önce: üç soru

Cevabı kodun yanında bir satır yorum ya da PR notu olarak bırak:

1. **Bu ekranın tek amacı ne?** Bir cümle. Cevap "ve" içeriyorsa ekran ikiye bölünmeli (B01, B10).
2. **Kullanıcı buraya hangi kelimeyle gelir?** O kelime h1'de, sekme başlığında ve onu getiren bağlantıda aynı olmalı (K01, K04).
3. **İlk kez gören biri ilk neye tıklar?** O şey en belirgin öğe değilse hiyerarşi yanlış (B01, S08).

## 2. Yazarken: en sık ve en pahalı on altı kural

| # | Kural | Kısa |
|---|---|---|
| B01 | Tek birincil eylem | Bir dolgulu buton, gerisi ikincil |
| B02 | Seçeneği sınırla | İlk ekranda 3-5 şey, menü ≤ 5-7, gerisi aşamalı |
| B04 | Sade dil | ≤ 20 kelimelik cümle, etken çatı, jargon ve açıklamasız kısaltma yok, Türkçe karakter |
| B06 | Görünür etiket | Placeholder etiket değildir |
| B08 | Hata çözüm söyler | Ne oldu + nasıl düzelir, alanın yanında, kod yok |
| B11 | Güvenli varsayılan | Önerileni seç; pazarlama/veri izni **asla** önceden işaretli değil |
| B12 | Ham çıktı sızmaz | undefined/null/NaN/Invalid Date asla görünmez |
| B13 | Yerel biçim | `Intl.*("tr-TR")`: 18 Ekim 2026, 1.250,50 TL; `<html lang="tr">` |
| B14 | Geri alınabilir | Onay penceresi yerine "Silindi · Geri al"; yıkıcı buton ayrı görünür |
| B16 | Bildiğini sordurma | `autocomplete`, devralınan adres, korunan taslak ve filtre |
| B18 | Okunur yazı | Mobil gövde ≥ 16 px, kontrast, satır aralığı ≥ 1,4, satır ≤ 70ch |
| S01 | Alışkanlığa uy | Logo sol üst → ana sayfa; standart yerler |
| S04 | Anında geri bildirim | Yükleniyor / Kaydedildi / Geri al |
| S13 | Acil çıkış | Her pencere ve akışta Kapat/Vazgeç; geri tuşu iş kaybettirmez |
| K01 | Etiket hedefi söyler | "Devamı/Gönder/Tıkla" yerine "Raporu indir" |
| K03 | Neredeyim? | Anlamlı `<title>Sayfa · Site</title>`, tek h1, belirgin işaretli menü |

Ekran tipine göre hazır kalıplar (form, giriş/kayıt, hata, boş durum, onboarding, navigasyon, ödeme/odak akışı, tarih ve hatırlatma, bekleme, yıkıcı eylem, ayarlar, liste/tablo, fiyat, yardım): `references/kaliplar.md`.

## 3. Bitirirken: denetim (zorunlu)

Arayüz değişikliği çalışan bir sayfada görünür hâle gelince:

```bash
npm run erisim -- http://localhost:3000 /degisen-sayfa --tara 4
# projede erisim/ yoksa:
node C:/Users/furka/Music/Erisilebilirlik/denetim/denetle.mjs http://localhost:3000 /degisen-sayfa --tara 4 --cikti erisim-rapor
```

- Masaüstü (1366 px) ve mobil (390 px) açar, 4 bağlantı daha gezer, `erisim-rapor/rapor.md` + ekran görüntüsü yazar. Düzen kayması (CLS), yüklenme (LCP), sayfa ağırlığı da ölçülür.
- **Form ya da gönderim değiştiyse `--etkilesim` ekle:** form gerçekten gönderilir (yazma istekleri ağda kesilir, canlı sitede bile kayıt oluşmaz); boş gönderimde hata çıkıyor mu, alanın yanında mı, ağ hatasında veri korunuyor mu, 1 sn içinde tepki var mı (B08, S04).
- **Kod taraması:** `npm run erisim:statik` (ya da `node C:/Users/furka/Music/Erisilebilirlik/denetim/statik.mjs <proje>`): sunucu ve giriş gerekmeden kaynak kodda belirsiz etiket, önceden işaretli izin, dilsiz tarih biçimi, yapıştırma engeli, adsız ikon buton, ham hata mesajı. Giriş arkası ekranları da kapsar.
- **Kritik bulgu varsa çıkış kodu 1**: iş bitmemiştir. Düzeltme yolu aşağıdaki öneri kartlarıdır; kendi kafana göre düzeltme seçme.
- Furkan'a **kanıt** olarak üç boyutun puanını, kritik/uyarı sayısını ve rapor yolunu göster. `erisim/taban.json` varsa tabana göre değişimi de göster. "Sade oldu" deme; raporu göster.
- **Giriş arkasındaki ekranlar:** `--oturum erisim/oturum.json` (oluşturma: `npx --prefix erisim/denetim playwright-core codegen --channel msedge --save-storage=erisim/oturum.json <adres>`; giriş Furkan'ın işidir, oturum dosyası asla commit'lenmez).
- İlk denetimde `--taban-yaz` ile taban çizgisi; terim sözlüğü `erisim/terimler.json` kendiliğinden okunur.

## 3a. Öneri kartları: önce onay, sonra kartta yazan skill ile uygulama

Denetim `rapor.json → oneriler` dizisini yazar (kritik ve uyarı, kural başına bir kart). Her kartın tarifi `denetim/tarifler.json`'da: hangi skill (`beceri`, sırayla), gerekirse hangi MCP, hangi adımlar. **Düzeltme yolunu sen seçmezsin; tarif seçer, Furkan onaylar.**

1. **Ele:** `erisim/niyet.md`'yi oku. Niyet sıfatlarıyla çatışan kartı gösterme (ör. "sakin" bir üründe dikkat çekici animasyon); neden elediğini tek satırla söyle.
2. **Sor:** kartları soru kutusuyla (AskUserQuestion) sor, bir seferde en çok 4 kart, önemliler önce. Soru metni kartın `kart` alanıdır: hangi sayfa, sorun ne, ne değişecek, hangi skill'le. Kural kodu, teknik terim, dolgu yok. Seçenekler:
   - **Uygula**: kartta yazan yolla.
   - **Başka yolla uygula**: Furkan ne istediğini yazar (Other).
   - **Atla**: dokunma; rapora "atlandı" diye not düş.
   Somut metin değişikliğinde kartın altına önce/sonra örneğini koy (ör. "Gönder" → "Başvuruyu gönder").
3. **Uygula:** onaylanan her kart için `beceri` listesindeki skill'leri sırayla Skill aracıyla çağır (ör. `ux-copy` metni yazar, `impeccable` `clarify` ile işler); `mcp` yazıyorsa o MCP'yi kullan, kurulu değilse tarifteki yedek yolu izle. Proje talimatı (CLAUDE.md) ek skill istiyorsa onu da çağır. Kartın kapsamı dışına çıkma.
4. **Tara:** değişen dosyaları `web-design-guidelines` ile tara; yalnızca bu değişikliğin yarattığı sorunu düzelt.
5. **Kanıtla:** denetimi yeniden çalıştır (form değiştiyse `--etkilesim`), puan farkını, kapanan kartları ve rapor yolunu göster.

Tarifi olmayan bir sorun görürsen (elle kontrol, insan testi) aynı biçimde kart yaz ve sor; tarifi `tarifler.json`'a eklemeyi öner.

## 4. Elle kontrol (otomatik denetim bunları göremez)

Her yeni ekran için, ekran görüntüsüne bakarak:

- [ ] **5 saniye (Ö02):** ekranı 5 sn gören biri amacını ve ana eylemi söyleyebilir mi?
- [ ] **Gövde testi (Ö04/K03):** site, sayfa, bölümler, bulunulan yer, arama belli mi?
- [ ] **Boş durum (K07):** hiç verisi olmayan yeni kullanıcı ne görüyor, ilk adım ne?
- [ ] **Hata yolu (B07/B08):** en olası yanlış girişte ne oluyor, girilen veri korunuyor mu?
- [ ] **Bölünme (B16/S13):** yarıda bırakıp dönen ya da geri tuşuna basan iş kaybediyor mu?
- [ ] **İnsan bunu yapar mıydı?** Yardımsever bir tezgâhtar aynı şeyi müşteriye yapar mıydı (aynı bilgiyi iki kez sormak, "hata 401" demek, fiyatı sona saklamak)? (B17)

Önemli sürümden önce ve ayda bir 3 gerçek kullanıcıyla görev testi: `references/test-protokolleri.md` (Ö01, hazır Türkçe oturum metni ve gözlem formu).

## 5. İnceleme istenirse çıktı biçimi

```
Puan: B __ · S __ · K __   (taban: __)   rapor: <yol>
Kritik:  [KURAL] sayfa: sorun → en küçük düzeltme
Uyarı:   ...
Elle:    5 sn / gövde / boş durum / hata yolu / bölünme: geçti/kaldı + not
En büyük tek kazanç: <tek değişiklik, neden>
```

## Sınırlar

- Bu skill WCAG uygunluk denetimi değildir. Kesiştiği yerler (etiket, dokunma hedefi, ikon adı, küçük ve soluk yazı) burada da yakalanır, çünkü onlar herkesin bilişsel yükünü artırır.
- Davranışsal tasarım (ikna, alışkanlık, fiyat) için `commerce-digital`. Akıllı varsayılan (B11) ve sadeleştirme karanlık desene dönmemeli: oradaki etik listesi geçerli.
- Eşikler başlangıç değeridir (`denetim/kurallar.mjs → ESIK`); kalibrasyon kaydı depodaki `KARARLAR.md`'de. Yanlış pozitif görürsen oraya yaz, eşiği tek projeye göre değiştirme.
