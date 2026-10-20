"""노션 '50종 한눈에 보기' 격자 — 대표 쪽 그림(make_boards.py 가 THUMB_DIR 로 저장)을 카드 25장씩 정돈해 2장으로 만듭니다.
제목이 잘리지 않도록 '맞춰 넣기(contain)'로 담고, 카드마다 번호표와 테마 이름을 붙입니다. 결과: public/notion/grid/<종류>-1.jpg, -2.jpg
사용: THUMB_DIR=/tmp/gridthumbs python3 make_grids.py [종류 ...]"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
THUMBS = os.environ.get("THUMB_DIR", "/tmp/gridthumbs")
OUT = os.path.join(ROOT, "public", "notion", "grid")
BG, ORANGE, INK, SOFT = "#FFF6EE", "#FF883A", "#333333", "#8a6a55"
FB = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
FR = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
TITLES = {
    "ledger": ("가계부 엑셀", 4 / 3), "saving": ("월 저축·적금 플래너 엑셀", 4 / 3), "gift": ("경조사비 장부 엑셀", 4 / 3),
    "allowance": ("용돈기입장 엑셀", 4 / 3), "quote": ("견적서 엑셀", 4 / 3),
    "talkpro": ("발표 PPT 템플릿", 16 / 9), "familypro": ("가족 소개 PPT", 16 / 9), "birthdaypro": ("돌잔치 PPT", 16 / 9),
    "weddingpro": ("결혼식 PPT", 16 / 9), "newspro": ("카드뉴스 템플릿", 1.0),
}
W, M, GAP, COLS = 1900, 60, 28, 5
CW = (W - 2 * M - (COLS - 1) * GAP) // COLS


def font(path, size):
    return ImageFont.truetype(path, size, index=1)


def contain(im, w, h):
    sc = min(w / im.width, h / im.height)
    return im.resize((max(1, int(im.width * sc)), max(1, int(im.height * sc))), Image.LANCZOS)


def cell(im, no, name, ch):
    sh = 18
    layer = Image.new("RGBA", (CW + 2 * sh, ch + 44 + 2 * sh), (0, 0, 0, 0))
    shadow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((sh, sh + 8, sh + CW, sh + 8 + ch), 16, fill=(120, 70, 20, 55))
    layer.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(8)))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle((sh, sh, sh + CW, sh + ch), 16, fill="white", outline="#F3DCC8", width=2)
    c = contain(im, CW - 24, ch - 24)
    layer.paste(c, (sh + (CW - c.width) // 2, sh + (ch - c.height) // 2))
    f = font(FB, 24)
    tw = d.textlength(no, font=f)
    d.rounded_rectangle((sh - 6, sh - 10, sh - 6 + tw + 28, sh + 26), 18, fill=ORANGE)
    d.text((sh + 8, sh + 8), no, font=f, fill="white", anchor="lm")
    nm = name
    fr = font(FR, 21)
    while d.textlength(nm, font=fr) > CW and len(nm) > 3:
        nm = nm[:-1]
    d.text((sh + CW / 2, sh + ch + 22), nm, font=fr, fill=SOFT, anchor="mm")
    return layer


def build(kind, half, names):
    title, ar = TITLES[kind]
    ch = int((CW - 24) / ar) + 24
    rows = 5
    cell_h = ch + 44 + 36
    H = 190 + rows * cell_h + M
    im = Image.new("RGBA", (W, H), BG)
    d = ImageDraw.Draw(im)
    a, b = (1, 25) if half == 1 else (26, 50)
    d.rounded_rectangle((M, 52, M + 10, 132), 5, fill=ORANGE)
    d.text((M + 30, 56), f"{title} {a:02d}~{b:02d}번", font=font(FB, 48), fill=INK)
    d.text((M + 30, 124), "번호마다 모두 다른 양식이에요", font=font(FR, 26), fill=SOFT)
    for n in range(a, b + 1):
        i = n - a
        r, c = divmod(i, COLS)
        t = Image.open(os.path.join(THUMBS, f"{kind}-{n:02d}.png")).convert("RGB")
        im.alpha_composite(cell(t, f"{n:02d}", names[n - 1], ch), (M - 18 + c * (CW + GAP), 170 + r * cell_h))
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f"{kind}-{half}.jpg")
    im.convert("RGB").save(path, "JPEG", quality=88, optimize=True)
    return path, im.size


if __name__ == "__main__":
    data = json.load(open(os.path.join(ROOT, "src", "config", "pack.data.json")))
    for kind in sys.argv[1:] or list(TITLES):
        ext = "pptx" if kind.endswith("pro") else "xlsx"
        names = [e["name"].replace("우체국", "").strip() for e in data[f"{ext}-{kind}"]]
        for half in (1, 2):
            print(build(kind, half, names), flush=True)
