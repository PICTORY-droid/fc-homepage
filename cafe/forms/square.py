"""무료 양식 소개 정사각형 손그림 이미지 — python3 cafe/forms/square.py [번호 ...]

양식마다 1장(1080×1080): 대표 문구 두 줄 + 그 양식의 실제 칸 이름·예시로 그린 손그림 미니 시트(편지지는 손그림 편지지) + 주제 그림.
그림 틀은 카페 손그림 틀(cafe/scripts/hand.html 의 formCard)을 그대로 씁니다. 대표 문구는 무료 양식 노트 원고(thumb)에서 읽습니다.
결과: cafe/forms/out/정사각형/NN_제목.png
"""
import datetime as dt
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
CAFE = HERE.parent
sys.path.insert(0, str(HERE))

from lib import theme as T  # noqa: E402
from specs import ALL  # noqa: E402

OUT = HERE / "out" / "정사각형"
TEMPLATE = (CAFE / "scripts" / "hand.html").as_uri()

# 양식마다 주제 그림(hand.html ICONS 이름) — 하트가 들어간 그림은 쓰지 않습니다
ICON = {
    1: "shield", 2: "receipt", 3: "stamp", 4: "calendar", 5: "checklist", 6: "umbrella", 7: "folder", 8: "hospital",
    9: "key", 10: "clipboard", 11: "pill", 12: "form", 13: "clock", 14: "tooth", 15: "stroller", 16: "hourglass",
    17: "piggy", 18: "magnifier", 19: "scissors", 20: "jar", 21: "bank", 22: "envelope", 23: "idcard", 24: "receipt",
    25: "piggy", 26: "bell", 27: "umbrella", 28: "people", 29: "car", 30: "laptop", 31: "bag", 32: "chat",
    33: "calendar", 34: "telephone", 35: "sprout", 36: "checklist", 37: "pin", 38: "plane", 39: "form", 40: "clipboard",
    41: "key", 42: "sprout", 43: "balloon", 44: "magnifier", 45: "clock", 46: "people", 47: "checklist", 48: "calendar",
    49: "hourglass", 50: "pin", 51: "chat", 52: "clock", 53: "laptop", 54: "receipt",
    55: "envelope", 56: "stamp", 57: "envelope", 58: "envelope", 59: "balloon", 60: "sprout",
}
LETTER_STYLE = {56: "airmail"}  # 안부 편지지는 항공우편 줄무늬


def fname(s):
    return f"{s['id']:02d}_{s['title'].replace(' ', '_').replace('·', '_')}"


def thumb_of(n):
    """원고 머리말의 thumb 두 줄."""
    post = next((CAFE / "posts").glob(f"*-form-{n:02d}.md"))
    m = re.search(r"^thumb: \[(.*)\]$", post.read_text(encoding="utf-8"), re.M)
    return [x.strip() for x in m.group(1).split(",")]


def fmt(v):
    if isinstance(v, bool):
        return "✔" if v else ""
    if isinstance(v, (int, float)):
        return f"{v:,.0f}" if abs(v) >= 1000 else (f"{v:g}")
    if isinstance(v, dt.datetime):
        return f"{v.month}/{v.day} {v:%H:%M}" if (v.hour or v.minute) else f"{v.month}/{v.day}"
    if isinstance(v, dt.date):
        return f"{v.month}/{v.day}"
    if isinstance(v, dt.time):
        return f"{v:%H:%M}"
    s = str(v)
    return s if len(s) <= 7 else s[:6] + "…"


def cell_text(c):
    v = c.value
    if v in (None, ""):
        return ""
    if isinstance(v, (int, float)) and not isinstance(v, bool) and "%" in (c.number_format or ""):
        return f"{v:.0%}"
    if isinstance(v, (int, float)) and not isinstance(v, bool) and isinstance(c.value, float) and "h" in (c.number_format or "").lower():
        return fmt(v)
    return fmt(v)


def mini(spec, nrows=3):
    """완성된 엑셀(계산값 포함)의 첫 표 시트에서 짧은 칸 3개와 예시 3줄 — 첫 칸 + 금액·숫자 칸 + 내용이 다른 글자 칸."""
    from openpyxl import load_workbook
    sh = next(s for s in spec["sheets"] if s["type"] == "table")
    ws = load_workbook(HERE / "out" / "양식" / f"{fname(spec)}.xlsx", data_only=True)[sh["name"]]
    heads = [c["h"] for c in sh["cols"]]
    hr = next(r for r in range(1, 40) if [ws.cell(r, k).value for k in range(1, 60)].count(heads[0]) and heads[1] in [ws.cell(r, k).value for k in range(1, 60)])
    where = {ws.cell(hr, k).value: k for k in range(1, 60) if ws.cell(hr, k).value}
    body = [r for r in range(hr + 1, hr + 40) if any(ws.cell(r, where[h]).value not in (None, "") for h in heads if h in where)][:nrows]
    col = {h: [cell_text(ws.cell(r, where[h])) for r in body] for h in heads if h in where}
    ok = [h for h in heads if h in col and len(h) <= 8 and sum(bool(v) for v in col[h]) >= max(1, len(body) - 1)]
    num = lambda h: all(re.fullmatch(r"[-\d,.%]+", v or "0") for v in col[h])  # noqa: E731
    pick = ok[:1]
    pick += [h for h in ok if h not in pick and num(h)][:1]
    pick += [h for h in ok if h not in pick and not num(h) and len(set(col[h])) > 1][: 3 - len(pick)]
    pick += [h for h in ok if h not in pick][: 3 - len(pick)]
    pick.sort(key=heads.index)
    return sh["name"], pick, [[col[h][k] for h in pick] for k in range(len(body))]


def data(spec):
    n = spec["id"]
    ac = {k: "#" + v for k, v in T.ACCENTS[spec["cat"]].items()}
    d = {"kind": "form", "n": n, "thumb": thumb_of(n), "title": spec["title"], "icon": ICON[n], "ac": ac}
    if spec["cat"] == "편지":
        ex = next(s for s in spec["sheets"] if s.get("body"))
        d["letter"] = {"style": LETTER_STYLE.get(n, ex["style"]), "to": ex["to"], "body": [b for b in ex["body"] if b and len(b) <= 20], "from": ex["from"]}
    else:
        d["sheet"], d["cols"], d["rows"] = mini(spec)
    return d


def main(ids):
    OUT.mkdir(parents=True, exist_ok=True)
    specs = [s for s in ALL if not ids or s["id"] in ids]
    with sync_playwright() as p:
        b = p.chromium.launch()
        for spec in specs:
            d = data(spec)
            page = b.new_page(viewport={"width": 1080, "height": 1080})
            page.goto(TEMPLATE)
            page.evaluate("document.fonts.ready")
            page.evaluate("d => render(d)", d)
            page.wait_for_timeout(250)
            over = page.evaluate("()=>[...document.querySelectorAll('.txt')].filter(e=>{const r=e.getBoundingClientRect();return r.right>1052||r.left<28||r.bottom>1000}).map(e=>e.textContent)")
            if over:
                raise SystemExit(f"글자가 틀 밖으로 나감: {spec['id']} {over}")
            page.screenshot(path=str(OUT / f"{fname(spec)}.png"))
            page.close()
            print(fname(spec), d.get("cols"), flush=True)
        b.close()


if __name__ == "__main__":
    main([int(x) for x in sys.argv[1:]])
