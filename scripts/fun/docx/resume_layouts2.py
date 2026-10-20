"""이력서 양식 6~10번 — 실제 채용 서식 구조를 따른 다섯 가지.
  6 NCS형(인적·교육·자격·경력경험 4영역 + 경력기술서) · 7 경력기술서형 · 8 신입·활동형 · 9 포트폴리오형 · 10 JSON Resume형
구조 근거: 캐치 NCS 입사지원서 구성, 고용24 이력서 가이드, JSON Resume 스키마 (guide_data.py 참고)."""
import math

from docx.shared import Pt

from doc_blocks import borders, ct, fp, fr, new_doc, row_height, rule, shade, spacer, table, tab_right, valign
from guide_data import JSON_KEYS
from resume_layouts import LEVEL, fit_label, label_w, card_block, card_shell, classic_block, sec_head, summary_block, widths_for

NAMES = ["NCS형", "경력기술서형", "신입·활동형", "포트폴리오형", "JSON Resume형"]


def _band(d, sk, cw, title, sub, dark=True):
    t = table(d, [cw], 1, None, margin=(110, 200)); c = t.rows[0].cells[0]
    shade(c, sk["dark"] if dark else sk["tint"]); fg, sb = ("FFFFFF", "DDE6F0") if dark else (sk["dark"], sk["gray"])
    p = ct(c, "", 20); fr(p, title, 19, True, fg, sk["head"], 3); tab_right(p, cw - 40); fr(p, "\t" + sub, 9, None, sb); valign(c, "center")
    spacer(d, 8)


def _person(d, pos, sk, cw, photo):
    f = pos["person"]; rows = math.ceil(len(f) / 2); lab = label_w(f, 80)
    if photo and pos["photo"]:
        w = [113, lab, 217, lab, cw - 113 - lab * 2 - 217]; t = table(d, w, rows, sk["line"]); base = 1
        ph = t.cell(0, 0).merge(t.cell(rows - 1, 0)); ct(ph, "사진\n(3×4cm)", 9, None, sk["hint"], "center", where="center")
    else:
        w = [lab, 265, lab, cw - lab * 2 - 265]; t = table(d, w, rows, sk["line"]); base = 0
    for ri in range(rows):
        row_height(t.rows[ri], max(34, math.ceil(150 / rows)) if base else 34)
        for ci in range(2):
            idx = ri * 2 + ci
            if idx < len(f):
                lc = t.cell(ri, base + ci * 2); shade(lc, sk["soft"]); ct(lc, fit_label(f[idx]), 9.5, True, sk["dark"], "center", where="center")
                valign(t.cell(ri, base + ci * 2 + 1), "center")
        if len(f) % 2 and ri == rows - 1:
            t.cell(ri, base + 1).merge(t.cell(ri, base + 3))


def _grid(d, sk, cw, labels, rows, h=30, head_fill=None):
    t = table(d, widths_for(labels, cw), rows + 1, sk["line"])
    for c, lab in zip(t.rows[0].cells, labels):
        shade(c, head_fill or sk["soft"]); ct(c, lab, 9, True, sk["dark"], "center", where="center")
    row_height(t.rows[0], 27)
    for r in t.rows[1:]:
        row_height(r, h)
    return t


def _area(title):
    t = title.replace(" ", "")
    if "경력" in t or "경험" in t or any(k in t for k in ("프로젝트", "작업", "사례", "실적", "운영", "거래", "서비스", "캠페인", "설비", "현장")):
        return 3
    if "학" in t or "교육" in t or "연수" in t:
        return 1
    if "자격" in t or "면허" in t or "어학" in t:
        return 2
    return 3


# ---------------------------------------------------------------- 6 NCS형
AREA_NOTE = ["이름·연락처·희망 직무를 정확히", "최종학력부터 최근순으로", "자격명·취득일·발급기관", "직무와 관련된 경력·경험을 최근순으로"]
AREA_NAME = ["인적사항", "교육사항", "자격사항", "경력·경험사항"]


