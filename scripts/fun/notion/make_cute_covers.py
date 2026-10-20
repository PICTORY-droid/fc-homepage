"""노션 커버 — 깨끗·미니멀·귀여움. 파스텔 한 가지 배경 + 얼굴 달린 단순 도형 일러스트(SVG)를 크롬으로 그려 JPG 로 저장합니다.
허브 커버·자료실 행 배너 모두 1800×600 (노션은 데스크톱에서 6:1, 모바일에서 약 2.1:1 로 가운데만 잘라 보여 주므로, 내용은 정가운데 작은 영역에 넉넉한 여백으로 둡니다)
저장: public/notion/cover-<id>.jpg  /  public/notion/banner/<종류>-<번호>.jpg
글자 규칙: 노션 본문 규칙대로 '우체국'·'보험'·'연락처' 단어를 쓰지 않습니다(테마 이름의 '우체국'은 지웁니다).
사용: python3 make_cute_covers.py [hubs|rows|all]"""
import json
import os
import sys

from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
OUT = os.path.join(ROOT, "public", "notion")
INK = "#4A3B35"
SUB = "#8F7F75"
FONT = "'Noto Sans CJK KR','Noto Sans CJK JP',sans-serif"


# ---------- 색 도우미 ----------
def rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def hexs(c):
    return "#%02X%02X%02X" % tuple(max(0, min(255, int(v))) for v in c)


def mix(a, b, t):
    ra, rb = rgb(a), rgb(b)
    return hexs([ra[i] * (1 - t) + rb[i] * t for i in range(3)])


def tint(h, t):
    return mix(h, "#FFFFFF", t)


# ---------- 부품 ----------
def face(x=0, y=0, s=1.0, blush="#FF9FAE"):
    return (f'<g transform="translate({x},{y}) scale({s})"><circle cx="-20" cy="0" r="6" fill="{INK}"/><circle cx="20" cy="0" r="6" fill="{INK}"/>'
            f'<ellipse cx="-34" cy="12" rx="9" ry="6" fill="{blush}" opacity=".75"/><ellipse cx="34" cy="12" rx="9" ry="6" fill="{blush}" opacity=".75"/>'
            f'<path d="M-7 8 Q0 17 7 8" fill="none" stroke="{INK}" stroke-width="4.5" stroke-linecap="round"/></g>')


def sparkle(x, y, r, fill):
    return f'<path d="M{x} {y-r} Q{x} {y} {x+r} {y} Q{x} {y} {x} {y+r} Q{x} {y} {x-r} {y} Q{x} {y} {x} {y-r}Z" fill="{fill}"/>'


def heart(x, y, s, fill):
    return f'<path transform="translate({x},{y}) scale({s})" d="M0 22 C-34 -4 -20 -34 0 -14 C20 -34 34 -4 0 22Z" fill="{fill}"/>'


def rr(x, y, w, h, r, fill, extra=""):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" {extra}/>'


def ell(cx, cy, rx, ry, fill, extra=""):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}" {extra}/>'


def shadow(w=150, y=96):
    return ell(0, y, w, 12, "#000", 'opacity=".07"')


# ---------- 일러스트(중심 0,0, 대략 ±100) ----------
def notebook(P):
    g = shadow(80)
    g += rr(-72, -92, 144, 184, 22, P["main"])
    g += rr(-58, -80, 122, 160, 14, "#FFFFFF")
    for k, y in enumerate((-58, -22, 14, 50)):
        g += f'<circle cx="-72" cy="{y}" r="9" fill="{P["dark"]}"/><circle cx="-72" cy="{y}" r="4" fill="#fff"/>'
    g += rr(-34, 52, 78, 7, 4, P["soft"]) + rr(-34, 68, 52, 7, 4, P["soft"])
    g += face(4, -20, 0.95)
    g += f'<path d="M40 -92 H64 V-52 L52 -62 L40 -52Z" fill="{P["acc"]}"/>'
    return g


