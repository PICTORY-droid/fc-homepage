"""명함 디자인 v2 — 선명한 원색 + 깨끗한 흰 바탕 + 큰 여백의 미니멀 레이아웃.
- 색: 탁한 혼합색 없이 맑은 원색 50가지(PAL). 글자는 항상 먹색/흰색, 원색은 면·선·점에만 씁니다.
- 레이아웃: 앞면 12종 · 뒷면 10종 × 바탕 5종(흰색·먹색·원색·연회색·연한 원색)."""
from layouts import contrast, mix, wrap
from icons import arc_pts
from scene import PT, ellipse, line, poly, rect, text

NF, NB, NFLAV = 12, 10, 5
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


def rows(c, x, y, pitch=38, size=7, w=420, labw=92, align="l", n=3):
    d = c.d
    items = [("TEL", d["tel"]), ("MAIL", d["mail"]), ("ADDR", d["addr"])][:n]
    out = []
    for i, (lab, val) in enumerate(items):
        yy = y + i * pitch
        if align == "l":
            out += [T(x, yy + 3, labw, lab, 5.2, c.sub, True, spacing=1.2), T(x + labw, yy, w, val, size, c.fg)]
        else:
            out += [T(x - w, yy, w, val, size, c.fg, align="r")]
    return out


def mono(c):
    return c.d["company"][:1] if c.d["company"] else "A"


def sector(cx, cy, r, a0, a1, fill, op=1):
    return poly([(cx, cy)] + arc_pts(cx, cy, r, r, a0, a1, 24), fill=fill, op=op)


# ───────── 앞면 12종
def f_swiss(c):
    d = c.d
    return [T(70, 62, 560, d["company"], 7, c.sub, True, spacing=2), ellipse(830, 76, 9, 9, c.acc),
            T(70, 188, 700, d["name"], 22, c.fg, True, h=100), T(70, 300, 700, d["title"], 9, c.sub),
            line(70, 372, 830, 372, c.line, 1.6),
            T(70, 392, 220, d["tel"], 6.8, c.fg), T(300, 392, 250, d["mail"], 6.8, c.fg), T(570, 392, 270, d["addr"], 6.8, c.fg),
            T(70, 424, 60, "TEL", 5, c.sub, True, spacing=1.2), T(300, 424, 60, "MAIL", 5, c.sub, True, spacing=1.2), T(570, 424, 60, "ADDR", 5, c.sub, True, spacing=1.2)]


def f_split(c):
    d = c.d
    return [rect(0, 0, 320, 500, c.panel), ellipse(160, 250, 78, 78, stroke=c.onp, sw=3), T(60, 190, 200, d["name"][:1], 34, c.onp, True, "c", anchor="m", h=120),
            T(390, 62, 440, d["company"], 7, c.sub, True, spacing=2), T(390, 150, 440, d["name"], 22, c.fg, True, h=100),
            T(390, 262, 440, d["title"], 9, c.sub), rect(390, 332, 40, 5, c.acc), *rows(c, 390, 366, 36, 7, 400)]


def f_center(c):
    d = c.d
    return [ellipse(450, 66, 8, 8, c.acc), T(100, 130, 700, d["name"], 22, c.fg, True, "c", h=100), T(100, 244, 700, d["title"], 9, c.sub, False, "c"),
            rect(425, 316, 50, 4, c.acc), T(100, 352, 700, f'{d["tel"]}      {d["mail"]}', 7, c.fg, False, "c"), T(100, 396, 700, d["addr"], 7, c.sub, False, "c"),
            T(100, 438, 700, d["company"], 5.5, c.sub, True, "c", spacing=3)]


def f_initial(c):
    d = c.d
    return [T(440, 10, 460, d["name"][:1], 128, c.deco, True, "c", anchor="m", h=480),
            T(70, 62, 400, d["company"], 7, c.sub, True, spacing=2), T(70, 168, 460, d["name"], 22, c.fg, True, h=100), T(70, 280, 460, d["title"], 9, c.sub),
            rect(70, 342, 40, 5, c.acc), *rows(c, 70, 372, 34, 6.8, 360)]


