# Ekran kalıpları

Her kalıpta: **iskelet**, **mikro metin**, **sık hata**. Kural kimlikleri ve kaynakları `katalog.md`'de. Bir kalıbı uygulamadan önce projenin `erisim/niyet.md` ve `erisim/terimler.json` dosyalarına bak: örneklerdeki kelimeler yer tutucudur, projenin kelimesi geçerlidir (K02, S05).

## Form
- **İskelet:** tek sütun; etiket alanın üstünde (B06); yalnız gereken alanlar; 7'den fazla alan varsa adımlara böl (B10); gönder butonu formun altında, tek birincil (B01).
- **Mikro metin:** buton eylemi söyler: "Hesabı oluştur", "Başvuruyu gönder" (K01). İsteğe bağlı alan "(isteğe bağlı)" diye işaretlenir; zorunlular işaretsiz kalır, çünkü çoğunluk zorunludur.
- **Biçim örneği** placeholder'da ya da etiketin altında: "0532 000 00 00", "ornek@posta.com".
- **Kabul et, düzelt:** boşluk, tire, +90, büyük-küçük harf farkını kendin temizle (B07). Telefon `type="tel"`, asla `type="number"`; `pattern` yaygın yazımı reddetmesin.
- **Bildiğini sordurma (B16):** `autocomplete` ver; teslimat adresi faturadan "Aynı adres" kutusuyla devralınır; yarım form taslak olarak saklanır.

| Alan | `autocomplete` |
|---|---|
| Ad soyad | `name` (ayrıysa `given-name`, `family-name`) |
| E-posta | `email` |
| Telefon | `tel` |
| Adres | `street-address`, `address-level2` (il), `address-level1`, `postal-code` |
| Yeni şifre / mevcut şifre | `new-password` / `current-password` |
| Tek kullanımlık kod | `one-time-code` |

- **Sık hata:** placeholder etiket (B06); gönderince tüm alanların silinmesi (B08); "Telefonu boşluksuz giriniz" (B07); `autocomplete="off"` (B05).

## Giriş / kayıt
- **İskelet:** e-posta + şifre, ya da yalnız e-posta ile tek kullanımlık bağlantı. "Şifremi unuttum" şifre alanının hemen yanında (B05, S03).
- **Şifre:** yapıştırma serbest (şifre yöneticisi), "Şifreyi göster" düğmesi, kurallar alanın altında **önceden** ve yazarken tek tek ✓ (B05, B07). "Şifre en az 8 karakter olmalı. 2 karakter daha ekle."
- **Doğrulama:** görünür CAPTCHA bulmacası yok; görünmez doğrulama, hız sınırı ya da e-posta bağlantısı (B05).
- **İzinler:** pazarlama, bülten, veri paylaşımı kutusu **işaretsiz** gelir ve ayrı ayrı sorulur (B11, kritik). Kullanım koşulları onayı, pazarlama iznine bağlanmaz.
- **Sık hata:** kayıt olmadan fiyat ya da içerik gösterilmemesi (B17); kayıt formunda 10 alan (B10); "Kullanıcı adı veya şifre hatalı" sonrası e-postanın da silinmesi (B08).

## Hata
- **Alan hatası:** alanın hemen altında, kırmızı + ikon + metin (S17: renk tek başına değil); ne oldu + nasıl düzelir: "Şifre en az 8 karakter olmalı. 2 karakter daha ekle." (B08)
- **Sayfa/ağ hatası:** "Bağlantı koptu. Değişikliklerin kaydedildi, internet gelince tekrar dene. [Tekrar dene]" Hata kodu kullanıcıya değil, konsola/loga (B08, B12).
- **Suçlama yok:** "Geçersiz giriş" değil "Bu e-posta adresinde @ eksik görünüyor" (ilke 1, B17).
- **Sık hata:** "Bir hata oluştu." (B08); 3 saniyede kaybolan hata bildirimi (B05); `Error 401`, `#402` (B08); aynı anda 3'ten fazla uyarı kutusu (B09).

