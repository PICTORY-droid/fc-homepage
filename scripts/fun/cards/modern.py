"""명함 디자인 v2 — 선명한 원색 + 깨끗한 흰 바탕 + 큰 여백의 미니멀 레이아웃.
- 색: 탁한 혼합색 없이 맑은 원색 50가지(PAL). 글자는 항상 먹색/흰색, 원색은 면·선·점에만 씁니다.
- 레이아웃: 앞면 12종 · 뒷면 10종 × 바탕 5종(흰색·먹색·원색·연회색·연한 원색)."""
from layouts import contrast, mix, wrap
from icons import arc_pts
from scene import PT, ellipse, line, poly, rect, text

NF, NB, NFLAV = 12, 10, 5
L = 70  # 좌우 여백
INK, WHITE, DARK_BG, GRAY_BG = "#12151C", "#FFFFFF", "#0E1116", "#F3F4F6"

PAL = [  # (이름, 대표색) — 한국에서 사랑받는 맑은 원색 위주
    ("코발트 블루", "#0057FF"), ("로열 블루", "#1F5BFF"), ("스카이 블루", "#2E9BFF"), ("아이스 블루", "#4CC3FF"), ("시안", "#00B8E6"),
    ("터콰이즈", "#00C2C0"), ("민트", "#00C896"), ("에메랄드", "#00B86B"), ("프레시 그린", "#12B76A"), ("애플 그린", "#4CD964"),
    ("라임", "#A6E22E"), ("레몬", "#FFE600"), ("선샤인", "#FFC800"), ("골드", "#FFB300"), ("앰버", "#FF9F0A"),
    ("오렌지", "#FF7A00"), ("탠저린", "#FF6A13"), ("코랄", "#FF5A4F"), ("레드", "#F0262F"), ("스칼렛", "#E6193C"),
    ("로즈", "#FF3B6B"), ("핫핑크", "#FF2E93"), ("베이비 핑크", "#FF8FB8"), ("마젠타", "#E5169B"), ("오키드", "#C93CE0"),
    ("바이올렛", "#8A3FFC"), ("퍼플", "#7A2CF5"), ("인디고", "#4A3AFF"), ("블루 바이올렛", "#5B5BFF"), ("네이비", "#0A2F7A"),
    ("미드나잇", "#0B1B4D"), ("딥 블루", "#0A47C7"), ("청록", "#00A6A6"), ("포레스트", "#0F9D58"), ("연두", "#5CD65C"),
    ("살구", "#FF9E6B"), ("복숭아", "#FF8A7A"), ("체리", "#E8284F"), ("와인", "#B5123E"), ("블러쉬", "#FF6F8E"),
    ("라벤더", "#9B7BFF"), ("라일락", "#B66DFF"), ("블루베리", "#3D5AFE"), ("오션", "#0077FF"), ("아쿠아", "#00D0E0"),
    ("네온 민트", "#00E0A4"), ("시트러스", "#FFD000"), ("피치", "#FFA07A"), ("크림슨", "#D90429"), ("블랙", "#111111"),
]
assert len(PAL) == 50 and len({n for n, _ in PAL}) == 50 and len({h for _, h in PAL}) == 50


class Ctx:
    """한 면의 색 묶음. acc=면·선·점에 쓰는 원색, fg=글자, sub=보조 글자, on=원색 위 글자, panel=바탕과 다른 큰 면."""

    def __init__(self, pal_i, flavor, d, side="front"):
        self.d, self.flavor = d, flavor
        a = PAL[pal_i][1]
        self.name = PAL[pal_i][0]
        if flavor == 0:
            self.bg, self.fg, self.sub, self.acc, self.line = WHITE, INK, "#6B7280", a, "#E3E5E9"
        elif flavor == 1:
            pop = a
            while contrast(pop, DARK_BG) < 4.0:
                pop = mix(pop, WHITE, .12)
            self.bg, self.fg, self.sub, self.acc, self.line = DARK_BG, WHITE, "#A3A9B5", pop, "#2A2F38"
        elif flavor == 2:
            self.bg = a
            self.fg = WHITE if contrast(WHITE, a) >= 3.2 else INK
            self.sub, self.acc, self.line = mix(self.fg, a, .22), self.fg, mix(self.fg, a, .6)
        elif flavor == 3:
            self.bg, self.fg, self.sub, self.acc, self.line = GRAY_BG, INK, "#6B7280", a, "#DCDFE4"
        else:
            self.bg, self.fg, self.sub, self.acc, self.line = mix(a, WHITE, .9), INK, mix(INK, a, .38), a, mix(a, WHITE, .72)
        self.on = WHITE if contrast(WHITE, self.acc) >= 3.2 else INK  # 원색 위 글자
        self.panel = mix(a, WHITE, .2) if flavor == 2 else self.acc
        self.onp = WHITE if contrast(WHITE, self.panel) >= 3.2 else INK
        self.deco = mix(self.bg, WHITE, .3) if flavor == 2 else mix(self.bg, WHITE, .1) if flavor == 1 else mix(self.bg, self.acc, .14)
        if contrast(self.sub, self.bg) < 3.2:
            self.sub = mix(self.fg, self.bg, .25)


