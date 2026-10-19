"""보험 증권 정리표 — 본인·부부·가족·부모님·사업자 5유형 × 10가지 차트 구성 = 50종. (정리용 중립 양식)"""
import datetime as dt
from xlsx_kit import cover, new_book, q, rng, slice_colors, style_chart

FLAVORS = [
    ("본인용", ["본인", "배우자", "부모님", "자녀", "형제·자매", "기타"]),
    ("부부용", ["남편", "아내", "공동", "남편 측 부모님", "아내 측 부모님", "기타"]),
    ("가족용", ["아빠", "엄마", "첫째", "둘째", "셋째", "기타"]),
    ("부모님용", ["아버지", "어머니", "조부모", "본인", "형제·자매", "기타"]),
    ("사업자용", ["대표자", "직원", "가족 직원", "사업장", "공동대표", "기타"]),
]
KINDS = ["종신", "정기", "건강·질병", "암", "상해", "실손의료", "연금", "저축성", "어린이", "자동차", "화재·재물", "배상책임", "기타"]
CYCLES = ["월납", "3개월납", "6개월납", "연납", "일시납", "납입완료"]
STATES = ["유지", "실효", "해지", "만기", "청약중"]
CHECKS = ["사망·재해", "질병 진단", "암", "뇌·심장", "입원", "수술", "상해", "실손의료", "치매·간병", "연금·노후자금", "자녀·태아", "배상책임", "화재·재물"]
PAIRS = [("pie", "column"), ("doughnut", "bar"), ("bar", "pie"), ("column", "doughnut"), ("pie", "bar"),
         ("doughnut", "column"), ("bar", "doughnut"), ("column", "pie"), ("pie", "doughnut"), ("doughnut", "pie")]
F1, FN = 6, 55


def flavor(i):
    return FLAVORS[i % 5][0]


