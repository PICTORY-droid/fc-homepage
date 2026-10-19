"""PPT 디자인 언어 — 팔레트(선명한 파스텔), 표지 12구도, 본문 6틀, 장식 21종, 변형(좌우·바탕·톤).

한 파일의 디자인은 (테마 i, 항목 k)로 정해집니다.
- 구도(표지) = (i + 5k) % 12 → 같은 항목 안에서 같은 구도는 4~5번뿐이고, 그때마다 '변형'(좌우·바탕·톤)이 서로 다릅니다.
- 같은 테마도 항목마다 구도가 모두 달라지고(5가 12와 서로소), 색·장식·글꼴은 테마마다 다릅니다.
"""
import colorsys

import pack_kit as pk
from pptx.enum.shapes import MSO_SHAPE as SH

SEASON_TONE = {"봄": (0.62, 0.935, 0.60), "여름": (0.70, 0.925, 0.64), "가을": (0.50, 0.925, 0.60), "겨울": (0.42, 0.945, 0.62)}
ACC_OFF = [180, 150, 210, 30, -40, 120, 200, -30]  # 포인트 색이 테마 색에서 얼마나 떨어질지(보색·유사색 섞어서)
FONTS = [("Georgia", "맑은 고딕"), ("Palatino Linotype", "바탕"), ("Century Gothic", "맑은 고딕"), ("Garamond", "바탕"),
         ("Trebuchet MS", "맑은 고딕"), ("Constantia", "맑은 고딕"), ("Bookman Old Style", "바탕"), ("Candara", "맑은 고딕"),
         ("Segoe UI", "맑은 고딕"), ("Tw Cen MT", "맑은 고딕")]
PATTERNS = ["pct5", "dotGrid", "smGrid", "pct10", "smConfetti", "wave"]
# 변형 5가지: (좌우 반전, 톤, 바탕)  — 같은 구도 안에서 서로 달라야 하므로 중복이 없다
MODS = [(0, "light", "flat"), (1, "tint", "flat"), (0, "light", "grad"), (1, "dark", "flat"), (0, "tint", "pattern")]
SEASON_EN = {"봄": "SPRING", "여름": "SUMMER", "가을": "AUTUMN", "겨울": "WINTER"}


def _hx(h, s, l):
    r, g, b = colorsys.hls_to_rgb((h % 360) / 360.0, max(0, min(1, l)), max(0, min(1, s)))
    return "#%02X%02X%02X" % (round(r * 255), round(g * 255), round(b * 255))


