# Test protokolleri (Ö bölümü)

Otomatik denetim kural ihlalini bulur; **anlaşılırlığı** yalnız insan gösterir. Bu protokoller ucuz, hızlı ve tek kişilik ekipte uygulanabilir olacak şekilde seçildi. Kural kimlikleri `katalog.md` ile aynıdır.

İki altın kural:
- **İzle, sorma.** Test, insanların ürünü kullanmaya çalışmasını izlemektir; fikir toplamak değil [Krug-RSME s.23]. **Odak grubu kullanılabilirlik testi değildir:** 5-10 kişinin fikir ve duygusunu konuşması planlamada "ne isteniyor"u anlamaya yarar; ürünün **işe yarayıp yaramadığını** yalnız tek kişinin tipik görevi yapmaya çalışmasını izlemek gösterir [Krug-DMMT s.142-144]. Anket ve görüşme de görüş toplar, kullanımı göstermez [Krug-RSME s.23].
- **Kullanıcı suçlanmaz.** Takıldığı her yer ürünün kusurudur [Norman-DOET s.51], [Krug-DMMT s.159-168].

Otomatik denetim ve uzman incelemesi testin **yerini tutmaz**: otomatik test bilişsel kullanılabilirliği ölçemez [COGA 5.1].

---

## Ö01 · Ayda bir sabah, 3 kullanıcı

### 1. Hazırlık (30-45 dk, testten 1-2 gün önce)
1. **Görev listesi:** ürünün en önemli 5-10 görevini yaz, içinden 3-4'ünü seç [Krug-RSME s.65-67]. Seçim ölçütü: yapılamazsa ürün başarısız olur; seni geceleri düşündürür; destek taleplerinde ya da analitikte sorun görünür.
2. **Senaryoya çevir:** karakter, motivasyon, yapılacak şey ve gereken ama bilinmeyen bilgi (test hesabı, örnek veri) [Krug-RSME s.67-68].
   - **Tek zor kural: ipucu verme.** Ekranda geçen özgün kelimeyi senaryoda kullanma.
   - Kötü: "Sepetim'den Ödeme Adımı'na geç." İyi: "Seçtiğin ürünlerin parasını öde."
   - Kötü: "Filtreler menüsünü kullan." İyi: "Almanya'da Ocak'ta başvurusu kapanan bir burs bul."
3. **Hedef bazlı senaryolar ekle** [COGA 5.5]. Soru sorma, eylemle göstert:
   - Sayfanın ne için olduğunu ve neler yapılabileceğini gösterebiliyor mu?
   - Bir şeye bastırıp **tek adımda geri dönebiliyor mu**? (S13)
   - Formu bitirince **baştaki bir bilgiyi değiştir**: veri kaybetmeden yapabildi mi? (B16)
   - **Bir dakika dikkatini dağıt** (soru sor, telefona baktır), göreve kendiliğinden dönebiliyor mu? (B16)
   - Şifresini unutmuş gibi davransın: tek başına girebiliyor mu? (B05)
   - Takıldığında yardıma ya da insana ulaşabiliyor mu, mesajın nereye gittiğini ve ne zaman yanıt geleceğini anlıyor mu? (K10)
4. **Bir stresli senaryo:** son tarih ya da hata sonrası ("Başvurunun kapanmasına 10 dakika var", "Az önce ödeme reddedildi, tekrar dene"). Stres çalışma belleğini daraltır, sezgisel kullanımı düşürür [Weinschenk-100 #86 s.208], [Blackler-2010 s.6].
5. **Kısıtlar:** arama test edilmiyorsa "aramayı kullanmadan"; "bu sitede kal" [Krug-RSME s.68].
6. **Pilot (15 dk):** senaryoları evden birine oku; açık, eksiksiz, tek anlamlı mı. Senaryoları ayrı kâğıtlara, büyük puntoyla, **numarasız** yaz (sırayı değiştirebilesin) [Krug-RSME s.68-69].
7. **Ortam:** sessiz oda, bildirimler kapalı, tarayıcı geçmişi temiz (ziyaret edilmiş bağlantı rengi ipucu verir), nötr bir sayfa açık, kayıt yazılımı denendi [Krug-RSME s.71-75]. Kaygı sezgiyi bozar; rahat ortam [Blackler-2010].
8. **Önce uzman incelemesi:** test edilecek ekranları Nielsen'in 10 ilkesi ve bu katalogla gözden geçir (Claude bunu `erisilebilirlik` skill'iyle ve otomatik denetimle yapar). Nielsen'in ilkeleri tam da bu sezgisel değerlendirme için yazıldı [Nielsen-10 s.1]. Krug'un sırası: önce uzman incelemesi, sonra testi kendin yap [Krug-RSME s.15]. Bariz bulguları testten önce düzelt ki 3 kişinin sabahı bilinen sorunlara gitmesin (önerimiz).

