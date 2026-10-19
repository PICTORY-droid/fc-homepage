"""직업별 자기소개서 Word 파일 20종. 실행: python3 scripts/fun/docx/make_covers_docx.py <출력 폴더>"""
import sys
from pathlib import Path
from positions_cover import COVERS, build

if len(sys.argv) < 2:
    sys.exit("출력 폴더를 지정하세요.")
out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
for pid in COVERS:
    build(pid).save(out / f"cover-{pid}.docx")
    print("✔", pid)