def palette(i):
    name, h, _, _ = pk.THEMES[i]
    season = pk.season_of(i)
    ss, bl, ml = SEASON_TONE[season]
    ao = ACC_OFF[(i * 5 + i // 8) % len(ACC_OFF)]
    return {
        "name": name, "season": season, "hue": h,
        "ink": "#2B2724", "bg": _hx(h, ss, bl), "main": _hx(h, ss * 0.85 + 0.04, ml + 0.05), "accent": _hx(h + ao, ss * 0.62, ml + 0.03),
        "deep": _hx(h + ao / 3, 0.26, 0.31), "deep2": _hx(h, 0.28, 0.24), "soft": _hx(h, ss + 0.06, 0.87),
        "gold": _hx(h + 62, 0.50, 0.76), "sky": _hx(h - 52, 0.45, 0.82),
    }


def short(name):
    """테마 이름 → 세로 글씨용 짧은 낱말 (예: 매화 피는 아침 → 매화)"""
    w = name.split()[0]
    return w[:4]


ORN_POOL = [[13, 14, 15, 11, 5, 16, 12, 9],      # 발표: 도형·기하
            [20, 8, 0, 3, 7, 2, 19, 10],         # 가족: 새싹·잎·해·집 불빛
            [6, 5, 10, 18, 16, 3, 0, 9],         # 돌잔치: 별·리본·색종이
            [3, 18, 7, 9, 5, 8, 1, 17],          # 결혼: 하트·리본·꽃·반지
            [14, 13, 15, 9, 16, 11, 12, 5],      # 점검: 육각·체크 느낌의 도형
            [2, 0, 12, 4, 17, 10, 6, 1]]         # 카드뉴스: 구름·해·물결·눈꽃


def design_of(i, k):
    fam = (i + 5 * k) % 12
    mirror, tone, bgt = MODS[(i // 12 + (i % 12) * 2) % 5]  # 같은 구도(i%12 같음)끼리는 i//12 가 달라 변형이 겹치지 않고, 계절별로 톤이 쏠리지 않게 섞음
    return {"fam": fam, "mir": mirror, "tone": tone, "bgt": bgt, "cf": (fam + k + i // 12) % 6, "font": FONTS[(i * 3 + k * 7) % len(FONTS)],
            "orn": ORN_POOL[k][i % 8], "ornv": (i // 8) % 3, "pat": PATTERNS[(i + k) % len(PATTERNS)], "cs": (i + k) % 5, "bs": (i // 5 + k) % 5, "tl": (i + k) % 2, "pf": (i + 2 * k) % 3,
            "trans": (i + k) % 8, "anim": (i + 2 * k) % 3}


def bg_spec(tone, bgt, pat, light_only=False):
    if tone == "dark" and not light_only:
        return "deep2"
    if tone == "tint" or (tone == "dark" and light_only):
        base = "soft"
    else:
        base = "pale"
    if bgt == "pattern":
        return ("patt", pat, "mist" if base == "pale" else "tint", base)
    if bgt == "grad":
        return ("grad", base, "atint", 35)
    return base


# ───────────────────────── 장식 21종
def orn(d, kind, cx, cy, s, c1="main", c2="accent", alpha=None, name=None):
    k = kind % 21
    S = lambda shp, x, y, w, h, fill=c1, **kw: d.shape(shp, x, y, w, h, fill=fill, alpha=alpha, **kw)
    with d.group(name or "장식"):
        if k == 0:
            S(SH.SUN, cx - s / 2, cy - s / 2, s, s)
        elif k == 1:
            S(SH.MOON, cx - s * .3, cy - s / 2, s * .6, s)
        elif k == 2:
            S(SH.CLOUD, cx - s * .7, cy - s * .45, s * 1.4, s * .9)
        elif k == 3:
            S(SH.HEART, cx - s / 2, cy - s * .45, s, s * .9)
        elif k == 4:
            S(SH.TEAR, cx - s / 2, cy - s / 2, s, s, rot=-45)
        elif k == 5:
            S(SH.STAR_4_POINT, cx - s / 2, cy - s / 2, s, s)
        elif k == 6:
            S(SH.STAR_5_POINT, cx - s / 2, cy - s / 2, s, s)
        elif k == 7:
            import math
            for a in range(5):
                th = a * 72
                px, py = cx + s * .27 * math.sin(math.radians(th)), cy - s * .27 * math.cos(math.radians(th))
                S(SH.OVAL, px - s * .17, py - s * .25, s * .34, s * .5, rot=th)
            S(SH.OVAL, cx - s * .11, cy - s * .11, s * .22, s * .22, fill=c2)
        elif k == 8:
            S(SH.ROUND_2_DIAG_RECTANGLE, cx - s / 2, cy - s / 2, s, s, adj={"adj1": 50000, "adj2": 0})
        elif k == 9:
            S(SH.DONUT, cx - s / 2, cy - s / 2, s, s, adj={"adj": 22000})
        elif k == 10:
            for a, (dx, r) in enumerate(((-.3, .3), (0.05, .22), (.33, .14))):
                S(SH.OVAL, cx + dx * s - r * s / 2 * 1.4, cy - r * s / 2 * 1.4, r * s * 1.4, r * s * 1.4, fill=c1 if a != 1 else c2)
        elif k == 11:
            S(SH.BLOCK_ARC, cx - s / 2, cy - s / 2, s, s, adj={"adj1": 10800000, "adj2": 0, "adj3": 22000})
        elif k == 12:
            S(SH.WAVE, cx - s * .6, cy - s * .22, s * 1.2, s * .44)
        elif k == 13:
            S(SH.DIAMOND, cx - s * .4, cy - s / 2, s * .8, s)
        elif k == 14:
            S(SH.HEXAGON, cx - s / 2, cy - s * .43, s, s * .86)
        elif k == 15:
            S(SH.MATH_PLUS, cx - s / 2, cy - s / 2, s, s, adj={"adj1": 24000})
        elif k == 16:
            S(SH.PIE, cx - s / 2, cy - s / 2, s, s)
        elif k == 17:
            for a in (0, 60, 120):
                d.line(cx - s / 2 * __import__("math").cos(__import__("math").radians(a)), cy - s / 2 * __import__("math").sin(__import__("math").radians(a)),
                       cx + s / 2 * __import__("math").cos(__import__("math").radians(a)), cy + s / 2 * __import__("math").sin(__import__("math").radians(a)), color=c1, lw=2)
            S(SH.OVAL, cx - s * .1, cy - s * .1, s * .2, s * .2, fill=c2)
        elif k == 18:
            S(SH.ISOSCELES_TRIANGLE, cx - s * .56, cy - s * .22, s * .5, s * .44, rot=90)
            S(SH.ISOSCELES_TRIANGLE, cx + s * .06, cy - s * .22, s * .5, s * .44, rot=-90)
            S(SH.OVAL, cx - s * .1, cy - s * .1, s * .2, s * .2, fill=c2)
        elif k == 19:
            S(SH.ROUNDED_RECTANGLE, cx - s * .26, cy - s * .38, s * .52, s * .76, adj={"adj": 30000})
            S(SH.RECTANGLE, cx - s * .14, cy - s * .5, s * .28, s * .1, fill=c2)
            S(SH.RECTANGLE, cx - s * .14, cy + s * .4, s * .28, s * .1, fill=c2)
        else:
            d.line(cx, cy + s * .5, cx, cy - s * .1, color=c2, lw=2)
            S(SH.ROUND_2_DIAG_RECTANGLE, cx - s * .5, cy - s * .35, s * .5, s * .5, adj={"adj1": 50000, "adj2": 0})
            S(SH.ROUND_2_DIAG_RECTANGLE, cx, cy - s * .5, s * .5, s * .5, adj={"adj1": 50000, "adj2": 0}, flip="h")


def draw_orn(d, cx, cy, s, alpha=None, bigger=1.0):
    c1, c2 = [("main", "accent"), ("accent", "main"), ("soft", "main")][d.cfg["ornv"] % 3]
    orn(d, d.cfg["orn"], cx, cy, s * bigger, c1, c2, alpha=alpha, name="테마 장식")


# ───────────────────────── 표지·마무리 (12구도)
def _stack(d, x, y, w, align, tone, th, tsize, closing, extra_at=None, label_dy=0.0, sub_h=0.8, vword=None):
    tc = "white" if tone == "dark" else "deep"
    sc = "tint" if tone == "dark" else "ink"
    mc = "soft" if tone == "dark" else "mute"
    lc = "soft" if tone == "dark" else "deep"
    d.ph("body", 10, "영문 라벨", x, y, w, 0.34, sz=11, color=lc, algn=align, spc=450, caps=True, prompt="LABEL", anchor="ctr")
    d.ph("title" if closing else "ctrTitle", 0, "제목", x, y + 0.42, w, th, sz=tsize, color=tc, bold=True, algn=align, anchor="ctr", major=True, lnspc=104, prompt="제목을 입력하세요")
    d.ph("sub", 1, "한 줄 문구", x, y + 0.5 + th, w, sub_h, sz=16 if d.wide else 14, color=sc, algn=align, anchor="t", prompt="한 줄 문구")
    ex = extra_at or (x, y + 0.55 + th + sub_h, w, 0.9)
    d.ph("body", 11, "안내 문구", ex[0], ex[1], ex[2], ex[3], sz=12 if d.wide else 11, color=mc, algn=align, anchor="t", prompt="안내 문구")


def _vword(d, x, y, w, h, color, sz, algn="ctr", alpha=None):
    d.ph("body", 12, "세로 글씨", x, y, w, h, sz=sz, color=color, algn=algn, vert="wordArtVert", spc=600, major=True, anchor="ctr", prompt="세로 글씨")


def cover_layout(d, closing=False):
    cfg = d.cfg
    f, mir = cfg["fam"], cfg["mir"]
    tone = cfg["tone"]
    if closing:
        tone = {"dark": "light", "light": "dark", "tint": "dark"}[tone]
    bgt = cfg["bgt"] if not closing else {"flat": "grad", "grad": "pattern", "pattern": "flat"}[cfg["bgt"]]
    bg = bg_spec(tone, bgt, cfg["pat"])
    key = "closing" if closing else "cover"
    d.layout_begin(key, bg)
    W, H = d.W, d.H
    dark = tone == "dark"
    wide = d.wide
    ts = 40 if wide else 30
    th = 1.75 if wide else 1.45
    # 장식이 깔 바탕 색(흰/테마 색)은 톤에 따라 달라진다
    card = "deep" if dark else "white"
    FAM[f](d, W, H, mir, tone, wide, ts, th, closing, card)
    d.layout_end()


def _stack_wide(d, W, H, x, w, align, tone, ts, th, closing, y=None, **kw):
    y = y if y is not None else (H - 3.9) / 2
    _stack(d, x, y, w, align, tone, th, ts, closing, **kw)


def f_envelope(d, W, H, mir, tone, wide, ts, th, closing, card):
    xc = W / 2
    cw = .5 * W if wide else .74 * W
    cy0 = .09 * H
    d.shape(SH.RECTANGLE, xc - cw / 2, cy0, cw, .72 * H, fill="white", shadow="lift", name="편지지")
    x0, x1 = xc - .32 * W if wide else .1 * W, xc + .32 * W if wide else .9 * W
    yt, yv, yb = .48 * H, .70 * H, .96 * H
    d.freeform([(x0, yt), (xc, yv), (x1, yt), (x1, yb), (x0, yb)], fill="soft", shadow="soft", name="봉투 앞면")
    d.line(x0, yt, xc, yv, "white", 1.5)
    d.line(x1, yt, xc, yv, "white", 1.5)
    d.shape(SH.STAR_12_POINT if mir else SH.OVAL, xc - .06 * H, yv - .06 * H, .12 * H, .12 * H, fill="accent", shadow="soft", name="봉인")
    d.shape(SH.HEART, xc - .022 * H, yv - .02 * H, .044 * H, .04 * H, fill="white", name="봉인 하트")
    tx, tw = xc - cw / 2 + .35, cw - .7
    _stack(d, tx, cy0 + .3, tw, "ctr", "light", th if wide else 1.2, ts, closing, extra_at=(x0 + .6, .81 * H, x1 - x0 - 1.2, .8), sub_h=.7)
    if tone == "dark":
        pass


def f_arch(d, W, H, mir, tone, wide, ts, th, closing, card):
    if wide:
        aw, ah = .3 * W, .8 * H
        ax = .6 * W if not mir else .1 * W
        ay = .1 * H
        d.shape(SH.ROUND_2_SAME_RECTANGLE, ax - .5 * (-1 if mir else 1), ay + .45, aw, ah - .3, fill="tint" if tone != "dark" else "main", adj={"adj1": 50000, "adj2": 0}, name="뒤 아치")
        d.shape(SH.ROUND_2_SAME_RECTANGLE, ax, ay, aw, ah, fill="white", shadow="lift", adj={"adj1": 50000, "adj2": 0}, name="아치 틀")
        d.shape(SH.ROUND_2_SAME_RECTANGLE, ax + .14, ay + .14, aw - .28, ah - .28, fill=d.pfill, adj={"adj1": 50000, "adj2": 0}, text="사진을 넣어 주세요", tsize=11, tcolor="mute", name="사진 바탕")
        d.ph("pic", 13, "사진", ax + .14, ay + .14, aw - .28, ah - .28, geom="arch", prompt="사진을 넣으려면 아이콘을 누르세요", sz=11, color="mute")
        d.shape(SH.OVAL, ax + (aw - .45 if not mir else -.45), ay + ah - 1.3, .9, .9, fill="accent", alpha=88, name="포인트 원")
        tx = .08 * W if not mir else .5 * W
        _stack(d, tx, (H - 3.9) / 2, .42 * W, "l", tone, th, ts, closing)
    else:
        aw, ah = .38 * W, .42 * H
        ax, ay = (W - aw) / 2, .06 * H
        d.shape(SH.ROUND_2_SAME_RECTANGLE, ax - .35, ay + .3, aw, ah, fill="tint" if tone != "dark" else "main", adj={"adj1": 50000, "adj2": 0}, name="뒤 아치")
        d.shape(SH.ROUND_2_SAME_RECTANGLE, ax, ay, aw, ah, fill="white", shadow="lift", adj={"adj1": 50000, "adj2": 0}, name="아치 틀")
        d.shape(SH.ROUND_2_SAME_RECTANGLE, ax + .1, ay + .1, aw - .2, ah - .2, fill=d.pfill, adj={"adj1": 50000, "adj2": 0}, text="사진", tsize=10, tcolor="mute", name="사진 바탕")
        d.ph("pic", 13, "사진", ax + .1, ay + .1, aw - .2, ah - .2, geom="arch", prompt="사진", sz=10, color="mute")
        _stack(d, .1 * W, .52 * H, .8 * W, "ctr", tone, th, ts, closing, sub_h=.55)


def f_split(d, W, H, mir, tone, wide, ts, th, closing, card):
    if wide:
        bw = .36 * W
        bx = 0 if not mir else W - bw
        d.shape(SH.RECTANGLE, bx, 0, bw, H, fill="main" if tone != "dark" else "deep", name="색 면")
        _vword(d, bx + bw / 2 - .8, .1 * H, 1.6, .8 * H, "white", 54)
        d.line(bx + bw + (-.35 if mir else .35), .12 * H, bx + bw + (-.35 if mir else .35), .88 * H, "main" if tone != "dark" else "soft", .75)
        d.shape(SH.OVAL, bx + (bw if not mir else 0) - .75, .5 * H - .75, 1.5, 1.5, fill="white", shadow="soft", name="장식 원판")
        draw_orn(d, bx + (bw if not mir else 0), .5 * H, .8)
        tx = .44 * W if not mir else .08 * W
        _stack(d, tx, (H - 3.9) / 2, .48 * W, "l", tone, th, ts, closing)
    else:
        d.shape(SH.RECTANGLE, 0, 0, W, .3 * H, fill="main" if tone != "dark" else "deep", name="색 면")
        _vword(d, .1 * W, .03 * H, .8 * W, .24 * H, "white", 40)
        draw_orn(d, W / 2, .3 * H, .9)
        _stack(d, .1 * W, .42 * H, .8 * W, "ctr", tone, th, ts, closing, sub_h=.55)


def f_sun(d, W, H, mir, tone, wide, ts, th, closing, card):
    if wide:
        cx = .84 * W if not mir else .16 * W
        d.shape(SH.OVAL, cx - .46 * H, .3 * H - .46 * H, .92 * H, .92 * H, fill="soft" if tone != "dark" else "deep", name="큰 원")
        d.shape(SH.OVAL, cx - .31 * H, .3 * H - .31 * H, .62 * H, .62 * H, fill="main", alpha=60, name="안쪽 원")
        d.shape(SH.OVAL, cx - .4 * H, .3 * H - .4 * H, .8 * H, .8 * H, fill=None, line="accent", lw=1, name="원 테두리")
        d.shape(SH.OVAL, (.08 if not mir else .86) * W, .84 * H, .5, .5, fill="accent", alpha=70, name="작은 원")
        draw_orn(d, cx, .3 * H, 1.1)
        tx = .08 * W if not mir else .5 * W
        _stack(d, tx, (H - 3.9) / 2 + .35, .42 * W, "l", tone, th, ts, closing)
    else:
        d.shape(SH.OVAL, W / 2 - .45 * W, -.3 * H, .9 * W, .9 * H, fill="soft" if tone != "dark" else "deep", name="큰 원")
        d.shape(SH.OVAL, W / 2 - .3 * W, -.15 * H, .6 * W, .6 * H, fill="main", alpha=60, name="안쪽 원")
        draw_orn(d, W / 2, .16 * H, 1.0)
        _stack(d, .1 * W, .45 * H, .8 * W, "ctr", tone, th, ts, closing, sub_h=.55)


def f_corner(d, W, H, mir, tone, wide, ts, th, closing, card):
    m, L = .42, .9
    for (x, y, sx, sy) in ((m, m, 1, 1), (W - m, m, -1, 1), (m, H - m, 1, -1), (W - m, H - m, -1, -1)):
        d.line(x, y, x + sx * L, y, "deep" if tone != "dark" else "soft", 1.5)
        d.line(x, y, x, y + sy * L, "deep" if tone != "dark" else "soft", 1.5)
    draw_orn(d, W / 2, .2 * H, .5 if wide else .4)
    d.line(W / 2 - (1.3 if wide else .9), .2 * H, W / 2 - .45, .2 * H, "main", 1)
    d.line(W / 2 + .45, .2 * H, W / 2 + (1.3 if wide else .9), .2 * H, "main", 1)
    if wide:
        _vword(d, (.08 if not mir else .86) * W, .22 * H, .8, .56 * H, "main", 30)
    else:
        _vword(d, .86 * W, .3 * H, .6, .4 * H, "main", 20)
    _stack(d, .2 * W, (H - 3.9) / 2 + .15, .6 * W, "ctr", tone, th, ts, closing) if wide else _stack(d, .12 * W, .3 * H, .76 * W, "ctr", tone, th, ts, closing, sub_h=.55)


def f_ticket(d, W, H, mir, tone, wide, ts, th, closing, card):
    if wide:
        bx, by, bw, bh = .08 * W, .16 * H, .84 * W, .68 * H
        sw = bw * .24
        sx = bx + bw - sw if not mir else bx
        d.shape(SH.ROUNDED_RECTANGLE, bx, by, bw, bh, fill=card, shadow="lift", adj={"adj": 7000}, name="티켓")
        d.shape(SH.ROUNDED_RECTANGLE, sx, by, sw, bh, fill="main" if tone != "dark" else "accent", adj={"adj": 10000}, name="티켓 끝")
        d.shape(SH.RECTANGLE, sx + (0 if mir else 0) + (sw / 2 if not mir else 0), by, sw / 2, bh, fill="main" if tone != "dark" else "accent", name="티켓 면")
        px = sx if not mir else sx + sw
        d.line(px, by + .1, px, by + bh - .1, "white", 2.5, dash="sysDot", name="절취선")
        _vword(d, sx + sw / 2 - .6, by + .3, 1.2, bh - .6, "white", 44)
        d.shape(SH.OVAL, px - .18, by - .18, .36, .36, fill="pale" if tone != "dark" else "deep2", name="구멍 위")
        d.shape(SH.OVAL, px - .18, by + bh - .18, .36, .36, fill="pale" if tone != "dark" else "deep2", name="구멍 아래")
        tx = bx + .5 if not mir else bx + sw + .5
        _stack(d, tx, (H - 3.9) / 2, bw - sw - 1.0, "l", "light" if tone != "dark" else "dark", th, ts, closing)
    else:
        bx, by, bw, bh = .08 * W, .1 * H, .84 * W, .8 * H
        d.shape(SH.ROUNDED_RECTANGLE, bx, by, bw, bh, fill=card, shadow="lift", adj={"adj": 6000}, name="티켓")
        d.shape(SH.RECTANGLE, bx, by, bw, .22 * H, fill="main" if tone != "dark" else "accent", name="티켓 윗면")
        _vword(d, bx + .3, by + .02, bw - .6, .18 * H, "white", 28)
        d.line(bx + .2, by + .22 * H, bx + bw - .2, by + .22 * H, "white", 2.5, dash="sysDot")
        _stack(d, bx + .4, by + .3 * H, bw - .8, "ctr", "light" if tone != "dark" else "dark", th, ts, closing, sub_h=.55)


def f_polaroid(d, W, H, mir, tone, wide, ts, th, closing, card):
    if wide:
        for (x, y, w, h, r, idx) in (((.57 if not mir else .1) * W, .1 * H, 3.7, 4.5, -6 if not mir else 5, 13), ((.7 if not mir else .23) * W, .38 * H, 3.4, 4.1, 5 if not mir else -4, 14)):
            d.shape(SH.RECTANGLE, x, y, w, h, fill="white", shadow="lift", rot=r, name="폴라로이드")
            d.shape(SH.RECTANGLE, x + .18, y + .18, w - .36, h - .78, fill=d.pfill, rot=r, text="사진", tsize=10, tcolor="mute", name="사진 바탕")
            d.ph("pic", idx, "사진", x + .18, y + .18, w - .36, h - .78, geom="rect", rot=r, prompt="사진", sz=10, color="mute")
            d.shape(SH.RECTANGLE, x + w / 2 - .55, y - .12, 1.1, .3, fill="accent", alpha=70, rot=r, name="마스킹 테이프")
        tx = .07 * W if not mir else .5 * W
        _stack(d, tx, (H - 3.9) / 2, .42 * W, "l", tone, th, ts, closing)
    else:
        for (x, y, w, h, r, idx) in ((.08 * W, .06 * H, 2.6, 3.0, -6, 13), (.46 * W, .1 * H, 2.5, 2.9, 5, 14)):
            d.shape(SH.RECTANGLE, x, y, w, h, fill="white", shadow="lift", rot=r, name="폴라로이드")
            d.shape(SH.RECTANGLE, x + .14, y + .14, w - .28, h - .55, fill=d.pfill, rot=r, text="사진", tsize=10, tcolor="mute", name="사진 바탕")
            d.ph("pic", idx, "사진", x + .14, y + .14, w - .28, h - .55, geom="rect", rot=r, prompt="사진", sz=10, color="mute")
        _stack(d, .1 * W, .55 * H, .8 * W, "ctr", tone, th, ts, closing, sub_h=.5)


def f_wave(d, W, H, mir, tone, wide, ts, th, closing, card):
    for k, (fc, a, dy) in enumerate((("soft", 80, .0), ("main", 55, .06), ("accent", 50, .12))):
        d.shape(SH.WAVE, -.05 * W, (.74 + dy) * H, 1.1 * W, .3 * H, fill=fc, alpha=a, flip="h" if (k + mir) % 2 else None, name=f"물결 {k + 1}")
    draw_orn(d, (.88 if not mir else .12) * W, .16 * H, .8)
    if wide:
        _stack(d, .15 * W, .12 * H + .3, .7 * W, "ctr", tone, th, ts, closing, extra_at=(.2 * W, .12 * H + .3 + .55 + th + .75, .6 * W, .6), sub_h=.7)
    else:
        _stack(d, .1 * W, .14 * H + .2, .8 * W, "ctr", tone, th, ts, closing, extra_at=(.15 * W, .14 * H + .2 + .55 + th + .55, .7 * W, .6), sub_h=.5)


def f_bars(d, W, H, mir, tone, wide, ts, th, closing, card):
    cols = ["main", "accent", "soft", "gold", "sky", "tint"]
    if wide:
        hs = [3.4, 5.0, 4.0, 5.7, 4.4, 3.0]
        x0 = .62 * W if not mir else .06 * W
        for k, hh in enumerate(hs):
            d.shape(SH.ROUNDED_RECTANGLE, x0 + k * .66, H - .5 - hh, .5, hh, fill=cols[(k + d.cfg["orn"]) % 6], adj={"adj": 50000}, name=f"막대 {k + 1}")
        d.shape(SH.OVAL, x0 + 3 * .66 - .05, H - .5 - hs[3] - .75, .6, .6, fill="white", shadow="soft", name="막대 위 원")
        draw_orn(d, x0 + 3 * .66 + .25, H - .5 - hs[3] - .45, .38)
        tx = .08 * W if not mir else .5 * W
        _stack(d, tx, (H - 3.9) / 2, .42 * W, "l", tone, th, ts, closing)
    else:
        hs = [1.6, 2.4, 1.9, 2.8, 2.1, 1.4]
        x0 = (W - 6 * .66) / 2
        for k, hh in enumerate(hs):
            d.shape(SH.ROUNDED_RECTANGLE, x0 + k * .66, H - .4 - hh, .5, hh, fill=cols[(k + d.cfg["orn"]) % 6], adj={"adj": 50000}, name=f"막대 {k + 1}")
        _stack(d, .1 * W, .08 * H, .8 * W, "ctr", tone, th, ts, closing, sub_h=.55)


def f_bubble(d, W, H, mir, tone, wide, ts, th, closing, card):
    d.shape(SH.CLOUD, (-.03 if not mir else .8) * W, .62 * H, .28 * W, .3 * H, fill="soft", alpha=70, name="구름 1")
    d.shape(SH.CLOUD, (.78 if not mir else -.04) * W, .02 * H, .26 * W, .26 * H, fill="tint", alpha=80, name="구름 2")
    for k, (x, y, r, c) in enumerate(((.1, .1, .3, "accent"), (.9, .78, .4, "main"), (.18, .84, .22, "gold"), (.84, .2, .2, "sky"), (.5, .93, .26, "soft"))):
        d.shape(SH.OVAL, x * W - r / 2, y * H - r / 2, r, r, fill=c, alpha=75, name=f"방울 {k + 1}")
    bw, bh = (.64 * W, .56 * H) if wide else (.84 * W, .5 * H)
    bx, by = (W - bw) / 2, .1 * H
    d.shape(SH.ROUNDED_RECTANGULAR_CALLOUT, bx, by, bw, bh, fill=card, shadow="lift", adj={"adj1": (-.30 if not mir else .30) * 100000, "adj2": 66000, "adj3": 16667}, name="말풍선")
    tw = bw - .8
    ex = (bx, by + bh + .45, bw, .8)
    _stack(d, bx + .4, by + .22, tw, "ctr", "light" if tone != "dark" else "dark", th if wide else 1.3, ts, closing, extra_at=ex, sub_h=.6)


def f_frame(d, W, H, mir, tone, wide, ts, th, closing, card):
    c1 = "main" if tone != "dark" else "soft"
    d.shape(SH.RECTANGLE, .35, .35, W - .7, H - .7, fill=("alpha", "white", 55) if tone != "dark" else None, line=c1, lw=1.5, name="바깥 테두리")
    d.shape(SH.RECTANGLE, .5, .5, W - 1.0, H - 1.0, fill=None, line="accent" if tone != "dark" else "tint", lw=.75, name="안쪽 테두리")
    for x, y in ((.35, .35), (W - .35, .35), (.35, H - .35), (W - .35, H - .35)):
        d.shape(SH.DIAMOND, x - .12, y - .12, .24, .24, fill=c1, name="모서리 장식")
    draw_orn(d, W / 2, .5, .55)
    if wide:
        _stack(d, .16 * W, (H - 3.9) / 2 + .2, .68 * W, "ctr", tone, th, ts, closing)
    else:
        _stack(d, .12 * W, .22 * H, .76 * W, "ctr", tone, th, ts, closing, sub_h=.55)


def f_photo(d, W, H, mir, tone, wide, ts, th, closing, card):
    d.shape(SH.RECTANGLE, 0, 0, W, H, fill=d.pfill, name="사진 바탕")
    if wide:
        d.text((.46 * W if not mir else 0), H / 2 - .3, W * .54, .6, "사진을 넣어 주세요 (전체 화면)", size=12, color="mute", align="c", anchor="m", name="사진 안내")
    d.ph("pic", 13, "전체 사진", 0, 0, W, H, geom="rect", prompt="전체 화면 사진 — 아이콘을 눌러 넣으세요", sz=11, color="mute")
    if wide:
        pw = .46 * W
        px = 0 if not mir else W - pw
        d.shape(SH.RECTANGLE, px, 0, pw, H, fill=("alpha", "deep2" if tone == "dark" else "white", 86), name="글 면")
        d.line(px + (pw - .35 if not mir else .35), .1 * H, px + (pw - .35 if not mir else .35), .9 * H, "accent", .75)
        _vword(d, px + (pw - .85 if not mir else .15), .12 * H, .5, .76 * H, "main" if tone != "dark" else "soft", 22)
        _stack(d, px + (.5 if not mir else .8), (H - 3.9) / 2, pw - 1.4, "l", tone, th, ts, closing)
    else:
        d.shape(SH.RECTANGLE, 0, .5 * H, W, .5 * H, fill=("alpha", "deep2" if tone == "dark" else "white", 86), name="글 면")
        _stack(d, .1 * W, .55 * H, .8 * W, "ctr", tone, th, ts, closing, sub_h=.5)


FAM = [f_envelope, f_arch, f_split, f_sun, f_corner, f_ticket, f_polaroid, f_wave, f_bars, f_bubble, f_frame, f_photo]


# ───────────────────────── 본문 6틀
def body_layouts(d):
    """본문·본문+사진·한 문장 레이아웃을 같은 틀로 그립니다. d.rect 에 내용 영역이 들어갑니다."""
    cfg = d.cfg
    bg = bg_spec("light" if cfg["tone"] == "dark" else cfg["tone"], cfg["bgt"], cfg["pat"], light_only=True)
    for key in ("body", "photo", "quote"):
        d.layout_begin(key, bg)
        d.rect = _frame(d, cfg["cf"], key)
        if key == "photo":
            l, t, r, b = d.rect
            for j in range(8):
                d.ph("pic", 13 + j, f"사진 {j + 1}", l + (j % 4) * 1.5, b - 3.0 + (j // 4) * 1.5, 1.3, 1.3, geom="round", prompt="사진", sz=10, color="mute", mute_fill=d.pfill)
        d.layout_end()


def _frame(d, cf, key):
    W, H = d.W, d.H
    wide = d.wide
    mir = d.cfg["mir"]
    ts = 28 if wide else 24
    quote = key == "quote"
    rect = (.8 if wide else .6, 2.0 if wide else 1.8, W - (.8 if wide else .6), H - .75)
    if quote:
        return _quote_frame(d, cf, rect)
    if cf == 0:
        d.ph("body", 10, "영문 라벨", .5, .38, W - 1, .34, sz=11, color="deep", algn="ctr", spc=450, caps=True, prompt="LABEL")
        d.ph("title", 0, "제목", .6, .7, W - 1.2, .85, sz=ts, color="deep", bold=True, algn="ctr", major=True, prompt="제목")
        d.line(W / 2 - .6, 1.62, W / 2 + .6, 1.62, "main", 2.5, name="제목 밑줄")
        draw_orn(d, W / 2, 1.62, .3)
        d.ph("num", 12, "쪽 번호", W / 2 - .5, H - .6, 1, .4, sz=10, color="mute", algn="ctr", spc=200)
    elif cf == 1:
        al = "l" if not mir else "r"
        d.ph("body", 10, "영문 라벨", .8, .4, W - 1.6, .34, sz=11, color="deep", algn=al, spc=450, caps=True, prompt="LABEL")
        d.ph("title", 0, "제목", .8, .72, W - 1.6, .85, sz=ts, color="deep", bold=True, algn=al, major=True, prompt="제목")
        d.line(.8, 1.72, W - .8, 1.72, "soft", 1, name="머리말 선")
        cx = W - 1.3 if not mir else 1.3
        d.shape(SH.ROUNDED_RECTANGLE, cx - .55, .5, 1.1, .5, fill="white", shadow="thin", adj={"adj": 50000}, name="쪽 번호 알약")
        d.ph("num", 12, "쪽 번호", cx - .5, .5, 1.0, .5, sz=11, color="deep", algn="ctr", bold=True, spc=100)
        draw_orn(d, W - .8 if not mir else .8, H - .55, .4)
    elif cf == 2:
        bw = .85 if wide else .6
        bx = 0 if not mir else W - bw
        d.shape(SH.RECTANGLE, bx, 0, bw, H, fill="main", name="옆 띠")
        d.ph("body", 30, "세로 글씨", bx + .1, 1.0, bw - .2, H - 2.4, sz=24 if wide else 18, color="white", algn="ctr", vert="wordArtVert", spc=600, major=True, prompt="세로 글씨")
        d.ph("num", 12, "쪽 번호", bx, H - .75, bw, .5, sz=12, color="white", algn="ctr", bold=True)
        tx = bw + .7 if not mir else .7
        d.ph("body", 10, "영문 라벨", tx, .4, W - bw - 1.4, .34, sz=11, color="deep", algn="l", spc=450, caps=True, prompt="LABEL")
        d.ph("title", 0, "제목", tx, .72, W - bw - 1.4, .85, sz=ts, color="deep", bold=True, algn="l", major=True, prompt="제목")
        d.line(tx, 1.72, tx + 1.4, 1.72, "accent", 2.5)
        rect = (tx + .0, rect[1], (W - .7) if not mir else (W - bw - .7), rect[3])
    elif cf == 3:
        d.shape(SH.RECTANGLE, 0, 0, W, 1.5, fill="soft", name="머리 띠")
        d.line(0, 1.5, W, 1.5, "main", 1.5)
        d.ph("title", 0, "제목", .8, .35, W * .62, .85, sz=ts, color="deep", bold=True, algn="l", major=True, prompt="제목")
        d.ph("body", 10, "영문 라벨", W * .62 + .8, .5, W - W * .62 - 1.6, .4, sz=11, color="deep", algn="r", spc=450, caps=True, prompt="LABEL")
        d.ph("num", 12, "쪽 번호", W - 1.8, H - .6, 1.0, .4, sz=10, color="mute", algn="r", spc=200)
        draw_orn(d, W - .9, 1.0, .35) if not quote else None
    elif cf == 4:
        al = "l" if not mir else "r"
        d.ph("body", 10, "영문 라벨", .8, .4, W - 1.6, .34, sz=11, color="deep", algn=al, spc=450, caps=True, prompt="LABEL")
        d.ph("title", 0, "제목", .8, .72, W - 1.6, .85, sz=ts, color="deep", bold=True, algn=al, major=True, prompt="제목")
        bx = .85 if not mir else W - .85 - 1.0
        d.shape(SH.ROUNDED_RECTANGLE, bx, 1.62, 1.0, .09, fill="accent", adj={"adj": 50000}, name="제목 막대")
        cxn = W - .8 if not mir else .8
        d.shape(SH.OVAL, cxn - .3, H - .75, .6, .6, fill="main", name="쪽 번호 원")
        d.ph("num", 12, "쪽 번호", cxn - .3, H - .75, .6, .6, sz=11, color="white", algn="ctr", bold=True)
    else:
        d.ph("body", 10, "영문 라벨", .5, .3, W - 1, .3, sz=11, color="deep", algn="ctr", spc=450, caps=True, prompt="LABEL")
        pw = min(W - 1.6, 6.2 if wide else 5.4)
        d.shape(SH.ROUNDED_RECTANGLE, (W - pw) / 2, .65, pw, .95, fill="white", shadow="soft", adj={"adj": 50000}, name="제목 알약")
        d.ph("title", 0, "제목", (W - pw) / 2 + .3, .65, pw - .6, .95, sz=ts - 2, color="deep", bold=True, algn="ctr", major=True, prompt="제목")
        d.ph("num", 12, "쪽 번호", W / 2 - .5, H - .6, 1, .4, sz=10, color="mute", algn="ctr", spc=200)
        draw_orn(d, .8, H - .5, .35)
        draw_orn(d, W - .8, H - .5, .35)
    return rect


def _quote_frame(d, cf, rect):
    """한 문장 레이아웃 — 제목 상자 없이, 가운데 큰 글씨 한 줄. 본문 틀(cf)의 색·띠·장식만 이어받습니다."""
    W, H = d.W, d.H
    mir = d.cfg["mir"]
    if cf == 2:
        bw = .85 if d.wide else .6
        bx = 0 if not mir else W - bw
        d.shape(SH.RECTANGLE, bx, 0, bw, H, fill="main", name="옆 띠")
        d.ph("body", 30, "세로 글씨", bx + .1, 1.0, bw - .2, H - 2.4, sz=24 if d.wide else 18, color="white", algn="ctr", vert="wordArtVert", spc=600, major=True, prompt="세로 글씨")
        d.ph("num", 12, "쪽 번호", bx, H - .75, bw, .5, sz=12, color="white", algn="ctr", bold=True)
    elif cf == 3:
        d.shape(SH.RECTANGLE, 0, 0, W, .35, fill="soft", name="머리 띠")
        d.ph("num", 12, "쪽 번호", W - 1.8, H - .6, 1.0, .4, sz=10, color="mute", algn="r", spc=200)
    else:
        d.ph("num", 12, "쪽 번호", W / 2 - .5, H - .6, 1, .4, sz=10, color="mute", algn="ctr", spc=200)
    d.ph("body", 10, "영문 라벨", .5, .42, W - 1, .34, sz=11, color="deep", algn="ctr", spc=450, caps=True, prompt="LABEL")
    cx = W / 2
    with d.group("따옴표 장식"):
        for dx in (-.42, .42):
            d.shape(SH.TEAR, cx + dx - .3, H * .2, .6, .6, fill="main", alpha=75, rot=270, name="따옴표 방울")
    d.ph("title", 0, "한 문장", W * .12, H * .34, W * .76, H * .34, sz=34 if d.wide else 26, color="deep", bold=True, algn="ctr", major=True, lnspc=130, prompt="한 문장으로 말하면")
    draw_orn(d, W / 2, H * .8, .6, alpha=70)
    return rect
