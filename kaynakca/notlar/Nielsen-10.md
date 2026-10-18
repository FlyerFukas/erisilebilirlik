# Nielsen-10 · 10 kullanılabilirlik sezgiseli (NN/g, 1995)

3 sayfa. İlke numarası ile atıf. Bunlar ayrıntılı kural değil, **geniş "başparmak kuralı"**dır; sezgisel değerlendirme (heuristic evaluation) için yazılmıştır [s.1]. 249 kullanılabilirlik sorununun faktör analiziyle en açıklayıcı küme olarak türetilmiştir [s.2-3].

| # | İlke | Eyleme dönük ayrıntı | Katalog |
|---|---|---|---|
| 1 | Sistem durumunun görünürlüğü | Kullanıcı ne olduğunu her zaman bilir; **uygun geri bildirim, makul sürede** | S04, S10 |
| 2 | Sistem ile gerçek dünya eşleşmesi | Kullanıcının kelimesi, cümlesi, kavramı; sistem terimi değil. Gerçek dünya geleneği; bilgi **doğal ve mantıklı sırada** | B04, B12, K02 |
| 3 | Kullanıcı denetimi ve özgürlük | Kullanıcılar işlevi sıkça **yanlışlıkla** seçer; uzun bir diyaloğa girmeden çıkabileceği **açıkça işaretli "acil çıkış"**. Geri al **ve yinele** | B14, S13 (yeni: her akışta çıkış) |
| 4 | Tutarlılık ve standartlar | Farklı kelime/durum/eylemin aynı şeyi mi kastettiğini **merak etmek zorunda kalmamalı**; platform geleneğine uy | S05, S01 |
| 5 | Hata önleme | İyi hata mesajından iyisi sorunu doğmadan önleyen tasarım: hataya açık koşulu **kaldır** ya da yakala ve **işlemden önce onay** sun | B07, B14 |
| 6 | Hatırlamak yerine tanıma | Nesne, eylem, seçenek görünür; bir adımdan diğerine bilgi taşımak zorunda değil; **kullanım talimatı görünür ya da kolay erişilebilir** | B05 |
| 7 | Esneklik ve kullanım verimliliği | **Hızlandırıcılar** (kısayol) acemiye görünmez, uzmanı hızlandırır; sistem ikisine birden hitap eder; sık eylemi kişiselleştirme | B15 (yeni) |
| 8 | Estetik ve minimal tasarım | Alakasız ya da nadiren gereken bilgi yok; **her fazla bilgi birimi ilgili birimlerle yarışır ve onların görünürlüğünü azaltır** | B03, B02 |
| 9 | Hatayı tanıma, teşhis, kurtarma | Hata mesajı sade dil (**kod yok**), sorunu **tam olarak** gösterir, **yapıcı** çözüm önerir | B08, B12 |
| 10 | Yardım ve belgeler | En iyisi belgesiz kullanılabilmesi; gerekirse yardım **aranabilir, kullanıcının görevine odaklı, somut adımlar** listeler, **büyük değil** | K10 (yeni: bağlama gömülü yardım) |

## Kataloğa yeni getirdikleri
- **Acil çıkış** (#3): her akışta (çok adımlı form, modal, onboarding) belirgin bir "Vazgeç / Kapat" ve geri dönüş. Otomatik ölçülebilir: `dialog` içinde kapatma kontrolü var mı.
- **Yinele** (#3): geri alınan şey yeniden yapılabilir.
- **Hızlandırıcı** (#7): sadelik uzmanı yavaşlatmamalı; klavye kısayolu, son kullanılanlar, toplu işlem. Acemiye görünmez kalmalı (B02 ile çatışmaz).
- **Yardım biçimi** (#10): uzun SSS sayfası değil, görev anında bağlamsal ipucu, adım adım.
- #8'in gerekçesi B03 için en net cümle: fazlalık, gerekli olanın görünürlüğünü **azaltır** (sıfır maliyetli değildir).
