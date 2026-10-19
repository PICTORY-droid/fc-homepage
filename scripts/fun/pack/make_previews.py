"""'크게 보기' 팝업용 미리보기 그림 — 엑셀·PPT 파일을 LibreOffice 로 PDF 로 바꿔 쪽들을 한 장에 모읍니다.
결과: public/fun/pack/<xlsx|pptx>/<항목>/large/<항목>-NN.jpg (큰 그림), xlsx 는 thumbs/<항목>-NN.jpg(카드용 작은 그림)도 만듭니다.
사용: python3 make_previews.py <xlsx|pptx> [항목 ...]    (엑셀은 가로 한 쪽 너비로 맞춰 앞 6쪽, PPT 는 모든 쪽을 모읍니다)"""
import glob
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
PUB = os.path.join(ROOT, "public", "fun", "pack")
BATCH = 20


def fit_width(src, dst):
    """엑셀 사본(미리보기 전용)의 모든 시트를 '가로 한 쪽 맞춤·가로 방향'으로 바꿉니다. 원본 파일은 건드리지 않아요."""
    with zipfile.ZipFile(src) as zi, zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zo:
        for it in zi.infolist():
            data = zi.read(it.filename)
            if re.fullmatch(r"xl/worksheets/sheet\d+\.xml", it.filename):
                x = data.decode("utf-8")
                x = re.sub(r"<pageSetup[^>]*/>", "", x)
                if "<pageSetUpPr" not in x:
                    if re.search(r"<sheetPr[ >/]", x):
                        x = re.sub(r"<sheetPr([^>]*)/>", r'<sheetPr\1><pageSetUpPr fitToPage="1"/></sheetPr>', x, 1) if re.search(r"<sheetPr[^>]*/>", x) else re.sub(r"</sheetPr>", '<pageSetUpPr fitToPage="1"/></sheetPr>', x, 1)
                    else:
                        x = re.sub(r"(<worksheet[^>]*>)", r'\1<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>', x, 1)
                ps = '<pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/>'
                if "<pageMargins" in x:
                    x = re.sub(r"(<pageMargins[^>]*/>)", r"\1" + ps, x, 1)
                else:
                    x = x.replace("</sheetData>", "</sheetData>" + ps, 1) if "<drawing" not in x else x.replace("<drawing", ps + "<drawing", 1)
                data = x.encode("utf-8")
            zo.writestr(it, data)


def to_pdfs(files, outdir, profile):
    subprocess.run(["soffice", f"-env:UserInstallation=file://{profile}", "--headless", "--convert-to", "pdf", "--outdir", outdir] + files,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=1800, check=False)


def distinct_pages(pdf, pages):
    """표가 길어 이어진 쪽(첫 줄이 앞쪽의 머리글과 같은 쪽)은 빼고, 시트마다 첫 쪽만 남깁니다."""
    keep, prev_lines = [], set()
    for n, p in enumerate(pages, 1):
        txt = subprocess.run(["pdftotext", "-f", str(n), "-l", str(n), "-layout", pdf, "-"], capture_output=True, text=True).stdout
        lines = [" ".join(l.split()) for l in txt.splitlines() if l.strip()]
        first = lines[0] if lines else ""
        if not (n > 1 and first in prev_lines):
            keep.append(p)
        prev_lines = set(lines)
    return keep


def montage(pages, cols, width, quality, path):
    ims = [Image.open(p).convert("RGB") for p in pages]
    cw = width // cols
    ims = [i.resize((cw, int(i.size[1] * cw / i.size[0]))) for i in ims]
    rows = [ims[k:k + cols] for k in range(0, len(ims), cols)]
    heights = [max(i.size[1] for i in r) for r in rows]
    sheet = Image.new("RGB", (cw * cols, sum(heights) + 6 * (len(rows) - 1)), "#d9d9d9")
    y = 0
    for r, h in zip(rows, heights):
        for k, i in enumerate(r):
            sheet.paste(i, (k * cw, y))
        y += h + 6
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sheet.save(path, "JPEG", quality=quality, optimize=True)
    return sheet.size


def render(ext, item):
    d = os.path.join(PUB, ext, item)
    files = sorted(glob.glob(os.path.join(d, "*." + ext)))
    assert len(files) == 50, (item, len(files))
    work = tempfile.mkdtemp(prefix=f"pv_{item}_")
    src = os.path.join(work, "src")
    os.makedirs(src)
    names = {}
    for k, f in enumerate(files, 1):
        tmp = os.path.join(src, f"{item}-{k:02d}.{ext}")
        if ext == "xlsx":
            fit_width(f, tmp)
        else:
            shutil.copy(f, tmp)
        names[k] = tmp
    pdfdir = os.path.join(work, "pdf")
    os.makedirs(pdfdir)
    chunks = [list(names.values())[i:i + BATCH] for i in range(0, 50, BATCH)]
    with ThreadPoolExecutor(3) as ex:
        list(ex.map(lambda a: to_pdfs(a[1], pdfdir, os.path.join(tempfile.gettempdir(), f"lo_pv_{a[0]}")), enumerate(chunks)))
    for k in range(1, 51):
        pdf = os.path.join(pdfdir, f"{item}-{k:02d}.pdf")
        assert os.path.exists(pdf), f"변환 실패 {pdf}"
        img = os.path.join(work, f"{item}-{k:02d}")
        last = "14" if ext == "xlsx" else "40"
        dpi = "70" if ext == "xlsx" else "55"
        subprocess.run(["pdftoppm", "-jpeg", "-jpegopt", "quality=80", "-r", dpi, "-f", "1", "-l", last, pdf, img], check=True)
        pages = sorted(glob.glob(img + "-*.jpg"))
        assert pages, pdf
        if ext == "xlsx":
            pages = distinct_pages(pdf, pages)[:6]
        large = os.path.join(d, "large", f"{item}-{k:02d}.jpg")
        if ext == "pptx":
            montage(pages, 2 if item != "news" else 3, 1400, 78, large)
        else:
            montage(pages, 2, 1500, 78, large)
            montage(pages[1:2] if len(pages) > 1 else pages[:1], 1, 480, 82, os.path.join(d, "thumbs", f"{item}-{k:02d}.jpg"))
    shutil.rmtree(work, ignore_errors=True)
    print(ext, item, "50장 완료")


if __name__ == "__main__":
    ext = sys.argv[1]
    items = sys.argv[2:] or sorted(os.listdir(os.path.join(PUB, ext)))
    for it in items:
        render(ext, it)
