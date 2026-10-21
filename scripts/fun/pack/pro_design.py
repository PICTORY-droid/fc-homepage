"""PPT 디자인 언어(2026 럭셔리) — 팔레트는 pro_palette, 여기서는 표지 17구도·본문 10틀·장식 12종·바탕·글꼴을 정합니다.

한 파일의 디자인은 (테마 i, 항목 k)로 정해집니다.
- 테마 i 는 분위기(vibe: classic·minimal·modern·geo·cyber·playful·bold)를 갖고, 분위기마다 어울리는 표지·본문 구도 묶음이 있습니다.
- 같은 분위기 안에서는 번호를 따라 묶음을 돌려 쓰고(구도), 좌우 반전·바탕(민무늬·그라데이션·무늬)·표지 톤을 바꿔서 겹치지 않게 합니다.
- 색은 모두 테마 색 이름표로 칠합니다(밝은 테마/밤 테마 모두 [디자인 > 변형 > 색]이 그대로 동작).
"""
import math

import pro_palette as PP
from pptx.enum.shapes import MSO_SHAPE as SH

SEASON_EN = {"봄": "SPRING", "여름": "SUMMER", "가을": "AUTUMN", "겨울": "WINTER"}
PATTERNS = ["ltVert", "pct5", "dotGrid", "ltUpDiag", "smGrid", "pct10"]

# 글꼴(제목 영문, 제목 한글) — 본문은 모두 맑은 고딕. Office 에 기본으로 들어 있는 글꼴만 씁니다.
FONT_POOL = {
    "classic": [("Bodoni MT", "바탕"), ("Garamond", "바탕"), ("Palatino Linotype", "바탕"), ("Book Antiqua", "바탕")],
    "minimal": [("Gill Sans MT", "맑은 고딕"), ("Century Gothic", "맑은 고딕"), ("Garamond", "바탕")],
    "modern": [("Century Gothic", "맑은 고딕"), ("Tw Cen MT", "맑은 고딕"), ("Franklin Gothic Medium", "맑은 고딕")],
    "geo": [("Century Gothic", "맑은 고딕"), ("Gill Sans MT", "맑은 고딕"), ("Tw Cen MT", "맑은 고딕")],
    "cyber": [("Tw Cen MT", "맑은 고딕"), ("Century Gothic", "맑은 고딕"), ("Segoe UI", "맑은 고딕")],
    "playful": [("Trebuchet MS", "맑은 고딕"), ("Candara", "맑은 고딕"), ("Constantia", "바탕"), ("Georgia", "바탕")],
    "bold": [("Bodoni MT", "바탕"), ("Georgia", "바탕"), ("Palatino Linotype", "바탕")],
}
BOLD_TITLE = {"modern", "geo", "cyber", "playful"}
# 분위기별 표지 구도(FAM 번호) · 본문 틀 · 카드 모양 · 장식
VIBE_FAM = {"classic": [1, 0, 3, 7, 14], "minimal": [9, 8, 2, 7], "modern": [13, 2, 15, 8, 10], "geo": [11, 12, 15, 4, 14],
            "cyber": [5, 6, 4, 13], "playful": [16, 11, 7, 12, 3], "bold": [0, 14, 11, 13, 1]}
VIBE_BODY = {"classic": [0, 5, 7], "minimal": [1, 4, 8], "modern": [3, 8, 1, 4], "geo": [8, 2, 3], "cyber": [6, 3, 2],
             "playful": [9, 8, 2], "bold": [3, 7, 2, 0]}
VIBE_CARD = {"classic": [3, 0, 5], "minimal": [0, 2, 4], "modern": [1, 0, 2], "geo": [4, 2, 5], "cyber": [1, 5, 3], "playful": [4, 0, 2], "bold": [3, 5, 1]}
VIBE_ORN = {"classic": [1, 0, 2], "minimal": [3, 6, 0], "modern": [5, 3, 6], "geo": [4, 10, 0], "cyber": [7, 4, 11], "playful": [8, 2, 3], "bold": [9, 2, 1]}
COVER_TONES = ["light", "dark", "tint", "light", "dark"]


def palette(i):
    return PP.palette(i)


