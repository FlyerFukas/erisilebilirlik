# Rodden-HEART · Rodden, Hutchinson, Fu, CHI 2010 (Google), 4 sayfa

## Sorun [s.1-2]
- Laboratuvarda davranış ölçümü (görev tamamlama, hata oranı, görev süresi) küçük ölçekli; web analitiği ise iş odaklı, kullanıcı odaklı değil.
- **Metrik tek başına durmaz:** kullanılabilirlik ve saha çalışmalarıyla üçgenlenir. Yayındaki ürünü değerlendirmek içindir, **erken araştırmanın yerini tutmaz** [s.2].
- Takımlar çoğu zaman hedeflerinde anlaşmamış olur; metrik tanımı bu yüzden zordur [s.2].

## PULSE: yaygın ama dolaylı metrikler [s.2]
Page views, Uptime, Latency, Seven-day active users, Earnings. Hepsi önemli ama arayüz değişikliğini değerlendirmede **sorunlu ve çift anlamlı**:
- Bir özelliğin sayfa görüntülemesi artınca bu popülerlik de olabilir, **kafası karışan kullanıcının çıkış yolunu bulmak için etrafa tıklaması** da. → Erişilebilirlik için kritik uyarı: "çok tıklama" iyi haber değildir.
- Kısa vadede gelir artıran değişiklik uzun vadede kullanıcı kaçırabilir.
- 7 günlük aktif kullanıcı, %100 haftalık devir durumunda bile artabilir.

## HEART kategorileri [s.2-3]
- **Happiness (mutluluk):** tutumsal; memnuniyet, görsel çekicilik, tavsiye olasılığı, **algılanan kullanım kolaylığı**. Düzenli ürün içi anketle zaman serisi. Örnek: büyük yeniden tasarım sonrası memnuniyet (7'li iki kutuplu ölçek) önce düştü sonra toparlandı → **değişime direnç (change aversion)**; ölçmeden yeni tasarım geri alınabilirdi [s.3]. → LawsOfUX zihinsel model uyumsuzluğu ile birlikte: yeniden tasarımda ilk düşüşe hemen tepki verme, eğilime bak.
- **Engagement (bağlılık):** sıklık, yoğunluk, derinlik. **Toplam değil kullanıcı başına ortalama** (toplam kullanıcı sayısıyla şişer). Gmail örneği: son haftada **5+ gün** gelen aktif kullanıcı oranı; uzun vadeli kalıcılığı güçlü öngörüyor [s.3]. Kurumsal araçta anlamsız olabilir.
- **Adoption (benimseme) ve Retention (kalıcılık):** yeni kullanıcıyı mevcuttan ayırır. "Kullanmak" ne demek ürüne göre tanımlanır: bazen ziyaret, bazen **kilit görevi başarıyla tamamlamak**. Yeni ürün/özellik ve yeniden tasarımda özellikle yararlı [s.3].
- **Task success (görev başarısı):** verim (süre), etkinlik (tamamlanan görev yüzdesi), **hata oranı**. Uzaktan kullanılabilirlik/kıyas çalışmasıyla ya da en uygun yol varsa (çok adımlı kayıt) kullanıcının o yoldan sapmasıyla ölçülür. Google Haritalar: çift arama kutusu yerine tek kutu, A/B testte hata oranları karşılaştırıldı, kullanıcı uyum sağladı, **sadeleştirme veriyle onaylandı** [s.3].
- Her kategoriyi kullanmak şart değil; ama çerçeve **dahil etme/dışlama kararını açık** yaptırır [s.2].

## Hedef → Sinyal → Metrik süreci [s.3-4]
1. **Hedef:** kullanıcı hangi görevi yapmalı, yeniden tasarım neyi başarmalı? Ekip içindeki farklı hedefleri topla, uzlaş. Proje hedefi ürün hedefinden farklı olabilir. Bu aşamada "ölçebilir miyiz" diye takılma.
2. **Sinyal:** başarı/başarısızlık davranışta ya da tutumda nasıl görünür? Veri kaynağı: kayıt (log) ve anket. Sinyal **hedefe duyarlı ve özgü** olmalı (ilgisiz sebeple oynamamalı). **Başarısızlık çoğu zaman başarıdan kolay görülür:** görevi yarıda bırakma, **"geri al" olayları**, öfke belirtileri (Akers ve ark. 2009: geri al/sil olayları kullanılabilirlik sorunu göstergesi).
3. **Metrik:** ham sayı yerine oran, yüzde, kullanıcı başı ortalama. Bot trafiğini ayıkla; önemli eylemlerin gerçekten kaydedildiğinden emin ol (AJAX uygulamalarında varsayılan olarak kaydedilmez).

## Kataloğa getirdikleri
- Ö06 genişler: PULSE uyarısı, Hedef-Sinyal-Metrik adımları, başarısızlık sinyalleri (vazgeçme, geri al, tekrar tekrar aynı alana dönme, hata gösterimi).
- **Erişilebilirlik için önerilen sinyal seti** (kendi önerimiz, HEART'tan türetildi): formda hata gösterim oranı, adım bazında terk, geri al/iptal oranı, aynı sayfada 3+ geri-ileri gezinme ("kaybolma"), arama sonucunun boş dönme oranı, kilit görevi ilk oturumda tamamlama oranı.
- Değişime direnç: yeniden tasarım sonrası ilk hafta düşüşü normal; karar için eğilimi bekle.
