# Erişilebilirlik kural kataloğu (v0.4)

**Erişilebilirlik** burada şu demek: nihai kullanıcı ürünü **kılavuz okumadan, destek aramadan, zihinsel yorgunluk yaşamadan** anlar ve kullanır. Bu, WCAG uyumu değildir; üç boyutu vardır:

| Kod | Boyut | Literatürdeki adı | Sorduğu soru |
|---|---|---|---|
| **B** | Bilişsel yük | Cognitive Accessibility, Cognitive Load Theory | Bunu anlamak ne kadar zihinsel çaba istiyor? |
| **S** | Sezgisel etkileşim | Intuitive Interaction, affordance, mental model | Nasıl kullanılacağı ilk bakışta belli mi? |
| **K** | Bilgi kokusu | Information Scent, Information Foraging, IA | Aradığımı bulacağımdan tıklamadan önce emin miyim? |
| **Ö** | Ölçüm | TAM, UTAUT, HEART, kullanım testi | Gerçekten kolay mı, yoksa bize mi kolay geliyor? |

## Okuma kılavuzu

**Her kuralın satırları:** İlke (ne), Neden (kaynak), Denetim, Yap / Yapma, Ödünleşim. *Denetim* satırı üç türdür: **OTOMATİK** (`denetim/denetle.mjs` yakalar), **YARI** (araç işaret eder, insan karar verir), **ELLE** (yalnız gözle ya da testle). Otomatik araç sorunların bir kısmını yakalar; Ö bölümündeki testler atlanmaz [COGA 5.1].

**Kaynak gösterimi:** `[Kısaltma s.N]`, N kaynak PDF'inin fiziksel sayfasıdır (baskı numarası değil). Weinschenk için madde numarası da verilir (`#20`). Kısaltmalar `kaynakca.md`'de; kaynağın ayrıntılı notu depoda `kaynakca/notlar/<Kısaltma>.md`. Doğrulamak için: `py -I araclar/bul.py "<kelime>" <kısaltma>`.

## Beş temel ilke (bütün kuralların üstünde)

