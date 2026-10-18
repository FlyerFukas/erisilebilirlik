# Test protokolleri (Ö bölümü)

Otomatik denetim "kural ihlali"ni bulur; **anlaşılırlığı** yalnız insan gösterir. Bu protokoller ucuz ve hızlı olacak şekilde seçildi.

## Ö01 · Ayda bir sabah, 3 kullanıcı [Krug-RSME]
1. **Hazırlık (30 dk):** 3-4 görev yaz. Görev senaryo olarak, arayüz kelimesi kullanmadan: "Almanya'da Ocak'ta başvurusu kapanan bir bursu bul" (✗ "Filtreler menüsünü kullan").
2. **Katılımcı:** hedef kitleye yakın 3 kişi; arkadaş olabilir, ürünü görmemiş olsun.
3. **Oturum (her biri 20-30 dk):** "Sesli düşün" iste. Yardım etme. Soru gelirse "Sen olsan ne yapardın?" de. Fikir sorma ("Beğendin mi?"), davranışı izle.
4. **Kayıt:** ekran + ses (telefonla da olur). Her görev için: tamamlandı mı, süre, takıldığı yer, Ö05 kolaylık puanı (1-7), Ö07 "ne kadar sürdü sence?"
5. **Aynı gün değerlendirme:** en ciddi 3 sorunu seç. Her biri için **en küçük** düzeltmeyi bul (yeniden tasarım değil). Gelecek ay aynı görevlerle tekrar.
6. **Kayıt yeri:** projenin `HANDOFF.md` günlüğüne tek satır: tarih, görev başarı oranı, ortalama kolaylık, düzeltilen 3 sorun.

## Ö02 · 5 saniye testi
Ekranı 5 sn göster, kapat. Sor: "Bu sayfa ne için? Burada ne yapabilirsin? Ne hatırlıyorsun?" 3 kişiden 2'si amacı doğru söyleyemiyorsa B01/B03/S08'e bak. Tek başına çalışırken: ekran görüntüsünü 5 sn bak, kapat, amacı yaz; sonra karşılaştır (zayıf ama sıfırdan iyi).

## Ö03 · İlk tıklama testi
Ekran görüntüsü üzerinde: "X'i yapmak için ilk nereye tıklardın?" Her görev için doğru ilk tık oranını yaz. %80 altı: etiket (K01/K02) ya da hiyerarşi (B01) sorunu.

## Ö04 · Gövde testi [Krug-DMMT s.112-113]
Rastgele bir iç sayfa aç (tercihen derin bir sayfa). 10 sn içinde cevapla: Bu hangi site? Bu hangi sayfa? Ana bölümler neler? Şu an hangisindeyim? Nasıl ararım? Her "bilmiyorum" bir K03/S10 bulgusudur.

## Ö05 · Tek soru: algılanan kolaylık
Her görevden hemen sonra: "Bu görev ne kadar kolaydı?" 1 (çok zor) - 7 (çok kolay). Ortalama < 5,5 ise görev yeniden tasarlanır. Kuramsal dayanak: algılanan kullanım kolaylığı [Davis-TAM], çaba beklentisi [Venkatesh-UTAUT].

## Ö06 · HEART metrikleri [Rodden-HEART]
Canlı üründe, analitikle:

| Boyut | Hedef örneği | Sinyal | Metrik |
|---|---|---|---|
| Görev başarısı | Kullanıcı ilk bursunu ekleyebilsin | "Burs eklendi" olayı | Kayıttan sonra 1 gün içinde ilk burs ekleme oranı; formda hata gösterim oranı |
| Benimseme | Yeni özellik kullanılsın | Özelliğin ilk kullanımı | 7 günde kullanan yeni kullanıcı oranı |
| Kalıcılık | Geri gelsinler | Tekrar ziyaret | 4. hafta dönen oran |
| Mutluluk | Kolay bulsunlar | Ö05 anketi | Ortalama kolaylık |
| Bağlılık | Düzenli kullansınlar | Oturum | Haftalık aktif gün |

Erişilebilirlik için birincil metrik **görev başarısı**; diğerleri onun sonucudur.

## Ö07 · Algılanan süre [Trukenbrod-2020]
Görev bitince "Ne kadar sürdü sence?" (dakika). Gerçek süreyle oranı > 1,3 ise kullanıcı yorulmuştur; arayüz akıcı değildir.
