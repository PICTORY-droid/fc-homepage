"""노션 '한 벌 전체' 미리보기 보드 — 엑셀·PPT 01번 양식을 LibreOffice 로 PDF 로 바꾼 뒤,
쪽마다 여백을 잘라 내고 카드(그림자·둥근 모서리·이름표)로 정돈해 한 장의 보드로 만듭니다.
결과: public/notion/board/<항목>-01.jpg  (원본 xlsx·pptx 와 사이트용 large/thumbs 그림은 건드리지 않습니다)
사용: python3 make_boards.py [항목 ...]   (항목: ledger saving gift allowance quote talkpro familypro birthdaypro weddingpro newspro)"""
import glob
import os
import shutil
import subprocess
import sys
import tempfile

from openpyxl import load_workbook
from PIL import Image, ImageDraw, ImageFilter, ImageFont

import make_previews as mp
import pro_preview

ROOT = mp.ROOT
PUB = mp.PUB
OUT = os.path.join(ROOT, "public", "notion", "board")
BG, ORANGE, INK, SOFT = "#FFF6EE", "#FF883A", "#333333", "#8a6a55"
FONT_B = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
FONT_R = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"

TITLES = {
    "ledger": ("가계부", "엑셀 한 벌 · 01번 1인가구"),
    "saving": ("월 저축·적금 플래너", "엑셀 한 벌 · 01번"),
    "gift": ("경조사비 장부", "엑셀 한 벌 · 01번"),
    "allowance": ("용돈기입장", "엑셀 한 벌 · 01번"),
    "quote": ("자동 계산 견적서", "엑셀 한 벌 · 01번"),
    "talkpro": ("발표 템플릿", "PPT 한 벌 · 01번"),
    "familypro": ("가족 소개 슬라이드", "PPT 한 벌 · 01번"),
    "birthdaypro": ("돌잔치 슬라이드", "PPT 한 벌 · 01번"),
    "weddingpro": ("결혼식 슬라이드", "PPT 한 벌 · 01번"),
    "newspro": ("카드뉴스", "PPT 한 벌 · 01번"),
}


def font(path, size, idx=1):
    return ImageFont.truetype(path, size, index=idx)


def crop_content(im, pad=14):
    g = im.convert("L").point(lambda v: 255 if v < 244 else 0)
    box = g.getbbox()
    if not box:
        return im
    x0, y0, x1, y1 = box
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))


def fade_bottom(im, px=70):
    w, h = im.size
    mask = Image.new("L", (w, h), 255)
    d = ImageDraw.Draw(mask)
    for k in range(px):
        d.line([(0, h - px + k), (w, h - px + k)], fill=int(255 * (1 - k / px)))
    white = Image.new("RGB", (w, h), "white")
    return Image.composite(im, white, mask)


