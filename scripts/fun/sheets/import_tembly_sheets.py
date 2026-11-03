"""템블리(tembly) 저장소의 엑셀서식 100종을 즐길거리 '생활·업무 엑셀 서식'으로 가져옵니다.

사용법:  python3 scripts/fun/sheets/import_tembly_sheets.py <템블리 저장소 경로>

하는 일 (템블리 쪽 파일은 읽기만 하고 고치지 않습니다)
  1) src/features/excel/data/catalog.data.ts 의 목록 → src/config/sheets.data.json
  2) content/excel/<id>.xlsx                  → public/fun/sheets/files/<id>.xlsx
  3) public/excel/thumbs/<id>.jpg             → public/fun/sheets/thumbs/<id>.jpg   (카드용, 크기를 760×500 으로 통일)
  4) <id>.jpg + <id>-dash.jpg                 → public/fun/sheets/large/<id>.jpg    (팝업용, 입력 화면 아래 요약 화면을 이어 붙임)
"""
from __future__ import annotations

import json
import re
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
OUT_DATA = ROOT / "src" / "config" / "sheets.data.json"
OUT_PUBLIC = ROOT / "public" / "fun" / "sheets"
CARD_SIZE = (760, 500)
LARGE_WIDTH = 900
GAP = 24
ID_SHAPE = re.compile(r"^[a-z0-9-]{1,40}$")
GROUPS = {"work", "office", "biz", "life", "study", "event"}
FIELDS = ("id", "title", "desc", "group", "tag", "kind", "featured", "dashboard", "sheets", "highlights")


def load_catalog(tembly: Path) -> list[dict]:
    src = (tembly / "src" / "features" / "excel" / "data" / "catalog.data.ts").read_text(encoding="utf-8")
    m = re.search(r"EXCEL_TEMPLATES[^=]*=\s*(\[.*\]);?\s*$", src, re.S)
    if not m:
        raise SystemExit("템블리 목록(catalog.data.ts)에서 EXCEL_TEMPLATES 배열을 찾지 못했습니다.")
    items = json.loads(m.group(1))
    out = []
    for raw in items:
        item = {k: raw[k] for k in FIELDS}
        if not ID_SHAPE.match(item["id"]):
            raise SystemExit(f"id 모양이 올바르지 않습니다: {item['id']}")
        if item["group"] not in GROUPS:
            raise SystemExit(f"알 수 없는 분야: {item['id']} → {item['group']}")
        out.append(item)
    if len({i["id"] for i in out}) != len(out):
        raise SystemExit("id 가 겹치는 서식이 있습니다.")
    return out


def card_thumb(src: Path, dst: Path) -> None:
    """가로를 760 에 맞추고, 위쪽(제목·표 머리)을 기준으로 760×500 으로 자르거나 흰 여백을 붙입니다."""
    im = Image.open(src).convert("RGB")
    w, h = CARD_SIZE
    im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    canvas = Image.new("RGB", CARD_SIZE, (255, 255, 255))
    canvas.paste(im.crop((0, 0, w, min(h, im.height))), (0, 0))
    canvas.save(dst, "JPEG", quality=84, optimize=True, progressive=True)


def large_preview(thumb: Path, dash: Path | None, dst: Path) -> None:
    parts = [Image.open(p).convert("RGB") for p in (thumb, dash) if p is not None]
    parts = [p.resize((LARGE_WIDTH, round(p.height * LARGE_WIDTH / p.width)), Image.LANCZOS) for p in parts]
    height = sum(p.height for p in parts) + GAP * (len(parts) - 1)
    canvas = Image.new("RGB", (LARGE_WIDTH, height), (239, 239, 239))
    y = 0
    for p in parts:
        canvas.paste(p, (0, y))
        y += p.height + GAP
    canvas.save(dst, "JPEG", quality=82, optimize=True, progressive=True)


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    tembly = Path(sys.argv[1]).resolve()
    items = load_catalog(tembly)
    for sub in ("files", "thumbs", "large"):
        (OUT_PUBLIC / sub).mkdir(parents=True, exist_ok=True)

    thumbs_dir = tembly / "public" / "excel" / "thumbs"
    for item in items:
        tid = item["id"]
        xlsx = tembly / "content" / "excel" / f"{tid}.xlsx"
        thumb = thumbs_dir / f"{tid}.jpg"
        dash = thumbs_dir / f"{tid}-dash.jpg"
        for need in (xlsx, thumb):
            if not need.exists():
                raise SystemExit(f"파일이 없습니다: {need}")
        if item["dashboard"] and not dash.exists():
            raise SystemExit(f"요약 화면 그림이 없습니다: {dash}")
        shutil.copyfile(xlsx, OUT_PUBLIC / "files" / f"{tid}.xlsx")
        card_thumb(thumb, OUT_PUBLIC / "thumbs" / f"{tid}.jpg")
        large_preview(thumb, dash if item["dashboard"] else None, OUT_PUBLIC / "large" / f"{tid}.jpg")

    OUT_DATA.write_text(json.dumps({"source": "tembly", "count": len(items), "items": items}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"완료: 서식 {len(items)}종 → {OUT_DATA.relative_to(ROOT)}, public/fun/sheets/")


if __name__ == "__main__":
    main()
