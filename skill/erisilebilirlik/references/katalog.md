# Erişilebilirlik kural kataloğu (v0.1)

**Erişilebilirlik** burada şu demek: nihai kullanıcı ürünü **kılavuz okumadan, destek aramadan, zihinsel yorgunluk yaşamadan** anlar ve kullanır. Üç boyut:

| Kod | Boyut | Literatürdeki adı | Sorduğu soru |
|---|---|---|---|
| **B** | Bilişsel yük | Cognitive Accessibility, Cognitive Load Theory | Bunu anlamak ne kadar zihinsel çaba istiyor? |
| **S** | Sezgisel etkileşim | Intuitive Interaction, affordance, mental model | Nasıl kullanılacağı ilk bakışta belli mi? |
| **K** | Bilgi kokusu | Information Scent, Information Foraging, IA | Aradığımı bulacağımdan tıklamadan önce emin miyim? |
| **Ö** | Ölçüm | TAM, UTAUT, HEART, kullanım testi | Gerçekten kolay mı, yoksa bize mi kolay geliyor? |

**Okuma:** her kuralda *Denetim* satırı şunu söyler: **OTOMATİK** (`denetim/denetle.mjs` yakalar), **YARI** (araç işaret eder, insan karar verir), **ELLE** (yalnız gözle/testle). Otomatik araç sorunların bir kısmını yakalar; Ö bölümündeki testler atlanmaz.

**Kaynak gösterimi:** `[Kısaltma s.N]`, N kaynak PDF'inin fiziksel sayfasıdır (baskı numarası değil). Kısaltmalar `kaynakca.md`'de. Bir kuralın kaynağını doğrulamak için: `py -I araclar/bul.py "<kelime>" <kısaltma>`.

---

## B · Bilişsel yük

### B01 · Ekranda tek birincil eylem
**İlke:** Her ekranda gözün kilitleneceği tek bir ana eylem olur. Beş buton aynı büyüklükte ve aynı parlaklıktaysa kullanıcı nereye basacağını bilemez.
**Neden:** Seçenek arttıkça karar süresi uzar (Hick). Kullanıcı en iyi seçeneği aramaz, ilk makul olanı seçer [Krug-DMMT s.42 "satisfice"]; ne kadar belirgin bir ilk aday sunarsan o kadar az hata yapar. Görsel hiyerarşi neyin önemli olduğunu söylemeli [Krug-DMMT s.48], [COGA 4.3.4], [Furkan-Notlar §7].
**Denetim:** OTOMATİK. İlk ekranda dolgulu, doygun renkli buton sayısı > 1 ise bilgi, > 3 ise uyarı.
**Yap:** bir `variant="primary"`, gerisi `secondary`/`ghost`. **Yapma:** "Satın al", "Dene", "Kaydol", "İndir" yan yana dört renkli buton.
**Ödünleşim:** Gerçekten eşit iki yol varsa (Giriş yap / Kaydol) ikisi de görünür olabilir; biri yine de daha belirgin olsun.

