# Erişilebilirlik

Son kullanıcının bir web uygulamasını, mobil ürünü ya da dijital hizmeti **kılavuz okumadan, destek hattını aramadan ve zihinsel yorgunluk yaşamadan** anlaması için kural kataloğu, Claude skill'i ve otomatik denetim aracı.

Üç boyut: **bilişsel yük** (cognitive accessibility), **sezgisel etkileşim** (intuitive interaction), **bilgi kokusu** (information scent).

## Hızlı kullanım

```bash
# bir sayfayı denetle (masaüstü + mobil, 4 bağlantı daha gezer)
node denetim/denetle.mjs http://localhost:3000 --tara 4 --cikti erisim-rapor

# formları da gerçekten gönder (yazma istekleri ağda kesilir, kayıt oluşmaz)
node denetim/denetle.mjs http://localhost:3000 --etkilesim

# kaynak kodu tara (sunucu gerekmez, giriş arkası ekranlar dahil)
node denetim/statik.mjs ../projem

# denetimin kendi testi
cd denetim && npm test

# kaynaklarda ara (kaynağı baştan okumak yerine)
py -I araclar/bul.py "trunk test" krug

# yeni kaynak eklendiyse çevir
py -I araclar/donustur.py

# skill'i ~/.claude/skills altına kur/güncelle
py -I araclar/skill_kur.py

# bir projeye kur ya da projedeki kopyayı güncelle (--ci: GitHub Action, --dene: yalnız göster)
node araclar/projeye_kur.mjs ../projem
```

Projeye kurulduktan sonra projede: `npm run erisim:kur` (bir kez), `npm run erisim -- <adres> --tara 4` (ilk seferde `--taban-yaz`). Giriş arkası ekranlar için `--oturum erisim/oturum.json`. Kod taraması: `npm run erisim:statik`. package.json'u olmayan projede kit doğrudan `node erisim/denetim/...` komutlarını yazar.

## Düzen

| Yol | İçerik |
|---|---|
| `skill/erisilebilirlik/` | Skill: `SKILL.md`, `references/katalog.md` (48 kural + 8 ölçüm), `kaliplar.md`, `test-protokolleri.md`, `kaynakca.md` |
| `denetim/` | Otomatik denetim: `denetle.mjs` (komut), `olcumler.js` (sayfa içi ölçümler), `etkilesim.mjs` (form gönderimi), `statik.mjs` (kod taraması), `kurallar.mjs` (adlar, eşikler), `sozluk.json` (kelime listeleri), `test/` |
| `araclar/` | Kaynak dönüştürme, arama, skill kurulumu, projeye kurulum (`projeye_kur.mjs`) |
| `kaynakca/notlar/` | 16 kaynağın bölüm bölüm notları (kendi cümlemizle, sayfa numaralı); katalogdaki her atıfın dayanağı |
| `kaynaklar/`, `donusum/` | Telifli kaynaklar ve ham metni. **Depoya girmez** (`.gitignore`) |
| `pilot/` | Canlı projelerde denetim raporları (kalibrasyon) |
| `HANDOFF.md` | Oturum günlüğü: **yeni oturumda önce bunun en üstü** |
| `KARARLAR.md`, `YOL-HARITASI.md` | Kararlar ve fazlar |
| `loglar/` | Oturumların ayrıntılı kaydı |
