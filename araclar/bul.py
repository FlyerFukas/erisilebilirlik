"""Çevrilmiş kaynaklarda arar, eşleşmeyi kaynak + sayfa ile yazar.
Kaynağı baştan okumak yerine bunu kullan: token tasarrufu.

Kullanım:  py -I araclar/bul.py "trunk test"            (tüm kaynaklar)
           py -I araclar/bul.py "affordance" norman     (dosya adında 'norman' geçenler)
           py -I araclar/bul.py "scent" -g 300          (bağlam genişliği, karakter)
"""
import re
import sys
from pathlib import Path

DONUSUM = Path(__file__).resolve().parent.parent / "donusum"
KISALTMA = {
    "steve-krug-dont-make-me-think": "Krug-DMMT",
    "faff4ec03176258982413651bd2716d2": "Krug-RSME",
    "the-design-of-everyday-things-don-norman": "Norman-DOET",
    "100thingseveryde0000susa": "Weinschenk-100",
    "733895166-how-to-make-sense-of-any-mess-information-architec": "Covert-IA",
    "kanyak": "W3C-COGA",
    "derin-tasarim-ilkelerl": "LawsOfUX",
    "kanyak-2": "Furkan-Notlar",
    "355168044-10-heuristics-for-user-interface-design-article-by": "Nielsen-10",
    "36299": "Rodden-HEART",
    "davis1989misq": "Davis-TAM",
    "venkateshetal-2003": "Venkatesh-UTAUT",
    "1-s2-0-s0003687009000593-main": "Blackler-2010",
    "1-s2-0-s0747563210001718-main": "Hollender-2010",
    "1-s2-0-s0969698922000509-main": "Iranmanesh-2022",
    "1-s2-0-s1071581920300045-main": "Trukenbrod-2020",
}


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    args = sys.argv[1:]
    genislik = 160
    if "-g" in args:
        i = args.index("-g")
        genislik = int(args[i + 1])
        del args[i:i + 2]
    desen = re.compile(args[0], re.I)
    suzgec = args[1].lower() if len(args) > 1 else ""
    for dosya in sorted(DONUSUM.glob("*.md")):
        kisa = KISALTMA.get(dosya.stem, dosya.stem)
        if suzgec and suzgec not in dosya.stem and suzgec not in kisa.lower():
            continue
        metin = dosya.read_text(encoding="utf-8")
        sayfalar = [(int(m.group(1)), m.start()) for m in re.finditer(r"<!-- s\.(\d+) -->", metin)]
        for m in desen.finditer(metin):
            sayfa = next((s for s, bas in reversed(sayfalar) if bas <= m.start()), 1)
            parca = metin[max(0, m.start() - genislik): m.end() + genislik]
            parca = re.sub(r"\s+", " ", parca)
            print(f"[{kisa} s.{sayfa}] …{parca}…")


if __name__ == "__main__":
    main()
