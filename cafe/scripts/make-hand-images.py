"""손그림체 카페 글 이미지 만들기 — 원고 머리말에 icon 이 있는 글마다 2장(대표 썸네일 + 길잡이 메모 카드).
대표: thumb(두 줄)·sub·menu·icon / 메모 카드: cardTitle·card(| 로 구분한 5줄)
사용: python cafe/scripts/make-hand-images.py   결과: cafe/assets/hand/<slug>-1.png, <slug>-2.png (1080x1080)"""
import json, pathlib, re
from playwright.sync_api import sync_playwright

CAFE = pathlib.Path(__file__).resolve().parents[1]
OUT = CAFE / "assets" / "hand"
TEMPLATE = (CAFE / "scripts" / "hand.html").as_uri()


def meta(text):
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    out = {}
    for line in (m.group(1) if m else "").splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            v = v.strip()
            out[k.strip()] = [x.strip() for x in v[1:-1].split(",")] if v.startswith("[") else v
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        for f in sorted((CAFE / "posts").glob("*.md")):
            m = meta(f.read_text(encoding="utf-8"))
            if "icon" not in m:
                continue
            m["card"] = [x.strip() for x in m.get("card", "").split("|") if x.strip()]
            for n, kind in ((1, "thumb"), (2, "card")):
                page = b.new_page(viewport={"width": 1080, "height": 1080})
                page.goto(TEMPLATE)
                page.evaluate("document.fonts.ready")
                page.evaluate("d => render(d)", {**m, "kind": kind})
                page.wait_for_timeout(300)
                over = page.evaluate("()=>[...document.querySelectorAll('.txt')].some(e=>{const r=e.getBoundingClientRect();return r.right>1050||r.left<30})")
                if over:
                    raise SystemExit(f"글자가 틀 밖으로 나감: {f.name} {kind}")
                page.screenshot(path=str(OUT / f"{m['slug']}-{n}.png"))
                page.close()
            print(m["slug"])
        b.close()


if __name__ == "__main__":
    main()