def f_arc(c):
    d = c.d
    return [sector(900, 0, 270, 90, 180, c.acc), sector(900, 0, 160, 90, 180, c.deco if c.flavor != 2 else c.panel),
            T(70, 150, 540, d["name"], 22, c.fg, True, h=100), T(70, 262, 540, d["title"], 9, c.sub),
            T(70, 62, 400, d["company"], 7, c.sub, True, spacing=2), *rows(c, 70, 340, 38, 7, 420)]


def f_bar(c):
    d = c.d
    return [T(70, 62, 560, d["company"], 7, c.sub, True, spacing=2), T(70, 130, 700, d["name"], 22, c.fg, True, h=100), T(70, 242, 700, d["title"], 9, c.sub),
            T(70, 338, 700, d["addr"], 6.8, c.sub), rect(0, 410, 900, 90, c.panel),
            T(70, 436, 360, d["tel"], 7, c.onp, True), T(460, 436, 380, d["mail"], 7, c.onp, True)]


def f_circles(c):
    d = c.d
    return [ellipse(270, 250, 118, 118, c.deco if c.flavor != 2 else c.panel), ellipse(170, 250, 118, 118, c.acc, op=0.92),
            T(470, 62, 360, d["company"], 7, c.sub, True, spacing=2), T(470, 150, 380, d["name"], 22, c.fg, True, h=100), T(470, 262, 380, d["title"], 9, c.sub),
            rect(470, 332, 40, 5, c.acc), *rows(c, 470, 366, 36, 6.6, 330, 92)]


def f_table(c):
    d = c.d
    out = [rect(70, 40, 56, 6, c.acc), T(70, 76, 600, d["name"], 22, c.fg, True, h=100), T(70, 188, 600, d["title"], 9, c.sub), T(430, 64, 400, d["company"], 6.5, c.sub, True, "r", spacing=2)]
    for i, (lab, val) in enumerate([("TEL", d["tel"]), ("MAIL", d["mail"]), ("ADDR", d["addr"])]):
        y = 292 + i * 62
        out += [line(70, y, 830, y, c.line, 1.6), T(70, y + 20, 160, lab, 5.2, c.sub, True, spacing=1.5), T(250, y + 14, 580, val, 7.5, c.fg)]
    out.append(line(70, 478, 830, 478, c.line, 1.6))
    return out


def f_pill(c):
    d = c.d
    pw = max(150, len(d["title"]) * 8.5 * PT + 70)
    return [rect(70, 64, pw, 50, c.acc, r=25), T(70, 64, pw, d["title"], 8, c.on, True, "c", anchor="m", h=50),
            T(70, 158, 700, d["name"], 24, c.fg, True, h=110), T(70, 276, 600, d["company"], 8, c.sub),
            line(70, 336, 830, 336, c.line, 1.6), *rows(c, 70, 358, 36, 6.8, 420)]


def f_half(c):
    d = c.d
    return [poly(arc_pts(0, 250, 200, 200, -90, 90, 30), fill=c.panel), T(10, 150, 150, d["name"][:1], 30, c.onp, True, "c", anchor="m", h=200),
            T(310, 62, 520, d["company"], 7, c.sub, True, spacing=2), T(310, 150, 520, d["name"], 22, c.fg, True, h=100), T(310, 262, 520, d["title"], 9, c.sub),
            rect(310, 332, 40, 5, c.acc), *rows(c, 310, 366, 36, 7, 400)]


def f_slice(c):
    d = c.d
    return [poly([(660, 0), (900, 0), (900, 500), (560, 500)], fill=c.acc), poly([(618, 0), (646, 0), (546, 500), (518, 500)], fill=c.deco if c.flavor != 2 else c.panel),
            T(70, 62, 400, d["company"], 7, c.sub, True, spacing=2), T(70, 150, 440, d["name"], 22, c.fg, True, h=100), T(70, 262, 440, d["title"], 9, c.sub),
            rect(70, 332, 40, 5, c.acc), *rows(c, 70, 366, 36, 6.6, 330, 92)]


def f_dots(c):
    d = c.d
    dots = [ellipse(740 + i * 28, 70 + j * 28, 5, 5, c.acc if (i + j) % 3 == 0 else c.deco) for i in range(5) for j in range(4)]
    return [*dots, T(70, 62, 400, d["company"], 7, c.sub, True, spacing=2), T(70, 214, 560, d["name"], 22, c.fg, True, h=100), T(70, 326, 560, d["title"], 9, c.sub),
            *rows(c, 830, 372, 38, 7, 380, align="r")]


