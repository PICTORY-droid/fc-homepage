"""PPT 6항목 — 발표·가족·돌잔치·결혼식·보험 점검 양식·카드뉴스. 전문가용 엔진(pro_deck)으로 조립합니다.
구성(문구) 데이터는 pro_data 에 있습니다."""
from pro_data import (BDAY, CHECK_ITEMS, FAMILY, NEWS, REVIEW, TALK, WED, bday_flavor, family_flavor, news_flavor,  # noqa: F401
                      review_flavor, talk_flavor, wed_flavor)  # flavor 함수는 make_pptx_pack 이 가져다 씁니다
from pro_deck import Deck

HOW = "제목·글은 눌러서 바로 고치세요. 사진 자리는 가운데 아이콘을 누르면 사진을 넣을 수 있고, 모양에 맞춰 자동으로 잘려요. 색·글꼴은 [디자인 > 변형]에서 한 번에 바꿀 수 있어요."


def _rows_text(n, text="내용을 입력하세요"):
    return [text] * n


# ───────────────────────── 1. 발표 템플릿
def build_talk(path, i, pal, message):
    fl, toc, points, cmp_, heads = TALK[i % 5]
    d = Deck(i, 0, "PRESENTATION", f"{fl} 발표 템플릿", subject=f"{fl} 발표 자료", keywords="발표,PPT,템플릿")
    d.cover("발표 제목을 입력하세요", message, [f"{fl} · 발표자 이름", "날짜 입력"], notes=f"표지입니다. 날짜·발표자는 아래 안내 문구를 눌러 고치세요. {HOW}")
    s_toc = d.page("목차", "CONTENTS", notes="목차의 각 줄을 누르면 해당 쪽으로 이동합니다(슬라이드 쇼에서). 줄을 지우거나 늘려도 됩니다.")
    d.rows([(t, "한 줄로 내용을 적어 주세요") for t in toc], h_each=1.0)
    toc_groups = list(d._anim)
    d.page("한 문장으로 말하면", "MESSAGE", quote=True, notes="발표 전체를 한 문장으로 줄여 적어 보세요.")
    d.page("핵심 3가지", "POINTS", notes="카드 제목과 내용을 고치세요. 카드는 슬라이드 쇼에서 차례로 나타납니다.")
    d.cards([(pt, ["내용을 입력하세요", "내용을 입력하세요"]) for pt in points], h=3.8)
    d.page("한눈에 비교", "COMPARE", notes="왼쪽과 오른쪽 칸의 제목·내용을 고치세요.")
    d.two_col((cmp_[0], _rows_text(3)), (cmp_[1], _rows_text(3)), h=3.9)
    l, t, r, b = d.rect
    d.page("숫자로 보기", "NUMBERS", notes="차트를 우클릭 > [데이터 편집]으로 숫자를 바꾸면 그래프가 자동으로 바뀝니다. 지금 숫자는 예시입니다.")
    d.chart("col", l, t, r - l - 3.4, b - t - .3, ["1분기", "2분기", "3분기", "4분기"], [("목표", (60, 70, 80, 90)), ("실적", (55, 72, 78, 95))], numfmt='0')
    d.text(r - 3.1, t + .3, 3.1, 1.2, ["예시 숫자입니다", "차트를 우클릭해서", "데이터를 고치세요"], size=13, color="mute", name="차트 안내", spacing=1.4)
    d.page("일정·현황", "SCHEDULE", notes="표의 칸을 눌러 내용을 입력하세요. 행은 Tab 키로 추가됩니다.")
    d.table(l, t, r - l, [heads] + [[f"{k}", "내용 입력", "", ""] for k in range(1, 6)], row_h=0.72, size=15, first_col=True)
    d.page("질문과 의견", "Q & A", quote=True, notes="질문 받는 시간입니다.")
    d.cover("감사합니다", "끝까지 들어 주셔서 고맙습니다", ["문의 · 연락처를 입력하세요"], closing=True, notes="마지막 쪽입니다.")
    for g, idx in zip(toc_groups, (3, 4, 5, 6, 7)):
        d._links.append((g, idx))
    d.save(path)


