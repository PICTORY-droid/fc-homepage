"""자기소개서 양식 6~10번.
  6 NCS 4문항형 · 7 준비 4단계형 · 8 경험 3카드형 · 9 두괄식형 · 10 직무 매칭형
근거: 고용24 자기소개서 가이드(준비 4단계·문항별 답변), 캐치 NCS 가이드(지원동기·직무경험·조직적합성·직업기초능력), 하이잡 STAR."""
from docx.shared import Pt

from cover_data import Q
from cover_layouts import STAR, answer_box, info_row, para_bd
from doc_blocks import borders, count_hint, ct, fp, fr, new_doc, row_height, shade, spacer, table, tab_right, valign

NAMES = ["NCS 4문항형", "준비 4단계형", "경험3카드형", "두괄식형", "직무매칭형"]


def _title(d, sk, cw, name, sub, k):
    p = fp(d, "", after=8); fr(p, "자기소개서", 21, True, sk["dark"], sk["head"], 4); tab_right(p, cw); fr(p, "\t" + name, 10, None, sk["gray"])
    para_bd(p, "bottom", sk["mid"], [18, 10, 24, 14][k % 4], 4)
    if sub:
        fp(d, sub, 8.5, None, sk["gray"], after=6)


def _q(d, sk, n, q, hint, tag=None):
    p = fp(d, "", before=10, after=4, keep_next=True)
    fr(p, f"{n}. ", 10.5, True, sk["mid"])
    if tag:
        fr(p, tag + "  ", 10.5, True, sk["dark"], sk["head"])
    fr(p, q, 10, tag is None or None, sk["dark"] if tag is None else sk["gray"]); fr(p, f"   {hint}", 8.5, None, sk["gray"])


# ---------------------------------------------------------------- 6 NCS 4문항형
NCS_HEADS = [("지원 동기", 0), ("직무 관련 경험·역량", 1), ("조직 적합성 · 협업", 2), ("직업기초능력 · 문제해결", 5)]


def c_ncs(pid, name, sk, k):
    d = new_doc(f"자기소개서(NCS) · {name}", sk, (46, 52, 40, 52)); cw = 690
    _title(d, sk, cw, name, "NCS 기반 채용에서 자주 묻는 네 가지 — 지원동기 · 직무경험 · 조직적합성 · 직업기초능력", k)
    info_row(d, ["성 명", "지원 직무", "지원 회사"], sk, cw, "tint")
    for n, (head, qi) in enumerate(NCS_HEADS, 1):
        q, hint, h = Q[pid][qi]
        t = table(d, [92, cw - 92], 1, None, margin=(60, 120)); a, b = t.rows[0].cells
        shade(a, sk["dark"]); ct(a, f"{n:02d}", 15, True, "FFFFFF", "center", font=sk["head"]); ct(a, head, 8.5, True, "FFFFFF", "center"); valign(a, "center")
        shade(b, sk["soft"]); ct(b, q, 10, True, sk["dark"]); ct(b, hint, 8.5, None, sk["gray"]); valign(b, "center")
        row_height(t.rows[0], 52)
        answer_box(d, sk, cw, h - 10, "", True)
        spacer(d, 4)
    return d


# ---------------------------------------------------------------- 7 준비 4단계형
STEPS = [("① 정보 수집", "회사·직무·채용공고의 핵심 키워드"), ("② 역량 정리", "내가 가진 강점·지식·기술"), ("③ 경험 정리", "역량을 보여 줄 경험 2~3개"), ("④ 비전 설정", "입사 후 1년·3년 목표")]


