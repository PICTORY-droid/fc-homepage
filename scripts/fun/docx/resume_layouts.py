"""이력서 5가지 양식 구조 — 같은 항목(resume_data)을 서로 완전히 다른 짜임으로 그립니다.
  1 정석형(칸 표) · 2 사이드바형 · 3 타임라인형(서체 중심) · 4 요약형(상단 띠 + 핵심 요약) · 5 카드형
params(0~3)로 머리글·폭·선 모양을 바꿔 포지션마다 다른 모양이 되게 합니다. 길이는 px (A4 = 794 x 1123)."""
import math

from docx.shared import Pt

from doc_blocks import (borders, count_hint, ct, fp, fr, new_doc, no_borders, row_height, rule, ruled, shade, spacer, table, tab_right, valign)
from resume_data import DATE_LABELS

NAMES = ["정석형", "사이드바형", "타임라인형", "요약형", "카드형"]
LEVEL = "○ ○ ○ ○ ○"


def widths_for(labels, cw):
    n = len(labels)
    first = 20 if labels[0] in DATE_LABELS else 100 / n
    rest = (100 - first) / (n - 1)
    w = [round(cw * first / 100)] + [round(cw * rest / 100)] * (n - 1)
    w[-1] += cw - sum(w)
    return w


def hint_line(labels):
    return " · ".join(labels)


# ------------------------------------------------------------------ 1 정석형
def r_classic(pos, sk, k):
    d = new_doc(f"이력서 · {pos['name']}", sk, (46, 52, 40, 52)); cw = 690
    head = ["center", "bar", "band", "accent"][k % 4]
    title = "이 력 서"
    if head == "center":
        fp(d, title, 26, True, sk["dark"], "center", after=2, font=sk["head"], spacing=10)
        fp(d, pos["en"], 9, None, sk["gray"], "center", after=10, spacing=2)
    elif head == "bar":
        p = fp(d, "", after=8); fr(p, title, 21, True, sk["dark"], sk["head"], 4); tab_right(p, cw); fr(p, "\t" + pos["en"], 9, None, sk["gray"])
        from docx_kit import para_border
        para_border(p, "bottom", sk["mid"], 18, 4)
    elif head == "band":
        t = table(d, [cw], 1, margin=(110, 200)); c = t.rows[0].cells[0]; shade(c, sk["dark"])
        p = ct(c, "", 20); fr(p, title, 20, True, "FFFFFF", sk["head"], 4); tab_right(p, cw - 40); fr(p, "\t" + pos["en"], 9, None, "DDE6F0"); valign(c, "center")
        spacer(d, 8)
    else:
        from docx_kit import para_border
        p = fp(d, "", after=8); fr(p, title, 22, True, sk["dark"], sk["head"], 2); fr(p, "    " + pos["en"], 9.5, None, sk["gray"])
        para_border(p, "left", sk["mid"], 60, 8); p.paragraph_format.left_indent = Pt(8)
    # 인적사항
    f = pos["person"]; rows = math.ceil(len(f) / 2)
    lab = 80
    if pos["photo"]:
        w = [113, lab, 217, lab, cw - 113 - lab * 2 - 217]; rh = max(36, math.ceil(152 / rows))
        t = table(d, w, rows, sk["line"])
        ph = t.cell(0, 0).merge(t.cell(rows - 1, 0)); ct(ph, "사진\n(3×4cm)", 9, None, sk["hint"], "center", where="center")
        base = 1
    else:
        w = [lab, 265, lab, cw - lab * 2 - 265]; rh = 36
        t = table(d, w, rows, sk["line"]); base = 0
    for ri in range(rows):
        row_height(t.rows[ri], rh)
        for ci in range(2):
            idx = ri * 2 + ci
            if idx >= len(f):
                continue
            lc = t.cell(ri, base + ci * 2); shade(lc, sk["soft"]); ct(lc, f[idx], 9.5, True, sk["dark"], "center", where="center")
            valign(t.cell(ri, base + ci * 2 + 1), "center")
        if len(f) % 2 and ri == rows - 1:
            t.cell(ri, base + 1).merge(t.cell(ri, base + 3))
    # 항목
    for s in pos["sections"]:
        sec_head(d, s["title"], sk, cw, 12, "left")
        classic_block(d, s, sk, cw)
    fp(d, "위 내용은 사실과 다름이 없음을 확인합니다.", 10, None, None, "center", before=14)
    fp(d, "20        년        월        일        작성자 :  ____________________  (서명)", 10, None, None, "center", before=6)
    return d


