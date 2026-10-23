"""가계부 — 5가지 가구 유형 × 10가지 차트 구성 = 50종."""
import datetime as dt
from xlsx_kit import cover, new_book, q, rng, series_colors, slice_colors, style_chart

TYPES = [
    {"name": "1인가구", "inc": ["월급", "부수입", "기타수입"], "salary": 2800000,
     "exp": [("월세·관리비", 560000), ("식비", 300000), ("배달·외식", 150000), ("교통", 70000), ("통신·구독", 90000), ("건강", 50000), ("취미·문화", 100000), ("경조사", 50000), ("저축·투자", 500000), ("기타", 60000)]},
    {"name": "2인가구", "inc": ["월급(본인)", "월급(배우자)", "기타수입"], "salary": 4200000,
     "exp": [("주거·대출", 900000), ("식비", 550000), ("외식·데이트", 250000), ("교통·차량", 250000), ("보험", 300000), ("여행", 200000), ("문화·취미", 150000), ("양가 용돈", 300000), ("저축·투자", 900000), ("기타", 120000)]},
    {"name": "핵가족", "inc": ["월급", "부수입", "기타수입"], "salary": 4800000,
     "exp": [("주거·대출", 1000000), ("식비", 800000), ("교육·학원", 650000), ("육아·의류", 250000), ("교통·차량", 300000), ("보험", 350000), ("의료", 120000), ("양가 용돈", 300000), ("저축", 700000), ("기타", 150000)]},
    {"name": "대가족", "inc": ["월급", "부모님 연금", "기타수입"], "salary": 5400000,
     "exp": [("주거·공과금", 1100000), ("식비", 1000000), ("부모님 의료·간병", 400000), ("교육", 700000), ("교통·차량", 350000), ("보험", 450000), ("경조사", 200000), ("용돈·효도", 300000), ("저축", 700000), ("기타", 200000)]},
    {"name": "기업·소상공인", "inc": ["매출", "기타수입", "이자·잡이익"], "salary": 18000000,
     "exp": [("인건비", 6000000), ("임차료·관리비", 2500000), ("원재료·상품", 4500000), ("광고·마케팅", 900000), ("차량·교통", 500000), ("통신·소프트웨어", 350000), ("세금·공과금", 1200000), ("접대·복리후생", 600000), ("설비·수선", 500000), ("기타", 300000)]},
]
# 월별 차트 × 분류별 차트 조합 10가지
COMBOS = [("column", None, "pie"), ("line", None, "doughnut"), ("area", None, "bar"), ("column", None, "doughnut"), ("line", None, "bar"),
          ("area", None, "pie"), ("column", None, "bar"), ("line", None, "pie"), ("area", None, "doughnut"), ("column", "stacked", "pie")]
METHODS = ["현금", "체크카드", "신용카드", "계좌이체", "간편결제", "기타"]
SPARK = ["column", "line", "column", "line", "column", "line", "column", "line", "column", "line"]
IN_LAST = 1004


def flavor(i):
    return TYPES[i % 5]["name"]


def _samples(t):
    rows = []
    for m in range(1, 7):
        rows.append((dt.date(2026, m, 25), "수입", t["inc"][0], "급여·매출 입금", t["salary"], "계좌이체"))
        for k, (cat, base) in enumerate(t["exp"]):
            f = 0.88 + ((m * 7 + k * 3) % 8) * 0.03
            rows.append((dt.date(2026, m, 3 + k * 2), "지출", cat, "예시 · 지우고 쓰세요" if m == 1 and k == 0 else "예시", int(round(base * f, -3)), METHODS[(m + k) % 5]))
    return rows


