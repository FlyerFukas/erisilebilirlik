"""Depodaki skill'i Claude'un global skill klasörüne kopyalar.
Kaynak: skill/erisilebilirlik  →  ~/.claude/skills/erisilebilirlik
Skill'i değiştirdikten sonra her seferinde çalıştır:  py -I araclar/skill_kur.py
"""
import shutil
import sys
from pathlib import Path

KAYNAK = Path(__file__).resolve().parent.parent / "skill" / "erisilebilirlik"
HEDEF = Path.home() / ".claude" / "skills" / "erisilebilirlik"

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if HEDEF.exists():
    shutil.rmtree(HEDEF)
shutil.copytree(KAYNAK, HEDEF)
for d in sorted(HEDEF.rglob("*.md")):
    print(f"kuruldu: {d.relative_to(HEDEF.parent)} ({d.stat().st_size // 1024 or 1} KB)")
