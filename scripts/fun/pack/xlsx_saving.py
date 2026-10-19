"""월 저축·적금 플래너 — 5가지 목표 × 10가지 기간·차트 구성 = 50종."""
import datetime as dt
from xlsx_kit import cover, new_book, q, rng, style_chart

GOALS = [("비상금 마련", 300000), ("여행 자금", 250000), ("내 집 마련", 700000), ("자녀 교육비", 400000), ("은퇴 후 생활 준비", 500000)]
MONTHS = [24, 36, 24, 48, 36, 60, 24, 48, 60, 36]
SCALE = [0.8, 1.0, 1.2, 0.9, 1.1, 1.3, 1.0, 0.85, 1.15, 1.4]
CHARTS = [("column", "stacked"), ("area", "stacked"), ("line", None), ("column", "stacked"), ("area", None),
          ("line", None), ("column", "stacked"), ("area", "stacked"), ("line", None), ("column", "stacked")]
MAXM = 60


def flavor(i):
    return GOALS[i % 5][0]


def build(path, i, pal, message):
    goal, base = GOALS[i % 5]
    sub = i // 5  # 0..9
    months = MONTHS[sub]
    monthly = int(round(base * SCALE[sub], -4))
    rate = round(0.032 + (sub % 4) * 0.004, 3)
    target = int(round(monthly * months * 1.03, -5))
    ctype, csub = CHARTS[sub]
    wb, fm = new_book(path, f"{goal} 저축 플래너", pal)
    cover(wb, fm, "시작하기", f"{goal} 저축 플래너", message, pal["name"], [
        "‘계획’ 시트에서 목표 금액, 시작일, 월 납입액, 연 이율, 기간(개월)을 적어요. 파란 칸이 입력 칸이에요.",
        "만기 수령액, 이자(세금 제외), 목표까지 부족한 금액, 목표를 이루려면 필요한 월 납입액이 자동으로 계산돼요.",
        "‘월별표’에는 달마다 쌓이는 원금과 이자가 나와요. 실제로 넣은 금액을 ‘실제 납입’ 칸에 적으면 계획과 비교해 줘요.",
        "이율·세금은 가입한 상품 안내문에 맞춰 고쳐 쓰세요. 단리/월복리는 상품 방식에 맞게 고르세요.",
    ], ["이 표는 스스로 계획을 세우는 계산 도구이며 특정 상품의 수익을 보장하거나 권유하지 않아요. 실제 이자와 세금은 상품과 세법에 따라 달라질 수 있어요."])
    wp, wm = wb.add_worksheet("계획"), wb.add_worksheet("월별표")

    wp.hide_gridlines(2); wp.set_tab_color(pal["main"])
    wp.set_column("A:A", 3); wp.set_column("B:B", 22); wp.set_column("C:C", 18); wp.set_column("D:D", 3); wp.set_column("E:E", 24); wp.set_column("F:F", 18)
    wp.merge_range("B1:F1", f"{goal} 저축 플래너", fm.title(18))
    wp.merge_range("B2:F2", f"“{message}”", fm.sub())
    wp.merge_range("B3:C3", "입력 칸", fm.head())
    rows = [("목표 이름", goal, fm.inp(align="center")), ("목표 금액(원)", target, fm.inp(num_format="#,##0")), ("시작일", dt.datetime(2026, 1, 1), fm.inp(num_format="yyyy-mm-dd", align="center")),
            ("월 납입액(원)", monthly, fm.inp(num_format="#,##0")), ("연 이율", rate, fm.inp(num_format="0.0%")), ("기간(개월, 최대 60)", months, fm.inp(num_format='0"개월"', align="center")),
            ("이자 계산", "단리", fm.inp(align="center")), ("이자 과세", 0.154, fm.inp(num_format="0.0%"))]
    for k, (lab, val, f) in enumerate(rows):
        wp.write(3 + k, 1, lab, fm.cell(bold=True, bg_color=pal["soft"]))
        wp.write_datetime(3 + k, 2, val, f) if isinstance(val, dt.datetime) else wp.write(3 + k, 2, val, f)
    for nm, cell in (("Goal", "$C$5"), ("StartDate", "$C$6"), ("Monthly", "$C$7"), ("Rate", "$C$8"), ("Months", "$C$9"), ("Mode", "$C$10"), ("Tax", "$C$11")):
        wb.define_name(nm, "=" + rng("계획", cell))
    wp.data_validation("C5", {"validate": "decimal", "criteria": ">", "value": 0, "error_message": "0보다 큰 금액을 입력해 주세요."})
    wp.data_validation("C6", {"validate": "date", "criteria": ">=", "value": dt.date(2000, 1, 1), "error_message": "날짜 형식으로 입력해 주세요."})
    wp.data_validation("C7", {"validate": "decimal", "criteria": ">=", "value": 0, "error_message": "0 이상의 금액을 입력해 주세요."})
    wp.data_validation("C8", {"validate": "decimal", "criteria": "between", "minimum": 0, "maximum": 0.3, "error_message": "연 이율은 0%~30% 사이로 입력해 주세요. (예: 3.5%)"})
    wp.data_validation("C9", {"validate": "integer", "criteria": "between", "minimum": 1, "maximum": MAXM, "error_message": "기간은 1~60개월 사이로 입력해 주세요."})
    wp.data_validation("C10", {"validate": "list", "source": ["단리", "월복리"]})
    wp.data_validation("C11", {"validate": "decimal", "criteria": "between", "minimum": 0, "maximum": 0.5, "error_message": "비과세면 0%, 일반과세는 15.4%예요."})
    wp.merge_range("E3:F3", "자동 계산 결과", fm.head())
    interest = 'IF(Mode="단리",Monthly*(Rate/12)*Months*(Months+1)/2,FV(Rate/12,Months,-Monthly,0,1)-Monthly*Months)'
    res = [("납입 원금 합계", "=Monthly*Months", "#,##0"), ("세전 이자", "=" + interest, "#,##0"), ("세금", "=F5*Tax", "#,##0"),
           ("세후 이자", "=F5-F6", "#,##0"), ("만기 수령액", "=F4+F7", "#,##0"), ("만기일", "=EDATE(StartDate,Months)", "yyyy-mm-dd"),
           ("목표 달성률", "=IF(Goal=0,0,F8/Goal)", "0.0%"), ("목표까지 부족한 금액", "=MAX(0,Goal-F8)", "#,##0"),
           ("목표 달성에 필요한 월 납입액", '=IF(Mode="단리",Goal/(Months+(Rate/12)*(1-Tax)*Months*(Months+1)/2),IF(Rate=0,Goal/Months,Goal/(Months+(FV(Rate/12,Months,-1,0,1)-Months)*(1-Tax))))', "#,##0"),
           ("지금까지 실제 납입", f"=SUM({q('월별표')}!$G$5:$G${4 + MAXM})", "#,##0")]
    for k, (lab, fo, nf) in enumerate(res):
        wp.write(3 + k, 4, lab, fm.cell(bold=True, bg_color=pal["soft"]))
        wp.write_formula(3 + k, 5, fo, fm.cell(num_format=nf, align="right", bold=(lab in ("만기 수령액", "목표 달성률"))))
    wp.conditional_format("F10", {"type": "data_bar", "bar_color": pal["main"], "bar_solid": True, "min_type": "num", "min_value": 0, "max_type": "num", "max_value": 1})
    wp.merge_range("B13:F15", "달성률 칸의 막대가 가득 차면 목표 금액을 이룬 거예요. 필요한 월 납입액이 지금 납입액보다 크면 기간을 늘리거나 목표를 조정해 보세요.", fm.note())

    wm.set_tab_color(pal["accent"]); wm.hide_gridlines(2)
    for col, w in zip("ABCDEFGHIJ", [7, 12, 14, 14, 14, 15, 14, 14, 14, 11]):
        wm.set_column(f"{col}:{col}", w)
    wm.merge_range("A1:J1", "월별표 (자동 계산) — ‘실제 납입’만 직접 적어요", fm.title(16))
    wm.merge_range("A2:J2", "계획 기간이 끝난 뒤의 칸은 비어 있고, 차트에서는 만기 금액이 그대로 이어져요.", fm.note())
    for c, h in enumerate(["회차", "납입월", "계획 납입", "누적 원금", "누적 이자(세전)", "계획 잔액", "실제 납입", "실제 누적", "계획 대비", "달성률"]):
        wm.write(3, c, h, fm.head())
    for k in range(1, MAXM + 1):
        r = 4 + k
        eff = f"MIN(A{r},Months)"
        wm.write_number(r - 1, 0, k, fm.cell(align="center", font_color="#888888"))
        wm.write_formula(r - 1, 1, f'=IF(A{r}>Months,"",EDATE(StartDate,A{r}-1))', fm.date())
        wm.write_formula(r - 1, 2, f'=IF(A{r}>Months,"",Monthly)', fm.money())
        wm.write_formula(r - 1, 3, f"=Monthly*{eff}", fm.money())
        wm.write_formula(r - 1, 4, f'=IF(Mode="단리",Monthly*(Rate/12)*{eff}*({eff}+1)/2,FV(Rate/12,{eff},-Monthly,0,1)-Monthly*{eff})', fm.money())
        wm.write_formula(r - 1, 5, f"=D{r}+E{r}", fm.money(bold=True))
        wm.write_blank(r - 1, 6, None, fm.inp(num_format="#,##0"))
        wm.write_formula(r - 1, 7, f'=IF(G{r}="","",SUM(G$5:G{r}))', fm.money())
        wm.write_formula(r - 1, 8, f'=IF(H{r}="","",H{r}-D{r})', fm.money(num_format="+#,##0;[Red]-#,##0;0"))
        wm.write_formula(r - 1, 9, f'=IF(Goal=0,"",F{r}/Goal)', fm.cell(num_format="0%", align="center"))
    wm.data_validation(4, 6, 3 + MAXM, 6, {"validate": "decimal", "criteria": ">=", "value": 0, "error_message": "0 이상의 금액을 입력해 주세요."})
    wm.conditional_format(4, 9, 3 + MAXM, 9, {"type": "data_bar", "bar_color": pal["soft"], "bar_solid": True, "min_type": "num", "min_value": 0, "max_type": "num", "max_value": 1})
    wm.conditional_format(4, 0, 3 + MAXM, 9, {"type": "formula", "criteria": "=$A5>Months", "format": wb.add_format({"font_color": "#BBBBBB"})})
    wm.freeze_panes(4, 2); wm.set_landscape(); wm.fit_to_pages(1, 0); wm.repeat_rows(3)

    cd = {"type": ctype, "subtype": csub} if csub else {"type": ctype}
    ch = wb.add_chart(cd)
    cats = rng("월별표", f"$A$5:$A${4 + MAXM}")
    if ctype == "line":
        series = [("계획 잔액", "F", pal["main"]), ("누적 원금", "D", pal["accent"])]
    else:
        series = [("누적 원금", "D", pal["soft"]), ("누적 이자(세전)", "E", pal["main"])]
    for nm, col, color in series:
        sd = {"name": nm, "categories": cats, "values": rng("월별표", f"${col}$5:${col}${4 + MAXM}")}
        if ctype == "line":
            sd["line"] = {"color": color, "width": 2.5}
        else:
            sd.update({"fill": {"color": color, "transparency": 10}, "border": {"color": pal["dark"], "width": 0.5}})
        ch.add_series(sd)
    ch.set_x_axis({"name": "회차(개월)", "name_font": {"name": "맑은 고딕", "size": 9}, "interval_unit": 6})
    ch.set_y_axis({"num_format": "#,##0", "major_gridlines": {"visible": True, "line": {"color": "#E5E5E5"}}})
    style_chart(ch, fm, "원금과 이자가 쌓이는 모습", 640, 340)
    wp.insert_chart("B17", ch)
    wp.set_landscape(); wp.fit_to_pages(1, 1)
    wb.get_worksheet_by_name("시작하기").activate()
    wb.close()