def build(path, i, pal, message):
    t, sub = TYPES[i % 5], i // 5
    mtype, msub, ctype = COMBOS[sub]
    wb, fm = new_book(path, f"{t['name']} 가계부", pal)
    cover(wb, fm, "시작하기", f"{t['name']} 가계부", message, pal["name"], [
        "‘설정’ 시트에서 기준 연도와 분류, 월 예산을 내 상황에 맞게 고쳐요.",
        "‘입력’ 시트에 날짜·구분·분류·금액을 한 줄씩 적어요. 분류는 목록에서 고를 수 있어요.",
        "‘월별요약’과 ‘예산비교’, ‘대시보드’는 자동으로 계산돼요. 수식을 지우지 마세요.",
        "처음 들어 있는 6개월치 예시 줄은 지우고(구분·분류 칸만 비우면 돼요) 내 내용으로 바꿔 쓰세요.",
        "다음 해에는 ‘설정’의 기준 연도만 바꾸면 새 가계부로 쓸 수 있어요.",
    ], ["분류 이름을 바꾸면 요약·차트의 이름도 같이 바뀌어요. 가구 유형: " + t["name"]])
    wi, wsum, wbud, wdash, ws_ = (wb.add_worksheet(n) for n in ["입력", "월별요약", "예산비교", "대시보드", "설정"])

    # ── 설정
    ws_.hide_gridlines(2); ws_.set_tab_color(pal["accent"])
    ws_.set_column("A:A", 3); ws_.set_column("B:B", 20); ws_.set_column("C:C", 16); ws_.set_column("D:D", 3)
    ws_.set_column("E:E", 18); ws_.set_column("F:F", 3); ws_.set_column("G:G", 14); ws_.set_column("H:H", 3); ws_.set_column("I:I", 22)
    ws_.merge_range("B1:G1", "설정 — 내 상황에 맞게 고쳐요", fm.title(16))
    ws_.write("B3", "기준 연도", fm.head()); ws_.write("C3", 2026, fm.inp(num_format='"올해"', align="center"))
    ws_.write("B4", "시작 잔액(원)", fm.head()); ws_.write("C4", 0, fm.inp(num_format="#,##0"))
    for c, h in (("B", "지출 분류"), ("C", "월 예산(원)"), ("E", "수입 분류"), ("G", "결제수단"), ("I", "전체 분류(자동)")):
        ws_.write(f"{c}6", h, fm.head())
    for k, (cat, bud) in enumerate(t["exp"]):
        ws_.write(6 + k, 1, cat, fm.inp()); ws_.write(6 + k, 2, bud, fm.inp(num_format="#,##0"))
        ws_.write_formula(6 + k, 8, f"=B{7 + k}", fm.cell())
    for k, name in enumerate(t["inc"]):
        ws_.write(6 + k, 4, name, fm.inp()); ws_.write_formula(16 + k, 8, f"=E{7 + k}", fm.cell())
    for k, name in enumerate(METHODS):
        ws_.write(6 + k, 6, name, fm.inp())
    ws_.write("B18", "월 예산 합계", fm.total()); ws_.write_formula("C18", "=SUM(C7:C16)", fm.total(num_format="#,##0"))
    wb.define_name("Year", "=" + rng("설정", "$C$3"))
    wb.define_name("ExpCats", "=" + rng("설정", "$B$7:$B$16"))
    wb.define_name("AllCats", "=" + rng("설정", "$I$7:$I$19"))
    wb.define_name("Methods", "=" + rng("설정", "$G$7:$G$12"))

    # ── 입력
    wi.set_tab_color(pal["main"])
    wi.set_column("A:A", 12); wi.set_column("B:B", 8); wi.set_column("C:C", 18); wi.set_column("D:D", 28); wi.set_column("E:E", 14); wi.set_column("F:F", 12); wi.set_column("G:G", 24)
    wi.merge_range("A1:G1", f"{t['name']} 가계부 — 입력", fm.title(16))
    wi.merge_range("A2:G2", "날짜·구분·분류·금액만 적으면 요약과 차트가 자동으로 만들어져요.", fm.note())
    for c, h in enumerate(["날짜", "구분", "분류", "내용", "금액(원)", "결제수단", "메모"]):
        wi.write(3, c, h, fm.head())
    samples = _samples(t)
    for r in range(4, IN_LAST):
        s = samples[r - 4] if r - 4 < len(samples) else None
        wi.write_datetime(r, 0, dt.datetime.combine(s[0], dt.time()), fm.date()) if s else wi.write_blank(r, 0, None, fm.date())
        for c, fmtx in ((1, fm.cell(align="center")), (2, fm.cell()), (3, fm.cell()), (4, fm.money()), (5, fm.cell(align="center")), (6, fm.cell())):
            wi.write(r, c, s[c] if s else "", fmtx) if s and c != 6 else wi.write_blank(r, c, None, fmtx)
        if s:
            wi.write(r, 6, "예시" if r != 4 else "예시 · 지우고 쓰세요", fm.cell())
    wi.data_validation(4, 0, IN_LAST - 1, 0, {"validate": "date", "criteria": "between", "minimum": dt.date(2000, 1, 1), "maximum": dt.date(2100, 12, 31), "error_title": "날짜 확인", "error_message": "날짜 형식(예: 2026-03-15)으로 입력해 주세요."})
    wi.data_validation(4, 1, IN_LAST - 1, 1, {"validate": "list", "source": ["수입", "지출"]})
    wi.data_validation(4, 2, IN_LAST - 1, 2, {"validate": "list", "source": "=AllCats", "error_type": "warning", "error_title": "분류 확인", "error_message": "목록에 없는 분류예요. ‘설정’ 시트에 분류를 먼저 추가하는 것이 좋아요."})
    wi.data_validation(4, 4, IN_LAST - 1, 4, {"validate": "decimal", "criteria": ">=", "value": 0, "error_title": "금액 확인", "error_message": "0 이상의 숫자만 입력해 주세요."})
    wi.data_validation(4, 5, IN_LAST - 1, 5, {"validate": "list", "source": "=Methods", "error_type": "warning"})
    wi.conditional_format(4, 0, IN_LAST - 1, 6, {"type": "formula", "criteria": '=$B5="수입"', "format": wb.add_format({"font_color": pal["dark"], "bg_color": pal["pale"]})})
    wi.freeze_panes(4, 0); wi.autofilter(3, 0, IN_LAST - 1, 6)
    wi.set_landscape(); wi.fit_to_pages(1, 0); wi.repeat_rows(3)

    # ── 월별요약
    wsum.set_tab_color(pal["main"]); wsum.hide_gridlines(2)
    wsum.set_column("A:A", 20); wsum.set_column("B:M", 10.5); wsum.set_column("N:N", 12); wsum.set_column("O:O", 14)
    wsum.merge_range("A1:O1", "월별 요약 (자동 계산)", fm.title(16))
    wsum.merge_range("A2:O2", "‘입력’ 시트의 지출을 분류·월별로 모아서 보여 줘요. 칸의 숫자가 진할수록 많이 쓴 달이에요.", fm.note())
    wsum.write("A4", "분류 \\ 월", fm.head())
    mh = fm.f(bold=True, font_color="#FFFFFF", bg_color=pal["main"], align="center", border=1, border_color=pal["dark"], num_format='0"월"')
    for m in range(12):
        wsum.write_number(3, 1 + m, m + 1, mh)
    wsum.write("N4", "합계", fm.head()); wsum.write("O4", "추이", fm.head())
    date_rng, amt, kind, cat = (rng("입력", f"$A$5:$A${IN_LAST}"), rng("입력", f"$E$5:$E${IN_LAST}"), rng("입력", f"$B$5:$B${IN_LAST}"), rng("입력", f"$C$5:$C${IN_LAST}"))
    cols = "BCDEFGHIJKLM"
    for k in range(10):
        r = 5 + k
        wsum.write_formula(f"A{r}", f"={q('설정')}!B{7 + k}", fm.cell())
        for c in cols:
            wsum.write_formula(f"{c}{r}", f'=SUMIFS({amt},{kind},"지출",{cat},$A{r},{date_rng},">="&DATE(Year,{c}$4,1),{date_rng},"<"&DATE(Year,{c}$4+1,1))', fm.money())
        wsum.write_formula(f"N{r}", f"=SUM(B{r}:M{r})", fm.money(bold=True))
        wsum.add_sparkline(f"O{r}", {"range": rng("월별요약", f"B{r}:M{r}"), "type": SPARK[sub], "series_color": pal["main"], "markers": SPARK[sub] == "line", "high_point": True})
    wsum.write("A15", "지출 합계", fm.total()); wsum.write("A16", "수입 합계", fm.total()); wsum.write("A17", "수지(수입−지출)", fm.total()); wsum.write("A18", "저축률", fm.total())
    for c in cols:
        wsum.write_formula(f"{c}15", f"=SUM({c}5:{c}14)", fm.total(num_format="#,##0"))
        wsum.write_formula(f"{c}16", f'=SUMIFS({amt},{kind},"수입",{date_rng},">="&DATE(Year,{c}$4,1),{date_rng},"<"&DATE(Year,{c}$4+1,1))', fm.total(num_format="#,##0"))
        wsum.write_formula(f"{c}17", f"={c}16-{c}15", fm.total(num_format="#,##0;[Red]-#,##0"))
        wsum.write_formula(f"{c}18", f'=IF({c}16=0,"",{c}17/{c}16)', fm.total(num_format="0%"))
    for rr in (15, 16, 17):
        wsum.write_formula(f"N{rr}", f"=SUM(B{rr}:M{rr})", fm.total(num_format="#,##0;[Red]-#,##0"))
    wsum.write_formula("N18", '=IF(N16=0,"",N17/N16)', fm.total(num_format="0%"))
    wsum.conditional_format("B5:M14", {"type": "2_color_scale", "min_color": "#FFFFFF", "max_color": pal["soft"]})
    wsum.freeze_panes(4, 1); wsum.set_landscape(); wsum.fit_to_pages(1, 1)

    # ── 예산비교
    wbud.set_tab_color(pal["main"]); wbud.hide_gridlines(2)
    wbud.set_column("A:A", 20); wbud.set_column("B:E", 14); wbud.set_column("F:F", 3)
    wbud.merge_range("A1:E1", "예산 대비 지출 (자동 계산)", fm.title(16))
    wbud.write("A3", "비교할 달(1~12)", fm.head()); wbud.write("B3", 6, fm.inp(num_format='0"월"', align="center"))
    wbud.data_validation("B3", {"validate": "integer", "criteria": "between", "minimum": 1, "maximum": 12, "error_title": "달 확인", "error_message": "1~12 사이의 숫자를 입력해 주세요."})
    for c, h in enumerate(["분류", "월 예산", "실제 지출", "남은 금액", "사용률"]):
        wbud.write(4, c, h, fm.head())
    for k in range(10):
        r = 6 + k
        wbud.write_formula(f"A{r}", f"={q('설정')}!B{7 + k}", fm.cell())
        wbud.write_formula(f"B{r}", f"={q('설정')}!C{7 + k}", fm.money())
        wbud.write_formula(f"C{r}", f"=INDEX({q('월별요약')}!$B{5 + k}:$M{5 + k},1,$B$3)", fm.money())
        wbud.write_formula(f"D{r}", f"=B{r}-C{r}", fm.money(num_format="#,##0;[Red]-#,##0"))
        wbud.write_formula(f"E{r}", f'=IF(B{r}=0,"",C{r}/B{r})', fm.cell(num_format="0%", align="center"))
    wbud.write("A16", "합계", fm.total())
    for c in "BCD":
        wbud.write_formula(f"{c}16", f"=SUM({c}6:{c}15)", fm.total(num_format="#,##0;[Red]-#,##0"))
    wbud.write_formula("E16", '=IF(B16=0,"",C16/B16)', fm.total(num_format="0%", align="center"))
    wbud.conditional_format("E6:E15", {"type": "cell", "criteria": ">", "value": 1, "format": wb.add_format({"bg_color": "#F8D7DA", "font_color": "#842029", "bold": True})})
    wbud.conditional_format("E6:E15", {"type": "cell", "criteria": "between", "minimum": 0.8, "maximum": 1, "format": wb.add_format({"bg_color": "#FFF3CD", "font_color": "#664D03"})})
    wbud.conditional_format("C6:C15", {"type": "data_bar", "bar_color": pal["soft"], "bar_solid": True})
    wbud.merge_range("A18:E19", "사용률이 100%를 넘으면 빨간색, 80~100%는 노란색으로 알려 줘요.", fm.note())
    ch = wb.add_chart({"type": "bar" if ctype == "bar" else "column"})
    for col, nm, color in (("B", "월 예산", pal["soft"]), ("C", "실제 지출", pal["main"])):
        ch.add_series({"name": nm, "categories": rng("예산비교", "$A$6:$A$15"), "values": rng("예산비교", f"${col}$6:${col}$15"), "fill": {"color": color}, "border": {"color": pal["dark"]}})
    style_chart(ch, fm, "예산과 실제 지출", 560, 320); wbud.insert_chart("G3", ch)
    wbud.set_landscape(); wbud.fit_to_pages(1, 1)

    # ── 대시보드
    wdash.set_tab_color(pal["accent"]); wdash.hide_gridlines(2)
    wdash.set_column("A:A", 2); wdash.set_column("B:G", 17)
    wdash.merge_range("B1:G1", f"{t['name']} 가계부 대시보드", fm.title(18))
    wdash.merge_range("B2:G2", (f"“{message}”" if message else ""), fm.sub())
    kp = [("올해 수입", f"={q('월별요약')}!N16", "#,##0"), ("올해 지출", f"={q('월별요약')}!N15", "#,##0"), ("수지", f"={q('월별요약')}!N17", "#,##0;[Red]-#,##0"),
          ("저축률", f"={q('월별요약')}!N18", "0%"), ("예상 잔액", f"={q('설정')}!C4+{q('월별요약')}!N17", "#,##0;[Red]-#,##0"),
          ("가장 큰 지출", f"=IF({q('월별요약')}!N15=0,\"-\",INDEX({q('월별요약')}!A5:A14,MATCH(MAX({q('월별요약')}!N5:N14),{q('월별요약')}!N5:N14,0)))", "@")]
    for c, (lab, fo, nf) in enumerate(kp):
        wdash.write(3, 1 + c, lab, fm.kpi_label()); wdash.write_formula(4, 1 + c, fo, fm.kpi_value(nf)); wdash.set_row(4, 34)
    c1 = wb.add_chart({"type": mtype, "subtype": msub} if msub else {"type": mtype})
    for nm, row, color in (("수입", 16, pal["accent"]), ("지출", 15, pal["main"])):
        sd = {"name": nm, "categories": rng("월별요약", "$B$4:$M$4"), "values": rng("월별요약", f"$B${row}:$M${row}")}
        if mtype == "line":
            sd.update({"line": {"color": color, "width": 2.25}, "marker": {"type": "circle", "size": 6, "fill": {"color": color}, "border": {"color": color}}})
        else:
            sd.update({"fill": {"color": color, "transparency": 25 if mtype == "area" else 0}, "border": {"color": color}})
        c1.add_series(sd)
    c1.set_x_axis({"num_format": '0"월"', "num_font": {"name": "맑은 고딕", "size": 9}}); c1.set_y_axis({"num_format": "#,##0", "major_gridlines": {"visible": True, "line": {"color": "#E5E5E5"}}})
    style_chart(c1, fm, "월별 수입과 지출", 540, 320); wdash.insert_chart("B8", c1)
    c2 = wb.add_chart({"type": ctype})
    sd = {"name": "분류별 지출", "categories": rng("월별요약", "$A$5:$A$14"), "values": rng("월별요약", "$N$5:$N$14")}
    if ctype in ("pie", "doughnut"):
        sd["points"] = [{"fill": {"color": col}} for col in slice_colors(pal, 10)]
        sd["data_labels"] = {"percentage": True, "font": {"name": "맑은 고딕", "size": 8}}
    else:
        sd["fill"] = {"color": pal["main"]}
    c2.add_series(sd)
    style_chart(c2, fm, "분류별 지출 비중", 480, 320, "right" if ctype in ("pie", "doughnut") else None); wdash.insert_chart("H8", c2)
    wdash.set_landscape(); wdash.fit_to_pages(1, 1)
    wb.get_worksheet_by_name("시작하기").activate()
    wb.close()
