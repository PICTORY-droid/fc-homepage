"""자기소개서 5가지 양식 구조 — 같은 포지션이라도 문항 조합과 짜임이 모두 다릅니다.
  1 문항 박스형 · 2 줄 노트형(서체 중심) · 3 좌우 2단형 · 4 STAR 구조형 · 5 서술형(편지)
길이는 px (A4 = 794 x 1123). 쪽은 Word 가 칸 단위로 자동으로 나눕니다."""
from docx.shared import Pt

from cover_data import Q
from doc_blocks import borders, count_hint, ct, exact_height, fp, fr, new_doc, row_height, rule, ruled, shade, spacer, table, tab_right, valign

NAMES = ["문항형", "줄노트형", "좌우2단형", "STAR형", "서술형"]
PICK = {0: [0, 1, 2, 3, 4], 1: [1, 2, 5, 6], 2: [0, 2, 4, 6, 7], 3: [1, 2, 5, 0, 7], 4: [0, 1, 4, 7]}


def para_bd(p, side, color, sz, space=1):
    from docx_kit import para_border
    para_border(p, side, color, sz, space)


def info_row(d, labels, sk, cw, style="grid"):
    """지원 정보 — 성명 / 지원 직무 / 지원 회사 같은 짧은 칸."""
    n = len(labels)
    w = [cw // n] * (n - 1) + [cw - cw // n * (n - 1)]
    t = table(d, w, 1, sk["line"] if style == "grid" else None, margin=(44, 100))
    for c, lab in zip(t.rows[0].cells, labels):
        ct(c, lab, 7.5, True, sk["gray"], spacing=1); ct(c, "입력하세요", 10, None, sk["hint"])
        if style == "under":
            borders(c, sk["mid"], 8, bottom=True, top=False, left=False, right=False)
        elif style == "tint":
            shade(c, sk["soft"])
    return t


def answer_box(d, sk, cw, h, hint, border=True, fill=None):
    t = table(d, [cw], 1, sk["line"] if border else None, margin=(80, 140)); c = t.rows[0].cells[0]
    row_height(t.rows[0], h)
    if fill:
        shade(c, fill)
    p = c.paragraphs[0]
    count_hint(c, hint, sk["hint"])
    return t


# ---------------------------------------------------------------- 1 문항 박스형
def c_boxes(pid, name, sk, k):
    d = new_doc(f"자기소개서 · {name}", sk, (46, 52, 40, 52)); cw = 690
    head = ["bar", "center", "left", "band"][k % 4]
    if head == "bar":
        p = fp(d, "", after=8); fr(p, "자기소개서", 21, True, sk["dark"], sk["head"], 4); tab_right(p, cw); fr(p, "\t" + name, 10, None, sk["gray"]); para_bd(p, "bottom", sk["mid"], 18, 4)
    elif head == "center":
        fp(d, "자 기 소 개 서", 24, True, sk["dark"], "center", after=2, font=sk["head"], spacing=8)
        fp(d, name, 9.5, None, sk["gray"], "center", after=10, spacing=2)
    elif head == "left":
        p = fp(d, "", after=8); fr(p, "자기소개서", 22, True, sk["dark"], sk["head"], 2); fr(p, "    " + name, 9.5, None, sk["gray"]); para_bd(p, "left", sk["mid"], 60, 8); p.paragraph_format.left_indent = Pt(8)
    else:
        t = table(d, [cw], 1, None, margin=(110, 200)); c = t.rows[0].cells[0]; shade(c, sk["dark"])
        p = ct(c, "", 20); fr(p, "자기소개서", 20, True, "FFFFFF", sk["head"], 4); tab_right(p, cw - 40); fr(p, "\t" + name, 9, None, "DDE6F0"); valign(c, "center"); spacer(d, 8)
    info_row(d, ["성 명", "지원 직무", "지원 회사"], sk, cw, "grid")
    for n, qi in enumerate(PICK[0], 1):
        q, hint, h = Q[pid][qi]
        p = fp(d, "", before=10, after=4, keep_next=True); fr(p, f"{n}. ", 10.5, True, sk["mid"]); fr(p, q, 10.5, True); fr(p, f"   {hint}", 8.5, None, sk["gray"])
        answer_box(d, sk, cw, h, "", True)
    return d


# ---------------------------------------------------------------- 2 줄 노트형
def c_ruled(pid, name, sk, k):
    d = new_doc(f"자기소개서 · {name}", sk, (60, 70, 48, 70)); cw = 654
    fp(d, "COVER LETTER", 8, None, sk["gray"], after=2, spacing=4)
    p = fp(d, "", after=2); fr(p, "자기소개서", 26, True, sk["dark"], sk["head"], 3)
    p = fp(d, "", after=10); fr(p, name, 11, None, sk["mid"], sk["head"]); para_bd(p, "bottom", sk["dark"], [24, 12, 6, 8][k % 4], 6)
    p = fp(d, "", after=6); fr(p, "성명  ", 8, True, sk["gray"]); fr(p, "입력하세요", 9.5, None, sk["hint"]); fr(p, "          지원 회사  ", 8, True, sk["gray"]); fr(p, "입력하세요", 9.5, None, sk["hint"])
    gap = 30
    for n, qi in enumerate(PICK[1], 1):
        q, hint, h = Q[pid][qi]
        lines = max(5, h // gap)
        p = fp(d, "", before=14, after=3, keep_next=True)
        fr(p, f"{n:02d}  ", 11, True, sk["mid"], sk["head"]); fr(p, q, 11.5, True, sk["dark"], sk["head"])
        p = fp(d, hint, 8.5, None, sk["gray"], after=0, keep_next=True); p.paragraph_format.left_indent = Pt(24)
        ruled(d, lines, sk["line"], gap)
    return d


# ---------------------------------------------------------------- 3 좌우 2단형
def c_split(pid, name, sk, k):
    d = new_doc(f"자기소개서 · {name}", sk, (44, 50, 38, 50)); cw = 694
    left = 176 + (k % 3) * 8
    t = table(d, [left, cw - left], 1, None, margin=(0, 0))
    a, b = t.cell(0, 0), t.cell(0, 1)
    ct(a, "자기소개서", 17, True, sk["dark"], font=sk["head"]); ct(a, name, 9, None, sk["mid"])
    p = ct(b, "", 9, before=2); fr(p, "성명  ", 8, True, sk["gray"]); fr(p, "입력하세요", 9.5, None, sk["hint"]); tab_right(p, cw - left - 10)
    p = ct(b, "", 9, before=3); fr(p, "지원 회사 · 직무  ", 8, True, sk["gray"]); fr(p, "입력하세요", 9.5, None, sk["hint"])
    rule(d, sk["dark"], 18, 6, 8)
    for n, qi in enumerate(PICK[2], 1):
        q, hint, h = Q[pid][qi]
        h2 = max(h - 20, 150)
        t = table(d, [left, cw - left], 1, sk["line"], margin=(80, 130)); row_height(t.rows[0], h2)
        a, b = t.cell(0, 0), t.cell(0, 1); shade(a, sk["soft"]); valign(a, "top")
        ct(a, f"{n:02d}", 18, True, sk["mid"], font=sk["head"]); ct(a, q, 9.5, True, sk["dark"], before=4, line=1.25); ct(a, hint, 8, None, sk["gray"], before=4)
        count_hint(b, "", sk["hint"])
        spacer(d, 6)
    return d


# ---------------------------------------------------------------- 4 STAR 구조형
STAR = [("S", "상 황", "어떤 배경·문제였나요?"), ("T", "과 제", "내가 맡은 목표·역할은?"), ("A", "행 동", "구체적으로 무엇을 했나요?"), ("R", "결 과", "수치·변화·배운 점은?")]


def c_star(pid, name, sk, k):
    d = new_doc(f"자기소개서 · {name}", sk, (42, 50, 36, 50)); cw = 694
    t = table(d, [cw], 1, None, margin=(100, 180)); c = t.rows[0].cells[0]; shade(c, sk["tint"] if k % 2 else sk["soft"])
    borders(c, sk["mid"], 30, left=True, top=False, right=False, bottom=False)
    p = ct(c, "", 19); fr(p, "자기소개서", 19, True, sk["dark"], sk["head"], 3); tab_right(p, cw - 36); fr(p, "\t" + name, 9.5, None, sk["gray"])
    ct(c, "상황 → 과제 → 행동 → 결과 순서로 적으면 읽는 사람이 한눈에 파악해요.", 8.5, None, sk["gray"], before=2)
    spacer(d, 6)
    info_row(d, ["성 명", "지원 직무", "지원 회사"], sk, cw, "under")
    order = PICK[3]
    for n, qi in enumerate(order[:3], 1):
        q, hint, h = Q[pid][qi]
        p = fp(d, "", before=12, after=4, keep_next=True); fr(p, f"{n}. ", 10.5, True, sk["mid"]); fr(p, q, 10.5, True); fr(p, f"  {hint}", 8.5, None, sk["gray"])
        t = table(d, [cw // 2, cw - cw // 2], 2, sk["line"], margin=(60, 110))
        for i, (_, lab, ph) in enumerate(STAR):
            c = t.cell(i // 2, i % 2); row_height(t.rows[i // 2], 96)
            p = ct(c, "", 8); fr(p, lab + "  ", 9, True, sk["dark"]); fr(p, ph, 8, None, sk["hint"])
            shade(c, sk["soft"]) if (i + k) % 3 == 0 else None
    for n, qi in enumerate(order[3:], 4):
        q, hint, h = Q[pid][qi]
        p = fp(d, "", before=12, after=4, keep_next=True); fr(p, f"{n}. ", 10.5, True, sk["mid"]); fr(p, q, 10.5, True); fr(p, f"  {hint}", 8.5, None, sk["gray"])
        answer_box(d, sk, cw, h - 40, "", True)
    return d


# ---------------------------------------------------------------- 5 서술형(편지)
HEADS5 = ["지원 동기", "직무 역량과 경험", "함께 일하는 방식", "입사 후 포부"]


def c_letter(pid, name, sk, k):
    d = new_doc(f"자기소개서 · {name}", sk, (62, 66, 50, 66)); cw = 662
    p = fp(d, "", after=4); fr(p, "To.  ", 9, True, sk["gray"]); fr(p, "지원 회사 · 부서", 10, None, sk["hint"])
    p = fp(d, "", after=2, before=6); fr(p, "저는 이런 사람입니다", 24, True, sk["dark"], sk["head"], 1)
    p = fp(d, "", after=10); fr(p, f"{name} 지원  ·  성명 입력하세요", 10, None, sk["gray"]); para_bd(p, "bottom", sk["line"], 6, 8)
    t = table(d, [cw // 3] * 2 + [cw - cw // 3 * 2], 1, None, margin=(60, 110))
    for i, c in enumerate(t.rows[0].cells):
        shade(c, sk["soft"]); borders(c, "FFFFFF", 16, left=True, right=True, top=True, bottom=True)
        ct(c, f"핵심 키워드 {i + 1}", 7.5, True, sk["mid"], spacing=1); ct(c, "입력하세요", 10, None, sk["hint"]); ct(c, "", 8)
    qs = PICK[4]
    for n, (h5, qi) in enumerate(zip(HEADS5, qs), 1):
        q, hint, h = Q[pid][qi]
        h2 = h + 30
        spacer(d, 8)
        t = table(d, [112, cw - 112], 1, None, margin=(30, 0)); row_height(t.rows[0], h2)
        a, b = t.cell(0, 0), t.cell(0, 1)
        borders(a, sk["mid"], 14, right=True, top=False, left=False, bottom=False); valign(a, "top")
        ct(a, f"{n:02d}", 16, True, sk["mid"], font=sk["head"]); ct(a, h5, 9.5, True, sk["dark"], font=sk["head"], before=2)
        shade(b, sk["soft"])
        p = ct(b, q, 10.5, True, sk["dark"]); p.paragraph_format.left_indent = Pt(12)
        p = ct(b, hint, 8.5, None, sk["gray"], after=3); p.paragraph_format.left_indent = Pt(12)
        p = ct(b, "", 10); p.paragraph_format.left_indent = Pt(12)
    p = fp(d, "마무리 한 문장", 8.5, True, sk["mid"], before=14, after=2)
    answer_box(d, sk, cw, 60, "", True, sk["soft"])
    fp(d, "          년        월        일        지원자  ____________________  (서명)", 10, None, None, "right", before=12)
    return d


LAYOUTS = [c_boxes, c_ruled, c_split, c_star, c_letter]
