"""직업별 이력서·자기소개서 Word(.docx)를 짜는 도구 — 팔레트와 표 블록을 조합해 서로 다른 양식을 만듭니다.
칸을 눌러 바로 입력하고, 글이 길어지면 칸이 같이 늘어납니다. (모든 길이는 px, A4 = 794 x 1123)
"""
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.shared import Pt
from docx_kit import (cell_borders, footer_text, make_table, new_document, para, para_border, row_height, run, save_document,
                      set_text, shade, valign)

FOOT = "빈 양식 · 우체국보험 상담 안내 제공 · 개인정보는 본인이 직접 기입하세요"
SLACK = 1.0


def palette(dark, mid, soft, line="b9c4d3", gray="7a8798"):
    return dict(dark=dark, mid=mid, soft=soft, line=line, gray=gray)


class Form:
    def __init__(self, title, pal, margins=(46, 52, 40, 52), foot=FOOT):
        self.p = pal
        self.doc = new_document(title, margins)
        self.cw = 794 - margins[1] - margins[3]
        footer_text(self.doc, foot)
        self._next_page = False

    # ----- 쪽·문단 -----
    def new_page(self):
        self._next_page = True

    def _mark(self, par):
        if self._next_page:
            par.paragraph_format.page_break_before = True
            self._next_page = False
        return par

    def _tab(self, par, width_px):
        from docx.enum.text import WD_TAB_ALIGNMENT
        from docx.shared import Twips
        from docx_kit import px
        par.paragraph_format.tab_stops.add_tab_stop(Twips(px(width_px)), WD_TAB_ALIGNMENT.RIGHT)

    # ----- 제목 4가지 -----
    def title_center(self, text, sub=""):
        p = self._mark(para(self.doc, text, 26, True, self.p["dark"], "center", after=2, spacing=10))
        if sub:
            para(self.doc, sub, 9, None, self.p["gray"], "center", after=8, spacing=2)
        return p

    def title_bar(self, text, sub=""):
        p = self._mark(para(self.doc, "", after=6))
        run(p, text, 20, True, self.p["dark"], 4)
        if sub:
            self._tab(p, self.cw)
            run(p, "\t" + sub, 9, None, self.p["gray"])
        para_border(p, "bottom", self.p["mid"], 18, 4)
        return p

    def title_band(self, text, sub=""):
        t = make_table(self.doc, [self.cw], 1, border=None, cell_margin=(110, 200))
        c = t.rows[0].cells[0]
        shade(c, self.p["dark"])
        par = c.paragraphs[0]
        run(par, text, 20, True, "FFFFFF", 4)
        if sub:
            self._tab(par, self.cw - 40)
            run(par, "\t" + sub, 9, None, "dbe6f3")
        valign(c, "center")
        self._mark(par)
        para(self.doc, "", after=2)
        return t

    def title_accent(self, text, sub=""):
        p = self._mark(para(self.doc, "", after=6))
        run(p, text, 22, True, self.p["dark"], 2)
        if sub:
            run(p, f"    {sub}", 9.5, None, self.p["gray"])
        para_border(p, "left", self.p["mid"], 60, 8)
        p.paragraph_format.left_indent = Pt(8)
        return p

    def heading(self, style, text, sub=""):
        return getattr(self, f"title_{style}")(text, sub)

    # ----- 소제목·안내 -----
    def sec(self, text, before=11):
        p = self._mark(para(self.doc, text, 11, True, self.p["dark"], before=before, after=4, keep_next=True))
        para_border(p, "left", self.p["mid"], 36, 6)
        p.paragraph_format.left_indent = Pt(7)
        return p

    def q(self, n, text, hint=""):
        p = self._mark(para(self.doc, "", before=10, after=4, keep_next=True))
        run(p, f"{n}. ", 10.5, True, self.p["mid"])
        run(p, text, 10.5, True)
        if hint:
            run(p, f"   {hint}", 8.5, None, self.p["gray"])
        return p

    def note(self, text):
        return para(self.doc, text, 8.5, None, self.p["gray"], before=3)

    # ----- 표 공통 -----
    def _t(self, widths, rows, border=True):
        return make_table(self.doc, widths, rows, border=self.p["line"] if border else None)

    def _label(self, cell, text):
        set_text(cell, text, 9.5, True, self.p["dark"], "center")
        shade(cell, self.p["soft"])

    def grid(self, labels, pct, rows, row_px=33):
        widths = [round(self.cw * v / 100) for v in pct]
        widths[-1] += self.cw - sum(widths)
        t = self._t(widths, rows + 1)
        for c, lab in zip(t.rows[0].cells, labels):
            self._label(c, lab)
        row_height(t.rows[0], 28)
        for r in t.rows[1:]:
            row_height(r, row_px)
            for c in r.cells:
                valign(c, "center")
        return t

    def table(self, spec, lab_w=92, row_px=33):
        """칸 짝 표. spec 의 한 줄: ["라벨"] = 한 칸 길게, ["라벨A","라벨B"] = 두 칸 나란히,
        ("tall", "라벨", 높이) = 글을 길게 쓰는 큰 칸. 모든 줄이 한 표로 이어집니다."""
        vw = (self.cw - 2 * lab_w) // 2
        widths = [lab_w, vw, lab_w, self.cw - 2 * lab_w - vw]
        t = self._t(widths, len(spec))
        for r, item in zip(t.rows, spec):
            cells = r.cells
            if isinstance(item, tuple):
                _, lab, h = item
                row_height(r, h)
                self._label(cells[0], lab)
                cells[1].merge(cells[3])
                continue
            row_height(r, row_px)
            if len(item) == 1:
                self._label(cells[0], item[0])
                valign(cells[1].merge(cells[3]), "center")
            else:
                for i, lab in enumerate(item):
                    self._label(cells[2 * i], lab)
                    valign(cells[2 * i + 1], "center")
        return t

    def person(self, spec, photo=True):
        """인적사항. photo=True 면 왼쪽에 사진 칸(3×4cm)이 붙습니다."""
        if not photo:
            return self.table(spec, row_px=34)
        w = [113, 80, 217, 80, self.cw - 113 - 80 - 217 - 80]
        t = self._t(w, len(spec))
        ph = t.cell(0, 0).merge(t.cell(len(spec) - 1, 0))
        set_text(ph, "사진\n(3×4cm)", 9, None, "9aa6b5", "center")
        for r, labels in zip(t.rows, spec):
            row_height(r, 38)
            cells = r.cells
            if len(labels) == 1:
                self._label(cells[1], labels[0])
                cells[2].merge(cells[4])
            else:
                for i, lab in enumerate(labels):
                    self._label(cells[1 + 2 * i], lab)
        return t

    def box(self, height_px):
        t = self._t([self.cw], 1)
        row_height(t.rows[0], height_px)
        return t

    def skills(self, labels, rows, pct=(24, 46, 30), level=True):
        """분야/항목/숙련도 표 — 숙련도 칸은 ○○○○○ 로 채워 두고 ●로 바꿔 표시하게 합니다."""
        t = self.grid(list(labels), list(pct), rows, 31)
        if level:
            for r in t.rows[1:]:
                set_text(r.cells[-1], "○ ○ ○ ○ ○", 10, None, self.p["mid"], "center")
        return t

    def check(self, label, items, lab_w=110):
        """□ 항목들을 한 줄(길면 여러 줄)로 늘어놓는 점검 표."""
        t = self._t([lab_w, self.cw - lab_w], 1)
        self._label(t.rows[0].cells[0], label)
        row_height(t.rows[0], 34)
        set_text(t.rows[0].cells[1], "   ".join(f"□ {i}" for i in items), 9.5)
        return t

    def sign(self, confirm=True):
        if confirm:
            para(self.doc, "위 내용은 사실과 다름이 없음을 확인합니다.", 10, None, None, "center", before=14)
        para(self.doc, "20        년        월        일        작성자 : ________________  (서명)", 10, None, None, "center", before=6)

    def save(self, path):
        save_document(self.doc, path)