# ───────────────────────── 2. 가족 소개
def build_family(path, i, pal, message):
    fl, members, steps, promises = FAMILY[i % 5]
    d = Deck(i, 1, "FAMILY ALBUM", f"{fl} 가족 소개", subject=f"{fl} 가족 소개 슬라이드", keywords="가족,소개,PPT")
    d.cover("우리 가족을 소개합니다", message, [f"{fl} · 날짜 입력"], notes=f"표지입니다. {HOW}")
    d.page("가족 구성원", "MEMBERS", photo=True, notes="사진 자리의 아이콘을 눌러 가족 사진을 넣으세요. 이름·소개 글은 눌러서 고칩니다.")
    l, t, r, b = d.rect
    n, gap = len(members), .3
    pw = (r - l - gap * (n - 1)) / n
    for k, (role, lines) in enumerate(members):
        d.person(l + k * (pw + gap), t, pw, b - t, role, lines, 13 + k)
    d.drop_unused_pics()
    d.page("우리 가족 이야기", "OUR STORY", notes="때·제목·내용을 고치세요. 단계는 복사해서 늘릴 수 있어요.")
    d.timeline(steps)
    d.page("우리 가족의 약속", "PROMISE", notes="가족끼리 정한 약속을 적어 보세요.")
    d.rows([(f"약속 {k + 1}", p_) for k, p_ in enumerate(promises)], h_each=1.1, size=17)
    d.page("가족 사진", "ALBUM", photo=True, notes="사진 자리를 눌러 사진을 넣으세요.")
    d.photo_grid(3, 2)
    d.page("가족에게 한마디", "MESSAGE", quote=True, notes="가족에게 전하고 싶은 한마디를 적어 보세요.")
    d.cover("우리 가족 소개를 마칩니다", "읽어 주셔서 고맙습니다", ["고맙습니다 · 가족 이름"], closing=True)
    d.save(path)