def design_of(i, k):
    vibe = PP.LUX[i][3]
    night = PP.LUX[i][2] == "night"
    n = PP.vibe_rank(i)
    pool = VIBE_FAM[vibe]
    fam = pool[(n + k) % len(pool)]
    if night:
        tone = "dark"
    elif vibe == "cyber":
        tone = "light" if (n + k) % 3 == 0 else "dark"
    elif vibe == "playful":
        tone = ["light", "tint", "light", "tint", "light", "dark"][(n + k) % 6] if (n + k) % 6 != 5 else "tint"
    else:
        tone = COVER_TONES[(n * 2 + k) % 5]
    body = VIBE_BODY[vibe]
    fonts = FONT_POOL[vibe]
    return {"vibe": vibe, "night": night, "fam": fam, "mir": (n // len(pool) + k) % 2, "tone": tone, "bgt": ["flat", "grad", "pattern"][(n + 2 * k) % 3],
            "cf": body[(n + 2 * k) % len(body)], "font": fonts[(n + k) % len(fonts)], "tbold": vibe in BOLD_TITLE,
            "orn": VIBE_ORN[vibe][(n + k) % 3], "pat": PATTERNS[(i + k) % len(PATTERNS)], "cs": VIBE_CARD[vibe][(n + k) % 3],
            "bs": (n * 5 + k * 2 + i) % 6, "tl": (i + k) % 2, "pf": (n + k) % 3,
            "trans": (i + k) % 8, "anim": (i + 2 * k) % 3}


# ───────────────────────── 바탕·표면 색
class Sf:
    """표면(밝은/어두운)에 따른 글자·선·덩어리 색 묶음"""

    def __init__(self, d, tone):
        self.tone, self.dark, night = tone, tone == "dark", d.pal["night"]
        if self.dark:
            self.t1, self.t2, self.t3, self.lab = d.snow, d.snow2, d.snow3, "gold"
            self.panel = "white" if night else "deep"
            self.hair = d.hair_d
            self.blk, self.onblk = ("main", d.onmain) if night else ("deep", d.snow)
            self.line2 = "soft" if night else "deep"
        else:
            self.t1, self.t2, self.t3, self.lab = "deep", "ink", "mute", "deep"
            self.panel = "white"
            self.hair = d.hair_l
            self.blk, self.onblk = "main", d.onmain
            self.line2 = "soft"
        self.main = "main"


def setup_tokens(d):
    """덱이 쓸 선(헤어라인) 색: 금속색이 바탕과 구분이 안 되면 주색·진한 색으로 바꿉니다."""
    p = d.pal
    page, dark = p["bg"], p["deep2"]
    def pick(bg):
        for tok in ("gold", "main", "accent", "deep"):
            if PP.contrast(p[tok], bg) >= 1.8:
                return tok
        return "deep"
    d.hair_l, d.hair_d = pick(page), pick(dark)


def bg_spec(d, tone, bgt, pat):
    night = d.pal["night"]
    if tone == "dark":
        if night:
            return {"flat": "deep2", "grad": ("grad", "deep2", "white", 120), "pattern": ("patt", "dotGrid", "white", "deep2")}[bgt]
        return {"flat": "deep2", "grad": ("grad", "deep2", "deep", 135), "pattern": ("patt", "dotGrid", "deep", "deep2")}[bgt]
    base = "soft" if tone == "tint" else "pale"
    if night:
        return {"flat": "pale", "grad": ("grad", "pale", "deep2", 90), "pattern": ("patt", "dotGrid", "white", "pale")}[bgt]
    return {"flat": base, "grad": ("grad", base, "soft" if base == "pale" else "tint", 60), "pattern": ("patt", pat, "mist" if base == "pale" else "tint", base)}[bgt]


# ───────────────────────── 기본 부품
def hl(d, x1, y1, x2, y2, c, lw=.75, **kw):
    return d.line(x1, y1, x2, y2, c, lw, **kw)


def box_o(d, x, y, w, h, c, lw=.75, name=None, rot=0):
    return d.shape(SH.RECTANGLE, x, y, w, h, fill=None, line=c, lw=lw, name=name, rot=rot)


def ring(d, cx, cy, r, c, lw=.75, dash=None, fill=None, name=None, shadow=None):
    return d.shape(SH.OVAL, cx - r, cy - r, 2 * r, 2 * r, fill=fill, line=c, lw=lw, dash=dash, name=name, shadow=shadow)


def dot(d, cx, cy, r, fill="main", alpha=None, name=None):
    return d.shape(SH.OVAL, cx - r, cy - r, 2 * r, 2 * r, fill=fill, alpha=alpha, name=name)


def arc_up(d, cx, cy, r, c, lw=.75, quarter=None):
    """위쪽 반원(quarter 'l' 왼쪽 위 1/4, 'r' 오른쪽 위 1/4)"""
    a1, a2 = {None: (10800000, 0), "l": (10800000, 16200000), "r": (16200000, 0)}[quarter]
    return d.shape(SH.ARC, cx - r, cy - r, 2 * r, 2 * r, fill=None, line=c, lw=lw, adj={"adj1": a1, "adj2": a2})


def diamond(d, cx, cy, s, fill="main", line=None, lw=.75, name=None, alpha=None):
    return d.shape(SH.DIAMOND, cx - s / 2, cy - s / 2, s, s, fill=fill, line=line, lw=lw, name=name, alpha=alpha)


def hexagon(d, cx, cy, s, fill=None, line="main", lw=.75, alpha=None):
    return d.shape(SH.HEXAGON, cx - s / 2, cy - s * .433, s, s * .866, fill=fill, line=line, lw=lw, alpha=alpha)


def ornament(d, kind, cx, cy, s, c1="main", c2="accent", name=None):
    """럭셔리 장식 12종(귀여운 그림 대신 기하·헤어라인)"""
    k = kind % 12
    with d.group(name or "장식"):
        if k == 0:
            diamond(d, cx, cy, s * .8, c1)
        elif k == 1:
            diamond(d, cx, cy, s * .55, c1)
            hl(d, cx - s * 1.1, cy, cx - s * .45, cy, c1, .75)
            hl(d, cx + s * .45, cy, cx + s * 1.1, cy, c1, .75)
        elif k == 2:
            d.shape(SH.STAR_4_POINT, cx - s / 2, cy - s / 2, s, s, fill=c1, adj={"adj": 14000})
        elif k == 3:
            ring(d, cx, cy, s * .5, c1, 1)
            dot(d, cx, cy, s * .14, c2)
        elif k == 4:
            hexagon(d, cx, cy, s, None, c1, 1.25)
            dot(d, cx, cy, s * .1, c2)
        elif k == 5:
            for q, sc in enumerate((1.0, .68, .36)):
                box_o(d, cx - s * sc / 2, cy - s * sc / 2, s * sc, s * sc, c1 if q != 1 else c2, 1, rot=45)
        elif k == 6:
            d.shape(SH.MATH_PLUS, cx - s / 2, cy - s / 2, s, s, fill=c1, adj={"adj1": 12000})
        elif k == 7:
            ring(d, cx, cy, s * .36, c1, 1.25)
            for a in (0, 90, 180, 270):
                ax, ay = math.cos(math.radians(a)), math.sin(math.radians(a))
                hl(d, cx + ax * s * .46, cy + ay * s * .46, cx + ax * s * .72, cy + ay * s * .72, c1, 1.25)
            dot(d, cx, cy, s * .07, c2)
        elif k == 8:
            for a in (0, 45, 90, 135):
                ax, ay = math.cos(math.radians(a)), math.sin(math.radians(a))
                hl(d, cx - ax * s / 2, cy - ay * s / 2, cx + ax * s / 2, cy + ay * s / 2, c1, 1.75)
            dot(d, cx, cy, s * .09, c2)
        elif k == 9:
            d.shape(SH.STAR_8_POINT, cx - s / 2, cy - s / 2, s, s, fill=c1, adj={"adj": 30000})
        elif k == 10:
            d.shape(SH.ISOSCELES_TRIANGLE, cx - s * .5, cy - s * .43, s, s * .86, fill=None, line=c1, lw=1.25)
            dot(d, cx, cy + s * .08, s * .07, c2)
        else:
            ring(d, cx, cy, s * .5, c1, 1)
            ring(d, cx, cy, s * .33, c2, .75, dash="sysDash")
            dot(d, cx, cy, s * .08, c1)


def draw_orn(d, cx, cy, s, bigger=1.0, c1=None, c2=None):
    ornament(d, d.cfg["orn"], cx, cy, s * bigger, c1 or "main", c2 or "accent", name="테마 장식")


# ───────────────────────── 표지·마무리
def _stack(d, x, y, w, align, S, th, tsize, closing, extra_at=None, sub_h=0.8, tcol=None):
    d.ph("body", 10, "영문 라벨", x, y, w, 0.34, sz=11, color=S.lab, algn=align, spc=300, caps=True, prompt="LABEL", anchor="ctr")
    d.ph("title" if closing else "ctrTitle", 0, "제목", x, y + 0.42, w, th, sz=tsize, color=tcol or S.t1, bold=d.cfg["tbold"], algn=align, anchor="ctr", major=True, lnspc=102, prompt="제목을 입력하세요")
    d.ph("sub", 1, "한 줄 문구", x, y + 0.5 + th, w, sub_h, sz=16 if d.wide else 14, color=S.t2, algn=align, anchor="t", prompt="한 줄 문구")
    ex = extra_at or (x, y + 0.55 + th + sub_h, w, 0.9)
    d.ph("body", 11, "안내 문구", ex[0], ex[1], ex[2], ex[3], sz=12 if d.wide else 11, color=S.t3, algn=align, anchor="t", prompt="안내 문구")


def _vword(d, x, y, w, h, color, sz, algn="ctr", vert="vert270"):
    d.ph("body", 12, "세로 글씨", x, y, w, h, sz=sz, color=color, algn=algn, vert=vert, spc=900, major=True, anchor="ctr", prompt="세로 글씨")


def cover_layout(d, closing=False):
    cfg = d.cfg
    tone = cfg["tone"]
    if closing:
        tone = "light" if tone == "dark" else "dark"
        if d.pal["night"]:
            tone = "dark"
    bgt = cfg["bgt"] if not closing else {"flat": "grad", "grad": "pattern", "pattern": "flat"}[cfg["bgt"]]
    S = Sf(d, tone)
    d.layout_begin("closing" if closing else "cover", bg_spec(d, tone, bgt, cfg["pat"]))
    W, H, wide = d.W, d.H, d.wide
    ts = 44 if wide else 34
    th = 1.75 if wide else 1.45
    FAM[cfg["fam"]](d, W, H, cfg["mir"], S, wide, ts, th, closing)
    d.layout_end()


def f_deco_fan(d, W, H, mir, S, wide, ts, th, closing):
    """아르데코 부채꼴 — 가운데 위에서 퍼지는 헤어라인과 겹호"""
    cx, cy = W / 2, (2.55 if wide else 2.2)
    R = 2.2 if wide else 1.85
    for a in range(190, 351, 10):
        ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
        hl(d, cx + ca * .55, cy + sa * .55, cx + ca * R, cy + sa * R, S.hair, .5)
    for r in (.55, R * .55, R * .8, R):
        arc_up(d, cx, cy, r, S.hair, .75 if r < R else 1.5)
    hl(d, cx - R - .6, cy, cx + R + .6, cy, S.hair, .75)
    diamond(d, cx, cy, .2, S.hair)
    box_o(d, .32, .32, W - .64, H - .64, S.hair, 1.25, "바깥 선")
    box_o(d, .42, .42, W - .84, H - .84, S.hair, .5, "안쪽 선")
    _stack(d, W * .15, cy + .4, W * .7, "ctr", S, 1.35 if wide else 1.15, ts - 2 if wide else ts - 2, closing, sub_h=.7 if wide else .55)


def f_gold_frame(d, W, H, mir, S, wide, ts, th, closing):
    """겹선 액자 + 모서리 마름모 + 가운데 위 모노그램"""
    box_o(d, .35, .35, W - .7, H - .7, S.hair, 1.5, "바깥 선")
    box_o(d, .52, .52, W - 1.04, H - 1.04, S.hair, .5, "안쪽 선")
    for x, y in ((.35, .35), (W - .35, .35), (.35, H - .35), (W - .35, H - .35)):
        diamond(d, x, y, .24, S.hair, name="모서리 장식")
    my = 1.25 if wide else 1.6
    ring(d, W / 2, my, .38, S.hair, 1)
    ornament(d, 0, W / 2, my, .26, S.hair, "accent", "모노그램")
    for sgn in (-1, 1):
        hl(d, W / 2 + sgn * .55, my, W / 2 + sgn * (2.4 if wide else 1.5), my, S.hair, .5)
    _stack(d, W * .14, my + .55, W * .72, "ctr", S, 1.6 if wide else 1.3, ts, closing, sub_h=.7 if wide else .5)


def f_split(d, W, H, mir, S, wide, ts, th, closing):
    """한쪽 색 면 + 세로 영문 글씨 + 얇은 선과 고리 장식"""
    if wide:
        bw = .33 * W
        bx = 0 if not mir else W - bw
        d.shape(SH.RECTANGLE, bx, 0, bw, H, fill=("grad", S.blk, "accent", 90) if not S.dark or d.pal["night"] else S.blk, name="색 면")
        _vword(d, bx + bw / 2 - .45, .12 * H, .9, .76 * H, S.onblk, 46)
        ex = bx + bw + (.4 if not mir else -.4)
        hl(d, ex, .1 * H, ex, .9 * H, S.hair, .75)
        ring(d, bx + (bw if not mir else 0), .5 * H, .62, S.hair, 1.25, fill=("alpha", "pale" if not S.dark else "deep2", 100), shadow="soft")
        draw_orn(d, bx + (bw if not mir else 0), .5 * H, .5)
        tx = .43 * W if not mir else .08 * W
        _stack(d, tx, (H - 3.9) / 2, .49 * W, "l", S, th, ts, closing)
    else:
        d.shape(SH.RECTANGLE, 0, 0, W, .28 * H, fill=("grad", S.blk, "accent", 0) if not S.dark or d.pal["night"] else S.blk, name="색 면")
        _vword(d, .1 * W, .03 * H, .8 * W, .22 * H, S.onblk, 28, vert=None)
        ring(d, W / 2, .28 * H, .38, S.hair, 1.25, fill=("alpha", "pale" if not S.dark else "deep2", 100), shadow="soft")
        draw_orn(d, W / 2, .28 * H, .34)
        _stack(d, .1 * W, .42 * H, .8 * W, "ctr", S, th, ts, closing, sub_h=.55)


def f_monogram(d, W, H, mir, S, wide, ts, th, closing):
    """겹원(동심원) 모노그램 — 한쪽에 커다란 겹원, 반대쪽에 글"""
    if wide:
        cx = (.76 if not mir else .24) * W
        cy = H / 2
        for k, r in enumerate((2.9, 2.35, 1.8, 1.25)):
            ring(d, cx, cy, r, S.hair, 1.25 if k == 0 else .5)
        dot(d, cx, cy, .9, S.blk, name="가운데 원")
        ornament(d, 2, cx, cy, .8, S.onblk if S.blk == "main" else S.t1, "accent")
        hl(d, cx - 3.3, cy, cx + 3.3, cy, S.hair, .5)
        dot(d, cx + 2.9 * math.cos(math.radians(-40)), cy + 2.9 * math.sin(math.radians(-40)), .13, "accent")
        tx = .08 * W if not mir else .5 * W
        _stack(d, tx, (H - 3.9) / 2, .42 * W, "l", S, th, ts, closing)
    else:
        cx, cy = W / 2, 1.9
        for k, r in enumerate((1.6, 1.25, .9)):
            ring(d, cx, cy, r, S.hair, 1.25 if k == 0 else .5)
        dot(d, cx, cy, .45, S.blk)
        ornament(d, 2, cx, cy, .4, S.onblk if S.blk == "main" else S.t1, "accent")
        _stack(d, .1 * W, 3.7, .8 * W, "ctr", S, 1.2, ts - 2, closing, sub_h=.5)


def f_hex(d, W, H, mir, S, wide, ts, th, closing):
    """육각 격자 — 점점 흐려지는 헥스 타일(미래·기하)"""
    s = .95 if wide else .7
    cols, rows = (7, 8) if wide else (6, 4)
    x0 = (W - cols * .75 * s - .25 * s - .2) if not mir else .2
    if not wide:
        x0 = W / 2 - cols * .75 * s / 2
    y0 = .35 if wide else .3
    with d.group("헥스 격자"):
        for c in range(cols):
            for r in range(rows):
                cx = x0 + c * .75 * s + s / 2
                cy = y0 + r * .866 * s + (.433 * s if c % 2 else 0) + s * .433
                if cy + s * .433 > H - .2:
                    continue
                t = c / (cols - 1) if not mir else 1 - c / (cols - 1)
                fade = int(100 - 70 * (1 - t) if wide else 100 - 22 * r)
                if (c * 3 + r * 5) % 11 == 0:
                    hexagon(d, cx, cy, s * .92, S.blk, S.hair, .5, alpha=max(25, fade - 20))
                elif (c + r) % 5 == 0:
                    hexagon(d, cx, cy, s * .92, "accent", None, .5, alpha=max(20, fade - 50))
                else:
                    hexagon(d, cx, cy, s * .92, None, ("alpha", S.hair, max(25, fade)), .75)
    if wide:
        tx = .08 * W if not mir else .5 * W
        _stack(d, tx, (H - 3.9) / 2, .42 * W, "l", S, th, ts, closing)
    else:
        _stack(d, .1 * W, 3.55, .8 * W, "ctr", S, 1.3, ts - 2, closing, sub_h=.55)


def f_cyber(d, W, H, mir, S, wide, ts, th, closing):
    """사이버 격자 + 빛나는 고리 + HUD 모서리"""
    gc = ("alpha", S.line2, 55)
    step = .6
    with d.group("격자"):
        x = step
        while x < W:
            hl(d, x, 0, x, H, gc, .5)
            x += step
        y = step
        while y < H:
            hl(d, 0, y, W, y, gc, .5)
            y += step
    L, m = .5, .35
    for (x, y, sx, sy) in ((m, m, 1, 1), (W - m, m, -1, 1), (m, H - m, 1, -1), (W - m, H - m, -1, -1)):
        hl(d, x, y, x + sx * L, y, "main", 2)
        hl(d, x, y, x, y + sy * L, "main", 2)
    cx = (.78 if not mir else .22) * W if wide else W / 2
    cy = H / 2 if wide else 1.95
    R = 2.0 if wide else 1.35
    ring(d, cx, cy, R, "main", 2.25, shadow="glow")
    ring(d, cx, cy, R * .78, "accent", 1, dash="dash")
    ring(d, cx, cy, R * .5, S.hair, .75)
    dot(d, cx, cy, R * .1, "accent", name="중심점")
    for a in range(0, 360, 30):
        ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
        hl(d, cx + ca * R * 1.08, cy + sa * R * 1.08, cx + ca * R * 1.18, cy + sa * R * 1.18, S.hair, .75)
    if wide:
        d.shape(SH.RECTANGLE, (.08 if not mir else .5) * W, (H - 3.9) / 2 + .08, .08, .2, fill="accent", name="라벨 표시")
        _stack(d, (.08 if not mir else .5) * W + .15, (H - 3.9) / 2, .4 * W, "l", S, th, ts, closing)
    else:
        _stack(d, .1 * W, 3.65, .8 * W, "ctr", S, 1.3, ts - 2, closing, sub_h=.5)


def f_orbit(d, W, H, mir, S, wide, ts, th, closing):
    """궤도 — 크기가 다른 원들과 그 위를 도는 위성 점"""
    cx = (.78 if not mir else .22) * W if wide else W / 2
    cy = H * .5 if wide else 2.0
    radii = (2.9, 2.2, 1.55, .95) if wide else (1.75, 1.3, .9)
    cols = [S.hair, "accent", S.hair, "main"]
    for k, r in enumerate(radii):
        ring(d, cx, cy, r, cols[k], 1 if k % 2 == 0 else .5, dash=None if k != 1 else "sysDash")
    dot(d, cx, cy, radii[-1] * .38, S.blk if S.blk == "main" else "main", name="행성")
    for k, (r, a, sz, c) in enumerate(zip(radii, (-50, 200, 70, 320), (.2, .14, .22, .12), ("main", "accent", "gold", "sky"))):
        dot(d, cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a)), sz / 2, c, name=f"위성 {k + 1}")
    hl(d, cx - radii[0] * 1.15, cy + radii[0] * .55, cx + radii[0] * 1.15, cy - radii[0] * .55, S.hair, .5)
    if wide:
        _stack(d, (.08 if not mir else .5) * W, (H - 3.9) / 2, .42 * W, "l", S, th, ts, closing)
    else:
        _stack(d, .1 * W, 3.6, .8 * W, "ctr", S, 1.3, ts - 2, closing, sub_h=.5)


