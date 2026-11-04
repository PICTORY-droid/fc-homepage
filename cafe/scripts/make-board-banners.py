"""게시판 하단 배너(1080x100) 만들기 — cafe.config.json 의 각 게시판 bottomBanner 값으로 그립니다.
사용: python cafe/scripts/make-board-banners.py   (Playwright 필요)  결과: cafe/assets/boards/board-NN.png"""
import base64, html, json, pathlib
from playwright.sync_api import sync_playwright

CAFE = pathlib.Path(__file__).resolve().parents[1]
ROOT = CAFE.parent
OUT = CAFE / "assets" / "boards"
STYLES = {  # 배경, 아이콘 바탕, 글자색 — 홈페이지 색 이름표(tailwind)와 같은 값
    "light": ("#FFFFFF", "#FFF4EC", "#A34506"),
    "tint": ("#FFF4EC", "#FFFFFF", "#333333"),
    "deep": ("#A34506", "#C2560F", "#FFFFFF"),
}
CSS = """*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Noto Sans CJK KR',sans-serif;overflow:hidden}
.b{position:relative;width:1080px;height:100px;display:flex;align-items:center;gap:24px;padding:0 40px 6px}
.ic{width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:36px;flex:none}
.t{flex:1;font-size:38px;font-weight:900;letter-spacing:-.02em;white-space:nowrap}.go{font-size:40px;font-weight:800}
.s{position:absolute;left:0;right:0;bottom:0;height:6px;background:repeating-linear-gradient(135deg,#C23A26 0 16px,#fff 16px 24px,#FF883A 24px 40px,#fff 40px 48px)}"""


def main():
    cfg = json.loads((CAFE / "cafe.config.json").read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)
    boards = [b for g in cfg["menus"] for b in g["boards"] if isinstance(b.get("bottomBanner"), dict)]
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1080, "height": 100})
        for i, b in enumerate(boards, 1):
            bn = b["bottomBanner"]
            bg, icbg, color = STYLES[bn["style"]]
            doc = f"""<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="b" style="background:{bg}"><span class="ic" style="background:{icbg}">{bn['icon']}</span>
<span class="t" style="color:{color}">{html.escape(bn['text'])}</span><span class="go" style="color:{color}">→</span><span class="s"></span></div></body></html>"""
            page.set_content(doc)
            page.wait_for_timeout(200)
            if page.evaluate("()=>{const t=document.querySelector('.t');return t.scrollWidth>t.clientWidth}"):
                raise SystemExit(f"글자가 넘침: {b['name']}")
            name = f"board-{i:02d}.png"
            page.screenshot(path=str(OUT / name))
            bn["file"] = f"assets/boards/{name}"
            print(name, b["name"])
        browser.close()
    (CAFE / "cafe.config.json").write_text(json.dumps(cfg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
