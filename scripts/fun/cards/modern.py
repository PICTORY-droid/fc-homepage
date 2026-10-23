"""명함 디자인 v3 — 절제된 프리미엄 색 + 깨끗한 바탕 + 큰 여백의 미니멀 레이아웃(앞·뒷면이 서로의 색을 나눠 쓰는 한 벌 디자인).
- 색: 보석색·금속색 위주의 프리미엄 색 50가지(PAL). 글자는 먹색/흰색이 기본이고, 색은 면·선·점과 작은 이름 글자에 씁니다.
- 바탕 5종: 순백·파우더 톤·중간 깊이 보석색·아이보리 펄·연한 틴트(원색 전면·검정 계열 없음). 앞·뒷면은 서로 밝기 계열이 반대이고 포인트 색은 서로 어울리는 짝입니다.
- 레이아웃: 앞면 12종 · 뒷면 10종."""
from layouts import contrast, mix, readable, wrap
from icons import arc_pts
from scene import PT, ellipse, line, poly, rect, text

NF, NB, NFLAV = 12, 10, 5
L = 70  # 좌우 여백
INK, WHITE = "#1B2230", "#FFFFFF"
LIGHT_FLAVORS, DEEP_FLAVORS = (0, 3, 4), (1, 2)  # 밝은 바탕 계열 / 파우더·보석색 바탕 계열 — 앞면과 뒷면은 서로 반대 계열을 씁니다

PAL = [  # (이름, 대표색) — 프리미엄 브랜드 색 연구 + 오픈소스 팔레트의 절제된 보석색·금속색. 색상 계열 순서(남·청록·녹·금·갈·분홍·보라·회색)입니다.
    # 출처: Zoviz "Luxury Brand Colors"(골드 #C69B3C · 플래티넘 #BFC1C2 · 에메랄드 · 샴페인 #EBDAB0 · 로즈골드 #B76E79 · 토프 #8A7968 · 세이지 #9CAF88 · 아메시스트),
    #       Tailwind CSS(MIT) slate/stone 의 차분한 회색 톤, nice-color-palettes(MIT)·Open Color(MIT)의 조화로운 중간 채도 계열.
    ("네이비", "#22345E"), ("로열네이비", "#2B4A82"), ("사파이어", "#3F63A8"), ("스틸블루", "#5B7FA8"), ("더스크블루", "#7E9CC0"),
    ("포그블루", "#A9BFD8"), ("페리윙클", "#7C8CC8"), ("아이리스", "#7E7BC0"), ("딥틸", "#1F7A80"), ("틸", "#3A9BA0"),
    ("아쿠아미스트", "#8CC7C8"), ("에메랄드", "#14705A"), ("레이싱그린", "#1F6B54"), ("파인", "#2E6F5E"), ("모스", "#6B8F6E"),
    ("세이지", "#9CAF88"), ("올리브세이지", "#7F9468"), ("민트미스트", "#A8D5C2"), ("24K골드", "#C69B3C"), ("샴페인골드", "#D8BE85"),
    ("샴페인", "#EBDAB0"), ("브론즈", "#A67C45"), ("코발트미스트", "#5E82C6"), ("크림블러시", "#F0D2C8"), ("스카이미스트", "#BBD6EE"),
    ("토프", "#8A7968"), ("토파즈블루", "#4A90B8"), ("아쿠아마린", "#6CC4C0"), ("로즈골드", "#B76E79"), ("더스티로즈", "#C9909C"),
    ("블러시", "#E5B8BF"), ("피오니", "#D98BA0"), ("모브", "#A9788F"), ("와인모브", "#8E4A63"), ("플럼", "#6E4A72"),
    ("버건디", "#7A2A3C"), ("헤더", "#9A7FB0"), ("아메시스트", "#6D52A8"), ("라벤더스모크", "#A89CCB"), ("라일락미스트", "#C8BCE0"),
    ("오키드스모크", "#B388B8"), ("플래티넘", "#BFC1C2"), ("실버", "#A9AEB5"), ("그래파이트", "#4A5663"), ("슬레이트", "#5E6B7C"),
    ("펄그레이", "#D4D8DE"), ("피치베이지", "#E8B79A"), ("테라로즈", "#C98273"), ("스모키틸블루", "#4F8796"), ("포레스트미스트", "#5D8A7A"),
]
assert len(PAL) == 50 and len({n for n, _ in PAL}) == 50 and len({h for _, h in PAL}) == 50