def f_arch(d, W, H, mir, S, wide, ts, th, closing):
    """아치 창 — 사진 자리 + 어긋난 헤어라인 아치"""
    adj = {"adj1": 50000, "adj2": 0}
    if wide:
        aw, ah = .3 * W, .8 * H
        ax = (.6 if not mir else .1) * W
        ay = .1 * H
        dx = .32 * (1 if not mir else -1)
        d.shape(SH.ROUND_2_SAME_RECTANGLE, ax + dx, ay + .3, aw, ah, fill=None, line=S.hair, lw=1, adj=adj, name="어긋난 아치 선")
        d.shape(SH.ROUND_2_SAME_RECTANGLE, ax - .1, ay - .1, aw + .2, ah + .2, fill=("alpha", S.panel, 100), line=S.hair, lw=.5, adj=adj, name="아치 틀")
        d.shape(SH.ROUND_2_SAME_RECTANGLE, ax, ay, aw, ah, fill=d.pfill, adj=adj, text="사진을 넣어 주세요", tsize=11, tcolor="mute", name="사진 바탕")
        d.ph("pic", 13, "사진", ax, ay, aw, ah, geom="arch", prompt="사진을 넣으려면 아이콘을 누르세요", sz=11, color="mute")
        dot(d, ax + (aw + .1 if not mir else -.1), ay + ah - .6, .32, S.blk, name="포인트 원")
        _stack(d, (.08 if not mir else .5) * W, (H - 3.9) / 2, .42 * W, "l", S, th, ts, closing)
    else:
        aw, ah = .38 * W, .44 * H
        ax, ay = (W - aw) / 2, .07 * H
        d.shape(SH.ROUND_2_SAME_RECTANGLE, ax + .3, ay + .25, aw, ah, fill=None, line=S.hair, lw=1, adj=adj, name="어긋난 아치 선")
        d.shape(SH.ROUND_2_SAME_RECTANGLE, ax, ay, aw, ah, fill=d.pfill, adj=adj, text="사진", tsize=10, tcolor="mute", name="사진 바탕")
        d.ph("pic", 13, "사진", ax, ay, aw, ah, geom="arch", prompt="사진", sz=10, color="mute")
        _stack(d, .1 * W, .55 * H, .8 * W, "ctr", S, 1.25, ts - 2, closing, sub_h=.5)


