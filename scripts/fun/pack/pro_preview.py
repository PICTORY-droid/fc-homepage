"""미리보기용 변환 — LibreOffice 는 글꼴 이름 '맑은 고딕'을 만나면 한글 글자 폭을 잘못 계산해 글자가 겹쳐 보입니다.
(PowerPoint 에서는 문제 없음) 그래서 '미리보기용 복사본'에서만 테마 글꼴 이름을 서버에 있는 한글 글꼴로 바꿔서 변환하고, 원본 PPT 는 그대로 둡니다."""
import os
import shutil
import subprocess
import tempfile
import zipfile

SWAP = {"맑은 고딕": "Noto Sans CJK JP", "바탕": "Noto Serif CJK JP"}
PROFILE = os.path.join(tempfile.gettempdir(), "lo_pptx_profile")


def preview_copy(src, dst):
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
        for it in zin.infolist():
            b = zin.read(it.filename)
            if it.filename.startswith("ppt/theme/"):
                t = b.decode("utf-8")
                for a, c in SWAP.items():
                    t = t.replace(a, c)
                b = t.encode("utf-8")
            zout.writestr(it, b)


def to_pdf(files, out_dir, first_page_only=False, batch=20):
    """files 의 PPT 를 out_dir/<이름>.pdf 로 변환합니다."""
    os.makedirs(out_dir, exist_ok=True)
    tmp = tempfile.mkdtemp()
    copies = []
    for f in files:
        c = os.path.join(tmp, os.path.basename(f))
        preview_copy(f, c)
        copies.append(c)
    fmt = 'pdf:impress_pdf_Export:{"PageRange":{"type":"string","value":"1"}}' if first_page_only else "pdf"
    for k in range(0, len(copies), batch):
        subprocess.run(["soffice", f"-env:UserInstallation=file://{PROFILE}", "--headless", "--convert-to", fmt, "--outdir", out_dir] + copies[k:k + batch],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=1800, check=False)
    shutil.rmtree(tmp, ignore_errors=True)
    for f in files:
        pdf = os.path.join(out_dir, os.path.splitext(os.path.basename(f))[0] + ".pdf")
        if not os.path.exists(pdf):
            raise RuntimeError(f"미리보기 변환 실패: {f}")
