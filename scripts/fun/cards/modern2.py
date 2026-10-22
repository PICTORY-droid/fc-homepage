"""명함 디자인 v3 확장 — 성격이 뚜렷한 레이아웃을 더해 '같은 디자인'이 없게 합니다.
앞면 29종(미니멀·모던·도도·당당·귀여운·재치·화려…) × 뒷면 22종 × 바탕 5종 × 색 50가지.
레이아웃마다 어울리는 바탕(FRONT_FLAVORS)이 정해져 있어, 귀여운 명함은 밝고 도도한 명함은 짙게 나옵니다."""
import math

from icons import arc_pts, icon
from modern import BACKS as BACKS1, FRONTS as FRONTS1, INK, L, T, WHITE, co, cols, contrast, hl, mix, name_title, ring, rows, vl
from scene import PT, ellipse, line, poly, rect, text


def dot(x, y, r, color, op=1):
    return ellipse(x, y, r, r, color, op=op)


def serif(x, y, w, s, size, color, bold=False, align="c", spacing=0, h=None, anchor="t"):
    return text(x, y, w, h or size * PT * 1.5, s, size, color, bold, align, "serif", spacing, anchor)


def icn(c, cx, cy, size, c1=None, c2=None):
    return icon(c.d["icon"], cx, cy, size, c1 or c.onp, c2 or mix(c.onp, c.panel, .5))


def wave(y0, amp, period, fill, op=1, phase=0):
    pts = [(x, y0 + amp * math.sin((x + phase) / period * 2 * math.pi)) for x in range(0, 901, 10)]
    return poly(pts + [(900, 500), (0, 500)], fill=fill, op=op)


def corner(x, y, dx, dy, ln, color, sw=2.2):
    return [line(x, y, x + dx * ln, y, color, sw), line(x, y, x, y + dy * ln, color, sw)]


def contact_line(c, x, y, w, align="l", size=6.2):
    d = c.d
    return [T(x, y, w, f'{d["tel"]}   ·   {d["mail"]}', size, c.fg, False, align), T(x, y + 36, w, d["addr"], size, c.sub, False, align)]


def bullets(c, x, y, pitch=40, size=6.5, w=420, color=None):
    d = c.d
    out = []
    for i, (lab, val) in enumerate([("TEL", d["tel"]), ("MAIL", d["mail"]), ("ADDR", d["addr"])]):
        out += [dot(x + 6, y + i * pitch + 18, 5, c.acc), T(x + 28, y + i * pitch, w, val, size, color or c.fg)]
    return out


# ───────── 앞면 새 17종
def f_poster(c):  # 당당 — 큰 이름 + 굵은 막대
    d = c.d
    pw = max(150, len(d["title"]) * 7 * PT + 70)
    return [rect(820, 0, 80, 500, c.panel), rect(820, 0, 80, 150, c.acc2), co(c, L, 64, 420),
            T(L, 110, 700, d["name"], 25, c.fg, True, spacing=1.0, h=120), rect(L, 262, pw, 48, c.acc, r=24),
            T(L, 262, pw, d["title"], 6.6, c.on, True, "c", anchor="m", spacing=.8, h=48), hl(L, 760, 352, c.line),
            *cols(c, L, 376, [240, 260, 260], 6.2)]


def f_serif(c):  # 도도 — 명조 + 이중 선 테두리
    d = c.d
    dia = poly([(450, 70), (462, 86), (450, 102), (438, 86)], fill=c.acc)
    return [rect(30, 30, 840, 440, stroke=c.acc, sw=1.4), rect(42, 42, 816, 416, stroke=c.line, sw=1.0), dia,
            serif(100, 128, 700, d["name"], 15, c.fg, True, "c", 8, 80), serif(100, 214, 700, d["title"], 7, c.sub, False, "c", 3), hl(410, 490, 276, c.acc, 1.6),
            T(100, 306, 700, d["company"], 5.8, c.acc, True, "c", spacing=3), *contact_line(c, 100, 372, 700, "c", 6.0)]