def T(x, y, w, s, size, color, bold=False, align="l", spacing=0, anchor="t", h=None, op=1):
    return text(x, y, w, h or size * PT * 1.5, s, size, color, bold, align, "sans", spacing, anchor, op)


def hl(x1, x2, y, color, sw=1.0):
    return line(x1, y, x2, y, color, sw)


def vl(x, y1, y2, color, sw=1.0):
    return line(x, y1, x, y2, color, sw)


def tick(x, y, color, n=9):
    return [line(x - n, y, x + n, y, color, 1.0), line(x, y - n, x, y + n, color, 1.0)]


def ticks(c, m=34):
    out = []
    for x, y in ((m, m), (900 - m, m), (m, 500 - m), (900 - m, 500 - m)):
        out += tick(x, y, c.line if c.flavor != 2 else c.sub, 8)
    return out


def frame(c, m=26, color=None):
    return rect(m, m, 900 - 2 * m, 500 - 2 * m, stroke=color or c.line, sw=1.0)


def mono(c):
    return c.d["company"][:1] if c.d["company"] else "A"


def sector(cx, cy, r, a0, a1, fill, op=1):
    return poly([(cx, cy)] + arc_pts(cx, cy, r, r, a0, a1, 24), fill=fill, op=op)


def ring(cx, cy, r, color, sw=1.0):
    return ellipse(cx, cy, r, r, stroke=color, sw=sw)


def hatch(x, y, w, h, color, gap=16, sw=1.0):
    """사선 빗금(상자 안에 갇히도록 가장자리에서 잘라 그림)"""
    out = []
    k = -h
    while k < w:
        x1, y1, x2, y2 = x + k, y + h, x + k + h, y
        if x1 < x:
            y1 -= (x - x1); x1 = x
        if x2 > x + w:
            y2 += (x2 - (x + w)); x2 = x + w
        if y1 > y and y2 < y + h + 1 and x2 > x1:
            out.append(line(x1, y1, x2, y2, color, sw))
        k += gap
    return out


# ───── 연락처 묶음
def name_title(c, x, y, name_w=500, align="l"):
    d = c.d
    return [T(x, y, name_w, d["name"], 13.5, c.fg, True, align, spacing=1.2, h=66), T(x, y + 70, name_w, d["title"], 7, c.sub, False, align, spacing=.6)]


def rows(c, x, y, pitch=34, size=6.5, w=400, labw=92, n=3, lab_color=None):
    d = c.d
    items = [("TEL", d["tel"]), ("MAIL", d["mail"]), ("ADDR", d["addr"])][:n]
    out = []
    for i, (lab, val) in enumerate(items):
        yy = y + i * pitch
        out += [T(x, yy + 3, labw, lab, 4.8, lab_color or c.sub, True, spacing=1.4), T(x + labw, yy, w, val, size, c.fg)]
    return out


def cols(c, x, y, widths, size=6.5, color=None, lab_color=None, sep=None):
    d = c.d
    items = [("TEL", d["tel"]), ("MAIL", d["mail"]), ("ADDR", d["addr"])]
    out, cx = [], x
    for (lab, val), w in zip(items, widths):
        out += [T(cx, y, w, lab, 4.8, lab_color or c.sub, True, spacing=1.4), T(cx, y + 28, w, val, size, color or c.fg)]
        cx += w
        if sep and cx < x + sum(widths) - 1:
            out.append(vl(cx - 22, y, y + 56, sep))
    return out