def piggy(P):
    g = shadow(95)
    g += rr(-48, 52, 26, 40, 12, P["dark"]) + rr(22, 52, 26, 40, 12, P["dark"])
    g += ell(0, 6, 88, 66, P["main"])
    g += f'<path d="M-50 -48 L-34 -84 L-8 -56Z" fill="{P["dark"]}" stroke="{P["dark"]}" stroke-width="8" stroke-linejoin="round"/>'
    g += ell(84, 14, 20, 17, P["acc"]) + f'<circle cx="80" cy="12" r="3.5" fill="{INK}"/><circle cx="92" cy="12" r="3.5" fill="{INK}"/>'
    g += rr(-28, -62, 48, 10, 5, P["dark"])
    g += f'<path d="M-86 4 q-26 -12 -12 -30" fill="none" stroke="{P["dark"]}" stroke-width="9" stroke-linecap="round"/>'
    g += f'<circle cx="-8" cy="-96" r="24" fill="#FFD66B"/><circle cx="-8" cy="-96" r="15" fill="none" stroke="#F4B73A" stroke-width="5"/>'
    g += face(34, -6, 0.85)
    return g


def envelope(P):
    g = shadow(100)
    g += rr(-96, -62, 192, 128, 18, "#FFFFFF")
    g += f'<path d="M-96 -46 Q-96 -62 -80 -62 H80 Q96 -62 96 -46 L0 18Z" fill="{P["soft"]}"/>'
    g += heart(0, 14, 1.0, P["acc"])
    g += face(0, 46, 0.7)
    g += f'<path d="M-96 66 L-30 10 M96 66 L30 10" stroke="{P["soft"]}" stroke-width="6" stroke-linecap="round"/>'
    return g


def coins(P):
    g = shadow(90)
    g += f'<circle cx="38" cy="-20" r="66" fill="#FFC857"/><circle cx="38" cy="-20" r="50" fill="none" stroke="#F2A93A" stroke-width="6"/>'
    g += f'<circle cx="-30" cy="16" r="76" fill="#FFD66B"/><circle cx="-30" cy="16" r="58" fill="none" stroke="#F4B73A" stroke-width="7"/>'
    g += f'<text x="-30" y="-12" text-anchor="middle" font-family="{FONT}" font-weight="900" font-size="38" fill="#F4A71E">₩</text>'
    g += face(-30, 30, 0.9)
    g += sparkle(80, -86, 15, P["acc"])
    return g


def quote(P):
    g = shadow(100)
    g += rr(-84, -92, 138, 184, 16, "#FFFFFF")
    g += rr(-84, -92, 138, 40, 16, P["main"]) + rr(-84, -66, 138, 14, 0, P["main"])
    for k, y in enumerate((-34, -8, 18)):
        g += rr(-64, y, 98, 8, 4, P["soft"])
    g += rr(-64, 50, 60, 22, 8, P["acc"], 'opacity=".9"')
    g += rr(18, -6, 80, 100, 14, P["dark"]) + rr(28, 4, 60, 26, 7, "#FFFFFF")
    for r in range(3):
        for c in range(3):
            g += f'<circle cx="{38 + c * 20}" cy="{46 + r * 16}" r="5" fill="{P["soft"]}"/>'
    g += face(-14, -66, 0.0)
    g += face(58, 17, 0.4)
    return g


def board(P):
    g = shadow(100)
    g += f'<path d="M-40 52 L-56 92 M40 52 L56 92" stroke="{P["dark"]}" stroke-width="9" stroke-linecap="round"/>'
    g += rr(-100, -78, 200, 134, 18, "#FFFFFF", f'stroke="{P["main"]}" stroke-width="9"')
    for k, (h, c) in enumerate(((34, P["soft"]), (58, P["main"]), (84, P["dark"]))):
        g += rr(14 + k * 26, 38 - h, 18, h, 6, c)
    g += face(-40, -22, 0.85)
    g += rr(-82, 24, 66, 8, 4, P["soft"])
    return g