### 2. Katılımcı
- Hedef kitleye yakın 3 kişi; **ürünü görmemiş** olsun. Arkadaş olabilir, geliştirici olamaz: geliştirici kendi ürününün en kötü test kullanıcısıdır [Norman-DOET s.171-173].
- Teknoloji aşinalığı **farklı** olsun; yalnız teknoloji meraklısı arkadaşlarla test etme [Blackler-2010]. Her turda bir "yabancı" [Krug-RSME s.55-56].
- Kendi kurduğun ölçüte takılma: "Bizim kullanıcımız da buna takılır mıydı?" sorusuyla eğriye göre notla [Krug-DMMT s.105].
- **Nereden bulunur:** tanıdıklar, sosyal medya grupları; hedef kitleden olanlar önce. Küçük bütçeyle de mümkün [COGA 5.2].
- **Bilişsel yükü en çok hissedeni de çağır:** turlarda bir kez okuma ya da dikkat güçlüğü yaşayan (disleksi, DEHB) ya da unutkanlık yaşayan bir katılımcı [COGA 5.2]. Hedef engellilik testi değil, ürünün yorgun, dikkati dağınık ya da acele eden herkes için anlaşılır olduğunu görmek (önerimiz, tanımımız: bilişsel yük + sezgisel etkileşim + bilgi kokusu).
- **Yedek katılımcı** ayarla: gelmeyen olursa yakındaki biri ya da uzaktan bir gerçek kullanıcı [Krug-RSME s.62].

### 3. Oturum akışı (kişi başı ~30 dk)

| Süre | Bölüm | Ne yapılır |
|---|---|---|
| 3 dk | Karşılama | Aşağıdaki metni **aynen oku**, doğaçlama yapma |
| 2 dk | Isınma | Meslek, günde kaç saat telefon/bilgisayar, en çok hangi uygulamaları kullanır. Gerçekten dinle |
| 2 dk | İlk izlenim | Ana ekranı göster: "Tıklamadan, bu ne, kimin, burada ne yapılabilir?" (Ö02, Ö08) |
| 15-20 dk | Görevler | Senaryoyu ver ve sesli oku. Araya girme |
| 3 dk | Sorgulama | Görev sırasında not aldığın "neden?" soruları şimdi |
| 2 dk | Kapanış | Teşekkür, hediye, soruları |

**Karşılama metni (aynen oku):**

> Merhaba, geldiğin için teşekkür ederim. Bugün bir uygulamayı deneyeceksin. Baştan söyleyeyim: **seni değil, uygulamayı sınıyoruz.** Yanlış yapabileceğin bir şey yok; takıldığın her yer bizim düzeltmemiz gereken bir yer.
>
> Senden tek bir şey isteyeceğim: aklından geçenleri **sesli söylemen**. Neye baktığını, ne aradığını, ne düşündüğünü. Garip gelebilir, alışırsın.
>
> Soru sorarsan çoğu zaman cevap vermeyeceğim; çünkü sen tek başınayken ne olacağını görmek istiyoruz. Kaba olmak için değil. Sonunda tüm sorularını cevaplarım.
>
> Bu uygulamayı ben yapmadım sayılır, kırılmam; ne düşünüyorsan açıkça söyle. İstediğin an bırakabilirsin.
>
> Ekranı ve sesi kaydetmem sorun olur mu? Kayıt yalnız bu ürünü düzeltmek için kullanılacak, kimseyle paylaşılmayacak.

(Kendi metnimiz; Krug-RSME s.81-91'deki akışa ve COGA 5.4.1'deki "kullanıcı kendini suçlamasın" ilkesine dayanır. Metinde "görüş", "geri bildirim" kelimeleri bilerek yok: katılımcıyı fikir vermeye yöneltir.)