def f_cute(c):  # 귀여운 — 둥근 도형 + 웃는 얼굴 로고
    d = c.d
    pw = max(150, len(d["title"]) * 7 * PT + 66)
    face = [dot(L + 38, 106, 38, c.acc), dot(L + 26, 98, 5, c.on), dot(L + 50, 98, 5, c.on), poly(arc_pts(L + 38, 108, 15, 12, 20, 160, 10), stroke=c.on, sw=3.2)]
    return [dot(800, 70, 90, c.acc2, .28), dot(866, 180, 40, c.acc, .35), dot(730, 36, 18, c.acc, .55), dot(800, 400, 120, c.acc, .14), *face,
            T(L + 100, 76, 420, d["company"], 6.2, c.sub, True, spacing=1.6), T(L, 190, 500, d["name"], 14, c.fg, True, spacing=1.0, h=66),
            rect(L, 270, pw, 44, c.acc2, r=22), T(L, 270, pw, d["title"], 6.4, c.on if c.on != c.fg else c.fg, True, "c", anchor="m", h=44), *bullets(c, L, 342, 38, 6.4, 480)]


def f_wit(c):  # 재치 — 말풍선 인사
    d = c.d
    return [rect(L, 62, 330, 112, c.acc, r=28), poly([(L + 60, 172), (L + 112, 172), (L + 66, 220)], fill=c.acc), T(L, 62, 330, "한 줄 소개", 11, c.on, True, "c", anchor="m", h=112),
            dot(560, 110, 14, c.acc2), rect(610, 84, 40, 40, c.acc, r=6, rot=18), poly([(720, 70), (760, 140), (690, 140)], fill=c.line), dot(820, 96, 8, c.acc),
            T(L, 244, 500, d["name"], 13.5, c.fg, True, spacing=1.0, h=66), T(L, 314, 500, d["title"], 6.6, c.sub), co(c, L + 280, 318, 420, c.sub, "r"),
            hl(L, 830, 372, c.line), *cols(c, L, 392, [250, 280, 270], 6.0)]


def f_circles(c):  # 화려 — 겹친 반투명 원
    d = c.d
    return [dot(660, 240, 170, c.acc, .9), dot(776, 150, 118, c.acc2, .8), dot(790, 352, 96, c.fg, .12), ring(660, 240, 215, c.line, 1.4), dot(560, 420, 10, c.acc2),
            co(c, L, 70, 420), *name_title(c, L, 160), hl(L, 420, 300, c.line), *rows(c, L, 322, 36, 6.2, 300, 84)]


def f_diag(c):  # 당당 — 사선 분할
    d = c.d
    return [poly([(0, 0), (560, 0), (400, 500), (0, 500)], fill=c.panel), poly([(560, 0), (590, 0), (430, 500), (400, 500)], fill=c.acc2, op=.9),
            T(L, 70, 380, d["company"], 5.8, c.onp, True, spacing=2.2, op=.8), T(L, 170, 400, d["name"], 14, c.onp, True, spacing=1.0, h=66), T(L, 240, 400, d["title"], 6.8, c.onp, False, op=.85),
            *rows(c, 560, 300, 40, 6.0, 280, 78)]


def f_minimal(c):  # 미니멀 — 아주 작게, 큰 여백
    d = c.d
    return [dot(L + 8, 78, 7, c.acc), T(430, 66, 400, d["company"], 5.4, c.sub, True, "r", spacing=2.4), T(L, 352, 400, d["name"], 9.5, c.fg, True, spacing=.8, h=44),
            T(L, 402, 400, d["title"], 5.8, c.sub), T(430, 350, 400, d["tel"], 5.8, c.fg, False, "r"), T(430, 382, 400, d["mail"], 5.8, c.fg, False, "r"), T(430, 414, 400, d["addr"], 5.8, c.sub, False, "r")]


def f_ribbon(c):  # 띠 — 가운데 가로 띠에 직함
    d = c.d
    return [co(c, L, 64, 420), T(L, 110, 600, d["name"], 14, c.fg, True, spacing=1.0, h=66), rect(0, 214, 900, 92, c.panel),
            T(L, 214, 400, d["title"], 8, c.onp, True, anchor="m", spacing=1.2, h=92), T(430, 214, 400, f'{d["tel"]}', 7, c.onp, True, "r", anchor="m", h=92),
            T(L, 352, 760, d["mail"], 6.4, c.fg), T(L, 396, 760, d["addr"], 6.4, c.sub)]


def f_icon(c):  # 업종 아이콘을 큰 원 안에
    d = c.d
    return [dot(690, 250, 140, c.panel), ring(690, 250, 172, c.line, 1.2), *icn(c, 690, 250, 130), co(c, L, 70, 420), *name_title(c, L, 176), hl(L, 420, 318, c.line), *rows(c, L, 338, 34, 6.2, 300, 84)]


