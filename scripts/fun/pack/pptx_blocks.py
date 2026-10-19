"""PPT 슬라이드 조각(표지·카드·타임라인·사진 칸·두 칸 …) — 항목 모듈이 이 조각을 조립합니다."""
from pptx.enum.shapes import MSO_SHAPE as SH


def cover(d, title, extra=(), message="", size=None):
    d.slide(cover=True)
    d.title(title, size=size or d.cover_size, align=d.cal)
    x, y, w, h = d.sbox
    d.text(x, y, w, 0.9, message, size=17 if d.W > d.H else 15, italic=True, color=d.pal["dark"], align=d.cal, name="한 줄 문구")
    if extra:
        d.text(x, y + 0.95, w, 1.0, list(extra), size=14 if d.W > d.H else 12, color="#666666", align=d.cal, name="안내 문구")


def heading(d, text, size=30):
    d.slide()
    d.title(text, size=size if d.W > d.H else 26)


def badge(d, x, y, n, dia=0.5, size=16):
    p = d.pal
    o = d.shape(SH.OVAL, x, y, dia, dia, fill=p["main"], name=f"번호 {n}")
    d._fill_text(o.text_frame, str(n), size, True, "#FFFFFF", "c", "m", False, 1.0, False)


def cards(d, items, y=None, h=None, size=16, head_size=18, numbered=True, fill=None):
    """items: [(제목, 내용(문자열 또는 리스트))] — 가로로 나란히."""
    p = d.pal
    l, t, r, b = d.rect
    y = t if y is None else y
    h = (b - t) if h is None else h
    n = len(items)
    gap = 0.25
    cw = (r - l - gap * (n - 1)) / n
    for k, (head, body) in enumerate(items):
        x = l + k * (cw + gap)
        d.box(x, y, cw, h, fill=fill or p["pale"], line=p["soft"], lw=1.25, name=f"카드 {k + 1}")
        off = 0.0
        if numbered:
            badge(d, x + 0.2, y + 0.2, k + 1)
            off = 0.65
        d.text(x + 0.15, y + 0.2 + off, cw - 0.3, 0.7, head, size=head_size, bold=True, color=p["dark"], anchor="m")
        d.text(x + 0.15, y + 0.95 + off, cw - 0.3, h - 1.1 - off, body, size=size, spacing=1.25)


def rows(d, items, y=None, h_each=0.95, size=15, head_size=18):
    """items: [(제목, 내용)] — 세로로 쌓는 번호 줄."""
    p = d.pal
    l, t, r, b = d.rect
    y = t if y is None else y
    for k, (head, body) in enumerate(items):
        yy = y + k * (h_each + 0.15)
        d.box(l, yy, r - l, h_each, fill=p["pale"], line=p["soft"], lw=1.0, name=f"줄 {k + 1}")
        badge(d, l + 0.2, yy + (h_each - 0.5) / 2, k + 1)
        d.text(l + 0.95, yy + 0.05, 3.0, h_each - 0.1, head, size=head_size, bold=True, color=p["dark"], anchor="m")
        d.text(l + 4.0, yy + 0.05, r - l - 4.2, h_each - 0.1, body, size=size, anchor="m")


def timeline(d, steps, y=None, size=15, head_size=18):
    """steps: [(때, 제목, 내용)] — 가로 타임라인."""
    p = d.pal
    l, t, r, b = d.rect
    y = (t + 1.7) if y is None else y
    n = len(steps)
    d.shape(SH.RECTANGLE, l, y + 0.2, r - l, 0.06, fill=p["soft"], name="타임라인 선")
    cw = (r - l) / n
    for k, (when, head, body) in enumerate(steps):
        cx = l + cw * k + cw / 2
        d.shape(SH.OVAL, cx - 0.22, y, 0.44, 0.44, fill=p["main"], line="#FFFFFF", lw=3, name=f"때 {k + 1}")
        d.text(cx - cw / 2 + 0.05, y - 0.7, cw - 0.1, 0.5, when, size=head_size - 2, bold=True, color=p["main"], align="c", anchor="b")
        d.text(cx - cw / 2 + 0.1, y + 0.6, cw - 0.2, 0.5, head, size=head_size, bold=True, color=p["dark"], align="c")
        d.text(cx - cw / 2 + 0.1, y + 1.15, cw - 0.2, 1.8, body, size=size, align="c", spacing=1.25)


def photo_grid(d, n_cols, n_rows, labels=None, y=None, h=None, shape="round"):
    l, t, r, b = d.rect
    y = t if y is None else y
    h = (b - t) if h is None else h
    gap = 0.2
    cw = (r - l - gap * (n_cols - 1)) / n_cols
    ch = (h - gap * (n_rows - 1)) / n_rows
    k = 0
    for i in range(n_rows):
        for j in range(n_cols):
            lab = (labels[k] if labels and k < len(labels) else f"사진 {k + 1}")
            d.photo(l + j * (cw + gap), y + i * (ch + gap), cw, ch, lab, size=12 if d.W > d.H else 10, shape=shape)
            k += 1


def two_col(d, left, right, y=None, h=None, size=15):
    """left/right: (제목, [줄…])"""
    p = d.pal
    l, t, r, b = d.rect
    y = t if y is None else y
    h = (b - t) if h is None else h
    gap = 0.4
    cw = (r - l - gap) / 2
    for k, (head, body) in enumerate((left, right)):
        x = l + k * (cw + gap)
        d.box(x, y, cw, h, fill=p["pale"] if k == 0 else p["soft"], line=p["soft"], name=f"{'왼쪽' if k == 0 else '오른쪽'} 칸")
        d.shape(SH.ROUNDED_RECTANGLE, x, y, cw, 0.7, fill=p["main"] if k == 0 else p["dark"], adj=0.25, name="칸 제목 바")
        d.text(x + 0.2, y, cw - 0.4, 0.7, head, size=18 if d.W > d.H else 16, bold=True, color="#FFFFFF", anchor="m")
        d.text(x + 0.25, y + 0.9, cw - 0.5, h - 1.0, body, size=size, bullet=True, spacing=1.3, space_after=6)


def person(d, x, y, w, h, role, lines, shape="oval"):
    """사진 칸 + 이름·소개 줄."""
    p = d.pal
    pd = min(w - 0.3, h * 0.5)
    d.photo(x + (w - pd) / 2, y, pd, pd, "사진", size=12, shape=shape)
    d.text(x, y + pd + 0.1, w, 0.45, role, size=16, bold=True, color=p["dark"], align="c")
    d.text(x + 0.1, y + pd + 0.6, w - 0.2, h - pd - 0.6, lines, size=12 if d.W > d.H else 11, color="#555555", align="c", spacing=1.2)


def note(d, text, y=None, size=11):
    l, t, r, b = d.rect
    d.text(l, (b - 0.1) if y is None else y, r - l, 0.4, text, size=size, color="#777777", italic=True, name="안내")
