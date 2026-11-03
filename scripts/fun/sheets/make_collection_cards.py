"""테마 모음(예전 '엑셀 양식') 카드 미리보기를 서식 카드와 같은 모양(760×500, 흰 바탕, 위쪽 기준)으로 만듭니다.

사용:  python3 scripts/fun/sheets/make_collection_cards.py
입력:  public/fun/pack/xlsx/<항목>/thumbs/<항목>-NN.jpg   (scripts/fun/pack/make_previews.py 가 만든 '문서 한 장' 그림)
출력:  public/fun/pack/xlsx/<항목>/cards/<항목>-NN.jpg    (src/config/sheets.ts 의 collectionCardThumb)
미리보기를 다시 만들었다면 이 스크립트도 다시 실행하세요.
"""
from __future__ import annotations

import glob
import os

from PIL import Image, ImageChops

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
PACK = os.path.join(ROOT, "public", "fun", "pack", "xlsx")
SIZE = (760, 500)
PAD = 6  # 문서 테두리 바깥 그림자를 빼려고 좌우·아래를 안쪽으로 조금 더 자름(위쪽은 제목이 붙어 있어 그대로)
TOP = 10  # 카드 위쪽 여백 — 서식 카드처럼 제목이 가장자리에 붙지 않게


def document_box(im: Image.Image) -> tuple[int, int, int, int]:
    """배경(모서리 색)과 다른 부분 = 문서 영역. 그림자는 PAD 만큼 안쪽으로 잘라 냅니다."""
    bg = Image.new("RGB", im.size, im.getpixel((2, 2)))
    diff = ImageChops.difference(im, bg).convert("L").point(lambda v: 255 if v > 18 else 0)
    box = diff.getbbox()
    if not box:
        return (0, 0, *im.size)
    l, t, r, b = box
    return (l + PAD, t + 1, r - PAD, b - PAD * 3)


def card(src: str, dst: str) -> None:
    im = Image.open(src).convert("RGB")
    doc = im.crop(document_box(im))
    w, h = SIZE
    doc = doc.resize((w, round(doc.height * w / doc.width)), Image.LANCZOS)
    canvas = Image.new("RGB", SIZE, (255, 255, 255))
    canvas.paste(doc.crop((0, 0, w, min(h - TOP, doc.height))), (0, TOP))
    canvas.save(dst, "JPEG", quality=84, optimize=True, progressive=True)


def main() -> None:
    total = 0
    for item_dir in sorted(glob.glob(os.path.join(PACK, "*"))):
        thumbs = sorted(glob.glob(os.path.join(item_dir, "thumbs", "*.jpg")))
        if not thumbs:
            continue
        out = os.path.join(item_dir, "cards")
        os.makedirs(out, exist_ok=True)
        for t in thumbs:
            card(t, os.path.join(out, os.path.basename(t)))
        total += len(thumbs)
        print(os.path.basename(item_dir), len(thumbs))
    print("완료:", total)


if __name__ == "__main__":
    main()