# ───────────────────────── 3. 돌잔치
def build_birthday(path, i, pal, message):
    fl, ta, tb = BDAY[i % 5]
    f = i % 5
    d = Deck(i, 2, "FIRST BIRTHDAY", f"돌잔치 슬라이드({fl})", subject=f"돌잔치 슬라이드 · {fl}", keywords="돌잔치,첫돌,PPT")
    d.cover("첫 번째 생일", message, ["아기 이름 · 날짜 입력", "장소를 입력하세요"], notes=f"표지입니다. {HOW}")
    d.page("우리 아기를 소개합니다", "BABY", photo=True, notes="아기 사진을 넣고, 오른쪽 표의 칸을 눌러 내용을 적으세요.")
    l, t, r, b = d.rect
    d.photo_slot(13, l, t, 4.2, b - t - .2, geom=["round", "arch", "oval"][d.cfg["pf"]] if d.cfg["pf"] != 2 else "round", label="아기 사진")
    d.drop_unused_pics()
    d.table(l + 4.6, t, r - l - 4.6, [["이름", "입력하세요"], ["생일", "입력하세요"], ["키 · 몸무게", "입력하세요"], ["좋아하는 것", "입력하세요"], ["별명", "입력하세요"], ["부모의 마음", "입력하세요"]], col_w=[2.0, r - l - 6.6], row_h=.72, size=15, head=False, first_col=True)
    d.page(ta, ta.split()[0].upper() if ta.isascii() else "STORY", photo=(f == 2), notes="내용을 입력하세요.")
    l, t, r, b = d.rect
    if f == 0:
        d.timeline([("1개월", "처음 눈을 맞춘 날", "기억을 적어 주세요"), ("3개월", "처음 웃은 날", "기억을 적어 주세요"), ("6개월", "뒤집기 성공", "기억을 적어 주세요"), ("9개월", "첫 이유식", "기억을 적어 주세요"), ("12개월", "첫 걸음", "기억을 적어 주세요")], size=13, head_size=16)
    elif f == 1:
        d.cards([("연필 · 공부", "학문과 총명을 바라는 마음"), ("실 · 장수", "건강하고 오래 살기를"), ("돈 · 부", "넉넉한 삶을 바라는 마음"), ("마이크 · 인기", "사람들에게 사랑받기를")], h=b - t, size=14, head_size=16)
    elif f == 2:
        w2 = (r - l - .3) / 2
        d.photo_slot(13, l, t, w2, b - t, geom="round", label="대표 사진 1")
        d.photo_slot(14, l + w2 + .3, t, w2, b - t, geom="round", label="대표 사진 2")
        d.drop_unused_pics()
    elif f == 3:
        with d.group("초대 글 칸") as g:
            d._box(l, t, r - l, b - t, "초대 글 칸")
            d.text(l + .6, t + .4, r - l - 1.2, b - t - .8, ["저희 아이의 첫 생일에 모십니다.", "", "오셔서 같이 밥 한 끼 해 주세요.", "", "일시 · 장소를 입력하세요"], size=20, align="c", anchor="m", spacing=1.4, name="초대 글")
        d._anim.append(g)
    else:
        d.timeline([("임신", "소식을 들은 날", "기억을 적어 주세요"), ("출산", "태어난 날", "기억을 적어 주세요"), ("첫 만남", "품에 안은 순간", "기억을 적어 주세요"), ("집으로", "함께 돌아온 날", "기억을 적어 주세요")])
    d.page(tb, "MEMORY", photo=(f == 1), notes="내용을 입력하세요.")
    l, t, r, b = d.rect
    if f == 0:
        d.chart("line", l, t, r - l, b - t - .2, ["3개월", "6개월", "9개월", "12개월"], [("키(cm)", (62, 68, 73, 76))], numfmt="0", legend=False)
        d.text(r - 3.4, t, 3.4, .6, "예시 숫자 — 차트를 우클릭해 고치세요", size=12, color="mute", align="r", name="차트 안내")
    elif f == 1:
        d.photo_slot(13, l, t, 5.0, b - t, geom="round", label="돌잡이 사진")
        d.drop_unused_pics()
        d._box(l + 5.4, t, r - l - 5.4, b - t, "선택 칸")
        d.text(l + 5.8, t + .4, r - l - 6.2, b - t - .8, ["우리 아기의 선택", "", "무엇을 집었나요?", "", "그때 가족의 반응은?"], size=18, spacing=1.4, name="선택 글")
    elif f == 2:
        d.cards([("첫 번째", "가장 좋아하는 순간"), ("두 번째", "가장 웃은 순간"), ("세 번째", "가장 크게 자란 순간")], h=b - t)
    elif f == 3:
        with d.group("편지 칸") as g:
            d._box(l, t, r - l, b - t, "편지 칸")
            d.text(l + .6, t + .4, r - l - 1.2, b - t - .8, ["사랑하는 우리 아기에게", "", "엄마 아빠의 마음을 적어 주세요.", "", "― 엄마 아빠가"], size=20, anchor="m", spacing=1.4, name="편지 글")
        d._anim.append(g)
    else:
        d.cards([("첫 웃음", "언제였나요?"), ("첫 뒤집기", "언제였나요?"), ("첫 이", "언제였나요?"), ("첫 걸음", "언제였나요?")], h=b - t, size=15)
    d.page("사진 모음", "PHOTOS", photo=True, notes="사진 자리를 눌러 사진을 넣으세요.")
    d.photo_grid(4, 2)
    d.cover("와 주셔서 고맙습니다", "아이가 한 살이 되었습니다", ["아기 이름 · 부모 이름"], closing=True)
    d.save(path)