def house(P):
    g = shadow(100)
    g += rr(-72, -10, 144, 102, 12, "#FFFFFF")
    g += f'<path d="M-92 -8 L0 -88 L92 -8Z" fill="{P["main"]}" stroke="{P["main"]}" stroke-width="12" stroke-linejoin="round"/>'
    g += rr(-14, 40, 38, 52, 12, P["dark"]) + f'<circle cx="15" cy="68" r="3.5" fill="#fff"/>'
    g += rr(-58, 20, 34, 30, 8, P["soft"]) + rr(40, -74, 22, 34, 5, P["dark"])
    g += face(30, 10, 0.55)
    g += heart(-82, -52, 0.5, P["acc"])
    return g


def cake(P):
    g = shadow(104)
    g += rr(-96, 70, 192, 18, 9, P["dark"])
    g += rr(-84, 14, 168, 62, 18, P["main"])
    g += f'<path d="M-84 30 q14 18 28 0 q14 18 28 0 q14 18 28 0 q14 18 28 0 q14 18 28 0 q14 18 28 0" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>'
    g += rr(-54, -34, 108, 54, 16, P["soft"])
    g += rr(-6, -78, 12, 44, 6, P["acc"]) + f'<path d="M0 -102 q-12 14 0 24 q12 -10 0 -24Z" fill="#FFC857"/>'
    g += face(0, -6, 0.8)
    g += sparkle(-84, -50, 13, P["acc"]) + sparkle(86, -30, 10, "#FFC857")
    return g


def wedding(P):
    g = shadow(96)
    g += f'<circle cx="-44" cy="50" r="42" fill="none" stroke="#F4B73A" stroke-width="14"/><circle cx="44" cy="50" r="42" fill="none" stroke="{P["acc"]}" stroke-width="14"/>'
    g += f'<path d="M-44 6 l-12 -14 h24Z" fill="#9AD8FF"/>'
    g += heart(0, -34, 3.0, P["main"])
    g += face(0, -44, 1.0, "#FFFFFF")
    g += sparkle(-92, -50, 13, "#FFC857") + sparkle(94, -56, 10, P["acc"])
    return g


def newscard(P):
    g = shadow(96)
    g += f'<g transform="rotate(-8)">' + rr(-76, -86, 152, 172, 24, "#FFFFFF") + rr(-76, -86, 152, 58, 24, P["main"]) + rr(-76, -50, 152, 22, 0, P["main"]) + "</g>"
    g += f'<g transform="rotate(7 40 10)">' + rr(-10, -70, 130, 150, 22, P["soft"], 'opacity=".95"') + "</g>"
    g += face(-4, 12, 1.0)
    g += rr(-48, 56, 70, 8, 4, P["soft"]) + sparkle(78, -76, 16, P["acc"])
    for k in range(3):
        g += f'<circle cx="{-18 + k * 18}" cy="86" r="{5 if k == 0 else 4}" fill="{P["dark"] if k == 0 else P["soft"]}"/>'
    return g


def paper(P):
    g = shadow(96)
    g += f'<path d="M-66 -90 H30 L66 -54 V82 Q66 92 56 92 H-56 Q-66 92 -66 82Z" fill="#FFFFFF"/><path d="M30 -90 V-60 Q30 -54 36 -54 H66Z" fill="{P["soft"]}"/>'
    for k, y in enumerate((20, 44, 66)):
        g += rr(-46, y, 78 - k * 12, 8, 4, P["soft"])
    g += face(-12, -18, 0.8)
    g += f'<g transform="rotate(32 70 20)">' + rr(58, -60, 22, 100, 8, "#FFC857") + f'<path d="M58 40 H80 L69 66Z" fill="#F3D2B0"/><path d="M65 60 H73 L69 66Z" fill="{INK}"/>' + rr(58, -70, 22, 18, 8, P["acc"]) + "</g>"
    return g


