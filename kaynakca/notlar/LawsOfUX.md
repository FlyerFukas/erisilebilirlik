# LawsOfUX · Jon Yablonski, lawsofux.com makaleleri (9 yazı)

Kaynak dosya `DERİN TASARIM İLKELERL.docx` sitenin 9 makalesinin kaydıdır: Familiar vs Novel (2024), Onboarding for Active Users (2024), Tesler's Law (2024, kitabın 2. baskı alıntısı), UX Psychology: Google Search (2020), Peak-End Rule (2020), The Psychology of Design (2018), Design Principles for Reducing Cognitive Load (2015), Designing with Occam's Razor (2017). Atıf: `[LawsOfUX: <yazı/yasa>]`.

## 1. Aşinalık ve yenilik (Familiar vs Novel)
- Aşinalık deneyimin ürünler arasında **aktarılmasını** sağlar; arayüz "arka plana çekilir", kullanıcı işine odaklanır. Tanıdık desende sürtünme kalkar, dönüşüm artar.
- **Yeniliğin meşru olduğu üç durum:** (1) rakipten ayrışma asıl hedefse, (2) yerleşik ürünü yeni teknolojiyle yıkmak (ör. sohbet tabanlı arama), (3) keşif ve şaşırtma istenen sonuçsa (anlatı siteleri).
- Her durumda **kullanıcı araştırması ve test şart**; yenilik kullanılabilirlik pahasına olmamalı.
- → Katalog S01'e "yenilik istisnası" ve "testle kanıtla" şartı.

## 2. Aktif kullanıcı paradoksu ve onboarding
- Rosson ve Carroll (1987, IBM): kullanıcı kılavuz okumaz, hataya düşse de hemen kullanmaya başlar. Uzun vadede öğrenmek zaman kazandıracakken bile.
- **Ürün turu** (sıralı katmanlarla özellik gösterme) aktif kullanıcıyı engeller; çoğu okunmaz. Kullanıcıyı teknolojiye uymaya zorlar.
- Yerine: **bağlamsal ipucu** (tooltip: hafif, düşük sürtünmeli, doğru anda), **aşamalı onboarding** (Slack: önce yalnız mesaj kutusu, sonra özellikler adım adım), **"başlarken" şablonu/kontrol listesi** (Notion: risksiz ortamda yaparak öğren, istediği zaman geri dön).
- İdeal, rasyonel kullanıcı için tasarlama; yardımı ürünün her yerinde, kullanım bağlamına gömülü sun.
- → Kalıplar: onboarding; yeni kural K10 (yardım bağlamda).

## 3. Tesler yasası (karmaşıklığın korunumu)
- Her süreçte tasarımla kaldırılamayan bir karmaşıklık çekirdeği var; ya **sistem** ya **kullanıcı** taşır. Yükü olabildiğince tasarım/geliştirmede üstlen.
- Tesler'in gerekçesi: bir mühendisin bir haftada kaldırabileceği karmaşıklık yüzünden milyon kullanıcı günde bir dakika kaybediyorsa, mühendisin işini kolaylaştırmak için kullanıcıyı cezalandırıyorsundur.
- **Soyutlama noktasına kadar sadeleştirme** (uyarı): fazla sadeleştirme anlamı yok eder.
- **Karmaşıklık yanlılığı:** insan karmaşık çözümü zekâyla ilişkilendirip kayırır (Farris ve Revlin 1989, kural keşfi deneyi). Karmaşık çözüme kayıyorsan sorunu yeterince anlamamışsındır: problemle daha çok vakit geçir.
- Örnekler (yükü sisteme taşıma): e-postada gönderen önceden dolu, alıcı önerisi; akıllı tamamlama; teslimat adresini fatura adresinden devral; tek dokunuşla ödeme; niyet tabanlı (doğal dil) etkileşim karmaşık ürünlerde bilgi bariyerini düşürür.
- → B11 genişler: "daha önce girilen bilgiyi yeniden isteme, devral" (B16 yeni).

## 4. Google Arama çözümlemesi
- Giriş sayfası **tek amaç**: arama kutusu ortada ve **otomatik odaklı**; yazarken tahmin önerileri tuş ve zihinsel enerji kazandırır (Hick).
- Ek seçenekler (filtre) **sonuç sayfasında**, giriş sayfasında değil.
- Sonuç sayfasında **aranan ifade görünür kalır**: çalışma belleği sınırlı, her öğe bir karar noktası; kullanıcı ne aradığını unutabilir.
- **Doherty eşiği:** bilgisayar ve kullanıcı birbirini **400 ms altında** bekletirse verim yükselir. Hız deneyimin parçası.
- Sonuçlar ayrık parçalar, bol boşluk, tutarlı iç hiyerarşi → taranabilirlik (parçalama). Gestalt **yakınlık** (yakın olan gruptur) ve **tekdüze bağlantılılık** (çerçeve içindekiler bir arada).
- → S04'e 400 ms; K06'ya "sorgu görünür kalır", otomatik odak, öneri; S08'e Gestalt.