def f_editorial(d, W, H, mir, S, wide, ts, th, closing):
    """에디토리얼 — 굵은 선 + 가는 선, 크게 걸친 원, 아래 도장 같은 마름모"""
    m = .8 if wide else .6
    hl(d, m, .62, W - m, .62, S.t1 if S.dark else "deep", 3)
    hl(d, m, .72, W - m, .72, S.hair, .5)
    hl(d, m, H - .62, W - m, H - .62, S.hair, .5)
    hl(d, m, H - .72, W - m, H - .72, S.t1 if S.dark else "deep", 3)
    if wide:
        R = 3.6
        cx = W - .2 if not mir else .2
        ring(d, cx, H * .5, R, S.hair, .75)
        ring(d, cx, H * .5, R * .72, S.hair, .5)
        diamond(d, cx - (R * .72 if not mir else -R * .72), H * .5, .16, S.blk)
    else:
        diamond(d, W / 2, H - 1.5, .2, S.blk)
        hl(d, W / 2 - 1.2, H - 1.5, W / 2 - .3, H - 1.5, S.hair, .5)
        hl(d, W / 2 + .3, H - 1.5, W / 2 + 1.2, H - 1.5, S.hair, .5)
    if wide:
        _stack(d, (.08 if not mir else .42) * W, (H - 3.9) / 2, .5 * W, "l", S, th, ts + 2, closing)
    else:
        _stack(d, .1 * W, 1.45, .8 * W, "l", S, 1.6, ts, closing, sub_h=.6)


