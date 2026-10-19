"""자동 계산 견적서 — 5가지 업종 × 10가지 단가표 구성 = 50종."""
from xlsx_kit import cover, new_book, rng

TRADES = [
    ("인테리어·시공", "공사"), ("디자인·제작", "제작"), ("행사·케이터링", "행사"), ("교육·강의", "교육"), ("일반 상품 공급", "상품"),
]
ITEMS = {
    0: [("도배(실크)", "㎡당", "㎡", 12000), ("장판 시공", "㎡당", "㎡", 25000), ("조명 교체", "LED 1구", "개", 45000), ("타일 시공", "㎡당", "㎡", 60000), ("페인트(벽면)", "㎡당", "㎡", 9000), ("철거·폐기물", "일식", "식", 300000), ("현장 관리비", "일당", "일", 150000), ("마감 청소", "일식", "식", 200000)],
    1: [("로고 디자인", "시안 3종", "건", 500000), ("명함 디자인·인쇄", "200매", "식", 60000), ("현수막 제작", "㎡당", "㎡", 15000), ("브로슈어 디자인", "8p", "건", 700000), ("상세페이지 제작", "1페이지", "건", 400000), ("사진 촬영", "반일", "회", 350000), ("영상 편집", "분당", "분", 80000), ("수정 작업", "시간당", "시간", 40000)],
    2: [("도시락 세트", "1인분", "개", 12000), ("다과·음료", "1인분", "개", 6000), ("테이블·의자 대여", "1세트", "세트", 15000), ("사회자 진행", "2시간", "명", 400000), ("꽃 장식", "테이블당", "개", 30000), ("음향·조명", "일식", "식", 500000), ("현수막·포토존", "일식", "식", 250000), ("스태프 인건비", "인당", "명", 120000)],
    3: [("직무 교육(특강)", "2시간", "회", 400000), ("워크숍 진행", "반일", "회", 800000), ("교재 제작", "권당", "권", 8000), ("강사료(정규)", "시간당", "시간", 100000), ("온라인 강의 제작", "분당", "분", 30000), ("수료증 발급", "인당", "명", 1000), ("교육장 대관", "시간당", "시간", 50000), ("다과·간식", "인당", "명", 4000)],
    4: [("A형 상품", "1개", "개", 15000), ("B형 상품", "1개", "개", 22000), ("C형 상품", "1박스", "박스", 90000), ("선물 포장", "1건", "건", 3000), ("배송비(택배)", "건당", "건", 3500), ("설치·조립", "1건", "건", 30000), ("부자재", "1세트", "세트", 8000), ("A/S 보증 연장", "1년", "식", 20000)],
}
NOTES = [
    "• 견적 유효기간 내 계약 시 위 금액이 적용됩니다.\n• 결제: 계약금 30% / 중도금 40% / 잔금 30%(공사 완료 후)",
    "• 시안 수정은 3회까지 포함이며 추가 수정은 별도 협의합니다.\n• 결제: 계약금 50% / 납품 후 잔금 50%",
    "• 인원·장소 변경 시 금액이 조정될 수 있습니다.\n• 결제: 행사 7일 전 50% / 행사 후 잔금",
    "• 수강 인원과 일정에 따라 금액이 달라질 수 있습니다.\n• 결제: 교육 종료 후 7일 이내 계산서 발행·입금",
    "• 재고 및 납기는 주문 시 확정됩니다.\n• 결제: 주문 시 선결제 또는 납품 후 7일 이내",
]
FIRST_ITEM, N_ITEMS = 13, 15
CNT = 8


def flavor(i):
    return TRADES[i % 5][0]