def f_wave(c):  # 파도 — 아래쪽 물결 면
    d = c.d
    return [wave(366, 16, 420, c.acc2, .55, 0), wave(384, 14, 360, c.panel, 1, 120), co(c, L, 60, 420), *name_title(c, L, 120),
            T(L, 420, 260, d["tel"], 6.2, c.onp, True), T(330, 420, 330, d["mail"], 6.2, c.onp, True), T(660, 420, 170, "", 6, c.onp)]


def f_pattern(c):  # 화려 — 오른쪽 점 무늬
    d = c.d
    dots = []
    for i in range(6):
        for j in range(9):
            col = c.acc if (i + j) % 3 == 0 else (c.acc2 if (i * 2 + j) % 4 == 0 else c.line)
            dots.append(dot(640 + i * 44, 50 + j * 50, 7 if col != c.line else 4.5, col))
    return [*dots, co(c, L, 70, 420), *name_title(c, L, 170), hl(L, 520, 312, c.line), *rows(c, L, 332, 34, 6.2, 340, 84)]


def f_bracket(c):  # 모던 — 모서리 괄호
    d = c.d
    out = [*corner(40, 40, 1, 1, 46, c.acc), *corner(860, 40, -1, 1, 46, c.acc), *corner(40, 460, 1, -1, 46, c.acc), *corner(860, 460, -1, -1, 46, c.acc)]
    return out + [T(100, 84, 700, d["company"], 5.8, c.sub, True, "c", spacing=3), T(100, 140, 700, d["name"], 13.5, c.fg, True, "c", spacing=1.2, h=66), T(100, 210, 700, d["title"], 6.8, c.sub, False, "c"),
                  hl(420, 480, 276, c.acc, 2), *contact_line(c, 100, 318, 700, "c", 6.2)]


def f_tag(c):  # 재치 — 네임택
    d = c.d
    return [rect(580, 36, 280, 428, c.panel, r=30), dot(720, 84, 17, c.bg), ring(720, 84, 25, c.onp, 1.4), *icn(c, 720, 220, 110), T(580, 330, 280, d["title"], 7.4, c.onp, True, "c", spacing=1.0),
            T(580, 384, 280, d["company"], 5.2, c.onp, True, "c", spacing=2, op=.75), T(L, 120, 440, d["name"], 14, c.fg, True, spacing=1.0, h=66), hl(L, 330, 214, c.acc, 2.2), *rows(c, L, 252, 40, 6.2, 280, 84)]


def f_stripes(c):  # 화려 — 세로 줄무늬
    d = c.d
    st = []
    for i in range(10):
        st.append(rect(i * 17, 0, 10 if i % 3 else 14, 500, c.acc if i % 2 == 0 else c.acc2, op=.9 if i % 2 == 0 else .7))
    return [*st, co(c, 230, 70, 560), *[e for e in name_title(c, 230, 170)], hl(230, 830, 312, c.line), *rows(c, 230, 332, 36, 6.2, 360, 84)]


def f_arch(c):  # 도도·모던 — 아치형 창
    d = c.d
    return [rect(600, 160, 200, 340, c.panel), poly(arc_pts(700, 160, 100, 100, 180, 360, 24), fill=c.panel), *icn(c, 700, 290, 100), co(c, L, 70, 420),
            *name_title(c, L, 176), hl(L, 420, 318, c.line), *rows(c, L, 338, 34, 6.2, 300, 84)]


def f_split(c):  # 모던 — 반반 분할
    d = c.d
    return [rect(0, 0, 450, 500, c.panel), ring(450, 250, 90, c.onp, 1.0), T(L, 70, 330, d["company"], 5.6, c.onp, True, spacing=2.2, op=.8), T(L, 190, 340, d["name"], 13.5, c.onp, True, spacing=1.0, h=66),
            T(L, 260, 340, d["title"], 6.6, c.onp, False, op=.85), *rows(c, 520, 160, 50, 6.2, 300, 84), vl(500, 150, 350, c.line)]


def f_frame2(c):  # 굵은 테두리
    d = c.d
    return [rect(26, 26, 848, 448, stroke=c.acc, sw=7), co(c, 76, 76, 420), T(76, 170, 600, d["name"], 14, c.fg, True, spacing=1.0, h=66), T(76, 240, 600, d["title"], 6.8, c.sub),
            rect(76, 316, 40, 5, c.acc2), *cols(c, 76, 350, [250, 280, 250], 6.0)]