def r_ncs(pos, sk, k):
    d = new_doc(f"이력서(NCS) · {pos['name']}", sk, (44, 50, 38, 50)); cw = 694
    _band(d, sk, cw, "입사지원서 · 이력", f"{pos['name']} · NCS 구조", dark=(k % 2 == 0))
    groups = {1: [], 2: [], 3: []}
    for s in pos["sections"]:
        groups[_area(s["title"])].append(s)
    for i in range(4):
        p = fp(d, "", before=12, after=4, keep_next=True)
        fr(p, f"{'①②③④'[i]} {AREA_NAME[i]}", 11.5, True, sk["dark"], sk["head"]); fr(p, f"   {AREA_NOTE[i]}", 8.5, None, sk["gray"])
        from docx_kit import para_border
        para_border(p, "bottom", sk["mid"], 10, 3)
        if i == 0:
            _person(d, pos, sk, cw, True)
        else:
            for s in groups[i]:
                fp(d, s["title"], 9.5, True, sk["mid"], before=5, after=2, keep_next=True)
                classic_block(d, s, sk, cw)
    p = fp(d, "", before=14, after=4, keep_next=True); fr(p, "경력기술서", 11.5, True, sk["dark"], sk["head"]); fr(p, "   회사별로 직무·역할·업무·성과를 적습니다", 8.5, None, sk["gray"])
    from docx_kit import para_border
    para_border(p, "bottom", sk["mid"], 10, 3)
    for _ in range(2):
        lw = label_w(["회사 · 기간", "직무 · 직위", "담당 역할", "사용 기술 · 도구", "주요 업무", "성과 (숫자)"], 92)
        t = table(d, [lw, 347 - lw, lw, 347 - lw], 4, sk["line"])
        for ri, (a, b) in enumerate([("회사 · 기간", "직무 · 직위"), ("담당 역할", "사용 기술 · 도구"), ("주요 업무", ""), ("성과 (숫자)", "")]):
            row_height(t.rows[ri], 30 if ri < 2 else 62)
            shade(t.cell(ri, 0), sk["soft"]); ct(t.cell(ri, 0), fit_label(a), 9, True, sk["dark"], "center", where="center")
            if b:
                shade(t.cell(ri, 2), sk["soft"]); ct(t.cell(ri, 2), fit_label(b), 9, True, sk["dark"], "center", where="center")
            else:
                t.cell(ri, 1).merge(t.cell(ri, 3))
        spacer(d, 6)
    fp(d, "위 내용은 사실과 다름이 없음을 확인합니다.     20      년      월      일     작성자 :  ______________  (서명)", 9.5, None, None, "center", before=10)
    return d


# ---------------------------------------------------------------- 7 경력기술서형
def r_career(pos, sk, k):
    d = new_doc(f"경력 이력서 · {pos['name']}", sk, (38, 46, 34, 46)); cw = 702
    t = table(d, [cw], 1, None, margin=(120, 200)); c = t.rows[0].cells[0]; shade(c, sk["tint"])
    borders(c, sk["mid"], 36, left=True, top=False, right=False, bottom=False)
    p = ct(c, "", 21); fr(p, "이  름", 23, True, sk["dark"], sk["head"], 3); tab_right(p, cw - 40); fr(p, "\t" + pos["name"], 11, True, sk["mid"])
    ct(c, "  ·  ".join(x.replace(" ", "") + " 입력" for x in pos["person"][1:4]), 8.5, None, sk["hint"], before=3)
    spacer(d, 6)
    fp(d, "직무 요약", 10.5, True, sk["dark"], before=4, after=3, font=sk["head"])
    t = table(d, [cw], 1, sk["line"], margin=(70, 120)); row_height(t.rows[0], 62)
    ct(t.rows[0].cells[0], "총 경력 ○년 ○개월 · 핵심 역량 3가지 · 대표 성과 한 줄 (3문장 이내)", 9, None, sk["hint"])
    fp(d, "경력 한눈에 보기", 10.5, True, sk["dark"], before=10, after=3, font=sk["head"])
    _grid(d, sk, cw, ["기 간", "회사명 / 팀", "직 위 · 직 무", "근속"], 4)
    fp(d, "경력기술서", 10.5, True, sk["dark"], before=12, after=3, font=sk["head"])
    for n in range(3):
        t = table(d, [cw], 1, None, margin=(80, 140)); c = t.rows[0].cells[0]; row_height(t.rows[0], 150)
        from docx_kit import cell_borders
        cell_borders(c, top=(sk["mid"], 20), left=(sk["line"], 4), right=(sk["line"], 4), bottom=(sk["line"], 4))
        p = ct(c, "", 10.5); fr(p, f"{n + 1}. 회사명 · 팀", 10.5, True, sk["dark"]); tab_right(p, cw - 28); fr(p, "\t기간 · 직위", 9, None, sk["hint"])
        ct(c, "담당 역할  |  사용 기술·도구", 8.5, None, sk["hint"], before=3)
        ct(c, "• 주요 업무 1  • 주요 업무 2  • 주요 업무 3", 8.5, None, sk["hint"], before=4)
        ct(c, "성과 (숫자로) :", 9, True, sk["mid"], before=6)
        spacer(d, 6)
    for s in pos["sections"]:
        if s["title"].replace(" ", "") == "경력":
            continue
        fp(d, s["title"], 10.5, True, sk["dark"], before=10, after=3, font=sk["head"], keep_next=True)
        summary_block(d, s, sk, cw, zebra=False)
    return d


