"""경조사비 장부 — 5가지 중심 경조사 × 10가지 차트 구성 = 50종."""
import datetime as dt
from xlsx_kit import cover, new_book, q, rng, slice_colors, style_chart

KINDS = ["결혼", "돌잔치", "장례", "칠순·팔순", "집들이·개업", "병문안", "졸업·입학", "명절·선물", "기타"]
RELS = ["가족", "친척", "친구", "직장", "이웃", "거래처", "지인", "기타"]
FOCUS = [("결혼식 중심", 0), ("돌잔치 중심", 1), ("장례 중심", 2), ("칠순·팔순 중심", 3), ("집들이·개업 중심", 4)]
PAIRS = [("column", "pie"), ("bar", "doughnut"), ("column", "bar"), ("bar", "pie"), ("column", "doughnut"),
         ("bar", "bar"), ("column", "column"), ("bar", "column"), ("column", "pie"), ("bar", "doughnut")]
NAMES = ["김○○", "이○○", "박○○", "최○○", "정○○", "강○○", "조○○", "윤○○", "장○○", "임○○", "한○○", "오○○"]
FIRST, LAST = 5, 504


def flavor(i):
    return FOCUS[i % 5][0]


def build(path, i, pal, message):
    focus_name, fk = FOCUS[i % 5]
    kinds = KINDS[fk:] + KINDS[:fk]  # 중심 항목이 목록 맨 앞에 오도록
    kchart, rchart = PAIRS[i // 5]
    wb, fm = new_book(path, f"경조사비 장부({focus_name})", pal)
    cover(wb, fm, "시작하기", f"경조사비 장부 · {focus_name}", message, pal["name"], [
        "‘장부’에 날짜, 받음/드림, 경조 종류, 이름, 관계, 금액을 적어요. 종류와 관계는 목록에서 고를 수 있어요.",
        "‘답례’ 칸에는 인사를 해야 할 분은 ‘필요’, 마친 분은 ‘완료’로 바꿔 두면 잊지 않아요.",
        "‘정산’에서 종류별·관계별로 받은 금액과 드린 금액이 자동으로 모여요.",
        "‘이름조회’에서 이름을 고르면 그분과 오간 금액과 마지막 일자를 바로 볼 수 있어요.",
    ], ["처음 들어 있는 줄은 예시예요(이름은 ○○로 가렸어요). 지우고 내 장부로 쓰세요.", "개인 정보가 들어 있으니 파일은 내 컴퓨터에만 보관하세요."])
    wl, wr, wn, ws_ = (wb.add_worksheet(n) for n in ["장부", "정산", "이름조회", "설정"])

    ws_.hide_gridlines(2); ws_.set_tab_color(pal["accent"])
    ws_.set_column("A:A", 3); ws_.set_column("B:D", 16)
    ws_.merge_range("B1:D1", "설정 — 목록을 고쳐 쓸 수 있어요", fm.title(14))
    for c, h in enumerate(["경조 종류", "관계", "답례"]):
        ws_.write(2, 1 + c, h, fm.head())
    for k, v in enumerate(kinds):
        ws_.write(3 + k, 1, v, fm.inp())
    for k, v in enumerate(RELS):
        ws_.write(3 + k, 2, v, fm.inp())
    for k, v in enumerate(["필요", "완료", "해당 없음"]):
        ws_.write(3 + k, 3, v, fm.cell())
    wb.define_name("GiftKinds", "=" + rng("설정", "$B$4:$B$12"))
    wb.define_name("GiftRels", "=" + rng("설정", "$C$4:$C$11"))

    wl.set_tab_color(pal["main"])
    for col, w in zip("ABCDEFGH", [12, 9, 14, 14, 10, 14, 11, 26]):
        wl.set_column(f"{col}:{col}", w)
    wl.merge_range("A1:H1", f"경조사비 장부 · {focus_name}", fm.title(18))
    wl.merge_range("A2:H2", (f"“{message}”" if message else ""), fm.sub())
    for c, h in enumerate(["날짜", "구분", "경조 종류", "이름", "관계", "금액(원)", "답례", "메모"]):
        wl.write(3, c, h, fm.head())
    ex = []
    for k in range(12):
        ex.append((dt.date(2026, 1 + k // 2, 5 + k * 2), "받음" if k % 3 else "드림", kinds[k % 4], NAMES[k], RELS[k % 5], [50000, 100000, 30000, 70000][k % 4], ["필요", "완료", "해당 없음"][k % 3], "예시"))
    for r in range(FIRST - 1, LAST):
        e = ex[r - (FIRST - 1)] if r - (FIRST - 1) < len(ex) else None
        if e:
            wl.write_datetime(r, 0, dt.datetime.combine(e[0], dt.time()), fm.date())
        else:
            wl.write_blank(r, 0, None, fm.date())
        for c in range(1, 8):
            f = fm.money() if c == 5 else fm.cell(align="center" if c in (1, 4, 6) else "left")
            wl.write(r, c, e[c] if e else "", f) if e else wl.write_blank(r, c, None, f)
    wl.data_validation(FIRST - 1, 0, LAST - 1, 0, {"validate": "date", "criteria": "between", "minimum": dt.date(2000, 1, 1), "maximum": dt.date(2100, 12, 31), "error_message": "날짜 형식(예: 2026-05-10)으로 입력해 주세요."})
    wl.data_validation(FIRST - 1, 1, LAST - 1, 1, {"validate": "list", "source": ["받음", "드림"]})
    wl.data_validation(FIRST - 1, 2, LAST - 1, 2, {"validate": "list", "source": "=GiftKinds", "error_type": "warning"})
    wl.data_validation(FIRST - 1, 4, LAST - 1, 4, {"validate": "list", "source": "=GiftRels", "error_type": "warning"})
    wl.data_validation(FIRST - 1, 5, LAST - 1, 5, {"validate": "decimal", "criteria": ">=", "value": 0, "error_message": "0 이상의 금액을 입력해 주세요."})
    wl.data_validation(FIRST - 1, 6, LAST - 1, 6, {"validate": "list", "source": ["필요", "완료", "해당 없음"]})
    wl.conditional_format(FIRST - 1, 0, LAST - 1, 7, {"type": "formula", "criteria": f'=$B{FIRST}="받음"', "format": wb.add_format({"bg_color": fm.p["pale"]})})
    wl.conditional_format(FIRST - 1, 6, LAST - 1, 6, {"type": "cell", "criteria": "==", "value": '"필요"', "format": wb.add_format({"bg_color": "#FFF3CD", "font_color": "#664D03", "bold": True})})
    wl.freeze_panes(4, 0); wl.autofilter(3, 0, LAST - 1, 7); wl.set_landscape(); wl.fit_to_pages(1, 0); wl.repeat_rows(3)

    A, B, C, D, E, F, G = (rng("장부", f"${c}${FIRST}:${c}${LAST}") for c in "ABCDEFG")
    wr.hide_gridlines(2); wr.set_tab_color(pal["main"])
    wr.set_column("A:A", 3); wr.set_column("B:B", 16); wr.set_column("C:F", 13); wr.set_column("G:G", 3); wr.set_column("H:H", 12); wr.set_column("I:K", 13)
    wr.merge_range("B1:K1", "정산 (자동 계산)", fm.title(16))
    for c, h in enumerate(["경조 종류", "받은 금액", "드린 금액", "차이(받음−드림)", "건수"]):
        wr.write(2, 1 + c, h, fm.head())
    for k in range(9):
        r = 4 + k
        wr.write_formula(f"B{r}", f"={q('설정')}!B{4 + k}", fm.cell())
        wr.write_formula(f"C{r}", f'=SUMIFS({F},{C},B{r},{B},"받음")', fm.money())
        wr.write_formula(f"D{r}", f'=SUMIFS({F},{C},B{r},{B},"드림")', fm.money())
        wr.write_formula(f"E{r}", f"=C{r}-D{r}", fm.money(num_format="#,##0;[Red]-#,##0"))
        wr.write_formula(f"F{r}", f"=COUNTIFS({C},B{r},{F},\">0\")", fm.cell(align="center"))
    wr.write("B13", "합계", fm.total())
    for c in "CDE":
        wr.write_formula(f"{c}13", f"=SUM({c}4:{c}12)", fm.total(num_format="#,##0;[Red]-#,##0"))
    wr.write_formula("F13", "=SUM(F4:F12)", fm.total(align="center"))
    for c, h in enumerate(["관계", "받은 금액", "드린 금액", "건수"]):
        wr.write(2, 7 + c, h, fm.head())
    for k in range(8):
        r = 4 + k
        wr.write_formula(f"H{r}", f"={q('설정')}!C{4 + k}", fm.cell())
        wr.write_formula(f"I{r}", f'=SUMIFS({F},{E},H{r},{B},"받음")', fm.money())
        wr.write_formula(f"J{r}", f'=SUMIFS({F},{E},H{r},{B},"드림")', fm.money())
        wr.write_formula(f"K{r}", f'=COUNTIFS({E},H{r},{F},">0")', fm.cell(align="center"))
    wr.write("H12", "합계", fm.total())
    for c in "IJ":
        wr.write_formula(f"{c}12", f"=SUM({c}4:{c}11)", fm.total(num_format="#,##0"))
    wr.write_formula("K12", "=SUM(K4:K11)", fm.total(align="center"))
    wr.write("B15", "답례 필요한 건수", fm.cell(bold=True, bg_color=pal["soft"])); wr.write_formula("C15", f'=COUNTIF({G},"필요")', fm.cell(align="center", bold=True))
    c1 = wb.add_chart({"type": kchart})
    for col, nm, color in (("C", "받은 금액", pal["main"]), ("D", "드린 금액", pal["accent"])):
        c1.add_series({"name": nm, "categories": rng("정산", "$B$4:$B$12"), "values": rng("정산", f"${col}$4:${col}$12"), "fill": {"color": color}, "border": {"color": pal["dark"], "width": 0.5}})
    c1.set_y_axis({"num_format": "#,##0", "major_gridlines": {"visible": True, "line": {"color": "#E5E5E5"}}}) if kchart == "column" else c1.set_x_axis({"num_format": "#,##0"})
    style_chart(c1, fm, "경조 종류별 오간 금액", 540, 320); wr.insert_chart("B17", c1)
    c2 = wb.add_chart({"type": rchart})
    sd = {"name": "관계별 받은 금액", "categories": rng("정산", "$H$4:$H$11"), "values": rng("정산", "$I$4:$I$11")}
    if rchart in ("pie", "doughnut"):
        sd["points"] = [{"fill": {"color": c}} for c in slice_colors(pal, 8)]
        sd["data_labels"] = {"percentage": True, "font": {"name": "맑은 고딕", "size": 8}}
    else:
        sd["fill"] = {"color": pal["main"]}
    c2.add_series(sd)
    style_chart(c2, fm, "관계별 받은 금액", 460, 320, "right" if rchart in ("pie", "doughnut") else None); wr.insert_chart("H17", c2)
    wr.set_landscape(); wr.fit_to_pages(1, 1)

    wn.hide_gridlines(2); wn.set_tab_color(pal["main"])
    wn.set_column("A:A", 3); wn.set_column("B:B", 20); wn.set_column("C:C", 22)
    wn.merge_range("B1:C1", "이름으로 찾아보기", fm.title(16))
    wn.write("B3", "이름 고르기", fm.head()); wn.write("C3", NAMES[0], fm.inp(align="center"))
    wn.data_validation("C3", {"validate": "list", "source": "=" + D, "error_type": "warning", "error_message": "장부에 없는 이름이에요."})
    rows = [("받은 금액 합계", f'=SUMIFS({F},{D},$C$3,{B},"받음")', "#,##0"), ("드린 금액 합계", f'=SUMIFS({F},{D},$C$3,{B},"드림")', "#,##0"),
            ("차이(받음−드림)", "=C5-C6", "#,##0;[Red]-#,##0"), ("오간 횟수", f'=COUNTIFS({D},$C$3,{F},">0")', "0"),
            ("마지막으로 오간 날", f"=IF(C8=0,\"\",SUMPRODUCT(MAX(({D}=$C$3)*{A})))", "yyyy-mm-dd"), ("답례가 필요한 건", f'=COUNTIFS({D},$C$3,{G},"필요")', "0")]
    for k, (lab, fo, nf) in enumerate(rows):
        wn.write(4 + k - 0, 1, lab, fm.cell(bold=True, bg_color=pal["soft"]))
        wn.write_formula(4 + k - 0, 2, fo, fm.cell(num_format=nf, align="center"))
    wn.merge_range("B12:C13", "이름을 바꿔 고르면 아래 숫자가 바로 바뀌어요.", fm.note())
    wn.set_landscape(); wn.fit_to_pages(1, 1)
    wb.get_worksheet_by_name("시작하기").activate()
    wb.close()
