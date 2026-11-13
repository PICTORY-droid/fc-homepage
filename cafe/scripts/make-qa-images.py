"""자주 묻는 보험 Q&A 카드뉴스 — python3 cafe/scripts/make-qa-images.py [slug ...]

글 머리말의 qcat(분류) · qq(질문 두 줄, | 로 나눔) · qmode(flow 차례 | check 체크) · ql(답 2~4줄, | 로 나눔) · qnote(※ 한 줄)로
1080 정사각형 손그림 카드 한 장을 그립니다(캐릭터 없이 글자 + 선·화살표만). 결과: cafe/assets/qa/<slug>.png
"""
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
POSTS = ROOT / "cafe/posts"
OUT = ROOT / "cafe/assets/qa"
TEMPLATE = (ROOT / "cafe/scripts/hand.html").as_uri()


def meta(path: Path) -> dict:
    head = path.read_text(encoding="utf-8").split("---")[1]
    return {k: v.strip() for k, v in re.findall(r"^(\w+):\s*(.*)$", head, re.M)}


def main(slugs):
    OUT.mkdir(parents=True, exist_ok=True)
    posts = [m for m in (meta(p) for p in sorted(POSTS.glob("*.md"))) if m.get("qq") and (not slugs or m["slug"] in slugs)]
    with sync_playwright() as p:
        b = p.chromium.launch()
        for m in posts:
            d = {"kind": "qa", "menu": m["menu"], "cat": m["qcat"], "q": m["qq"].split("|"), "mode": m.get("qmode", "check"),
                 "lines": m["ql"].split("|"), "note": m.get("qnote", "")}
            pg = b.new_page(viewport={"width": 1080, "height": 1080})
            pg.goto(TEMPLATE)
            pg.evaluate("document.fonts.ready")
            pg.evaluate("d => render(d)", d)
            pg.wait_for_timeout(150)
            over = pg.evaluate("()=>[...document.querySelectorAll('.txt')].filter(e=>{const r=e.getBoundingClientRect();return r.right>1050||r.left<30}).map(e=>e.textContent)")
            if over:
                raise SystemExit(f"글자가 틀 밖으로 나감: {m['slug']} {over}")
            pg.screenshot(path=str(OUT / f"{m['slug']}.png"))
            pg.close()
            print(m["slug"], flush=True)
        b.close()


if __name__ == "__main__":
    main(sys.argv[1:])