def co(c, x, y, w=420, color=None, align="l"):
    return T(x, y, w, c.d["company"], 6.5, color or c.sub, True, align, spacing=2.2)


# ───────── 앞면 12종
def f_grid(c):
    return [frame(c), rect(L, 70, 22, 22, c.acc), co(c, L + 40, 72, 420), hl(L, 830, 124, c.line),
            *name_title(c, L, 268), vl(520, 262, 430, c.line), *rows(c, 560, 284, 40, 6.5, 270, 84), *ticks(c, 26)[:0]]


def f_side(c):
    d = c.d
    return [rect(0, 0, 210, 500, c.panel), *hatch(0, 340, 210, 160, c.onp if c.flavor != 2 else c.sub, 14, 1.0), ring(105, 150, 46, c.onp, 1.6), T(55, 105, 100, mono(c), 16, c.onp, True, "c", anchor="m", h=90),
            co(c, 260, 70, 430), hl(260, 830, 118, c.line), *name_title(c, 260, 190), hl(260, 830, 362, c.line), *rows(c, 260, 384, 34, 6.5, 330, 92)]


def f_center(c):
    d = c.d
    return [*ticks(c), ring(450, 92, 26, c.acc, 1.4), T(410, 66, 80, mono(c), 9, c.acc if c.flavor != 2 else c.fg, True, "c", anchor="m", h=52),
            T(100, 150, 700, d["name"], 13.5, c.fg, True, "c", spacing=1.2, h=66), T(100, 220, 700, d["title"], 7, c.sub, False, "c", spacing=.6),
            hl(400, 500, 282, c.acc, 2.2), co(c, 100, 306, 700, None, "c"),
            T(100, 372, 700, f'{d["tel"]}     |     {d["mail"]}', 6.5, c.fg, False, "c"), T(100, 410, 700, d["addr"], 6.5, c.sub, False, "c")]


def f_block(c):
    d = c.d
    return [rect(560, 0, 340, 210, c.panel), *hatch(560, 0, 340, 210, c.onp if c.flavor != 2 else c.sub, 18, 1.0), co(c, L, 70, 420),
            hl(L, 500, 104, c.line), *name_title(c, L, 188), *cols(c, L, 372, [250, 270, 270], 6.5, sep=c.line)]


def f_arcs(c):
    d = c.d
    cx, cy = 700, 250
    return [*[ring(cx, cy, r, c.acc if r == 180 else c.line, 1.2) for r in (60, 110, 150, 180)], ellipse(cx, cy, 14, 14, c.acc), ellipse(cx + 127, cy - 127, 6, 6, c.acc),
            co(c, L, 70, 420), *name_title(c, L, 170), rect(L, 300, 36, 4, c.acc), *rows(c, L, 334, 36, 6.5, 330, 92)]


def f_bar(c):
    d = c.d
    out = [co(c, L, 70, 420), hl(L, 830, 108, c.line), *name_title(c, L, 160), T(L, 288, 700, d["addr"], 6.5, c.sub), rect(0, 372, 900, 128, c.panel)]
    x = L
    for lab, val, w in (("TEL", d["tel"], 260), ("MAIL", d["mail"], 300)):
        out += [T(x, 410, w, lab, 4.8, c.onp, True, spacing=1.4, op=.7), T(x, 438, w, val, 6.5, c.onp, True)]
        x += w
    out.append(vl(L + 238, 408, 466, c.onp))
    return out


def f_rule(c):
    d = c.d
    return [vl(300, 70, 430, c.line), rect(297, 70, 6, 56, c.acc), co(c, L, 70, 210), ring(L + 40, 238, 34, c.acc, 1.4), T(L, 204, 80, mono(c), 9, c.acc if c.flavor != 2 else c.fg, True, "c", anchor="m", h=70),
            *name_title(c, 350, 120), hl(350, 830, 262, c.line), *rows(c, 350, 290, 36, 6.5, 330, 92)]


def f_table(c):
    d = c.d
    out = [rect(0, 0, 900, 10, c.acc), T(L, 62, 360, d["name"], 13.5, c.fg, True, spacing=1.2, h=66), T(L, 132, 360, d["title"], 7, c.sub, False),
           co(c, 430, 72, 400, None, "r")]
    for i, (lab, val) in enumerate([("TEL", d["tel"]), ("MAIL", d["mail"]), ("ADDR", d["addr"])]):
        y = 252 + i * 64
        out += [hl(L, 830, y, c.line), T(L, y + 22, 160, lab, 4.8, c.sub, True, spacing=1.6), T(260, y + 17, 570, val, 7, c.fg)]
    out.append(hl(L, 830, 444, c.line))
    return out


