"""양식노트 페이지 표지용 색상 배너(글자 없음) 500장 생성.
pack.data.json 의 테마 색(main/soft/dark)만 사용합니다. 실행: python3 scripts/fun/notion/make_banners.py"""
import json, os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.abspath(__file__)) + "/../../.."
DATA = json.load(open(f"{ROOT}/src/config/pack.data.json"))
KEYS = ["talkpro", "familypro", "birthdaypro", "weddingpro", "newspro", "ledger", "saving", "gift", "allowance", "quote"]
OUT = f"{ROOT}/public/notion/banner"
W, H = 1500, 500

def rgb(h): h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def make(e):
    soft, main, dark = rgb(e["soft"]), rgb(e["main"]), rgb(e["dark"])
    im = Image.new("RGB", (W, H), soft)
    d = ImageDraw.Draw(im)
    d.ellipse((W - 640, -220, W + 220, 640), fill=main)
    d.ellipse((W - 380, 160, W + 100, 640), fill=dark)
    d.rounded_rectangle((90, 190, 760, 222), 16, fill=main)
    d.rounded_rectangle((90, 250, 560, 274), 12, fill=dark)
    d.rounded_rectangle((90, 302, 420, 322), 10, fill=main)
    return im

os.makedirs(OUT, exist_ok=True)
n = 0
for k in KEYS:
    ext = "pptx" if k.endswith("pro") else "xlsx"
    for e in DATA[f"{ext}-{k}"]:
        make(e).save(f"{OUT}/{k}-{e['no']:02d}.jpg", quality=82)
        n += 1
print("banners", n)