def f_initial(c):  # 큰 머리글자 — 이름 첫 글자를 크게
    d = c.d
    return [T(L, 20, 360, d["name"][:1], 60, c.panel, True, h=280, op=.95), co(c, 470, 74, 360, None, "r"), T(L, 300, 700, d["name"], 12, c.fg, True, spacing=1.0, h=56), T(L, 358, 700, d["title"], 6.4, c.sub),
            hl(L, 830, 408, c.line), T(L, 424, 760, f'{d["tel"]}   ·   {d["mail"]}', 5.8, c.fg)]


FRONTS_NEW = [f_poster, f_serif, f_cute, f_wit, f_circles, f_diag, f_minimal, f_ribbon, f_icon, f_wave, f_pattern, f_bracket, f_tag, f_stripes, f_arch, f_split, f_frame2, f_initial]
# ───────── 뒷면 새 12종
def svc_list(c, x, y, items, size=7.4, pitch=64, color=None, mark="dot", w=420):
    out = []
    for i, s in enumerate(items):
        yy = y + i * pitch
        if mark == "dot":
            out += [dot(x + 7, yy + 22, 6, c.acc if i % 2 == 0 else c.acc2)]
            out.append(T(x + 30, yy, w, s, size, color or c.fg, True, h=48))
        else:
            out.append(T(x, yy, w, s, size, color or c.fg, True, h=48))
    return out


def lab2(c, x, y, w=420, color=None, align="l"):
    return T(x, y, w, c.d["svc_label"], 5.2, color or c.link, True, align, spacing=2.4)


def b_poster(c):  # 큰 글자 목록
    d = c.d
    out = [rect(0, 0, 14, 500, c.acc), lab2(c, 70, 58)]
    for i, s in enumerate(d["services"]):
        out.append(T(70, 100 + i * 82, 560, s, 14, c.fg if i % 2 == 0 else c.acc, True, h=78))
    out += [T(660, 380, 200, d["hours"], 5.6, c.sub, False, "r"), T(660, 416, 200, d["web"][1], 5.6, c.sub, False, "r")]
    return out


def b_arch(c):
    d = c.d
    return [rect(60, 150, 190, 350, c.panel), poly(arc_pts(155, 150, 95, 95, 180, 360, 24), fill=c.panel), *icn(c, 155, 290, 96), lab2(c, 330, 70), *svc_list(c, 330, 120, d["services"], 7.4, 62, None, "dot"),
            hl(330, 840, 400, c.line), T(330, 420, 520, f'{d["hours"]}     {d["web"][1]}', 5.8, c.sub)]


def b_cutechips(c):
    d = c.d
    out = [dot(110, 90, 24, c.acc), dot(100, 84, 3.5, c.on), dot(120, 84, 3.5, c.on), poly(arc_pts(110, 92, 11, 9, 20, 160, 8), stroke=c.on, sw=2.6), lab2(c, 160, 82)]
    cx, cy = L, 170
    for i, s in enumerate(d["services"]):
        w = len(s) * 7 * PT * .98 + 56
        if cx + w > 830:
            cx, cy = L, cy + 78
        col = c.acc if i % 2 == 0 else c.acc2
        out += [rect(cx, cy, w, 58, col, r=29), T(cx, cy, w, s, 7, c.on if col == c.acc else (WHITE_OR(c, col)), True, "c", anchor="m", h=58)]
        cx += w + 18
    out += [T(L, 400, 760, f'{d["hours"]}   ·   {d["web"][1]}', 5.8, c.sub)]
    return out


def WHITE_OR(c, col):
    return WHITE if contrast(WHITE, col) >= 3.2 else INK


def b_serif(c):
    d = c.d
    return [rect(30, 30, 840, 440, stroke=c.acc, sw=1.4), rect(42, 42, 816, 416, stroke=c.line, sw=1.0), serif(100, 78, 700, d["svc_label"], 5.6, c.acc, True, "c", 4),
            hl(420, 480, 120, c.acc, 1.4), serif(100, 160, 700, "  ·  ".join(d["services"]), 8.6, c.fg, True, "c", 1, 120), hl(420, 480, 326, c.acc, 1.4),
            serif(100, 350, 700, d["hours"], 5.8, c.sub, False, "c", 1), serif(100, 388, 700, f'{d["web"][1]}', 5.8, c.sub, False, "c", 1)]