def _hls(h):
    import colorsys
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
    return colorsys.rgb_to_hls(r, g, b)


def _hex(h, l, sat):
    import colorsys
    return "#%02X%02X%02X" % tuple(round(v * 255) for v in colorsys.hls_to_rgb(h, l, sat))


def _partners(i):
    """앞면 색 i 와 어울리는 뒷면 색 후보 — 이웃 색상 또는 보색 계열을 먼저, 마지막에 금속·중성색(골드·플래티넘 등)을 둡니다."""
    h0, _, s0 = _hls(PAL[i][1])
    cand, metal = [], []
    for k in range(50):
        if k == i:
            continue
        hk, _, sk = _hls(PAL[k][1])
        if sk < .2 or s0 < .2:
            metal.append(k)
            continue
        dh = abs(hk - h0) * 360
        dh = min(dh, 360 - dh)
        if 28 <= dh <= 80:
            cand.append((abs(dh - 48), k))
        elif 150 <= dh <= 200:
            cand.append((abs(dh - 170) + 12, k))
    cand.sort()
    return [k for _, k in cand] + [k for k in metal if k not in {c for _, c in cand}][:12]


PARTNERS = [_partners(i) for i in range(50)]
assert all(len(p) >= 8 for p in PARTNERS), [len(p) for p in PARTNERS]


def _warm(color):
    """빨강·분홍 계열인지 — 큰 면에는 쓰지 않고 연한 톤으로만 씁니다."""
    h, _, sat = _hls(color)
    return sat > .2 and (h * 360 <= 22 or h * 360 >= 335)


def settle(color):
    """큰 면에 쓸 색을 고급스러운 중간 깊이로 맞춥니다(원색·검정에 가까운 색 금지). → (면 색, 그 위 글자가 먹색이면 True)"""
    if _warm(color):
        return mix(color, WHITE, .62), True  # 빨강·분홍 계열은 연한 톤
    cw = contrast(WHITE, color)
    if cw > 6.0:  # 너무 어두운 색(검정에 가까움)은 밝혀서 맑은 중간 톤으로
        c = color
        for _ in range(40):
            c = mix(c, WHITE, .04)
            if contrast(WHITE, c) <= 6.0:
                break
        return c, False
    if cw >= 4.5:
        return color, False
    if contrast(INK, color) >= 5.0:
        return color, True  # 밝은 색(금·샴페인·미스트·브론즈)은 그대로 + 먹색 글자
    h, l, sat = _hls(color)
    sat = min(sat, .58)
    c = color
    for _ in range(60):
        c = _hex(h, l, sat)
        if contrast(WHITE, c) >= 4.5:
            return c, False
        l -= .01
    return c, False


def clear(color, bg, ratio=3.0):
    """밝은 바탕 위에서 글자·선으로 읽히도록 색을 진하게 — 검정을 섞지 않고 채도를 지켜서 탁하지 않게."""
    if contrast(color, bg) >= ratio:
        return color
    h, l, sat = _hls(color)
    sat = max(sat, .35)
    c = color
    for _ in range(70):
        c = _hex(h, l, sat)
        if contrast(c, bg) >= ratio:
            return c
        l -= .01
    return c


def lively(color, minc=4.0, bg="#3A5890"):
    """어두운 면 위에서 선명하게 보이도록 색을 밝게(색조 유지)."""
    c = color
    for _ in range(30):
        if contrast(c, bg) >= minc:
            return c
        c = mix(c, WHITE, .08)
    return c


