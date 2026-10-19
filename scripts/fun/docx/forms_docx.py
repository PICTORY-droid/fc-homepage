"""이력서·자기소개서 10종 Word(.docx) 생성 — 칸을 눌러 바로 입력하고 칸이 늘어나는 표 형식.
실행: python3 scripts/fun/docx/make_forms_docx.py <출력 폴더>  (아래 forms 목록의 id 는 src/config/forms.ts 와 같아야 합니다)
"""
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt
from docx_kit import (exact_height, footer_text, make_table, new_document, para, para_border, row_height, run, set_text,
                      shade, cell_borders, valign, save_document, px)

BLUE, NAVY, SOFT, LINE, GRAY = "2F5D9E", "1F3A5F", "EEF3FA", "b9c4d3", "7a8798"
FOOT = "빈 양식 · 우체국보험 상담 안내 제공 · 개인정보는 본인이 직접 기입하세요"
SLACK = 1.0  # Word 마다 줄 높이가 조금 달라도 쪽이 넘치지 않도록 칸 높이를 조금 줄입니다


class Form:
    def __init__(self, title, margins=(46, 52, 40, 52)):
        self.doc = new_document(title, margins)
        self.cw = 794 - margins[1] - margins[3]
        footer_text(self.doc, FOOT)
        self._next_page = False

    # --- 쪽 나누기: 다음에 만드는 첫 문단이 새 쪽에서 시작합니다 ---
    def new_page(self):
        self._next_page = True

    def _mark(self, p):
        if self._next_page:
            p.paragraph_format.page_break_before = True
            self._next_page = False
        return p

    def title(self, text, sub):
        p = self._mark(para(self.doc, text, 26, True, NAVY, "center", after=2, spacing=10))
        para(self.doc, sub, 9, None, GRAY, "center", after=8, spacing=2)
        return p

    def hd(self, text):
        p = self._mark(para(self.doc, text, 20, True, NAVY, after=6, spacing=4))
        para_border(p, "bottom", BLUE, 18, 4)
        return p

    def sec(self, text, before=11):
        p = self._mark(para(self.doc, text, 11, True, NAVY, before=before, after=4, keep_next=True))
        para_border(p, "left", BLUE, 36, 6)
        p.paragraph_format.left_indent = Pt(7)
        return p

    def q(self, n, text, hint=""):
        p = self._mark(para(self.doc, "", before=10, after=4, keep_next=True))
        run(p, f"{n}. ", 10.5, True, BLUE)
        run(p, text, 10.5, True)
        if hint:
            run(p, f"   {hint}", 8.5, None, GRAY)
        return p

    # --- 표 ---
    def grid(self, labels, pct, rows, row_px=33, box=None):
        box = box or self.doc
        total = self.cw if box is self.doc else box.width_px
        widths = [round(total * p / 100) for p in pct]
        widths[-1] += total - sum(widths)
        t = make_table(box, widths, rows + 1)
        for c, lab in zip(t.rows[0].cells, labels):
            shade(c, SOFT); set_text(c, lab, 9.5, True, NAVY, "center")
        row_height(t.rows[0], 28)
        for r in t.rows[1:]:
            row_height(r, row_px)
            for c in r.cells:
                valign(c, "center")
        return t

    def kv(self, spec, widths, row_px=33, box=None):
        """spec: 줄마다 [(라벨, 칸 수), ...] 가 아니라 ["라벨", "값칸 너비 배수"...] 대신 단순히 라벨 목록의 목록.
        예) [["성 명"], ["연락처", "이메일"]] — 한 줄에 라벨이 1개면 값칸이 길게 합쳐집니다."""
        box = box or self.doc
        t = make_table(box, widths, len(spec))
        for r, labels in zip(t.rows, spec):
            row_height(r, row_px)
            cells = r.cells
            if len(labels) == 1:
                set_text(cells[0], labels[0], 9.5, True, NAVY, "center"); shade(cells[0], SOFT)
                v = cells[1].merge(cells[-1]); valign(v, "center")
            else:
                for i, lab in enumerate(labels):
                    set_text(cells[2 * i], lab, 9.5, True, NAVY, "center"); shade(cells[2 * i], SOFT)
                    valign(cells[2 * i + 1], "center")
        return t

    def person(self, spec, photo=True):
        """사진 칸 + 인적사항 표. spec: [["성 명"], ["생년월일", "성 별"], ...]"""
        w = [113, 80, 217, 80, self.cw - 113 - 80 - 217 - 80]
        t = make_table(self.doc, w, len(spec))
        ph = t.cell(0, 0).merge(t.cell(len(spec) - 1, 0))
        set_text(ph, "사진\n(3×4cm)", 9, None, "9aa6b5", "center")
        self._mark(t.rows[0].cells[0].paragraphs[0])
        for r, labels in zip(t.rows, spec):
            row_height(r, 38)
            cells = r.cells
            if len(labels) == 1:
                set_text(cells[1], labels[0], 9.5, True, NAVY, "center"); shade(cells[1], SOFT)
                cells[2].merge(cells[4])
            else:
                for i, lab in enumerate(labels):
                    set_text(cells[1 + 2 * i], lab, 9.5, True, NAVY, "center"); shade(cells[1 + 2 * i], SOFT)
        return t

    def box(self, height_px, label=None, container=None):
        """글 쓰는 큰 칸 — 글이 길어지면 칸이 같이 늘어납니다."""
        container = container or self.doc
        total = self.cw if container is self.doc else container.width_px
        t = make_table(container, [total], 1)
        row_height(t.rows[0], height_px * SLACK)
        return t

    def tall_row(self, labels_top, label_side, height_px):
        """회사명/근무기간 … 2줄 + '담당 업무 및 성과' 큰 칸 한 덩어리(표 하나)."""
        w = [92, (self.cw - 184) // 2, 92, self.cw - 184 - (self.cw - 184) // 2]
        t = make_table(self.doc, w, len(labels_top) + 1)
        for r, labs in zip(t.rows, labels_top):
            row_height(r, 33)
            for i, lab in enumerate(labs):
                set_text(r.cells[2 * i], lab, 9.5, True, NAVY, "center"); shade(r.cells[2 * i], SOFT); valign(r.cells[2 * i + 1], "center")
        last = t.rows[-1]
        row_height(last, height_px * SLACK)
        set_text(last.cells[0], label_side, 9.5, True, NAVY, "center"); shade(last.cells[0], SOFT)
        last.cells[1].merge(last.cells[3])
        return t

    def sign(self, with_confirm=True):
        if with_confirm:
            para(self.doc, "위 내용은 사실과 다름이 없음을 확인합니다.", 10, None, None, "center", before=14)
        para(self.doc, "20        년        월        일        작성자 : ________________  (서명)", 10, None, None, "center", before=6)

    def check_line(self):
        p = para(self.doc, "", before=8)
        run(p, "병역 사항 :   ", 9.5, True, NAVY)
        run(p, "□ 군필     □ 미필     □ 면제     □ 해당 없음", 9.5)

    def save(self, path):
        save_document(self.doc, path)


# ---------------- 양식 10종 ----------------
def resume_standard():
    f = Form("이력서 · 표준")
    f.title("이 력 서", "RESUME")
    f.person([["성 명"], ["생년월일", "성 별"], ["연 락 처", "이 메 일"], ["주 소"]])
    f.sec("학 력"); f.grid(["기 간", "학교명", "전공 / 학과", "졸업 구분"], [22, 30, 30, 18], 3)
    f.sec("경 력"); f.grid(["기 간", "회사명 / 부서", "직 위", "담당 업무"], [22, 28, 14, 36], 4)
    f.sec("자격 · 면허"); f.grid(["취득일", "자격 / 면허명", "발행 기관"], [22, 46, 32], 3)
    f.sec("어학 · 특기 사항"); f.grid(["구 분", "내 용", "점수 / 수준"], [22, 52, 26], 1)
    f.check_line(); f.sign(); return f


def resume_newbie():
    f = Form("이력서 · 신입 간단형")
    f.title("이 력 서", "RESUME · 신입")
    f.person([["성 명"], ["생년월일", "연 락 처"], ["이 메 일", "희망 직무"], ["주 소"]])
    f.sec("학 력"); f.grid(["기 간", "학교명", "전공 / 학점", "비 고"], [22, 30, 30, 18], 3)
    f.sec("인턴 · 대외활동 · 동아리"); f.grid(["기 간", "기관 / 활동명", "역 할", "배운 점"], [20, 26, 18, 36], 3)
    f.sec("수상 · 프로젝트"); f.grid(["일 자", "수상 / 프로젝트명", "주관 / 내용"], [20, 40, 40], 3)
    f.sec("자격증 · 어학 · 활용 가능 프로그램"); f.grid(["취득일", "자격 / 프로그램명", "점수 / 수준"], [22, 46, 32], 3)
    f.sign(); return f


def resume_career():
    f = Form("이력서 · 경력직 중심형")
    f.title("이 력 서", "RESUME · 경력")
    f.person([["성 명"], ["생년월일", "연 락 처"], ["이 메 일", "희망 연봉"], ["주 소"]])
    f.sec("요약 (핵심 역량 3줄)"); f.box(120)
    f.sec("경력 사항 ①"); f.tall_row([["회 사 명", "근무 기간"], ["부서 / 직위", "퇴사 사유"]], "담당 업무\n및 성과", 430)
    f.new_page()
    f.sec("경력 사항 ②", before=0); f.tall_row([["회 사 명", "근무 기간"], ["부서 / 직위", "퇴사 사유"]], "담당 업무\n및 성과", 175)
    f.sec("경력 사항 ③"); f.tall_row([["회 사 명", "근무 기간"], ["부서 / 직위", "퇴사 사유"]], "담당 업무\n및 성과", 175)
    f.sec("학 력"); f.grid(["기 간", "학교명", "전공", "졸업 구분"], [22, 30, 30, 18], 2)
    f.sec("자격 · 면허 · 어학"); f.grid(["취득일", "자격 / 면허명", "발행 기관 / 점수"], [22, 46, 32], 3)
    f.sign(); return f


def resume_onepage():
    f = Form("이력서 · 한 장 심플형")
    f.hd("이력서")
    f.kv([["성 명", "연 락 처"], ["생년월일", "이 메 일"], ["주 소"], ["지원 분야"]], [92, 253, 92, 253])
    f.sec("학 력"); f.grid(["기 간", "학교명 / 전공", "비 고"], [24, 52, 24], 3)
    f.sec("경 력"); f.grid(["기 간", "회사 / 직위", "주요 업무"], [24, 30, 46], 5)
    f.sec("자격 · 교육 · 수상"); f.grid(["일 자", "내 용", "기 관"], [24, 50, 26], 4)
    f.sec("한 줄 소개"); f.box(66)
    f.sign(); return f


def resume_profile():
    f = Form("이력서 · 프로필 강조형", margins=(57, 57, 57, 57))
    f.cw = 680
    outer = make_table(f.doc, [230, 450], 1, border=None, cell_margin=(0, 150))
    row_height(outer.rows[0], 930, exact=True)
    left, right = outer.rows[0].cells
    shade(left, SOFT)
    left.width_px = 230 - 16
    # 왼쪽: 프로필
    ph = make_table(left, [150], 1, border=LINE)
    row_height(ph.rows[0], 190, exact=True)
    set_text(ph.rows[0].cells[0], "사진", 9, None, "9aa6b5", "center"); shade(ph.rows[0].cells[0], "FFFFFF")
    ph.alignment = WD_TABLE_ALIGNMENT.CENTER
    for title, labels in (("Profile", ["이름", "생년월일", "연락처", "이메일", "주소"]), ("Skill", ["1", "2", "3", "4"]), ("자격 · 어학", ["", "", ""])):
        p = para(left, title, 11, True, NAVY, before=18, after=4)
        para_border(p, "left", BLUE, 36, 6); p.paragraph_format.left_indent = Pt(7)
        t = make_table(left, [76, 134], len(labels), border=None)
        for r, lab in zip(t.rows, labels):
            row_height(r, 30)
            set_text(r.cells[0], lab, 9.5, True, NAVY)
            set_text(r.cells[1], "", 9.5)
            cell_borders(r.cells[1], bottom=(LINE, 6, "single"))
        if not labels[0]:
            for r in t.rows:
                r.cells[0].width = r.cells[0].width  # 라벨 칸 비움(자격·어학은 한 줄 전체 사용)
                r.cells[0].merge(r.cells[1])
                cell_borders(r.cells[0], bottom=(LINE, 6, "single"))
    # 오른쪽: 이력
    right.width_px = 450 - 16
    p = para(right, "이력서", 20, True, NAVY, after=6, spacing=4); para_border(p, "bottom", BLUE, 18, 4)
    def rsec(text):
        s = para(right, text, 11, True, NAVY, before=12, after=4, keep_next=True)
        para_border(s, "left", BLUE, 36, 6); s.paragraph_format.left_indent = Pt(7)
    rsec("한 줄 소개"); b = make_table(right, [434], 1); row_height(b.rows[0], 60)
    for title, labels, pct, n in (("경 력", ["기 간", "회사 / 직위", "주요 업무"], [26, 30, 44], 4), ("학 력", ["기 간", "학교 / 전공"], [30, 70], 2), ("활동 · 수상", ["일 자", "내 용"], [26, 74], 3)):
        rsec(title)
        w = [round(434 * x / 100) for x in pct]; w[-1] += 434 - sum(w)
        t = make_table(right, w, n + 1)
        for c, lab in zip(t.rows[0].cells, labels):
            shade(c, SOFT); set_text(c, lab, 9.5, True, NAVY, "center")
        for r in t.rows[1:]:
            row_height(r, 33)
    for c in (left, right):
        first = c.paragraphs[0]
        if not first.text.strip() and first._p.getnext() is not None:
            first._p.getparent().remove(first._p)
    return f


def _cover_head(f, title, rows):
    f.hd(title)
    f.kv(rows, [92, 253, 92, 253] if any(len(r) == 2 for r in rows) else [92, 598], row_px=30)


def cover_standard():
    f = Form("자기소개서 · 표준 4문항형")
    _cover_head(f, "자기소개서", [["성 명", "지원 분야"]])
    f.q(1, "성장 과정", "(600자 이내)"); f.box(240)
    f.q(2, "성격의 장점과 단점", "(600자 이내)"); f.box(240)
    f.q(3, "지원 동기", "(600자 이내)"); f.box(240)
    f.new_page()
    f.q(4, "입사 후 포부 및 목표", "(600자 이내)"); f.box(410)
    f.q(5, "기타 하고 싶은 말", "(자유)"); f.box(410)
    f.sign(False); return f


def cover_job():
    f = Form("자기소개서 · 직무 중심형")
    _cover_head(f, "자기소개서", [["지원 직무"]])
    f.q(1, "이 직무를 선택한 이유", "(500자 이내)"); f.box(210)
    f.q(2, "직무 관련 경험 · 활동", "(700자 이내)"); f.box(290)
    f.q(3, "내가 가진 핵심 역량 3가지", "(각 1~2문장)"); f.box(210)
    f.new_page()
    f.q(4, "문제를 해결했던 경험 (상황 → 행동 → 결과)", "(700자 이내)"); f.box(400)
    f.q(5, "입사 후 1년 목표와 성장 계획", "(500자 이내)"); f.box(370)
    f.sign(False); return f


def cover_motive():
    f = Form("자기소개서 · 지원동기·협업형")
    _cover_head(f, "자기소개서", [["성 명", "지원처"]])
    f.q(1, "지원 동기", "(700자 이내)"); f.box(260)
    f.q(2, "학교생활 · 대외활동에서 가장 기억에 남는 경험", "(700자 이내)"); f.box(260)
    f.q(3, "다른 사람과 협업하며 갈등을 풀었던 경험", "(500자 이내)"); f.box(170)
    f.new_page()
    f.q(4, "나를 표현하는 키워드 3가지와 이유", "(500자 이내)"); f.box(260)
    f.q(5, "입사 후 포부", "(500자 이내)"); f.box(260)
    f.q(6, "마지막으로 하고 싶은 말"); f.box(210)
    f.sign(False); return f


def cover_career():
    f = Form("경력기술서")
    _cover_head(f, "경력기술서", [["성 명", "지원 분야"]])
    f.q(1, "경력 요약", "(5줄 이내)"); f.box(220)
    f.q(2, "회사 ① 담당 업무와 성과", "(상황 · 과제 · 행동 · 결과)")
    f.tall_row([["회 사 명", "근무 기간"]], "담당 업무\n및 성과", 470)
    f.new_page()
    f.q(3, "회사 ② 담당 업무와 성과", "(상황 · 과제 · 행동 · 결과)")
    f.tall_row([["회 사 명", "근무 기간"]], "담당 업무\n및 성과", 290)
    f.q(4, "나의 강점과 보완하고 싶은 점", "(500자 이내)"); f.box(220)
    f.q(5, "지원 이유 · 앞으로의 계획", "(500자 이내)"); f.box(220)
    f.sign(False); return f


def cover_free():
    f = Form("자기소개서 · 자유 서술형")
    _cover_head(f, "자기소개서", [["제 목"], ["성 명", "지원 분야"]])
    para(f.doc, "작성일 : 20      .      .      ", 9, None, GRAY, "right", before=4, after=4)
    f.box(740)
    f.new_page()
    f.box(900)
    f.sign(False); return f


forms = {
    "resume-01-standard": resume_standard, "resume-02-newbie": resume_newbie, "resume-03-career": resume_career,
    "resume-04-onepage": resume_onepage, "resume-05-profile": resume_profile,
    "cover-01-standard": cover_standard, "cover-02-job": cover_job, "cover-03-motive": cover_motive,
    "cover-04-career": cover_career, "cover-05-free": cover_free,
}