def card(content, label, width, pad=22):
    """content 를 흰 카드에 담고 위에 이름표를 붙입니다. 그림자 포함 RGBA 반환."""
    scale = min((width - 2 * pad) / content.width, 1.3)  # 작은 표를 지나치게 키우지 않아 카드끼리 글자 크기가 비슷하게
    c = content.resize((max(1, int(content.width * scale)), max(1, int(content.height * scale))), Image.LANCZOS)
    ch = c.height + 2 * pad
    chip_h = 44
    sh = 26
    layer = Image.new("RGBA", (width + 2 * sh, ch + chip_h + 2 * sh), (0, 0, 0, 0))
    shadow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((sh, sh + chip_h + 6, sh + width, sh + chip_h + 6 + ch), 18, fill=(120, 70, 20, 60))
    layer.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(10)))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle((sh, sh + chip_h, sh + width, sh + chip_h + ch), 18, fill="white", outline="#F3DCC8", width=2)
    layer.paste(c, (sh + (width - c.width) // 2, sh + chip_h + pad))
    f = font(FONT_B, 24)
    tw = d.textlength(label, font=f)
    d.rounded_rectangle((sh, sh, sh + tw + 40, sh + 38), 19, fill=ORANGE)
    d.text((sh + 20, sh + 19), label, font=f, fill="white", anchor="lm")
    return layer


THUMB_DIR = os.environ.get("THUMB_DIR")  # 지정하면 격자용 대표 쪽(여백 제거)도 PNG 로 저장하고, SKIP_BOARD=1 이면 보드는 다시 만들지 않습니다


def dump_thumb(item, k, im):
    if THUMB_DIR:
        os.makedirs(THUMB_DIR, exist_ok=True)
        im.save(os.path.join(THUMB_DIR, f"{item}-{k:02d}.png"))


def board(cards, title, sub, cols, cw, path):
    if os.environ.get("SKIP_BOARD"):
        return (0, 0)
    sh = 26
    margin, gap, head = 70, 10, 170
    colw = cw + 2 * sh
    W = margin * 2 + cols * colw + (cols - 1) * gap
    heights = [0] * cols
    place = []
    for cimg in cards:
        k = heights.index(min(heights))
        place.append((k, heights[k]))
        heights[k] += cimg.height + 6
    H = head + max(heights) + margin
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((margin, 54, margin + 10, 54 + 78), 5, fill=ORANGE)
    d.text((margin + 30, 62), title, font=font(FONT_B, 46), fill=INK)
    d.text((margin + 30, 126), sub, font=font(FONT_R, 26), fill=SOFT)
    base = im.convert("RGBA")
    for cimg, (k, y) in zip(cards, place):
        base.alpha_composite(cimg, (margin + k * (colw + gap), head + y))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    base.convert("RGB").save(path, "JPEG", quality=88, optimize=True)
    return base.size


BANNED = ("우체국", "상담 안내")  # 견적서의 '연락처'·가계부의 '보험료' 같은 양식 칸 이름은 양식의 일부라 허용


def scrub(path):
    """미리보기 사본에서만 '우체국보험 상담 안내 · ' 같은 문구를 지웁니다(노션 본문 규칙: 우체국·보험·연락처 단어 금지). 원본 파일은 그대로 둡니다."""
    import zipfile
    tmp = path + ".tmp"
    with zipfile.ZipFile(path) as zi, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zo:
        for it in zi.infolist():
            b = zi.read(it.filename)
            if it.filename.endswith(".xml") and it.filename.startswith(("xl/", "ppt/slides/")):
                t = b.decode("utf-8")
                t = t.replace("우체국보험 상담 안내 · ", "").replace("성탄 우체국 테마", "성탄 테마").replace("성탄 카드 부치러 간 우체국 앞", "성탄 카드 부치러 간 골목 앞")
                b = t.encode("utf-8")
            zo.writestr(it, b)
    os.replace(tmp, path)


def banned_in(pdf):
    txt = subprocess.run(["pdftotext", pdf, "-"], capture_output=True, text=True).stdout
    return [w for w in BANNED if w in txt]


def desc(src):
    """파일 이름(종류_번호_구성_테마)에서 '01번 · 1인가구 · 매화피는아침' 꼴의 설명을 만듭니다."""
    parts = os.path.splitext(os.path.basename(src))[0].replace("우체국", "").split("_")
    return f"{parts[1]}번 · " + " · ".join(parts[2:]) if len(parts) > 2 else parts[-1]


def sheet_first_pages(pdf, pages):
    """시트마다 첫 쪽만 고릅니다. 앞쪽의 '제목 줄이 아닌 줄'과 첫 줄이 같으면 길어서 이어진 쪽입니다."""
    keep, seen = [], set()
    for n, p in enumerate(pages, 1):
        txt = subprocess.run(["pdftotext", "-f", str(n), "-l", str(n), "-layout", pdf, "-"], capture_output=True, text=True).stdout
        lines = [" ".join(l.split()) for l in txt.splitlines() if l.strip()]
        if not (lines and lines[0] in seen):
            keep.append(p)
        seen |= set(lines[1:])
    return keep


def excel_board(item, k=1):
    src = sorted(glob.glob(os.path.join(PUB, "xlsx", item, "*.xlsx")))[k - 1]
    work = tempfile.mkdtemp(prefix=f"bd_{item}_")
    tmp = os.path.join(work, f"{item}-{k:02d}.xlsx")
    if item == "quote":
        shutil.copy(src, tmp)
    else:
        mp.fit_width(src, tmp)
    scrub(tmp)
    mp.to_pdfs([tmp], work, os.path.join(tempfile.gettempdir(), "lo_bd_x"))
    pdf = os.path.join(work, f"{item}-{k:02d}.pdf")
    bad = banned_in(pdf)
    assert not bad, f"{item}: 금칙어 {bad}"
    subprocess.run(["pdftoppm", "-jpeg", "-jpegopt", "quality=92", "-r", "120", "-f", "1", "-l", "16", pdf, os.path.join(work, "p")], check=True)
    pages = sorted(glob.glob(os.path.join(work, "p-*.jpg")))
    keep = sheet_first_pages(pdf, pages)
    names = [ws.title for ws in load_workbook(src, read_only=True).worksheets if ws.sheet_state == "visible"]
    cards = []
    main_i = 0 if item == "quote" else 1
    if THUMB_DIR and len(keep) > main_i:
        dump_thumb(item, k, crop_content(Image.open(keep[main_i]).convert("RGB")))
    for n, p in enumerate(keep[:len(names)] if len(keep) >= len(names) else keep):
        im = crop_content(Image.open(p).convert("RGB"))
        label = f"{n + 1}  {names[n]}" if n < len(names) else f"{n + 1}"
        if im.height > im.width * 0.85:  # 긴 표는 앞부분만 보이고 아래는 부드럽게 사라지게
            im = fade_bottom(im.crop((0, 0, im.width, int(im.width * 0.85))))
        cards.append(card(im, label, 680))
    t, s = TITLES[item]
    s = f"{s.split(' · ')[0]} · {desc(src)}"
    out = os.path.join(OUT, f"{item}-{k:02d}.jpg")
    size = board(cards, t, f"{s} · 시트 {len(cards)}개를 모두 보여드려요", 2, 680, out)
    shutil.rmtree(work, ignore_errors=True)
    return out, size, len(cards), names


def pptx_board(item, k=1):
    src = sorted(glob.glob(os.path.join(PUB, "pptx", item, "*.pptx")))[k - 1]
    work = tempfile.mkdtemp(prefix=f"bd_{item}_")
    tmp = os.path.join(work, f"{item}-{k:02d}.pptx")
    pro_preview.preview_copy(src, tmp)
    scrub(tmp)
    mp.to_pdfs([tmp], work, os.path.join(tempfile.gettempdir(), "lo_bd_p"))
    pdf = os.path.join(work, f"{item}-{k:02d}.pdf")
    bad = banned_in(pdf)
    assert not bad, f"{item}: 금칙어 {bad}"
    subprocess.run(["pdftoppm", "-jpeg", "-jpegopt", "quality=92", "-r", "110", "-f", "1", "-l", "20", pdf, os.path.join(work, "p")], check=True)
    pages = sorted(glob.glob(os.path.join(work, "p-*.jpg")))
    square = item.startswith("news")
    dump_thumb(item, k, Image.open(pages[0]).convert("RGB"))
    cols, cw = (3, 520) if square else (2, 680)
    cards = [card(Image.open(p).convert("RGB"), f"{n + 1}", cw, pad=10) for n, p in enumerate(pages)]
    t, s = TITLES[item]
    unit = "카드" if square else "슬라이드"
    s = f"{s.split(' · ')[0]} · {desc(src)}"
    out = os.path.join(OUT, f"{item}-{k:02d}.jpg")
    size = board(cards, t, f"{s} · {unit} {len(cards)}장을 모두 보여드려요", cols, cw, out)
    shutil.rmtree(work, ignore_errors=True)
    return out, size, len(cards), []


if __name__ == "__main__":
    # 사용: python3 make_boards.py <항목> [번호 ...]   번호를 안 쓰면 01번만, all 이면 50종 모두
    it = sys.argv[1]
    nums = [1] if len(sys.argv) == 2 else (range(1, 51) if sys.argv[2] == "all" else [int(a) for a in sys.argv[2:]])
    for k in nums:
        try:
            r = excel_board(it, k) if it in ("ledger", "saving", "gift", "allowance", "quote") else pptx_board(it, k)
            print(it, k, r[1], r[2], flush=True)
        except Exception as e:  # 한 장이 실패해도 나머지는 계속
            print("FAIL", it, k, e, flush=True)