class Ctx:
    """한 면의 색 묶음. acc=면·선·점에 쓰는 포인트색, fg=글자, sub=보조 글자, on=포인트색 위 글자, panel=바탕과 다른 큰 면.
    partner=반대 면의 대표색 번호 — 그 색을 acc2(두 번째 포인트)와 link(회사명·항목 이름 글자)에 써서 앞·뒷면이 한 벌로 보이게 합니다.
    바탕은 순백·아이보리 펄·연한 틴트·파우더 톤·중간 깊이 보석색 — 원색 전면과 검정에 가까운 바탕은 쓰지 않습니다."""

    def __init__(self, pal_i, flavor, d, side="front", partner=None):
        self.d, self.flavor = d, flavor
        a = PAL[pal_i][1]
        self.name = PAL[pal_i][0]
        if flavor == 0:  # 순백 바탕
            self.bg, self.fg, self.sub, self.line = WHITE, INK, "#5F6672", "#E6E3DC"
            self.acc = clear(a, self.bg, 2.6)
            self.panel = settle(a)[0]
        elif flavor == 1:  # 파우더 톤 바탕(연하고 부드러운 색)
            h, _, sat = _hls(a)
            self.bg = _hex(h, .88, min(max(sat, .25), .5))
            self.fg, self.sub, self.line = INK, mix(INK, self.bg, .38), mix(self.bg, INK, .13)
            self.acc = clear(a, self.bg, 3.0)
            self.panel = settle(a)[0]
        elif flavor == 2:  # 중간 깊이의 보석색 바탕(검정·원색 아님)
            self.bg, ink_on = settle(a)
            if ink_on:
                self.fg, self.sub = INK, mix(INK, self.bg, .3)
                self.acc = mix(self.bg, INK, .62)
                self.line = mix(self.bg, INK, .18)
                self.panel = mix(self.bg, WHITE, .4)
            else:
                self.fg = WHITE
                self.sub = mix(WHITE, self.bg, .22)
                self.acc = mix(a, WHITE, .6) if contrast(mix(a, WHITE, .6), self.bg) >= 2.2 else mix(self.bg, WHITE, .6)
                self.line = mix(self.bg, WHITE, .26)
                self.panel = mix(self.bg, WHITE, .14)
        elif flavor == 3:  # 아이보리 펄 바탕
            self.bg, self.fg, self.sub, self.line = "#F7F4EE", INK, "#605C55", "#E2DDD2"
            self.acc = clear(a, self.bg, 2.6)
            self.panel = settle(a)[0]
        else:  # 맑은 연한 틴트 바탕
            self.bg, self.fg = mix(a, WHITE, .88), INK
            self.sub, self.line = mix(INK, a, .34), mix(a, WHITE, .66)
            self.acc = clear(a, self.bg, 2.6)
            self.panel = settle(a)[0]
        pa = PAL[partner if partner is not None else (pal_i + 7) % 50][1]
        dark = flavor == 2 and self.fg == WHITE
        self.acc2 = lively(pa, 3.2, self.bg) if dark else clear(pa, self.bg, 2.6)  # 반대 면의 대표색 — 두 번째 포인트
        self.link = lively(pa, 4.0, self.bg) if dark else clear(pa, self.bg, 3.2)  # 같은 색을 글자(회사명·항목 이름)에도 한 곳 씁니다
        self.on = WHITE if contrast(WHITE, self.acc) >= contrast(INK, self.acc) else INK  # 포인트색 위 글자(대비가 큰 쪽)
        self.onp = WHITE if contrast(WHITE, self.panel) >= contrast(INK, self.panel) else INK
        self.deco = mix(self.bg, WHITE, .1) if dark else mix(self.bg, self.acc, .12)
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
    return "A"  # 로고 자리 표시(회사 이름의 첫 글자를 쓰면 '샵'·'상'처럼 어색해서 알파벳으로 둡니다)


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
    return T(x, y, w, c.d["company"], 6.5, color or c.link, True, align, spacing=2.2)