1. **Senin suçun değil, tasarımın.** Kullanıcı bir şeyi yapamıyorsa kusur tasarımdadır. İnsanlar basit görünen şeyde zorlanınca kendini suçlar ve bunu bildirmez; destek talebi azlığı kolaylık kanıtı değildir [Norman-DOET s.4-6, s.51, s.56-57], [Krug-DMMT s.37-38].
2. **Talimat gerekiyorsa tasarım başarısızdır.** "Basit şeyler resim, etiket ya da talimat gerektiriyorsa tasarım başarısız olmuştur" [Norman-DOET s.25]; "bir şeyin üzerine talimat yapıştırmak gerekiyorsa kötü tasarlanmıştır" [Norman-DOET s.8]; açıklama kullanıcıya "bunu nasıl hatırlayacağım?" dedirtiyorsa tasarım başarısızdır, "tabii ki" dedirtmeli [Norman-DOET s.204].
3. **Hata olacak; hata için tasarla.** "Bir hata mümkünse biri onu yapacaktır." Hatayı baştan önle, olursa kolay fark edilsin, sonucu küçük ve geri alınabilir olsun [Norman-DOET s.52, s.147], [Weinschenk-100 #85 s.204].
4. **Denge: kolaylık yararlılığı kesmez.** Kolaylık ilk temasta belirleyicidir ve algılanan yararlılığı büyütür (0,61-0,64) [Davis-TAM], [Venkatesh-UTAUT], [Iranmanesh-2022]; ama hiçbir kolaylık işe yaramayan ürünü kurtarmaz. Her kaldırma kararında sor: "Bu, kullanıcının asıl işini yapmasını engelliyor mu?" Çok az bilgi de çok fazla kadar engeldir [COGA 4.6.3].
5. **Kapsam yaş değil deneyimdir.** Desenler herkesin bilişsel yükünü düşürür [COGA 4.1]; hata stratejilerindeki fark yaşa değil cihaz türüne deneyimsizliğe bağlı çıkmıştır [Weinschenk-100 #89 s.215]; "hepimiz derinde acemiyiz", uzman da acemiye yetecek netlikten asla zarar görmez [Krug-DMMT s.151-152]. Tasarımcı ve geliştirici tipik kullanıcı değildir: ürünü kafadaki bilgiyle, ilk kez gelen kullanıcı dünyadaki bilgiyle kullanır [Norman-DOET s.171-173].

## Önem modeli ve düzeltme kuralı

**Önem iki eksenlidir:** kaç kişi yaşayacak × yaşayana ne kadar ciddi [Krug-RSME s.117-118]. Denetim aracı bunu üç düzeye indirir:

| Düzey | Anlamı | Puan etkisi |
|---|---|---|
| **kritik** | Görevi engeller, veri kaybettirir ya da güveni yıkar (ham sistem çıktısı, etiketsiz alan, önceden işaretli pazarlama izni) | boyut puanından −15; araç çıkış kodu 1 |
| **uyarı** | Görevi zorlaştırır, hata olasılığını artırır | −5 |
| **bilgi** | Olası sorun ya da ince ayar fırsatı; insan karar verir | 0 |

Aynı kural, aynı düzey ve aynı mesaj kalıbı birden çok sayfada çıkarsa bir kez cezalandırılır. Kritik düzey **az ve kesin** tutulur, bilgi düzeyi geniş: ıskanın pahalı olduğu yerde sinyal güçlü, yanlış alarmın pahalı olduğu yerde zayıf olmalı [Weinschenk-100 #49 s.128-129]; muğlak uyarı listesi geliştiricinin cesaretini kırar [Krug-DMMT s.218].

**Düzeltme kuralı (sırayla):** (1) **Önce bir şey çıkar.** İlk dürtü talimat, metin, renk eklemektir; çoğu zaman doğru çözüm anlamı gizleyen şeyi kaldırmaktır [Krug-RSME s.128-129], [Krug-DMMT s.169-170], [Covert-IA s.173], [LawsOfUX: Occam]. (2) **İnce ayar:** boyut, konum, görünüm, kelime; işe yaramazsa aynı ayarın güçlüsü [Krug-RSME s.126-127]. (3) **En son yeniden tasarım.** Sor: "Gözlediğimiz sorunu çoğu kişi için önleyecek en küçük değişiklik ne?" [Krug-RSME s.123]. Ciddi sorun için yeniden tasarımı bekleme [Krug-RSME s.124].

---

## B · Bilişsel yük

### B01 · Ekranda tek birincil eylem
**İlke:** Her ekranda gözün kilitleneceği tek bir ana eylem olur. Beş buton aynı büyüklükte ve aynı parlaklıktaysa kullanıcı nereye basacağını bilemez.
**Neden:** Dikkat çekmenin en iyi yolu bir öğeyi diğerlerinden farklı kılmaktır; her şey farklıysa hiçbiri öne çıkmaz [Weinschenk-100 #5 s.27-28]. Kullanıcı en iyiyi değil ilk makul seçeneği seçer, bu yüzden ilk göze çarpan doğru olmalı [Krug-DMMT s.42-44]. Önemli olan daha belirgin olmalı [Krug-DMMT s.56-57]; ince görsel ayrımlar kaçırılır, gereken şey "düşündüğünden fazla" öne çıkar [Krug-RSME s.136-139]. Giriş noktaları giriş noktası gibi görünmeli [Krug-DMMT s.128-129]. [COGA 4.3.4], [Furkan-Notlar §7].
**Denetim:** OTOMATİK. İlk ekranda dolgulu, doygun renkli buton sayısı > 1 bilgi, > 3 uyarı. Birincil görünümlü buton ilk ekranda yok ama sayfanın aşağısında varsa bilgi [COGA 4.3.1, 4.3.4].
**Yap:** bir `variant="primary"`, gerisi `secondary`/`ghost`. **Yapma:** "Satın al", "Dene", "Kaydol", "İndir" yan yana dört renkli buton.
**Ödünleşim:** Gerçekten eşit iki yol varsa (Giriş yap / Kaydol) ikisi de görünür olabilir; biri yine de daha belirgin olsun.

### B02 · Seçenekleri sınırla, gerisini aşamalı aç
**İlke:** Ekranda **beş ya da daha az ana seçenek**, ideali 3-4. Fazlası 3-4 öğelik gruplara bölünür ya da "Daha fazla" altına, ikinci adıma, ayarlara gider. Gizlenenin **varlığı belli** olur.
**Neden:** Bu eşiğin kaynağı Miller'ın "7±2"si değildir: o bir konuşmadır ve sayı "şehir efsanesi"dir; çalışma belleği 3-4 öğeyle çalışır [Weinschenk-100 #20 s.66-68], [LawsOfUX: Miller]. İnsanlar 3-4 seçenek arasından karar verebilir; 24 reçellik masa daha çok kişiyi durdurdu ama 6 reçellik masa on kat satış yaptı [Weinschenk-100 #92 s.222-223]. Her ekranda ≤ 5 ana seçenek, ekstralar "Daha fazla" altında [COGA 4.6.3]; basit bir uygulama 3-6 işlevdir [COGA 4.9.3]. Aşamalı açma yalnız o an gereken bilgiyi verir, ama **ancak doğru önceliklendirme araştırmayla bilinirse** işe yarar [Weinschenk-100 #27 s.82-84]. Karmaşıklık özellik sayısının karesiyle artar; tedavi ölçülülük ve modülerleştirmedir [Norman-DOET s.188-191]. Görünüş karmaşıklığı kontrol sayısından, kullanım zorluğu doğru kontrolü bulma + işlevi yürütme zorluğundan gelir: ikisini birden çözmek için **o an kullanılmayan kontrolleri gizle, kullanılana ayrı görünür kontrol ver** [Norman-DOET s.224-225]. Gizlenen grup görünmezse kullanıcı görüneni tamamı sanır [LawsOfUX: bilişsel yük]. Ana sayfa "bir şey daha" eklemeleriyle aşırı otlatılır [Krug-DMMT s.129-130]. [LawsOfUX: Hick], [Furkan-Notlar §3, §6]. Kalıcı gezinme yalnız 4-5 aracı (giriş, yardım, sepet, iletişim...) taşıyabilir, fazlası kalabalıkta kaybolur; az kullanılanlar altbilgiye [Krug-DMMT s.100-101]. Esneklik her zaman kolaylık değildir, acemide kolaylığı bozar: özelleştirme bolluğunu ikinci katmana sakla [Davis-TAM s.14].
**Denetim:** OTOMATİK. Ana menüde görünür öğe 6-7 bilgi, > 7 uyarı; ilk ekranda tıklanabilir öğe > 30 uyarı; 15'ten fazla seçenekli açılır liste uyarı. Üst bölümde 5'ten çok araç bağlantısı (giriş, kayıt, yardım, iletişim, sepet...) uyarı; liste `sozluk.json → arac` [Krug-DMMT s.100-101].
**Yap:** "Gelişmiş filtreler" bağlantısı; filtreler sonuç sayfasında, giriş sayfasında değil [LawsOfUX: Google]; paket seçiminde 3 seçenek, biri "Önerilen". Ana sayfaya ekleme önerisi gelince ilk soru: "Neyi çıkarıyoruz?"
**Ödünleşim:** Uzman araçlarında (muhasebe paneli) yoğunluk beklenir; o zaman gruplama, sabit yerleşim ve hızlandırıcıyla taşı (B15, S05). Ekranda az seçenek (dar-derin) ile az adım (geniş-sığ) arasında seçim göreve göre testle yapılır [Covert-IA s.152-153], [Norman-DOET s.137-141].

### B03 · Gereksiz kelimeyi at
**İlke:** Metnin yarısını sil, kalanın yarısını da sil. Karşılama paragrafları ("Sitemize hoş geldiniz…") ve uzun talimatlar ölür.
**Neden:** Kullanıcı okumaz, tarar; sayfa ona hızla geçilen bir reklam panosudur [Krug-DMMT s.39-42]. Fazla kelime okunmasa bile sayfayı göz korkutucu gösterir; "mutlu konuşma" ve "talimatlar ölmeli" [Krug-DMMT s.77-80]. Fazlalık gerekli olanın görünürlüğünü azaltır [Nielsen-10 #8]. İlk 1-2 saniyede büyük yazı, boşluk ve sayfada daha az şey "kolay kullanılır" izlenimi verir [Weinschenk-100 #57 s.146-148]. [COGA 4.4.5], [COGA 4.6.3], [LawsOfUX: Occam]. Rutin eylemde (tekrar eden kayıt, yenileme) fazla bilgi, alışkanlıkla verilen kararı değer kararına çevirip kullanıcıyı durdurur [Weinschenk-100 #97 s.232-233]. Bir kez giren özellik kimse şikâyet etmedikçe nesiller boyu kalır ("R düğmesi"): her özellik yerini her sürümde yeniden hak etsin [Norman-DOET s.37]. Özellikleri kullanıcılar ister, tasarımcılar uyar; her yeni özellik karmaşıklığı büyütür (sürünen özellikçilik) [Norman-DOET s.188-193].
**Denetim:** OTOMATİK. Masaüstü ilk ekranda > 250 kelime uyarı. "Hoş geldiniz / Welcome" ile başlayan paragraf uyarı (mutlu konuşma).
**Yap:** "Burslarım" başlığı + tek satır açıklama. **Yapma:** başlık altında 3 paragraf ürün tanıtımı, kurumsal misyon cümlesi [Krug-DMMT s.123-125].

### B04 · Sade dil
**İlke:** Kısa cümle (≤ 20 kelime), günlük kelime, etken çatı ve doğrudan hitap, tek cümlede tek fikir, çift olumsuz ve mecaz yok. Teknik terim, kısaltma ve şirket içi ad yerine kullanıcının kelimesi. Türkçe karakterler eksiksiz.
**Neden:** [COGA 4.4.1 açık kelimeler, kısaltmayı aç], [COGA 4.4.2 basit zaman ve çatı], [COGA 4.4.3 çift olumsuz yok], [COGA 4.4.4 mecazsız dil], [COGA 4.4.5 kısa paragraf, 3+ öğe liste], [COGA 4.4.6 Roma rakamı yok], [COGA 4.4.7 dilin harfleri], [Nielsen-10 #2], [Furkan-Notlar §2]. Sevimli, pazarlama kaynaklı, şirkete özgü ve teknik adlar düşündürür [Krug-DMMT s.32-33]. Okumak anlamak değildir; okunabilirlik formülü terminolojiyi hesaba katmaz, yalnız kaba göstergedir; başlık anlamayı belirler [Weinschenk-100 #14 s.49-53]. Gereksiz zor sunum dışsal yük üretir [Hollender-2010 s.2]. Tamamı büyük harf bağırma olarak algılanır [Weinschenk-100 #13 s.46-48]. "Önceden programlanmış toplama grubu ne, neden bilmek isteyeyim?" [Norman-DOET s.34].
**Denetim:** OTOMATİK. 20 kelimeden uzun cümle; okunabilirlik < 50 (Türkçe Ateşman, İngilizce Flesch); `sozluk.json → jargon`; ASCII'ye düşmüş Türkçe kelime ("basvuru", "sifre") uyarı; açıklamasız büyük harf kısaltma bilgi; edilgen "-ılmalı/-ilmeli" kalıbı bilgi; 50 kelimeyi aşan paragraf bilgi; 5+ kelimelik tamamı büyük harf metin bilgi; Roma rakamı bilgi. Cümlede 3 ya da daha çok virgül bilgi: listeye çevir [COGA 4.4.3]. Türkçe edilgen geniş zaman ("alınır, bildirilir") 3 ve üstü bilgi; "-ebilir" yeterlilik eki sayılmaz [COGA 4.4.2].
**Yap:** "Şifren yanlış görünüyor, tekrar dener misin?" "Formu doldurun." "KVKK (Kişisel Verilerin Korunması Kanunu)" ilk geçişte. **Yapma:** "Kimlik doğrulama başarısız (Auth Error 401)", "Form doldurulmalıdır.", "Basvuru Formu".
**Öncelik sırası:** en az emekle en çok kazanç için önce başlıklar, etiketler, gezinme öğeleri, talimatlar, hata mesajları ve kullanıcının hakkını/parasını etkileyen metin sadeleşir [COGA 4.4.1].

### B05 · Hatırlatma, ezberletme
**İlke:** Kullanıcı önceki adımda gördüğünü, seçtiğini, girdiğini ya da bir kodu aklında tutmak, kopyalamak, hesaplamak zorunda kalmaz; ekranda görür. Giriş belleğe dayanmaz.
**Neden:** Tanımak hatırlamaktan kolaydır [Nielsen-10 #6], [Weinschenk-100 #22 s.71-72]. Çalışma belleği sınırlı ve kesintiye çok duyarlıdır; bir sayfadan diğerine bilgi taşıttırma [Weinschenk-100 #19 s.64-65]; unutmayı hesaba kat [Weinschenk-100 #25 s.77-78]. Bilgi dünyada olunca öğrenme gerekmez ve ilk karşılaşmada kolaylık yüksektir [Norman-DOET s.72-74, s.95-96]. Makinenin işi için kullanıcıya kod, numara, şifre ezberletmek "farkında olmadan bir zorbalıktır" [Norman-DOET s.79-82]. Şifre alanına yapıştırmayı engellemek, kopyalama gerektiren doğrulama, CAPTCHA belleğe ve bilişsel beceriye dayanır; daha uzun şifre ve sık değişiklik dayatmak güvenliği **azaltır** [COGA 4.7.1, 4.7.2, 4.5.11], [COGA 4.7.5], [Furkan-Notlar §5]. Kullanıcı ürünü kullanırken not kâğıdına başvuruyorsa çalışma belleği aşılmıştır [Weinschenk-100 #20 s.68].
**Denetim:** OTOMATİK + ELLE. Şifre alanında yapıştırma engeli uyarı; şifre/e-posta alanında `autocomplete="off"` uyarı; CAPTCHA çerçevesi uyarı. ELLE: çok adımlı akışta her adımda "şimdiye kadar seçtiklerin" özeti.
**Yap:** sepet özeti kenarda sabit; "0532 000 00 00" biçim örneği; şifre kuralı alanın yanında; Google ile ya da e-posta bağlantısıyla giriş.
**Ödünleşim:** Gerçek güvenlik gereksinimi varsa sürtünme tek noktada olsun ve kurtarma yolu açık olsun [Norman-DOET s.221].

### B06 · Her alanın görünür etiketi
**İlke:** Her form alanının üstünde ya da yanında kalıcı, görünür bir etiket olur. Placeholder etiket değildir: yazmaya başlayınca soru kaybolur.
**Neden:** [COGA 4.5.6 açık görünür etiket; basit sesli okuma eklentileri ARIA ve title okumaz], [COGA 4.8.4]. Etiketi alanın içine koyma (yalnız çok basit, kaybolup geri gelen ve cevapla karışamayan durumda olur) [Krug-DMMT s.237-238]. B05 ile aynı gerekçe.
**Denetim:** OTOMATİK. Etiketsiz alan ya da yalnız placeholder taşıyan alan kritik; arama kutusu bilgi. Zorunlu ve isteğe bağlı alanların karıştığı formda ikisinden biri işaretli değilse (`*`, "zorunlu" ya da "(isteğe bağlı)"; `::after` ile konan işaret de sayılır) uyarı [COGA 4.5.4].
**Yap:** `<label for="tel">Telefon</label><input id="tel" placeholder="0532 000 00 00">`

### B07 · Hatayı baştan önle
**İlke:** İyi tasarım hata mesajından önce hatayı engeller: serbest metin yerine seçim, biçimi kendin düzelt, farklı yazımları kabul et, en az bilgiyi iste.
**Neden:** [Nielsen-10 #5]. İnsanlar her zaman hata yapar; hatasız ürün yoktur, en iyi hata mesajı hiç olmamasıdır [Weinschenk-100 #85 s.204]. Fiziksel kısıt görünür olursa yanlış eylem denenmeden önce engellenir; her iki yönde de çalışan anahtar en iyisidir [Norman-DOET s.100-101]. Kullanıcının eylemini doğru yönde atılmış bir adım denemesi olarak düşün, onunla savaşma [Norman-DOET s.216]. Kart numarasında boşluğu, telefonda parantezi reddetmek "biraz kod yazmamak için kullanıcıyı çember içinden atlatmaktır" [Krug-DMMT s.206-208]. [COGA 4.5.4 hatayı önleyen form], [COGA 4.5.8 farklı giriş biçimlerini kabul et].
**Denetim:** OTOMATİK + ELLE. Telefon için `type="number"` uyarı; telefon alanında boşluğu ya da "+" işaretini reddeden `pattern` uyarı. ELLE: telefon/IBAN/tarih alanı boşluk, tire, büyük-küçük harfi tolere ediyor mu? Telefon alanında 17'den, kart numarasında 19'dan dar `maxlength` uyarı: "+90 532 000 00 00" sığmaz [COGA 4.5.8].
**Yap:** `type="tel" inputMode="tel" autocomplete="tel"`, tarih seçici, kendiliğinden biçimlendirme, "1 Şubat mı 2 Ocak mı?" önerisi. **Yapma:** "Telefonu boşluksuz giriniz", keyfi uzunluk sınırı.

### B08 · Hata mesajı çözüm söyler
**İlke:** Hata mesajı **ne yapıldığını, sorunun ne olduğunu, nasıl düzeleceğini** sade dilde, etken çatıyla, gerekirse örnekle, hatalı alanın **hemen yanında** ve suçlamadan söyler. Girilen veri silinmez. Mesaj sorunun **doğru düzeyini** söyler.
**Neden:** Beş öğe: ne yaptın, sorun ne, nasıl düzeltilir, sade dil ve etken çatı, örnek [Weinschenk-100 #85 s.205]. Sorun anında görüş daralır, kullanıcı ekranın diğer bölgelerine bakmayı bırakır; mesaj uzaktaysa görülmez [Weinschenk-100 #6 s.29-30]; sayfa yenilenip tek şey değişince fark edilmez [Weinschenk-100 #8 s.35-36]. Stres altında tünel eylemi: işe yaramayan aynı şey tekrar tekrar denenir [Weinschenk-100 #86 s.206-209]. Kullanıcı hatayı en alt düzeyden (şifreyi tekrar yazmak) düzeltmeye başlar; asıl sorun üst düzeydeyse (yanlış hesap) mesaj bunu söylemeli [Norman-DOET s.127-128]. Kaba, anlaşılmaz, kod numaralı mesaj "işleri yanlış yapmanın yolu"dur [Norman-DOET s.195]; birkaç başarısızlık "bu bana göre değil" öğrenilmiş çaresizliğine döner [Norman-DOET s.58-59]. [Nielsen-10 #9], [COGA 4.5.5, 4.5.7, 4.5.10].
**Denetim:** YARI. Hata kutusunda "Hata!", "Bir hata oluştu", "Geçersiz" gibi genel mesaj uyarı; hata metninde kod ("Error 401", "#402", "E1023") uyarı. `--etkilesim` ile form gerçekten gönderilir (yazma istekleri ağda kesilir): zorunlu alanları boş gönderimde hiç mesaj yoksa uyarı, yalnız tarayıcı balonu varsa bilgi, mesaj alanın yanında değilse bilgi, ağ hatası taklidinde girilen veri silinirse uyarı. İçerik doğruluğunu insan okur.
**Yap:** "Bu e-posta ile kayıt var. Giriş yapmak ister misin?" "Ödeme tarihi fatura tarihinden önce. Ödeme tarihini 15 Mart'tan sonra seç." **Yapma:** "Hata oluştu.", "#402: Faturanın ödenmesi için ödeme tarihinin oluşturma tarihinden sonra olması gereklidir."

### B09 · Kesinti ve dikkat dağıtıcı yok
**İlke:** Kullanıcı amacına ulaşmadan önce kesilmez: açılışta pop-up, kendiliğinden oynayan video, dönen slayt, geri sayım, kendiliğinden sayfa yenileme ya da yönlendirme yok. Uyarılar enflasyona uğramaz.
**Neden:** [COGA 4.6.1 kesintileri sınırla], [COGA 4.9.1 değişimi kullanıcı denetlesin], [COGA 4.5.9 zaman aşımı yok]. Gürültü: bağırma, dağınıklık, kalabalık [Krug-DMMT s.62-63]. Çevredeki hareket odaklanılan yeri bozar [Weinschenk-100 #2 s.19-21]; okumaya dalmış kişiyi kesen abonelik penceresi en sinir bozucusudur [Weinschenk-100 #40 s.112]. Her göstergeye uyarı koyulan sistemde gerçek acil durumda hepsi birden öter ve sorunu düşünmeyi engeller; uyarılar susturulur [Norman-DOET s.148]. Otomatik yönlendirme algılanan süreyi ve memnuniyeti bozar [Trukenbrod-2020].
**Denetim:** OTOMATİK. Açılışta ekranın %30'undan fazlasını kaplayan sabit katman uyarı (çerez penceresi bilgi), `video[autoplay]`, sonsuz animasyon; `meta http-equiv="refresh"` uyarı; sayfada 2'den fazla uyarı/alert kutusu bilgi. Kendiliğinden dönen slayt: slayt adayı (carousel, swiper, slick... sınıfı ya da `aria-roledescription=carousel`) 6 sn boyunca saniyede bir örneklenir; içi yer değiştirirse durdurma düğmesi yoksa uyarı, varsa bilgi [COGA 4.6.1], [Krug-DMMT s.62-63]. `--etkilesim`: açılır listeden seçim sayfa yolunu değiştirirse uyarı; yalnız sorgu dizgisi değişen filtre sayılmaz [COGA 4.9.1]. Statik: slayt kütüphanesinde `autoplay` uyarı, `onChange` içinde sayfa değiştiren açılır liste bilgi.
**Ödünleşim:** KVKK/GDPR çerez bildirimi zorunlu; ekranın altında ince bir şerit yeter.

### B10 · Uzun işi adımlara böl, ilerlemeyi göster, hazırlat
**İlke:** Bir adımda tek konu. Başlamadan önce tahmini süre ve gereken belgeler söylenir. Kaç adım kaldığı görünür; gönderim öncesi gözden geçirme ve düzeltme var. Yarıda bırakılan iş kaybolmaz. Kritik yol kısa; isteğe bağlı adımlar araya girmez.
**Neden:** Uzun adım dizisinde kullanıcı (1) yerini, (2) sırada ne olduğunu hatırlayamaz, (3) girdiğini kontrol edip düzeltemez; ekranda gösterim üçünü de çözer [Norman-DOET s.116-117]. Hedefe yaklaştıkça motivasyon artar, kalanı vurgulamak daha çok iter [Weinschenk-100 #50 s.132-133], [Weinschenk-100 #55 s.143-144]. Büyük zaman yatırımı gerektiren (öyle görünen) şey daha az kullanılır [Krug-DMMT s.25]. Formlarda tam gezinme dikkat dağıtır; yalnız site kimliği ve ana sayfa bağlantısı [Krug-DMMT s.97]. [COGA 4.2.4 her adım açık], [COGA 4.5.5 gönderim öncesi özet], [COGA 4.5.9], [COGA 4.6.2 kritik yol kısa], [COGA 4.6.4 hazırlık bilgisi], [LawsOfUX: Miller, parçalama]. Etkinleşme kaybı hatası: hedef söner, eylem sürer (yatak odasına gidip neden geldiğini unutmak); çok adımlı akışta başlık hedefi hatırlatsın ("Burs başvurusu · Adım 3/5 Belgeler") [Norman-DOET s.123-126]. Uzun video ve ses en çok 6 dakikalık, adlı bölümlere ayrılır [COGA 4.3.5]; sürekli dikkat 7-10 dakikada düşer [Weinschenk-100 #44 s.119].
**Denetim:** OTOMATİK (kısmen). Tek formda 7'den fazla görünür alan uyarı. İlerleme, özet, taslak kaydı ELLE. "İleri / Devam / Sonraki" butonlu formda adım göstergesi ("Adım 2/4", `progress`, `aria-current=step`) yoksa bilgi [COGA 4.2.4]; 6 dakikadan uzun, bölümsüz `video` bilgi [COGA 4.3.5].
**Yap:** "Bu başvuru yaklaşık 20 dakika sürer; transkript (PDF), dil belgesi ve 2 referans e-postası gerekir." "Adım 2/4 · Belgeler". **Yapma:** ödeme adımları arasına zorunlu hesap oluşturma.

### B11 · Akıllı ve güvenli varsayılan
**İlke:** Çoğu kişinin seçeceği önceden seçilidir ve "Önerilen" diye işaretlenir. Ama varsayılan yalnız **çoğunluk için doğruysa ve yanlışlıkla kabul edilmesinin bedeli küçükse** konur; önceki seçimden gelen varsayılan (adres, hesap, tarih) görünür biçimde gösterilir. Kullanıcı aleyhine varsayılan yoktur.
**Neden:** Varsayılan emeği azaltır ama fark edilmeyebilir: son kullanılan adres varsayılan kalınca ayakkabı yanlış kişiye gitti [Weinschenk-100 #58 s.149]. Azaltılamayan karmaşıklığı kullanıcıya değil sisteme yükle [LawsOfUX: Tesler]. Varsayılan işaretli, az görünen bülten kutusu kullanılabilirliği manipülasyon için kullanmaktır [Krug-DMMT s.230-237]. [Furkan-Notlar §6].
**Denetim:** OTOMATİK, kritik: önceden işaretli pazarlama/bülten/ileti izni onay kutusu. Gerisi ELLE.
**Ödünleşim:** Önceden işaretli pazarlama izni KVKK açık rıza ve DSA karanlık desen kurallarına da aykırıdır; etik ayrıntı `commerce-digital` skill'inde.

### B12 · Ham sistem çıktısı sızmaz
**İlke:** Kullanıcı ekranda asla `undefined`, `null`, `NaN`, `[object Object]`, `Invalid Date`, hata izi, `{{değişken}}`, kayıt kimliği ya da destek için ezberlenecek uzun kod görmez.
**Neden:** Sistemin dili kullanıcının dili değildir [Nielsen-10 #2]; ham çıktı hem anlamsızdır hem güveni kırar. "Bu sayfanın süresi doldu; destekle iletişime geçerseniz şu kimliği verin: B40b…" insanlar arası etkileşimin kurallarını çiğner [Weinschenk-100 #66 s.165-166]. Projelerde en sık görülen ve en kolay önlenen bilişsel kırılma.
**Denetim:** OTOMATİK, kritik. Liste: `sozluk.json → ham_cikti`.
**Yap:** `{tutar ?? "—"}`, boş listede K07 boş durum, tarih yoksa "Tarih belirtilmemiş".

### B13 · Yerel biçim ve dil
**İlke:** Tarih, sayı, para ve birim kullanıcının alıştığı biçimde: 18 Ekim 2026, 1.250,50 TL, 3 gün sonra. Sayfanın dili (`lang`) belirtilir. Göreli bilgi ("12 gün kaldı") kesin bilgiyle birlikte verilir.
**Neden:** [COGA 4.5.12 tanıdık ölçü ve birim], [COGA 4.4.6 tarihi ay adıyla yaz, `lang` belirt], [COGA 4.4.13 sayısal kavramlara alternatif], [Nielsen-10 #2]. Standart ne kadar keyfi olursa olsun yalnız bir kez öğrenilir; bozulunca (ters dönen saat) okunamaz [Norman-DOET s.216-219]. Kesin değer ile eğilim ayrı ihtiyaçlardır: altimetre kesin değer için dijital, değişim için ibre kullanır [Norman-DOET s.211-213].
**Denetim:** OTOMATİK. Türkçe sayfada ISO tarih (2026-10-18) ve İngilizce sayı biçimi (1,250.50) uyarı; `gg/aa/yyyy` eğik çizgili tarih bilgi; `<html lang>` yoksa uyarı.
**Yap:** `new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" })`, `new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" })`; "15 Mart 2027 · 148 gün kaldı".

### B14 · Geri alınabilirlik ve yıkıcı eylemin ayrılması
**İlke:** Yapılan iş geri alınabilir. Onay penceresi yerine "Silindi · Geri al" ya da çöp kutusu. Geri alınamayan eylemde sonuç önceden **nesnenin adıyla** söylenir. Yıkıcı eylem görünüm ve konum olarak olağan eylemden ayrıdır; kazara tetiklenemez.
**Neden:** Onay sorusu yanlış zamanlıdır: kullanıcı nesneyi değil eylemi onaylar, "Emin misiniz? Evet." sürçmeyi yakalamaz; geri alınamaz eylemi kaldır, dosyayı geçici bir yere taşı [Norman-DOET s.129-130]. Otomatikleşen sil-onayla dizisi fazladan silmeye götürür; yalnız son eylemi değil diziyi geri al, toplu işlem sun [Weinschenk-100 #42 s.115-116]. Aynı görünüşlü yan yana anahtarlar (flap ile iniş takımı, taksideki "her şeyi sıfırla" düğmesi) tanım hatasına davetiyedir; çözüm konumu ayırmak ve biçimi farklılaştırmak [Norman-DOET s.108-111, s.124-125, s.129]. Hataya dayanıklı mekanizma kurarsan insanlar ona güvenir, güvenilir olmalı [Norman-DOET s.130]. Keşfedilebilir sistemde eylemler bedelsizdir; geri alınamayanın etkisi önceden açıkça söylenir [Norman-DOET s.199-200]. [Nielsen-10 #3], [COGA 4.5.2, 4.5.5, 4.8.3].
**Denetim:** OTOMATİK (kısmen). Aynı kapta yan yana duran yıkıcı ("Sil", "Kaldır", "Hesabı kapat", "Sıfırla") ve olağan ("Kaydet", "Gönder") buton aynı renk ve dolgudaysa uyarı. Geri al akışı ELLE.
**Ödünleşim:** Kalıcı silme, hesap kapatma, ödeme gibi eylemlerde bilinçli sürtünme meşrudur; ama tek noktada olur, gerisi kolay kalır [Norman-DOET s.219-222].

### B15 · Uzman için hızlandırıcı, acemiye görünmez
**İlke:** Sadelik deneyimli kullanıcıyı yavaşlatmaz: klavye kısayolu, son kullanılanlar, toplu işlem, kaydedilmiş filtre. Hızlandırıcı acemi yolunu kaldırmaz; ikisi aynı anda var.
**Neden:** [Nielsen-10 #7 esneklik ve verimlilik]. Kafadaki bilgi verimlidir, dünyadaki bilgi öğrenmesi kolaydır; tasarım iyi öğrenmiş kullanıcının eylemini engellememeli, ikisi arasında gidip gelmek kolay olmalı [Norman-DOET s.95-96, s.205]. Kısayolu yalnız bulması kolaysa kullanırlar [Weinschenk-100 #58 s.149]. Sık tekrarlanan yolda az tık daha değerlidir [Krug-DMMT s.70]. Doğal eşleme uzmana da yarar ("deneyimli kullanıcıya yaramaz sanıyordum, yanılmışım") [Norman-DOET s.113-114]. Acemiye yarayan biçim (adım adım rehber, çözümlü örnek) uzmanda etkisini kaybeder, hatta zararlı olur: uzmanlığın tersine dönme etkisi [Hollender-2010 s.3-4]. Esneklik acemide kolaylığı bozabilir [Davis-TAM s.14].
**Denetim:** ELLE.

### B16 · Sistem bildiğini yeniden sordurmaz, kaldığı yeri korur
**İlke:** Daha önce girilen ya da sistemin bildiği bilgi yeniden istenmez, devralınır. Kullanıcının düzeni (sıralama, filtre, açık sekme, yarım form) sessizce sıfırlanmaz. Bölünen kullanıcı kaldığı yere döner.
**Neden:** Yükü olabildiğince sisteme al: gönderen önceden dolu, teslimat adresi faturadan devralınır [LawsOfUX: Tesler]. "Sistem az önce aranan numarayı biliyorken neden yeniden girdiriyor?" [Norman-DOET s.40]. Görevi insandan alıp makineye vermek yürütme uçurumunu kapatır [Norman-DOET s.66-67]. Masasını toplayarak birinin çalışma düzenini yok edebilirsin [Norman-DOET s.73-74]. Sistem kesintiyi en aza indirmeli ve bölünen işin tam durumuna dönmeye yardım etmeli [Norman-DOET s.207]. Oturumdan oturuma bilgiyi hatırlamayan uygulama tanıdığını tanımayan kişi gibidir [Weinschenk-100 #66 s.165]. Takip numarası yerine tıklanınca açılan bağlantı ver [Krug-DMMT s.209-211]. Tekrarlı veri girişi karmaşıklık algısının bileşenidir [Venkatesh-UTAUT]. [COGA 4.5.9, 4.7.5, 4.9.4 yaygın alanlarda `autocomplete`].
**Denetim:** OTOMATİK (kısmen). Ad, e-posta, telefon, adres alanında `autocomplete` yoksa bilgi. Taslak, durum koruma ELLE. `--etkilesim`: forma yazıp menüden başka sayfaya gidince ve geri gelince yazılan bilgi kaybolduysa bilgi (yarım formu taslak olarak sakla) [COGA 4.5.2].
**Yap:** bildirimden gelen bağlantı doğrudan ilgili kayda açılır; yarım form taslak olarak saklanır, dönüşte "Kaldığın yerden devam et".

### B17 · İyi niyet rezervuarı
**İlke:** Kullanıcının sabrı bir depo gibidir: her sorun azaltır, tek bir büyük hata boşaltabilir. Azaltanlar: istenen bilgiyi saklamak (fiyat, ücret, iletişim), kullanıcıyı "benim yolumla yapmadın" diye cezalandırmak, gereksiz bilgi istemek, sahte samimiyet, süsle yolu kesmek, amatör görünüm, suçluluk dili. Dolduranlar: ana görevi bariz ve kolay yapmak, bilmek istediğini söylemek, adım kazandırmak, gerçek SSS, hatadan zarif kurtulma, gerektiğinde özür.
**Neden:** [Krug-DMMT s.204-211]. Ücret ve masraf işin başında söylenir; sonda öğrenen kullanıcı kendini suçlar ve çevrim içi işe güvenini kaybeder [COGA 4.5.3]. Güvenilmez bulunan sitelerde yorumların %83'ü tasarımla ilgili: önce görünüşle hızlı ret, geçerse içerik [Weinschenk-100 #79 s.193-194]. Bellekte bin sıradan olay bir prototipte birleşir, tek aykırı olay ayrı kalır: yüz başarılı kullanımdan sonra akla gelen utanılan tek seferdir [Norman-DOET s.133-135]. Güvenli seçeneği (vazgeçmek, iptal) suçluluk diliyle zorlaştırmak doğru kararı cezalandırır [Norman-DOET s.145-146].
**Denetim:** YARI. İlgili otomatik bulgular: önceden işaretli izin (B11), iletişim bağlantısı yok (K10), uzun kayıt formu (B10), ham çıktı (B12). Fiyat ve ücret görünürlüğü ELLE.
**Yap:** her sayfada iletişim; fiyat ilk ekranda; "Bunu şu an yapamıyoruz, özür dileriz; 2 gün içinde açılacak."

### B18 · Okunur yazı
**İlke:** Gövde metni yeterince büyük (mobil ≥ 16 px, masaüstü ≥ 14 px), zemine karşı kontrastlı, satır aralığı rahat (≥ 1,4), satır çok uzun değil (≤ ~100 karakter, tercih 45-72), düz zemin üzerinde. Süslü yazı tipi, tamamı büyük harf paragraf, yazı tipi kalabalığı ve ünlem yağmuru yok.
**Neden:** Küçük ve düşük kontrastlı yazı asla [Krug-DMMT s.237-238]. Zor okunan yazı tipi işin kendisini zor gösterir (aynı talimat süslü yazıda iki kat uzun sürecek sanıldı) [Weinschenk-100 #15 s.54-56]; x-yüksekliği büyük yazı daha büyük görünür [Weinschenk-100 #16 s.57-58]; beyaz üzerine siyah en okunurdur [Weinschenk-100 #17 s.59]; hız için ~100, tercih için 45-72 karakter [Weinschenk-100 #18 s.60-62]. Küçük yazıyı okumak için kısılan gözler bile ruh hâlini etkiler [Weinschenk-100 #75 s.186]. Kırmızı ile mavi birlikte gözü yorar [Weinschenk-100 #10 s.38]. Satır ve paragraf aralığı, düz zemin [COGA 4.4.10, 4.4.11]. Bağırma: ünlemler, çok yazı tipi [Krug-DMMT s.62-63]. Kullanıcı yazıyı büyütebilmeli; yaşlanma 20'li yaşların ortasında başlar, "gelecekteki kendimiz için tasarla" [Norman-DOET s.177-180].
**Denetim:** OTOMATİK. 14 px altı ve kontrastı 4,5:1 altı metin uyarı; mobilde 16 px altı gövde paragrafı bilgi; satır yüksekliği < 1,3 bilgi; masaüstünde satır > 100 karakter bilgi; görsel zemin üzerinde metin bilgi; 3'ten fazla yazı tipi ailesi bilgi; ilk ekranda 3'ten fazla ünlem bilgi. Kırmızı ile mavi ya da yeşil yazı-zemin çifti (ikisi de canlı) bilgi [Weinschenk-100 #10 s.38]. Gövde metninde süslü ya da el yazısı yazı tipi (`cursive`, `fantasy`, `sozluk.json → suslu_yazi`) bilgi [Weinschenk-100 #15 s.54-56], [COGA 4.9.4].

---

## S · Sezgisel etkileşim

### S01 · Alışkanlığa uy
**İlke:** Ürün, kullanıcının her gün kullandığı ürünler gibi çalışır. Logo sol üstte ve ana sayfaya gider, arama üstte, hesap/sepet sağ üstte, gönder butonu formun altında, mobilde sekmeler altta. Yenilik değerde olur, kontrollerde değil.
**Neden:** Kullanıcılar zamanlarının çoğunu başka ürünlerde geçirir ve aynı çalışmasını bekler [LawsOfUX: Jakob], [Furkan-Notlar §1]. Sezgisel kullanım önceki deneyimden gelir; öncelik **görünüm > konum**: standart dışı yer zorunluysa bile simge + kelime + şekil tanıdık kalsın [Blackler-2010 s.1]. Gelenekler dostundur; yenilik ancak öğrenme gerektirmeyecek kadar açıksa ya da öğrenmeye değecek kadar değerliyse [Krug-DMMT s.49-53]. İnsanlar ekranı geçmiş deneyimle tarar [Weinschenk-100 #6 s.29]. Yeni makinelerle sorunlarımızın çoğu kültürel kısıt (gelenek) eksikliğidir [Norman-DOET s.101-102]; zarif tek kollu musluk yenilik uğruna kültürel sürekliliğin gücünü feda etti; "bilgiyi cihaza koyamıyorsan standartlaştır" [Norman-DOET s.185-186]. Alışkanlık yeni kanala geçişi frenler, ama düşük öğrenme çabası ve belirgin fayda bu freni aşar [Iranmanesh-2022]. [COGA 4.2.2]. Üzgün ya da korkmuşken insanlar tanıdık olanı ister: hata, ödeme, son tarih gibi stresli anlarda yenilik yapma [Weinschenk-100 #84 s.201-202]. Görev tamamlarken tutarlılık iyidir; sürpriz yalnız görev akışının dışında [Weinschenk-100 #76 s.187-188].
**Denetim:** YARI. Üst bölümde ana sayfaya dönen bağlantı yoksa uyarı (K03 ile). Gerisi ELLE: "Bu ekranı ilk kez gören biri X'i nerede arar?" Gönder butonu formun alanlarının üstündeyse bilgi [COGA 4.2.2]. Sağ tık menüsü engellenmişse uyarı (kopyala, çevir, yazım denetimi çalışmaz) [COGA 4.9.2]. Menüde 4+ bağlantı varken klavyede ilk sekme "Ana içeriğe geç" değilse bilgi [Krug-DMMT s.162]. Statik: sayfa genelinde `contextmenu` engeli uyarı.
**Ödünleşim:** Yenilik üç durumda meşru: rakipten ayrışma asıl hedef, yerleşik ürünü yeni teknolojiyle yıkmak, keşif ve şaşırtma istenen sonuç; her durumda testle kanıtla [LawsOfUX: Familiar vs Novel].

### S02 · Tıklanabilen tıklanabilir, tıklanamayan tıklanamaz görünür
**İlke:** Neyin tıklanabildiği ve neye yazılabildiği bakınca belli. Gerçek `<button>`/`<a>`; bağlantı yeni sayfaya gider, buton eylem yapar. Metin içi bağlantı altı çizili ya da belirgin renkli; giriş alanının kenarlığı var. Tıklanmayan başlık bağlantı renginde değil; süs öğesi kontrol gibi görünmüyor.
**Neden:** Algılanan affordance: doğru eylemler algılanabilir, uygunsuz olanlar görünmez [Norman-DOET s.8, s.25-26]. Kapı tek kelimelik kılavuzla ("İTİNİZ") bile gelmek zorundaysa başarısızdır; zarafet için ipucunu silmek ve aynı biçimde karışık sinyal vermek kullanıcıyı tuzağa düşürür [Norman-DOET s.103-108]. Görünür kılarken doğru şeyleri görünür kıl, yoksa insanlar gördüklerine yanlış açıklama uydurur (asma halkası anten sanıldı) [Norman-DOET s.213-214]. Bütün metin bağlantıları tek renk, tıklanmayan başlık o renkte değil [Krug-DMMT s.60-62]; kenarlıklı kutu "buraya yazılır" der, dokunmatikte üzerine gelme ipucu yok [Krug-DMMT s.186-189]. Düz tasarımla kaybolan ipuçları [Weinschenk-100 #7 s.31-34]. [COGA 4.2.2, 4.2.5].
**Denetim:** OTOMATİK. `cursor:pointer` taşıyan ama buton/bağlantı olmayan öğe uyarı; metin içinde çevresiyle aynı renk ve altı çizgisiz bağlantı uyarı; kenarlığı ve zemin farkı olmayan metin giriş alanı uyarı; bağlantı renginde tıklanmaz başlık uyarı. Tıklanmadığı hâlde buton gibi görünen kutu (dolu renkli ya da çerçeveli, köşesi yuvarlak, 1-4 kelime) bilgi; `href="#"` ya da `javascript:` ile iş yapan bağlantı bilgi; adresi olmayan tıklanabilir `<a>` uyarı [COGA 4.2.2, 4.2.5]. Statik: `router.push` yapan buton bilgi (gezinme bağlantının işidir).

### S03 · Kontrol etkilediği şeyin yanında (doğal eşleme)
**İlke:** Bir kontrol etkilediği içeriğin içinde ya da hemen yanındadır; düzeni o içeriğin düzenini izler. Satır eylemi satırda, filtre listenin üstünde. İç içe kaydırma alanı yok.
**Neden:** Doğal eşleme fiziksel benzetme ve kültürel standartla anında anlaşılır; ocak düğmeleri gözlerle aynı düzende olunca etiket gerekmez: "Bir tasarım etiketlere dayanıyorsa kusurlu olabilir" [Norman-DOET s.39-40, s.91-95]. Tepki uyumluluğu: kontrol nesnenin üstünde ya da benzeşimli düzende [Norman-DOET s.214-215]. Kullanıcıyı ekranın birçok yerine gidip geldiren düzenden kaçın [Weinschenk-100 #6 s.30]. Ayrı yerlerdeki bilgiyi zihinde birleştirmek dışsal yük [Hollender-2010 s.2]. [COGA 4.2.6 kontrolü bölgenin içine koy, iç içe kaydırma yok].
**Denetim:** OTOMATİK (kısmen). Kaydırılabilir bir alanın içinde ikinci kaydırılabilir alan uyarı. Gerisi ELLE. Mobilde 1-3 alanlı formun ilk alanı ekrandaysa ama gönder butonu ekranın altındaysa uyarı: klavye açılınca hiç görünmez [COGA 4.3.4].

### S04 · Her eyleme anında ve doğru geri bildirim
**İlke:** Her tıklama görünür tepki alır: ~100 ms içinde görsel değişim, 400 ms üstünde yükleniyor, 10 sn üstünde ilerleme ve iptal. Başarı da söylenir ("Kaydedildi"). Gösterge isteği değil gerçekleşen sonucu yansıtır. Boş, yükleniyor ve hata durumları birbirinden ayırt edilir.
**Neden:** Geri bildirimsiz kullanıcı komutu tekrarlar, işlem iki kez yapılır [Norman-DOET s.8]; görünür sonucu olmayan eylem etkisiz sanılır [Norman-DOET s.27]; kendi sesini duymadan konuşmak gibidir [Norman-DOET s.43]. Three Mile Island'daki ışık vanayı değil vanaya giden sinyali gösteriyordu [Norman-DOET s.59-60]. Kaset olup olmadığı görünmeyen video oynatıcı: değerlendirme uçurumu [Norman-DOET s.67-68]. Sessiz havalandırmada ışık yanıltıcıydı, gürültü hoş karşılanırdı [Norman-DOET s.120]. Geri bildirim övgü değil bilgidir ("Harikasın!" değil "3 belgeden 2'si yüklendi") [Weinschenk-100 #38 s.107-108]. 400 ms Doherty eşiği [LawsOfUX: Google]. [Nielsen-10 #1], [COGA 4.5.10]. Algılanan süre nesnel süreden farklıdır [Trukenbrod-2020].
**Denetim:** YARI. `--etkilesim` ile form gönderilince 1 sn içinde ekranda hiçbir değişiklik yoksa uyarı (tarayıcı doğrulama balonu tepki sayılır). Diğer kontroller ve uzun işlerde ilerleme ELLE. `--etkilesim`: gönderim sürerken (yazma isteği 2 sn bekletilir) butona ikinci kez basılınca form iki kez gidiyorsa uyarı; buton gönderim süresince kilitlenmeli [Norman-DOET s.8].
**Yap:** "Gönderildi" yalnız sunucu onayından sonra; iyimser güncelleme başarısız olursa açıkça geri alınır ve söylenir.

### S05 · Tutarlılık
**İlke:** Aynı şey her yerde aynı adı, aynı yeri, aynı görünümü taşır; ilgili eylemler aynı biçimde çalışır. Projede bir terim sözlüğü tutulur.
**Neden:** [Nielsen-10 #4], [COGA 4.2.3: üç sayfada üç farklı yerdeki gönder butonu öğrenme yükünü taşırır]. "Her şey başarısız olursa standartlaştır", "ilgili eylemleri aynı biçimde çalıştır" [Norman-DOET s.216]. Denetimli sözlük: kullanılacak, kullanılmayacak ve eş anlamlı terimler [Covert-IA s.159, s.166]. Sözlüğü kurma adımları: terim listesi → en basit tanım → tanımın içindeki terimleri de tanımla → geçmiş, alternatif ad, yanlış inanış → kullanıcılarla gözden geçir → isim + fiil gereksinimleri [Covert-IA s.118].
**Denetim:** OTOMATİK (sayfalar arası). Aynı sayfaya giden menü öğesinin farklı adlarla anılması uyarı. Projede `erisim/terimler.json` varsa "kullanma" listesindeki terim uyarı. Aynı adlı buton sayfadan sayfaya farklı görünüyorsa (zemin, yazı rengi, köşe, kalınlık, çerçeve) uyarı (sayfalar arası) [COGA 4.2.3].
**Ödünleşim:** Netlik tutarlılıktan önce gelir: biraz tutarsızlık bir şeyi belirgin biçimde netleştiriyorsa netliği seç [Krug-DMMT s.56].

### S06 · İkon yalnız başına konuşmaz
**İlke:** Kapat (×), ara (büyüteç), menü (≡), ana sayfa, geri, yazdır, oynat/duraklat, paylaş dışındaki ikonların yanında 1-2 kelimelik görünür etiket olur. Her ikonun tek anlamı vardır.
**Neden:** Küçük ikon basit geometrik çizim olmalı [Weinschenk-100 #3 s.22-23]; somut terim ve ikon soyut fikirden kolay hatırlanır ama anlamı öğrenilmiş olmalı [Weinschenk-100 #23 s.73-74]. İkonlar zor ezberlenir; evrensel olanlar azdır [LawsOfUX: bilişsel yük]. Kelime + simge birlikte ampirik destekli [Blackler-2010]. [COGA 4.2.7: tek anlam, metnin solunda, ikon kalabalığı yok]. Bazı kullanıcılar kelimeyle simgeden daha iyi sonuç verir; kelime + simge birlikte, güncel simgelere alışık olmayana yardım eder [Blackler-2010 s.14].
**Denetim:** OTOMATİK. Adı hiç olmayan ikon buton kritik; `aria-label`'ı olup görünür yazısı olmayan, evrensel olmayan ikon uyarı; adsız ok glifi uyarı. Alt metni olmayan görsel (24 px ve üstü) bilgi [Krug-DMMT s.162].

### S07 · Dokunma hedefi büyük
**İlke:** Mobilde tıklanabilir alan en az 44×44 px; hedefler arasında boşluk.
**Neden:** Hedefe ulaşma süresi uzaklık ve hedef genişliğine bağlıdır; küçük ve uzak hedef ıskalanır [Weinschenk-100 #28 s.86-87]. Eldivenle bir düğmeye basmaya çalışırken iki düğmeye basılır; sorun çıkaran kontrol kazara çalıştırılabilecek yerde olmamalı [Norman-DOET s.110]. Platform kılavuzları: Apple 44 pt, Material 48 dp; WCAG 2.2 alt sınırı 24 px.
**Denetim:** OTOMATİK (mobil, 390 px). 24 px altı uyarı, 24-44 px bilgi; paragraf içi bağlantılar hariç.

### S08 · Görsel hiyerarşi
**İlke:** Tek h1 ve sayfadaki en büyük metin odur. Başlık sırası atlamaz. Önemli olan büyük, üstte, etrafında boşluk; ilişkili öğeler yakın, farklı konular belirgin boşlukla ayrı. Başlık, tanıttığı bölüme önceki bölümden daha yakındır.
**Neden:** Etkili görsel hiyerarşi: önemli olan belirgin, ilişkili olan ilişkili görünür, iç içelik görünür [Krug-DMMT s.56-59]. Sayfa adı doğru yerde ve çoğu durumda en büyük metin [Krug-DMMT s.105-107]. **Başlıklar yüzmesin**: "çok büyük fark yaratır" [Krug-DMMT s.64-68, s.237-238]. Yakın olanlar birlikte sanılır; çizgiden önce boşlukla dene [Weinschenk-100 #9 s.37]. h1, h2, h3 doğru kullanılır [Krug-DMMT s.221-222]. [COGA 4.3.3], [COGA 4.4.10], [Furkan-Notlar §7].
**Denetim:** OTOMATİK. h1 > 1 uyarı; başlık seviyesi atlama bilgi; başlığın üst boşluğu alt boşluğundan büyük değilse ("yüzen başlık") uyarı; h1'den belirgin biçimde büyük başka metin bilgi. 5 saniye testi (Ö02) ELLE. Ana içerikte 300'den çok kelime var ama ara başlık (h2-h4) yoksa uyarı [COGA 4.4.8]. Masaüstü ilk ekranda 2-6 px kaymış "neredeyse hizalı" kenar çifti 2 ve üstü bilgi (dağınıklık) [Krug-DMMT s.62-63].

### S09 · Kısıtla, yanlışı imkânsız kıl
**İlke:** Geçersiz seçenekler baştan gösterilmez ya da seçilemez ve nedeni yazılıdır; sıra önemliyse zorlayıcı işlev yanlış sırayı engeller; sıra önemli değilse talimat kaldırılır.
**Neden:** Kolay ve az hatalı kullanımın en kesin yolu başka türlüsünü imkânsız kılmak [Norman-DOET s.8]. Dört kısıt: fiziksel, anlamsal, kültürel, mantıksal; Lego motosiklet talimatsız birleştirildi [Norman-DOET s.98-102]. Zorlayıcı işlev (kilitleme, içeride tutma, dışarıda tutma) meşru ihlali gayri meşrudan ayırmalı, yoksa söktürülür (emniyet kemeri kilidi) [Norman-DOET s.148-154]. Nintendo'nun ünlemli uyarısı: "sıra önemliyse zorlayıcı işlev; değilse talimatı kaldır" [Norman-DOET s.154-156]. Dönüş tarihi gidişten önce seçilemez ve neden söylenir [COGA 4.5.4].
**Denetim:** ELLE.
**Yap:** "Kaydedilmemiş değişiklikler var" uyarısı (içeride tutma) kasıtlı çıkışı engellemez; zorunlu alan meşru istisnayı ("telefonum yok") kabul eder, yoksa kullanıcı sahte veri girer.

### S10 · Durum ve kip görünür
**İlke:** Kullanıcı her an nerede olduğunu, neyin seçili olduğunu, işinin kaydedilip kaydedilmediğini ve hangi kipte (düzenleme/görüntüleme, taslak/yayında, test/canlı) olduğunu görür. "Buradasınız" işareti en az iki görsel farkla öne çıkar.
**Neden:** "Buradasınız" göstergesinde en sık hata fazla incelik; birden fazla görsel ayrım (renk **ve** kalın) gerekir, "göze batıyor" sandığını iki kat belirgin yap [Krug-DMMT s.107-109]. Kırıntının son öğesi bulunulan sayfadır ve bağlantı değildir [Krug-DMMT s.110-111]. Kip hataları, eylem sayısı kontrol sayısını aşınca ve kip görünmeyince kaçınılmazdır; kipleri azalt ya da görünür kıl [Norman-DOET s.126, s.128]. Zihin zamanın %30'unda dolaşır; dönen kullanıcı yerini bulmalı [Weinschenk-100 #29 s.88-89]. [Nielsen-10 #1], [COGA 4.2.4]. İnsanlar alıştıkları bilginin değiştiğini fark etmez: değişeni renk, boyut ya da hareketle vurgula, kritik bilgi gerekenden çok öne çıksın [Weinschenk-100 #41 s.114]. Nadir ama önemli olay (son tarih) güçlü sinyal ister [Weinschenk-100 #43 s.117-118]. Ziyaret edilen ve edilmeyen bağlantı ayrı görünsün: hangisini denediğini görür, farklı kelimeli iki bağlantının aynı yere gittiğini anlar [Krug-DMMT s.237].
**Denetim:** OTOMATİK. Menüde hiçbir öğe `aria-current` ya da seçili sınıfla işaretli değilse uyarı; `aria-current` öğesi kardeşlerinden yalnız bir stil özelliğiyle ayrılıyorsa uyarı; kırıntının son öğesi bağlantıysa bilgi. Metin içinde 3+ bağlantı varken stil sayfasında `:visited` kuralı yoksa (ve bağlantı rengi tarayıcı varsayılanı değilse) bilgi [Krug-DMMT s.237].

### S11 · Kavramsal model
**İlke:** Ürün nasıl çalıştığını arayüzüyle anlatır: önizleme, örnek veri, "şu olunca şu olur" ifadesi, kullanıcının bildiği bir şemaya bağlama ("Gelen kutusu gibi çalışır"). Basitleştirilmiş ama yanlış model verilmez.
**Neden:** İyi kavramsal model eylemlerin sonucunu öngörtür [Norman-DOET s.7-8, s.29-30]. Tasarımcı model vermezse kullanıcı kendi (yanlış) modelini uydurur: termostatı sonuna kadar açmak [Norman-DOET s.54-55]. Buzdolabı: "her düğme kendi bölmesi" modeli yanlıştı, ayarlamak imkânsızdı; basitleştirilmiş yanlış model doğrusundan kötüdür [Norman-DOET s.30-33]. Tasarımcı kullanıcıyla yalnız **sistem imgesi** üzerinden konuşur [Norman-DOET s.32-33, s.206]. Kullanıcıya var olan şemasını göster [Weinschenk-100 #21 s.69-70]; söyleme, göster [Weinschenk-100 #34 s.99-100]. Kullanıcılar talimat okumaz, el yordamıyla ilerler ve işe yarayan ilk yolu bırakmaz [Krug-DMMT s.44-46], [LawsOfUX: aktif kullanıcı paradoksu].
**Denetim:** ELLE.

### S12 · Mobilde taşma yok, yakınlaştırma serbest
**İlke:** Telefonda sayfa yana kaymaz, yakınlaştırma engellenmez, büyütülen yazıda yerleşim kırılmaz.
**Neden:** Yatay kaydırma içeriğin bir kısmını görünmez kılar; yakınlaştırmaya izin ver [Krug-DMMT s.185-186]. Sabit çözümler bazı insanlarda kaçınılmaz olarak başarısız olur; esneklik yardımcı olur [Norman-DOET s.180].
**Denetim:** OTOMATİK. `meta viewport` yoksa ya da sayfa > 4 px taşıyorsa kritik; `user-scalable=no` ya da `maximum-scale=1` uyarı. Krug'un yazı boyutu sınaması, her masaüstü sayfada: tarayıcının yazı boyutu ayarı (yakınlaştırma değil; CDP `Page.setFontSizes`) 16'dan 32'ye çıkarılır. Örnek metinlerin yarısından çoğu 1,5 kat büyümezse uyarı, beşte birinden çoğu büyümezse bilgi (yazı px ile sabitlenmiş); büyüyen yazı sayfayı yana taşırırsa bilgi [Krug-DMMT s.212-213], [COGA 4.9.4].

### S13 · Acil çıkış
**İlke:** Her akışta (çok adımlı form, açılır pencere, onboarding, ödeme) belirgin bir "Vazgeç / Kapat" ve geri dönüş var. Tarayıcının geri tuşu beklendiği gibi çalışır ve geri gidince iş kaybolmaz. Bağlantı kullanıcıyı ana sayfada "kapıda" bırakmaz, istenen içeriğe götürür.
**Neden:** Kullanıcı denetimi ve özgürlüğü: acil çıkış [Nielsen-10 #3]. Geri tuşu tarayıcının en çok kullanılan tuşudur, yanlış tahminin cezasını küçültür [Krug-DMMT s.42-44]; çoğu kullanıcı önce onu dener, beklenmedik yere götürürse kullanıcı bir daha hiçbir özelliği denemez [COGA 4.5.2]. E-postadaki bağlantı makale yerine mobil ana sayfaya götürmesin [Krug-DMMT s.185-186]. Kaydetmeden kapatmayı önleyen yumuşak kapatma, ama olağanüstü durum için gerçek çıkış da [Norman-DOET s.151].
**Denetim:** OTOMATİK (kısmen). Görünür `dialog`/`role="dialog"` içinde kapatma kontrolü yoksa uyarı. Geri tuşu davranışı ELLE. `--etkilesim`: menüden başka sayfaya gidip geri tuşuna basınca aynı sayfaya dönülmüyorsa uyarı [COGA 4.5.2].

### S14 · Bekleme ve olumsuz zirve
**İlke:** Bekleme kısa, öngörülebilir ve açıklanmış: ilerleme göstergesi, tahmini süre, ne olduğunun açıklaması; mümkünse beklerken anlamlı bir şey yapılabilir. Deneyimin en kötü anı (hata, bekleme, 404, ödeme) ve sonu özenle tasarlanır.
**Neden:** Ne kadar çok düşünülürse o kadar zaman geçmiş sanılır; süre tutarsızsa (bazen 30 sn bazen 5 dk) aynı 3 dakika çok daha uzun gelir; her zaman ilerleme göstergesi [Weinschenk-100 #36 s.103-104]. 12 dk yürüyüp bavulu hazır bulmak, 2 dk yürüyüp 10 dk beklemekten iyidir; boş beklemek mutsuz eder [Weinschenk-100 #77 s.189-190]. Deneyim en yoğun an ve sonla hatırlanır; Uber bekleme ekranında tahmini süre ve açıklama iptali düşürdü [LawsOfUX: zirve-son]. Kolay komutların faydası yavaş yanıtla silinir [Norman-DOET s.197]; yavaşlık öfke ve iyi niyet kaybıdır [Krug-DMMT s.189-190]. Tek kötü an bellekte yüz iyi anla eşit ağırlık taşır [Norman-DOET s.133-135]. [Trukenbrod-2020].
**Denetim:** OTOMATİK (kısmen). Mobilde en büyük içerik boyaması (LCP) > 2,5 sn bilgi, > 4 sn uyarı; aktarılan sayfa ağırlığı > 3 MB bilgi. Bekleme ekranı ELLE.

### S15 · Başarılıyı koru, yeniden tasarımda geri dönüş yolu bırak
**İlke:** Çalışan düzen "yenilik" için değiştirilmez. Büyük değişiklik isteğe bağlı geçişle, önizlemeyle, geri bildirimle ve bir süre eskiye dönme seçeneğiyle gelir. Eski ürünün görünmez ama işlevsel ayrıntıları yeniden tasarımdan önce envanterlenir.
**Neden:** Tanıdık ürün aniden değişince tepki ve rakibe göç (Snapchat 2018); YouTube 2017 isteğe bağlı geçiş ve geri dönüş sundu [LawsOfUX: tasarım psikolojisi]. Verilen seçeneği geri alırsan mutsuz olurlar; yeni sürümde eski yöntemleri bir süre bırak [Weinschenk-100 #93 s.224-225]. "Tatmin edici ürüne ulaşıldıktan sonra değişiklik ters tepebilir; ne zaman duracağını bil" [Norman-DOET s.166]. Yeni tasarımcılar eski telefondaki, ahize düşünce kapatma düğmesini koruyan plastik sırtın işlevini fark etmeyip kaldırdı [Norman-DOET s.160-161]. Çoğu insan değişikliği sevmez, yeniden tasarım onları kızdırır [Krug-RSME s.126]; yeniden tasarım sonrası ilk hafta düşüşü normaldir [Rodden-HEART]. [COGA 4.2.2, 4.9.4 önceki tanıdık arayüze dönme].
**Denetim:** ELLE.

### S16 · Seyrek kullanımda hatırlanabilirlik
**İlke:** Yılda birkaç kez açılan ürün (burs, vergi, başvuru, ayarlar) her açılışta ilk kez açılıyormuş gibi anlaşılır. Hiçbir temel işlev yalnız gizli jestle (uzun basma, çift dokunma, kaydırma) yapılmaz. Tur ve ipuçları sonradan yeniden bulunabilir.
**Neden:** Hatırlanabilirlik seyrek kullanılan sistemlerde özellikle önemlidir [Hollender-2010 s.4]. Krug aylarca her açışta yeni çizimin nasıl başladığını aradı; tur ilk açılışta gösterilip bir daha bulunamıyordu, yardım öğrenilmesi gereken etkileşimin arkasındaydı [Krug-DMMT s.193-198]. Tüm bilgiyi kafaya yükleyen akor klavyesi bir hafta kullanılmayınca unutuldu [Norman-DOET s.166]. Önemli bilgiyi hatırlamalarına bırakma [Weinschenk-100 #25 s.77-78]. Tek düğmeye iki iş (kısa bas ileri, uzun bas geri) yükleyen slayt makinesi [Norman-DOET s.21-22].
**Denetim:** YARI. Bilgi yalnız `title` özniteliğindeyse (görünen metinde yok, fareyle üzerine gelince çıkar) bilgi [Krug-DMMT s.187-188]; alt menü yalnız `:hover` kuralıyla açılıyorsa (gizli öğe, içinde 2+ bağlantı) bilgi [COGA 4.3.2]. Gerisi ELLE: temel işlev gizli jeste bağlı mı, tur yeniden bulunuyor mu.

### S17 · Renk anlamı ve renkten bağımsızlık
**İlke:** Renk kültürel anlamıyla kullanılır (Türkiye'de kırmızı hata/tehlike, yeşil onay/başarı, sarı uyarı); "İptal" ya da "Sil" yeşil, "Kaydet" kırmızı olmaz. Renk tek başına anlam taşımaz: durum rozetinde ikon ya da kelime de var. Miktar renk tonuyla değil uzunluk, doygunluk, konumla gösterilir.
**Neden:** Renk anlamı kültüre göre değişir; muhasebeciye kırmızı "zarar" demektir [Weinschenk-100 #12 s.43-44]. Erkeklerin %9'u, kadınların %0,5'i renk körü; ikinci kodlama şart [Weinschenk-100 #11 s.39-42]. Yeşil İptal butonu gibi renk-anlam çelişkisi deneyimi bozar [Trukenbrod-2020]. Ton, perde ve tat ikame boyutlardır, "daha çok/az" anlamı taşımaz [Norman-DOET s.39-40]. Affordance'a dikkat çekmek çok boyutlu ayrım ister [Krug-DMMT s.188-189].
**Denetim:** OTOMATİK (kısmen). Metni iptal/silme olan buton yeşil, onay/kaydetme olan buton kırmızı tonlu dolguya sahipse uyarı. Renk-tek kodlama ELLE.

### S18 · Kararlı yerleşim
**İlke:** Kullanıcı başlatmadıkça kontroller ve içerik yer değiştirmez: yüklenirken kayma yok, gelen görsel yer ayırır, listedeki öğe kullanıcı yapmadıkça yerini korur; içerik değişiyorsa açık "yükleniyor" göstergesi var.
**Neden:** Telefon numarasına dokunmak üzereyken liste kayar, yanlış kişi aranır; okunan makalenin üstüne yeni içerik eklenir [COGA 4.5.1]. Ekranda olması görüleceği anlamına gelmez; yenilenen ekrandaki değişim fark edilmez [Weinschenk-100 #8 s.35-36]. Beklenmedik değişim algılanan deneyimi bozar [Trukenbrod-2020].
**Denetim:** OTOMATİK. Toplam düzen kayması (CLS) > 0,1 uyarı, > 0,25 kritik.

### S19 · Arayüz veritabanının aynası değildir
**İlke:** Tablo adı menü adı, sütun adı form etiketi, kayıt kimliği başlık olmaz. Kavramsal model kullanıcının görevinden tasarlanır, alttaki teknolojiden kendiliğinden kabarmaz.
**Neden:** Zihinsel model ile kavramsal model uyuşmazsa ürün zor öğrenilir ya da reddedilir; uyumsuzluğun bir nedeni "gerçek tasarımcının yokluğu": arayüz alttaki yazılım ve veritabanının yansımasıdır ve yalnız programcıların zihinsel modeline uyar [Weinschenk-100 #32 s.94-95]. Arayüz ile iç kaynaklar arasındaki ödünleşimde geliştiriciler kendi hayatlarını kolaylaştırır; iç zarafet arayüz zarafeti demek değildir; ekibin son kullanıcının sesli savunucusuna ihtiyacı var [Norman-DOET s.172]. Programcılar bilgisayarın kullanıcıyla etkileşiminden sorumlu olmamalı; programlar bilgisayar için anlamlı ama gündelik kullanıcı için anlaşılmaz eylemler ister [Norman-DOET s.193-194]. Numara yerine ad göster (CD'de parça numarası değil şarkı adı) [Norman-DOET s.117]. Şirkete özgü ve teknik adlar düşündürür [Krug-DMMT s.32-33]. Kurumun organizasyon şeması gezinme olmaz [Krug-RSME s.49-51].
**Denetim:** YARI. Başlık ya da bağlantıda "#1234" biçiminde kayıt numarası bilgi; ilgili: ham çıktı (B12), jargon (B04).
**Yap:** "Erasmus+ 2027 bursu" (kayıt #4521 değil); "Belgelerim" (`documents` tablosu değil).

### S20 · Otomasyon görünür ve geçersiz kılınabilir
**İlke:** Sistemin kullanıcı adına yaptığı her şey (otomatik doldurma, sınıflandırma, sıralama, düzeltme, AI özeti ya da önerisi) görünür, düzeltilebilir ve kapatılabilir. Güvenilir değilse otomatik değiştirmez, önerir.
**Neden:** Aşırı otomasyonun üç sorunu: sistem olmadan çalışabilme yetisi kaybolur; sistem işi istediğimiz gibi yapmaz ama değiştirmek zor olduğu için kabullenmek zorunda kalırız; kişi sistemin hizmetkârı olur [Norman-DOET s.209-213]. Yazım denetleyicisi örnek: hatayı gösterir, düzeltme önerir, onaysız değiştirmez; "zihinsel işi azaltan ama kontrolü bana bırakan her ilerlemeyi memnuniyetle karşılarım" [Norman-DOET s.209]. İş kritik, yeni ya da belirsizse doğrudan, birinci şahıs kontrol gerekir; gerektiğinde devralmaya hazır bir yedek aracı ideal [Norman-DOET s.200-201]. Güvenilir olduğunda otomatik düzeltme, değilse öneri [COGA 4.5.4]; değişikliği kullanıcı denetler [COGA 4.9.1]. Sadeleştirme soyutlama noktasına kadar [LawsOfUX: Tesler].
**Denetim:** ELLE.

---

## K · Bilgi kokusu

### K01 · Etiket hedefi söyler
**İlke:** Kullanıcı tıklamadan önce ne olacağını bilir. "Tıkla", "Buraya", "Devamı", "Gönder", "Çözümler" yerine sonucu söyleyen ifade: "Fiyat teklifini gör", "Başvuru kılavuzunu indir", "Başvuruyu gönder". Anahtar kelime başta.
**Neden:** Hedefini açıkça tanımlayan bağlantılar güçlü bir bilgi kokusu verir (Pirolli ve Card) [Krug-DMMT s.70]. Göz görevle eşleşen kelimeyi yakalar [Krug-DMMT s.40-42]; ekran okuyucu kullananlar bağlantının yalnız ilk kelimelerini dinler [Krug-DMMT s.219-220]. [Furkan-Notlar §4]. İsimler nesne, fiiller yapılabilecek eylemdir; "Paylaş" butonu bu gönderiyi paylaşacağını ima eder: etiket hangi nesneye ne yaptığını söylesin [Covert-IA s.112].
**Denetim:** OTOMATİK. Kara liste `sozluk.json → belirsiz_kritik / belirsiz_uyari`; aynı metnin 3+ farklı hedefe gitmesi ("Detay" × 10). Kart ve liste öğesi içindeki bağlantılar bu sayımın dışında.

### K02 · Kullanıcının kelimesi
**İlke:** Menü, kategori, etiket ve sayfa adları şirketin iç dilinden değil, kullanıcının aradığı kelimeden seçilir; terimler projenin denetimli sözlüğünde tutulur.
**Neden:** Bilgi mimarisi; gezinme bağlantıları, kategoriler, etiketler ve görev adlarıdır [Covert-IA s.13]; belirsiz etiket belirsiz eşleşme yaratır [Covert-IA s.78]; kitleye anlamlı geldiği doğrulanmış terimler sözlüğü [Covert-IA s.159, s.166]. Testin tipik bulgusu: "aradıkları kelimeler orada değil" [Krug-DMMT s.168]. Norman kitabına "Psychology" koydu, psikoloji rafına gitti, tasarımcılar bulamadı [Norman-DOET s.5-6]. [COGA 4.4.1], [Nielsen-10 #2].
**Denetim:** ELLE + kit. Kart sıralama, ilk tıklama testi (Ö03); projede `erisim/terimler.json` varsa "kullanma" listesi otomatik aranır.

### K03 · Neredeyim? (gövde testi)
**İlke:** Rastgele bir sayfaya bırakılan kullanıcı hemen söyleyebilmeli: bu hangi site, bu hangi sayfa, ana bölümler neler, şu an hangisindeyim, nasıl ararım.
**Neden:** Kullanıcılar ana sayfadan değil arama motorundan, e-postadan gelip sitenin ortasına düşer [Krug-DMMT s.112-113]. Site kimliği sol üstte ve sayfayı çerçeveler [Krug-DMMT s.97-99]; her sayfanın adı var [Krug-DMMT s.105-107]. [COGA 4.2.1], [COGA 4.3.2].
**Denetim:** OTOMATİK. Boş ya da genel sekme başlığı ("React App", "Create Next App") kritik; görünür h1 yoksa kritik; üst bölümde ana sayfa bağlantısı yoksa uyarı; farklı sayfaların aynı başlığı taşıması uyarı. Ana sayfanın üst kısmında (ekranın %60'ı) sitenin ne yaptığını söyleyen 3-25 kelimelik düz metin (slogan ya da tek satır açıklama) yoksa bilgi [Krug-DMMT s.122-127].
**Yap:** `<title>Burslarım · Örnek Uygulama</title>` (sayfa · site).

### K04 · Koku sürekliliği
**İlke:** Tıklanan bağlantının kelimesi varılan sayfanın başlığında geçer. "Fiyatlar" tıklandıysa sayfa "Fiyatlar" diye açılır, "Planlarımız" diye değil.
**Neden:** Koku, her adımda doğru yolda olunduğunu teyit ettiği sürece kullanıcıyı ilerletir [Krug-DMMT s.70]; sayfa adı tıklanan kelimeyle eşleşmeli, her ihlal güveni azaltır [Krug-DMMT s.105-107]. Otoyolda çıkıştan sonraki "doğrulayıcı" tabela [Norman-DOET s.139-140].
**Denetim:** OTOMATİK (sayfalar arası). Bağlantı metni ile hedef h1/başlık arasında ortak kelime kökü yoksa uyarı.

### K05 · Ayrık, tahmin edilebilir kategoriler
**İlke:** Menü grupları birbiriyle örtüşmez; kullanıcı bir şeyin hangi grupta olduğunu ilk seferde tahmin eder. Kategori belirsizse etiket daha açıklayıcı olur; kullanıcı iki yerde arayacaksa iki yerde de görünür.
**Neden:** Taksonomi amaca göre düzenlenir; belirsizlik netliği, kesinlik esnekliği götürür; domates hem meyve hem sebze reyonunda [Covert-IA s.142-150]. Seçimler "hayvan, bitki, mineral" kadar düşünmesiz [Krug-DMMT s.70-73]. Sen kategori vermezsen kullanıcı kendi kurar ve bunalır; önemli olan kimin değil ne kadar iyi düzenlendiği [Weinschenk-100 #35 s.101-102]. [COGA 4.3.2].
**Denetim:** ELLE. Kart sıralama.

### K06 · Arama
**İlke:** İçerik çoksa her sayfada görünür arama kutusu: kutu + "Ara" ya da büyüteç. Otomatik tamamlama, aranan ifade sonuçta görünür kalır; sonuç yoksa öneri gösterilir, boş sayfa değil.
**Neden:** Arama-baskın ve bağlantı-baskın kullanıcılar [Krug-DMMT s.85-88]; süslü ifade ("Hızlı Bul"), talimat ve seçenek kutuda olmaz, daraltma sonuç sayfasında [Krug-DMMT s.102-103]. Aranan ifade sonuçta görünür kalır [LawsOfUX: Google]. [COGA 4.3.6 önceki aramalar, yazım düzeltme; küçük sitede daha az önemli].
**Denetim:** OTOMATİK (kısmen). Arama butonunda ya da etiketinde süslü ifade bilgi. Gerisi ELLE. Arama kutusunda talimat ("... yazın", "girin", 4 kelimeden uzun placeholder) bilgi [Krug-DMMT s.102-103].

### K07 · Boş durum yol gösterir
**İlke:** Boş liste, boş panel, sonuçsuz arama, 404 ne olduğunu ve ilk adımı söyler: "Henüz burs eklemedin. İlk bursu ekle." Mümkünse dolu bir örnek gösterir.
**Neden:** "Boş ekranın zorbalığı": tanımadığın insanlarla dolu partide ev sahibinin "kendi evin gibi" deyip kaybolması [Norman-DOET s.194]. İnsanlar en iyi örnekle öğrenir [Weinschenk-100 #34 s.99-100]. 404 ve hata sayfaları ilişki kurma fırsatıdır [LawsOfUX: zirve-son]. [COGA 4.6.4]. İçeriğin yokluğu da varlığı kadar bilgi verir: raftaki boş yer birine "tükendi", ötekine "çok tutuluyor" der; boş ekranın ne söylediğini tasarla [Covert-IA s.21].
**Denetim:** OTOMATİK (kısmen). Görünen boş durum yalnız "Veri yok", "Sonuç bulunamadı" gibi çıplak bir ifadeyse uyarı; "Henüz ..." mesajının yanında ilk adım bağlantısı ya da butonu yoksa bilgi; yalnız başlıkları olan boş tablo uyarı. Giriş arkasındaki boş durumlar: yeni hesapla `--oturum` ya da ELLE.

### K08 · Her tık düşünmesiz
**İlke:** Tık sayısı değil kararsızlık azaltılır. Her adımda doğru seçenek tartışmasız; zor seçim ikiye bölünür, ilki düşünmesiz yapılır.
**Neden:** "Kaç kez tıkladığım önemli değil, yeter ki her tık düşünmesiz olsun" [Krug-DMMT s.70-73]. Düşünme ve hatırlamayı azaltıyorsa birkaç tık eklemek değer; 10'dan fazla mantıklı tıkla iş bitiren "ne kolaydı" dedi [Weinschenk-100 #28 s.85-87]. Tık saymak değil, her tıkta yolda kalacak kadar bilgi önemli [Weinschenk-100 #27 s.82-84]. Gündelik görev ya sığ ya dardır [Norman-DOET s.137-141].
**Denetim:** ELLE. İlk tıklama testi (Ö03).

### K09 · Bağlantı ne açacağını söyler
**İlke:** Dosya indiren, yeni sekme açan, dış siteye götüren bağlantı bunu önceden söyler: "Başvuru kılavuzu (PDF, 2 MB)".
**Neden:** Koku hedefin biçimini de içerir; beklenmedik indirme ya da sekme değişimi kullanıcıyı haritasız bırakır. [COGA 4.8.3 eylemin sonucunu açıkça söyle].
**Denetim:** OTOMATİK. `.pdf/.docx/.xlsx/.zip/.csv` bağlantısında biçim ya da "indir" kelimesi yoksa uyarı.

### K10 · Yardım bağlamda ve yardıma ulaşmak kolay
**İlke:** Zor bir seçimde rehberlik **kısa, zamanında ve kaçırılamaz**: alanın yanında ipucu, "Bu nedir?", görev başında hazırlık bilgisi. Uzun SSS ya da açılışta kapatılan tur değil. Takılan kullanıcı her sayfadan insana ulaşır; iletişim ve geri bildirim yolu en az adımla (≤ 3 zorunlu alan).
**Neden:** En iyi rehberlik kısa, zamanında ve kaçırılamazdır ("SAĞA BAK" + ok) [Krug-DMMT s.75-76]. Ürün turu aktif kullanıcıyı engeller; bağlamsal ipucu, aşamalı onboarding, başlarken listesi [LawsOfUX: onboarding]. Yardım görev anında ve adım adım [Nielsen-10 #10]. Kolaylaştırıcı koşul: hedef yardıma ihtiyaç duyulmaması ama yardımın bulunabilir olması [Venkatesh-UTAUT]. İnsan yardımı her sayfada ve her adımda; iletişim formu iki alanlı; geri bildirim formu en fazla 3 zorunlu alan; sohbet botu insana geçişi gizlemez [COGA 4.8.1, 4.8.5, 4.7.4]. Telefonu gizlemek çağrıyı azaltmaz, öfkeyi artırır [Krug-DMMT s.206-207]. En iyi kılavuz bile okunmaz; ideal dünyada önce kılavuz yazılır, tasarım onu izler [Norman-DOET s.206-207]. [COGA 4.5.7, 4.8.4]. Karmaşıklığı yardım aracıyla yamamak (üç kişilik görüşme için bilgisayarda uzman sistem açtırmak) sorunu çözmez; ürünü sadeleştir [Norman-DOET s.35].
**Denetim:** OTOMATİK. Denetlenen sayfaların hiçbirinde yardım/iletişim/destek/SSS bağlantısı, `mailto:` ya da `tel:` yoksa uyarı (sayfalar arası); iletişim/geri bildirim formunda 3'ten fazla zorunlu alan uyarı.

---

## Ö · Ölçüm ve test (otomatik denetimin yerini tutmaz)

### Ö01 · Her önemli sürümden önce ve ayda bir: 3 kullanıcı
**İlke:** Ayda bir sabah (tek kişilik ekipte her önemli sürümden önce) 3 gerçek kullanıcıyla görev testi; o gün en ciddi sorunları seç, en küçük değişiklikle düzelt. Protokol: `test-protokolleri.md`.
**Neden:** Test, insanların ürünü kullanmaya çalışmasını **izlemektir**, fikir sormak değil; ilk üç kişi en önemli sorunların çoğuna takılır; daha çok tur, her turdan her şeyi sıkmaktan önemli [Krug-RSME s.23, s.36, s.56-57]. Bir kullanıcıyla test hiç testten %100 iyi; projenin başında bir kullanıcı sonunda 50 kullanıcıdan iyi [Krug-DMMT s.144-145]. Geliştirici kendi ürününün en kötü test kullanıcısıdır [Norman-DOET s.171-173], [Krug-RSME s.27]. Katılımcı hedef kitleden (hemşire ürününü hemşire test eder) [Weinschenk-100 #85 s.205] ama her turda bir "yabancı" [Krug-RSME s.55-56]. Şikâyet ve destek talebi sayısı ölçü değildir: kullanıcı kendi suçu sandığı sorunu bildirmez [Norman-DOET s.51]. Hedef bazlı senaryolar: tek tıkla geri dönebiliyor mu, formun başındaki bilgiyi veri kaybetmeden değiştirebiliyor mu, bir dakika dikkati dağılınca göreve dönebiliyor mu [COGA 5.5].
**Gözlem işaretleri** (kayda geçer): not kâğıdına başvurma = çalışma belleği aşımı [Weinschenk-100 #20 s.68]; aynı işe yaramayan eylemi tekrarlama (tünel eylemi, katı keşif) [Weinschenk-100 #86 s.207, #89 s.214]; hata türü (fazladan adım / atlanan adım / yanlış eylem) [Weinschenk-100 #88 s.211] ve sonucu (+ öğretti / − çıkmaz / 0 etkisiz) [Weinschenk-100 #87 s.210]; tek yolu ezberleyip gerisinden kaçma [Norman-DOET s.24]; kendine kılavuz yazma [Norman-DOET s.192]; korkuyla duraksama (keşfedilebilirlik) [Norman-DOET s.199-200]; "ben yapamıyorum" deyip bırakma [COGA 4.2.5].
**Ne değildir:** odak grubu kullanılabilirlik testi değildir, planlamada "ne isteniyor"u anlamaya yarar [Krug-DMMT s.142-144]; otomatik denetim ve uzman incelemesi testin yerini tutmaz [COGA 5.1]. Sıra: önce uzman incelemesi (Nielsen'in 10 ilkesi bunun için yazıldı), sonra test [Krug-RSME s.15], [Nielsen-10 s.1].
**Ne zaman:** mümkün olan en erken; tasarımdan önce rakip ürünle, yeniden tasarımda önce mevcut ürünle [Krug-DMMT s.157]; kâğıt prototip de test edilir [Krug-RSME s.39-40]; düzeltme sonrası koridor testi ya da moderatörsüz uzaktan test [Krug-RSME s.129-130, s.152-154].
**Katılımcı ve onam:** turlarda bir kez okuma ya da dikkat güçlüğü yaşayan ya da unutkanlık yaşayan bir katılımcı; anlaşılır onam, her an bırakabilir, anladığını soruyla doğrula [COGA 5.2-5.3].
**Uzaktan:** yüz yüzenin yaklaşık %80 faydası, %70 emeği; ilk turlar yüz yüze, sonra uzaktan [Krug-RSME s.149-154].
**Senaryo kuralları:** ipucu verme (ekrandaki özgün kelimeyi senaryoda kullanma) [Krug-RSME s.67-68]; "neden?" sorusunu sona sakla, verilen nedenler sonradan uydurulur [Weinschenk-100 #90-91 s.204-207], [Norman-DOET s.133]; kullanıcı suçlanmaz: "Siteyi test ediyoruz, seni değil" [Krug-DMMT s.159-168]; bir senaryo stresli koşulda (son tarih, hata sonrası) [Weinschenk-100 #86 s.208].

### Ö02 · 5 saniye testi
**İlke:** Ekranı 5 saniye göster, kapat, sor: "Bu ne? Burada ne var? Burada ne yapabilirsin? Neden başka yerde değil de burada?" Cevap yanlışsa B01, B03, S08 sorunludur.
**Neden:** Ana sayfada feda edilen ilk şey "büyük resim"dir; kurum içindeki kimse ana fikrin eksik olduğunu fark etmez [Krug-DMMT s.119-125]. [COGA 4.2.1].

### Ö03 · İlk tıklama testi
**İlke:** "X'i yapmak için nereye tıklardın?" İlk tık doğruysa görev büyük olasılıkla tamamlanır; yanlış ayakla başlayan kaybolmuş kalır [Krug-RSME s.132-135].
**Neden:** Bilgi kokusunun doğrudan ölçümü (K01, K02, K08).

### Ö04 · Gövde testi
**İlke:** K03'teki soruları rastgele sayfalarda sor; sayfayı kol boyu uzakta tut ya da gözünü kıs, öğeler yakından bakmadan sayfadan fırlamalı [Krug-DMMT s.112-113].

### Ö05 · Algılanan kolaylık (tek başına kanıt değil)
**İlke:** Her görevden **hemen sonra**: "Bu görev ne kadar kolaydı? (1 çok zor - 7 çok kolay)". İsteğe bağlı kısa TAM ölçeği. Puan gözlenen başarı ve hatayla birlikte yorumlanır.
**Neden:** Algılanan kullanım kolaylığı benimsemeyi belirler [Davis-TAM], çaba beklentisi ilk temasta belirleyicidir [Venkatesh-UTAUT], yararlılık algısını büyütür (0,61) [Iranmanesh-2022]. **Ama öz bildirim güvenilmez:** neredeyse ağlayacak kadar zorlanan kişi 7 üzerinden "6" verir [Krug-RSME s.99]; günler sonra sorulan memnuniyet daha olumlu çıkar, gerçekçi veri etkileşim sırasında ya da hemen sonra [Weinschenk-100 #83 s.199-200]; insanlar gelecekteki tepkilerini abartır [Weinschenk-100 #82 s.198]; "yorumlar beni etkilemez" diyene inanma [Weinschenk-100 #99 s.236-237]. Estetik algılanan kolaylığı artırır ama gerçek kolaylığın yerini tutmaz [Hollender-2010 s.5].

### Ö06 · HEART ile ürün metriği
**İlke:** Mutluluk, Bağlılık, Benimseme, Kalıcılık, Görev başarısı; her biri için Hedef → Sinyal → Metrik. Projenin ilk denetim puanı **taban çizgisi** olarak saklanır (`erisim/taban.json`).
**Neden:** [Rodden-HEART]. Erişilebilirlik sinyalleri (önerimiz): formda hata gösterim oranı, adım bazında terk, geri al/iptal oranı, aynı sayfada 3+ geri-ileri gezinme ("kaybolma"), boş dönen arama oranı, kilit görevi ilk oturumda tamamlama oranı. Ek göstergeler: kayıp zaman, terk, şikâyet, bulanıklık; değişiklikten önce taban çizgisi [Covert-IA s.127-130]. Analitik ne olduğunu söyler, neden olduğunu söylemez [Krug-RSME s.29-30]. İki arayüz seçeneği yeterli trafikte A/B testiyle, HEART metrikleri üzerinden kıyaslanır (Google Haritalar tek ve çift arama kutusunun hata oranını böyle kıyasladı) [Rodden-HEART s.1-3].

### Ö07 · Algılanan süre
**İlke:** Görev süresiyle birlikte "Ne kadar sürdü sence?" diye sor; 4 maddelik kısa deneyim ölçeği. Algılanan süre gerçek süreden uzunsa arayüz yoruyor demektir.
**Neden:** Öznel zaman deneyimi ayrı bir göstergedir [Trukenbrod-2020]; zihinsel işlem arttıkça daha çok zaman geçmiş sanılır [Weinschenk-100 #36 s.103].

### Ö08 · Sezgisel ilk kullanım ve ilk izlenim
**İlke:** Ürünü hiç görmemiş kişi kilit görevin ilk adımını **5 saniye içinde, emin ve doğru** bulur; ilk ekran 1-2 saniyede "kolay ve güvenilir" izlenimi verir. Ölçüt: sezgisel ilk kullanım oranı (5 sn + kesinlik + doğruluk). Teknoloji aşinalığı farklı katılımcılarla.
**Neden:** Sezgisel kullanım ölçümü [Blackler-2010]. İlk 1-2 saniye kolaylık yargısını belirler [Weinschenk-100 #57 s.146-148]; güvenilmez bulunan sitelerde ret önce tasarımla gelir [Weinschenk-100 #79 s.193-194]; 50 ms'lik ilk izlenim kalıcıdır, başlangıçta kaybolan giderek daha çok kaybolur [Krug-DMMT s.120]. Kolaylık ilk dönemde belirleyici [Davis-TAM], [Venkatesh-UTAUT]. Yedi aşama soruları: işlevi, mümkün eylemleri, niyetten harekete eşlemeyi, durumu ne kadar kolay anlıyor? [Norman-DOET s.68-69]. Yabancı bir nesneyi ilk denemede zahmetsizce kullandıysan bu tesadüf değil [Norman-DOET s.69].

---

## Ek A · "İşleri yanlış yapmanın yolu" (anti-desen kontrol listesi)

Norman'ın ironik listesi [Norman-DOET s.194-195], denetimde tersinden okunur:

| Anti-desen | İlgili kural |
|---|---|
| Görünmez kıl: ipucu verme, geri bildirim verme, boş ekran bırak | S02, S04, K07 |
| Keyfi ol: anlaşılmaz komut adları, keyfi eşleme | K01, K02, S03, S19 |
| Tutarsız ol: kipe göre kuralları değiştir | S05, S10 |
| Anlaşılmaz kıl: kendine özgü dil, kısaltma, bilgi vermeyen hata | B04, B08, B12 |
| Kaba ol: hatayı sözleşme ihlali gibi ele al | B08, B17 |
| Tehlikeli kıl: tek yanlış eylem işi yok etsin, uyarı kılavuzda olsun | B14, S09 |

## Ek B · Kullanıcıyı düşündüren altı soru

Kullanıcı bunları hiç sormamalı [Krug-DMMT s.36]: **Neredeyim? Nereden başlamalıyım? ___'ı nereye koymuşlar? Bu sayfadaki en önemli şeyler neler? Neden böyle adlandırmışlar? Bu reklam mı yoksa sitenin parçası mı?** Testin üç tipik bulgusu: kavramı anlamıyorlar (S11, K03), aradıkları kelime orada değil (K01, K02), çok şey oluyor (B02, B03, S08) [Krug-DMMT s.168].

## Değişiklik günlüğü

- **v0.4 (2026-10-27):** Kaynak→not→katalog kapsam denetimi:
  - 73 metinsiz PDF sayfası OCR ve gözle kontrol edildi; okunmamış metin yok.
  - Kaynaklarda geçen 47 test yöntemi notlarla ve sistemle karşılaştırıldı. Notlarda olup işletme katmanına girmemiş olanlar Ö01 ve Ö06'ya eklendi:
    - odak grubu uyarısı;
    - uzman incelemesinin yeri;
    - test zamanlaması: rakip, kâğıt prototip, mevcut ürün, düzeltme sonrası koridor testi;
    - uzaktan ve moderatörsüz test;
    - COGA 5.1-5.4: katılımcı çeşitliliği, anlaşılır onam, göreli süre, gülen yüz ölçeği;
    - A/B testi.
  - Başlıktaki sürüm düzeltildi.
  - Notlardaki 55 otomasyon sözü kodla tek tek karşılaştırıldı; 24'ü eksikti, hepsi kodlandı ve sınandı (B01, B02, B04, B06, B07, B09, B10, B16, B18, S01-S06, S08, S10, S12, S13, S16, K03, K06; `--etkilesim` ile çift gönderim, açılır liste, geri tuşu). Krug'un yazı boyutu sınaması S12'ye girdi.
  - Notlarda planlanıp kataloğa girmemiş 14 kaynaklı gerekçe eklendi (B02, B03, B10, B15, S01, S05, S06, S10, K01, K07, K10).
- **v0.3 (2026-10-27):** B08 ve S04 etkileşim senaryosuyla (`--etkilesim`) yarı otomatik, K07 kısmen otomatik oldu.
- **v0.2 (2026-10-18):** 16 kaynağın tamamı notlandı (`kaynakca/notlar/`). Beş temel ilke, önem modeli ve düzeltme kuralı eklendi. B02'nin dayanağı Miller'dan COGA 4.6.3 ve Cowan/Weinschenk'e taşındı (≤ 5, ideali 3-4). Yeni kurallar: B15 hızlandırıcı, B16 bilgiyi devral, B17 iyi niyet, B18 okunur yazı, S13 acil çıkış, S14 bekleme, S15 başarılıyı koru, S16 seyrek kullanım, S17 renk anlamı, S18 kararlı yerleşim, S19 veritabanı aynası değil, S20 otomasyon geçersiz kılınabilir, K10 bağlamsal yardım, Ö08 sezgisel ilk kullanım. B11'e güvenli varsayılan, B14'e yıkıcı eylem ayrımı, S10'a kip eklendi. v0.1'deki yanlış Weinschenk ve Norman sayfa atıfları düzeltildi. Ö05'e öz bildirim uyarısı. 40'tan fazla yeni otomatik denetim.
- **v0.1 (2026-10-18):** ilk sürüm, 36 kural + Ö01-Ö07.
