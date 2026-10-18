# Ekran kalıpları

Her kalıpta: **iskelet**, **mikro metin**, **sık hata**. Kural kimlikleri `katalog.md`'de.

## Form
- **İskelet:** tek sütun; etiket alanın üstünde (B06); yalnız gereken alanlar; 7'den fazla alan varsa adımlara böl (B10); gönder butonu formun altında, sola hizalı, tek birincil (B01).
- **Mikro metin:** buton eylemi söyler: "Hesabı oluştur", "Başvuruyu gönder" (K01). İsteğe bağlı alan "(isteğe bağlı)" diye işaretlenir; zorunlu olanlar işaretsiz kalır, çünkü çoğunluk zorunludur.
- **Biçim örneği** placeholder'da: "0532 000 00 00", "ornek@posta.com".
- **Sık hata:** placeholder etiket (B06); gönderince tüm alanların silinmesi (B08); "Telefonu boşluksuz giriniz" (B07).

## Hata
- **Alan hatası:** alanın hemen altında, kırmızı + ikon + metin; ne oldu + nasıl düzelir: "Şifre en az 8 karakter olmalı. 2 karakter daha ekle." (B08)
- **Sayfa/ağ hatası:** "Bağlantı koptu. Değişikliklerin kaydedildi, internet gelince tekrar dene. [Tekrar dene]" Hata kodu kullanıcıya değil, konsola/loga (B12).
- **Sık hata:** "Bir hata oluştu." (B08); toast içinde 3 saniyede kaybolan hata (B05); `Error: 500` (B12).

## Boş durum
- **İskelet:** ne olduğu + neden boş + tek ilk adım butonu (K07).
- **Örnek:** "Henüz burs eklemedin. Burs ekleyince son başvuru tarihleri burada sıralanır. [İlk bursu ekle]"
- **Arama sonucu yok:** "'yüksek lisans almanya' için sonuç yok. Daha kısa bir kelime dene ya da tüm burslara göz at." (K06)
- **Sık hata:** boş tablo başlıkları, "Veri yok", `[]`, `undefined` (B12).

## Onboarding / ilk açılış
- **İlke:** önce değer, sonra kayıt. Kullanıcı bir şey yapmadan önce tanıtım turu yok (B03, B09).
- **İskelet:** tek soru tek ekran; ilerleme göstergesi (B10); "Sonra yaparım" her zaman var (B14).
- **Örnek veri** ile başlat: boş panel yerine nasıl görüneceğini göster (S11).
- **Sık hata:** 5 ekranlık kaydırmalı tanıtım (B03); açılışta bildirim izni istemek (B09).

## Navigasyon
- **İskelet:** logo sol üstte, ana sayfaya gider (S01); en fazla 5-7 üst öğe (B02); bulunulan sayfa `aria-current="page"` + görsel işaret (S10); mobilde alt sekme çubuğu, 3-5 öğe, ikon + yazı (S06).
- **Etiketler** kullanıcının kelimesi (K02), birbiriyle örtüşmez (K05), varılan sayfanın h1'iyle aynı (K04).
- **Sık hata:** "Çözümler", "Hizmetler", "Kaynaklar" gibi kokusuz başlıklar (K01); masaüstünde hamburger menü (S01).

## Ayarlar
- **İskelet:** gruplar (Hesap, Bildirimler, Gizlilik), her grupta en çok kullanılan üstte; her ayarın altında bir satır "bu ne yapar" (S11).
- **Anında uygula** + "Kaydedildi" geri bildirimi (S04); ayrı "Kaydet" butonu gerekiyorsa sayfadan çıkarken uyar (B14).
- **Tehlikeli bölge** (hesabı sil) en altta, ayrı, kırmızı çerçeveli (B14).

## Liste / tablo
- **Mobilde** tablo değil kart; masaüstünde tablo yatay kaydırılabilir kapta (S12).
- **Varsayılan sıralama** kullanıcının en çok baktığı şeye göre (B11): son başvuru tarihi yakın olan üstte.
- **Satır eylemi** satırın kendisinde (S03); toplu eylem seçince görünür (B02).
- **Tarih ve tutar** yerel biçimde, sağa hizalı tutar (B13).

## Fiyat / paket
- **3 paket**, biri "Önerilen" (B02, B11); fark satırları sade dille (B04); ek ücretler baştan görünür [COGA 4.5.3].
- **Buton** paketin adını taşır: "Pro'yu başlat" (K01).
- Fiyat psikolojisi için `commerce-digital-ariely`; karanlık desen yasak.