def sec_head(d, text, sk, cw, before=11, style="left"):
    from docx_kit import para_border
    p = fp(d, "", before=before, after=4, keep_next=True)
    fr(p, text, 11, True, sk["dark"], sk["head"])
    if style == "left":
        para_border(p, "left", sk["mid"], 36, 6); p.paragraph_format.left_indent = Pt(7)
    elif style == "under":
        para_border(p, "bottom", sk["mid"], 8, 3)
    return p


def label_cell(c, text, sk):
    shade(c, sk["soft"]); ct(c, text, 9.5, True, sk["dark"], "center", where="center")


def classic_block(d, s, sk, cw):
    kind = s["kind"]
    if kind in ("G", "S"):
        labels = s["labels"]; w = widths_for(labels, cw) if kind == "G" else [round(cw * v / 100) for v in (24, 46, 30)]
        w[-1] += cw - sum(w)
        t = table(d, w, s["rows"] + 1, sk["line"])
        for c, lab in zip(t.rows[0].cells, labels):
            label_cell(c, lab, sk)
        row_height(t.rows[0], 28)
        for r in t.rows[1:]:
            row_height(r, 31)
            for c in r.cells:
                valign(c, "center")
            if kind == "S":
                ct(r.cells[-1], LEVEL, 10, None, sk["mid"], "center", where="center")
    elif kind == "K":
        t = table(d, [110, cw - 110], 1, sk["line"]); label_cell(t.rows[0].cells[0], "해당 항목", sk); row_height(t.rows[0], 34)
        ct(t.rows[0].cells[1], "   ".join(f"□ {i}" for i in s["items"]), 9.5, where="center")
    elif kind == "F":
        t = table(d, [cw], 1, sk["line"]); row_height(t.rows[0], s["height"])
    else:
        for n in range(s["rows"]):
            f = s["fields"]; lab = 92; vw = (cw - 2 * lab) // 2
            t = table(d, [lab, vw, lab, cw - 2 * lab - vw], len(f) // 2 + 1 + (len(f) % 2), sk["line"])
            pairs = [f[i:i + 2] for i in range(0, len(f), 2)]
            for ri, pr in enumerate(pairs):
                row_height(t.rows[ri], 31)
                for ci, lbl in enumerate(pr):
                    label_cell(t.cell(ri, ci * 2), lbl, sk); valign(t.cell(ri, ci * 2 + 1), "center")
                if len(pr) == 1:
                    t.cell(ri, 1).merge(t.cell(ri, 3))
            last = t.rows[len(pairs)]; row_height(last, 80)
            label_cell(last.cells[0], s["tall"], sk); last.cells[1].merge(last.cells[3])
            spacer(d, 5)


# ------------------------------------------------------------------ 2 사이드바형
def r_sidebar(pos, sk, k):
    left = k % 2 == 0
    sw = 218 if (k // 2) % 2 == 0 else 238
    m = (0, 0, 0, 0)
    d = new_doc(f"이력서 · {pos['name']}", sk, (34, 34, 34, 34)); cw = 794 - 68
    mw = cw - sw
    t = table(d, [sw, mw] if left else [mw, sw], 1, None, margin=(0, 0))
    side, main = (t.cell(0, 0), t.cell(0, 1)) if left else (t.cell(0, 1), t.cell(0, 0))
    shade(side, sk["soft"]) if k % 3 else shade(side, sk["tint"])
    for c in (side, main):
        valign(c, "top")
    # 사이드: 이름·연락처·기술·체크
    pad = 18
    p = ct(side, "이  름", 22, True, sk["dark"], before=24, font=sk["head"], line=1.1); p.paragraph_format.left_indent = Pt(pad)
    p = ct(side, pos["name"], 10.5, True, sk["mid"], before=2); p.paragraph_format.left_indent = Pt(pad)
    p = ct(side, pos["en"], 7.5, None, sk["gray"], after=14, spacing=1.5); p.paragraph_format.left_indent = Pt(pad)
    if pos["photo"]:
        pt = ct(side, "[ 사진  3×4cm ]", 8.5, None, sk["hint"], after=10); pt.paragraph_format.left_indent = Pt(pad)
    side_head(side, "연락처", sk, pad)
    for f in pos["person"][1:]:
        p = ct(side, f.replace(" ", ""), 7.5, True, sk["gray"], before=5); p.paragraph_format.left_indent = Pt(pad)
        p = ct(side, "입력하세요", 9, None, sk["hint"]); p.paragraph_format.left_indent = Pt(pad)
    for s in pos["sections"]:
        if s["kind"] == "S":
            side_head(side, s["title"], sk, pad)
            for _ in range(min(s["rows"], 5)):
                p = ct(side, "", 9, before=4); p.paragraph_format.left_indent = Pt(pad)
                fr(p, "기술 · 도구  ", 9, None, sk["hint"]); fr(p, "●●●○○", 8, None, sk["mid"])
        elif s["kind"] == "K":
            side_head(side, s["title"], sk, pad)
            for it in s["items"]:
                p = ct(side, f"□  {it}", 9, before=3); p.paragraph_format.left_indent = Pt(pad)
    ct(side, "", 6, after=20)
    # 본문
    p = ct(main, "한 줄 소개", 8, True, sk["gray"], before=26, spacing=1.5); p.paragraph_format.left_indent = Pt(22); p.paragraph_format.right_indent = Pt(20)
    p = ct(main, f"{pos['name']}로서 어떤 가치를 만드는 사람인지 두 줄로 적어 주세요.", 10.5, None, sk["hint"], after=4); p.paragraph_format.left_indent = Pt(22); p.paragraph_format.right_indent = Pt(20)
    for s in pos["sections"]:
        if s["kind"] in ("S", "K"):
            continue
        main_head(main, s["title"], sk)
        if s["kind"] == "G":
            for _ in range(min(s["rows"], 4)):
                entry_par(main, s["labels"], sk, 22, 106)
        elif s["kind"] == "F":
            for _ in range(max(3, s["height"] // 30)):
                p = ct(main, "", 10, before=0); p.paragraph_format.left_indent = Pt(22); p.paragraph_format.right_indent = Pt(20)
                exact(p, 24); bottom_line(p, sk["line"])
        else:
            for _ in range(s["rows"]):
                f = s["fields"]
                p = ct(main, f[0], 10.5, True, sk["dark"], before=7); p.paragraph_format.left_indent = Pt(22)
                p = ct(main, " · ".join(f[1:]), 8.5, None, sk["hint"]); p.paragraph_format.left_indent = Pt(22)
                p = ct(main, s["tall"], 8, True, sk["mid"], before=3); p.paragraph_format.left_indent = Pt(22)
                for _ in range(3):
                    q = ct(main, "", 10); q.paragraph_format.left_indent = Pt(22); q.paragraph_format.right_indent = Pt(20); exact(q, 24); bottom_line(q, sk["line"])
    ct(main, "", 6, after=18)
    return d


def exact(p, px_):
    from docx_kit import exact_height
    exact_height(p, px_)


def bottom_line(p, color):
    from docx_kit import para_border
    para_border(p, "bottom", color, 4, 1)


def side_head(cell, text, sk, pad):
    p = ct(cell, text, 8.5, True, sk["dark"], before=16, after=2, spacing=1.5); p.paragraph_format.left_indent = Pt(pad); bottom_line(p, sk["mid"])
    p.paragraph_format.right_indent = Pt(pad)


def main_head(cell, text, sk):
    p = ct(cell, text, 12, True, sk["dark"], before=16, after=4, font=sk["head"]); p.paragraph_format.left_indent = Pt(22); p.paragraph_format.right_indent = Pt(20)
    bottom_line(p, sk["mid"])


def entry_par(cell, labels, sk, indent, tab_px):
    """기간 | 제목 / 보조 줄 — 한 항목을 두 줄 문단으로 (왼쪽 칸 = 첫 라벨)."""
    p = ct(cell, "", 10, before=7)
    p.paragraph_format.left_indent = Pt(indent + tab_px * 0.75); p.paragraph_format.first_line_indent = Pt(-tab_px * 0.75)
    from docx.enum.text import WD_TAB_ALIGNMENT
    from docx.shared import Twips
    from docx_kit import px
    p.paragraph_format.tab_stops.add_tab_stop(Twips(px(tab_px + indent / 0.75)), WD_TAB_ALIGNMENT.LEFT)
    fr(p, labels[0], 8.5, None, sk["hint"]); fr(p, "\t" + (labels[1] if len(labels) > 1 else ""), 10.5, True, sk["dark"])
    q = ct(cell, " · ".join(labels[2:]) if len(labels) > 2 else "", 9, None, sk["hint"]); q.paragraph_format.left_indent = Pt(indent + tab_px * 0.75); q.paragraph_format.right_indent = Pt(20)
    r = ct(cell, "", 9); r.paragraph_format.left_indent = Pt(indent + tab_px * 0.75); r.paragraph_format.right_indent = Pt(20); exact(r, 20)


# ------------------------------------------------------------------ 3 타임라인형
def r_timeline(pos, sk, k):
    d = new_doc(f"이력서 · {pos['name']}", sk, (58, 64, 48, 64)); cw = 666
    rs = ["thick", "double", "thin", "none"][k % 4]
    fp(d, pos["en"], 8, None, sk["gray"], before=0, after=2, spacing=3)
    fp(d, "이  름", 30, True, sk["dark"], after=2, font=sk["head"], spacing=4)
    p = fp(d, "", after=8); fr(p, f"{pos['name']}", 11, None, sk["mid"], sk["head"])
    from docx_kit import para_border
    para_border(p, "bottom", sk["dark"], {"thick": 24, "double": 12, "thin": 6, "none": 2}[rs], 6)
    t = table(d, [cw // 2, cw - cw // 2], math.ceil(len(pos["person"][1:]) / 2), None, margin=(30, 0))
    for i, f in enumerate(pos["person"][1:]):
        c = t.cell(i // 2, i % 2); p = ct(c, "", 9)
        fr(p, f.replace(" ", "") + "   ", 8, True, sk["gray"]); fr(p, "입력하세요", 9, None, sk["hint"])
    for s in pos["sections"]:
        p = fp(d, "", before=16, after=5, keep_next=True)
        fr(p, s["title"], 10.5, True, sk["mid"], sk["head"], 1.5)
        rule(d, sk["line"], 4, 0, 2)
        if s["kind"] == "G":
            tl_entries(d, s["labels"], min(s["rows"], 4), sk, cw)
        elif s["kind"] == "S":
            t = table(d, [cw // 2, cw - cw // 2], math.ceil(s["rows"] / 2), None, margin=(36, 0))
            for i in range(s["rows"]):
                c = t.cell(i // 2, i % 2); p = ct(c, "", 9.5); fr(p, "기술 · 도구", 9.5, None, sk["hint"]); fr(p, "   ●●●○○", 8.5, None, sk["mid"])
        elif s["kind"] == "K":
            p = fp(d, "   ".join(f"□ {i}" for i in s["items"]), 9.5, None, None, before=2, after=2)
        elif s["kind"] == "F":
            ruled(d, max(3, s["height"] // 30), sk["line"], 26)
        else:
            for _ in range(s["rows"]):
                f = s["fields"]
                tl_entry(d, [f[1] if len(f) > 1 else "", f[0], " · ".join(f[2:])], sk, cw)
                p = fp(d, s["tall"], 8, True, sk["mid"], before=0, after=0); p.paragraph_format.left_indent = Pt(100)
                for _ in range(3):
                    q = fp(d, "", 10); q.paragraph_format.left_indent = Pt(100); exact(q, 24); bottom_line(q, sk["line"])
    return d


def tl_entries(d, labels, n, sk, cw):
    for _ in range(n):
        tl_entry(d, labels, sk, cw)


def tl_entry(d, labels, sk, cw):
    t = table(d, [118, cw - 118], 1, None, margin=(38, 16))
    a, b = t.cell(0, 0), t.cell(0, 1)
    borders(a, sk["mid"], 8, right=True, top=False, left=False, bottom=False)
    for c in (b,):
        borders(c, sk["line"], 4, top=False, left=False, right=False, bottom=True)
    ct(a, labels[0], 9, None, sk["hint"], "right")
    p = ct(b, labels[1] if len(labels) > 1 else "", 10.5, True, sk["dark"]); p.paragraph_format.left_indent = Pt(8)
    p = ct(b, " · ".join(labels[2:]) if len(labels) > 2 else "", 9, None, sk["hint"]); p.paragraph_format.left_indent = Pt(8)
    p = ct(b, "", 9); p.paragraph_format.left_indent = Pt(8); exact(p, 20)
    row_height(t.rows[0], 52)


# ------------------------------------------------------------------ 4 요약형
def r_summary(pos, sk, k):
    d = new_doc(f"이력서 · {pos['name']}", sk, (36, 44, 32, 44)); cw = 706
    style = k % 4
    t = table(d, [cw], 1, None, margin=(150, 220)); c = t.rows[0].cells[0]
    if style in (0, 2):
        shade(c, sk["dark"]); fg, sub = "FFFFFF", "D5DEE8"
    else:
        shade(c, sk["tint"]); fg, sub = sk["dark"], sk["gray"]
    p = ct(c, "", 22); fr(p, "이  름", 24, True, fg, sk["head"], 3); tab_right(p, cw - 44); fr(p, "\t" + pos["name"], 12, True, fg)
    p = ct(c, "", 8); fr(p, "RESUME", 8, None, sub, spacing=3); tab_right(p, cw - 44); fr(p, "\t" + pos["en"], 8, None, sub, spacing=1)
    # 연락처 띠
    f = pos["person"][1:]; per = 3 if len(f) > 4 else len(f)
    rows = math.ceil(len(f) / per)
    t = table(d, [cw // per] * (per - 1) + [cw - cw // per * (per - 1)], rows, None, margin=(46, 90))
    for i, name in enumerate(f):
        cc = t.cell(i // per, i % per); shade(cc, sk["soft"])
        ct(cc, name.replace(" ", ""), 7.5, True, sk["gray"], spacing=1); ct(cc, "입력하세요", 9.5, None, sk["hint"])
        borders(cc, "FFFFFF", 12, left=True, right=True, top=True, bottom=True)
    spacer(d, 8)
    # 핵심 요약
    ttl = ["핵심 역량 3가지", "대표 성과 한 줄", "이 직무에서 이루고 싶은 것"]
    t = table(d, [cw // 3, cw // 3, cw - cw // 3 * 2], 1, None, margin=(70, 110))
    for i, cell in enumerate(t.rows[0].cells):
        borders(cell, sk["mid"], 16, top=True, left=False, right=False, bottom=False)
        shade(cell, sk["soft"])
        ct(cell, ttl[i], 9, True, sk["dark"]); ct(cell, "입력하세요", 9, None, sk["hint"])
        ct(cell, "", 9); ct(cell, "", 9)
    row_height(t.rows[0], 86)
    for s in pos["sections"]:
        p = fp(d, "", before=13, after=4, keep_next=True)
        fr(p, s["title"], 11.5, True, sk["dark"], sk["head"]); rule_under(p, sk["dark"], 10)
        summary_block(d, s, sk, cw, zebra=(style >= 2))
    return d


def rule_under(p, color, sz):
    from docx_kit import para_border
    para_border(p, "bottom", color, sz, 3)


def summary_block(d, s, sk, cw, zebra):
    kind = s["kind"]
    if kind in ("G", "S"):
        labels = s["labels"]; w = widths_for(labels, cw) if kind == "G" else [round(cw * v / 100) for v in (24, 46, 30)]
        w[-1] += cw - sum(w)
        t = table(d, w, s["rows"] + 1, None, margin=(40, 90))
        for c, lab in zip(t.rows[0].cells, labels):
            shade(c, sk["dark"]); ct(c, lab, 8.5, True, "FFFFFF", "center", where="center")
        row_height(t.rows[0], 26)
        for i, r in enumerate(t.rows[1:]):
            row_height(r, 30)
            for c in r.cells:
                valign(c, "center"); borders(c, sk["line"], 4, bottom=True, top=False, left=False, right=False)
                if zebra and i % 2 == 0:
                    shade(c, sk["soft"])
            if kind == "S":
                ct(r.cells[-1], LEVEL, 10, None, sk["mid"], "center", where="center")
    elif kind == "K":
        per = 4; n = len(s["items"]); rows = math.ceil(n / per)
        t = table(d, [cw // per] * (per - 1) + [cw - cw // per * (per - 1)], rows, None, margin=(50, 90))
        for i, it in enumerate(s["items"]):
            c = t.cell(i // per, i % per); shade(c, sk["soft"]); ct(c, f"□  {it}", 9.5, where="center")
            borders(c, "FFFFFF", 12, left=True, right=True, top=True, bottom=True)
    elif kind == "F":
        t = table(d, [cw], 1, None, margin=(80, 120)); c = t.rows[0].cells[0]; shade(c, sk["soft"]); row_height(t.rows[0], s["height"])
        ct(c, "입력하세요", 9, None, sk["hint"])
    else:
        for _ in range(s["rows"]):
            f = s["fields"]; n = len(f)
            t = table(d, [cw // n] * (n - 1) + [cw - cw // n * (n - 1)], 2, None, margin=(46, 90))
            for i, lbl in enumerate(f):
                c = t.cell(0, i); shade(c, sk["tint"]); ct(c, lbl, 8.5, True, sk["dark"])
            row_height(t.rows[0], 28)
            r = t.rows[1]; row_height(r, 90); m = r.cells[0].merge(r.cells[n - 1])
            borders(m, sk["line"], 4, top=False, left=True, right=True, bottom=True); ct(m, s["tall"], 8.5, True, sk["mid"])
            spacer(d, 5)


# ------------------------------------------------------------------ 5 카드형
def r_cards(pos, sk, k):
    d = new_doc(f"이력서 · {pos['name']}", sk, (44, 50, 38, 50)); cw = 694
    accent_top = k % 2 == 1
    right = 104 if pos["photo"] else 0
    t = table(d, [cw - right, right] if right else [cw], 1, None, margin=(0, 0))
    c = t.cell(0, 0)
    p = ct(c, "PROFILE", 7.5, True, sk["mid"], spacing=3)
    p = ct(c, "이  름", 28, True, sk["dark"], font=sk["head"], line=1.1)
    p = ct(c, "", 9); fr(p, pos["name"], 11, True, sk["mid"]); fr(p, "   ·   " + pos["en"], 8, None, sk["gray"], spacing=1)
    if right:
        ph = t.cell(0, 1); shade(ph, sk["soft"]); borders(ph, sk["line"], 6, top=True, left=True, right=True, bottom=True)
        ct(ph, "사진\n3×4cm", 8.5, None, sk["hint"], "center", where="center"); row_height(t.rows[0], 118)
    rule(d, sk["mid"] if accent_top else sk["line"], 18 if accent_top else 6, 4, 4)
    f = pos["person"][1:]; per = 3
    t = table(d, [cw // per] * (per - 1) + [cw - cw // per * (per - 1)], math.ceil(len(f) / per), None, margin=(40, 0))
    for i, name in enumerate(f):
        cc = t.cell(i // per, i % per); p = ct(cc, "", 9); fr(p, name.replace(" ", "") + "  ", 8, True, sk["mid"]); fr(p, "입력하세요", 9, None, sk["hint"])
    for n, s in enumerate(pos["sections"], 1):
        p = fp(d, "", before=14, after=5, keep_next=True); fr(p, f"{n:02d}", 11, True, sk["mid"], sk["head"]); fr(p, "   " + s["title"], 11.5, True, sk["dark"], sk["head"])
        card_block(d, s, sk, cw, accent_top)
    return d


def card_shell(d, sk, cw, height, accent_top):
    t = table(d, [cw], 1, None, margin=(70, 140)); c = t.rows[0].cells[0]
    from docx_kit import cell_borders
    line, mid = (sk["line"], 4), (sk["mid"], 24 if accent_top else 30)
    if accent_top:
        cell_borders(c, top=mid, left=line, right=line, bottom=line)
    else:
        cell_borders(c, top=line, left=mid, right=line, bottom=line)
    row_height(t.rows[0], height)
    return c


def card_block(d, s, sk, cw, accent_top):
    kind = s["kind"]
    if kind == "G":
        for _ in range(min(s["rows"], 3)):
            c = card_shell(d, sk, cw, 62, accent_top); L = s["labels"]
            p = ct(c, "", 10.5); fr(p, L[1] if len(L) > 1 else "", 10.5, True, sk["dark"]); tab_right(p, cw - 28); fr(p, "\t" + L[0], 9, None, sk["hint"])
            ct(c, " · ".join(L[2:]) if len(L) > 2 else "", 9, None, sk["hint"], before=2)
            spacer(d, 5)
    elif kind == "S":
        c = card_shell(d, sk, cw, 30, accent_top)
        for _ in range(s["rows"]):
            p = ct(c, "", 9.5, before=3); fr(p, s["labels"][1], 9.5, None, sk["hint"]); tab_right(p, cw - 28); fr(p, "\t" + LEVEL, 9.5, None, sk["mid"])
        spacer(d, 4)
    elif kind == "K":
        c = card_shell(d, sk, cw, 30, accent_top); ct(c, "      ".join(f"□ {i}" for i in s["items"]), 9.5, line=1.5)
        spacer(d, 4)
    elif kind == "F":
        c = card_shell(d, sk, cw, s["height"], accent_top); ct(c, "입력하세요", 9, None, sk["hint"])
        spacer(d, 4)
    else:
        for _ in range(s["rows"]):
            c = card_shell(d, sk, cw, 120, accent_top); f = s["fields"]
            ct(c, f[0], 10.5, True, sk["dark"]); ct(c, " · ".join(f[1:]), 9, None, sk["hint"], before=2)
            ct(c, s["tall"], 8, True, sk["mid"], before=6)
            spacer(d, 5)


LAYOUTS = [r_classic, r_sidebar, r_timeline, r_summary, r_cards]