def build(path, i, pal, message):
    trade, noun = TRADES[i % 5]
    sub = i // 5
    items = ITEMS[i % 5]
    # 10가지 단가표 구성: 단가를 구성별 배율로 조정하고 품목 순서를 바꿔 서로 다르게 만든다.
    mult = [1.0, 1.05, 0.95, 1.1, 0.9, 1.15, 0.85, 1.2, 1.0, 0.92][sub]
    items = items[sub % len(items):] + items[:sub % len(items)]
    wb, fm = new_book(path, f"{trade} 견적서", pal)
    wq, wp = wb.add_worksheet("견적서"), wb.add_worksheet("단가표")
    cover(wb, fm, "사용법", f"{trade} 견적서", message, pal["name"], [
        "‘단가표’에 자주 쓰는 품목·규격·단위·단가를 적어 둬요(최대 30개).",
        "‘견적서’의 품목 칸을 누르면 목록이 나오고, 고르면 규격·단위·단가가 자동으로 들어와요. 수량만 적으세요.",
        "목록에 없는 품목은 직접 써도 돼요. 단가 칸도 직접 고칠 수 있어요.",
        "부가세는 ‘별도 / 포함 / 면세’ 중에서 고르면 합계가 자동으로 바뀌어요. 인쇄는 A4 한 장에 맞춰져 있어요.",
    ], ["표시된 금액·문구는 모두 예시예요. 내 사업에 맞게 고쳐 쓰세요.", "사업자등록번호·연락처는 ‘견적서’에 직접 입력하세요."])

    # 단가표
    wp.hide_gridlines(2); wp.set_tab_color(pal["accent"])
    wp.set_column("A:A", 3); wp.set_column("B:B", 24); wp.set_column("C:C", 18); wp.set_column("D:D", 8); wp.set_column("E:E", 14)
    wp.merge_range("B1:E1", "단가표 — 자주 쓰는 품목을 적어 두세요", fm.title(14))
    for c, h in enumerate(["품목", "규격·설명", "단위", "단가(원)"]):
        wp.write(2, 1 + c, h, fm.head())
    for k in range(30):
        it = items[k] if k < len(items) else None
        wp.write(3 + k, 1, it[0] if it else "", fm.inp()); wp.write(3 + k, 2, it[1] if it else "", fm.inp())
        wp.write(3 + k, 3, it[2] if it else "", fm.inp(align="center"))
        wp.write(3 + k, 4, int(round(it[3] * mult, -2)) if it else "", fm.inp(num_format="#,##0"))
    wb.define_name("ItemNames", "=" + rng("단가표", "$B$4:$B$33"))
    PN, PS, PU, PP = (rng("단가표", f"${c}$4:${c}$33") for c in "BCDE")

    # 견적서
    wq.hide_gridlines(2); wq.set_tab_color(pal["main"])
    for col, w in zip("ABCDEFGH", [2, 6, 26, 20, 8, 7, 13, 15]):
        wq.set_column(f"{col}:{col}", w)
    wq.set_row(0, 14)
    wq.merge_range("B2:H2", "견   적   서", fm.f(bold=True, font_size=24, font_color=pal["dark"], align="center", bottom=2, bottom_color=pal["main"]))
    wq.set_row(1, 40)
    wq.merge_range("B3:H3", (f"“{message}”" if message else ""), fm.f(italic=True, font_size=10, font_color=pal["main"], align="center"))
    lab = lambda: fm.f(bold=True, font_color="#FFFFFF", bg_color=pal["main"], align="center", border=1, border_color=pal["dark"])
    L = [("수신", "상호"), ("참조", "대표자"), ("견적일", "사업자번호"), ("유효기간", "연락처"), ("건명", "주소")]
    import datetime as dt
    for k, (a, b) in enumerate(L):
        r = 4 + k
        wq.write(r - 1, 1, a, lab()); wq.write(r - 1, 4, b, lab())
        wq.merge_range(r - 1, 5, r - 1, 7, "", fm.inp())
    wq.merge_range("C4:D4", "", fm.inp()); wq.merge_range("C5:D5", "", fm.inp())
    wq.write_formula("C6", "=TODAY()", fm.inp(num_format="yyyy-mm-dd", align="center")); wq.write("D6", "", fm.inp())
    wq.write("C7", 30, fm.inp(num_format='0"일"', align="center")); wq.write_formula("D7", '=IF(C6="","",C6+C7)', fm.cell(num_format='yyyy-mm-dd"까지"', align="center"))
    wq.merge_range("C8:D8", f"{trade} 견적", fm.inp())
    wq.data_validation("C7", {"validate": "integer", "criteria": "between", "minimum": 1, "maximum": 365, "error_message": "유효기간은 1~365일 사이로 입력해 주세요."})
    wq.merge_range("B10:C10", "견적 합계금액", fm.f(bold=True, font_size=13, font_color="#FFFFFF", bg_color=pal["dark"], align="center"))
    wq.merge_range("D10:H10", "", fm.f(bold=True, font_size=16, font_color=pal["dark"], bg_color=pal["soft"], align="center", num_format='"₩ "#,##0'))
    wq.set_row(9, 32)
    for c, h in enumerate(["No", "품목", "규격·설명", "수량", "단위", "단가(원)", "공급가액(원)"]):
        wq.write(11, 1 + c, h, fm.head())
    for k in range(N_ITEMS):
        r = FIRST_ITEM + k
        wq.write_number(r - 1, 1, k + 1, fm.cell(align="center", font_color="#888888"))
        wq.write(r - 1, 2, "", fm.inp())
        wq.write_formula(r - 1, 3, f'=IFERROR(INDEX({PS},MATCH(C{r},{PN},0)),"")', fm.cell())
        wq.write_blank(r - 1, 4, None, fm.inp(num_format="#,##0", align="center"))
        wq.write_formula(r - 1, 5, f'=IFERROR(INDEX({PU},MATCH(C{r},{PN},0)),"")', fm.cell(align="center"))
        wq.write_formula(r - 1, 6, f'=IFERROR(INDEX({PP},MATCH(C{r},{PN},0)),"")', fm.inp(num_format="#,##0"))
        wq.write_formula(r - 1, 7, f'=IF(OR(E{r}="",G{r}=""),"",E{r}*G{r})', fm.money())
    # 예시 입력(처음 4줄)
    for k in range(4):
        r = FIRST_ITEM + k
        wq.write(r - 1, 2, items[k][0], fm.inp())
        wq.write_number(r - 1, 4, (k + 1) * 2, fm.inp(num_format="#,##0", align="center"))
    wq.data_validation(FIRST_ITEM - 1, 2, FIRST_ITEM + N_ITEMS - 2, 2, {"validate": "list", "source": "=ItemNames", "error_type": "information", "error_title": "목록에 없는 품목", "error_message": "목록에 없어도 직접 써도 돼요."})
    wq.data_validation(FIRST_ITEM - 1, 4, FIRST_ITEM + N_ITEMS - 2, 4, {"validate": "decimal", "criteria": ">=", "value": 0, "error_message": "0 이상의 숫자를 입력해 주세요."})
    last = FIRST_ITEM + N_ITEMS - 1
    r0 = last + 1
    wq.merge_range(r0 - 1, 1, r0 - 1, 6, "소 계", fm.total(align="center")); wq.write_formula(r0 - 1, 7, f"=SUM(H{FIRST_ITEM}:H{last})", fm.total(num_format="#,##0"))
    wq.merge_range(r0, 1, r0, 6, "할 인(금액 입력)", fm.cell(align="center")); wq.write(r0, 7, 0, fm.inp(num_format="#,##0"))
    wq.merge_range(r0 + 1, 1, r0 + 1, 6, "공 급 가 액", fm.cell(align="center", bold=True)); wq.write_formula(r0 + 1, 7, f"=H{r0}-H{r0 + 1}", fm.money(bold=True))
    wq.merge_range(r0 + 2, 1, r0 + 2, 4, "부 가 세", fm.cell(align="center")); wq.write(r0 + 2, 5, "별도", fm.inp(align="center"))
    wq.write(r0 + 2, 6, "", fm.cell())
    wq.data_validation(r0 + 2, 5, r0 + 2, 5, {"validate": "list", "source": ["별도", "포함", "면세"]})
    vat_row = r0 + 3
    wq.write_formula(r0 + 2, 7, f'=IF(F{vat_row}="별도",ROUND(H{r0 + 2}*0.1,0),IF(F{vat_row}="포함",ROUND(H{r0 + 2}/11,0),0))', fm.money())
    wq.merge_range(r0 + 3, 1, r0 + 3, 6, "합 계 금 액", fm.total(align="center")); wq.write_formula(r0 + 3, 7, f'=H{r0 + 2}+IF(F{vat_row}="별도",H{vat_row},0)', fm.total(num_format="#,##0", font_size=12))
    wq.write_formula("D10", f'=H{r0 + 4}', fm.f(bold=True, font_size=16, font_color=pal["dark"], bg_color=pal["soft"], align="center", num_format='"₩ "#,##0'))
    nr = r0 + 5
    wq.write(nr - 1, 1, "비고", lab())
    wq.merge_range(nr - 1, 2, nr + 2, 7, NOTES[i % 5], fm.inp(text_wrap=True, valign="top"))
    wq.merge_range(nr + 4, 1, nr + 4, 7, (f"믿고 맡겨 주셔서 감사합니다.  ·  {message}" if message else "믿고 맡겨 주셔서 감사합니다."), fm.f(font_size=9, italic=True, font_color=pal["main"], align="center"))
    wq.print_area(0, 1, nr + 4, 7)
    wq.set_paper(9); wq.set_portrait(); wq.fit_to_pages(1, 1); wq.center_horizontally(); wq.set_margins(0.5, 0.5, 0.6, 0.6)
    wq.activate()
    wb.close()