# ───────── 앞면 12종
def f_grid(c):
    return [frame(c), rect(L, 70, 22, 22, c.acc), co(c, L + 40, 72, 420), hl(L, 830, 124, c.line),
            *name_title(c, L, 268), vl(500, 262, 430, c.line), *rows(c, 540, 284, 40, 6.5, 250, 84), *ticks(c, 26)[:0]]


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
    return [vl(340, 70, 430, c.line), rect(337, 70, 6, 56, c.acc), T(L, 70, 250, d["company"], 5.4, c.sub, True, spacing=1.4), ring(L + 40, 238, 34, c.acc, 1.4), T(L, 204, 80, mono(c), 9, c.acc if c.flavor != 2 else c.fg, True, "c", anchor="m", h=70),
            *name_title(c, 390, 120), hl(390, 830, 262, c.line), *rows(c, 390, 290, 36, 6.5, 290, 92)]


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
        items.append(("INFO", d["hours"]))
    if "web" in rows_:
        items.append((d["web"][0], d["web"][1]))
    out = []
    for i, (lab, val) in enumerate(items):
        yy = y + i * pitch
        out += [T(x, yy + 3, 110, lab, 4.8, c.sub, True, spacing=1.4), T(x + 110, yy, w - 110, val, 6.4, c.fg)]
    return out


def lab(c, x, y, w=300, color=None, align="l"):
    return T(x, y, w, c.d["svc_label"].upper() if False else c.d["svc_label"], 5.2, color or c.link, True, align, spacing=2.4)


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
    out += [vl(620, 96, 420, c.line), T(660, 110, 180, "INFO", 4.8, c.sub, True, spacing=1.4), T(660, 142, 200, d["hours"], 6.2, c.fg),
            T(660, 232, 180, d["web"][0], 4.8, c.sub, True, spacing=1.4), T(660, 264, 190, d["web"][1], 6.2, c.fg), rect(660, 340, 66, 66, stroke=c.sub, sw=1.2, dash=True), T(660, 340, 66, "QR", 5, c.sub, True, "c", anchor="m", h=66)]
    return out


def b_solid(c):  # 원색 전면 + 안쪽 테두리
    d = c.d
    out = [rect(0, 0, 900, 500, c.panel), rect(30, 30, 840, 440, stroke=c.onp, sw=1.0, op=.5), lab(c, 80, 78, 400, c.onp)]
    for i, s in enumerate(d["services"]):
        out += [T(80, 130 + i * 62, 520, s, 9.5, c.onp, True, h=60), hl(80, 560, 130 + i * 62 + 56, c.onp, 1.0)]
    out += [T(630, 130, 240, "INFO", 4.8, c.onp, True, spacing=1.4, op=.75), T(630, 160, 240, d["hours"], 6.2, c.onp, True), T(630, 250, 240, d["web"][0], 4.8, c.onp, True, spacing=1.4, op=.75), T(630, 280, 240, d["web"][1], 6.2, c.onp, True),
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


def b_dark(c):  # 번호 + 업무
    d = c.d
    out = [rect(0, 0, 900, 8, c.acc), lab(c, L, 62)]
    for i, s in enumerate(d["services"]):
        out += [T(L, 138 + i * 74, 100, f"{i + 1:02d}", 6.4, c.acc if c.flavor != 2 else c.fg, True, spacing=1.2, h=40), T(L + 90, 132 + i * 74, 460, s, 8, c.fg, True, h=50)]
    out += [vl(620, 118, 420, c.line), T(660, 118, 180, "INFO", 4.8, c.sub, True, spacing=1.4), T(660, 150, 200, d["hours"], 6.2, c.fg), T(660, 250, 180, d["web"][0], 4.8, c.sub, True, spacing=1.4), T(660, 282, 190, d["web"][1], 6.2, c.fg),
            T(640, 410, 240, d["company"], 5.0, c.sub, True, spacing=1.0)]
    return out


BACKS = [b_list, b_row, b_grid, b_panel, b_chips, b_line, b_solid, b_inline, b_qr, b_dark]
assert len(BACKS) == NB
