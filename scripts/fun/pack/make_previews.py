"""'크게 보기' 팝업용 미리보기 그림 — 엑셀·PPT 파일을 LibreOffice 로 PDF 로 바꿔 쪽들을 한 장에 모읍니다.
결과: public/fun/pack/<xlsx|pptx>/<항목>/large/<항목>-NN.jpg (큰 그림), xlsx 는 thumbs/<항목>-NN.jpg(카드용 작은 그림)도 만듭니다.
큰 그림은 쪽마다 여백을 잘라 내고 흰 카드(그림자·둥근 모서리·번호표)로 정돈해 세로로 이어 붙입니다. 카드용 그림은 여백을 잘라 문서 한 장처럼 보이게 합니다.
사용: python3 make_previews.py <xlsx|pptx> [항목 ...]    (엑셀은 가로 한 쪽 너비로 맞춰 앞 6쪽, PPT 는 모든 쪽을 모읍니다)
환경변수 PV_LIMIT=N 이면 앞 N개 파일만 다시 만듭니다(시험용)."""
import glob
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
from concurrent.futures import ThreadPoolExecutor

from PIL import Image, ImageDraw, ImageFilter

import pro_check
import pro_preview

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


XCU = """<?xml version="1.0" encoding="UTF-8"?>
<oor:items xmlns:oor="http://openoffice.org/2001/registry" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<item oor:path="/org.openoffice.Office.Calc/Formula/Load"><prop oor:name="OOXMLRecalcMode" oor:op="fuse"><value>0</value></prop></item>
</oor:items>
"""


def to_pdfs(files, outdir, profile):
    # 엑셀 수식은 파일을 열 때 항상 다시 계산해야 미리보기에 0 대신 실제 값이 보입니다.
    udir = os.path.join(profile, "user")
    os.makedirs(udir, exist_ok=True)
    with open(os.path.join(udir, "registrymodifications.xcu"), "w", encoding="utf-8") as fh:
        fh.write(XCU)
    subprocess.run(["soffice", f"-env:UserInstallation=file://{profile}", "--headless", "--convert-to", "pdf", "--outdir", outdir] + files,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=1800, check=False)


def distinct_pages(pdf, pages):
    """표가 길어 이어진 쪽(첫 줄이 앞쪽의 머리글과 같은 쪽)은 빼고, 시트마다 첫 쪽만 남깁니다."""
    keep, prev_lines = [], set()
    for n, p in enumerate(pages, 1):
        txt = subprocess.run(["pdftotext", "-f", str(n), "-l", str(n), "-layout", pdf, "-"], capture_output=True, text=True).stdout
        lines = [" ".join(l.split()) for l in txt.splitlines() if l.strip()]
        first = lines[0] if lines else ""
        second = lines[1] if len(lines) > 1 else ""
        # 앞쪽과 첫 두 줄이 모두 같으면 이어진 쪽입니다(제목만 같은 쪽은 다른 시트이므로 남깁니다).
        if not (n > 1 and first in prev_lines and (not second or second in prev_lines)):
            keep.append(p)
        prev_lines = set(lines)
    return keep


PAPER_BG = "#F4EEE9"  # 카드용 그림 바탕(따뜻한 연회색) — 문서 한 장이 놓인 듯 보이게


def trim(im, pad=12):
    """쪽의 흰 여백을 잘라 내고 내용만 남깁니다."""
    box = im.convert("L").point(lambda v: 255 if v < 244 else 0).getbbox()
    if not box:
        return im
    x0, y0, x1, y1 = box
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))


def thumb_card(pages, w, h, path, quality=84):
    """카드용 그림 — 여백을 잘라 낸 쪽을 연회색 바탕 가운데에 그림자와 함께 놓아 문서 한 장처럼 보이게 합니다."""
    im = trim(Image.open(pages[0]).convert("RGB"))
    pad = 34
    sc = min((w - 2 * pad) / im.width, (h - 2 * pad) / im.height, 1.6)
    im = im.resize((max(1, int(im.width * sc)), max(1, int(im.height * sc))), Image.LANCZOS)
    canvas = Image.new("RGBA", (w, h), PAPER_BG)
    x, y = (w - im.width) // 2, (h - im.height) // 2
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rectangle((x, y + 5, x + im.width, y + im.height + 5), fill=(90, 60, 30, 70))
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(7)))
    canvas.paste(im, (x, y))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    canvas.convert("RGB").save(path, "JPEG", quality=quality, optimize=True)


def board_large(cards, cols, cw, path, quality=78):
    """큰 그림 — 카드(make_boards.card)를 cols 열로 쌓아 한 장으로 만듭니다. 제목 줄은 팝업 머리글이 대신하므로 넣지 않습니다."""
    import make_boards as mb  # 늦게 불러와 서로 맞물려 불러오는 문제를 피합니다
    sh, margin, gap = 26, 18, 8
    colw = cw + 2 * sh
    W = margin * 2 + cols * colw + (cols - 1) * gap
    heights = [0] * cols
    place = []
    for c in cards:
        k = heights.index(min(heights))
        place.append((k, heights[k]))
        heights[k] += c.height + 4
    H = margin + max(heights) + margin
    base = Image.new("RGBA", (W, H), mb.BG)
    for c, (k, y) in zip(cards, place):
        base.alpha_composite(c, (margin + k * (colw + gap), margin + y))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    base.convert("RGB").save(path, "JPEG", quality=quality, optimize=True)
    return base.size


