"""계절 편지지 Word 파일 80개. 실행: python3 scripts/fun/docx/make_stationery_docx.py <build.mjs 출력 폴더> <Word 출력 폴더>"""
import sys
from pathlib import Path
from docx_kit import save_document
from stationery_docx import build, load_meta

if len(sys.argv) < 3:
    sys.exit("사용법: make_stationery_docx.py <build.mjs 출력 폴더> <Word 출력 폴더>")
src, out = Path(sys.argv[1]), Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
for m in load_meta(src / "meta.json"):
    save_document(build(m, src / "bg" / f"{m['id']}.jpg"), out / f"{m['id']}.docx")
    print("✔", m["id"])
