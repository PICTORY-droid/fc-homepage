"""양식 엑셀 빌더 — 명세(dict)를 받아 표·요약·달력·편지지 시트를 만듭니다.

수식 안의 자리표시:
  {key}          같은 줄의 열 칸 (예: E7)
  {R:key}        같은 시트(또는 요약 시트의 원본 시트) 열 전체 범위 (예: '기록'!$E$7:$E$106)
  {R:시트.key}   다른 시트의 열 전체 범위
  {P:key}        입력값(파라미터) 칸의 절대 주소
  {L}            요약 표에서 그 줄의 항목 이름 칸
"""
import re
from pathlib import Path

from openpyxl import Workbook
from openpyxl.chart import BarChart, LineChart, PieChart, Reference
from openpyxl.chart.series import DataPoint
from openpyxl.drawing.image import Image as XLImage
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter as L
from openpyxl.worksheet.datavalidation import DataValidation

from . import theme as T

TOKEN = re.compile(r"\{(RR:[^}]+|R:[^}]+|P:[^}]+|H:[^}]+|UP:[^}]+|u:[^}]+|L|r|r0|[a-z_0-9]+)\}")
BANNER_ROWS = (30, 30, 30)   # 배너가 덮는 1~3행 높이(pt)
CAP = 100                    # 표 입력 줄 수


def px(w: float) -> int:
    return int(w * 7 + 5)


def side(style="thin", color=T.LINE):
    return Side(style=style, color=color)


def fill(color):
    return PatternFill("solid", fgColor=color) if color else PatternFill()


def font(size=10.5, bold=False, color=T.INK, italic=False):
    return Font(name=T.FONT, size=size, bold=bold, color=color, italic=italic)


CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
LEFT = Alignment(horizontal="left", vertical="center", wrap_text=True, indent=1)
RIGHT = Alignment(horizontal="right", vertical="center", indent=1)

KIND_FMT = {"date": T.FMT["date"], "money": T.FMT["money"], "int": T.FMT["int"], "num": T.FMT["num"],
            "pct": T.FMT["pct"], "time": T.FMT["time"], "dday": T.FMT["dday"], "month": T.FMT["month"]}


