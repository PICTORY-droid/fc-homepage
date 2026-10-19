"""엑셀(XlsxWriter) 공통 도구 — 서식 묶음, 표지 시트, 차트 헬퍼."""
import xlsxwriter

FONT = "맑은 고딕"
AUTHOR = "우체국보험 상담 안내"
FOOTER = "우체국보험 상담 안내 · 자유롭게 고쳐 쓰세요"


def q(sheet):
    """시트 이름을 수식에서 쓸 수 있게 따옴표로 감쌉니다."""
    return "'" + sheet.replace("'", "''") + "'"


def rng(sheet, a1):
    return f"{q(sheet)}!{a1}"


class Fmt:
    """팔레트에 맞춘 서식 모음(같은 서식은 한 번만 만든다)."""

    def __init__(self, wb, pal):
        self.wb, self.p, self._c = wb, pal, {}

    def f(self, **kw):
        key = tuple(sorted(kw.items()))
        if key not in self._c:
            d = {"font_name": FONT, "font_size": 10, "valign": "vcenter"}
            d.update(kw)
            self._c[key] = self.wb.add_format(d)
        return self._c[key]

    # 자주 쓰는 서식
    def title(self, size=20):
        return self.f(bold=True, font_size=size, font_color=self.p["dark"])

    def sub(self):
        return self.f(italic=True, font_size=11, font_color=self.p["main"])

    def head(self):
        return self.f(bold=True, font_color="#FFFFFF", bg_color=self.p["main"], align="center", border=1, border_color=self.p["dark"], text_wrap=True)

    def cell(self, **kw):
        return self.f(border=1, border_color=self.p["soft"], **kw)

    def money(self, **kw):
        kw.setdefault("num_format", "#,##0")
        return self.cell(**kw)

    def date(self, **kw):
        kw.setdefault("num_format", "yyyy-mm-dd")
        kw.setdefault("align", "center")
        return self.cell(**kw)

    def inp(self, **kw):  # 입력 칸(연한 바탕)
        return self.f(border=1, border_color=self.p["main"], bg_color=self.p["pale"], **kw)

    def note(self):
        return self.f(font_size=9, font_color="#777777", text_wrap=True, valign="top")

    def total(self, **kw):
        return self.f(bold=True, bg_color=self.p["soft"], top=2, top_color=self.p["main"], **kw)

    def kpi_label(self):
        return self.f(font_size=9, font_color="#FFFFFF", bg_color=self.p["dark"], align="center")

    def kpi_value(self, num="#,##0"):
        return self.f(bold=True, font_size=16, font_color=self.p["dark"], bg_color=self.p["soft"], align="center", num_format=num)


def new_book(path, title, pal):
    wb = xlsxwriter.Workbook(path)
    wb.set_properties({"title": title, "author": AUTHOR, "company": AUTHOR, "comments": "자유롭게 편집해서 사용하세요."})
    wb.set_calc_mode("auto")
    return wb, Fmt(wb, pal)


def cover(wb, fm, name, title, message, theme_name, steps, extra=None, tab=None):
    """'시작하기' 표지 시트."""
    ws = wb.add_worksheet(name)
    ws.hide_gridlines(2)
    ws.set_tab_color(fm.p["main"])
    ws.set_column("A:A", 3)
    ws.set_column("B:B", 16)
    ws.set_column("C:C", 62)
    ws.set_row(1, 30)
    ws.merge_range("B2:C2", title, fm.title(22))
    ws.merge_range("B3:C3", (f"“{message}”" if message else ""), fm.sub())
    ws.merge_range("B4:C4", f"{theme_name} 테마", fm.f(font_size=9, font_color="#777777"))
    ws.set_row(4, 6)
    ws.write("B6", "사용 순서", fm.f(bold=True, font_color="#FFFFFF", bg_color=fm.p["main"], align="center"))
    ws.write("C6", "", fm.f(bg_color=fm.p["main"]))
    r = 6
    for i, s in enumerate(steps, 1):
        ws.write(r, 1, f"{i}", fm.f(bold=True, font_color=fm.p["dark"], align="center", bg_color=fm.p["soft"], border=1, border_color=fm.p["soft"]))
        ws.write(r, 2, s, fm.f(text_wrap=True, border=1, border_color=fm.p["soft"]))
        ws.set_row(r, 32 if len(s) > 46 else 22)
        r += 1
    r += 1
    for line in extra or []:
        ws.merge_range(r, 1, r, 2, line, fm.note())
        ws.set_row(r, 28)
        r += 1
    ws.merge_range(r + 1, 1, r + 1, 2, FOOTER, fm.f(font_size=9, font_color=fm.p["main"], align="center"))
    ws.set_landscape()
    ws.fit_to_pages(1, 1)
    return ws


def style_chart(ch, fm, title, w=520, h=300, legend="bottom"):
    ch.set_title({"name": title, "name_font": {"name": FONT, "size": 11, "color": fm.p["dark"]}})
    ch.set_size({"width": w, "height": h})
    ch.set_legend({"position": legend, "font": {"name": FONT, "size": 9}} if legend else {"none": True})
    ch.set_chartarea({"border": {"color": fm.p["soft"]}})
    return ch


def series_colors(pal, n):
    """n개 계열의 색(진한→연한)."""
    base = [pal["main"], pal["accent"], pal["dark"], pal["soft"]]
    return [base[i % len(base)] for i in range(n)]


def slice_colors(pal, n):
    """원형 차트용 n개 색 — 테마 색을 밝기만 바꿔 나열."""
    import colorsys
    h = pal["main"].lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    hh, ll, ss = colorsys.rgb_to_hls(r, g, b)
    out = []
    for k in range(n):
        light = 0.28 + 0.52 * (k / max(1, n - 1))
        hue = (hh + (0.04 * (k % 3))) % 1.0
        rr, gg, bb = colorsys.hls_to_rgb(hue, light, min(1.0, ss * (0.9 if k % 2 else 1.0)))
        out.append("#%02X%02X%02X" % (round(rr * 255), round(gg * 255), round(bb * 255)))
    return out