def f_minimal(d, W, H, mir, S, wide, ts, th, closing):
    """미니멀 — 세로 헤어라인 하나와 작은 마름모, 넉넉한 여백"""
    x = (.12 if not mir else .88) * W
    hl(d, x, .1 * H, x, .9 * H, S.hair, .75)
    diamond(d, x, .5 * H, .18, S.blk)
    d.shape(SH.RECTANGLE, x - .07, .1 * H - .1, .14, .14, fill=S.hair, name="윗 표시")
    d.shape(SH.RECTANGLE, x - .07, .9 * H - .04, .14, .14, fill=S.hair, name="아랫 표시")
    if wide:
        tx = (.2 if not mir else .1) * W
        _stack(d, tx, (H - 3.9) / 2 + .2, .6 * W, "l", S, th, ts, closing)
    else:
        _stack(d, .22 * W if not mir else .08 * W, 1.6, .7 * W, "l", S, 1.6, ts, closing, sub_h=.6)


def f_glass(d, W, H, mir, S, wide, ts, th, closing):
    """전면 사진 + 유리판(반투명 판과 헤어라인 테두리)"""
    d.shape(SH.RECTANGLE, 0, 0, W, H, fill=d.pfill, name="사진 바탕")
    d.text(W * .1, H * .08, W * .8, .4, "사진을 넣어 주세요 (전체 화면)", size=12, color="mute", align="c", anchor="m", name="사진 안내")
    d.ph("pic", 13, "전체 사진", 0, 0, W, H, geom="rect", prompt="전체 화면 사진 — 아이콘을 눌러 넣으세요", sz=11, color="mute")
    fill = ("alpha", "deep2", 80) if S.dark else ("alpha", "white", 84)
    if wide:
        pw, ph_ = .46 * W, .74 * H
        px = (.07 if not mir else .47) * W
        py = (H - ph_) / 2
        d.shape(SH.RECTANGLE, px, py, pw, ph_, fill=fill, shadow="lift", name="유리판")
        box_o(d, px + .14, py + .14, pw - .28, ph_ - .28, S.hair, .75, "유리판 선")
        _stack(d, px + .55, py + .45, pw - 1.1, "l", S, 1.55, ts - 2, closing, sub_h=.7, extra_at=(px + .55, py + .45 + .55 + 1.55 + .7, pw - 1.1, .7))
    else:
        py, ph_ = .46 * H, .5 * H
        d.shape(SH.RECTANGLE, .06 * W, py, .88 * W, ph_, fill=fill, shadow="lift", name="유리판")
        box_o(d, .06 * W + .12, py + .12, .88 * W - .24, ph_ - .24, S.hair, .75, "유리판 선")
        _stack(d, .1 * W, py + .2, .8 * W, "ctr", S, 1.2, ts - 4, closing, sub_h=.5, extra_at=(.1 * W, py + .2 + .55 + 1.2 + .5, .8 * W, .5))


def f_stripes(d, W, H, mir, S, wide, ts, th, closing):
    """굵기가 다른 색 막대 — 화려하고 기하학적인 한쪽 면"""
    cols = [S.blk, "accent", "gold", "soft" if not S.dark else "main", "sky"]
    if wide:
        widths = [1.5, .85, .5, .3, .15]
        x = 0 if not mir else W
        for k, wd in enumerate(widths):
            xx = x if not mir else x - wd
            d.shape(SH.RECTANGLE, xx, 0, wd, H, fill=cols[k], name=f"막대 {k + 1}")
            x = x + wd if not mir else x - wd
        _vword(d, (.3 if not mir else W - 1.2), .12 * H, .9, .76 * H, S.onblk, 40)
        tx = .3 * W if not mir else .08 * W
        _stack(d, tx, (H - 3.9) / 2, .62 * W, "l", S, th, ts, closing)
    else:
        heights = [.8, .45, .25, .14, .08]
        y = 0
        for k, hh in enumerate(heights):
            d.shape(SH.RECTANGLE, 0, y, W, hh, fill=cols[k], name=f"막대 {k + 1}")
            y += hh
        _stack(d, .1 * W, 2.4, .8 * W, "ctr", S, 1.5, ts, closing, sub_h=.55)