FRONTS = [f_swiss, f_split, f_center, f_initial, f_arc, f_bar, f_circles, f_table, f_pill, f_half, f_slice, f_dots]
assert len(FRONTS) == NF


# ───────── 뒷면 10종
def tg(c, x, y, w, size=12, align="l", color=None, anchor="t", h=160):
    return text(x, y, w, h, wrap(c.d["tagline"], size, w), size, color or c.fg, True, align, "sans", 0, anchor)


def b_solid(c):
    d = c.d
    return [rect(0, 0, 900, 500, c.panel), sector(900, 500, 230, 180, 270, mix(c.panel, WHITE, .22)), tg(c, 70, 120, 640, 13, "l", c.onp, "t", 200),
            T(70, 410, 500, d["company"], 7, c.onp, True, spacing=2)]


def b_dot(c):
    d = c.d
    return [ellipse(450, 150, 8, 8, c.acc), tg(c, 110, 190, 680, 12, "c", None, "t", 140), T(100, 372, 700, d["company"], 6.5, c.sub, True, "c", spacing=3)]


def b_bar(c):
    d = c.d
    return [rect(70, 150, 8, 200, c.acc), tg(c, 118, 170, 600, 12.5, "l", None, "t", 180), T(118, 420, 500, d["company"], 6.5, c.sub, True, spacing=2)]


def b_split(c):
    d = c.d
    return [rect(580, 0, 320, 500, c.panel), ellipse(740, 250, 74, 74, stroke=c.onp, sw=3), T(640, 190, 200, mono(c), 30, c.onp, True, "c", anchor="m", h=120),
            tg(c, 70, 150, 450, 12, "l", None, "t", 200), T(70, 420, 440, d["company"], 6.5, c.sub, True, spacing=2)]


def b_mono(c):
    d = c.d
    return [ellipse(450, 140, 58, 58, c.acc), T(380, 90, 140, mono(c), 26, c.on, True, "c", anchor="m", h=100), T(100, 228, 700, d["company"], 8.5, c.fg, True, "c", spacing=2),
            rect(425, 292, 50, 4, c.acc), tg(c, 150, 330, 600, 9, "c", c.sub, "t", 100)]


def b_qr(c):
    d = c.d
    return [rect(640, 140, 190, 190, stroke=c.sub, sw=2, dash=True), T(640, 140, 190, "QR", 11, c.sub, True, "c", anchor="m", h=190),
            tg(c, 70, 140, 480, 12, "l", None, "t", 200), rect(70, 360, 40, 5, c.acc), T(70, 390, 460, d["company"], 7, c.sub, True, spacing=2)]


def b_quote(c):
    d = c.d
    return [T(60, 20, 300, "“", 110, c.acc, True, h=260), tg(c, 70, 220, 700, 12.5, "l", None, "t", 180), line(70, 420, 830, 420, c.line, 1.6),
            T(70, 436, 760, d["company"], 6.5, c.sub, True, "r", spacing=2)]


def b_arcs(c):
    d = c.d
    return [sector(0, 0, 300, 0, 90, c.acc), sector(0, 0, 190, 0, 90, c.deco if c.flavor != 2 else c.panel), tg(c, 330, 290, 500, 12, "r", None, "t", 120),
            T(330, 424, 500, d["company"], 6.5, c.sub, True, "r", spacing=2)]


def b_foot(c):
    d = c.d
    return [tg(c, 70, 90, 700, 13, "l", None, "t", 220), rect(0, 410, 900, 90, c.panel), T(70, 436, 520, d["company"], 7.5, c.onp, True, spacing=2),
            *[ellipse(760 + i * 30, 455, 6, 6, c.onp, op=1 if i == 0 else .5) for i in range(3)]]


def b_grid(c):
    d = c.d
    dots = [ellipse(30 + i * 30, 30 + j * 30, 2.6, 2.6, c.line) for i in range(30) for j in range(16)]
    return [*dots, rect(110, 130, 680, 240, c.bg), tg(c, 150, 160, 600, 11.5, "c", None, "t", 130), T(150, 318, 600, d["company"], 6.5, c.sub, True, "c", spacing=3)]


BACKS = [b_solid, b_dot, b_bar, b_split, b_mono, b_qr, b_quote, b_arcs, b_foot, b_grid]
assert len(BACKS) == NB
