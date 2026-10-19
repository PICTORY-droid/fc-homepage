"""이력서·자기소개서 Word 파일 10종을 만듭니다. 실행: python3 scripts/fun/docx/make_forms_docx.py <출력 폴더>"""
import sys
from pathlib import Path
from forms_docx import forms

out = Path(sys.argv[1] if len(sys.argv) > 1 else "")
if len(sys.argv) < 2:
    sys.exit("출력 폴더를 지정하세요.")
out.mkdir(parents=True, exist_ok=True)
for fid, build in forms.items():
    build().save(out / f"{fid}.docx")
    print("✔", fid)
