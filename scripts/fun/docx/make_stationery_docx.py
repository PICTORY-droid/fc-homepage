"""감성 편지지 Word 파일 10종. 실행: python3 scripts/fun/docx/make_stationery_docx.py <배경 JPG 폴더> <출력 폴더>"""
import sys
from pathlib import Path
from docx_kit import save_document
from stationery_docx import DESIGNS, build

if len(sys.argv) < 3:
    sys.exit("사용법: make_stationery_docx.py <배경 JPG 폴더> <출력 폴더>")
bg, out = Path(sys.argv[1]), Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
for did, cfg in DESIGNS.items():
    save_document(build(did, cfg, bg / f"{did}.jpg"), out / f"{did}.docx")
    print("✔", did)
