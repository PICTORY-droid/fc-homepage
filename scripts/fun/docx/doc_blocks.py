"""이력서·자기소개서 양식이 같이 쓰는 Word 블록 — 글꼴 지정, 선·칸·줄 노트·글자 수 안내까지.
모든 길이는 px (A4 = 794 x 1123). docx_kit 의 저수준 도구 위에 얹은 얇은 층입니다."""
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, Twips

from docx_kit import (cell_borders, exact_height, make_table, new_document, para_border, px, rgb, row_height, save_document, shade,
                      valign)

AUTHOR = "반딧불이의 곳간"  # 파일 속성에만 남기고, 인쇄되는 쪽에는 넣지 않습니다.


def set_fonts(rpr_owner_el, name):
    rpr = rpr_owner_el.get_or_add_rPr()
    f = rpr.find(qn("w:rFonts"))
    if f is None:
        f = OxmlElement("w:rFonts"); rpr.insert(0, f)
    for a in ("w:ascii", "w:hAnsi", "w:eastAsia", "w:cs"):
        f.set(qn(a), name)


def new_doc(title, skin, margins=(46, 52, 40, 52)):
    doc = new_document(title, margins, author=AUTHOR)
    normal = doc.styles["Normal"]
    normal.font.name = skin["body"]
    set_fonts(normal.element, skin["body"])
    doc._skin = skin
    return doc


def fr(par, text, size=10, bold=None, color=None, font=None, spacing=None, italic=None):
    """글꼴(font)까지 지정하는 run. 한글(eastAsia)도 함께 맞춥니다."""
    r = par.add_run(text)
    r.font.size = Pt(size)
    if bold is not None:
        r.font.bold = bold
    if italic is not None:
        r.font.italic = italic
    if color:
        r.font.color.rgb = rgb(color)
    if font:
        set_fonts(r._r, font)
    if spacing:
        sp = OxmlElement("w:spacing"); sp.set(qn("w:val"), str(int(spacing * 20))); r._r.get_or_add_rPr().append(sp)
    return r


def _align(p, align):
    p.alignment = {"left": WD_ALIGN_PARAGRAPH.LEFT, "center": WD_ALIGN_PARAGRAPH.CENTER, "right": WD_ALIGN_PARAGRAPH.RIGHT, None: WD_ALIGN_PARAGRAPH.LEFT}[align]


def fp(container, text="", size=10, bold=None, color=None, align=None, before=0, after=0, font=None, spacing=None, keep_next=False, line=None):
    p = container.add_paragraph()
    if text:
        fr(p, text, size, bold, color, font, spacing)
    _align(p, align)
    p.paragraph_format.space_before, p.paragraph_format.space_after = Pt(before), Pt(after)
    p.paragraph_format.keep_with_next = keep_next
    if line:
        p.paragraph_format.line_spacing = line
    return p


def ct(cell, text, size=9.5, bold=None, color=None, align=None, font=None, before=0, after=0, spacing=None, line=None, where=None):
    """칸에 글 넣기(이어 붙이면 새 문단)."""
    first = cell.paragraphs[0]
    p = first if (len(cell.paragraphs) == 1 and not first.runs) else cell.add_paragraph()
    if text:
        fr(p, text, size, bold, color, font, spacing)
    _align(p, align)
    p.paragraph_format.space_before, p.paragraph_format.space_after = Pt(before), Pt(after)
    if line:
        p.paragraph_format.line_spacing = line
    if where:
        valign(cell, where)
    return p


def tab_right(p, width_px):
    p.paragraph_format.tab_stops.add_tab_stop(Twips(px(width_px)), WD_TAB_ALIGNMENT.RIGHT)


def rule(container, color, sz=6, before=0, after=0, side="bottom"):
    p = fp(container, "", 2, before=before, after=after)
    exact_height(p, 2)
    para_border(p, side, color, sz, 1)
    return p


def spacer(container, h_px=6):
    p = container.add_paragraph()
    exact_height(p, h_px)
    p.paragraph_format.space_before = p.paragraph_format.space_after = Pt(0)
    return p


def table(doc, widths, rows, border=None, bsz=4, margin=(40, 80)):
    return make_table(doc, widths, rows, border=border, border_sz=bsz, cell_margin=margin)


def borders(cell, color=None, sz=4, **sides):
    """cell_borders 의 간단판: sides=top/left/bottom/right → True(선), False(없음)"""
    spec = {}
    for k, v in sides.items():
        spec[k] = (color, sz) if v else None
    cell_borders(cell, **spec)


def no_borders(cell):
    cell_borders(cell, top=None, left=None, bottom=None, right=None)


def ruled(container, n, color, gap_px=30, width_px=None):
    """줄 노트 — 밑줄 문단 n개. 글을 쓰면 그 줄에 그대로 입력됩니다."""
    for _ in range(n):
        p = container.add_paragraph()
        exact_height(p, gap_px)
        p.paragraph_format.space_before = p.paragraph_format.space_after = Pt(0)
        para_border(p, "bottom", color, 4, 1)


def count_hint(cell_or_doc, text, color, size=8):
    p = cell_or_doc.add_paragraph()
    fr(p, text, size, None, color)
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    return p


def level_dots():
    return "○ ○ ○ ○ ○"


def save(doc, path):
    save_document(doc, path)