## Boş durum
- **İskelet:** ne olduğu + neden boş + tek ilk adım butonu (K07).
- **Örnek:** "Henüz burs eklemedin. Burs ekleyince son başvuru tarihleri burada sıralanır. [İlk bursu ekle]"
- **Arama sonucu yok:** "'yüksek lisans almanya' için sonuç yok. Daha kısa bir kelime dene ya da tüm burslara göz at." (K06)
- **Sık hata:** boş tablo başlıkları, "Veri yok", `[]`, `undefined` (B12).

## Onboarding / ilk açılış
- **İlke:** önce değer, sonra kayıt. Kullanıcı bir şey yapmadan önce tanıtım turu yok (B03, B09). İlk 1-2 saniye "kolay ve güvenilir" izlenimi verir (Ö08).
- **İskelet:** tek soru tek ekran; ilerleme göstergesi (B10); "Sonra yaparım" her zaman var (S13).
- **Örnek veri** ile başlat: boş panel yerine nasıl görüneceğini göster (S11).
- **Bağlamsal ipucu, kaçırılamaz ve kısa:** alanın yanında "Bu nedir?", ilk kullanımda tek satırlık ok; uzun tur değil (K10).
- **Yeniden bulunabilir tur:** kapatılan tur ve ipuçları "Yardım > Turu yeniden başlat" ile geri gelir; seyrek kullanılan üründe her açılış ilk açılış gibidir (S16).
- **Başlarken listesi:** 3-5 maddelik, işaretlendikçe ilerleyen liste; tamamlanınca kaybolur.
- **Sık hata:** 5 ekranlık kaydırmalı tanıtım (B03); açılışta bildirim izni istemek (B09); "Hoş geldiniz" paragrafı (B03).

## Navigasyon
- **İskelet:** logo sol üstte, ana sayfaya gider (S01); ana menü en çok 5-7 öğe (B02); bulunulan sayfa `aria-current="page"` + **en az iki görsel fark** (zemin + kalınlık, ya da çubuk + renk; yalnız renk zayıftır) (S10); mobilde alt sekme çubuğu, 3-5 öğe, ikon + yazı (S06).
- **Etiketler** kullanıcının kelimesi (K02), birbiriyle örtüşmez (K05), varılan sayfanın h1'iyle aynı (K04). Kurumun organizasyon şeması menü olmaz (S19).
- **İçerik yolu (breadcrumb):** son öğe bağlantı değil, düz ve kalın metin (S10).
- **Arama:** adı "Ara", yanında büyüteç; "Hızlı Bul", "Keşfet" değil (K06).
- **Sık hata:** "Çözümler", "Hizmetler", "Kaynaklar" gibi kokusuz başlıklar (K01); masaüstünde hamburger menü (S01); iç içe kaydırma alanları (S03).

## Ödeme / odak akışı (checkout, başvuru gönderimi)
- **İskelet:** gezinme sadeleşir: üst menü ve alt bilgi gizlenir, logo ve "Vazgeç / Sepete dön" kalır (B09, S13). Kesinti, reklam, öneri yok.
- **Toplam baştan:** kargo, vergi, hizmet bedeli ilk adımda görünür; son adımda sürpriz ücret güveni bitirir (B17).
- **Adımlar:** 3-4 adım, ilerleme göstergesi, her adımın adı (B10); geri dönünce girilen veri yerinde (B16, S13).
- **Son adım:** özet + tek birincil buton, butonda tutar: "1.250,50 TL öde" (K01, B13).
- **Sonuç ekranı:** ne olduğu, sırada ne var, ne zaman; sipariş/başvuru numarası yerine adı ve bağlantısı (S19).

## Tarih, son tarih ve hatırlatma
- **Göster:** "18 Ekim 2026 Cumartesi · 6 gün kaldı"; eğik çizgili `18/10/2026` değil (B13). Saat dilimi farklıysa açıkça yaz.
- **Takvime ekle:** son tarihi olan her kayıtta `.ics` indiren "Takvime ekle" bağlantısı (Google Takvim bağlantısı da olabilir). Kullanıcı tarihi aklında tutmak zorunda kalmasın (B05).
- **Hatırlatma = sinyal + mesaj:** bildirim ya da e-posta neyin, ne zaman, ne yapılacağını söyler ve **doğrudan ilgili kayda** açılır: "Erasmus+ başvurusu 3 gün sonra kapanıyor. Eksik: niyet mektubu. [Başvuruyu aç]" (B16, K01). Genel "Hatırlatmalarınız var" yetmez.
- **Görev hazırlığı:** uzun bir işe başlamadan önce ne gerektiğini söyle: "Bu başvuru ~15 dk sürer. Hazırla: pasaport, transkript (PDF), niyet mektubu." (B10)