def sheet_cards(pages, names, width):
    """엑셀 쪽들을 시트 이름표가 붙은 카드로 만듭니다. 긴 표는 앞부분만 보이고 아래는 부드럽게 사라집니다."""
    import make_boards as mb
    cards = []
    for n, p in enumerate(pages):
        im = trim(Image.open(p).convert("RGB"))
        if im.height > im.width * 1.0:  # 차트가 잘려 보이지 않도록 넉넉히 두고, 그보다 긴 표만 아래를 흐리게 처리
            im = mb.fade_bottom(im.crop((0, 0, im.width, int(im.width * 1.0))))
        label = f"{n + 1}  {names[n]}" if n < len(names) else f"{n + 1}"
        cards.append(mb.card(im, label, width))
    return cards


def slide_cards(pages, width, pad=8):
    import make_boards as mb
    return [mb.card(Image.open(p).convert("RGB"), f"{n + 1}", width, pad=pad) for n, p in enumerate(pages)]


def visible_sheets(path):
    from openpyxl import load_workbook
    wb = load_workbook(path, read_only=True)
    try:
        return [ws.title for ws in wb.worksheets if ws.sheet_state == "visible"]
    finally:
        wb.close()


def render(ext, item):
    d = os.path.join(PUB, ext, item)
    files = sorted(glob.glob(os.path.join(d, "*." + ext)))
    assert len(files) == 50, (item, len(files))
    limit = int(os.environ.get("PV_LIMIT", "50"))
    files = files[:limit]
    work = tempfile.mkdtemp(prefix=f"pv_{item}_")
    src = os.path.join(work, "src")
    os.makedirs(src)
    names = {}
    for k, f in enumerate(files, 1):
        tmp = os.path.join(src, f"{item}-{k:02d}.{ext}")
        if ext == "xlsx" and item != "quote":  # 견적서는 A4 한 장 인쇄 설정이 이미 들어 있어 그대로 씁니다
            fit_width(f, tmp)
        elif ext == "pptx" and item.endswith("pro"):
            pro_preview.preview_copy(f, tmp)  # 프리미엄 PPT: 글꼴 이름만 미리보기용으로 바꾼 복사본(원본은 그대로)
        else:
            shutil.copy(f, tmp)
        names[k] = tmp
    pdfdir = os.path.join(work, "pdf")
    os.makedirs(pdfdir)
    chunks = [list(names.values())[i:i + BATCH] for i in range(0, len(names), BATCH)]
    with ThreadPoolExecutor(3) as ex:
        list(ex.map(lambda a: to_pdfs(a[1], pdfdir, os.path.join(tempfile.gettempdir(), f"lo_pv_{a[0]}")), enumerate(chunks)))
    for k in range(1, len(files) + 1):
        pdf = os.path.join(pdfdir, f"{item}-{k:02d}.pdf")
        assert os.path.exists(pdf), f"변환 실패 {pdf}"
        img = os.path.join(work, f"{item}-{k:02d}")
        last = "14" if ext == "xlsx" else "40"
        dpi = "110" if ext == "xlsx" else "80"
        subprocess.run(["pdftoppm", "-jpeg", "-jpegopt", "quality=80", "-r", dpi, "-f", "1", "-l", last, pdf, img], check=True)
        pages = sorted(glob.glob(img + "-*.jpg"))
        assert pages, pdf
        raw_pages = pages
        if ext == "xlsx":
            import make_boards as mb
            pages = mb.sheet_first_pages(pdf, pages)[:6]  # 길어서 이어진 쪽은 빼고 시트마다 첫 쪽만
        if ext == "pptx" and item.endswith("pro"):
            bad = pro_check.overlaps(pdf)
            assert not bad, f"{item}-{k:02d}: 글자 겹침 {bad[:3]}"
        large = os.path.join(d, "large", f"{item}-{k:02d}.jpg")
        if ext == "pptx":
            news = item.startswith("news")
            board_large(slide_cards(pages, 400 if news else 560), 3 if news else 2, 400 if news else 560, large)
        else:
            names_k = visible_sheets(files[k - 1])
            board_large(sheet_cards(pages, names_k, 780), 1, 780, large)
            thumb_pages = raw_pages[:1] if item == "quote" else (raw_pages[1:2] if len(raw_pages) > 1 else raw_pages[:1])  # 견적서는 첫 쪽이 견적서 본문
            thumb_card(thumb_pages, 720, 556, os.path.join(d, "thumbs", f"{item}-{k:02d}.jpg"))
    shutil.rmtree(work, ignore_errors=True)
    print(ext, item, f"{len(files)}장 완료")


if __name__ == "__main__":
    ext = sys.argv[1]
    items = sys.argv[2:] or sorted(os.listdir(os.path.join(PUB, ext)))
    for it in items:
        render(ext, it)
