"""게시판 배너(1440x240) 만들기 — cafe.config.json 의 각 게시판 bottomBanner 값으로 그립니다.
사용: python cafe/scripts/make-board-banners.py   (Playwright 필요)  결과: cafe/assets/boards/board-NN.png"""
import base64, html, json, pathlib
from playwright.sync_api import sync_playwright

CAFE = pathlib.Path(__file__).resolve().parents[1]
ROOT = CAFE.parent
OUT = CAFE / "assets" / "boards"
MARK = base64.b64encode((ROOT / "public/brand/postal-insurance-mark.svg").read_bytes()).decode()
W, H = 1440, 240  # 네이버 카페 배너 최적 크기
STYLES = {  # 배경, 글자색, 화살표 원 — 홈페이지 색 이름표(tailwind)와 같은 값
    "light": ("linear-gradient(100deg,#FFFFFF 0%,#FFF4EC 60%,#FFDAC1 100%)", "#333333", "#A34506"),
    "tint": ("linear-gradient(100deg,#FFF4EC 0%,#FFDAC1 100%)", "#333333", "#A34506"),
    "deep": ("linear-gradient(100deg,#A34506 0%,#C2560F 100%)", "#FFFFFF", "#C23A26"),
}
CHAR = f"""<svg class="char" viewBox="0 0 200 180"><rect x="35" y="55" width="130" height="100" rx="18" fill="#fff" stroke="#E8591A" stroke-width="5"/><path d="M45 52 Q100 14 155 52 Z" fill="#E8591A"/><rect x="40" y="48" width="120" height="9" rx="4" fill="#C4540A"/><circle cx="100" cy="35" r="17" fill="#fff" stroke="#C4540A" stroke-width="3"/><image href="data:image/svg+xml;base64,{MARK}" x="87" y="21" width="26" height="28"/><path d="M40 150 L72 128 M160 150 L128 128" stroke="#E8591A" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="78" cy="100" r="5.5" fill="#333"/><circle cx="122" cy="100" r="5.5" fill="#333"/><path d="M90 112 Q100 122 110 112" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/><circle cx="64" cy="112" r="7" fill="#FF883A" opacity=".5"/><circle cx="136" cy="112" r="7" fill="#FF883A" opacity=".5"/></svg>"""
CSS = """*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Noto Sans CJK KR',sans-serif;overflow:hidden}
.b{position:relative;width:1440px;height:240px;display:flex;align-items:center;gap:36px;padding:0 72px 10px 56px}
.char{width:178px;height:160px;flex:none}
.t{flex:1;min-width:0;font-size:60px;font-weight:900;letter-spacing:-.02em;white-space:nowrap}
.go{flex:none;width:96px;height:96px;border-radius:50%;color:#fff;font-size:52px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 0 rgba(0,0,0,.18)}
.s{position:absolute;left:0;right:0;bottom:0;height:10px;background:repeating-linear-gradient(135deg,#C23A26 0 22px,#fff 22px 34px,#FF883A 34px 56px,#fff 56px 68px)}"""
FONT = 50  # 모든 배너 같은 글자 크기(가장 긴 문구가 한 줄에 들어가는 크기)
FIT = "()=>{const t=document.querySelector('.t');t.style.fontSize='" + str(FONT) + "px';return t.scrollWidth<=t.clientWidth}"


def main():
    cfg = json.loads((CAFE / "cafe.config.json").read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)
    boards = [b for g in cfg["menus"] for b in g["boards"] if isinstance(b.get("bottomBanner"), dict)]
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": W, "height": H})
        for i, b in enumerate(boards, 1):
            bn = b["bottomBanner"]
            bg, color, go = STYLES[bn["style"]]
            doc = f"""<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="b" style="background:{bg}">{CHAR}<span class="t" style="color:{color}">{html.escape(bn['text'])}</span><span class="go" style="background:{go}">→</span><span class="s"></span></div></body></html>"""
            page.set_content(doc)
            page.wait_for_timeout(200)
            if not page.evaluate(FIT):
                raise SystemExit(f"글자가 한 줄에 안 들어감: {b['name']}")
            name = f"board-{i:02d}.png"
            page.screenshot(path=str(OUT / name))
            bn["file"] = f"assets/boards/{name}"
            bn["size"] = f"{W}x{H}"
            bn["alt"] = bn["text"]  # 대체 텍스트 = 배너 문구 그대로(네이버 안내)
            print(name, b["name"])
        browser.close()
    (CAFE / "cafe.config.json").write_text(json.dumps(cfg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