# ---------------------------------------------------------------- 8 신입·활동형
def r_fresh(pos, sk, k):
    d = new_doc(f"신입 이력서 · {pos['name']}", sk, (46, 52, 40, 52)); cw = 690
    p = fp(d, "", after=8); fr(p, "신입 이력서", 22, True, sk["dark"], sk["head"], 3); fr(p, "   " + pos["name"], 10.5, None, sk["gray"])
    from docx_kit import para_border
    para_border(p, "bottom", sk["dark"], 14, 5)
    _person(d, pos, sk, cw, True)
    basic = [s for s in pos["sections"] if _area(s["title"]) in (1, 2)]
    for s in basic:
        sec_head(d, s["title"], sk, cw, 11, "under"); classic_block(d, s, sk, cw)
    sec_head(d, "활동 · 경험 (인턴·동아리·프로젝트·아르바이트·봉사)", sk, cw, 12, "under")
    fp(d, "활동 기간 · 장소 · 내용 · 맡은 일 · 결과를 한 활동마다 적습니다. 결과는 숫자나 배운 점으로.", 8.5, None, sk["gray"], after=3)
    for _ in range(4):
        t = table(d, [150, 200, 340], 2, sk["line"])
        for c, lab in zip(t.rows[0].cells, ["활동 기간", "장소 · 기관", "활동 내용"]):
            shade(c, sk["soft"]); ct(c, lab, 9, True, sk["dark"], "center", where="center")
        row_height(t.rows[0], 26)
        row_height(t.rows[1], 54)
        spacer(d, 4)
        t = table(d, [150, 540], 2, sk["line"])
        for r, lab in zip(t.rows, ["맡은 일", "결 과"]):
            shade(r.cells[0], sk["soft"]); ct(r.cells[0], lab, 9, True, sk["dark"], "center", where="center"); row_height(r, 34)
        spacer(d, 6)
    sec_head(d, "직무 관련 강점 3가지", sk, cw, 8, "under")
    t = table(d, [cw // 3] * 2 + [cw - cw // 3 * 2], 1, sk["line"], margin=(70, 110)); row_height(t.rows[0], 80)
    for i, c in enumerate(t.rows[0].cells):
        shade(c, sk["soft"]); ct(c, f"강점 {i + 1}", 8.5, True, sk["mid"]); ct(c, "근거가 되는 경험 한 줄", 8.5, None, sk["hint"])
    return d


# ---------------------------------------------------------------- 9 포트폴리오형
def r_portfolio(pos, sk, k):
    d = new_doc(f"포트폴리오 이력서 · {pos['name']}", sk, (44, 50, 38, 50)); cw = 694
    t = table(d, [cw // 2, cw - cw // 2], 1, None, margin=(0, 0)); a, b = t.rows[0].cells
    ct(a, "PORTFOLIO RESUME", 7.5, True, sk["mid"], spacing=3); ct(a, "이  름", 27, True, sk["dark"], font=sk["head"], line=1.1); ct(a, pos["name"], 11, True, sk["mid"])
    for lab in pos["person"][1:4]:
        p = ct(b, "", 9, before=2); fr(p, lab.replace(" ", "") + "  ", 8, True, sk["mid"]); fr(p, "입력하세요", 9, None, sk["hint"])
    rule(d, sk["mid"], 18, 4, 6)
    fp(d, "한 줄 소개", 9.5, True, sk["dark"], after=3)
    t = table(d, [cw], 1, sk["line"], margin=(70, 120)); row_height(t.rows[0], 44); shade(t.rows[0].cells[0], sk["soft"])
    ct(t.rows[0].cells[0], "나는 ○○를 통해 △△ 문제를 해결하는 □□입니다.", 9.5, None, sk["hint"])
    fp(d, "대표 작업 3선", 11.5, True, sk["dark"], before=12, after=4, font=sk["head"])
    for n in range(3):
        c = card_shell(d, sk, cw, 118, k % 2 == 1)
        p = ct(c, "", 10.5); fr(p, f"{n + 1}. 작업 · 프로젝트명", 10.5, True, sk["dark"]); tab_right(p, cw - 28); fr(p, "\t기간 · 링크", 9, None, sk["hint"])
        ct(c, "문제 / 목적 :", 8.5, True, sk["mid"], before=4); ct(c, "내가 한 일 (기여도 %) :", 8.5, True, sk["mid"], before=4); ct(c, "결과 (숫자) · 배운 점 :", 8.5, True, sk["mid"], before=4)
        spacer(d, 5)
    for s in pos["sections"]:
        fp(d, s["title"], 11, True, sk["dark"], before=12, after=4, font=sk["head"], keep_next=True)
        card_block(d, s, sk, cw, k % 2 == 1)
    return d


# ---------------------------------------------------------------- 10 JSON Resume형
def _key(title):
    t = title.replace(" ", "")
    for k_, v in JSON_KEYS.items():
        if k_.replace(" ", "") in t:
            return v
    return "work"


def r_json(pos, sk, k):
    d = new_doc(f"이력서(JSON Resume) · {pos['name']}", sk, (46, 52, 40, 52)); cw = 690
    p = fp(d, "", after=2); fr(p, "RESUME", 22, True, sk["dark"], sk["head"], 4); tab_right(p, cw); fr(p, "\tJSON Resume 구조", 8.5, None, sk["gray"])
    from docx_kit import para_border
    para_border(p, "bottom", sk["dark"], 14, 4)
    fp(d, "basics", 8.5, True, sk["mid"], before=8, after=2)
    f = pos["person"]; t = table(d, [110, cw - 110], len(f) + 2, sk["line"])
    for r, lab in zip(t.rows, ["name · label"] + [x.replace(" ", "") for x in f[1:]] + ["summary"]):
        shade(r.cells[0], sk["soft"]); ct(r.cells[0], lab if r is not t.rows[0] else "성명 · 직함", 9, True, sk["dark"], where="center"); row_height(r, 28); valign(r.cells[1], "center")
    row_height(t.rows[-1], 60)
    seen = {}
    for s in pos["sections"]:
        key = _key(s["title"]); seen[key] = seen.get(key, 0) + 1
        p = fp(d, "", before=12, after=4, keep_next=True); fr(p, key, 8.5, True, sk["mid"]); fr(p, "   " + s["title"], 11, True, sk["dark"], sk["head"])
        para_border(p, "bottom", sk["line"], 6, 3)
        classic_block(d, s, sk, cw)
    fp(d, "languages · interests · references", 8.5, True, sk["mid"], before=12, after=3)
    t = table(d, [cw // 3] * 2 + [cw - cw // 3 * 2], 1, sk["line"], margin=(70, 110)); row_height(t.rows[0], 66)
    for c, lab in zip(t.rows[0].cells, ["언어 · 수준", "관심 분야 · 취미", "추천인 (선택)"]):
        shade(c, sk["soft"]); ct(c, lab, 8.5, True, sk["dark"]); ct(c, "입력하세요", 8.5, None, sk["hint"])
    return d


LAYOUTS = [r_ncs, r_career, r_fresh, r_portfolio, r_json]