### B02 · Seçenekleri sınırla, gerisini aşamalı aç
**İlke:** İlk ekranda kullanıcıların çoğunun yapacağı birkaç şey görünür; ileri düzey seçenekler istenince açılır (progressive disclosure).
**Neden:** Çalışma belleği aynı anda 3-4 parçayla çalışır [Weinschenk-100 s.66, s.68]; insan işleyebileceğinden fazla seçenek ister ama fazlası onu felç eder [Weinschenk-100 s.11 #(daha fazla seçenek)]. Aşamalı açma yalnız o an gereken bilgiyi verir [Weinschenk-100 s.82], [LawsOfUX: Hick], [Furkan-Notlar §3, §6]. Arama sayfası örneği: filtreler sonuç sayfasında çıkar, giriş sayfasında değil [LawsOfUX: Hick].
**Denetim:** OTOMATİK. Bir menüde görünür öğe > 7; ilk ekranda tıklanabilir öğe > 30; 15'ten fazla seçenekli açılır liste.
**Yap:** "Gelişmiş filtreler" bağlantısı, ikinci adım, ayarlar sayfası. Paket seçiminde 3 seçenek, biri "Önerilen".
**Ödünleşim:** Uzman araçlarında (muhasebe paneli) yoğunluk beklenir; o zaman gruplama ve sabit yerleşimle taşı (B05, S05).

### B03 · Gereksiz kelimeyi at
**İlke:** Metnin yarısını sil, kalanın yarısını da sil. Karşılama paragrafları ("Sitemize hoş geldiniz…") ve uzun talimatlar ölür.
**Neden:** Kullanıcı okumaz, tarar; sayfa ona 100 km/s hızla geçilen bir reklam panosudur [Krug-DMMT s.39]. Gereksiz kelime gürültüdür, yararlı içeriği aşağı iter [Krug-DMMT s.77-78 "happy talk must die", "instructions must die"], [COGA 4.4.5], [COGA 4.6.3].
**Denetim:** OTOMATİK. Masaüstü ilk ekranda > 250 kelime uyarı (başlangıç eşiği).
**Yap:** "Burslarım" başlığı + tek satır açıklama. **Yapma:** başlık altında 3 paragraf ürün tanıtımı.

### B04 · Sade dil
**İlke:** Kısa cümle (≤ 20 kelime), günlük kelime, etken çatı, tek cümlede tek fikir, çift olumsuz yok, mecaz yok. Teknik terim yerine kullanıcının kelimesi.
**Neden:** [COGA 4.4.1 açık kelimeler], [COGA 4.4.2 basit zaman ve çatı], [COGA 4.4.3 çift olumsuz ve iç içe yan cümle yok], [COGA 4.4.4 mecazsız dil], [Nielsen-10 #2 gerçek dünyayla eşleşme], [Furkan-Notlar §2]. Gereksiz biçimde zor sunum "dışsal bilişsel yük" üretir; öğrenmeye ya da işe değil, sunumu çözmeye harcanır [Hollender-2010 s.2].
**Denetim:** OTOMATİK. 20 kelimeden uzun cümle; okunabilirlik < 50 (Türkçe için Ateşman 1997, İngilizce için Flesch); `denetim/sozluk.json` jargon listesindeki kelimeler (parametre, token, auth, submit…).
**Yap:** "Şifren yanlış görünüyor, tekrar dener misin?" **Yapma:** "Kimlik doğrulama başarısız (Auth Error 401)".

### B05 · Hatırlatma, ezberletme
**İlke:** Kullanıcı önceki adımda gördüğünü, seçtiğini, girdiğini aklında tutmak zorunda kalmaz; ekranda görür.
**Neden:** Tanımak hatırlamaktan çok daha kolaydır [Nielsen-10 #6]. Bilgiyi kafada değil dünyada tut [Norman-DOET s.72, s.88 "knowledge in the world"]. [COGA 4.7.5 hesap ve ezber isteme], [Furkan-Notlar §5].
**Denetim:** ELLE. Çok adımlı akışta her adımda "şimdiye kadar seçtiklerin" özeti var mı; son aramalar, son görüntülenenler.
**Yap:** sepet özeti kenarda sabit; "0532 000 00 00" biçim örneği; şifre kuralları alan yanında yazı olarak.
**Ödünleşim:** Giriş için de geçerli: tek adımlı, şifresiz (e-posta bağlantısı, Google) giriş tercih et [COGA 4.7.1, 4.7.2].

### B06 · Her alanın görünür etiketi
**İlke:** Her form alanının üstünde kalıcı, görünür bir etiket olur. Placeholder etiket değildir: yazmaya başlayınca soru kaybolur.
**Neden:** [COGA 4.5.6 açık görünür etiketler], [COGA 4.8.4 formlar için yardım], B05 ile aynı gerekçe: soru kaybolunca kullanıcı ne yazdığını hatırlamak zorunda kalır.
**Denetim:** OTOMATİK. Etiketsiz alan ya da yalnız placeholder taşıyan alan kritik.
**Yap:** `<label for="tel">Telefon</label><input id="tel" placeholder="0532 000 00 00">`

### B07 · Hatayı baştan önle
**İlke:** İyi tasarım hata mesajından önce hatayı engeller: serbest metin yerine seçim, biçimi kendin düzelt, farklı yazımları kabul et.
**Neden:** [Nielsen-10 #5 hata önleme]. İnsanlar her zaman hata yapar, hatasız ürün yoktur; stres altında daha çok [Weinschenk-100 s.11 #(hata bölümü)]. Kaymalar (slip) otomatik davranıştan doğar ve tasarımla önlenebilir [Norman-DOET s.121-122]. Hata için tasarla [Norman-DOET s.205]. [COGA 4.5.4 hatayı önleyen form], [COGA 4.5.8 farklı giriş biçimlerini kabul et].
**Denetim:** ELLE. Telefon/IBAN/tarih alanı boşlukları, tireleri, büyük-küçük harfi tolere ediyor mu?
**Yap:** `inputMode="numeric"`, tarih seçici, kendiliğinden biçimlendirme. **Yapma:** "Telefonu boşluksuz giriniz".

### B08 · Hata mesajı çözüm söyler
**İlke:** Hata mesajı ne olduğunu ve nasıl düzeleceğini sade dille, hatalı alanın hemen yanında, suçlamadan söyler. Girilen veri silinmez.
**Neden:** [Nielsen-10 #9 hatayı tanıma, teşhis, kurtarma], [COGA 4.5.5 form hatasını geri almak kolay], [COGA 4.5.10 geri bildirim].
**Denetim:** YARI. `role=alert` ya da hata sınıflı kutuda "Hata!", "Bir hata oluştu", "Geçersiz" gibi 3 kelimeden kısa genel mesaj uyarı. İçerik doğruluğunu insan okur.
**Yap:** "Bu e-posta ile kayıt var. Giriş yapmak ister misin?" **Yapma:** "Hata oluştu."

### B09 · Kesinti ve dikkat dağıtıcı yok
**İlke:** Kullanıcı amacına ulaşmadan önce kesilmez: açılışta pop-up, kendiliğinden oynayan video, dönen slayt, geri sayım yok.
**Neden:** [COGA 4.6.1 kesintileri sınırla], [COGA 4.9.1 hareketi kullanıcı kontrol etsin], [Krug-DMMT s.48 dikkat dağıtıcıları kaldır].
**Denetim:** OTOMATİK. Açılışta ekranın %30'undan fazlasını kaplayan sabit katman (çerez penceresi ise bilgi), `video[autoplay]`, sonsuz animasyon.
**Ödünleşim:** KVKK/GDPR çerez bildirimi zorunlu; ama ekranın altında ince bir şerit yeterli.

### B10 · Uzun işi adımlara böl, ilerlemeyi göster
**İlke:** Bir adımda tek konu. Kaç adım kaldığı görünür. Yarıda bırakılan iş kaybolmaz.
**Neden:** Bilgiyi parçalara bölmek işlenmesini kolaylaştırır [LawsOfUX: Miller, chunking], [Weinschenk-100 s.66]. İnsanlar ilerleme gördükçe motive olur [Weinschenk-100 s.9 #55]. [COGA 4.2.4 her adım açık], [COGA 4.5.9 veri kaybı ve zaman aşımı yok], [COGA 4.6.2 kısa kritik yol].
**Denetim:** OTOMATİK (kısmen). Tek formda 7'den fazla görünür alan uyarı. İlerleme ve taslak kaydı ELLE.

### B11 · Akıllı varsayılan
**İlke:** Çoğu kişinin seçeceği önceden seçilidir ve "Önerilen" diye işaretlenir.
**Neden:** Varsayılan, işi tamamlamak için gereken emeği azaltır [Weinschenk-100 s.149]. Her sistemde azaltılamayan bir karmaşıklık vardır; onu kullanıcıya değil sisteme (tasarımcıya, koda) yükle [LawsOfUX: Tesler]. [Furkan-Notlar §6].
**Denetim:** ELLE.
**Ödünleşim:** Kullanıcı aleyhine varsayılan (önceden işaretli pazarlama izni, ek ücretli seçenek) karanlık desendir ve KVKK/DSA'ya aykırıdır. `commerce-digital` etik listesine bak.

### B12 · Ham sistem çıktısı sızmaz
**İlke:** Kullanıcı ekranda asla `undefined`, `null`, `NaN`, `[object Object]`, `Invalid Date`, hata izi, `{{değişken}}` görmez.
**Neden:** Sistemin dili kullanıcının dili değildir [Nielsen-10 #2]; ham çıktı hem anlamsızdır hem güveni kırar. Bu, projelerde en sık görülen ve en kolay önlenen bilişsel kırılmadır.
**Denetim:** OTOMATİK, kritik. Liste: `denetim/sozluk.json → ham_cikti`.
**Yap:** `{tutar ?? "—"}`, boş listede K07 boş durum, tarih yoksa "Tarih belirtilmemiş".

### B13 · Yerel biçim
**İlke:** Tarih, sayı, para ve birim kullanıcının alıştığı biçimde: 18 Ekim 2026, 1.250,50 TL, 3 gün sonra.
**Neden:** [COGA 4.5.12 tanıdık ölçü ve birim], [COGA 4.4.13 sayısal kavramlara alternatif], [Nielsen-10 #2].
**Denetim:** OTOMATİK. Türkçe sayfada ISO tarih (2026-10-18) ve İngilizce sayı biçimi (1,250.50) uyarı.
**Yap:** `new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" })`, `new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" })`.

### B14 · Geri alınabilirlik
**İlke:** Yapılan iş geri alınabilir. Onay penceresi yerine "Silindi · Geri al" bildirimi. Yıkıcı eylem görsel ve konum olarak ayrıdır.
**Neden:** [Nielsen-10 #3 kullanıcı denetimi ve özgürlüğü], [COGA 4.5.2 geri gitmeye izin ver], [COGA 4.8.3 eylemin sonucunu ve dezavantajını açıkça söyle]. Onay penceresi alışkanlıkla kör tıklanır; kaymayı (slip) engellemez [Norman-DOET s.121-122].
**Denetim:** ELLE.

---

## S · Sezgisel etkileşim

### S01 · Alışkanlığa uy
**İlke:** Ürün, kullanıcının her gün kullandığı ürünler gibi çalışır. Logo sol üstte ve ana sayfaya gider, arama üstte, hesap/sepet sağ üstte, sekmeler altta (mobil). Yenilik değerde olur, kontrollerde değil.
**Neden:** Kullanıcılar zamanlarının çoğunu başka sitelerde geçirir ve aynı çalışmasını bekler [LawsOfUX: Jakob], [Furkan-Notlar §1]. Sezgisel kullanım önceki deneyimden gelir: tanıdık özellikler daha hızlı ve daha sezgisel kullanılır [Blackler-2010 s.1]. Gelenekler dostundur [Krug-DMMT s.48]. İnsanlar ekranı geçmiş deneyim ve beklentiye göre tarar [Weinschenk-100 s.29]. Alışkanlık, kullanıcının yeni bir kanala geçip geçmemesini belirler [Iranmanesh-2022].
**Denetim:** YARI. Üst bölümde ana sayfaya dönen bağlantı yoksa uyarı (K03 ile). Gerisi ELLE: "Bu ekranı ilk kez gören biri X'i nerede arar?"

### S02 · Tıklanabilen tıklanabilir görünür
**İlke:** Neyin tıklanabildiği bakınca belli. Gerçek `<button>`/`<a>` kullanılır; metin içi bağlantı altı çizili ya da belirgin renkli; düz metin gibi görünen buton yok.
**Neden:** Algılanan affordance: doğru eylemler görünür olmalı [Norman-DOET s.8]. Dokunmatik ekranda üzerine gelme (hover) yok, ipucu görünür olmak zorunda; "affordance'larını saklama" [Krug-DMMT s.186-187]. [COGA 4.2.5 kontrolleri ve kullanımlarını açıkça tanımla].
**Denetim:** OTOMATİK. `cursor:pointer` taşıyan ama buton/bağlantı olmayan öğe; metin içinde çevresiyle aynı renk ve altı çizgisiz bağlantı.

### S03 · Kontrol etkilediği şeyin yanında
**İlke:** Bir kontrol etkilediği içeriğin hemen yanında ya da üstündedir; düzeni o içeriğin düzenini izler (doğal eşleme).
**Neden:** Doğal eşleme kolay öğrenilir ve unutulmaz [Norman-DOET s.39]. Ayrı yerlerdeki bilgiyi zihinde birleştirmek dışsal yük yaratır (dikkat bölünmesi) [Hollender-2010 s.2]. [COGA 4.2.6 kontrol ile içerik ilişkisi açık].
**Denetim:** ELLE.

### S04 · Her eyleme anında geri bildirim
**İlke:** Her tıklama görünür bir tepki alır: ~100 ms içinde görsel değişim, 1 sn üstünde "yükleniyor", 10 sn üstünde ilerleme ve iptal. Başarı da söylenir ("Kaydedildi").
**Neden:** Geri bildirim kritiktir, eylemin etkisi gösterilmeli [Norman-DOET s.8]. Uygulama ile niyet arasındaki "değerlendirme uçurumu" geri bildirimle kapanır [Norman-DOET s.67]. [Nielsen-10 #1 sistem durumunun görünürlüğü], [COGA 4.5.10 geri bildirim ver]. Algılanan süre nesnel süreden farklıdır ve kullanıcı deneyimini belirler [Trukenbrod-2020].
**Denetim:** ELLE (Faz 3'te etkileşim senaryosuyla yarı otomatik).

### S05 · Tutarlılık
**İlke:** Aynı şey her yerde aynı adı, aynı yeri, aynı görünümü taşır. Projede bir terim sözlüğü tutulur.
**Neden:** [Nielsen-10 #4 tutarlılık ve standartlar], [COGA 4.2.3 tutarlı görsel tasarım]. "Standartlaştır" son çaredir ama güçlüdür [Norman-DOET s.205].
**Denetim:** OTOMATİK (sayfalar arası). Aynı sayfaya giden menü öğesinin farklı adlarla anılması.

### S06 · İkon yalnız başına konuşmaz
**İlke:** Kapat (×), ara (büyüteç), menü (≡) dışındaki ikonların yanında 1-2 kelimelik görünür etiket olur.
**Neden:** Somut terimler ve ikonlar soyut fikirden kolay hatırlanır; ama ikonun anlamı öğrenilmiş olmalı [Weinschenk-100 s.74]. [COGA 4.2.7 kullanıcıya yardım eden ikon kullan].
**Denetim:** OTOMATİK. Adı hiç olmayan ikon buton kritik; `aria-label`'ı olup görünür yazısı olmayan, evrensel olmayan ikon uyarı.

### S07 · Dokunma hedefi büyük
**İlke:** Mobilde tıklanabilir alan en az 44×44 px; hedefler arasında boşluk.
**Neden:** Hedefe ulaşma süresi uzaklık ve hedef boyutuna bağlıdır (Fitts yasası). Platform kılavuzları: Apple 44 pt, Material 48 dp; WCAG 2.2 alt sınırı 24 px.
**Denetim:** OTOMATİK (mobil, 390 px). 44 px'ten küçük hedef uyarı; paragraf içi bağlantılar hariç.

### S08 · Görsel hiyerarşi
**İlke:** Tek h1. Başlık sırası atlamaz. Önemli olan büyük, üstte, etrafında boşluk; ilişkili öğeler yakın, farklı konular belirgin boşlukla ayrı.
**Neden:** Etkili görsel hiyerarşi, sayfayı bölümlere ayırma, tıklanabilirliği belli etme [Krug-DMMT s.48]. [COGA 4.3.3 açık sayfa yapısı], [COGA 4.4.10 beyaz boşluk], [Furkan-Notlar §7 Gestalt yakınlık].
**Denetim:** OTOMATİK (h1 sayısı). Gerisi ELLE: 5 saniye testi (O02).

### S09 · Kısıtla, yanlışı imkânsız kıl
**İlke:** Geçersiz seçenekler baştan gösterilmez ya da seçilemez; zorlayıcı işlev (forcing function) yanlış sırayı engeller. Ama devre dışı buton nedenini söyler.
**Neden:** Kullanımı kolaylaştırmanın en sağlam yolu kısıtlardır [Norman-DOET s.8], [Norman-DOET s.148 forcing functions]. Nedeni yazılmayan pasif buton kullanıcıyı çıkmaza sokar; [COGA 4.8.3].
**Denetim:** ELLE.

### S10 · Durum görünür
**İlke:** Kullanıcı her an nerede olduğunu, neyin seçili olduğunu, işinin kaydedilip kaydedilmediğini görür.
**Neden:** "Buradasın" göstergesi navigasyonun kaybolmayı önleme yoludur [Krug-DMMT s.107]. [Nielsen-10 #1].
**Denetim:** OTOMATİK. Menü varsa ve hiçbir öğe `aria-current` ya da seçili sınıfla işaretli değilse uyarı.

### S11 · Kavramsal model
**İlke:** Ürün nasıl çalıştığını arayüzüyle anlatır: önizleme, örnek veri, "şu olunca şu olur" ifadesi. Kullanıcının kafasındaki model ile sistemin modeli örtüşür.
**Neden:** Bir şeyi kullanmak için nasıl çalıştığına dair bir kavramsal model gerekir [Norman-DOET s.7]. Niyet ile sistemin sunduğu eylemler arasındaki "uygulama uçurumu" [Norman-DOET s.67]. Tasarımcının zihinsel modeli ile kullanıcınınki arasındaki farkı kapatmak temel iştir [LawsOfUX: Jakob, mental models]. Kullanıcılar kılavuz okumaz, deneyerek ilerler [LawsOfUX: Paradox of the Active User], [Krug-DMMT s.42 "muddle through"].
**Denetim:** ELLE.

### S12 · Mobilde taşma yok
**İlke:** Telefonda sayfa yana kaymaz, yakınlaştırma engellenmez.
**Neden:** Yatay kaydırma içeriğin bir kısmını görünmez kılar ve kullanıcıyı haritasız bırakır; Krug'un mobil bölümü [Krug-DMMT s.186].
**Denetim:** OTOMATİK. `meta viewport` yoksa ya da sayfa > 4 px taşıyorsa kritik; `user-scalable=no` uyarı.

---

## K · Bilgi kokusu

### K01 · Etiket hedefi söyler
**İlke:** Kullanıcı tıklamadan önce ne olacağını bilir. "Tıkla", "Buraya", "Devamı", "Gönder", "Çözümler" yerine sonucu söyleyen fiil: "Fiyat teklifini gör", "PDF raporunu indir", "Başvuruyu gönder".
**Neden:** Hedefini açıkça tanımlayan bağlantılar güçlü bir "bilgi kokusu" verir; belirsiz bağlantılar vermez. Terim Pirolli ve Card'ın bilgi yiyeceği arama (information foraging) kuramından gelir [Krug-DMMT s.70]. [Furkan-Notlar §4].
**Denetim:** OTOMATİK. Kara liste `sozluk.json → belirsiz_kritik / belirsiz_uyari`; aynı metnin 3+ farklı hedefe gitmesi ("Detay" × 10).

### K02 · Kullanıcının kelimesi
**İlke:** Menü, kategori ve etiketler şirketin iç dilinden değil, kullanıcının aradığı kelimeden seçilir.
**Neden:** Bilgi mimarisi; web sitesi navigasyonundaki bağlantılar, bir yazılımdaki kategoriler, etiketler ve görev adlarıdır [Covert-IA s.13]. Belirsiz etiket kullanıcının kafasında belirsiz bir eşleşme yaratır [Covert-IA s.78]. [COGA 4.4.1], [Nielsen-10 #2].
**Denetim:** ELLE. Kart sıralama, ilk tıklama testi (O03), arama kutusu kayıtlarındaki kelimeler.

### K03 · Neredeyim? (gövde testi)
**İlke:** Rastgele bir sayfaya bırakılan kullanıcı şunları hemen söyleyebilmeli: bu hangi site, bu hangi sayfa, ana bölümler neler, şu an hangisindeyim, nasıl ararım.
**Neden:** Krug'un gövde testi (trunk test) [Krug-DMMT s.112-113]. [COGA 4.2.1 sayfanın amacını açık yap], [COGA 4.3.2 hiyerarşi kolay anlaşılsın].
**Denetim:** OTOMATİK. Boş ya da genel sekme başlığı ("React App", "Create Next App") kritik; görünür h1 yoksa kritik; üst bölümde ana sayfa bağlantısı yoksa uyarı; farklı sayfaların aynı başlığı taşıması uyarı.
**Yap:** `<title>Burslarım · Örnek Uygulama</title>` (sayfa · site).

### K04 · Koku sürekliliği
**İlke:** Tıklanan bağlantının kelimesi varılan sayfanın başlığında geçer. "Fiyatlar" tıklandıysa sayfa "Fiyatlar" diye açılır, "Planlarımız" diye değil.
**Neden:** Koku, her adımda doğru yolda olunduğunu teyit ettiği sürece kullanıcıyı ilerletir [Krug-DMMT s.70]. Kopukluk "yanlış yere mi geldim?" şüphesi ve geri dönüş yaratır.
**Denetim:** OTOMATİK (sayfalar arası). Denetlenen sayfalar arasında bağlantı metni ile hedef h1/başlık arasında ortak kelime kökü yoksa uyarı.

### K05 · Ayrık, tahmin edilebilir kategoriler
**İlke:** Menü grupları birbiriyle örtüşmez; bir öğe tek bir yere aittir; kullanıcı bir şeyin hangi grupta olduğunu tahmin edebilir.
**Neden:** Taksonomi şeyleri nasıl düzenlediğimizdir; amaca göre düzenlenir [Covert-IA s.142]. [COGA 4.3.2]. Seçimler "hayvan, bitki, mineral" kadar düşünmesiz olmalı [Krug-DMMT s.70].
**Denetim:** ELLE. Kart sıralama.

### K06 · Arama
**İlke:** İçerik çoksa görünür bir arama kutusu olur; sonuç yoksa öneri gösterilir, boş sayfa değil.
**Neden:** Bazı kullanıcılar gezinmez, doğrudan arar [Krug-DMMT s.87]. [COGA 4.3.6 arama sağla].
**Denetim:** ELLE (Faz 3: yarı otomatik).

### K07 · Boş durum yol gösterir
**İlke:** Boş liste, boş panel, sonuçsuz arama ne olduğunu ve ilk adımı söyler: "Henüz burs eklemedin. İlk bursu ekle."
**Neden:** Boş ekran, kullanıcıyı ne yapacağını hatırlamak ya da keşfetmek zorunda bırakır (B05); ilk adım görünür olmalı [COGA 4.6.4 görevi tamamlamak için bilgi ver].
**Denetim:** ELLE. Yeni hesapla her ana ekranı aç.

### K08 · Her tık düşünmesiz
**İlke:** Tık sayısı değil kararsızlık azaltılır. Her adımda doğru seçenek tartışmasız olmalı.
**Neden:** "Kaç kez tıkladığım önemli değil, yeter ki her tık düşünmesiz ve tek anlamlı bir seçim olsun" (Krug'un ikinci yasası) [Krug-DMMT s.70]. "3 tık kuralı" bu yüzden yanlış hedeftir.
**Denetim:** ELLE. İlk tıklama testi (O03).

### K09 · Bağlantı ne açacağını söyler
**İlke:** Dosya indiren, yeni sekme açan, dış siteye götüren bağlantı bunu önceden söyler: "Başvuru kılavuzu (PDF, 2 MB)".
**Neden:** Koku yalnız hedefin konusunu değil biçimini de içerir; beklenmedik indirme ya da sekme değişimi kullanıcıyı haritasız bırakır. [COGA 4.8.3 eylemin sonucunu açıkça söyle].
**Denetim:** OTOMATİK. `.pdf/.docx/.xlsx/.zip/.csv` bağlantısında biçim ya da "indir" kelimesi yoksa uyarı.

---

## Ö · Ölçüm ve test (otomatik denetimin yerini tutmaz)

### Ö01 · Ayda bir sabah, 3 kullanıcı
**İlke:** Ayda bir sabah 3 gerçek kullanıcıyla görev testi; o gün en ciddi sorunları seç, en küçük değişiklikle düzelt.
**Neden:** Kendin yap kullanılabilirlik testi; testi yarım güne indirmek 3 kullanıcı demektir, işe alımı basitleştirir [Krug-RSME s.36]. En ciddi sorunlar çoğu zaman göz önündedir [Krug-RSME s.27]. Kullanıcıya fikrini ("Beğendin mi?") değil, ne yaptığını sor [Krug-RSME s.48]. Protokol: `test-protokolleri.md`.

### Ö02 · 5 saniye testi
**İlke:** Ekranı 5 saniye göster, kapat, sor: "Bu ne için? Burada ne yapabilirsin?" Cevap yanlışsa B01, B03, S08 sorunludur.
**Neden:** Kullanıcı sayfaya pano gibi bakar [Krug-DMMT s.39]; sayfanın amacı ilk bakışta anlaşılmalı [COGA 4.2.1].

### Ö03 · İlk tıklama testi
**İlke:** "X'i yapmak için nereye tıklardın?" İlk tık doğruysa görev büyük olasılıkla tamamlanır.
**Neden:** Bilgi kokusunun doğrudan ölçümü (K01, K02, K08).

### Ö04 · Gövde testi
**İlke:** K03'teki soruları rastgele sayfalarda sor [Krug-DMMT s.112-113].

### Ö05 · Tek soru: algılanan kolaylık
**İlke:** Her görevden sonra: "Bu görev ne kadar kolaydı? (1 çok zor - 7 çok kolay)". Haftalık değil görev bazında.
**Neden:** Algılanan kullanım kolaylığı, algılanan yararlılıkla birlikte bir teknolojinin benimsenmesini belirler [Davis-TAM]; UTAUT'ta "çaba beklentisi" [Venkatesh-UTAUT]. Kolay görünmeyen ürün yararlı olsa da kullanılmaz: Furkan'ın "aşırı karmaşık sistemi herkese satamazsın" tezinin akademik karşılığı.

### Ö06 · HEART ile ürün metriği
**İlke:** Mutluluk (Happiness), Bağlılık (Engagement), Benimseme (Adoption), Kalıcılık (Retention), Görev başarısı (Task success); her biri için Hedef → Sinyal → Metrik.
**Neden:** Büyük ölçekte kullanıcı merkezli metrik çerçevesi [Rodden-HEART]. Erişilebilirlik için en doğrudan olanı **Görev başarısı**: tamamlama oranı, süre, hata oranı.

### Ö07 · Algılanan süre
**İlke:** Görev süresiyle birlikte "Ne kadar sürdü sence?" diye sor. Algılanan süre gerçek süreden uzunsa arayüz yoruyor demektir.
**Neden:** Öznel zaman deneyimi kullanılabilirlik ve UX testlerinde ayrı bir göstergedir [Trukenbrod-2020].