def f_pill(c):
    d = c.d
    pw = max(150, len(d["title"]) * 7 * PT + 74)
    dots = [ellipse(742 + i * 26, 70 + j * 26, 3.4, 3.4, c.acc if (i + j) % 4 == 0 else c.line) for i in range(5) for j in range(4)]
    return [*dots, rect(L, 66, pw, 46, stroke=c.acc, sw=1.6, r=23), T(L, 66, pw, d["title"], 6.6, c.fg, True, "c", anchor="m", spacing=.8, h=46),
            T(L, 162, 600, d["name"], 13.5, c.fg, True, spacing=1.2, h=66), co(c, L, 244, 500), hl(L, 830, 318, c.line), *rows(c, L, 342, 36, 6.5, 420, 92), *tick(830, 440, c.line)]


def f_half(c):
    d = c.d
    return [poly(arc_pts(0, 250, 190, 190, -90, 90, 30), fill=c.panel), ring(0, 250, 120, c.onp, 1.2), ring(0, 250, 70, c.onp, 1.2), T(24, 170, 90, mono(c), 10, c.onp, True, "c", anchor="m", h=160),
            co(c, 310, 70, 520), hl(310, 830, 118, c.line), *name_title(c, 310, 180), hl(310, 830, 352, c.line), *rows(c, 310, 374, 34, 6.5, 330, 92)]


def f_slice(c):
    d = c.d
    return [poly([(690, 0), (900, 0), (900, 500), (590, 500)], fill=c.acc), *[line(690 - 22 * k, 0, 590 - 22 * k, 500, c.deco if c.flavor not in (2,) else c.sub, 1.0) for k in (1, 2, 3)],
            co(c, L, 70, 400), hl(L, 420, 104, c.line), *name_title(c, L, 176), rect(L, 290, 36, 4, c.acc), *rows(c, L, 326, 36, 6.3, 270, 90)]


def f_strip(c):
    d = c.d
    out = [rect(0, 360, 900, 140, c.deco if c.flavor not in (2,) else c.panel), rect(0, 360, 900, 4, c.acc), co(c, L, 70, 420), *name_title(c, L, 160)]
    out += cols(c, L, 392, [250, 280, 270], 6.3, sep=c.line if c.flavor != 2 else c.sub)
    return out


def f_dots(c):
    d = c.d
    dots = [ellipse(L + 6 + i * 22, 70 + j * 22, 3.2, 3.2, c.acc if (i * 2 + j) % 5 == 0 else c.line) for i in range(8) for j in range(3)]
    return [*dots, T(430, 66, 400, d["company"], 6.5, c.sub, True, "r", spacing=2.2), *name_title(c, L, 232), *rows(c, 830 - 330, 250, 36, 6.5, 240, 84), hl(L, 830, 450, c.line), ring(830, 450, 5, c.acc, 1.4)]


FRONTS = [f_grid, f_side, f_center, f_block, f_arcs, f_bar, f_rule, f_table, f_pill, f_half, f_slice, f_strip]
FRONTS[11] = f_strip
assert len(FRONTS) == NF


# ───────── 뒷면 10종 — 업무 목록·영업시간·채널(감성 문장 없음)
def chips(c, x, y, maxw, items, size=6.6, filled=False):
    out, cx, cy = [], x, y
    h = size * PT + 30
    for s in items:
        w = len(s) * size * PT * 0.98 + 44
        if cx + w > x + maxw:
            cx, cy = x, cy + h + 14
        out += [rect(cx, cy, w, h, c.acc if filled else None, stroke=None if filled else c.sub, sw=1.0, r=h / 2),
                T(cx, cy, w, s, size, c.on if filled else c.fg, False, "c", anchor="m", h=h)]
        cx += w + 14
    return out, cy + h


def svc_lines(c, x, y, w, items, size=7, pitch=50, num=True):
    out = []
    for i, s in enumerate(items):
        yy = y + i * pitch
        out += [hl(x, x + w, yy, c.line)]
        if num:
            out.append(T(x, yy + 15, 60, f"{i + 1:02d}", 5, c.sub, True, spacing=1))
        out.append(T(x + (66 if num else 0), yy + 12, w - 70, s, size, c.fg))
    out.append(hl(x, x + w, y + len(items) * pitch, c.line))
    return out, y + len(items) * pitch