def b_cards3(c):
    d = c.d
    out = [lab2(c, L, 56)]
    for i, s in enumerate(d["services"]):
        col, row = i % 2, i // 2
        x, y = L + col * 390, 110 + row * 130
        out += [rect(x, y, 360, 106, c.deco if c.flavor != 2 else c.panel, stroke=c.line, sw=1.0, r=18), dot(x + 34, y + 53, 8, c.acc if (i + row) % 2 == 0 else c.acc2), T(x + 60, y, 290, s, 7.2, c.fg, True, anchor="m", h=106)]
    out += [T(L, 410, 760, f'{d["hours"]}   ·   {d["web"][1]}', 5.8, c.sub)]
    return out


def b_stripe(c):
    d = c.d
    st = [rect(i * 17, 0, 10 if i % 3 else 14, 500, c.acc if i % 2 == 0 else c.acc2, op=.9 if i % 2 == 0 else .7) for i in range(10)]
    return [*st, lab2(c, 230, 70), *svc_list(c, 230, 120, d["services"], 7.4, 62, None, "dot"), hl(230, 830, 400, c.line), T(230, 420, 600, f'{d["hours"]}     {d["web"][1]}', 5.8, c.sub)]


def b_bubble(c):
    d = c.d
    out = [rect(L, 60, 540, 300, c.panel, r=36), poly([(L + 80, 358), (L + 140, 358), (L + 90, 420)], fill=c.panel), T(L + 40, 84, 460, d["svc_label"], 5.2, c.onp, True, spacing=2.4, op=.8)]
    for i, s in enumerate(d["services"]):
        out.append(T(L + 40, 130 + i * 56, 470, s, 7.4, c.onp, True, h=50))
    out += [dot(690, 120, 14, c.acc2), rect(740, 90, 40, 40, c.acc, r=6, rot=18), T(660, 300, 190, d["hours"], 5.6, c.fg, False, "r"), T(660, 336, 190, d["web"][1], 5.6, c.sub, False, "r")]
    return out


def b_hours(c):  # 영업시간을 크게
    d = c.d
    out = [lab2(c, L, 58), T(L, 100, 760, d["hours"], 13, c.fg, True, h=72), hl(L, 830, 214, c.acc, 2.4)]
    cx = L
    for i, s in enumerate(d["services"]):
        w = len(s) * 6.4 * PT * .98 + 44
        out += [rect(cx, 262, w, 50, stroke=c.sub, sw=1.1, r=25), T(cx, 262, w, s, 6.4, c.fg, False, "c", anchor="m", h=50)]
        cx += w + 14
    out += [T(L, 380, 760, f'{d["web"][0]}   {d["web"][1]}', 6, c.sub), co(c, L, 420, 760)]
    return out


def b_pattern(c):
    d = c.d
    dots = [dot(80 + i * 40, 60 + j * 46, 6 if (i + j) % 3 == 0 else 3.5, c.acc if (i + j) % 3 == 0 else (c.acc2 if (i * 2 + j) % 4 == 0 else c.line)) for i in range(6) for j in range(9)]
    return [*dots, lab2(c, 390, 70), *svc_list(c, 390, 120, d["services"], 7.2, 62, None, "dot"), hl(390, 840, 400, c.line), T(390, 420, 450, f'{d["hours"]}', 5.8, c.sub)]


def b_ledger(c):  # 메뉴판처럼 번호·점선
    d = c.d
    out = [lab2(c, L, 56, 700, None, "c"), hl(L, 830, 100, c.fg, 1.2)]
    for i, s in enumerate(d["services"]):
        y = 124 + i * 66
        out += [T(L, y, 100, f"{i + 1:02d}", 6, c.acc, True), T(L + 90, y - 4, 500, s, 7.4, c.fg, True, h=52), line(L + 90, y + 54, 830, y + 54, c.line, 1.0, dash=True)]
    out += [T(L, 424, 380, d["hours"], 5.6, c.sub), T(450, 424, 380, d["web"][1], 5.6, c.sub, False, "r")]
    return out


