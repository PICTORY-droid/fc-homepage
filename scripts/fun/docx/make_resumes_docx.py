"""직업별 이력서 Word 파일 20종. 실행: python3 scripts/fun/docx/make_resumes_docx.py <출력 폴더>"""
import sys
from pathlib import Path
from positions_resume import RESUMES

if len(sys.argv) < 2:
    sys.exit("출력 폴더를 지정하세요.")
out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
for pid, build in RESUMES.items():
    build().save(out / f"resume-{pid}.docx")
    print("✔", pid)
