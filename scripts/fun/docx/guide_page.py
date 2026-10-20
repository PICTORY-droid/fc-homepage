"""모든 양식 마지막 장에 붙는 '작성 가이드 + 예시' — 근거는 guide_data.py 위쪽 설명 참고."""
from docx_kit import para_border
from doc_blocks import ct, fp, fr, row_height, shade, spacer, table
from guide_data import COVER_RULES, GUIDE, RESUME_RULES
from cover_layouts import STAR


def add_guide(d, kind, pid, name, sk):
    tip, ex, star = GUIDE[pid]
    cw = 690
    d.add_page_break()
    p = fp(d, "", after=2); fr(p, "작성 가이드", 18, True, sk["dark"], sk["head"], 3); fr(p, "   제출 전에 이 장은 지우세요", 9, None, sk["gray"])
    para_border(p, "bottom", sk["mid"], 12, 4)
    fp(d, f"{name} {'이력서' if kind == 'resume' else '자기소개서'}", 9.5, True, sk["mid"], before=4, after=6)
    rules = RESUME_RULES if kind == "resume" else COVER_RULES
    for i, r in enumerate(rules, 1):
        p = fp(d, "", after=3); fr(p, f"{i}.  ", 9.5, True, sk["mid"]); fr(p, r, 9.5)
    t = table(d, [cw], 1, None, margin=(90, 150)); c = t.rows[0].cells[0]; shade(c, sk["soft"])
    ct(c, f"{name}는 이렇게", 9.5, True, sk["dark"]); ct(c, tip, 9.5, None, sk["dark"], before=2)
    spacer(d, 8)
    if kind == "resume":
        fp(d, "경력·성과 이렇게 적어요 (예시 — 가상의 내용입니다)", 10, True, sk["dark"], after=3)
        t = table(d, [cw], 1, sk["line"], margin=(90, 150)); ct(t.rows[0].cells[0], ex, 9.5, None, sk["mid"])
        fp(d, "쓰기 전 체크", 10, True, sk["dark"], before=10, after=3)
        for line in ["□ 최근 것이 위에 있나요?   □ 숫자(건수·%·금액·기간)가 들어 있나요?   □ 내가 한 일과 팀이 한 일이 구분되나요?",
                     "□ 오탈자·날짜 오류가 없나요?   □ 파일 이름은 '이름_직무'인가요?   □ 직무와 무관한 개인정보는 뺐나요?"]:
            fp(d, line, 9, None, sk["gray"], after=2)
    else:
        fp(d, "STAR 이렇게 적어요 (예시 — 가상의 내용입니다)", 10, True, sk["dark"], after=3)
        t = table(d, [86, cw - 86], 4, sk["line"], margin=(60, 120))
        for r, (_, lab, _ph), text in zip(t.rows, STAR, star):
            shade(r.cells[0], sk["soft"]); ct(r.cells[0], lab, 9.5, True, sk["dark"], "center", where="center"); row_height(r, 34); ct(r.cells[1], text, 9.5, None, sk["mid"], where="center")
        fp(d, "쓰기 전 체크", 10, True, sk["dark"], before=10, after=3)
        for line in ["□ 첫 문장에 결론(핵심 메시지)이 있나요?   □ '내가 한 일'이 주어로 분명한가요?   □ 결과에 숫자가 있나요?",
                     "□ 문항이 묻는 것에 정확히 답했나요?   □ 글자 수를 지켰나요?   □ 다른 회사 이름이 남아 있지 않나요?"]:
            fp(d, line, 9, None, sk["gray"], after=2)
    fp(d, "참고: 고용24 이력서·자기소개서 작성 가이드, NCS 입사지원서 구성, STAR 기법 해설, JSON Resume 스키마 (공개 자료를 바탕으로 풀어 쓴 안내입니다)", 8, None, sk["hint"], before=14)