## 5. Zirve-son kuralı
- Deneyim, toplamına göre değil **en yoğun anı ve sonu**na göre hatırlanır (Kahneman ve ark. 1993 soğuk su deneyi; Redelmeier ve Kahneman 1996, 2003 kolonoskopi). Olumsuz anı olumludan canlı hatırlanır. Yakınlık etkisi ile ilişkili.
- Uygulama: duygusal zirveyi tanımla (ör. "Gönder"e basma anı) ve hafiflet; bitişi kutla (başarı ekranı). Olumsuz zirveler: **bekleme** (Uber: boşta kalma kaçınması → oyalayan animasyon, **operasyonel şeffaflık** → tahmini süre ve nasıl hesaplandığı, **hedef gradyanı** → her adımın açıklanması; iptal oranı düştü), **404 ve hata sayfaları** (ilişki kurma fırsatı).
- Yöntem: **yolculuk haritası** (mercek: persona, senaryo, beklenti; deneyim: evreler, eylemler, düşünce, duygu çizgisi; içgörüler: fırsat, metrik, sahiplik).
- → Yeni S14 (bekleme ve olumsuz zirve), K07'ye 404; Ö'ye yolculuk haritası.

## 6. Tasarım psikolojisi
- **Hick yasası:** RT = a + b·log2(n); karar süresi seçenek **sayısı ve karmaşıklığıyla** artar. Örnek: "büyükanne kumandası" (gereksiz tuşları bantlamak), sade akıllı kumanda (karmaşıklık TV arayüzüne taşındı ve aşamalı açıldı). Uzun/karmaşık süreci az seçenekli ekranlara böl; aşamalı onboarding.
- **Bilişsel yük:** gelen bilgi çalışma belleğini aşınca performans düşer, ayrıntı kaçar, öfke doğar.
- **Miller yasası** (1956, 7±2): **"sihirli yedi"yi gereksiz sınır gerekçesi yapma** (ör. "menü en fazla 7 öğe"). Miller'ın asıl konusu **parçalama**: telefon numarasını gruplamak, metin duvarı yerine başlık/satır uzunluğu/uzunluk düzeni, bilgi yoğun ekranlarda modüller. → **Denetimdeki B02 "menüde > 7" kuralı bu yüzden yeniden çerçevelenmeli: sayı değil gruplama.**
- **Jakob yasası** (Nielsen 2000) ve **zihinsel model**: kullanıcı benzer görünen üründen beklentisini aktarır. Form kontrolleri fiziksel kontrol panellerinden gelir.
- **Zihinsel model uyumsuzluğu:** tanıdık ürün aniden değişince (Snapchat 2018 yeniden tasarımı → tepki, rakibe göç). Çözüm: yeni sürüme **isteğe bağlı geçiş, önizleme, geri bildirim, eskiye dönme** (YouTube 2017). → Yeni S15.
- **Etik:** psikoloji kullanıcı yararına; kullanım verisi ötesinde metrik (anlamlı etkileşim), nitel araştırma. → `commerce-digital` etik listesiyle aynı yön.

## 7. Bilişsel yükü azaltma ilkeleri
- **Üç neden:** çok seçenek, çok düşünme gereği, netlik eksikliği.
- **Gereksiz öğe yok:** yardım etmeyen her öğe kullanıcıya karşı çalışır (işlenmesi ve bellekte tutulması gerekir). Fazla renk, görsel, süs. Ama **sadelik netlik pahasına olmaz.**
- **Yaygın tasarım desenleri:** öğrenme ihtiyacını azaltır.
- **Gereksiz görevi kaldır:** okumak, hatırlamak, karar vermek yük üretir; düzenlenebilir varsayılan, **önceden girilmiş bilgiyi kullan**, öngörücü tasarım.
- **Seçenekleri azalt:** özellikle navigasyon, form, açılır listede.
- **Seçenekleri grup olarak göster:** seçenekler ayrı gruplara bölünüp gizlenince kullanıcı görüneni **tamamı sanar**, gizlileri hiç bulmaz. (Aşamalı açma ile gerilim: gizlenen kısmın varlığı belli olmalı.) → B02'ye uyarı notu.
- **Okunabilirlik:** okunaklı olmak yetmez, okunur olmalı; tipografi görünmez kalmalı.
- **İkon dikkatle:** ikonlar zor ezberlenir ve anlam çıkarmak için işlem gerektirir; **evrensel olanlar**: yazdır, kapat, oynat/duraklat, yanıtla, paylaş. Gerisi metin etiketiyle. → S06 sözlüğüne "yazdır, oynat, duraklat, yanıtla, paylaş".

## 8. Occam'ın usturası
- "Varlıklar gereğinden fazla çoğaltılmamalı": en basit çözümle başla, karmaşıklığı yalnız gerekince ekle.
- Her öğe için soru: içeriğin bulunması ve iletilmesi için gereken **en az arayüz** ne? Süs animasyonu, ekran dışı menüye gizlenmiş navigasyon gereksiz karmaşıklık olabilir.
- **Acımasızca düzelt:** anlamı/değeri yoksa kaldır; tasarım eleştirisi oturumları kararı gerekçelendirmeye zorlar.
- → B03 ve yeni süreç adımı: "kaldırma turu".