def bulb(P):
    g = shadow(70)
    g += f'<path d="M0 -92 a58 58 0 0 1 34 104 v16 h-68 v-16 a58 58 0 0 1 34 -104Z" fill="#FFE08A"/>'
    g += rr(-30, 36, 60, 12, 6, "#FFFFFF") + rr(-26, 54, 52, 12, 6, P["dark"]) + rr(-14, 70, 28, 12, 6, P["main"])
    g += face(0, -22, 0.9)
    for a in (-50, 0, 50):
        import math
        x1, y1 = 82 * math.sin(math.radians(a)), -30 - 82 * math.cos(math.radians(a))
        g += f'<path d="M{x1 * 1.12:.0f} {(y1 - 8):.0f} L{x1 * 1.34:.0f} {(y1 - 20):.0f}" stroke="{P["acc"]}" stroke-width="7" stroke-linecap="round"/>'
    return g


def bubble(P):
    g = shadow(96)
    g += f'<path d="M-90 -50 Q-90 -86 -54 -86 H54 Q90 -86 90 -50 V18 Q90 54 54 54 H-6 L-44 90 V54 H-54 Q-90 54 -90 18Z" fill="#FFFFFF" stroke="{P["main"]}" stroke-width="9" stroke-linejoin="round"/>'
    g += face(0, -18, 1.0)
    g += heart(70, 66, 0.9, P["acc"]) + sparkle(-88, -92, 12, "#FFC857")
    return g


def sun(P, x, y, r=34):
    import math
    g = f'<circle cx="{x}" cy="{y}" r="{r}" fill="#FFC857"/>'
    for k in range(8):
        a = math.radians(k * 45)
        g += f'<path d="M{x + math.cos(a) * (r + 10):.0f} {y + math.sin(a) * (r + 10):.0f} L{x + math.cos(a) * (r + 24):.0f} {y + math.sin(a) * (r + 24):.0f}" stroke="#FFC857" stroke-width="7" stroke-linecap="round"/>'
    return g


def flower(x, y, r, fill):
    import math
    g = "".join(f'<circle cx="{x + math.cos(math.radians(k * 72)) * r:.1f}" cy="{y + math.sin(math.radians(k * 72)) * r:.1f}" r="{r * 0.82:.1f}" fill="{fill}"/>' for k in range(5))
    return g + f'<circle cx="{x}" cy="{y}" r="{r * 0.7:.1f}" fill="#FFE08A"/>'


def leaf(x, y, s, fill, rot=0):
    return f'<g transform="translate({x},{y}) rotate({rot}) scale({s})"><path d="M0 -30 C26 -14 26 16 0 32 C-26 16 -26 -14 0 -30Z" fill="{fill}"/><path d="M0 -22 V34" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/></g>'


def snow(x, y, r, col="#FFFFFF"):
    import math
    g = ""
    for k in range(3):
        a = math.radians(k * 60)
        g += f'<path d="M{x - math.cos(a) * r:.0f} {y - math.sin(a) * r:.0f} L{x + math.cos(a) * r:.0f} {y + math.sin(a) * r:.0f}" stroke="{col}" stroke-width="6" stroke-linecap="round"/>'
    return g


def cloud(x, y, s, fill="#FFFFFF", op=0.9):
    return f'<g transform="translate({x},{y}) scale({s})" opacity="{op}"><circle cx="-26" cy="4" r="22" fill="{fill}"/><circle cx="4" cy="-8" r="28" fill="{fill}"/><circle cx="34" cy="6" r="20" fill="{fill}"/><rect x="-46" y="4" width="100" height="22" rx="11" fill="{fill}"/></g>'


OBJ = dict(notebook=notebook, piggy=piggy, envelope=envelope, coins=coins, quote=quote, board=board, house=house, cake=cake,
           wedding=wedding, newscard=newscard, paper=paper, bulb=bulb, bubble=bubble)

# 종류 → 대표 일러스트·이름
KIND = {
    "ledger": ("notebook", "가계부"), "saving": ("piggy", "저축 플래너"), "gift": ("envelope", "경조사비 장부"),
    "allowance": ("coins", "용돈기입장"), "quote": ("quote", "견적서"),
    "talkpro": ("board", "발표 PPT"), "familypro": ("house", "가족 소개 PPT"), "birthdaypro": ("cake", "돌잔치 PPT"),
    "weddingpro": ("wedding", "결혼식 PPT"), "newspro": ("newscard", "카드뉴스"),
}