def info(c, x, y, w=330, pitch=46, rows_=("hours", "web")):
    d = c.d
    items = []
    if "hours" in rows_:
        items.append(("HOURS", d["hours"]))
    if "web" in rows_:
        items.append((d["web"][0], d["web"][1]))
    out = []
    for i, (lab, val) in enumerate(items):
        yy = y + i * pitch
        out += [T(x, yy + 3, 110, lab, 4.8, c.sub, True, spacing=1.4), T(x + 110, yy, w - 110, val, 6.4, c.fg)]
    return out


def lab(c, x, y, w=300, color=None, align="l"):
    return T(x, y, w, c.d["svc_label"].upper() if False else c.d["svc_label"], 5.2, color or c.sub, True, align, spacing=2.4)


def b_list(c):  # 번호 목록 + 오른쪽 안내
    d = c.d
    items = d["services"]
    ll, _ = svc_lines(c, L, 126, 420, items, 7, 52)
    return [lab(c, L, 70), rect(L, 98, 30, 4, c.acc), *ll, rect(580, 70, 250, 360, c.panel), T(610, 100, 190, "INFO", 5, c.onp, True, spacing=2.4, op=.75),
            T(610, 140, 190, d["hours"], 6.4, c.onp, True), hl(610, 800, 214, c.onp), T(610, 236, 190, d["web"][0], 4.8, c.onp, True, spacing=1.4, op=.75), T(610, 266, 190, d["web"][1], 6.4, c.onp, True),
            T(610, 380, 200, c.d["company"], 5.6, c.onp, True, spacing=.8)]


def b_row(c):  # 가운데 한 줄 + 세로 구분선
    d = c.d
    items = d["services"]
    out = [*ticks(c), lab(c, 100, 92, 700, None, "c"), rect(425, 126, 50, 4, c.acc)]
    n = len(items)
    cw = 700 / n
    for i, s in enumerate(items):
        out.append(T(100 + i * cw, 190, cw, s, 7, c.fg, True, "c", anchor="m", h=60))
        if i:
            out.append(vl(100 + i * cw, 188, 252, c.line))
    out += [hl(100, 800, 322, c.line), T(100, 346, 340, d["hours"], 6.2, c.fg, False, "c"), T(460, 346, 340, f'{d["web"][0]}  {d["web"][1]}', 6.2, c.fg, False, "c"), co(c, 100, 424, 700, None, "c")]
    return out


def b_grid(c):  # 2열 번호 격자
    d = c.d
    items = d["services"]
    out = [lab(c, L, 62), hl(L, 830, 108, c.line)]
    for i, s in enumerate(items):
        col, row = i % 2, i // 2
        x, y = L + col * 390, 130 + row * 96
        out += [T(x, y, 60, f"{i + 1:02d}", 5.2, c.acc if c.flavor != 2 else c.fg, True, spacing=1), T(x + 62, y - 3, 320, s, 7.4, c.fg), hl(x, x + 360, y + 62, c.line)]
    out += [T(L, 436, 380, d["hours"], 6, c.sub), T(450, 436, 380, f'{d["web"][1]}', 6, c.sub, False, "r")]
    return out


def b_panel(c):  # 왼쪽 큰 면 + 오른쪽 목록
    d = c.d
    ll, _ = svc_lines(c, 400, 100, 430, d["services"], 7, 56, False)
    return [rect(0, 0, 330, 500, c.panel), *hatch(0, 340, 330, 160, c.onp if c.flavor != 2 else c.sub, 16, 1.0), ring(100, 110, 40, c.onp, 1.6), T(60, 70, 80, mono(c), 14, c.onp, True, "c", anchor="m", h=80),
            T(60, 400, 230, d["svc_label"], 7.5, c.onp, True, spacing=1), lab(c, 400, 62), *ll, T(400, 436, 430, f'{d["hours"]}   |   {d["web"][1]}', 6, c.sub)]


def b_chips(c):
    d = c.d
    cps, yb = chips(c, L, 150, 760, d["services"], 6.8)
    return [lab(c, L, 70), rect(L, 102, 30, 4, c.acc), *cps, hl(L, 830, 372, c.line), *info(c, L, 392, 760, 44), co(c, 430, 392, 400, None, "r")]