def build(path, i, pal, message):
    name, people = FLAVORS[i % 5]
    sub = i // 5
    kind_chart, who_chart = PAIRS[sub]
    wb, fm = new_book(path, f"{name} 보험 증권 정리표", pal)
    cover(wb, fm, "시작하기", f"{name} 보험 증권 정리표", message, pal["name"], [
        "‘설정’ 시트에서 대상(사람) 이름을 우리 가족·사업장에 맞게 바꿔요.",
        "‘정리표’에 가입한 보험을 한 줄에 하나씩 적어요. 보험료·납입주기를 적으면 월 환산 금액이 자동으로 나와요.",
        "만기일을 적으면 ‘만기까지’ 칸이 자동으로 계산되고, 90일 이내는 노랗게, 30일 이내는 붉게 표시돼요.",
        "‘요약’에서 대상별·종류별 월 보험료와 만기 일정을 한눈에 볼 수 있어요.",
        "‘보장 체크’는 증권·약관을 보며 직접 표시하는 점검표예요.",
    ], ["이 양식은 가입 내용을 스스로 정리하기 위한 것이며 보험 가입을 권유하거나 보장의 적정성을 판단하지 않아요. 정확한 내용은 증권과 약관, 가입한 보험회사에서 확인하세요.",
        "주민등록번호·계좌번호 같은 민감한 정보는 적지 않는 것을 권해요. 증권 번호 대신 ‘보관 위치’를 적어 두세요."])
    wt, wsum, wchk, wset = (wb.add_worksheet(n) for n in ["정리표", "요약", "보장 체크", "설정"])

    # ── 설정
    wset.hide_gridlines(2); wset.set_tab_color(pal["accent"])
    wset.set_column("A:A", 3); wset.set_column("B:G", 16)
    wset.merge_range("B1:G1", "설정 — 이름을 우리 집에 맞게 바꿔요", fm.title(16))
    for c, h in enumerate(["대상(사람)", "보험 종류", "납입주기", "상태"]):
        wset.write(2, 1 + c, h, fm.head())
    for k, v in enumerate(people):
        wset.write(3 + k, 1, v, fm.inp())
    for k, v in enumerate(KINDS):
        wset.write(3 + k, 2, v, fm.inp())
    for k, v in enumerate(CYCLES):
        wset.write(3 + k, 3, v, fm.cell())
    for k, v in enumerate(STATES):
        wset.write(3 + k, 4, v, fm.cell())
    wb.define_name("People", "=" + rng("설정", "$B$4:$B$9"))
    wb.define_name("Kinds", "=" + rng("설정", "$C$4:$C$16"))
    wb.define_name("Cycles", "=" + rng("설정", "$D$4:$D$9"))
    wb.define_name("States", "=" + rng("설정", "$E$4:$E$8"))

    # ── 정리표
    wt.set_tab_color(pal["main"])
    for col, w in zip("ABCDEFGHIJKLMN", [5, 12, 14, 24, 11, 12, 12, 10, 12, 12, 8, 14, 30, 20]):
        wt.set_column(f"{col}:{col}", w)
    wt.merge_range("A1:N1", f"{name} 보험 증권 정리표", fm.title(18))
    wt.merge_range("A2:N2", f"“{message}”", fm.sub())
    kp = [("유지 중인 건수", f'=COUNTIF($K${F1}:$K${FN},"유지")', "0"), ("월 환산 보험료 합계", f"=SUM($J${F1}:$J${FN})", "#,##0"),
          ("만기 30일 이내", f'=COUNTIFS($L${F1}:$L${FN},">=0",$L${F1}:$L${FN},"<=30")', "0"), ("만기 90일 이내", f'=COUNTIFS($L${F1}:$L${FN},">=0",$L${F1}:$L${FN},"<=90")', "0")]
    for k, (lab, fo, nf) in enumerate(kp):
        c0 = 1 + k * 3
        wt.merge_range(2, c0, 2, c0 + 2, lab, fm.kpi_label())
        wt.merge_range(3, c0, 3, c0 + 2, "", fm.kpi_value(nf))
        wt.write_formula(3, c0, fo, fm.kpi_value(nf))
    heads = ["No", "대상", "보험회사", "상품명", "종류", "가입일", "만기일", "납입주기", "보험료(원)", "월 환산(원)", "상태", "만기까지", "주요 보장·특이사항", "보관 위치"]
    for c, h in enumerate(heads):
        wt.write(4, c, h, fm.head())
    wt.set_row(4, 28)
    ex = [(people[0], "우체국", "예시 상품(지우고 쓰세요)", KINDS[2], dt.date(2022, 3, 15), dt.date(2042, 3, 15), "월납", 52000, "유지", "예시", "서랍 파일 1번"),
          (people[1], "예시 보험사", "예시 상품 B", KINDS[5], dt.date(2023, 7, 1), dt.date(2026, 12, 31), "월납", 18000, "유지", "예시", "스마트폰 사진"),
          (people[2], "우체국", "예시 상품 C", KINDS[6], dt.date(2019, 11, 20), dt.date(2049, 11, 20), "연납", 600000, "유지", "예시", "")]
    for r in range(F1 - 1, FN):
        e = ex[r - (F1 - 1)] if r - (F1 - 1) < len(ex) else None
        wt.write_number(r, 0, r - (F1 - 2), fm.cell(align="center", font_color="#888888"))
        vals = [e[0], e[1], e[2], e[3]] if e else ["", "", "", ""]
        for c, v in zip((1, 2, 3, 4), vals):
            wt.write(r, c, v, fm.inp(align="center" if c in (1, 4) else "left"))
        for c, idx in ((5, 4), (6, 5)):
            if e:
                wt.write_datetime(r, c, dt.datetime.combine(e[idx], dt.time()), fm.inp(num_format="yyyy-mm-dd", align="center"))
            else:
                wt.write_blank(r, c, None, fm.inp(num_format="yyyy-mm-dd", align="center"))
        wt.write(r, 7, e[6] if e else "", fm.inp(align="center"))
        wt.write(r, 8, e[7] if e else "", fm.inp(num_format="#,##0"))
        rr = r + 1
        wt.write_formula(r, 9, f'=IF(OR(I{rr}="",K{rr}<>"유지"),0,IF(H{rr}="월납",I{rr},IF(H{rr}="3개월납",I{rr}/3,IF(H{rr}="6개월납",I{rr}/6,IF(H{rr}="연납",I{rr}/12,0)))))', fm.money())
        wt.write(r, 10, e[8] if e else "", fm.inp(align="center"))
        wt.write_formula(r, 11, f'=IF(OR(G{rr}="",K{rr}<>"유지"),"",G{rr}-TODAY())', fm.cell(num_format='#,##0"일 남음";"기간 지남"', align="center"))
        wt.write(r, 12, e[9] if e else "", fm.inp())
        wt.write(r, 13, e[10] if e else "", fm.inp())
    wt.data_validation(F1 - 1, 1, FN - 1, 1, {"validate": "list", "source": "=People", "error_type": "warning"})
    wt.data_validation(F1 - 1, 4, FN - 1, 4, {"validate": "list", "source": "=Kinds", "error_type": "warning"})
    wt.data_validation(F1 - 1, 7, FN - 1, 7, {"validate": "list", "source": "=Cycles"})
    wt.data_validation(F1 - 1, 10, FN - 1, 10, {"validate": "list", "source": "=States"})
    wt.data_validation(F1 - 1, 5, FN - 1, 6, {"validate": "date", "criteria": "between", "minimum": dt.date(1950, 1, 1), "maximum": dt.date(2200, 12, 31), "error_title": "날짜 확인", "error_message": "날짜 형식(예: 2030-05-20)으로 입력해 주세요."})
    wt.data_validation(F1 - 1, 8, FN - 1, 8, {"validate": "decimal", "criteria": ">=", "value": 0, "error_title": "금액 확인", "error_message": "0 이상의 숫자만 입력해 주세요."})
    wt.conditional_format(F1 - 1, 11, FN - 1, 11, {"type": "cell", "criteria": "between", "minimum": 0, "maximum": 30, "format": wb.add_format({"bg_color": "#F8D7DA", "font_color": "#842029", "bold": True})})
    wt.conditional_format(F1 - 1, 11, FN - 1, 11, {"type": "cell", "criteria": "between", "minimum": 31, "maximum": 90, "format": wb.add_format({"bg_color": "#FFF3CD", "font_color": "#664D03"})})
    wt.conditional_format(F1 - 1, 0, FN - 1, 13, {"type": "formula", "criteria": f'=OR($K{F1}="해지",$K{F1}="만기",$K{F1}="실효")', "format": wb.add_format({"font_color": "#999999"})})
    wt.freeze_panes(5, 4); wt.autofilter(4, 0, FN - 1, 13); wt.set_landscape(); wt.fit_to_pages(1, 0); wt.repeat_rows(4)

    # ── 요약
    wsum.hide_gridlines(2); wsum.set_tab_color(pal["main"])
    wsum.set_column("A:A", 3); wsum.set_column("B:B", 18); wsum.set_column("C:E", 14); wsum.set_column("F:F", 3); wsum.set_column("G:G", 18); wsum.set_column("H:J", 14)
    wsum.merge_range("B1:J1", "요약 (자동 계산)", fm.title(16))
    B, E, J, K, L = (rng("정리표", f"${c}${F1}:${c}${FN}") for c in "BEJKL")
    for c, h in enumerate(["대상별", "건수", "월 환산(원)", "비중"]):
        wsum.write(2, 1 + c, h, fm.head())
    for k in range(6):
        r = 4 + k
        wsum.write_formula(f"B{r}", f"={q('설정')}!B{4 + k}", fm.cell())
        wsum.write_formula(f"C{r}", f'=COUNTIFS({B},B{r},{K},"유지")', fm.cell(align="center"))
        wsum.write_formula(f"D{r}", f"=SUMIFS({J},{B},B{r})", fm.money())
        wsum.write_formula(f"E{r}", f'=IF($D$10=0,"",D{r}/$D$10)', fm.cell(num_format="0%", align="center"))
    wsum.write("B10", "합계", fm.total()); wsum.write_formula("C10", "=SUM(C4:C9)", fm.total(align="center")); wsum.write_formula("D10", "=SUM(D4:D9)", fm.total(num_format="#,##0")); wsum.write("E10", "", fm.total())
    for c, h in enumerate(["종류별", "건수", "월 환산(원)", "비중"]):
        wsum.write(2, 6 + c, h, fm.head())
    for k in range(13):
        r = 4 + k
        wsum.write_formula(f"G{r}", f"={q('설정')}!C{4 + k}", fm.cell())
        wsum.write_formula(f"H{r}", f'=COUNTIFS({E},G{r},{K},"유지")', fm.cell(align="center"))
        wsum.write_formula(f"I{r}", f"=SUMIFS({J},{E},G{r})", fm.money())
        wsum.write_formula(f"J{r}", f'=IF($I$17=0,"",I{r}/$I$17)', fm.cell(num_format="0%", align="center"))
    wsum.write("G17", "합계", fm.total()); wsum.write_formula("H17", "=SUM(H4:H16)", fm.total(align="center")); wsum.write_formula("I17", "=SUM(I4:I16)", fm.total(num_format="#,##0")); wsum.write("J17", "", fm.total())
    wsum.write("B12", "만기 일정", fm.head()); wsum.write("C12", "건수", fm.head())
    for k, (lab, hi) in enumerate([("30일 이내", 30), ("90일 이내", 90), ("180일 이내", 180), ("1년 이내", 365)]):
        wsum.write(12 + k, 1, lab, fm.cell()); wsum.write_formula(12 + k, 2, f'=COUNTIFS({L},">=0",{L},"<={hi}")', fm.cell(align="center"))
    wsum.write("B17", "이미 지난 만기", fm.cell()); wsum.write_formula("C17", f'=COUNTIFS({L},"<0")', fm.cell(align="center"))
    ch1 = wb.add_chart({"type": kind_chart})
    sd = {"name": "종류별 월 환산", "categories": rng("요약", "$G$4:$G$16"), "values": rng("요약", "$I$4:$I$16")}
    if kind_chart in ("pie", "doughnut"):
        sd["points"] = [{"fill": {"color": c}} for c in slice_colors(pal, 13)]
    else:
        sd["fill"] = {"color": pal["main"]}
    ch1.add_series(sd); style_chart(ch1, fm, "보험 종류별 월 환산 보험료", 520, 320, "right" if kind_chart in ("pie", "doughnut") else None); wsum.insert_chart("L3", ch1)
    ch2 = wb.add_chart({"type": who_chart})
    sd = {"name": "대상별 월 환산", "categories": rng("요약", "$B$4:$B$9"), "values": rng("요약", "$D$4:$D$9")}
    if who_chart in ("pie", "doughnut"):
        sd["points"] = [{"fill": {"color": c}} for c in slice_colors(pal, 6)]
    else:
        sd["fill"] = {"color": pal["accent"]}
    ch2.add_series(sd); style_chart(ch2, fm, "대상별 월 환산 보험료", 520, 300, "right" if who_chart in ("pie", "doughnut") else None); wsum.insert_chart("L20", ch2)
    wsum.set_landscape(); wsum.fit_to_pages(1, 1)

    # ── 보장 체크
    wchk.hide_gridlines(2); wchk.set_tab_color(pal["main"])
    wchk.set_column("A:A", 3); wchk.set_column("B:B", 20); wchk.set_column("C:H", 14)
    wchk.merge_range("B1:H1", "보장 체크 — 증권·약관을 보며 직접 표시해요", fm.title(16))
    wchk.write("B2", "확인한 날", fm.head()); wchk.write_datetime("C2", dt.datetime(2026, 1, 1), fm.inp(num_format="yyyy-mm-dd", align="center"))
    wchk.write("B4", "보장 항목 \\ 대상", fm.head())
    for k in range(6):
        wchk.write_formula(3, 2 + k, f"={q('설정')}!B{4 + k}", fm.head())
    for r, item in enumerate(CHECKS):
        wchk.write(4 + r, 1, item, fm.cell())
        for k in range(6):
            wchk.write_blank(4 + r, 2 + k, None, fm.inp(align="center"))
    wchk.data_validation(4, 2, 4 + len(CHECKS) - 1, 7, {"validate": "list", "source": ["가입 확인", "확인 필요", "해당 없음"]})
    wchk.conditional_format(4, 2, 4 + len(CHECKS) - 1, 7, {"type": "cell", "criteria": "==", "value": '"가입 확인"', "format": wb.add_format({"bg_color": pal["soft"], "font_color": pal["dark"], "bold": True})})
    wchk.conditional_format(4, 2, 4 + len(CHECKS) - 1, 7, {"type": "cell", "criteria": "==", "value": '"확인 필요"', "format": wb.add_format({"bg_color": "#FFF3CD", "font_color": "#664D03"})})
    wchk.conditional_format(4, 2, 4 + len(CHECKS) - 1, 7, {"type": "cell", "criteria": "==", "value": '"해당 없음"', "format": wb.add_format({"font_color": "#999999"})})
    wchk.merge_range(4 + len(CHECKS) + 1, 1, 4 + len(CHECKS) + 2, 7, "칸을 눌러 ‘가입 확인 / 확인 필요 / 해당 없음’ 중에서 고르세요. 보장의 적정성을 판단하는 표가 아니라, 내가 가진 보험을 점검하는 메모용 표예요.", fm.note())
    wchk.set_landscape(); wchk.fit_to_pages(1, 1)
    wb.get_worksheet_by_name("시작하기").activate()
    wb.close()