# ───────────────────────── 4. 결혼식
def build_wedding(path, i, pal, message):
    fl, ta, tb = WED[i % 5]
    f = i % 5
    d = Deck(i, 3, "WEDDING", f"결혼식 슬라이드({fl})", subject=f"결혼식 상영용 슬라이드 · {fl}", keywords="결혼식,웨딩,PPT")
    d.cover("저희 결혼합니다", message, ["신랑 이름 ♥ 신부 이름", "날짜 입력 · 예식장 이름"], notes=f"표지입니다. {HOW}")
    d.page("신랑 · 신부 소개", "GROOM & BRIDE", photo=True, notes="사진 자리에 두 사람의 사진을 넣으세요.")
    l, t, r, b = d.rect
    pw = (r - l - 1.0) / 2
    d.person(l, t, pw, b - t, "신랑", ["이름 · 나이", "직업 · 취미", "신부에게 한마디"], 13)
    d.person(l + pw + 1.0, t, pw, b - t, "신부", ["이름 · 나이", "직업 · 취미", "신랑에게 한마디"], 14)
    d.drop_unused_pics()
    d.page(ta, ta.split()[0] if False else "OUR STORY", photo=(f == 3), notes="내용을 입력하세요.")
    l, t, r, b = d.rect
    if f == 0:
        d.two_col(("닮은 점", _rows_text(3)), ("다른 점", _rows_text(3)))
    elif f == 1:
        d.timeline([("처음 만난 날", "첫 만남", "어디에서 어떻게?"), ("첫 데이트", "설레던 하루", "무엇을 했나요?"), ("프러포즈", "평생을 약속하다", "그날의 이야기"), ("결혼", "오늘의 우리", "함께 시작합니다")])
    elif f == 2:
        d.table(l, t, r - l, [["시간", "순서", "담당"], ["00:00", "하객 맞이", ""], ["00:00", "신랑 · 신부 입장", ""], ["00:00", "혼인 서약", ""], ["00:00", "축가 · 감사 인사", ""], ["00:00", "기념 촬영 · 식사", ""]], col_w=[2.2, (r - l - 2.2) * .6, (r - l - 2.2) * .4], row_h=.72, size=15, first_col=True)
    elif f == 3:
        d.photo_slot(13, l, t, 6.6, b - t, geom="round", label="약도 · 지도를 넣어 주세요")
        d.drop_unused_pics()
        d.table(l + 7.0, t, r - l - 7.0, [["예식장", "입력하세요"], ["주소", "입력하세요"], ["일시", "입력하세요"], ["연락처", "입력하세요"]], col_w=[1.5, r - l - 8.5], row_h=.9, size=14, head=False, first_col=True)
    else:
        with d.group("감사 글 칸") as g:
            d._box(l, t, r - l, b - t, "감사 글 칸")
            d.text(l + .6, t + .4, r - l - 1.2, b - t - .8, ["바쁘신 중에 와 주셔서 고맙습니다.", "", "보내 주신 마음 잊지 않고", "잘 살겠습니다.", "", "신랑 · 신부 드림"], size=20, align="c", anchor="m", spacing=1.4, name="감사 글")
        d._anim.append(g)
    d.page(tb, "GUIDE", notes="내용을 입력하세요.")
    l, t, r, b = d.rect
    if f == 0:
        d.two_col(("신랑이 신부에게", ["하고 싶은 말을 적어 주세요"]), ("신부가 신랑에게", ["하고 싶은 말을 적어 주세요"]))
    elif f == 1:
        d.cards([("첫 여행", "어디였나요?"), ("첫 선물", "무엇이었나요?"), ("첫 다툼", "어떻게 풀었나요?"), ("첫 약속", "무엇이었나요?")], h=b - t, size=15)
    elif f == 2:
        d.cards([("주차 안내", "입력하세요"), ("식사 안내", "입력하세요"), ("기념 촬영", "입력하세요")], h=b - t, size=15)
    elif f == 3:
        d.cards([("지하철", "입력하세요"), ("버스", "입력하세요"), ("자가용 · 주차", "입력하세요")], h=b - t, size=15)
    else:
        d.cards([("답례품", "입력하세요"), ("방명록", "입력하세요"), ("사진 · 영상", "입력하세요")], h=b - t, size=15)
    d.page("웨딩 사진", "GALLERY", photo=True, notes="사진 자리를 눌러 사진을 넣으세요.")
    d.photo_grid(3, 2)
    d.page("서로에게 한마디", "VOW", quote=True, notes="서로에게 하고 싶은 말을 적어 보세요.")
    d.cover("와 주셔서 고맙습니다", "잘 살겠습니다", ["신랑 이름 ♥ 신부 이름"], closing=True)
    d.save(path)


