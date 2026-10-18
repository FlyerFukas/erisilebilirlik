// Denetimin kullandığı kural adları ve tek satırlık çözümler.
// Uzun hâli (neden, kaynak, örnek kod): skill/erisilebilirlik/references/katalog.md
// test/calistir.mjs buradaki her kimliğin katalogda olduğunu sınar.

// Başlangıç eşikleri. Gerekçe katalogda; pilot projelerle kalibre edilecek.
export const ESIK = {
  ilkEkranEtkilesim: 30, // B02: ilk ekranda tıklanabilir öğe
  ilkEkranKelime: 250,   // B03: masaüstü ilk ekranda kelime
  cumleKelime: 20,       // B04: tek cümlede kelime
  okunabilirlik: 50,     // B04: Ateşman / Flesch alt sınırı
  formAlan: 7,           // B10: tek formda alan
  dokunmaHedef: 44,      // S07: px, Apple HIG 44pt / Material 48dp (altı: bilgi)
  dokunmaAlt: 24,        // S07: px, WCAG 2.2 alt sınırı (altı: uyarı)
};

export const KURALLAR = {
  B01: { ad: "Ekranda tek birincil eylem", cozum: "En olası eylemi tek dolgulu butonla göster; diğerlerini çerçeveli ya da metin buton yap." },
  B02: { ad: "Seçenekleri sınırla, gerisini aşamalı aç", cozum: "İlk ekranda kullanıcıların çoğunun yapacağı 3-5 şeyi bırak; gerisini 'Diğer', ikinci adım veya ayarlara taşı." },
  B03: { ad: "Gereksiz kelimeyi at", cozum: "Metnin yarısını sil, kalanın da yarısını sil. Karşılama ve talimat paragraflarını kaldır." },
  B04: { ad: "Sade dil", cozum: "Cümle ≤ 20 kelime, günlük kelime, etken çatı; teknik terim yerine kullanıcının kelimesi." },
  B05: { ad: "Hatırlatma, ezberletme", cozum: "Önceki adımda girileni/seçileni görünür tut; kod, fiyat, kural aklında tutulmak zorunda kalmasın." },
  B06: { ad: "Her alanın görünür etiketi", cozum: "Alanın üstüne kalıcı <label> koy; placeholder yalnız biçim örneği içindir (ör. 0532 000 00 00)." },
  B07: { ad: "Hatayı baştan önle", cozum: "Serbest metin yerine seçim, biçimi kendin düzelt, farklı yazımları kabul et." },
  B08: { ad: "Hata mesajı çözüm söyler", cozum: "Ne oldu + nasıl düzelir, alanın hemen yanında, suçlamadan: 'Şifre en az 8 karakter olmalı, 2 karakter daha ekle.'" },
  B09: { ad: "Kesinti ve dikkat dağıtıcı yok", cozum: "Açılışta pop-up yok; çerez bildirimi ince şerit; video/döngü kendiliğinden oynamaz ya da durdurulabilir." },
  B10: { ad: "Uzun işi adımlara böl", cozum: "Bir adımda tek konu; ilerleme göstergesi; yarıda bırakılırsa kaydet." },
  B11: { ad: "Akıllı varsayılan", cozum: "Çoğu kişinin seçeceğini önceden seç; 'Önerilen' diye işaretle." },
  B12: { ad: "Ham sistem çıktısı sızmaz", cozum: "undefined/null/NaN/hata izi yerine boş durum ya da insan diliyle mesaj göster; veri yoksa '—' veya 'Henüz yok'." },
  B13: { ad: "Yerel biçim", cozum: "Intl.DateTimeFormat('tr-TR') ve Intl.NumberFormat('tr-TR') kullan: 18 Ekim 2026, 1.250,50 TL." },
  B14: { ad: "Geri alınabilirlik", cozum: "Onay penceresi yerine 'Geri al' bildirimi; yıkıcı eylemi diğerlerinden ayır." },
  S01: { ad: "Alışkanlığa uy", cozum: "Logo sol üstte ve ana sayfaya gider, arama üstte, hesap/sepet sağ üstte; yenilik değerde olsun, kontrollerde değil." },
  S02: { ad: "Tıklanabilen tıklanabilir görünür", cozum: "Gerçek <button>/<a> kullan; metin içi bağlantıyı altı çizili ya da belirgin renkli yap." },
  S03: { ad: "Kontrol etkilediği şeyin yanında", cozum: "Filtre listenin üstünde, düzenle düğmesi düzenlenen öğenin yanında." },
  S04: { ad: "Her eyleme anında geri bildirim", cozum: "100 ms içinde görsel tepki, 1 sn üstünde yükleniyor, 10 sn üstünde ilerleme ve iptal." },
  S05: { ad: "Tutarlılık", cozum: "Aynı şeye her yerde aynı ad, aynı yer, aynı görünüm; terim sözlüğü tut." },
  S06: { ad: "İkon yalnız başına konuşmaz", cozum: "Kapat, ara, menü dışındaki ikonların yanına 1-2 kelimelik görünür etiket yaz." },
  S07: { ad: "Dokunma hedefi büyük", cozum: "Mobilde tıklanabilir alan en az 44×44 px; aralarında boşluk." },
  S08: { ad: "Görsel hiyerarşi", cozum: "Tek h1, başlık sırası atlamaz, en önemli şey en büyük ve en üstte." },
  S09: { ad: "Kısıtla, yanlışı imkânsız kıl", cozum: "Geçersiz seçenekleri baştan gösterme; neden kapalı olduğunu yazmadan butonu devre dışı bırakma." },
  S10: { ad: "Durum görünür", cozum: "Menüde bulunulan sayfa aria-current ile işaretli; aktif filtre, seçili sekme, kayıt durumu görünür." },
  S11: { ad: "Kavramsal model", cozum: "Ürün nasıl çalıştığını arayüzüyle anlatsın: önizleme, örnek veri, adım şeması." },
  S12: { ad: "Mobilde taşma yok", cozum: "Sabit genişlikleri kaldır (max-width: 100%), tabloları kaydırılabilir kaba al." },
  K01: { ad: "Etiket hedefi söyler", cozum: "'Tıkla', 'Devamı', 'Gönder' yerine sonucu söyleyen fiil: 'Fiyat teklifini gör', 'PDF raporunu indir'." },
  K02: { ad: "Kullanıcının kelimesi", cozum: "Menü ve etiketleri şirket içi addan değil, kullanıcının aradığı kelimeden seç; kart sıralama ile doğrula." },
  K03: { ad: "Neredeyim? (gövde testi)", cozum: "Her sayfada: site kimliği, anlamlı sekme başlığı, tek h1, işaretli menü öğesi, arama." },
  K04: { ad: "Koku sürekliliği", cozum: "Tıklanan bağlantının kelimesi varılan sayfanın başlığında geçsin." },
  K05: { ad: "Ayrık, tahmin edilebilir kategoriler", cozum: "Menü grupları örtüşmesin; bir öğe tek bir yere ait olsun." },
  K06: { ad: "Arama", cozum: "10'dan fazla içerik sayfası varsa görünür arama kutusu; sonuç yoksa öneri göster." },
  K07: { ad: "Boş durum yol gösterir", cozum: "Boş liste ne olduğunu ve ilk adımı söylesin: 'Henüz burs eklemedin. İlk bursu ekle.'" },
  K08: { ad: "Her tık düşünmesiz", cozum: "Tık sayısını değil kararsızlığı azalt: her adımda doğru seçenek tartışmasız olsun." },
  K09: { ad: "Bağlantı ne açacağını söyler", cozum: "Dosya bağlantısına biçim ve boyut yaz: 'Başvuru kılavuzu (PDF, 2 MB)'." },
};