def f_diamonds(d, W, H, mir, S, wide, ts, th, closing):
    """마름모 띠(하를리퀸) — 아래쪽에 깔리는 다이아몬드 무늬"""
    s = .62 if wide else .5
    n = int(W / s) + 2
    cols = [S.blk, "accent", S.hair, "sky"]
    with d.group("마름모 띠"):
        for row in range(2):
            y = H - s * (1.0 - row * .5) - .0
            for c in range(n):
                x = c * s - (s / 2 if row else 0)
                fill = cols[(c + row * 2) % 4]
                d.shape(SH.DIAMOND, x, y - s / 2, s, s, fill=fill if (c + row) % 3 else None, line=S.hair, lw=.5, alpha=70 if (c + row) % 3 else None)
    hl(d, .8 if wide else .6, .62, W - (.8 if wide else .6), .62, S.hair, .75)
    diamond(d, W / 2, .62, .2, S.blk)
    if wide:
        _stack(d, .15 * W, 1.3, .7 * W, "ctr", S, 1.55, ts, closing, sub_h=.7, extra_at=(.2 * W, 1.3 + .55 + 1.55 + .7, .6 * W, .6))
    else:
        _stack(d, .1 * W, 1.55, .8 * W, "ctr", S, 1.4, ts - 2, closing, sub_h=.55, extra_at=(.15 * W, 1.55 + .55 + 1.4 + .55, .7 * W, .6))


def f_layers(d, W, H, mir, S, wide, ts, th, closing):
    """유리 레이어 — 기울어진 반투명 판 세 장이 겹쳐지는 현대적 구도"""
    cx = (.76 if not mir else .24) * W if wide else W / 2
    cy = H * .48 if wide else 1.95
    w, h = (3.6, 4.6) if wide else (2.5, 2.6)
    specs = (("main", 60, -10, -.7, .3), ("accent", 55, 6, 0, 0), (("grad", "main", "accent", 45), 80, -3, .5, -.35))
    for k, (f, a, rot, dx, dy) in enumerate(specs):
        if isinstance(f, tuple):
            d.shape(SH.RECTANGLE, cx - w / 2 + dx, cy - h / 2 + dy, w, h, fill=f, rot=rot, shadow="soft", name=f"유리판 {k + 1}")
        else:
            d.shape(SH.RECTANGLE, cx - w / 2 + dx, cy - h / 2 + dy, w, h, fill=f, alpha=a, rot=rot, name=f"유리판 {k + 1}")
    box_o(d, cx - w / 2 - .25, cy - h / 2 - .25, w + .5, h + .5, S.hair, .75, "바깥 선", rot=-3)
    ring(d, cx + w * .3, cy - h * .3, .42, "white" if not S.dark else S.t1, 1.5, name="포인트 고리")
    if wide:
        _stack(d, (.08 if not mir else .5) * W, (H - 3.9) / 2, .42 * W, "l", S, th, ts, closing)
    else:
        _stack(d, .1 * W, 3.6, .8 * W, "ctr", S, 1.3, ts - 2, closing, sub_h=.5)


def f_ribbon(d, W, H, mir, S, wide, ts, th, closing):
    """가로 리본 띠 — 제목을 띠 위에 올리는 당당한 구도"""
    th = 1.5 if wide else 1.25
    y = (H - 3.4) / 2 if wide else 1.2
    band_y, band_h = y + .3, th + .17
    d.shape(SH.RECTANGLE, 0, band_y, W, band_h, fill=("grad", S.blk, "accent", 0) if S.blk == "main" else S.blk, name="리본 띠")
    for yy in (band_y + .07, band_y + band_h - .07):
        hl(d, 0, yy, W, yy, ("alpha", S.onblk, 45), .75)
    for sx in (.6, W - .6):
        diamond(d, sx, band_y + band_h / 2, .2, S.onblk)
    _stack(d, W * .12, y, W * .76, "ctr", S, th, ts, closing, sub_h=.7 if wide else .5, tcol=S.onblk)


def f_squares(d, W, H, mir, S, wide, ts, th, closing):
    """겹사각 — 회전한 정사각형이 겹겹이 쌓이는 기하 구도"""
    cx = (.75 if not mir else .25) * W if wide else W / 2
    cy = H / 2 if wide else 1.95
    s0 = 4.4 if wide else 2.6
    for k in range(6):
        s = s0 * (1 - k * .15)
        c = S.hair if k % 2 == 0 else "accent"
        if k == 3:
            d.shape(SH.RECTANGLE, cx - s / 2, cy - s / 2, s, s, fill=S.blk, alpha=70, rot=k * 15, name="채운 사각")
        else:
            box_o(d, cx - s / 2, cy - s / 2, s, s, c, 1.25 if k == 0 else .75, rot=k * 15)
    dot(d, cx, cy, s0 * .03, S.hair)
    if wide:
        _stack(d, (.08 if not mir else .5) * W, (H - 3.9) / 2, .42 * W, "l", S, th, ts, closing)
    else:
        _stack(d, .1 * W, 3.6, .8 * W, "ctr", S, 1.3, ts - 2, closing, sub_h=.5)