# ───────────────────────── 5. 보험 보장 점검 발표자료 양식 (정리용·중립)
def build_review(path, i, pal, message):
    fl, cur = REVIEW[i % 5]
    d = Deck(i, 4, "INSURANCE CHECK", f"보험 보장 점검 발표자료({fl})", subject=f"보험 가입 내용 정리 양식 · {fl}", keywords="보험,점검,양식,PPT")
    d.cover("우리 보험 점검 시간", message, [f"{fl} · 날짜 입력", "가입 내용을 정리하고 함께 확인하는 양식"], notes=f"표지입니다. {HOW}")
    d.page("점검 대상 현황", "PROFILE", notes="표의 칸을 눌러 내용을 입력하세요.")
    l, t, r, b = d.rect
    d.table(l, t, r - l, cur, row_h=.8, size=16, first_col=True)
    d.page("가입한 보험 목록", "POLICY LIST", notes="증권을 보고 그대로 옮겨 적으세요. 행은 Tab 키로 늘릴 수 있어요.")
    d.table(l, t, r - l, [["보험회사", "상품명", "종류", "만기일", "월 보험료"]] + [["", "", "", "", ""] for _ in range(6)], col_w=[2.2, 3.4, 2.0, 2.0, r - l - 9.6], row_h=.66, size=14)
    d.page("보장 항목 체크", "CHECKLIST", notes="해당하는 칸에 ✔ 표시를 직접 적어 넣으세요.")
    d.table(l, t, r - l, [["보장 항목", "가입 확인", "확인 필요", "해당 없음"]] + [[c, "□", "□", "□"] for c in CHECK_ITEMS], col_w=[4.0, (r - l - 4.0) / 3, (r - l - 4.0) / 3, (r - l - 4.0) / 3], row_h=.58, size=14, first_col=True)
    d.page("월 보험료 한눈에", "PREMIUM", notes="숫자를 눌러 직접 고쳐 쓰세요. 오른쪽 도넛 차트는 예시이며 우클릭 > [데이터 편집]으로 바꿉니다.")
    d.cards([("월 보험료 합계", ["0원"]), ("연 보험료 합계", ["0원"]), ("월 소득 대비", ["0 %"])], y=t, h=2.6, size=26, head_size=17)
    d.chart("doughnut", l, t + 2.8, r - l, b - t - 2.9, ["보장성", "저축성", "연금성"], [("월 보험료 비중(예시)", (50, 30, 20))], legend=True, numfmt='0"%"')
    d.page("점검 메모와 다음 할 일", "NEXT", notes="확인할 것·문의할 것·정리할 날짜를 적어 두세요.")
    d.cards([("확인할 것", ["내용을 입력하세요"]), ("문의할 것", ["내용을 입력하세요"]), ("정리할 날짜", ["내용을 입력하세요"])], h=b - t - .8, size=15)
    d.text(l, b - .65, r - l, .6, "이 양식은 가입 내용을 스스로 정리하기 위한 것이며 보험 가입을 권유하거나 보장의 적정성을 판단하지 않습니다. 정확한 내용은 증권·약관과 가입한 보험회사에서 확인하세요.", size=11, color="mute", name="안내 문구")
    d.save(path)


# ───────────────────────── 6. 카드뉴스 (정사각)
def build_news(path, i, pal, message):
    fl, points = NEWS[i % 5]
    d = Deck(i, 5, "CARD NEWS", f"카드뉴스({fl})", size="square", subject=f"카드뉴스 · {fl}", keywords="카드뉴스,PPT")
    d.cover(message, "옆으로 넘겨 보세요 →", [f"{fl} · 카드뉴스"], notes=f"표지입니다. {HOW}")
    for k, (head, body) in enumerate(points, 1):
        d.page(head, f"{k:02d} / {len(points):02d}", notes="번호와 글을 눌러 고치세요.")
        l, t, r, b = d.rect
        d.text(l, t + .1, 2.6, 1.4, f"{k:02d}", size=66, bold=True, color="main", major=True, name="번호")
        d.text(l, t + 1.8, r - l, 2.9, body, size=26, spacing=1.45, name="본문")
    d.cover("저장해 두고 필요할 때 꺼내 보세요", "마음에 들면 공유해 주세요", ["이름 · 연락처를 입력하세요"], closing=True)
    d.save(path)