class Book:
    def __init__(self, spec: dict, banners):
        self.spec = spec
        self.cat = spec["cat"]
        self.A = T.ACCENTS[self.cat]
        self.wb = Workbook()
        self.wb.remove(self.wb.active)
        self.wb.properties.creator = "우체국보험 FC (무료 나눔 양식)"
        self.wb.properties.description = T.NOTICE
        self.wb.properties.title = spec["title"]
        self.ranges = {}   # 시트 → key → (열, 첫줄, 끝줄)
        self.params = {}   # key → 절대 주소(시트 포함)
        self.preview = []  # 미리보기용: 시트별 보여 줄 범위와 수식 칸
        self.banners = banners
        self.tmp = Path(spec["_tmp"])

    # ---------- 공통 ----------
    def resolve(self, expr: str, sheet: str, r: int | None = None, label: str | None = None, src: str | None = None,
                col_abs=False) -> str:
        def rep(m):
            t = m.group(1)
            if t == "L":
                return label
            if t == "r":
                return str(r)
            if t == "r0":
                return str(self.ranges[src or sheet][next(iter(self.ranges[src or sheet]))][1])
            if t.startswith("H:"):
                c, a, b = self.ranges[sheet][t[2:]]
                return f"${c}${a - 1}"
            if t.startswith("UP:"):
                c, a, b = self.ranges[sheet][t[3:]]
                return f"${c}${a}:{c}{r}"
            if t.startswith("u:"):
                c = self.ranges[sheet][t[2:]][0]
                return f"{c}{r - 1}"
            if t.startswith("RR:"):
                ref = t[3:]
                sh, keys = ref.split(".", 1) if "." in ref else (src or sheet, ref)
                k1, k2 = keys.split(":")
                c1, a, b = self.ranges[sh][k1]
                c2 = self.ranges[sh][k2][0]
                return f"'{sh}'!${c1}${a}:${c2}${b}"
            if t.startswith("P:"):
                return self.params[t[2:]]
            if t.startswith("R:"):
                ref = t[2:]
                sh, key = ref.split(".", 1) if "." in ref else (src or sheet, ref)
                c, a, b = self.ranges[sh][key]
                return f"'{sh}'!${c}${a}:${c}${b}"
            c = self.ranges[sheet][t][0]
            return f"${c}{r}" if col_abs else f"{c}{r}"
        return TOKEN.sub(rep, expr)

    def sheet(self, name: str):
        ws = self.wb.create_sheet(name)
        ws.sheet_properties.tabColor = self.A["main"]
        ws.sheet_view.showGridLines = False
        ws.sheet_view.zoomScale = 100
        ws.column_dimensions["A"].width = 2.5
        for i, h in enumerate(BANNER_ROWS, 1):
            ws.row_dimensions[i].height = h
        return ws

    def notice(self, ws, row: int, col: int = 2):
        c = ws.cell(row=row, column=col, value=T.NOTICE)
        c.font = font(9, True, self.A["deep"])
        c.alignment = Alignment(vertical="center")
        ws.row_dimensions[row].height = 18

    def banner(self, ws, width_px: int, title: str, sub: str):
        w = max(width_px, 720)
        h = int(sum(BANNER_ROWS) * 96 / 72) - 4
        p = self.tmp / f"{self.spec['id']:02d}_{ws.title}.png"
        self.banners.make(p, w, h, title, sub, self.cat, self.spec.get("motif", "stamp"))
        img = XLImage(str(p))
        img.width, img.height = w, h
        ws.add_image(img, "B1")
        return w

    def legend(self, ws, row: int, text: str):
        c = ws.cell(row=row, column=2, value=text)
        c.font = font(9.5, color=T.INK_SOFT)
        c.alignment = Alignment(vertical="center")
        ws.row_dimensions[row].height = 20

    @staticmethod
    def param_places(params, widths):
        """입력값 칸 자리: (줄 차례, 이름 열, 이름 칸 수, 값 열, 값 칸 수) — 칸이 좁으면 옆 칸과 합칩니다."""
        out, r, col = [], 0, 2
        n = len(widths)

        def span(c, need):
            k = 1
            while sum(widths[c - 2: c - 2 + k]) < need and c - 2 + k < n:
                k += 1
            return k
        for _ in params:
            ls = span(col, 9)
            vs = span(col + ls, 13) if col + ls - 2 < n else 1
            short = sum(widths[col + ls - 2: col + ls - 2 + vs]) < 13
            if (col + ls + vs - 1 > max(n + 1, 3) or short) and col > 2:
                r, col = r + 1, 2
                ls = span(col, 9)
                vs = span(col + ls, 13)
            out.append((r, col, ls, col + ls, vs))
            col += ls + vs
        return out

    def param_block(self, ws, row: int, params: list, widths: list) -> int:
        """입력값 칸(이름 | 값) 묶음 — 표 위에 가로로 놓습니다. 다음 빈 줄 번호를 돌려줍니다."""
        places = self.param_places(params, widths)
        for p, (dr, lc, ls, vc, vs) in zip(params, places):
            r = row + dr
            if ls > 1:
                ws.merge_cells(start_row=r, start_column=lc, end_row=r, end_column=lc + ls - 1)
            if vs > 1:
                ws.merge_cells(start_row=r, start_column=vc, end_row=r, end_column=vc + vs - 1)
            lab = ws.cell(row=r, column=lc, value=p["label"])
            lab.font = font(9.5, True, self.A["deep"])
            lab.fill = fill(self.A["soft"])
            lab.alignment = CENTER
            for c in range(lc, lc + ls):
                ws.cell(row=r, column=c).border = Border(top=side(), bottom=side(), left=side() if c == lc else Side(), right=side() if c == lc + ls - 1 else Side())
                ws.cell(row=r, column=c).fill = fill(self.A["soft"])
            v = ws.cell(row=r, column=vc, value=p["value"])
            self.input_style(v, p.get("kind", "text"))
            v.font = font(11, True)
            v.alignment = CENTER
            for c in range(vc, vc + vs):
                ws.cell(row=r, column=c).border = Border(top=side(), bottom=side("medium", self.A["main"]), left=side() if c == vc else Side(), right=side() if c == vc + vs - 1 else Side())
                ws.cell(row=r, column=c).fill = fill(T.PAPER)
            if p.get("fmt"):
                v.number_format = p["fmt"]
            self.params[p["key"]] = f"'{ws.title}'!${L(vc)}${r}"
            if p.get("opts"):
                self.validate_list(ws, f"{L(vc)}{r}", p["opts"])
            ws.row_dimensions[r].height = 24
        return row + (places[-1][0] if places else 0) + 2

    def input_style(self, c, kind):
        c.fill = fill(T.PAPER)
        c.font = font()
        c.alignment = CENTER if kind in ("date", "sel", "check", "time", "month") else (RIGHT if kind in ("money", "int", "num", "pct") else LEFT)
        c.border = Border(left=side(), right=side(), bottom=side("dashed", T.LINE_DARK))
        if kind in KIND_FMT:
            c.number_format = KIND_FMT[kind]

    def auto_style(self, c, kind):
        c.fill = fill(T.AUTO_FILL)
        c.font = font(color=T.AUTO_INK)
        c.alignment = CENTER if kind in ("date", "dday", "text_c", "month", "pct") else (RIGHT if kind in ("money", "int", "num") else LEFT)
        c.border = Border(left=side(), right=side(), bottom=side("dashed", T.LINE_DARK))
        if kind in KIND_FMT:
            c.number_format = KIND_FMT[kind]

    def validate_list(self, ws, rng: str, opts: list):
        dv = DataValidation(type="list", formula1='"' + ",".join(opts) + '"', allow_blank=True,
                            showErrorMessage=True, errorStyle="warning",
                            errorTitle="목록에서 골라 주세요", error="칸 오른쪽 ▼ 를 눌러 목록에서 고르면 요약이 정확해져요.")
        ws.add_data_validation(dv)
        dv.add(rng)

    def kpi_cards(self, ws, row: int, kpis: list, sheet_for_tokens: str, src=None, widths=None) -> int:
        col = 2
        widths = (widths or [14] * 12) + [9] * 8
        for k in kpis:
            span = 1
            while sum(widths[col - 2: col - 2 + span]) < 21 and col - 2 + span < len(widths):
                span += 1
            ws.merge_cells(start_row=row, start_column=col, end_row=row, end_column=col + span - 1)
            ws.merge_cells(start_row=row + 1, start_column=col, end_row=row + 1, end_column=col + span - 1)
            a = ws.cell(row=row, column=col, value=k["label"])
            a.font = font(9.5, True, self.A["deep"])
            a.fill = fill(self.A["tint"])
            a.alignment = CENTER
            v = ws.cell(row=row + 1, column=col, value="=" + self.resolve(k["f"], sheet_for_tokens, src=src))
            v.font = font(15, True, self.A["main"])
            v.fill = fill(self.A["tint"])
            v.alignment = CENTER
            v.number_format = k.get("fmt") or KIND_FMT.get(k.get("kind", "int"), "General")
            for cc in range(col, col + span):
                ws.cell(row=row, column=cc).border = Border(top=side("thin", self.A["main"]), left=side("thin", self.A["soft"]) if cc == col else Side(), right=side("thin", self.A["soft"]) if cc == col + span - 1 else Side())
                ws.cell(row=row + 1, column=cc).border = Border(bottom=side("dashed", self.A["main"]), left=side("thin", self.A["soft"]) if cc == col else Side(), right=side("thin", self.A["soft"]) if cc == col + span - 1 else Side())
            col += span
        ws.row_dimensions[row].height = 20
        ws.row_dimensions[row + 1].height = 32
        return row + 3

    def mark(self, ws, rng: str, expr: str, kind: str):
        fg, bg = T.MARK[kind]
        ws.conditional_formatting.add(rng, FormulaRule(formula=[expr], font=Font(color=fg, bold=kind != "mute"),
                                                       fill=PatternFill("solid", fgColor=bg, bgColor=bg) if bg else None, stopIfTrue=False))

    # ---------- 표 시트 ----------
    def table(self, s: dict):
        name = s["name"]
        ws = self.sheet(name)
        cols = s["cols"] + self.gantt_cols(s)
        widths = [round(c.get("w", 12) * 1.06, 1) for c in cols]  # 맑은 고딕보다 넓게 그려지는 환경까지 여유
        for i, w in enumerate(widths):
            ws.column_dimensions[L(2 + i)].width = w
        bw = self.banner(ws, sum(px(w) for w in widths), s.get("title", self.spec["title"]), s.get("sub", self.spec["sub"]))
        extra = max(0, -(-(bw - sum(px(w) for w in widths)) // px(8.43)))  # 배너가 표보다 넓으면 인쇄·미리보기 범위를 넓힘
        self.legend(ws, 4, s.get("legend", "✎ 크림색 칸에 적어 주세요 · 회색 칸은 자동으로 계산돼요 · 예시 내용은 지우고 쓰셔도 돼요"))
        self.notice(ws, 5)
        row = 6
        if s.get("params"):
            row = self.param_block(ws, row, s["params"], widths)
        hdr, first, last = self.layout(s)
        assert hdr == row + (3 if s.get("kpis") else 0), "표 위치 계산이 어긋남"
        if s.get("kpis"):
            self.kpi_cards(ws, row, s["kpis"], name, widths=widths)
        for i, c in enumerate(cols):
            h = ws.cell(row=hdr, column=2 + i, value=c["h"])
            if "gantt" in c:
                h.value = f"={self.params[s['gantt']['param']]}+{7 * c['gantt']}"
                h.number_format = 'm"/"d'
            h.font = font(10 if "gantt" not in c else 8, True, self.A["deep"])
            h.fill = fill(self.A["soft"])
            h.alignment = CENTER
            h.border = Border(left=side("thin", "FFFFFF"), right=side("thin", "FFFFFF"), bottom=side("medium", self.A["main"]))
        ws.row_dimensions[hdr].height = 30
        rows = s.get("rows", [])
        fcell = None
        for r in range(first, last + 1):
            data = rows[r - first] if r - first < len(rows) else {}
            for i, c in enumerate(cols):
                cell = ws.cell(row=r, column=2 + i)
                kind = c.get("kind", "text")
                if "gantt" in c:
                    cell.fill = fill("FFFFFF")
                    cell.border = Border(left=side("hair", T.LINE), right=side("hair", T.LINE), bottom=side("dashed", T.LINE))
                    continue
                if "f" in c:
                    expr = self.resolve(c["f1"] if (r == first and "f1" in c) else c["f"], name, r)
                    if c.get("g"):
                        g = self.resolve("{" + c["g"] + "}", name, r)
                        expr = f'IF({g}="","",{expr})'
                    cell.value = "=" + expr
                    self.auto_style(cell, kind)
                    if fcell is None and r == first:
                        fcell = cell.coordinate
                else:
                    v = data.get(c["key"])
                    cell.value = v
                    self.input_style(cell, kind)
                if c.get("fmt"):
                    cell.number_format = c["fmt"]
            ws.row_dimensions[r].height = s.get("row_h", 21)
        for i, c in enumerate(cols):
            if c.get("opts"):
                col = L(2 + i)
                self.validate_list(ws, f"{col}{first}:{col}{last}", c["opts"])
            if c.get("kind") == "date" and "f" not in c:
                col = L(2 + i)
                dv = DataValidation(type="date", operator="greaterThan", formula1="1", allow_blank=True, showErrorMessage=True,
                                    errorStyle="warning", errorTitle="날짜로 적어 주세요", error="예) 2026-11-12 처럼 적으면 날짜로 알아봐요.")
                ws.add_data_validation(dv)
                dv.add(f"{col}{first}:{col}{last}")
        last_col = L(1 + len(cols))
        print_col = L(1 + len(cols) + extra)
        for m in s.get("marks", []):
            target = f"B{first}:{last_col}{last}" if m.get("row") else f"{self.ranges[name][m['key']][0]}{first}:{self.ranges[name][m['key']][0]}{last}"
            self.mark(ws, target, self.resolve(m["if"], name, first, col_abs=True), m["mark"])
        if s.get("gantt"):
            g = s["gantt"]
            sc, ec = self.ranges[name][g["start"]][0], self.ranges[name][g["end"]][0]
            for i in range(g["weeks"]):
                col = self.ranges[name][f"wk{i}"][0]
                ws.conditional_formatting.add(f"{col}{first}:{col}{last}", FormulaRule(
                    formula=[f'AND(${sc}{first}<>"",${ec}{first}<>"",{col}${hdr}<=${ec}{first},{col}${hdr}+6>=${sc}{first})'],
                    fill=PatternFill("solid", fgColor=self.A["main"], bgColor=self.A["main"])))
        ws.freeze_panes = f"A{first}"
        ws.print_title_rows = f"{hdr}:{hdr}"
        self.print_setup(ws, landscape=sum(widths) > 95)
        ws.print_area = f"A1:{print_col}{last}"
        self.preview.append({"sheet": name, "range": f"A1:{print_col}{min(last, first + s.get('pv_rows', 14))}",
                             "cell": s.get("pv_cell") or fcell or f"B{first}"})
        return ws

    # ---------- 요약 시트 ----------
    def summary(self, s: dict):
        name, src = s["name"], s["src"]
        ws = self.sheet(name)
        widths = s.get("widths", [16, 14, 14, 14, 14, 3, 14, 14, 14, 14, 14])
        for i, w in enumerate(widths):
            ws.column_dimensions[L(2 + i)].width = w
        self.banner(ws, sum(px(w) for w in widths), s.get("title", self.spec["title"] + " · 요약"), s.get("sub", "적어 둔 내용을 자동으로 모아 보여 줘요"))
        self.legend(ws, 4, s.get("legend", f"✎ 이 시트는 자동으로 정리돼요 · 입력은 「{src}」 시트에서 해 주세요"))
        self.notice(ws, 5)
        row = 6
        if s.get("params"):
            row = self.param_block(ws, row, s["params"], widths[:5])
        if s.get("kpis"):
            row = self.kpi_cards(ws, row, s["kpis"], name, src=src, widths=widths)
        fcell = None
        for g in s.get("groups", []):
            ws.cell(row=row, column=2, value="■ " + g["title"]).font = font(11, True, self.A["deep"])
            ws.row_dimensions[row].height = 24
            row += 1
            heads = [g.get("label_h", "항목")] + [c[0] for c in g["cols"]]
            for i, h in enumerate(heads):
                c = ws.cell(row=row, column=2 + i, value=h)
                c.font = font(10, True, self.A["deep"])
                c.fill = fill(self.A["soft"])
                c.alignment = CENTER
                c.border = Border(left=side("thin", "FFFFFF"), right=side("thin", "FFFFFF"), bottom=side("medium", self.A["main"]))
            ws.row_dimensions[row].height = 26
            top = row + 1
            for j, lab in enumerate(g["labels"]):
                r = top + j
                lc = ws.cell(row=r, column=2, value=lab)
                lc.font = font(10, True)
                lc.fill = fill(self.A["tint"])
                lc.alignment = CENTER
                lc.border = Border(left=side(), right=side(), bottom=side("dashed", T.LINE_DARK))
                if g.get("label_fmt"):
                    lc.number_format = g["label_fmt"]
                for i, (h, expr, kind) in enumerate(g["cols"]):
                    c = ws.cell(row=r, column=3 + i, value="=" + self.resolve(expr, name, r, label=f"$B{r}", src=src))
                    self.auto_style(c, kind)
                    c.font = font(10.5, color=T.INK)
                    if fcell is None:
                        fcell = c.coordinate
                ws.row_dimensions[r].height = 21
            end = top + len(g["labels"]) - 1
            if g.get("total"):
                r = end + 1
                tc = ws.cell(row=r, column=2, value="합계")
                tc.font = font(10, True, self.A["deep"])
                tc.alignment = CENTER
                for i, (h, expr, kind) in enumerate(g["cols"]):
                    col = L(3 + i)
                    c = ws.cell(row=r, column=3 + i, value=f"=SUM({col}{top}:{col}{end})" if kind in ("money", "int", "num") else "")
                    c.font = font(10.5, True, self.A["deep"])
                    c.number_format = KIND_FMT.get(kind, "General")
                    c.alignment = RIGHT
                for i in range(len(heads)):
                    cc = ws.cell(row=r, column=2 + i)
                    cc.fill = fill(self.A["tint"])
                    cc.border = Border(top=side("thin", self.A["main"]), bottom=side("thin", self.A["main"]))
                ws.row_dimensions[r].height = 22
            if g.get("chart"):
                self.chart(ws, g, top, end, len(heads))
            row = end + (3 if g.get("total") else 2)
            if g.get("chart"):
                row = max(row, top + 15)
        self.print_setup(ws, landscape=True)
        last_col = L(1 + len(widths))
        ws.print_area = f"A1:{last_col}{row}"
        self.preview.append({"sheet": name, "range": f"A1:{last_col}{min(row, s.get('pv_rows', 34))}", "cell": s.get("pv_cell") or fcell or "C8"})
        return ws

    def chart(self, ws, g, top, end, nheads):
        spec = g["chart"]
        col = 3 + spec.get("col", 0)
        kind = spec.get("type", "bar")
        ch = {"bar": BarChart, "line": LineChart, "pie": PieChart}[kind]()
        if kind == "bar":
            ch.type = "col"
            ch.gapWidth = 60
        data = Reference(ws, min_col=col, min_row=top - 1, max_row=end)
        cats = Reference(ws, min_col=2, min_row=top, max_row=end)
        ch.add_data(data, titles_from_data=True)
        ch.set_categories(cats)
        ch.title = spec.get("title")
        ch.height, ch.width = 7.2, 13.5
        ch.legend = None if kind != "pie" else ch.legend
        s0 = ch.series[0]
        if kind == "pie":
            pal = [self.A["main"], "9FC7E8", "FFD66B", "7FD1B9", "F7A8B8", "B9A6F0", "F2A07B", "C9C2BA", "A9D3F2", "FFDAC1", "D6C2B2", "8FD3B6"]
            for i in range(end - top + 1):
                pt = DataPoint(idx=i)
                pt.graphicalProperties.solidFill = pal[i % len(pal)]
                s0.dPt.append(pt)
        else:
            s0.graphicalProperties.solidFill = self.A["main"]
            s0.graphicalProperties.line.solidFill = self.A["main"]
        ws.add_chart(ch, f"{L(2 + nheads + 1)}{top - 1}")

    # ---------- 달력 시트 ----------
    def calendar(self, s: dict):
        name, src = s["name"], s["src"]
        ws = self.sheet(name)
        for i in range(7):
            ws.column_dimensions[L(2 + i)].width = 17
        self.banner(ws, 7 * px(17), s.get("title", self.spec["title"] if "달력" in self.spec["title"] else self.spec["title"] + " · 달력"), s.get("sub", "목록에 적은 날짜가 달력에 저절로 표시돼요"))
        self.legend(ws, 4, f"✎ 연도와 월만 바꾸면 달력이 바뀌어요 · 일정은 「{src}」 시트에 적어 주세요")
        self.notice(ws, 5)
        row = self.param_block(ws, 6, [{"key": "cy", "label": "연도", "value": s.get("year", 2026), "fmt": T.FMT["year"], "kind": "int"},
                                       {"key": "cm", "label": "월", "value": s.get("month", 11), "fmt": T.FMT["month"], "kind": "int", "opts": [str(i) for i in range(1, 13)]}], [17] * 7)
        Y, M = self.params["cy"].split("!")[1], self.params["cm"].split("!")[1]
        days = ["일", "월", "화", "수", "목", "금", "토"]
        for i, d in enumerate(days):
            c = ws.cell(row=row, column=2 + i, value=d)
            c.font = font(10.5, True, "C2255C" if i == 0 else ("1F5F99" if i == 6 else self.A["deep"]))
            c.fill = fill(self.A["soft"])
            c.alignment = CENTER
            c.border = Border(bottom=side("medium", self.A["main"]), left=side("thin", "FFFFFF"), right=side("thin", "FFFFFF"))
        ws.row_dimensions[row].height = 24
        start = row + 1
        lab = self.resolve("{R:" + s["label_key"] + "}", name, src=src)
        key_rng = self.resolve("{R:" + s["key_key"] + "}", name, src=src)
        for w in range(6):
            dr, er = start + w * 2, start + w * 2 + 1
            for d in range(7):
                col = L(2 + d)
                dc = ws.cell(row=dr, column=2 + d, value=f"=DATE({Y},{M},1)-WEEKDAY(DATE({Y},{M},1))+1+{w * 7 + d}")
                dc.number_format = "d"
                dc.font = font(10.5, True, "C2255C" if d == 0 else ("1F5F99" if d == 6 else T.INK))
                dc.alignment = Alignment(horizontal="left", vertical="top", indent=1)
                dc.border = Border(left=side(), right=side(), top=side())
                dc.fill = fill(T.PAPER)
                key = f"MONTH({col}{dr})*100+DAY({col}{dr})" if s.get("annual") else f"{col}{dr}"
                ec = ws.cell(row=er, column=2 + d,
                             value=f'=IFERROR(INDEX({lab},MATCH({key},{key_rng},0)),"")&IF(COUNTIF({key_rng},{key})>1," 외 "&(COUNTIF({key_rng},{key})-1)&"건","")')
                ec.font = font(9, color=self.A["deep"])
                ec.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True, indent=1)
                ec.border = Border(left=side(), right=side(), bottom=side())
                ec.fill = fill(T.PAPER)
            ws.row_dimensions[dr].height = 20
            ws.row_dimensions[er].height = 40
        end = start + 11
        for w in range(6):
            dr, er = start + w * 2, start + w * 2 + 1
            self.mark(ws, f"B{dr}:H{dr}", f"B{dr}=TODAY()", "good")
            self.mark(ws, f"B{dr}:H{dr}", f"MONTH(B{dr})<>{M}", "mute")
            self.mark(ws, f"B{er}:H{er}", f'AND(B{er}<>"",MONTH(B{dr})={M})', "warn")
            self.mark(ws, f"B{er}:H{er}", f"MONTH(B{dr})<>{M}", "mute")
        self.print_setup(ws, landscape=True)
        ws.print_area = f"A1:H{end}"
        self.preview.append({"sheet": name, "range": f"A1:H{end}", "cell": f"B{start}"})
        return ws

    # ---------- 편지지 시트 ----------
    def letter(self, s: dict):
        name = s["name"]
        ws = self.sheet(name)
        ncol, cw = 10, 10.4
        for i in range(ncol):
            ws.column_dimensions[L(2 + i)].width = cw
        ws.column_dimensions[L(2 + ncol)].width = 2.5
        self.banner(ws, ncol * px(cw), s.get("title", self.spec["title"]), s.get("sub", self.spec["sub"]))
        last = L(1 + ncol)
        stripe = [self.A["main"], "9FC7E8"]
        style = s.get("style", "lined")

        def stripe_row(r):
            for i in range(ncol):
                ws.cell(row=r, column=2 + i).fill = PatternFill("lightUp", fgColor=stripe[i % 2], bgColor="FFFFFF")
            ws.row_dimensions[r].height = 7
        stripe_row(4)
        r = 6
        ws.merge_cells(f"B{r}:{L(1 + ncol)}{r}")
        t = ws.cell(row=r, column=2, value=s.get("to", "To."))
        t.font = font(13, True, self.A["deep"])
        t.alignment = Alignment(vertical="bottom", indent=1)
        for i in range(ncol):
            ws.cell(row=r, column=2 + i).border = Border(bottom=side("thin", self.A["main"]))
        ws.row_dimensions[r].height = 30
        body = s.get("body", [])
        lines = s.get("lines", 20)
        lh = s.get("line_h", 27)
        for k in range(lines):
            rr = r + 1 + k
            ws.merge_cells(f"B{rr}:{last}{rr}")
            c = ws.cell(row=rr, column=2, value=body[k] if k < len(body) else None)
            c.font = font(s.get("size", 12), color=T.INK)
            c.alignment = Alignment(vertical="bottom", indent=1)
            for i in range(ncol):
                cc = ws.cell(row=rr, column=2 + i)
                if style == "grid":
                    cc.border = Border(left=side("hair", self.A["soft"]), right=side("hair", self.A["soft"]), bottom=side("hair", self.A["soft"]))
                else:
                    cc.border = Border(bottom=side("dashed" if style == "lined" else "dotted", self.A["main"] if style == "wide" else "E2B9A0"))
            ws.row_dimensions[rr].height = lh
        fr = r + lines + 2
        ws.merge_cells(f"B{fr}:{last}{fr}")
        d = ws.cell(row=fr, column=2, value=s.get("date", "        년      월      일"))
        d.font = font(11, color=T.INK_SOFT)
        d.alignment = Alignment(horizontal="right", vertical="center", indent=2)
        ws.merge_cells(f"B{fr + 1}:{last}{fr + 1}")
        f = ws.cell(row=fr + 1, column=2, value=s.get("from", "From."))
        f.font = font(13, True, self.A["deep"])
        f.alignment = Alignment(horizontal="right", vertical="center", indent=2)
        ws.row_dimensions[fr].height = 24
        ws.row_dimensions[fr + 1].height = 30
        stripe_row(fr + 3)
        self.notice(ws, fr + 4)
        ws.cell(row=fr + 4, column=2).font = font(8, False, T.INK_SOFT)
        self.print_setup(ws, landscape=False)
        ws.print_area = f"A1:{L(2 + ncol)}{fr + 4}"
        ws.print_options.horizontalCentered = True
        self.preview.append({"sheet": name, "range": f"A1:{L(2 + ncol)}{fr + 4}", "cell": "B7"})
        return ws

    # ---------- 인쇄 ----------
    def print_setup(self, ws, landscape: bool):
        ws.page_setup.paperSize = ws.PAPERSIZE_A4
        ws.page_setup.orientation = "landscape" if landscape else "portrait"
        ws.page_setup.fitToWidth = 1
        ws.page_setup.fitToHeight = 0
        ws.sheet_properties.pageSetUpPr.fitToPage = True
        ws.page_margins.left = ws.page_margins.right = 0.4
        ws.page_margins.top = ws.page_margins.bottom = 0.5
        ws.oddFooter.center.text = T.FOOTER

    def param_rows(self, params, widths):
        places = self.param_places(params, widths)
        return 6 + (places[-1][0] if places else 0) + 2

    def layout(self, s):
        """표 시트의 머리글·첫 줄·끝 줄 — 다른 시트가 먼저 참조할 수 있게 미리 계산합니다."""
        cols = s["cols"] + self.gantt_cols(s)
        row = self.param_rows(s["params"], [round(c.get("w", 12) * 1.06, 1) for c in cols]) if s.get("params") else 6
        hdr = row + (3 if s.get("kpis") else 0)
        first, last = hdr + 1, hdr + s.get("cap", CAP)
        self.ranges[s["name"]] = {c["key"]: (L(2 + i), first, last) for i, c in enumerate(cols)}
        return hdr, first, last

    def gantt_cols(self, s):
        g = s.get("gantt")
        if not g:
            return []
        return [{"key": f"wk{i}", "h": "", "w": 4.2, "gantt": i} for i in range(g["weeks"])]

    def build(self):
        for s in self.spec["sheets"]:
            if s["type"] == "table":
                self.layout(s)
        for s in self.spec["sheets"]:
            getattr(self, s["type"])(s)
        self.wb.active = 0
        return self.wb
