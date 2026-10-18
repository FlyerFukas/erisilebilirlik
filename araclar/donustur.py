"""kaynaklar/ altındaki PDF, DOCX, RMD, TXT, MD dosyalarını donusum/ altına
sayfa işaretli markdown olarak çevirir ve donusum/ENVANTER.md yazar.

Kullanım:  py -I araclar/donustur.py            (yalnız yeni/değişmiş dosyalar)
           py -I araclar/donustur.py --hepsi    (hepsini baştan)

Sayfa işareti: <!-- s.12 -->  Kural kataloğunda kaynak gösterirken bu
numarayı kullan (PDF'in fiziksel sayfası, kitabın baskı numarası değil).
"""
import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
KAYNAK = KOK / "kaynaklar"
CIKTI = KOK / "donusum"
DURUM = CIKTI / ".durum.json"


def kisa_ad(dosya: Path) -> str:
    ad = unicodedata.normalize("NFKD", dosya.stem)
    ad = ad.encode("ascii", "ignore").decode().lower()
    ad = re.sub(r"[^a-z0-9]+", "-", ad).strip("-")
    return ad[:60] or "adsiz"


def ozet(dosya: Path) -> str:
    return hashlib.sha1(dosya.read_bytes()).hexdigest()[:12]


def pdf_oku(dosya: Path) -> tuple[str, int, int]:
    import pymupdf

    parcalar, bos = [], 0
    with pymupdf.open(dosya) as belge:
        for i, sayfa in enumerate(belge, 1):
            # Bazı taranmış PDF'lerde (ör. JSTOR) aynı metin katmanı üst üste
            # 8 kez basılı; aynı bloğu sayfa içinde bir kez tut.
            gorulen, bloklar = set(), []
            for b in sayfa.get_text("blocks"):
                parca = b[4].strip()
                if parca and parca not in gorulen:
                    gorulen.add(parca)
                    bloklar.append(parca)
            metin = "\n".join(bloklar)
            if len(metin) < 30:
                bos += 1
            parcalar.append(f"<!-- s.{i} -->\n{metin}\n")
        return "\n".join(parcalar), belge.page_count, bos


def docx_oku(dosya: Path) -> tuple[str, int, int]:
    import docx

    belge = docx.Document(dosya)
    satirlar = []
    for p in belge.paragraphs:
        metin = p.text.strip()
        if not metin:
            continue
        stil = (p.style.name or "").lower()
        if stil.startswith("heading") or stil.startswith("başlık"):
            seviye = re.findall(r"\d", stil)
            satirlar.append("#" * (int(seviye[0]) if seviye else 2) + " " + metin)
        else:
            satirlar.append(metin)
    for t in belge.tables:
        for r in t.rows:
            satirlar.append("| " + " | ".join(c.text.strip() for c in r.cells) + " |")
    return "\n\n".join(satirlar), 1, 0


def duz_oku(dosya: Path) -> tuple[str, int, int]:
    return dosya.read_text(encoding="utf-8", errors="replace"), 1, 0


OKUYUCU = {".pdf": pdf_oku, ".docx": docx_oku, ".rmd": duz_oku, ".md": duz_oku, ".txt": duz_oku}


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    hepsi = "--hepsi" in sys.argv
    CIKTI.mkdir(exist_ok=True)
    durum = json.loads(DURUM.read_text(encoding="utf-8")) if DURUM.exists() and not hepsi else {}
    for dosya in sorted(KAYNAK.iterdir()):
        okuyucu = OKUYUCU.get(dosya.suffix.lower())
        if not okuyucu:
            print(f"ATLANDI (tür desteklenmiyor): {dosya.name}")
            continue
        imza = ozet(dosya)
        if durum.get(dosya.name, {}).get("imza") == imza:
            continue
        metin, sayfa, bos = okuyucu(dosya)
        ad = kisa_ad(dosya)
        (CIKTI / f"{ad}.md").write_text(f"# {dosya.name}\n\n{metin}", encoding="utf-8")
        durum[dosya.name] = {
            "imza": imza, "cikti": f"{ad}.md", "sayfa": sayfa, "bos_sayfa": bos,
            "karakter": len(metin), "token_tahmini": len(metin) // 4,
        }
        print(f"çevrildi: {dosya.name} -> {ad}.md ({sayfa} s., {len(metin)//4} token)")
    DURUM.write_text(json.dumps(durum, ensure_ascii=False, indent=1), encoding="utf-8")

    satirlar = ["# Kaynak envanteri", "",
                "| Dosya | Çıktı | Sayfa | Metinsiz sayfa | ~Token |", "|---|---|---|---|---|"]
    toplam = 0
    for ad, d in sorted(durum.items()):
        toplam += d["token_tahmini"]
        uyari = " ⚠ OCR gerek" if d["sayfa"] > 1 and d["bos_sayfa"] > d["sayfa"] * 0.3 else ""
        satirlar.append(f"| {ad} | {d['cikti']} | {d['sayfa']} | {d['bos_sayfa']}{uyari} | {d['token_tahmini']:,} |")
    satirlar += ["", f"Toplam ~{toplam:,} token."]
    (CIKTI / "ENVANTER.md").write_text("\n".join(satirlar), encoding="utf-8")
    print(f"toplam ~{toplam:,} token")


if __name__ == "__main__":
    main()