def pal(main, soft, dark, acc=None):
    return dict(main=main, soft=soft, dark=dark, acc=acc or mix(main, "#FF6F91", 0.35))


def place(P, name, x, y, s=1.0, rot=0):
    return f'<g transform="translate({x},{y}) rotate({rot}) scale({s})">{OBJ[name](P)}</g>'


def page(w, h, bg, body):
    return (f'<!doctype html><meta charset="utf-8"><style>*{{margin:0}}body{{width:{w}px;height:{h}px;overflow:hidden;background:{bg};font-family:{FONT}}}</style>'
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>')


def text_block(x, y, tag, h1, em, sub, accent, w=1500, tag_fill="#FFFFFF", tag_ink=None, size=68):
    tag_ink = tag_ink or accent
    tw = len(tag) * 27 + 56
    s = f'<rect x="{x}" y="{y}" width="{tw}" height="52" rx="26" fill="{tag_fill}"/><text x="{x + tw / 2}" y="{y + 36}" text-anchor="middle" font-size="26" font-weight="800" fill="{tag_ink}">{tag}</text>'
    s += f'<text x="{x}" y="{y + 52 + size + 8}" font-size="{size}" font-weight="900" fill="{INK}" letter-spacing="-2">{h1}</text>'
    s += f'<text x="{x}" y="{y + 52 + size * 2 + 22}" font-size="{size}" font-weight="900" fill="{accent}" letter-spacing="-2">{em}</text>'
    s += f'<text x="{x}" y="{y + 52 + size * 2 + 78}" font-size="27" font-weight="600" fill="{SUB}" letter-spacing="-.6">{sub}</text>'
    return s


CW, CH = 1800, 600


def wide(bg, c1, c2, scene, vby, vbh, scale, ill_x):
    """1500 폭으로 짠 장면을 축소해 1800×600 정가운데에 놓습니다.
    노션은 데스크톱에서 커버를 6:1 띠(세로 가운데 절반만)로, 모바일에서는 약 2.1:1(가로 가운데 70%만)로 잘라 보여 주므로
    내용은 가로 840px·세로 210px 안쪽 가운데에만 둡니다."""
    cy = CH / 2
    mid = vby + vbh / 2
    y = cy - (mid - vby) * scale
    x = (CW - 1500 * scale) / 2
    ix = x + ill_x * scale
    back = (f'<circle cx="{ix:.0f}" cy="{cy:.0f}" r="150" fill="{c1}"/><circle cx="1720" cy="520" r="130" fill="{c2}" opacity=".85"/>'
            f'<circle cx="90" cy="90" r="110" fill="{c2}" opacity=".6"/>' + sparkle(330, 140, 11, "#fff") + sparkle(1480, 130, 9, "#fff") + sparkle(500, 470, 8, "#fff"))
    inner = f'<svg x="{x:.1f}" y="{y:.1f}" width="{1500 * scale:.1f}" height="{vbh * scale:.1f}" viewBox="0 {vby} 1500 {vbh}" overflow="visible">{scene}</svg>'
    return page(CW, CH, bg, back + inner)


# ---------- 허브 커버 ----------
HUBS = [
    dict(id="home", bg="#FFF3E6", c1="#FFE2C4", c2="#FFD3A8", acc="#FF8A3D", tag="무료 다운로드 · 회원가입 없이", h1="무료 PPT·엑셀·워드 양식", em="900종+", sub="계절 감성 50가지 테마 · 받아서 바로 고쳐 쓰기",
         objs=[("notebook", pal("#FF9F5A", "#FFE1C7", "#D9682B")), ("cake", pal("#FF9AB5", "#FFE0E9", "#D9577E")), ("board", pal("#7FC8F8", "#D9F0FF", "#3E90C9"))]),
    dict(id="ppt", bg="#FFF0F5", c1="#FFD9E6", c2="#FFC6DA", acc="#F0568A", tag="PPT 템플릿", h1="사진만 넣으면 끝나는", em="PPT 템플릿", sub="발표 · 가족 소개 · 돌잔치 · 결혼식 · 카드뉴스",
         objs=[("house", pal("#FF9AB5", "#FFE0E9", "#D9577E")), ("cake", pal("#FFB86B", "#FFE9CC", "#D98A2B")), ("wedding", pal("#F0568A", "#FFD9E6", "#B52E63"))]),
    dict(id="excel", bg="#EEF9F3", c1="#D5F1E2", c2="#C2EAD4", acc="#2FAF7A", tag="엑셀 양식", h1="입력하면 자동 계산되는", em="엑셀 양식", sub="가계부 · 용돈기입장 · 경조사비 장부 · 견적서 · 저축 플래너",
         objs=[("piggy", pal("#FF9AB5", "#FFE0E9", "#D9577E")), ("notebook", pal("#4FC49A", "#D5F1E2", "#2A8F6C")), ("coins", pal("#FFC857", "#FFEFC2", "#E0A21F"))]),
    dict(id="word", bg="#FFF9E3", c1="#FFEFB3", c2="#FFE48A", acc="#F2A91B", tag="워드 · 인쇄물", h1="바로 출력해 쓰는", em="워드·인쇄물", sub="이력서 · 자기소개서 · 계절 편지지 · 명함",
         objs=[("paper", pal("#FFC857", "#FFF0C2", "#E0A21F")), ("envelope", pal("#8FD3F4", "#DDF2FF", "#4A9ACB")), ("bulb", pal("#FFB86B", "#FFE9CC", "#D98A2B"))]),
    dict(id="season", bg="#EAF6FF", c1="#CFEBFF", c2="#BCE0FA", acc="#3E9BE0", tag="계절별 모음", h1="봄 · 여름 · 가을 · 겨울", em="계절별 모음", sub="지금 계절에 어울리는 분위기로 골라 보세요",
         objs=[("newscard", pal("#7FC8F8", "#D9F0FF", "#3E90C9")), ("house", pal("#FFB86B", "#FFE9CC", "#D98A2B")), ("cake", pal("#8FD8B0", "#DDF5E7", "#3FA776"))]),
    dict(id="guide", bg="#FFFBE0", c1="#FFF1A8", c2="#FFE67A", acc="#EBA10E", tag="사용법 가이드", h1="처음이어도 쉬운", em="사용법 가이드", sub="사진 넣기 · 색과 글꼴 한 번에 바꾸기 · 엑셀 수식 고치기",
         objs=[("bulb", pal("#FFC857", "#FFF0C2", "#E0A21F")), ("board", pal("#7FC8F8", "#D9F0FF", "#3E90C9")), ("notebook", pal("#FF9AB5", "#FFE0E9", "#D9577E"))]),
    dict(id="request", bg="#FFF0EC", c1="#FFD8CE", c2="#FFC5B6", acc="#F26B4F", tag="새 양식 · 요청", h1="필요한 양식, 말씀해 주세요", em="이달의 양식", sub="만들어 줬으면 하는 템플릿을 남겨 주세요",
         objs=[("bubble", pal("#FF8E78", "#FFE0D8", "#D4553D")), ("newscard", pal("#FFB86B", "#FFE9CC", "#D98A2B")), ("paper", pal("#8FD3F4", "#DDF2FF", "#4A9ACB"))]),
]


def hub_html(c):
    o = c["objs"]
    body = text_block(96, 112, c["tag"], c["h1"], c["em"], c["sub"], c["acc"], size=62 if len(c["h1"]) > 12 else 68)
    body += place(o[0][1], o[0][0], 975, 352, 0.82, -5)
    body += place(o[2][1], o[2][0], 1395, 348, 0.78, 6)
    body += place(o[1][1], o[1][0], 1185, 300, 1.22, 0)
    body += sparkle(930, 150, 16, c["acc"]) + heart(1420, 170, 0.7, c["acc"]) + sparkle(1260, 500, 11, c["acc"])
    return wide(c["bg"], c["c1"], c["c2"], body, 70, 450, 0.62, 1185)


# ---------- 자료실 행 배너 ----------
def row_html(kind, e):
    name_obj, kname = KIND[kind]
    P = pal(e["main"], e["soft"], e["dark"])
    bg = tint(e["soft"], 0.55)
    theme = e["name"].replace("우체국", "").replace("  ", " ").strip()
    flavor = e["flavor"].replace("우체국", "").strip()
    season = e["season"]
    body = ""
    # 계절 장식(오른쪽)
    if season == "봄":
        body += flower(940, 110, 15, tint(e["main"], 0.25)) + flower(1400, 120, 12, "#fff") + flower(1370, 410, 11, tint(e["main"], 0.3))
    elif season == "여름":
        body += sun(1390, 100, 30) + cloud(930, 96, 0.8)
    elif season == "가을":
        body += leaf(950, 110, 0.9, tint(e["main"], 0.1), -25) + leaf(1400, 130, 0.8, "#FFC857", 30) + leaf(1380, 420, 0.7, tint(e["main"], 0.3), 10)
    else:
        body += snow(950, 110, 22) + snow(1400, 110, 17) + snow(1385, 410, 14) + cloud(1180, 70, 0.7, "#fff", 0.8)
    body += place(P, name_obj, 1180, 262, 1.5, -3)
    # 글
    ty = 150
    body += f'<rect x="96" y="{ty}" width="{len(season) * 26 + len(kname) * 27 + 60}" height="50" rx="25" fill="#fff"/><text x="{96 + (len(season) * 26 + len(kname) * 27 + 60) / 2}" y="{ty + 34}" text-anchor="middle" font-size="25" font-weight="800" fill="{e["dark"]}">{season} · {kname}</text>'
    fs = 78 if len(theme) <= 6 else 66 if len(theme) <= 9 else 56
    body += f'<text x="96" y="{ty + 50 + fs + 14}" font-size="{fs}" font-weight="900" fill="{INK}" letter-spacing="-2">{theme}</text>'
    body += f'<text x="96" y="{ty + 50 + fs + 70}" font-size="28" font-weight="600" fill="{SUB}">{flavor}</text>'
    return wide(bg, e["soft"], tint(e["main"], 0.55), body, 60, 400, 0.58, 1180)


def render(items):
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH") or None, args=["--no-sandbox"])
        pg = b.new_page()
        for path, html, w, h in items:
            pg.set_viewport_size({"width": w, "height": h})
            pg.set_content(html)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            pg.screenshot(path=path, type="jpeg", quality=88)
        b.close()


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"
    jobs = []
    if mode in ("hubs", "all"):
        jobs += [(os.path.join(OUT, f"cover-{c['id']}.jpg"), hub_html(c), CW, CH) for c in HUBS]
    if mode in ("rows", "all"):
        d = json.load(open(os.path.join(ROOT, "src", "config", "pack.data.json")))
        for kind in KIND:
            ext = "pptx" if kind.endswith("pro") else "xlsx"
            for e in d[f"{ext}-{kind}"]:
                jobs.append((os.path.join(OUT, "banner", f"{kind}-{e['no']:02d}.jpg"), row_html(kind, e), CW, CH))
    if mode == "sample":
        d = json.load(open(os.path.join(ROOT, "src", "config", "pack.data.json")))
        jobs += [(f"/tmp/cv/hub-{c['id']}.jpg", hub_html(c), CW, CH) for c in HUBS]
        for kind, n in (("ledger", 1), ("saving", 15), ("gift", 30), ("allowance", 47), ("quote", 22), ("talkpro", 3), ("familypro", 9), ("birthdaypro", 20), ("weddingpro", 33), ("newspro", 50)):
            ext = "pptx" if kind.endswith("pro") else "xlsx"
            e = d[f"{ext}-{kind}"][n - 1]
            jobs.append((f"/tmp/cv/row-{kind}-{n}.jpg", row_html(kind, e), CW, CH))
    render(jobs)
    print("완료", len(jobs), "장")
