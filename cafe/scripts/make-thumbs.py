"""카페 글 대표 이미지(1080x1080) 만들기 — 원고 머리말의 thumb(두 줄 제목)·sub(한 줄)·menu(게시판)로 그립니다.
네이버 검색 결과의 작은 썸네일에서도 읽히도록 글자를 크게, 가운데 안전 영역 안에만 둡니다.
사용: python cafe/scripts/make-thumbs.py   결과: cafe/assets/thumbs/<slug>.png"""
import base64, html, pathlib, re
from playwright.sync_api import sync_playwright

CAFE = pathlib.Path(__file__).resolve().parents[1]
ROOT = CAFE.parent
OUT = CAFE / "assets" / "thumbs"
MARK = base64.b64encode((ROOT / "public/brand/postal-insurance-mark.svg").read_bytes()).decode()
CHAR = f"""<svg class="char" viewBox="0 0 200 180"><rect x="35" y="55" width="130" height="100" rx="18" fill="#fff" stroke="#E8591A" stroke-width="5"/><path d="M45 52 Q100 14 155 52 Z" fill="#E8591A"/><rect x="40" y="48" width="120" height="9" rx="4" fill="#C4540A"/><circle cx="100" cy="35" r="17" fill="#fff" stroke="#C4540A" stroke-width="3"/><image href="data:image/svg+xml;base64,{MARK}" x="87" y="21" width="26" height="28"/><path d="M40 150 L72 128 M160 150 L128 128" stroke="#E8591A" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="78" cy="100" r="5.5" fill="#333"/><circle cx="122" cy="100" r="5.5" fill="#333"/><path d="M90 112 Q100 122 110 112" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/><circle cx="64" cy="112" r="7" fill="#FF883A" opacity=".5"/><circle cx="136" cy="112" r="7" fill="#FF883A" opacity=".5"/></svg>"""
CSS = """*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Noto Sans CJK KR',sans-serif;overflow:hidden}
.c{position:relative;width:1080px;height:1080px;background:linear-gradient(160deg,#FFFFFF 0%,#FFF4EC 55%,#FFDAC1 100%);padding:120px 110px;display:flex;flex-direction:column}
.top{position:absolute;left:0;right:0;top:0;height:18px;background:repeating-linear-gradient(135deg,#C23A26 0 30px,#fff 30px 46px,#FF883A 46px 76px,#fff 76px 92px)}
.bot{position:absolute;left:0;right:0;bottom:0;height:18px;background:inherit}
.chip{align-self:flex-start;background:#A34506;color:#fff;font-size:40px;font-weight:800;padding:14px 30px;border-radius:999px}
.t{margin-top:64px;font-size:96px;font-weight:900;line-height:1.18;letter-spacing:-.03em;color:#333;white-space:nowrap}
.t b{display:block;color:#C23A26}
.s{margin-top:36px;font-size:44px;font-weight:600;color:#5C5C5C;white-space:nowrap}
.brand{position:absolute;left:110px;bottom:96px;font-size:36px;font-weight:800;color:#A34506}
.char{position:absolute;right:96px;bottom:70px;width:240px;height:216px}"""
FIT = """()=>{const els=[...document.querySelectorAll('.t,.s')];const max=860;
for(const e of els){let f=parseFloat(getComputedStyle(e).fontSize);while(e.scrollWidth>max&&f>40){f-=2;e.style.fontSize=f+'px'}}
return els.every(e=>e.scrollWidth<=max)}"""


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
        page = b.new_page(viewport={"width": 1080, "height": 1080})
        for f in sorted((CAFE / "posts").glob("*.md")):
            m = meta(f.read_text(encoding="utf-8"))
            if "thumb" not in m:
                continue
            l1, l2 = (m["thumb"] + [""])[:2]
            doc = f"""<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="c">
<span class="top"></span><span class="chip">{html.escape(m['menu'])}</span>
<p class="t">{html.escape(l1)}<b>{html.escape(l2)}</b></p><p class="s">{html.escape(m.get('sub',''))}</p>
<p class="brand">우체국보험 길잡이 카페</p>{CHAR}<span class="top" style="top:auto;bottom:0"></span></div></body></html>"""
            page.set_content(doc)
            page.wait_for_timeout(250)
            if not page.evaluate(FIT):
                raise SystemExit(f"글자가 안전 영역을 넘음: {f.name}")
            page.screenshot(path=str(OUT / f"{m['slug']}.png"))
            print(m["slug"])
        b.close()


if __name__ == "__main__":
    main()
