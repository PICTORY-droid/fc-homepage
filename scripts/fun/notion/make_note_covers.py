"""노션 '상품노트'·'보험노트(FAQ)' 커버 — 1800×600, 글·그림은 정가운데(약 900×210)에만 둡니다.
노션은 데스크톱에서 약 6:1, 모바일에서 약 2.1:1 로 가운데만 잘라 보여 주므로, 예전 1800×240 가로 띠는 모바일에서 잘렸어요.
저장: public/notion/prod/<상품코드>.jpg, public/notion/faq/<FAQ번호>.jpg, public/notion/cover-insurance-v2.jpg
저장(보험노트 안내 글 7개): public/notion/note/N<번호>.jpg
사용: python3 scripts/fun/notion/make_note_covers.py [prod|faq|note|hub|all]"""
import json
import os
import re
import sys

from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
OUT = os.path.join(ROOT, "public", "notion")
CW, CH = 1800, 600
BG, ORANGE, DARK, INK, SUB = "#FFF6EC", "#E8571F", "#C4501A", "#2E241E", "#8F7F75"
FONT = "'Noto Sans CJK KR','Noto Sans CJK JP',sans-serif"

# 우체국 편지봉투 캐릭터 (200×200 상자 안)
MASCOT = (
    '<svg x="{x}" y="{y}" width="150" height="150" viewBox="0 0 200 200">'
    '<path d="M42 70 Q100 8 158 70 Z" fill="#E8571F"/><rect x="34" y="62" width="132" height="12" rx="6" fill="#C4501A"/>'
    '<circle cx="100" cy="34" r="11" fill="#FFD3B8" stroke="#C4501A" stroke-width="6"/>'
    '<rect x="26" y="66" width="148" height="116" rx="24" fill="#fff" stroke="#E8571F" stroke-width="9"/>'
    '<circle cx="78" cy="112" r="7" fill="#2E241E"/><circle cx="122" cy="112" r="7" fill="#2E241E"/>'
    '<circle cx="60" cy="130" r="9" fill="#FFC9AE"/><circle cx="140" cy="130" r="9" fill="#FFC9AE"/>'
    '<path d="M90 128 Q100 138 110 128" fill="none" stroke="#2E241E" stroke-width="6" stroke-linecap="round"/>'
    '<path d="M36 160 L68 142 M164 160 L132 142" stroke="#E8571F" stroke-width="7" stroke-linecap="round"/></svg>'
)

TEXT_W = 720  # 글 상자 너비 (그림 150 + 간격 30 + 글 720 = 900, 정가운데)


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def split_lines(title):
    """제목이 길면 가운데 근처에서 두 줄로 나눕니다."""
    if len(title) <= 11:
        return [title]
    mid = len(title) // 2
    best = min(range(2, len(title) - 1), key=lambda i: abs(i - mid))
    return [title[:best], title[best:]]


def cover_html(tag, title, sub):
    lines = split_lines(title)
    longest = max(len(l) for l in lines)
    size = max(40, min(66 if len(lines) == 1 else 56, int(TEXT_W / (longest * 0.98))))
    title_h = int(size * 1.18) * len(lines)
    tag_h, sub_h, g1, g2 = 28, 26, 16, 14
    total = tag_h + g1 + title_h + g2 + sub_h
    top = (CH - total) // 2
    left = (CW - (150 + 30 + TEXT_W)) // 2
    tx = left + 180
    rows = "".join(
        f'<text x="{tx}" y="{top + tag_h + g1 + int(size * 1.18) * (i + 1) - int(size * 0.2)}" font-size="{size}" font-weight="800" fill="{INK}">{esc(l)}</text>'
        for i, l in enumerate(lines))
    return (f'<!doctype html><meta charset="utf-8"><body style="margin:0;background:{BG}">'
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{CW}" height="{CH}" viewBox="0 0 {CW} {CH}" font-family="{FONT}">'
            f'<rect width="{CW}" height="{CH}" fill="{BG}"/>'
            f'<circle cx="150" cy="110" r="120" fill="#FFE6D2" opacity=".8"/><circle cx="1690" cy="520" r="140" fill="#FFE0C8" opacity=".75"/>'
            f'<circle cx="1560" cy="90" r="60" fill="#FFEBDA"/><circle cx="260" cy="500" r="46" fill="#FFEBDA"/>'
            + MASCOT.format(x=left, y=(CH - 150) // 2 + 4) +
            f'<text x="{tx}" y="{top + 24}" font-size="26" font-weight="700" fill="{ORANGE}">{esc(tag)}</text>'
            f'{rows}'
            f'<text x="{tx}" y="{top + total - 4}" font-size="24" font-weight="500" fill="{SUB}">{esc(sub)}</text>'
            f'</svg>')


def short_name(name):
    """괄호 설명은 짧을 때만 제목에 남깁니다(긴 설명은 페이지 제목에 이미 있어요)."""
    m = re.match(r"^(.*?)(\([^)]*\))?$", name)
    base, paren = m.group(1), m.group(2) or ""
    return base + (paren if paren and len(paren) <= 10 else "")


def jobs(which):
    out = []
    if which in ("prod", "all"):
        for p in json.load(open(os.path.join(ROOT, "src", "config", "products.data.json"), encoding="utf-8")):
            out.append((f"prod/{p['id']}.jpg", cover_html(f"POST OFFICE INSURANCE · {p['group']}", short_name(p["name"]), f"우체국보험 상품노트 · {p['id']}")))
    if which in ("faq", "all"):
        for f in json.load(open(os.path.join(ROOT, "src", "config", "officialFaq.data.json"), encoding="utf-8")):
            out.append((f"faq/{f['id']}.jpg", cover_html(f"Q&A · {f['category']}", "자주 묻는 질문", "우체국보험 공식 FAQ 안내")))
    if which in ("note", "all"):
        # 보험노트 안내 글 7개(번호: 1·2·3·5·7·9·11) — 원래 커버가 없던 글
        tag = "INSURANCE NOTE · "
        for no, t, title, sub in [
            (1, "가입 전 체크", "보험 가입 전 체크리스트", "계약 전에 꼭 확인할 6가지"),
            (2, "보장 이해", "실손보험이란?", "보장 구조와 헷갈리는 점 5가지"),
            (3, "보장 이해", "갱신형 비갱신형 차이", "보험료가 달라지는 이유와 확인 순서"),
            (5, "보장성 상품", "우체국든든한건강종신보험", "가입나이·보험기간·납입 정리"),
            (7, "보장성 상품", "우체국New건강클리닉보험", "가입나이·보험기간·납입 정리"),
            (9, "보장성 상품", "우체국뇌심케어보험", "가입나이·보험기간·납입 정리"),
            (11, "보장성 상품", "우체국암뇌심주요치료비보험(20년갱신형)", "가입나이·보험기간·납입 정리"),
        ]:
            out.append((f"note/N{no:02d}.jpg", cover_html(tag + t, short_name(title), sub)))
    if which in ("hub", "all"):
        out.append(("cover-insurance-v2.jpg", cover_html("INSURANCE NOTE · 우체국보험", "보험노트", "가입 · 보장 · 청구 · 유지, 꼭 알아야 할 보험 정보")))
    return out


if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    todo = jobs(which)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": CW, "height": CH})
        for rel, html in todo:
            path = os.path.join(OUT, rel)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            pg.set_content(html)
            pg.screenshot(path=path, type="jpeg", quality=88, clip={"x": 0, "y": 0, "width": CW, "height": CH})
        b.close()
    print(len(todo), "장 저장")
