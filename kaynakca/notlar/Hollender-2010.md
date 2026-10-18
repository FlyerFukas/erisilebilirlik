# Hollender-2010 · Hollender, Hofmann, Deneke, Schmitz, "Integrating cognitive load theory and concepts of human–computer interaction", Computers in Human Behavior 26, 1278-1288

Derleme makalesi. Bilişsel Yük Kuramı (CLT, Sweller) ile İnsan-Bilgisayar Etkileşimi'ni (HCI) karşılaştırır, ACM kütüphanesinde 65 yayını tarar, iki model önerir.

## Bilişsel yük kuramının temeli [s.2]
- **Çalışma belleği sınırlı**, uzun süreli bellek çok geniş. Çalışma belleğinde kısmen bağımsız işlemciler var: işitsel "fonolojik döngü", görsel "görsel-uzamsal karalama defteri"; birden fazla kanal kullanılınca kapasite belirli koşullarda artar.
- Öğrenme = uzun süreli bellekte **şema** kurmak. Bir şema çalışma belleğinde **tek öğe** gibi işlenir (sınırı aşmanın yolu); otomatikleşen şema çalışma belleği gerektirmez. → Arayüzde: alışılmış desen (S01) kullanıcının hazır şemasını çağırır, yükü sıfıra yaklaştırır.
- **Üç yük türü:**
  - **İçsel (intrinsic):** işin kendi karmaşıklığı, öğelerin birbirine bağımlılığı. Kişinin uzmanlığına göre değişir. (Tesler'in "azaltılamaz karmaşıklığı" ile aynı yerde.)
  - **Dışsal (extraneous):** **kötü sunum** ya da işe yaramayan etkinlikler. Örnek: birbirinden **ayrı yerlerdeki bilgiyi zihinde birleştirmek** zorunda kalmak (biri akılda tutulurken diğeri okunur).
  - **Asıl/yararlı (germane):** şema kurmaya harcanan, öğrenmeye yarayan yük.
- Yükler **toplanır**; toplam kapasiteyi aşmamalı. Dışsal yükü azaltmanın etkisi en çok **içsel yük yüksekken** görülür (basit işte kötü sunum tolere edilir, karmaşık işte edilmez) [s.2]. → Furkan'ın ürünleri (burs başvurusu, mali tablo, takip) içsel yükü yüksek işler: **dışsal yükü sıfırlamak burada en kârlı.**

## Dışsal yükü azaltan ilkeler [s.3]
- **Çözümlü örnek etkisi:** acemi, problemi çözmek yerine çözülmüş örneği inceleyince daha iyi öğrenir. → Arayüzde **örnek veri, doldurulmuş örnek, şablon** (B11, S11).
- **Dikkat bölünmesi etkisi:** anlamak için birlikte gereken görsel kaynaklar **bütünleşik** sunulmalı; ayrı sunulursa zihinde birleştirmek ağır yük. → S03 (kontrol ve içerik yan yana), hata mesajı alanın yanında (B08), açıklama ilgili öğenin yanında, grafikte efsane yerine doğrudan etiket.
- **Kip (modality) etkisi:** görsel kanal doluyken sözel bilgiyi sesli vermek yükü azaltır. (Web'de sınırlı; video/rehberde anlatım.)
- **Fazlalık (redundancy) etkisi:** tek kaynak yeterliyken **aynı bilgiyi başka biçimde tekrarlamak** gereksiz yük getirir. → B03'ün ikinci gerekçesi: başlığı alt başlıkta, butonu yanındaki metinde tekrar etme. **Not:** S06'daki "ikon + yazı" fazlalık değildir; ikon tek başına yeterli değilse yazı tamamlayıcıdır (Blackler-2010 ile uzlaşma).

## İçsel yükü ayarlamak ve kullanıcı özellikleri [s.3-4]
- Çok karmaşık içerikte önce öğeleri **tek tek**, sonra hepsini ilişkileriyle birlikte göstermek, hepsini baştan göstermekten iyi (Pollock ve ark. 2002). → B10 (adımlara böl), aşamalı açma.
- **Uzmanlığın tersine dönme etkisi:** acemiye yarayan biçim (adım adım rehber, çözümlü örnek, bütünleşik açıklama) uzmanda **etkisini kaybeder hatta zararlı olur**. → Nielsen #7 ile birlikte yeni B15: acemi ve uzman için iki yol (rehber kapatılabilir, kısayol var).
- **Motivasyon** yükün belirleyicisi; **kullanıcı denetimi** (görevi kendisi seçebilmek) motivasyonu artırır.

## HCI tarafı [s.4-5]
- ISO 9241-11 kullanılabilirlik tanımı: belirli kullanıcının belirli işi **etkin, verimli ve memnun** biçimde yapabilmesi; ancak belirli kullanıcı ve iş bağlamında tanımlanır [s.4].
- **Nielsen'in 5 kullanılabilirlik hedefi:** öğrenilebilirlik (acemi kısa sürede yeterli olur), **hatırlanabilirlik** (öğrenilmiş sistemi ara verdikten sonra kolay yeniden kullanmak; **seyrek kullanılan sistemlerde özellikle önemli**), verimlilik, düşük hata, memnuniyet [s.4]. → Yeni S16: seyrek kullanılan ürün (yılda birkaç kez açılan burs, vergi, başvuru araçları) her açılışta "ilk kez" gibi anlaşılmalı.
- Hata önleme örneği: komut yazdırmak yerine **menüden seçtirmek** (yazım hatası olmaz) [s.4]. → B07.
- **Bellek yükünü azaltma yöntemleri** (literatürde tekrar eden hedef) [s.4]: hatırlama yerine tanıma (bilgiyi dışsallaştır), ekrandan ekrana bilgi taşıtmama, **genel komutlar** (kopyala/yapıştır), sade ve net ekran (Gestalt yasaları), **işlevi yalnız gerektiği bağlamda sunma**, karmaşık etkileşimde eğitim.
- **Estetik-kullanılabilirlik etkisi:** aynı işlevli bankamatiklerden daha estetik olanlar **daha kullanışlı algılandı** (Kurosu ve Kashimura 1995; Tractinsky 1997) [s.5]. → Görsel özen, algılanan kolaylığı (Ö05) artırır; ama gerçek kolaylığın yerini tutmaz.
- **Eğitim tekerlekleri** (Carroll 1990): acemiye yalnız temel işlevler açık, uzmanlaştıkça genişler; bağlama duyarlı sistemler uygunsuz işlevi gizler/kapatır, problem uzayını küçültür [s.5]. → Aşamalı onboarding (LawsOfUX Slack örneğiyle aynı ilke).

## Uyarı: her yük kötü değildir [s.7-8]
- Van Nimwegen ve ark. (2006): geçerli eylemleri arayüzde dışsallaştıran sistem, **daha sığ düşünme, daha az planlama, daha az bilgi edinme** ile sonuçlandı. Öğrenme amaçlı yazılımda yararlı yükü artırmak istenebilir.
- **Sınır çizgisi (bizim çıkarımımız):** Furkan'ın ürünleri iş/üretkenlik aracı; hedef kullanıcının **ürünü** öğrenmesi değil **işini** bitirmesi. Bu yüzden dışsal yük azaltılır. İstisna: kullanıcının alan bilgisi kazanması ürün değeriyse (ör. finans eğitimi, ders aracı), "neden" açıklaması ve kendi karar verme payı bırakılır.

## İki model [s.7-8]
1. Yazılım kullanmaktan doğan yük, **dışsal yükün bir bileşenidir**; yazılımın karmaşıklığı, kötü kullanılabilirlik ve kullanıcının yazılım deneyimiyle artar; kolay yazılım ya da eğitimle azalır. Yazılım çok kolaysa bu bileşen ihmal edilebilir.
2. Kullanıcı-görev-araç üçlüsü: araç içsel yükü kullanıcıya göre ayarlar, dışsalı düşürür, yararlıyı destekler.

## Ölçüm notu [s.9]
- Bilişsel yükü **araya girmeden** ölçmek için girdi özelliklerini (yazma hızı, duraksama) analiz eden yöntemler var. → Ö için ileride: formda alan başına duraksama süresi, düzeltme sayısı.
- Sesli düşünme ile kullanıcı yorumlarını yük türüyle eşleştirmek önerilir.