def f_pill(d, W, H, mir, S, wide, ts, th, closing):
    """알약·원 모음 — 위트 있고 경쾌한 색 덩어리(세련된 팔레트로)"""
    ox = (W - 4.4) if (wide and not mir) else .4
    oy = .5
    if not wide:
        ox, oy = W / 2 - 1.8, .45
    with d.group("색 덩어리"):
        d.shape(SH.ROUNDED_RECTANGLE, ox, oy, 4.0 if wide else 3.0, 1.5 if wide else 1.1, fill="main", adj={"adj": 50000}, name="알약 1")
        d.shape(SH.ROUNDED_RECTANGLE, ox + (.9 if wide else .7), oy + (1.3 if wide else 1.0), 3.2 if wide else 2.4, 1.3 if wide else 1.0, fill="accent", adj={"adj": 50000}, name="알약 2")
        dot(d, ox + (.5 if wide else .4), oy + (2.2 if wide else 1.7), .55 if wide else .4, "gold", name="원 1")
        d.shape(SH.OVAL, ox + (3.0 if wide else 2.2), oy + (2.6 if wide else 2.0), 1.0 if wide else .75, 1.0 if wide else .75, fill=None, line=S.hair, lw=2, name="고리")
        ornament(d, 2, ox + (3.3 if wide else 2.4), oy + .75 if wide else oy + .55, .45 if wide else .35, d.onmain, "accent")
    if wide:
        d.shape(SH.ROUNDED_RECTANGLE, W - 4.6 if mir else .5, H - .9, 2.2, .26, fill="sky", adj={"adj": 50000}, name="작은 알약")
        _stack(d, (.08 if not mir else .5) * W, (H - 3.9) / 2 + .6, .42 * W, "l", S, th, ts, closing)
    else:
        _stack(d, .1 * W, 3.6, .8 * W, "ctr", S, 1.3, ts - 2, closing, sub_h=.5)


FAM = [f_deco_fan, f_gold_frame, f_split, f_monogram, f_hex, f_cyber, f_orbit, f_arch, f_editorial, f_minimal, f_glass, f_stripes,
       f_diamonds, f_layers, f_ribbon, f_squares, f_pill]


# ───────────────────────── 본문 10틀
def page_bg(d):
    cfg = d.cfg
    tone = "tint" if (cfg["tone"] == "tint" and not d.pal["night"]) else "light"
    return bg_spec(d, tone, cfg["bgt"], cfg["pat"])


