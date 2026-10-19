"""용돈기입장 — 5가지 연령대 × 10가지 차트 구성 = 50종."""
import datetime as dt
from xlsx_kit import cover, new_book, q, rng, slice_colors, style_chart

AGES = [
    ("유치원·초등 저학년", ["간식", "장난감", "문구", "저금", "나눔·선물", "기타"], 5000, 3000),
    ("초등 고학년", ["간식", "학용품", "게임·취미", "책", "저금", "선물", "기타"], 20000, 12000),
    ("중학생", ["간식", "교통", "문구·준비물", "취미·게임", "책", "친구·선물", "저금", "기타"], 40000, 25000),
    ("고등학생", ["식사·간식", "교통", "문구·교재", "취미·여가", "친구·선물", "저금", "기타"], 70000, 45000),
    ("대학생·청년", ["식비", "교통", "교재·학습", "취미·여가", "모임·경조사", "통신·구독", "저금", "기타"], 300000, 200000),
]
CHARTS = [("pie", "column"), ("doughnut", "line"), ("bar", "area"), ("pie", "line"), ("doughnut", "column"),
          ("bar", "line"), ("pie", "area"), ("doughnut", "area"), ("bar", "column"), ("pie", "column")]
FIRST, LAST = 6, 305
GOAL_NAMES = ["갖고 싶은 장난감", "친구 생일 선물", "새 운동화", "여행 경비", "노트북·태블릿"]


def flavor(i):
    return AGES[i % 5][0]