def b_wave(c):
    d = c.d
    out = [rect(0, 0, 900, 120, c.panel), poly([(x, 120 + 18 * math.sin(x / 150 * 2 * math.pi)) for x in range(0, 901, 10)] + [(900, 0), (0, 0)], fill=c.panel),
           T(L, 40, 700, d["svc_label"], 5.4, c.onp, True, spacing=2.4)]
    for i, s in enumerate(d["services"]):
        out += [dot(L + 7, 190 + i * 52 + 22, 6, c.acc if i % 2 == 0 else c.acc2), T(L + 30, 190 + i * 52, 420, s, 7.2, c.fg, True, h=48)]
    out += [T(560, 190, 270, "INFO", 4.8, c.sub, True, spacing=1.4), T(560, 222, 270, d["hours"], 6.2, c.fg), T(560, 300, 270, d["web"][0], 4.8, c.sub, True, spacing=1.4), T(560, 332, 270, d["web"][1], 6.2, c.fg)]
    return out


def b_corner(c):
    d = c.d
    out = [*corner(40, 40, 1, 1, 46, c.acc), *corner(860, 40, -1, 1, 46, c.acc), *corner(40, 460, 1, -1, 46, c.acc), *corner(860, 460, -1, -1, 46, c.acc),
           lab2(c, 100, 90, 700, None, "c"), hl(420, 480, 130, c.acc, 2)]
    for i, s in enumerate(d["services"]):
        out.append(T(100, 160 + i * 52, 700, s, 7.4, c.fg, True, "c", h=48))
    out += [T(100, 400, 700, f'{d["hours"]}   ·   {d["web"][1]}', 5.8, c.sub, False, "c")]
    return out


def b_split(c):
    d = c.d
    out = [rect(0, 0, 340, 500, c.panel), T(60, 70, 240, d["svc_label"], 6.4, c.onp, True, spacing=1.4)]
    out += [*icn(c, 170, 290, 110), T(60, 420, 240, d["company"], 5.2, c.onp, True, spacing=1.6, op=.8)]
    for i, s in enumerate(d["services"]):
        out += [T(400, 90 + i * 70, 440, s, 7.6, c.fg, True, h=60), hl(400, 840, 90 + i * 70 + 62, c.line)]
    out += [T(400, 420, 440, f'{d["hours"]}   ·   {d["web"][1]}', 5.8, c.sub)]
    return out


def b_numbers(c):  # 큰 번호
    d = c.d
    out = [lab2(c, L, 56)]
    for i, s in enumerate(d["services"]):
        col, row = i % 2, i // 2
        x, y = L + col * 390, 108 + row * 150
        out += [T(x, y, 160, f"{i + 1:02d}", 18, c.acc if (i + row) % 2 == 0 else c.acc2, True, h=90), T(x, y + 90, 360, s, 7, c.fg, True, h=50)]
    out += [T(L, 424, 760, f'{d["hours"]}   ·   {d["web"][1]}', 5.8, c.sub)]
    return out


def b_ring(c):  # 큰 원 + 목록
    d = c.d
    return [dot(160, 250, 130, c.panel), ring(160, 250, 160, c.line, 1.2), *icn(c, 160, 250, 120), lab2(c, 380, 70), *svc_list(c, 380, 118, d["services"], 7.4, 62, None, "dot"), hl(380, 840, 400, c.line), T(380, 420, 460, f'{d["hours"]}     {d["web"][1]}', 5.8, c.sub)]


BACKS_NEW = [b_poster, b_arch, b_cutechips, b_serif, b_cards3, b_stripe, b_bubble, b_hours, b_pattern, b_ledger, b_wave, b_corner, b_split, b_numbers, b_ring]

FRONTS = FRONTS1 + FRONTS_NEW
BACKS = BACKS1 + BACKS_NEW
NF, NB = len(FRONTS), len(BACKS)

# 레이아웃의 성격에 맞는 바탕 — 0 흰색 · 1 먹색 · 2 짙은 단색 · 3 스톤 · 4 연한 틴트
_all = (0, 1, 2, 3, 4)
FRONT_FLAVORS = {i: _all for i in range(NF)}
for _f, _fl in {f_cute: (0, 3, 4), f_wit: (0, 3, 4), f_wave: (0, 3, 4), f_minimal: (0, 3), f_serif: (0, 1, 2), f_bracket: (0, 1, 2, 3), f_poster: (0, 3, 4, 1), f_tag: (0, 3, 4, 1),
                f_circles: (0, 3, 4), f_pattern: (0, 3, 4), f_stripes: (0, 3, 4), f_initial: (0, 3, 4, 1)}.items():
    FRONT_FLAVORS[FRONTS.index(_f)] = _fl
assert NF == 30 and NB == 25, (NF, NB)