**Anlaşılır onam** [COGA 5.3]: ne için yapıldığını, ne yapacağını, varsa riski, hangi kişisel verinin (ses, ekran) kaydedileceğini ve her an bırakabileceğini söyle. Anladığını bir soruyla doğrula: "Kaydı ne için kullanacağımı bana bir cümleyle söyler misin?" Notlarda ve kayıtlarda ad yerine takma ad.

### 4. Oturumu yönetmek
- **Sesli düşünme:** ne düşündüğünden emin değilsen sor: "Ne düşünüyorsun?", "Neye bakıyorsun?", "Ne bekliyordun?" Okuyorsa ya da emin ilerliyorsa bırak [Krug-RSME s.92].
- **Tarafsız kal:** ne yapacağını söyleme, ipucu verme (ince olanı da); soruyu soruyla cevapla ("Sen olsan ne yapardın?"); poker yüzü, hafif memnun [Krug-RSME s.92-95].
- **"Neden?" sorusunu sona sakla.** Verilen nedenler çoğu zaman sonradan uydurulur [Weinschenk-100 #90-91], [Norman-DOET s.133]; davranış neden'den güvenilirdir.
- **Sonraki göreve geç:** tamamladıysa ("başka bir yoldan da dener misin?"), mutsuzsa (her zaman katılımcının duygusundan yana hata yap), zaman dolduysa, artık bir şey öğrenmiyorsan [Krug-RSME s.87-88].
- **Refakatçi** gelebilir ama işi yapmasın; yardım ettiyse o yardım bir tasarım hatası göstergesidir [COGA 5.4.1].
- **Süre ölçülecekse** (Ö07) o görevde sesli düşünme isteme: sesli düşünme süreyi uzatır [Trukenbrod-2020 s.11].
- **Etik:** katılımcı odadan girdiğinden kötü durumda çıkmaz. Soyadı ve yüz kaydı yok; kayıtlar kişisel denetimde, iş bitince silinir. **Test notları ve kayıtlar depoya girmez**, takma ad kullanılır [Krug-RSME s.95-96].

### 5. Gözlem formu (her görev için bir satır)

| Alan | Doldurma |
|---|---|
| Görev | kısa ad |
| Sonuç | ✓ tamamladı · ~ yardımla · ✗ yapamadı |
| Süre | gerçek süre (dk:sn); mutlak değil **görevler arası göreli** süreye bak [COGA 5.4] |
| İlk tık doğru mu | evet/hayır (Ö03) |
| Kolaylık 1-7 | Ö05 |
| Tahmini süre | "Ne kadar sürdü sence?" (Ö07) |
| Gözlem işaretleri | aşağıdaki listeden kodlar |
| Alıntı | en çarpıcı tek cümle (soru işareti ya da ünlem anı) |

**Gözlem işaretleri** (kodla kaydet):
- **N** not kâğıdına, telefona yazma = çalışma belleği aşımı [Weinschenk-100 #20 s.68] → B05
- **T** aynı işe yaramayan eylemi tekrar tekrar deneme (tünel eylemi) [Weinschenk-100 #86, #89] → S04, S09
- **H+ / H− / H0** hata ve sonucu: öğretti / çıkmaza soktu / etkisiz [Weinschenk-100 #87]; türü: fazladan adım, atlanan adım, yanlış eylem [Weinschenk-100 #88]
- **E** tek yolu ezberleyip gerisinden kaçma [Norman-DOET s.24] → S11
- **K** korkuyla duraksama, "basarsam bozulur mu?" [Norman-DOET s.199-200] → B14
- **B** "ben yapamıyorum" deyip bırakma [COGA 4.2.5] → kritik
- **G** geri tuşuna basıp beklenmedik yere düşme [COGA 4.5.2] → S13
- **O** okumadan tarayıp yanlış bağlantıya tıklama (koku kopukluğu) → K01, K04
- **Y** yardım arama: SSS, iletişim, "nereden soracağım" → K10

### 6. Aynı gün değerlendirme (30 dk)
1. Yalnız en az bir oturumu izleyen katılabilir [Krug-RSME s.116-117].
2. Herkes kendi listesinden **en ciddi 3 sorunu** söyler. Birleştir.
3. **Önem = kaç kişi yaşar × yaşayana ne kadar ağır** [Krug-RSME s.117-118]. Kritik: görevi engelledi, veri kaybettirdi, güveni yıktı. Uyarı: zorlaştırdı. Bilgi: rahatsız etti.
4. Her sorun için **en küçük düzeltme**: önce bir şey kaldır, sonra ince ayar, en son yeniden tasarım (katalog: düzeltme kuralı).
5. **Özellik önerilerine şüpheyle bak**: kullanıcılar tasarımcı değil [Krug-RSME s.88-89].
6. **"Tabii ki" testi** (önerimiz): düzeltmeyi okuyunca ekipteki herkes "tabii ki, bu açık" diyorsa doğru düzeltmedir; tartışma çıkıyorsa sorun henüz anlaşılmamıştır, sonraki turda tekrar bak. Düzeltilmesi gereken sorunlar çoğunlukla kanıt gerektirmeyecek kadar bariz olur [Krug-RSME s.41].
7. **"İnsan bunu yapar mıydı?" testi:** düzeltme gerçek bir insana (yardımsever bir tezgâhtara) yakışan bir davranış mı? Kullanılabilirlik bir nezakettir [Krug-DMMT s.203-211]: tezgâhtar müşteriye kimlik numarasını üç kez sordurmaz, formu sıfırlamaz, "hata 401" demez (B16, B17, B08).

### 7. Kayıt
Projenin `HANDOFF.md` günlüğüne tek satır: tarih · görev başarı oranı · ortalama kolaylık · ortalama algılanan süre oranı · düzeltilen 3 sorun. Bir sonraki tur aynı görevlerle yapılır, kıyas mümkün olsun.

**Küçük rapor** (paylaşılacaksa): 2 dakikada okunacak, 30 dakikada yazılacak, madde madde: ne test edildi, görevler, düzeltilecek sorunlar, kayıtlara erişim, sonraki test tarihi [Krug-RSME s.120]. "Nasılsa yeni projede değişecek" deme; sor: **"Çoğu kişi için bu sorunu hiç değilse yumuşatacak en küçük değişiklik ne?"** [Krug-RSME s.120].

### 8. Uzaktan varyant (tek kişilik ekip, katılımcı başka şehirde)
Yüz yüze testin yaklaşık **%80 faydası, %70 emeği**; aynı odada olmanın zenginliği, netleştirme ve kontrol (kesinti) kaybolur [Krug-RSME s.149-150]. İlk birkaç tur (yaklaşık 3 aylık) yüz yüze, sonra uzaktan [Krug-RSME s.154].
- **Moderatörlü:** katılımcı **kendi bilgisayarından** ya da telefonundan ürüne girer, sen ekran paylaşımıyla izlersin (gecikme onu etkilemesin). Paylaşım yazılımı katılımcı için 1 dakikadan kısa sürede kurulmalı; e-postasını ve bildirimlerini gizlemesini söyle [Krug-RSME s.151]. Akış, karşılama metni ve gözlem formu aynıdır; onamı kayıttan önce yine sesli al.
- **Moderatörsüz:** adres + 1-2 kısa görev + katılımcı profili; katılımcı ~15 dakikalık sesli düşünme kaydı gönderir. Soru soramazsın ama ucuz ve hızlı; aylık turda yer bulamayan sorular ve **düzeltme sonrası hızlı yeniden test** için ideal [Krug-RSME s.152-154], [Krug-DMMT s.170-171].

---

## Ö02 · 5 saniye testi
Ekranı 5 sn göster, kapat. Sor: "Bu ne? Burada ne var? Burada ne yapabilirsin? Neden başka yerde değil de burada?" 3 kişiden 2'si amacı doğru söyleyemiyorsa B01, B03, S08'e bak [Krug-DMMT s.119-125].
Tek başına çalışırken: ekran görüntüsünü 5 sn bak, kapat, amacı yaz; sonra karşılaştır. Zayıf ama hiç yoktan iyi.

## Ö03 · İlk tıklama testi
Ekran görüntüsü üzerinde: "X'i yapmak için ilk nereye tıklardın?" Her görev için doğru ilk tık oranını yaz. İlk tık doğruysa görev büyük olasılıkla tamamlanır [Krug-RSME s.132-135]. %80 altı: etiket (K01, K02) ya da hiyerarşi (B01, S08) sorunu.

## Ö04 · Gövde testi [Krug-DMMT s.112-113]
Rastgele, tercihen derin bir iç sayfa aç. Gözünü kıs ya da ekranı kol boyu uzakta tut. 10 sn içinde cevapla: Bu hangi site? Bu hangi sayfa? Ana bölümler neler? Şu an hangisindeyim? Nasıl ararım? Her "bilmiyorum" bir K03 ya da S10 bulgusudur.

## Ö05 · Algılanan kolaylık (tek başına kanıt değil)
Her görevden **hemen sonra**: "Bu görev ne kadar kolaydı?" 1 (çok zor) - 7 (çok kolay). Görev ortalaması 5,5 altıysa görev yeniden tasarlanır.
Sayılı ölçek katılımcıyı zorluyorsa (okuma güçlüğü, yorgunluk): **5 yüzlü gülen yüz ölçeği** ya da üç seçenek, "çok beğendim / idare eder / hiç beğenmedim" [COGA 5.4.1].

**Uyarı:** öz bildirim güvenilmez. Neredeyse ağlayacak kadar zorlanan kişi 7 üzerinden "6" verebilir [Krug-RSME s.99]; günler sonra sorulan memnuniyet daha olumlu çıkar [Weinschenk-100 #83]. Anılar her hatırlamada yeniden kurulur ve sorunun kelimesi cevabı değiştirir: geçmiş davranışı sorma, gözle [Weinschenk-100 #24 s.75-76]. Geri bildirim en doğru **yüz yüze** toplanır; e-posta anketinde olumsuzluk ve yanlış artar [Weinschenk-100 #67 s.167-169]. Puanı **gözlenen başarı ve hata ile birlikte** yorumla; "puan yüksek, geçti" deme.

**İsteğe bağlı kısa ölçek** (Davis-TAM s.14'teki 6+6 maddeden Türkçe uyarlama; 1 kesinlikle katılmıyorum - 7 kesinlikle katılıyorum). Bilimsel geçerliliği Türkçede sınanmadı; turlar arası kıyas için kullan.

| Kolaylık | Yararlılık |
|---|---|
| Kullanmayı öğrenmek kolaydı | İşimi daha hızlı yapmamı sağlar |
| İstediğimi ona yaptırabildim | İşimi daha iyi yapmamı sağlar |
| Ne olduğu açık ve anlaşılırdı | Daha çok iş çıkarmamı sağlar |
| Farklı yollarla yapmama izin verdi | İşimi daha etkili yapmamı sağlar |
| Ustalaşmak kolay olur | İşimi kolaylaştırır |
| Genel olarak kullanması kolaydı | Genel olarak işime yarar |

Kolaylık yüksek, yararlılık düşükse: ürün kolay ama gereksiz; sadeleştirme yararlılığı kesmiş olabilir (katalog ilke 4: denge). Hiçbir kolaylık işe yaramayan sistemi kurtaramaz [Davis-TAM s.16-17].

**Teşhis listesi** (Davis-TAM s.7-9'daki 14 maddelik havuz; kolaylık puanı düşükse nedenini bulmak için katılımcıya değil **kendine** sor, gözlem formuna bakarak):
kafa karıştırıcı mı · hataya açık mı · sinir bozucu mu · **kılavuza bağımlı mı** · **çok zihinsel çaba** istiyor mu · hatadan kurtulmak zor mu · katı mı · istediğini yaptırmak kolay mı · **beklenmedik davranıyor mu** · hantal mı · anlaşılır mı · nasıl yapıldığını **hatırlamak kolay mı** · yardımcı rehberlik sunuyor mu · genel olarak kolay mı.
Üç küme: fiziksel çaba (S07, B10), zihinsel çaba (B01-B05), öğrenme ve hatırlama (S16, K10).

## Ö06 · HEART metrikleri [Rodden-HEART]
Canlı üründe, analitikle. Her boyut için **Hedef → Sinyal → Metrik**:
1. **Hedef:** kullanıcı hangi görevi yapabilmeli? (Ölçebilir miyiz diye bu aşamada takılma.)
2. **Sinyal:** başarı ya da başarısızlık davranışta nasıl görünür? Başarısızlık çoğu zaman daha kolay görülür: yarıda bırakma, geri al, aynı alana tekrar tekrar dönme.
3. **Metrik:** ham sayı değil oran ya da kullanıcı başı ortalama. Önemli eylemin gerçekten kaydedildiğini doğrula.

| Boyut | Hedef örneği | Sinyal | Metrik |
|---|---|---|---|
| Görev başarısı | Kullanıcı ilk bursunu ekleyebilsin | "Burs eklendi" olayı | Kayıttan sonra 1 gün içinde ilk burs ekleme oranı; formda hata gösterim oranı |
| Benimseme | Yeni özellik kullanılsın | Özelliğin ilk kullanımı | 7 günde kullanan yeni kullanıcı oranı |
| Kalıcılık | Geri gelsinler | Tekrar ziyaret | 4. hafta dönen oran |
| Mutluluk | Kolay bulsunlar | Ö05 anketi | Ortalama kolaylık |
| Bağlılık | Düzenli kullansınlar | Oturum | Haftalık aktif gün, kullanıcı başı |

**Erişilebilirlik sinyal seti** (önerimiz): formda hata gösterim oranı · adım bazında terk · geri al/iptal oranı · aynı sayfada 3+ geri-ileri gezinme ("kaybolma") · boş dönen arama oranı · kilit görevi ilk oturumda tamamlama oranı · yardım/iletişim sayfasına gelişten önceki sayfa (nerede takılıyorlar).
**A/B testi:** iki arayüz seçeneği, benzer iki kullanıcı grubuna verilir ve HEART metrikleriyle kıyaslanır. Örnek: Google Haritalar tek arama kutusunu çift kutuya karşı denedi, hata oranlarını kıyasladı [Rodden-HEART s.1-3]. Yalnız iki grubu ayırmaya yetecek trafikte anlamlıdır; az kullanıcılı üründe Ö01 ve düzeltme sonrası koridor testi daha çok şey söyler (önerimiz).
Erişilebilirlik için birincil metrik **görev başarısı**; diğerleri onun sonucudur. Yeniden tasarımdan sonra ilk hafta düşüş normaldir (değişime direnç); karar için eğilimi bekle (S15). Analitik **ne** olduğunu söyler, **neden** olduğunu söylemez: nedeni Ö01 gösterir [Krug-RSME s.29-30].

## Ö07 · Algılanan süre [Trukenbrod-2020]
Görev bitince, değerlendirme yapıldığını belli etmeden: "Ne kadar sürdü sence?" (dakika). **Algılanan süre oranı = tahmini süre / gerçek süre.** Oran > 1,3 ise kullanıcı yorulmuştur.

İsteğe bağlı 4 maddelik ölçek (11 basamak, Trukenbrod-2020 s.4'ten Türkçe uyarlama; ortalaması alınır, yüksek = olumsuz):
1. Görevin süresi: kısa (1) ... uzun (11)
2. Süre: uygundu (1) ... uygun değildi (11)
3. Süre: kabul edilebilirdi (1) ... kabul edilemezdi (11)
4. Görev sırasında zaman: hızlı geçti (1) ... yavaş geçti (11)

Kullanıcı uzun ama anlamlı işi cezalandırmaz; **kötü kullanılabilirlikten doğan uzunluğu** cezalandırır [Trukenbrod-2020 s.6]. Süre ölçülen görevde sesli düşünme isteme.

## Ö08 · Sezgisel ilk kullanım ve ilk izlenim [Blackler-2010]
Ürünü hiç görmemiş kişiye kilit görevin ilk adımını göster: "Şunu yapmak istesen ne yapardın?"
- **Sezgisel sayılır:** 5 saniye içinde, emin (duraksamadan, "galiba" demeden) ve doğru.
- **Sezgisel ilk kullanım oranı** = bu üç şartı sağlayan deneme / toplam deneme. Hedef ≥ %80.
- Teknoloji aşinalığı farklı katılımcılarla ölç; sakin ortamda (kaygı sezgiyi düşürür).
- **İlk izlenim:** ekranı 1-2 sn göster: "Bu kolay mı görünüyor, güvenilir mi?" İlk bakışta "zor" denen ürün sonradan kolay bulunsa bile çoğu kullanıcı o ana gelmez [Weinschenk-100 #57], [Krug-DMMT s.120].
- **Norman'ın yedi aşama soruları** [Norman-DOET s.68-69], her kilit ekran için ekip kendine sorar: İşlevi anlamak ne kadar kolay? Hangi eylemlerin mümkün olduğunu söylemek? Niyetten harekete eşlemeyi bulmak? Eylemi yapmak? Sistemin durumunu görmek? Durumu yorumlamak? İstenen durumda olup olmadığını anlamak?

---

## Hangi test, ne zaman

Kural: **mümkün olan en erken** test et [Krug-DMMT s.157].

| Durum | Test | Süre |
|---|---|---|
| Tasarıma başlamadan | **Gerçek ihtiyaç:** kullanıcının bugün işini hangi araçla, nasıl yaptığını yerinde gör [Norman-DOET s.47-49]; karmaşayı tanıma soruları ve niyet alıştırması (aşağıda) | 1 saat |
| Tasarıma başlamadan | Rakip ürünü 3 kişiyle test et (Ö01, kendi ürünün yokken) [Krug-DMMT s.157] | 1 sabah |
| Fikir, peçete eskizi | **Peçete eskizi testi:** kim olursa, 5 dakikadan kısa: "Bunun ne olduğunu düşünüyorsun?" Beğeni ya da görüş sorma, ne olduğunu çözmesini iste [Krug-RSME s.47-49] | 5 dk |
| Eskiz, tel kafes, kâğıt prototip | Ö01 kâğıt ya da ekran görüntüsü üzerinde; bir önceki sürümü **ve** sıradakinin kâğıt prototipini aynı turda [Krug-RSME s.39-40] | yarım sabah |
| Her arayüz değişikliği | Otomatik denetim: `denetle.mjs` (+ form değiştiyse `--etkilesim`), `statik.mjs` | 2 dk |
| Yeni ekran ya da akış | Ö02 + Ö04 (tek başına, ekran görüntüsüyle) + uzman incelemesi (Ö01 hazırlık 8) | 5 dk |
| Önemli sürüm öncesi | Ö01 (3 kişi) + Ö03 + Ö05 + Ö08 | 1 sabah |
| Düzeltme sonrası doğrulama | Çoğu zaman bakınca anlaşılır; emin değilsen **koridor testi** (birine yalnız ilgili görevi yaptır), uzaktan tek kullanıcı ya da moderatörsüz test [Krug-RSME s.129-130, s.152-154] | 15 dk |
| Canlı ürün, ayda bir | Ö06 sinyalleri + Ö01 | 1 sabah |
| Yeniden tasarım | **Önce mevcut ürünü** test et (neyin çalıştığını bozmamak için) [Krug-DMMT s.157]; önce/sonra Ö01 aynı görevlerle + Ö06 eğilimi + taban çizgisi | 2 tur |
| Yeterli trafik, iki seçenek | A/B testi, HEART metrikleriyle [Rodden-HEART s.1-3] | haftalar |
| Kullanılabilirlik sorusu | **Odak grubu değil**, Ö01 [Krug-DMMT s.142-144] | |

## Tasarıma başlamadan: karmaşayı tanı, niyeti yaz

**Karmaşayı tanıma soruları** [Covert-IA s.28]: kullanıcılar kim, onları nasıl tanıyorsun, **karmaşayı kendi kelimeleriyle nasıl anlatıyorlar**; paydaşlar ve beklentileri; hangi bilgi var, hangisi eksik ve eksiklikten hangi yorum doğuyor; durum fazla mı, eksik mi, yanlış mı.

**Niyet alıştırması** [Covert-IA s.48]: kullanıcıların ürünü tarif ederken kullanmasını istediğin **sıfatlar** ve kullanılmamasına razı olduğun sıfatlar. İki liste birbirini tekrarlamaz, birbirinin zıddı değildir, olumsuz sıfat yoktur: dışarıdan bakan hangisinin "iyi" liste olduğunu anlayamamalı. Ör. Örnek Uygulama: "sakin, güvenilir, sade, yol gösteren" / "kapsamlı, eğlenceli, sosyal, özelleştirilebilir". Her projenin `erisim/niyet.md` dosyasında durur; tasarım kararında iki seçenek arasında kalınca listeye bakılır.

## Yolculuk haritası (yeni akış ya da yeniden tasarımda)

Satırlar bağlam (ekran, kanal, kullanıcının durumu), noktalar olay [Covert-IA s.70-87]. Her olayın yanına kullanıcının duygusunu yaz ve iki noktayı işaretle [LawsOfUX: Peak-End]:
1. **Zirve:** duygunun en yoğun olduğu an (ör. "Başvuruyu gönder"e basma). Olumsuzsa hafiflet: bekleme varsa ilerleme ve tahmini süre, belirsizlik varsa ne olacağını önceden söyle (S14).
2. **Son:** akışın bittiği an. Açık bir başarı ekranı ve sonraki adım (S04, K07).
İnsanlar deneyimi bu iki andan hatırlar; ortadaki küçük sürtünmeler yerine önce bunları düzelt.
