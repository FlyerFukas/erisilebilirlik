---
name: erisilebilirlik
description: "Son kullanıcı erişilebilirliği: ürünün kılavuz okumadan, destek aramadan, zihinsel yorgunluk yaşamadan anlaşılması. Bilişsel erişilebilirlik (cognitive accessibility, cognitive load), sezgisel etkileşim (intuitive interaction, affordance, mental model) ve bilgi kokusu (information scent, information architecture) kuralları + otomatik sayfa denetimi. Kullanıcıya görünen HER arayüz işinde çağır: yeni sayfa/ekran/bileşen, form, menü/navigasyon, onboarding, hata mesajı, boş durum, ayarlar, buton/etiket metni, mikro metin, arayüz incelemesi, 'karmaşık', 'kullanıcı anlamıyor', 'sade', 'kolay kullanım', 'UX', 'kullanılabilirlik', 'usability'. Arayüz değişikliği bitince denetimi çalıştırmadan iş bitmiş sayılmaz."
---

# Erişilebilirlik

**Tanım (Furkan'ın):** nihai kullanıcı ürünü kılavuz okumadan, destek hattını aramadan, zihinsel yorgunluk yaşamadan anlar ve kullanır. Aşırı karmaşık bir sistem herkese satılamaz ve kullanılmaz. Bu yaşlılar ya da engellilere özel bir konu değil; **her kullanıcı** içindir.

Üç boyut, her kural bir kimlik taşır (tam metin, kaynak ve sayfa: `references/katalog.md`):

- **B · Bilişsel yük:** anlamak ne kadar çaba istiyor?
- **S · Sezgisel etkileşim:** nasıl kullanılacağı ilk bakışta belli mi?
- **K · Bilgi kokusu:** tıklamadan önce doğru yere gideceğimden emin miyim?

Kaynak deposu: `C:\Users\furka\Music\Erisilebilirlik` (önce `HANDOFF.md` en üstteki günlük).

## 1. Yazmadan önce: üç soru

Ekranı/bileşeni yazmaya başlamadan cevapla, cevabı kodun yanında bir satır yorum ya da PR notu olarak bırak:

1. **Bu ekranın tek amacı ne?** Bir cümle. Cevap "ve" içeriyorsa ekran ikiye bölünmeli (B01, B10).
2. **Kullanıcı buraya hangi kelimeyle gelir?** O kelime h1'de, sekme başlığında ve onu getiren bağlantıda aynı olmalı (K01, K04).
3. **İlk kez gören biri ilk neye tıklar?** O şey en belirgin öğe değilse hiyerarşi yanlış (B01, S08).

## 2. Yazarken: on iki kural (ihlali en sık ve en pahalı olanlar)

| # | Kural | Kısa |
|---|---|---|
| B01 | Tek birincil eylem | Bir dolgulu buton, gerisi ikincil |
| B02 | Seçeneği sınırla | İlk ekranda 3-5 şey, gerisi aşamalı |
| B04 | Sade dil | ≤ 20 kelimelik cümle, jargon yok, kullanıcının kelimesi |
| B06 | Görünür etiket | Placeholder etiket değildir |
| B08 | Hata çözüm söyler | Ne oldu + nasıl düzelir, alanın yanında |
| B12 | Ham çıktı sızmaz | undefined/null/NaN/Invalid Date asla görünmez |
| B13 | Yerel biçim | `Intl.*("tr-TR")`: 18 Ekim 2026, 1.250,50 TL |
| S01 | Alışkanlığa uy | Logo sol üst → ana sayfa; standart yerler |
| S04 | Anında geri bildirim | Yükleniyor / Kaydedildi / Geri al |
| S06 | İkon tek konuşmaz | Evrensel olmayan ikonun yanında yazı |
| K01 | Etiket hedefi söyler | "Devamı/Gönder/Tıkla" yerine "Raporu indir" |
| K03 | Neredeyim? | Anlamlı `<title>Sayfa · Site</title>`, tek h1, işaretli menü |

Ekran tipine göre hazır kalıplar (form, hata, boş durum, onboarding, navigasyon, ayarlar, liste/tablo, fiyat): `references/kaliplar.md`.

## 3. Bitirirken: denetim (zorunlu)

Arayüz değişikliği çalışan bir sayfada görünür hâle gelince:

```bash
node C:/Users/furka/Music/Erisilebilirlik/denetim/denetle.mjs http://localhost:3000 /degisen-sayfa --tara 4 --cikti erisim-rapor
```

- Masaüstü (1366 px) ve mobil (390 px) açar, sayfadan 4 bağlantı daha gezer, `erisim-rapor/rapor.md` + ekran görüntüsü yazar.
- **Kritik bulgu varsa çıkış kodu 1**: iş bitmemiştir, düzelt ve yeniden çalıştır.
- Uyarıları tek tek değerlendir: düzelt ya da neden bilinçli olduğunu bir satırla yaz.
- Furkan'a **kanıt** olarak üç boyutun puanını, kritik/uyarı sayısını ve rapor yolunu göster. "Sade oldu" deme; raporu göster.
- Giriş gerektiren sayfalar için: yerel geliştirme sunucusunda oturum açık profil yoksa, denetimi giriş öncesi sayfalarda çalıştır ve giriş sonrası ekranları ELLE listesiyle kontrol et (Faz 3'te oturumlu denetim gelecek).
- `rapor.md` ve `erisim-rapor/` projenin `.gitignore`'una girer.

## 4. Elle kontrol (otomatik denetim bunları göremez)

Her yeni ekran için en az şu dördü, kendi kendine, ekran görüntüsüne bakarak:

- [ ] **5 saniye (Ö02):** ekranı 5 sn gören biri amacını ve ana eylemi söyleyebilir mi?
- [ ] **Gövde testi (Ö04/K03):** site, sayfa, bölümler, bulunulan yer, arama belli mi?
- [ ] **Boş durum (K07):** hiç verisi olmayan yeni kullanıcı bu ekranda ne görüyor?
- [ ] **Hata yolu (B07/B08):** en olası yanlış girişte ne oluyor, girilen veri korunuyor mu?

Ayda bir 3 gerçek kullanıcıyla görev testi: `references/test-protokolleri.md` (Ö01).

## 5. İnceleme istenirse çıktı biçimi

```
Puan: B __ · S __ · K __   (denetim raporu: <yol>)
Kritik:  [KURAL] sayfa: sorun → çözüm
Uyarı:   ...
Elle:    5 sn / gövde / boş durum / hata yolu: geçti/kaldı + not
En büyük tek kazanç: <tek değişiklik, neden>
```

## Sınırlar

- Bu skill WCAG (ekran okuyucu, kontrast) denetimi değildir; o ayrı bir iş. Kesiştiği yerler (etiket, dokunma hedefi, ikon adı) burada da yakalanır.
- Davranışsal tasarım (ikna, alışkanlık, fiyat) için `commerce-digital`. Akıllı varsayılan (B11) ve sadeleştirme karanlık desene dönmemeli: oradaki etik listesi geçerli.
- Eşikler başlangıç değeridir (`denetim/kurallar.mjs → ESIK`); kalibrasyon durumu depodaki `KARARLAR.md`'de.