def c_prep(pid, name, sk, k):
    d = new_doc(f"자기소개서(준비) · {name}", sk, (44, 50, 38, 50)); cw = 694
    _title(d, sk, cw, name, "먼저 아래 4단계를 채워 보고, 그 내용으로 문항에 답하세요. (고용24 자기소개서 준비 순서)", k)
    t = table(d, [cw // 4] * 3 + [cw - cw // 4 * 3], 1, sk["line"], margin=(70, 110)); row_height(t.rows[0], 112)
    for c, (a, b) in zip(t.rows[0].cells, STEPS):
        shade(c, sk["soft"]); ct(c, a, 9.5, True, sk["dark"]); ct(c, b, 8, None, sk["gray"], after=3); ct(c, "• \n• \n• ", 9, None, sk["hint"])
    spacer(d, 4)
    info_row(d, ["성 명", "지원 직무", "지원 회사"], sk, cw, "under")
    for n, qi in enumerate([0, 1, 2, 4], 1):
        q, hint, h = Q[pid][qi]
        _q(d, sk, n, q, hint)
        answer_box(d, sk, cw, h - 20, "", True)
    return d


# ---------------------------------------------------------------- 8 경험 3카드형
def c_exp3(pid, name, sk, k):
    d = new_doc(f"자기소개서(경험) · {name}", sk, (44, 50, 36, 50)); cw = 694
    _title(d, sk, cw, name, "경험 3개를 STAR로 먼저 정리해 두면 어떤 문항에도 꺼내 쓸 수 있어요. 경험마다 '내가 한 일'과 숫자 결과를 꼭 넣으세요.", k)
    info_row(d, ["성 명", "지원 직무", "지원 회사"], sk, cw, "grid")
    for n in range(1, 4):
        p = fp(d, "", before=10, after=3, keep_next=True); fr(p, f"경험 {n}", 10.5, True, sk["mid"], sk["head"]); fr(p, "   제목 :  ", 9, None, sk["gray"]); fr(p, "입력하세요", 9, None, sk["hint"])
        t = table(d, [86, cw - 86], 4, sk["line"], margin=(50, 110))
        for r, (_, lab, ph) in zip(t.rows, STAR):
            row_height(r, 52); shade(r.cells[0], sk["soft"]); p = ct(r.cells[0], lab, 9.5, True, sk["dark"], "center", where="center")
            ct(r.cells[1], ph, 8, None, sk["hint"])
    for n, qi in enumerate([0, 4], 4):
        q, hint, h = Q[pid][qi]
        _q(d, sk, n - 3, q, hint, "마무리 문항")
        answer_box(d, sk, cw, 110, "", True)
    return d


# ---------------------------------------------------------------- 9 두괄식형
def c_head(pid, name, sk, k):
    d = new_doc(f"자기소개서(두괄식) · {name}", sk, (50, 56, 40, 56)); cw = 682
    _title(d, sk, cw, name, "한 줄 결론 → 근거 3가지 → 본문 순서로 쓰면 읽는 사람이 첫 줄에서 핵심을 알아요.", k)
    info_row(d, ["성 명", "지원 직무", "지원 회사"], sk, cw, "under")
    for n, qi in enumerate([0, 1, 3], 1):
        q, hint, h = Q[pid][qi]
        _q(d, sk, n, q, hint)
        t = table(d, [96, cw - 96], 1, sk["line"], margin=(50, 110)); a, b = t.rows[0].cells
        shade(a, sk["dark"]); ct(a, "한 줄 결론", 9, True, "FFFFFF", "center", where="center"); row_height(t.rows[0], 34)
        ct(b, "", 9)
        t = table(d, [96, cw - 96], 3, sk["line"], margin=(40, 110))
        for i, r in enumerate(t.rows):
            row_height(r, 28); shade(r.cells[0], sk["soft"]); ct(r.cells[0], f"근거 {i + 1}", 8.5, True, sk["dark"], "center", where="center")
        answer_box(d, sk, cw, max(h - 70, 90), "", True)
    return d


# ---------------------------------------------------------------- 10 직무 매칭형
def c_match(pid, name, sk, k):
    d = new_doc(f"자기소개서(직무 매칭) · {name}", sk, (46, 52, 40, 52)); cw = 690
    _title(d, sk, cw, name, "채용공고의 '요구 역량'을 그대로 옮기고, 각 항목에 해당하는 내 경험과 근거를 짝지어 보세요.", k)
    info_row(d, ["성 명", "지원 직무", "지원 회사"], sk, cw, "grid")
    fp(d, "직무 매칭표", 10.5, True, sk["dark"], before=10, after=3, font=sk["head"])
    t = table(d, [190, 330, 170], 6, sk["line"], margin=(40, 100))
    for c, lab in zip(t.rows[0].cells, ["공고의 요구 역량·우대사항", "내 경험 (한 줄)", "근거 (숫자·결과)"]):
        shade(c, sk["dark"]); ct(c, lab, 9, True, "FFFFFF", "center", where="center")
    row_height(t.rows[0], 28)
    for r in t.rows[1:]:
        row_height(r, 36)
    for n, qi in enumerate([0, 4], 1):
        q, hint, h = Q[pid][qi]
        _q(d, sk, n, q, hint)
        answer_box(d, sk, cw, h, "", True)
    fp(d, "면접에서 이어 말할 포인트 3가지", 10, True, sk["dark"], before=10, after=3, font=sk["head"])
    t = table(d, [cw // 3] * 2 + [cw - cw // 3 * 2], 1, sk["line"], margin=(60, 110)); row_height(t.rows[0], 70)
    for i, c in enumerate(t.rows[0].cells):
        shade(c, sk["soft"]); ct(c, f"포인트 {i + 1}", 8.5, True, sk["mid"]); ct(c, "입력하세요", 8.5, None, sk["hint"])
    return d


LAYOUTS = [c_ncs, c_prep, c_exp3, c_head, c_match]