def build(path, i, pal, message):
    age, cats, income, spend = AGES[i % 5]
    pchart, mchart = CHARTS[i // 5]
    wb, fm = new_book(path, f"{age} 용돈기입장", pal)
    cover(wb, fm, "시작하기", f"{age} 용돈기입장", message, pal["name"], [
        "‘기입장’ 맨 위 파란 칸에 기준 연도와 처음 가진 돈(시작 잔액)을 적어요.",
        "받은 용돈은 ‘들어온 돈’, 쓴 돈은 ‘나간 돈’에 적으면 ‘잔액’이 저절로 계산돼요.",
        "‘월요약’에서 달마다 얼마를 받고 썼는지, 무엇에 많이 썼는지 그림으로 볼 수 있어요.",
        "‘저금목표’에 갖고 싶은 것과 금액을 적으면 얼마나 모았는지 막대로 보여 줘요.",
    ], ["처음 들어 있는 줄은 예시예요. 지우고 내 용돈으로 바꿔 쓰세요."])
    wl, wm, wg = (wb.add_worksheet(n) for n in ["기입장", "월요약", "저금목표"])

    wl.set_tab_color(pal["main"])
    for col, w in zip("ABCDEF", [12, 28, 14, 14, 14, 14]):
        wl.set_column(f"{col}:{col}", w)
    wl.merge_range("A1:F1", f"{age} 용돈기입장", fm.title(18))
    wl.write("A2", "기준 연도", fm.head()); wl.write("B2", 2026, fm.inp(num_format="0", align="center"))
    wl.write("A3", "시작 잔액(원)", fm.head()); wl.write("B3", 0, fm.inp(num_format="#,##0"))
    wl.merge_range("C2:F3", (f"“{message}”" if message else ""), fm.f(italic=True, font_color=pal["main"], text_wrap=True, align="center"))
    wb.define_name("Year", "=" + rng("기입장", "$B$2")); wb.define_name("StartBal", "=" + rng("기입장", "$B$3"))
    wb.define_name("AllowCats", "=" + rng("월요약", "$H$5:$H$" + str(4 + len(cats))))
    for c, h in enumerate(["날짜", "내용", "분류", "들어온 돈", "나간 돈", "잔액"]):
        wl.write(4, c, h, fm.head())
    ex = []
    for m in range(1, 7):
        ex.append((dt.date(2026, m, 1), "이번 달 용돈", "", income, None))
        for k in range(3):
            ex.append((dt.date(2026, m, 5 + k * 7), "예시 지출", cats[(m + k) % len(cats)], None, int(round(spend * (0.25 + 0.1 * ((m + k) % 3)), -2 if spend < 100000 else -3))))
    for r in range(FIRST - 1, LAST):
        e = ex[r - (FIRST - 1)] if r - (FIRST - 1) < len(ex) else None
        rr = r + 1
        if e:
            wl.write_datetime(r, 0, dt.datetime.combine(e[0], dt.time()), fm.date())
        else:
            wl.write_blank(r, 0, None, fm.date())
        wl.write(r, 1, e[1], fm.cell()) if e else wl.write_blank(r, 1, None, fm.cell())
        wl.write(r, 2, e[2], fm.cell(align="center")) if e else wl.write_blank(r, 2, None, fm.cell(align="center"))
        wl.write(r, 3, e[3], fm.money()) if e and e[3] else wl.write_blank(r, 3, None, fm.money())
        wl.write(r, 4, e[4], fm.money()) if e and e[4] else wl.write_blank(r, 4, None, fm.money())
        wl.write_formula(r, 5, f'=IF(AND(D{rr}="",E{rr}=""),"",StartBal+SUM($D${FIRST}:D{rr})-SUM($E${FIRST}:E{rr}))', fm.money(bold=True))
    wl.data_validation(FIRST - 1, 0, LAST - 1, 0, {"validate": "date", "criteria": "between", "minimum": dt.date(2000, 1, 1), "maximum": dt.date(2100, 12, 31), "error_message": "날짜 형식(예: 2026-03-02)으로 입력해 주세요."})
    wl.data_validation(FIRST - 1, 2, LAST - 1, 2, {"validate": "list", "source": "=AllowCats", "error_type": "warning"})
    wl.data_validation(FIRST - 1, 3, LAST - 1, 4, {"validate": "decimal", "criteria": ">=", "value": 0, "error_message": "0 이상의 금액을 입력해 주세요."})
    wl.conditional_format(FIRST - 1, 5, LAST - 1, 5, {"type": "cell", "criteria": "<", "value": 0, "format": wb.add_format({"font_color": "#C00000", "bold": True})})
    wl.freeze_panes(5, 0); wl.set_portrait(); wl.fit_to_pages(1, 0); wl.repeat_rows(4)

    A, Cc, D, E = (rng("기입장", f"${c}${FIRST}:${c}${LAST}") for c in "ACDE")
    wm.hide_gridlines(2); wm.set_tab_color(pal["main"])
    wm.set_column("A:A", 3); wm.set_column("B:E", 14); wm.set_column("F:G", 3); wm.set_column("H:I", 14)
    wm.merge_range("B1:I1", "월 요약 (자동 계산)", fm.title(16))
    for c, h in enumerate(["월", "들어온 돈", "나간 돈", "남은 돈"]):
        wm.write(3, 1 + c, h, fm.head())
    for m in range(1, 13):
        r = 4 + m
        wm.write_number(f"B{r}", m, fm.cell(num_format='0"월"', align="center"))
        wm.write_formula(f"C{r}", f'=SUMIFS({D},{A},">="&DATE(Year,B{r},1),{A},"<"&DATE(Year,B{r}+1,1))', fm.money())
        wm.write_formula(f"D{r}", f'=SUMIFS({E},{A},">="&DATE(Year,B{r},1),{A},"<"&DATE(Year,B{r}+1,1))', fm.money())
        wm.write_formula(f"E{r}", f"=C{r}-D{r}", fm.money(num_format="#,##0;[Red]-#,##0"))
    wm.write("B17", "합계", fm.total())
    for c in "CDE":
        wm.write_formula(f"{c}17", f"=SUM({c}5:{c}16)", fm.total(num_format="#,##0;[Red]-#,##0"))
    wm.write("H4", "분류", fm.head()); wm.write("I4", "쓴 돈", fm.head())
    for k, name in enumerate(cats):
        wm.write(4 + k, 7, name, fm.inp())
        wm.write_formula(4 + k, 8, f'=SUMIFS({E},{Cc},H{5 + k})', fm.money())
    n = len(cats)
    wm.write(4 + n, 7, "합계", fm.total()); wm.write_formula(4 + n, 8, f"=SUM(I5:I{4 + n})", fm.total(num_format="#,##0"))
    c1 = wb.add_chart({"type": pchart})
    sd = {"name": "분류별 쓴 돈", "categories": rng("월요약", f"$H$5:$H${4 + n}"), "values": rng("월요약", f"$I$5:$I${4 + n}")}
    if pchart in ("pie", "doughnut"):
        sd["points"] = [{"fill": {"color": c}} for c in slice_colors(pal, n)]
        sd["data_labels"] = {"percentage": True, "font": {"name": "맑은 고딕", "size": 8}}
    else:
        sd["fill"] = {"color": pal["main"]}
    c1.add_series(sd)
    style_chart(c1, fm, "무엇에 썼을까요?", 460, 300, "right" if pchart in ("pie", "doughnut") else None); wm.insert_chart("B19", c1)
    c2 = wb.add_chart({"type": mchart})
    for col, nm, color in (("C", "들어온 돈", pal["accent"]), ("D", "나간 돈", pal["main"])):
        sd = {"name": nm, "categories": rng("월요약", "$B$5:$B$16"), "values": rng("월요약", f"${col}$5:${col}$16")}
        if mchart == "line":
            sd.update({"line": {"color": color, "width": 2.25}, "marker": {"type": "circle", "size": 6, "fill": {"color": color}, "border": {"color": color}}})
        else:
            sd.update({"fill": {"color": color, "transparency": 20 if mchart == "area" else 0}, "border": {"color": color}})
        c2.add_series(sd)
    c2.set_x_axis({"num_format": '0"월"'}); c2.set_y_axis({"num_format": "#,##0", "major_gridlines": {"visible": True, "line": {"color": "#E5E5E5"}}})
    style_chart(c2, fm, "달마다 받고 쓴 돈", 480, 300); wm.insert_chart("H19", c2)
    wm.set_landscape(); wm.fit_to_pages(1, 1)

    wg.hide_gridlines(2); wg.set_tab_color(pal["accent"])
    wg.set_column("A:A", 3); wg.set_column("B:B", 24); wg.set_column("C:C", 20)
    wg.merge_range("B1:C1", "저금 목표 — 얼마나 모았을까요?", fm.title(16))
    wg.write("B3", "갖고 싶은 것", fm.head()); wg.write("C3", GOAL_NAMES[i % 5], fm.inp(align="center"))
    wg.write("B4", "목표 금액(원)", fm.head()); wg.write("C4", int(round(income * 6, -3)), fm.inp(num_format="#,##0"))
    wg.data_validation("C4", {"validate": "decimal", "criteria": ">", "value": 0, "error_message": "0보다 큰 금액을 입력해 주세요."})
    res = [("지금 모은 돈(저금 포함)", f'=StartBal+SUM({D})-SUM({E})+SUMIFS({E},{Cc},"저금")', "#,##0"), ("모은 비율", "=IF(C4=0,0,C6/C4)", "0%"), ("더 모아야 할 돈", "=MAX(0,C4-C6)", "#,##0"),
           ("한 달 평균 남는 돈", f"=IFERROR(AVERAGEIF({q('월요약')}!$E$5:$E$16,\"<>0\"),0)", "#,##0"),
           ("달성까지 예상 기간", '=IF(C9<=0,"-",IF(C8=0,"달성!",ROUNDUP(C8/C9,0)&"개월"))', "@")]
    for k, (lab, fo, nf) in enumerate(res):
        wg.write(5 + k, 1, lab, fm.cell(bold=True, bg_color=pal["soft"]))
        wg.write_formula(5 + k, 2, fo, fm.cell(num_format=nf, align="center", bold=(k == 1)))
    wg.conditional_format("C7", {"type": "data_bar", "bar_color": pal["main"], "bar_solid": True, "min_type": "num", "min_value": 0, "max_type": "num", "max_value": 1})
    wg.merge_range("B12:C14", "막대가 가득 차면 목표를 이룬 거예요. 잘 모으고 있어요, 계속 해 봐요!", fm.note())
    wg.set_portrait(); wg.fit_to_pages(1, 1)
    wb.get_worksheet_by_name("시작하기").activate()
    wb.close()