def body_layouts(d):
    """본문·본문+사진·한 문장 레이아웃을 같은 틀로 그립니다. d.rect 에 내용 영역이 들어갑니다."""
    cfg = d.cfg
    for key in ("body", "photo", "quote"):
        d.layout_begin(key, page_bg(d))
        d.rect = _frame(d, cfg["cf"], key)
        if key == "photo":
            l, t, r, b = d.rect
            for j in range(8):
                d.ph("pic", 13 + j, f"사진 {j + 1}", l + (j % 4) * 1.5, b - 3.0 + (j // 4) * 1.5, 1.3, 1.3, geom="round", prompt="사진", sz=10, color="mute", mute_fill=d.pfill)
        d.layout_end()


def _label(d, x, y, w, algn, c="deep", h=.34):
    d.ph("body", 10, "영문 라벨", x, y, w, h, sz=11, color=c, algn=algn, spc=300, caps=True, prompt="LABEL")


def _title(d, x, y, w, algn, sz, c="deep", h=.85):
    d.ph("title", 0, "제목", x, y, w, h, sz=sz, color=c, bold=d.cfg["tbold"], algn=algn, major=True, prompt="제목")


def _frame(d, cf, key):
    W, H, wide, mir = d.W, d.H, d.wide, d.cfg["mir"]
    ts = 28 if wide else 24
    quote = key == "quote"
    m = .8 if wide else .6
    rect = (m, 2.0 if wide else 1.8, W - m, H - .75)
    hair = d.hair_l
    al = "l" if not mir else "r"
    if cf == 0:  # 클래식 가운데
        _label(d, .5, .38, W - 1, "ctr")
        if not quote:
            _title(d, .6, .7, W - 1.2, "ctr", ts)
            hl(d, W / 2 - 1.3, 1.58, W / 2 + 1.3, 1.58, hair, .5)
            hl(d, W / 2 - 1.3, 1.64, W / 2 + 1.3, 1.64, hair, .5)
            diamond(d, W / 2, 1.61, .14, "main")
        hl(d, W / 2 - 1.2, H - .45, W / 2 - .4, H - .45, hair, .5)
        hl(d, W / 2 + .4, H - .45, W / 2 + 1.2, H - .45, hair, .5)
        d.ph("num", 12, "쪽 번호", W / 2 - .4, H - .62, .8, .36, sz=10, color="mute", algn="ctr", spc=200)
    elif cf == 1:  # 왼쪽 미니멀
        _label(d, m, .4, W - 2 * m - 1.2, al)
        if not quote:
            _title(d, m, .72, W - 2 * m, al, ts)
            hl(d, m, 1.72, W - m, 1.72, hair, .5, name="머리말 선")
        nx = W - m - 1.0 if not mir else m
        d.ph("num", 12, "쪽 번호", nx, .4, 1.0, .34, sz=11, color="main" if d.pal["numc"] == "main" else "deep", algn="r" if not mir else "l", bold=True, spc=200)
    elif cf == 2:  # 옆 띠
        bw = .85 if wide else .6
        bx = 0 if not mir else W - bw
        d.shape(SH.RECTANGLE, bx, 0, bw, H, fill=("grad", "main", "accent", 90), name="옆 띠")
        d.ph("body", 30, "세로 글씨", bx + .1, 1.0, bw - .2, H - 2.4, sz=20 if wide else 16, color=d.onmain, algn="ctr", vert="vert270", spc=900, major=True, prompt="세로 글씨")
        d.ph("num", 12, "쪽 번호", bx, H - .75, bw, .5, sz=12, color=d.onmain, algn="ctr", bold=True)
        tx = bw + .7 if not mir else .7
        _label(d, tx, .4, W - bw - 1.4, "l")
        if not quote:
            _title(d, tx, .72, W - bw - 1.4, "l", ts)
            hl(d, tx, 1.72, tx + 1.4, 1.72, "accent", 2.5)
            hl(d, tx + 1.4, 1.72, W - (.7 if not mir else bw + .7), 1.72, hair, .5)
        rect = (tx, rect[1], (W - .7) if not mir else (W - bw - .7), rect[3])
    elif cf == 3:  # 머리 띠
        bh = 1.5 if not quote else .5
        d.shape(SH.RECTANGLE, 0, 0, W, bh, fill=("grad", "deep2", "deep", 0) if not d.pal["night"] else "deep2", name="머리 띠")
        hl(d, 0, bh, W, bh, "gold" if d.hair_d == "gold" else d.hair_d, 1.5)
        if not quote:
            _title(d, m, .35, W * .64, "l", ts, c=d.snow)
            _label(d, W * .64 + m, .55, W - W * .64 - 2 * m, "r", c="gold" if d.hair_d == "gold" else d.hair_d)
        else:
            _label(d, m, .08, W - 2 * m, "l", c="gold" if d.hair_d == "gold" else d.hair_d)
        d.ph("num", 12, "쪽 번호", W - 1.8, H - .6, 1.0, .4, sz=10, color="mute", algn="r", spc=200)
    elif cf == 4:  # 에디토리얼 큰 번호
        d.ph("num", 12, "쪽 번호", m - .1, .3 if not quote else .25, 1.7, 1.2, sz=48 if wide else 40, color="main" if d.pal["numc"] == "main" else "deep", algn="l", major=True, anchor="ctr")
        tx = m + 1.9
        _label(d, tx, .42, W - tx - m, "l")
        if not quote:
            _title(d, tx, .74, W - tx - m, "l", ts)
        hl(d, tx - .15, .45, tx - .15, 1.45, hair, .75)
        hl(d, m, 1.72, W - m, 1.72, "deep", 2.25)
        hl(d, m, 1.78, W - m, 1.78, hair, .5)
    elif cf == 5:  # 액자
        box_o(d, .3, .3, W - .6, H - .6, hair, .75, "바깥 선")
        box_o(d, .38, .38, W - .76, H - .76, hair, .25, "안쪽 선")
        for x, y in ((.3, .3), (W - .3, .3), (.3, H - .3), (W - .3, H - .3)):
            diamond(d, x, y, .16, "main", name="모서리 장식")
        _label(d, .6, .52, W - 1.2, "ctr")
        if not quote:
            _title(d, .8, .82, W - 1.6, "ctr", ts - 2, h=.8)
        d.ph("num", 12, "쪽 번호", W / 2 - .4, H - .72, .8, .34, sz=10, color="mute", algn="ctr", spc=200)
    elif cf == 6:  # 사이버 HUD
        L, mm = .45, .32
        for (x, y, sx, sy) in ((mm, mm, 1, 1), (W - mm, mm, -1, 1), (mm, H - mm, 1, -1), (W - mm, H - mm, -1, -1)):
            hl(d, x, y, x + sx * L, y, "main", 1.75)
            hl(d, x, y, x, y + sy * L, "main", 1.75)
        d.shape(SH.RECTANGLE, m, .47, .08, .2, fill="accent", name="라벨 표시")
        _label(d, m + .15, .4, W - 2 * m - 1.4, "l")
        if not quote:
            _title(d, m, .72, W - 2 * m, "l", ts)
        hl(d, m, 1.72, W - m, 1.72, hair, .75)
        for k in range(int((W - 2 * m) / .5) + 1):
            hl(d, m + k * .5, 1.72, m + k * .5, 1.8, hair, .5)
        d.ph("num", 12, "쪽 번호", W - m - 1.0, H - .62, 1.0, .36, sz=11, color="main" if d.pal["numc"] == "main" else "deep", algn="r", bold=True, spc=200)
    elif cf == 7:  # 아르데코 모서리 부채
        for sx, qq in ((.3, "l"), (W - .3, "r")):
            for r in (.5, .9, 1.3):
                arc_up(d, sx, .3, r, hair, .75, quarter=qq)
            for a in (10, 30, 50, 70):
                ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
                dx = 1 if qq == "l" else -1
                hl(d, sx + dx * ca * .2, .3 + sa * .2, sx + dx * ca * 1.3, .3 + sa * 1.3, hair, .5)
        _label(d, 1.6, .4, W - 3.2, "ctr")
        if not quote:
            _title(d, 1.6, .72, W - 3.2, "ctr", ts)
            hl(d, W / 2 - 1.6, 1.66, W / 2 - .2, 1.66, hair, .75)
            hl(d, W / 2 + .2, 1.66, W / 2 + 1.6, 1.66, hair, .75)
            diamond(d, W / 2, 1.66, .13, "main")
        d.ph("num", 12, "쪽 번호", W / 2 - .4, H - .6, .8, .36, sz=10, color="mute", algn="ctr", spc=200)
    elif cf == 8:  # 색 탭
        d.shape(SH.RECTANGLE, 0, .72, .26, .85, fill="main", name="색 탭") if not mir else d.shape(SH.RECTANGLE, W - .26, .72, .26, .85, fill="main", name="색 탭")
        _label(d, m, .38, W - 2 * m - 1.6, al)
        if not quote:
            _title(d, m, .72, W - 2 * m - 1.2, al, ts)
            hl(d, m, 1.68, m + 1.2, 1.68, "main", 2.5) if not mir else hl(d, W - m - 1.2, 1.68, W - m, 1.68, "main", 2.5)
            hl(d, m + 1.2 if not mir else m, 1.68, W - m if not mir else W - m - 1.2, 1.68, hair, .5)
        cx0 = W - m - .9 if not mir else m
        d.shape(SH.ROUNDED_RECTANGLE, cx0, .42, .9, .42, fill=None, line=hair, lw=.75, adj={"adj": 50000}, name="쪽 번호 알약")
        d.ph("num", 12, "쪽 번호", cx0, .42, .9, .42, sz=11, color="deep", algn="ctr", bold=True, spc=100)
    else:  # 9 알약 제목
        _label(d, .5, .3, W - 1, "ctr")
        pw = min(W - 1.6, 6.4 if wide else 5.4)
        if not quote:
            d.shape(SH.ROUNDED_RECTANGLE, (W - pw) / 2, .65, pw, .95, fill="white", line=hair, lw=1.25, adj={"adj": 50000}, shadow="soft", name="제목 알약")
            _title(d, (W - pw) / 2 + .3, .65, pw - .6, "ctr", ts - 2, h=.95)
        for k, (cx2, c) in enumerate(((.8, "main"), (1.2, "accent"), (W - 1.2, "accent"), (W - .8, "main"))):
            dot(d, cx2, 1.12, .09, c, name="점")
        d.shape(SH.OVAL, W / 2 - .3, H - .75, .6, .6, fill="main", name="쪽 번호 원")
        d.ph("num", 12, "쪽 번호", W / 2 - .3, H - .75, .6, .6, sz=11, color=d.onmain, algn="ctr", bold=True)
    if quote:
        _quote_extra(d, cf)
    return rect


def _quote_extra(d, cf):
    """한 문장 레이아웃 — 큰 따옴표 글자와 가운데 큰 글"""
    W, H = d.W, d.H
    cx = W / 2
    ornament(d, 1, cx, H * .24, .5, d.hair_l, "accent", "따옴표 장식")
    d.ph("title", 0, "한 문장", W * .12, H * .34, W * .76, H * .34, sz=34 if d.wide else 26, color="deep", bold=d.cfg["tbold"], algn="ctr", major=True, lnspc=130, prompt="한 문장으로 말하면")
    hl(d, cx - .6, H * .78, cx + .6, H * .78, d.hair_l, .75)
    diamond(d, cx, H * .78, .13, "main")
