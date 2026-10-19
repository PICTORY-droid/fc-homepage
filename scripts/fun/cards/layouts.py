"""명함 앞면 10종 · 뒷면 8종 레이아웃 + 색 변형 5종(흰 바탕·연한 바탕·짙은 바탕·진한 색 바탕·크림 바탕).
레이아웃 × 색 변형 × 테마 색 × 글꼴이 카드마다 다르게 짝지어져 500장이 서로 겹치지 않습니다."""
import colorsys

from icons import icon
from scene import ellipse, line, poly, rect, text, PT
from icons import arc_pts

NF, NB, NFLAV = 10, 8, 5


# ───────── 색
def _rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def mix(a, b, t):
    A, B = _rgb(a), _rgb(b)
    return "#%02X%02X%02X" % tuple(round((A[i] * (1 - t) + B[i] * t) * 255) for i in range(3))


def _lum(h):
    def f(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (f(c) for c in _rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = _lum(a), _lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def readable(color, bg, ratio=4.5):
    """color 를 bg 대비 ratio 이상이 되도록 어둡게/밝게 조정"""
    target = "#000000" if _lum(bg) > 0.4 else "#FFFFFF"
    for t in range(0, 21):
        c = mix(color, target, t / 20)
        if contrast(c, bg) >= ratio:
            return c
    return target


class Ctx:
    """한 면을 그릴 때 쓰는 색·글·글꼴 묶음"""

    def __init__(self, pal, flavor, d, name_font, side="front"):
        p = pal
        self.flavor, self.d, self.nf = flavor, d, name_font
        if flavor == 0:
            self.bg, self.fg, self.acc, self.acc2 = "#FFFFFF", p["dark"], p["main"], p["soft"]
        elif flavor == 1:
            self.bg, self.fg, self.acc, self.acc2 = p["pale"], p["dark"], p["main"], mix(p["soft"], "#FFFFFF", .3)
        elif flavor == 2:
            self.bg, self.fg, self.acc, self.acc2 = p["dark"], "#FFFFFF", mix(p["main"], "#FFFFFF", .28), mix(p["dark"], "#FFFFFF", .16)
        elif flavor == 3:
            self.bg = mix(p["main"], p["dark"], .45); self.fg, self.acc, self.acc2 = "#FFFFFF", p["soft"], mix(self.bg, "#FFFFFF", .16)
        else:
            self.bg, self.fg, self.acc, self.acc2 = "#FBF8F2", p["dark"], p["accent"], mix(p["accent"], "#FFFFFF", .72)
        self.sub = readable(mix(self.fg, self.bg, .35), self.bg, 4.5)
        self.accT = readable(self.acc, self.bg, 4.5)  # 글자로 쓸 강조색
        self.on = readable("#FFFFFF" if _lum(self.acc) < 0.35 else self.fg, self.acc, 4.5)  # 강조색 위 글자
        self.on2 = readable(self.on, self.acc2, 3.0)


# ───────── 글 도우미
def _cw(ch, fs):
    return fs * (0.34 if ch == " " else 0.58 if ch.isascii() else 1.0)


def _greedy(s, fs, width):
    """어절(띄어쓰기) 단위로 줄을 나눕니다. 한 어절이 한 줄보다 길 때만 글자 단위로 자릅니다."""
    out, cur, w = [], "", 0.0
    for word in s.split(" "):
        ww = sum(_cw(ch, fs) for ch in word)
        gap = _cw(" ", fs) if cur else 0.0
        if cur and w + gap + ww > width:
            out.append(cur); cur, w, gap = "", 0.0, 0.0
        if ww > width:
            for ch in word:
                if w + _cw(ch, fs) > width and cur:
                    out.append(cur); cur, w = "", 0.0
                cur += ch; w += _cw(ch, fs)
            continue
        cur += (" " if cur else "") + word
        w += gap + ww
    if cur:
        out.append(cur)
    return out


def wrap(s, size, width):
    """한글 폭으로 어림해 줄바꿈하고, 같은 줄 수 안에서 줄 길이를 고르게 맞춥니다(한 글자만 남는 줄 방지).
    SVG 는 자동 줄바꿈이 없어서 미리 나눕니다."""
    fs = size * PT
    lines = _greedy(s, fs, width)
    n = len(lines)
    if n > 1:
        lo, hi = 0.0, float(width)
        for _ in range(24):
            mid = (lo + hi) / 2
            if len(_greedy(s, fs, mid)) == n:
                hi = mid
            else:
                lo = mid
        lines = _greedy(s, fs, hi)
    return "\n".join(lines)


def contacts(c, x, y, rows=3, w=520, size=7, color=None, labelc=None, gap=None, align="l"):
    d = c.d
    items = [("T", d["tel"]), ("E", d["mail"]), ("A", d["addr"])][:rows]
    col = color or c.fg
    gap = gap or size * PT * 1.9
    out = []
    for i, (lab, val) in enumerate(items):
        yy = y + i * gap
        if align == "l":
            out.append(text(x, yy, 34, gap, lab, size, labelc or c.accT, True))
            out.append(text(x + 40, yy, w, gap, val, size, col))
        else:
            out.append(text(x, yy, w, gap, f"{val}  {lab}", size, col, align="r"))
    return out


def name_t(c, x, y, w, size=18, align="l", color=None):
    return text(x, y, w, size * PT * 1.3, c.d["name"], size, color or c.fg, True, align, c.nf, spacing=0.5 if size > 15 else 0)


# ───────── 앞면 10종
def f_sidebar(c):
    d = c.d
    return [rect(0, 0, 46, 500, c.acc), rect(46, 0, 10, 500, c.acc2),
            *icon(d["icon"], 780, 105, 96, c.acc, c.acc2),
            text(110, 62, 560, 30, d["company"], 7.5, c.sub, True, spacing=1.5),
            name_t(c, 110, 150, 600, 19), text(110, 232, 600, 36, d["title"], 8.5, c.accT, True),
            rect(110, 292, 64, 4, c.acc), *contacts(c, 110, 330)]


def f_center(c):
    d = c.d
    return [text(100, 56, 700, 28, d["company"], 7, c.sub, True, "c", spacing=3),
            *icon(d["icon"], 450, 140, 60, c.acc, c.acc2),
            name_t(c, 100, 190, 700, 19, "c"), text(100, 292, 700, 34, d["title"], 8.5, c.accT, True, "c"),
            rect(420, 346, 60, 3, c.acc),
            text(100, 372, 700, 30, f'{d["tel"]}   ·   {d["mail"]}', 7, c.fg, False, "c"), text(100, 408, 700, 30, d["addr"], 7, c.sub, False, "c")]


def f_topband(c):
    d = c.d
    return [rect(0, 0, 900, 200, c.acc), *icon(d["icon"], 790, 100, 96, c.on, c.on2),
            name_t(c, 64, 52, 600, 18.5, "l", c.on), text(64, 132, 600, 34, d["title"], 8.5, c.on, True),
            text(64, 232, 500, 28, d["company"], 7.5, c.sub, True, spacing=1.5), *contacts(c, 64, 282)]


def f_corner(c):
    d = c.d
    return [poly([(900, 500), (900, 150), (540, 500)], c.acc), poly([(900, 500), (900, 300), (700, 500)], c.acc2, op=0.9),
            *icon(d["icon"], 820, 410, 74, c.on, c.on2),
            text(70, 56, 500, 28, d["company"], 7.5, c.sub, True, spacing=1.5), name_t(c, 70, 100, 560, 19),
            text(70, 182, 520, 34, d["title"], 8.5, c.accT, True), rect(70, 240, 64, 4, c.acc), *contacts(c, 70, 290, w=440)]


def f_monogram(c):
    d = c.d
    r = 118
    return [ellipse(190, 250, r + 20, r + 20, None, c.acc2, 4), ellipse(190, 250, r, r, c.acc),
            text(72, 170, 236, 160, d["name"][0], 48, c.on, True, "c", c.nf, anchor="m"),
            text(370, 62, 480, 28, d["company"], 7.5, c.sub, True, spacing=1.5),
            name_t(c, 370, 118, 480, 18), text(370, 196, 480, 34, d["title"], 8.5, c.accT, True), rect(370, 252, 56, 4, c.acc),
            *contacts(c, 370, 292, w=440)]


def f_bottomband(c):
    d = c.d
    bandc = [("T", d["tel"]), ("E", d["mail"])]
    out = [rect(0, 372, 900, 128, c.acc), *icon(d["icon"], 800, 120, 110, c.acc, c.acc2),
           name_t(c, 60, 64, 600, 19), text(60, 146, 600, 34, d["title"], 8.5, c.accT, True), text(60, 214, 600, 28, d["company"], 7.5, c.sub, True, spacing=1.5)]
    for i, (lab, val) in enumerate(bandc):
        out += [text(60, 398 + i * 40, 34, 30, lab, 7, c.on2 if False else c.on, True), text(100, 398 + i * 40, 380, 30, val, 7, c.on)]
    out += [text(500, 398, 34, 30, "A", 7, c.on, True), text(540, 398, 330, 60, d["addr"], 7, c.on)]
    return out


def f_frame(c):
    d = c.d
    return [rect(26, 26, 848, 448, None, c.acc, 3), rect(40, 40, 820, 420, None, c.acc2, 1.5),
            text(100, 78, 700, 28, d["company"], 7, c.sub, True, "c", spacing=4),
            name_t(c, 100, 130, 700, 19, "c"), text(100, 218, 700, 34, d["title"], 8.5, c.accT, True, "c"), rect(425, 276, 50, 3, c.acc),
            text(100, 302, 700, 30, d["tel"], 7.5, c.fg, False, "c"), text(100, 336, 700, 30, d["mail"], 7.5, c.fg, False, "c"),
            text(100, 370, 700, 30, d["addr"], 7, c.sub, False, "c"), *icon(d["icon"], 450, 430, 38, c.acc, c.acc2)]


def f_editorial(c):
    d = c.d
    return [rect(540, 60, 3, 380, c.acc), text(60, 56, 440, 28, d["company"], 7, c.sub, True, spacing=3),
            *icon(d["icon"], 110, 150, 66, c.acc, c.acc2),
            text(60, 270, 480, 34, d["title"], 8.5, c.accT, True), name_t(c, 60, 312, 480, 21),
            *contacts(c, 576, 150, w=250, size=7)]


def f_panel(c):
    d = c.d
    return [rect(610, 0, 290, 500, c.acc), *icon(d["icon"], 755, 200, 140, c.on, c.on2),
            text(630, 340, 250, 60, d["company"], 8, c.on, True, "c", spacing=1.5),
            name_t(c, 60, 92, 520, 19), text(60, 172, 520, 34, d["title"], 8.5, c.accT, True), rect(60, 230, 56, 4, c.acc), *contacts(c, 60, 280, w=440)]


def f_dots(c):
    d = c.d
    dots = [ellipse(690 + i * 30, 50 + j * 30, 6, 6, c.acc, op=0.7 - 0.12 * j) for i in range(5) for j in range(4)]
    return [*dots, rect(0, 462, 900, 38, c.acc), rect(0, 462, 260, 38, c.acc2),
            text(70, 58, 500, 28, d["company"], 7.5, c.sub, True, spacing=1.5), name_t(c, 70, 150, 560, 19),
            text(70, 230, 560, 34, d["title"], 8.5, c.accT, True), *contacts(c, 70, 308, w=440), *icon(d["icon"], 800, 330, 80, c.acc, c.acc2)]


FRONTS = [f_sidebar, f_center, f_topband, f_corner, f_monogram, f_bottomband, f_frame, f_editorial, f_panel, f_dots]


# ───────── 뒷면 8종
def tag(c, x, y, w, h, size=11.5, align="c", color=None, anchor="m"):
    return text(x, y, w, h, wrap(c.d["tagline"], size, w), size, color or c.fg, True, align, "serif" if c.d["tag_serif"] else "sans", anchor=anchor)


def b_full(c):
    d = c.d
    return [rect(0, 0, 900, 500, c.acc), *icon(d["icon"], 450, 150, 100, c.on, c.on2), tag(c, 110, 232, 680, 110, 11.5, "c", c.on),
            text(100, 410, 700, 30, d["company"], 7, c.on, True, "c", spacing=3)]


def b_faint(c):
    d = c.d
    return [*icon(d["icon"], 450, 250, 440, c.acc, c.acc2), rect(0, 0, 900, 500, c.bg, op=0.9), tag(c, 110, 170, 680, 120, 12, "c"),
            rect(420, 326, 60, 3, c.acc), text(100, 358, 700, 30, d["company"], 7.5, c.sub, True, "c", spacing=3)]


def b_split(c):
    d = c.d
    return [rect(0, 0, 340, 500, c.acc), *icon(d["icon"], 170, 250, 150, c.on, c.on2),
            tag(c, 400, 120, 440, 220, 11.5, "l"), rect(400, 366, 50, 3, c.acc), text(400, 394, 440, 30, d["company"], 7.5, c.sub, True, spacing=2)]


def b_stripes(c):
    d = c.d
    return [*[line(0, 26 + i * 30, 900, 26 + i * 30, c.acc, 2, 0.3) for i in range(17)],
            rect(130, 130, 640, 240, c.bg), rect(130, 130, 640, 240, None, c.acc, 2.5),
            tag(c, 160, 150, 580, 200, 11.5, "c"), text(100, 408, 700, 30, d["company"], 7, c.sub, True, "c", spacing=3)]


def b_brandqr(c):
    d = c.d
    return [rect(0, 0, 18, 500, c.acc), text(70, 120, 560, 70, d["company"], 17, c.fg, True, "l", c.nf),
            text(70, 244, 560, 150, wrap(d["tagline"], 8.5, 560), 8.5, c.sub, False, "l", "serif" if d["tag_serif"] else "sans"),
            rect(700, 300, 140, 140, None, c.acc, 2.5, dash=True), text(700, 300, 140, 140, "QR", 9, c.sub, True, "c", anchor="m"),
            rect(70, 212, 56, 4, c.acc), *icon(d["icon"], 770, 120, 90, c.acc, c.acc2)]


def b_frame(c):
    d = c.d
    return [rect(30, 30, 840, 440, None, c.acc, 3), tag(c, 110, 140, 680, 120, 12, "c"),
            line(350, 300, 540, 300, c.acc, 2), ellipse(450, 300, 7, 7, c.acc),
            text(100, 340, 700, 30, d["company"], 7.5, c.sub, True, "c", spacing=3), *icon(d["icon"], 450, 90, 50, c.acc, c.acc2)]


def b_quarter(c):
    d = c.d
    return [poly([(900, 500)] + arc_pts(900, 500, 340, 340, 180, 270), c.acc), poly([(900, 500)] + arc_pts(900, 500, 200, 200, 180, 270), c.acc2),
            *icon(d["icon"], 800, 410, 70, c.on, c.on2),
            tag(c, 70, 90, 540, 200, 12, "l", anchor="t"), text(70, 410, 400, 30, d["company"], 7.5, c.sub, True, spacing=2)]


def b_leftband(c):
    d = c.d
    return [rect(0, 0, 76, 500, c.acc), *icon(d["icon"], 38, 66, 44, c.on, c.on2),
            tag(c, 140, 110, 500, 200, 11.5, "l", anchor="m"), text(140, 350, 480, 30, d["company"], 7.5, c.sub, True, spacing=2),
            rect(700, 60, 130, 130, None, c.acc, 2.5, dash=True), text(700, 60, 130, 130, "QR", 9, c.sub, True, "c", anchor="m")]


BACKS = [b_full, b_faint, b_split, b_stripes, b_brandqr, b_frame, b_quarter, b_leftband]