## Bekleme ve yükleme
- **1 sn altı:** gösterge yok; düğme basılı görünür (S04).
- **1-10 sn:** iskelet (skeleton) ya da döner gösterge, yerini önceden ayırır; içerik gelince sayfa kaymaz (S18: görsellere `width`/`height` ya da `aspect-ratio`).
- **10 sn üstü:** ilerleme çubuğu + tahmini süre + "İptal" + "Bitince haber ver"; beklerken başka iş yapılabilir (S14).
- **Tutarlılık:** aynı iş bazen 5 sn bazen 30 sn sürüyorsa nedenini yaz; tutarsız bekleme daha uzun hissedilir (S14).

## Yıkıcı eylem (silme, sıfırlama, hesap kapatma)
- **Varsayılan:** onay penceresi değil, anında yap + "Silindi · [Geri al]" bildirimi (5-10 sn) ya da çöp kutusu (B14).
- **Geri alınamıyorsa:** sonucu nesnenin adıyla önceden söyle: "'Almanya 2027' listesi ve içindeki 12 burs kalıcı olarak silinecek." Buton da adı taşır: "Listeyi sil", "Evet" değil (B14, K01).
- **Görünüm ve yer:** yıkıcı buton olağan butondan rengi, biçimi ve konumuyla ayrılır; "Kaydet"in yanında aynı görünümde "Sil" olmaz (B14). İptal/sil yeşil, onay/kaydet kırmızı olmaz (S17).
- **Tehlikeli bölge:** ayarların en altında, ayrı ve kırmızı çerçeveli; bilinçli sürtünme tek noktada kalır.

## Ayarlar
- **İskelet:** gruplar (Hesap, Bildirimler, Gizlilik), her grupta en çok kullanılan üstte; her ayarın altında bir satır "bu ne yapar" (S11).
- **Anında uygula** + "Kaydedildi" geri bildirimi (S04); ayrı "Kaydet" butonu gerekiyorsa sayfadan çıkarken uyar (B14, S13).
- **Otomasyon ayarları:** sistemin kullanıcı adına yaptığı her şey (otomatik sınıflandırma, AI önerisi) burada görünür ve kapatılabilir (S20).

## Liste / tablo
- **Mobilde** tablo değil kart; masaüstünde tablo yatay kaydırılabilir kapta (S12). Sayfanın içinde ikinci bir dikey kaydırma alanı açma (S03).
- **Varsayılan sıralama** kullanıcının en çok baktığı şeye göre (B11): son başvuru tarihi yakın olan üstte. Kullanıcının seçtiği sıralama ve filtre korunur (B16).
- **Satır eylemi** satırın kendisinde (S03); toplu eylem seçince görünür (B02, B15).
- **Kayıt adı:** satır başlığı kaydın adı, `#4521` değil (S19).
- **Tarih ve tutar** yerel biçimde, tutar sağa hizalı (B13).

## Fiyat / paket
- **3 paket**, biri "Önerilen" (B02, B11); fark satırları sade dille (B04); ek ücretler baştan görünür (B17).
- **Buton** paketin adını taşır: "Pro'yu başlat" (K01).
- Fiyat psikolojisi için `commerce-digital-ariely`; karanlık desen yasak.

## Yardım ve iletişim
- **Her sayfadan** ulaşılır: alt bilgide "Yardım ve iletişim", ya da başlıkta "?" + yazı (K10).
- **İletişim formu** en çok 3 zorunlu alan (e-posta + mesaj); oturum açıksa e-posta zaten bilinir (B16, K10).
- **Ne olacağını söyle:** "Mesajın destek ekibine gider, genelde 1 iş günü içinde yanıtlarız."
- **SSS** gerçek sorulardan; "Neden harikayız?" sayfası değil (B17). Sohbet botu varsa insana geçiş görünür.