def b_line(c):  # 세로 점선 타임라인
    d = c.d
    out = [vl(110, 100, 100 + 56 * (len(d["services"]) - 1) + 12, c.acc, 1.6), lab(c, L, 52, 400)]
    for i, s in enumerate(d["services"]):
        y = 112 + i * 62
        out += [ellipse(110, y, 8, 8, c.acc if i == 0 else c.bg, stroke=c.acc, sw=1.6), T(150, y - 20, 420, s, 7.4, c.fg, True, h=44)]
    out += [vl(620, 96, 420, c.line), T(660, 110, 180, "HOURS", 4.8, c.sub, True, spacing=1.4), T(660, 142, 200, d["hours"], 6.2, c.fg),
            T(660, 232, 180, d["web"][0], 4.8, c.sub, True, spacing=1.4), T(660, 264, 190, d["web"][1], 6.2, c.fg), rect(660, 340, 66, 66, stroke=c.sub, sw=1.2, dash=True), T(660, 340, 66, "QR", 5, c.sub, True, "c", anchor="m", h=66)]
    return out


def b_solid(c):  # 원색 전면 + 안쪽 테두리
    d = c.d
    out = [rect(0, 0, 900, 500, c.panel), rect(30, 30, 840, 440, stroke=c.onp, sw=1.0, op=.5), lab(c, 80, 78, 400, c.onp)]
    for i, s in enumerate(d["services"]):
        out += [T(80, 130 + i * 62, 520, s, 9.5, c.onp, True, h=60), hl(80, 560, 130 + i * 62 + 56, c.onp, 1.0)]
    out += [T(630, 130, 240, "HOURS", 4.8, c.onp, True, spacing=1.4, op=.75), T(630, 160, 240, d["hours"], 6.2, c.onp, True), T(630, 250, 240, d["web"][0], 4.8, c.onp, True, spacing=1.4, op=.75), T(630, 280, 240, d["web"][1], 6.2, c.onp, True),
            co(c, 80, 420, 500, c.onp)]
    return out


def b_inline(c):  # 점으로 이어진 한 줄 + 아래 정보 표
    d = c.d
    return [*ticks(c, 30), co(c, L, 80, 700, None, "c"), rect(425, 126, 50, 4, c.acc), lab(c, 100, 172, 700, None, "c"),
            T(100, 206, 700, "  ·  ".join(d["services"]), 8.2, c.fg, True, "c", h=110), hl(100, 800, 340, c.line), T(100, 366, 340, d["hours"], 6.2, c.fg, False, "c"), vl(450, 360, 410, c.line),
            T(460, 366, 340, f'{d["web"][1]}', 6.2, c.fg, False, "c")]


def b_qr(c):
    d = c.d
    ll, _ = svc_lines(c, L, 130, 420, d["services"], 7, 52, False)
    return [lab(c, L, 70), rect(L, 98, 30, 4, c.acc), *ll, rect(610, 110, 200, 200, stroke=c.sub, sw=1.2, dash=True), T(610, 110, 200, "QR", 9, c.sub, True, "c", anchor="m", h=200),
            T(610, 336, 200, d["web"][1], 6.2, c.fg, False, "c"), T(610, 376, 200, d["hours"], 6.2, c.sub, False, "c")]


def b_dark(c):  # 큰 번호 + 업무
    d = c.d
    out = [rect(0, 0, 900, 8, c.acc), lab(c, L, 62)]
    for i, s in enumerate(d["services"]):
        out += [T(L, 118 + i * 74, 150, f"{i + 1:02d}", 15, c.acc if c.flavor != 2 else c.fg, True, h=66), T(L + 130, 132 + i * 74, 420, s, 8, c.fg, True, h=50)]
    out += [vl(620, 118, 420, c.line), T(660, 118, 180, "HOURS", 4.8, c.sub, True, spacing=1.4), T(660, 150, 200, d["hours"], 6.2, c.fg), T(660, 250, 180, d["web"][0], 4.8, c.sub, True, spacing=1.4), T(660, 282, 190, d["web"][1], 6.2, c.fg),
            co(c, 660, 400, 190)]
    return out


BACKS = [b_list, b_row, b_grid, b_panel, b_chips, b_line, b_solid, b_inline, b_qr, b_dark]
assert len(BACKS) == NB
