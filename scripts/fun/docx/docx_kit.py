"""Word(.docx) 만들기 공용 도구 — 이력서·자기소개서·편지지 생성 스크립트가 같이 씁니다.
모든 길이는 화면 기준 px(A4 = 794 x 1123)로 받아 Word 단위(twips/pt)로 바꿉니다.
"""
from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, RGBColor, Twips

FONT = "맑은 고딕"
PX_TW = 15  # 1px = 15 twips (96dpi)
A4_W_TW, A4_H_TW = 11906, 16838


def px(v):
    return int(round(v * PX_TW))


def pt(v_px):
    return Pt(v_px * 0.75)


def rgb(hexstr):
    return RGBColor.from_string(hexstr.upper().lstrip("#"))


def new_document(title, margins_px=(46, 52, 40, 52), author="반딧불이의 곳간"):
    """margins_px = (위, 오른쪽, 아래, 왼쪽). 기본 글꼴·문단 간격을 정리한 A4 문서를 돌려줍니다."""
    doc = Document()
    sec = doc.sections[0]
    sec.page_width, sec.page_height = Twips(A4_W_TW), Twips(A4_H_TW)
    sec.top_margin, sec.right_margin, sec.bottom_margin, sec.left_margin = (Twips(px(m)) for m in margins_px)
    sec.header_distance = sec.footer_distance = Twips(px(20))
    normal = doc.styles["Normal"]
    normal.font.name = FONT
    normal.font.size = Pt(10)
    normal.font.color.rgb = rgb("1d2733")
    rpr = normal.element.get_or_add_rPr()
    fonts = rpr.find(qn("w:rFonts"))
    if fonts is None:
        fonts = OxmlElement("w:rFonts")
        rpr.append(fonts)
    for a in ("w:ascii", "w:hAnsi", "w:eastAsia", "w:cs"):
        fonts.set(qn(a), FONT)
    pf = normal.paragraph_format
    pf.space_before = pf.space_after = Pt(0)
    pf.line_spacing_rule = WD_LINE_SPACING.SINGLE
    zoom = doc.settings.element.find(qn("w:zoom"))  # 기본 템플릿의 zoom 에 percent 가 없어 스키마 검사에 걸립니다
    if zoom is not None:
        zoom.attrib.pop(qn("w:val"), None)
        zoom.set(qn("w:percent"), "100")
    doc.core_properties.title = title
    doc.core_properties.author = author
    return doc


def run(par, text, size=None, bold=None, color=None, spacing=None):
    r = par.add_run(text)
    if size:
        r.font.size = Pt(size)
    if bold is not None:
        r.font.bold = bold
    if color:
        r.font.color.rgb = rgb(color)
    if spacing:
        rpr = r._r.get_or_add_rPr()
        sp = OxmlElement("w:spacing")
        sp.set(qn("w:val"), str(int(spacing * 20)))
        rpr.append(sp)
    return r


def para(container, text="", size=None, bold=None, color=None, align=None, before=0, after=0, spacing=None, keep_next=False):
    p = container.add_paragraph()
    if text:
        run(p, text, size, bold, color, spacing)
    if align == "center":
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    elif align == "right":
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p.paragraph_format.space_before, p.paragraph_format.space_after = Pt(before), Pt(after)
    p.paragraph_format.keep_with_next = keep_next
    return p


def para_border(p, side, color, size_eighths=8, space=1):
    ppr = p._p.get_or_add_pPr()
    bdr = ppr.find(qn("w:pBdr"))
    if bdr is None:
        bdr = OxmlElement("w:pBdr")
        ppr.append(bdr)
    el = OxmlElement(f"w:{side}")
    for k, v in (("val", "single"), ("sz", size_eighths), ("space", space), ("color", color.lstrip("#"))):
        el.set(qn(f"w:{k}"), str(v))
    bdr.append(el)


def exact_height(p, height_px):
    p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.EXACTLY
    p.paragraph_format.line_spacing = Pt(height_px * 0.75)


# ---------- 표 ----------
def make_table(container, widths_px, rows, border="b9c4d3", border_sz=4, cell_margin=(40, 80)):
    """칸 너비가 고정된 표. widths_px 합계 = 표 전체 너비."""
    t = container.add_table(rows=rows, cols=len(widths_px))
    t.alignment = WD_TABLE_ALIGNMENT.LEFT
    t.autofit = False
    tblpr = t._tbl.tblPr
    for tag in ("w:tblW", "w:tblLayout", "w:tblBorders", "w:tblCellMar"):
        old = tblpr.find(qn(tag))
        if old is not None:
            tblpr.remove(old)
    w = OxmlElement("w:tblW"); w.set(qn("w:w"), str(px(sum(widths_px)))); w.set(qn("w:type"), "dxa"); tblpr.append(w)
    lay = OxmlElement("w:tblLayout"); lay.set(qn("w:type"), "fixed"); tblpr.append(lay)
    if border:
        b = OxmlElement("w:tblBorders")
        for side in ("top", "left", "bottom", "right", "insideH", "insideV"):
            e = OxmlElement(f"w:{side}")
            for k, v in (("val", "single"), ("sz", border_sz), ("space", 0), ("color", border)):
                e.set(qn(f"w:{k}"), str(v))
            b.append(e)
        tblpr.append(b)
    m = OxmlElement("w:tblCellMar")
    for side, v in (("top", cell_margin[0]), ("left", cell_margin[1]), ("bottom", cell_margin[0]), ("right", cell_margin[1])):
        e = OxmlElement(f"w:{side}"); e.set(qn("w:w"), str(v)); e.set(qn("w:type"), "dxa"); m.append(e)
    tblpr.append(m)
    grid = t._tbl.tblGrid
    for gc, wpx in zip(grid.findall(qn("w:gridCol")), widths_px):
        gc.set(qn("w:w"), str(px(wpx)))
    for r in t.rows:
        for c, wpx in zip(r.cells, widths_px):
            c.width = Twips(px(wpx))
    return t


def row_height(row, height_px, exact=False):
    trpr = row._tr.get_or_add_trPr()
    h = OxmlElement("w:trHeight")
    h.set(qn("w:val"), str(px(height_px)))
    h.set(qn("w:hRule"), "exact" if exact else "atLeast")
    trpr.append(h)
    cant = OxmlElement("w:cantSplit")
    trpr.append(cant)


def shade(cell, fill):
    tcpr = cell._tc.get_or_add_tcPr()
    sh = OxmlElement("w:shd")
    sh.set(qn("w:val"), "clear"); sh.set(qn("w:color"), "auto"); sh.set(qn("w:fill"), fill.lstrip("#"))
    tcpr.append(sh)


def cell_borders(cell, **sides):
    """sides: top/left/bottom/right = None(없음) 또는 (색, 두께, 모양)"""
    tcpr = cell._tc.get_or_add_tcPr()
    b = tcpr.find(qn("w:tcBorders"))
    if b is None:
        b = OxmlElement("w:tcBorders"); tcpr.append(b)
    for side, spec in sides.items():
        e = OxmlElement(f"w:{side}")
        if spec is None:
            e.set(qn("w:val"), "nil")
        else:
            color, sz, val = (spec + ("single",))[:3] if len(spec) == 2 else spec
            e.set(qn("w:val"), val); e.set(qn("w:sz"), str(sz)); e.set(qn("w:space"), "0"); e.set(qn("w:color"), color.lstrip("#"))
        b.append(e)


def valign(cell, where="center"):
    tcpr = cell._tc.get_or_add_tcPr()
    v = OxmlElement("w:vAlign"); v.set(qn("w:val"), where); tcpr.append(v)


def set_text(cell, text, size=9.5, bold=False, color=None, align="left"):
    p = cell.paragraphs[0]
    p.alignment = {"left": WD_ALIGN_PARAGRAPH.LEFT, "center": WD_ALIGN_PARAGRAPH.CENTER, "right": WD_ALIGN_PARAGRAPH.RIGHT}[align]
    if text:
        run(p, text, size, bold, color)
    valign(cell, "center")
    return p


def footer_text(doc, text, color="9aa6b5", size=8):
    f = doc.sections[0].footer
    f.is_linked_to_previous = False
    p = f.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run(p, text, size, None, color)


def ensure_tail(doc):
    """본문이 표로 끝나면 Word 가 빈 문단을 강제로 붙여 빈 쪽이 생길 수 있어, 1pt 짜리 마지막 문단을 미리 둡니다."""
    body = doc.element.body
    last = [el for el in body if el.tag != qn("w:sectPr")][-1:]
    if last and last[0].tag == qn("w:tbl"):
        p = doc.add_paragraph()
        exact_height(p, 1)
        p.add_run().font.size = Pt(1)


# ---------- 저장 전 정리: Word 가 까다롭게 보는 XML 요소 순서·중복을 바로잡습니다 ----------
_ORDER = {
    "pPr": "pStyle keepNext keepLines pageBreakBefore framePr widowControl numPr suppressLineNumbers pBdr shd tabs suppressAutoHyphens kinsoku wordWrap overflowPunct topLinePunct autoSpaceDE autoSpaceDN bidi adjustRightInd snapToGrid spacing ind contextualSpacing mirrorIndents suppressOverlap jc textDirection textAlignment textboxTightWrap outlineLvl divId cnfStyle rPr sectPr pPrChange",
    "rPr": "rStyle rFonts b bCs i iCs caps smallCaps strike dstrike outline shadow emboss imprint noProof snapToGrid vanish webHidden color spacing w kern position sz szCs highlight u effect bdr shd fitText vertAlign rtl cs em lang eastAsianLayout specVanish oMath",
    "tcPr": "cnfStyle tcW gridSpan hMerge vMerge tcBorders shd noWrap tcMar textDirection tcFitText vAlign hideMark",
    "tblPr": "tblStyle tblpPr tblOverlap bidiVisual tblStyleRowBandSize tblStyleColBandSize tblW jc tblCellSpacing tblInd tblBorders shd tblLayout tblCellMar tblLook",
    "tcBorders": "top start left bottom end right insideH insideV tl2br tr2bl",
    "pBdr": "top left bottom right between bar",
}
_SINGLE = {"pPr", "rPr", "tcPr", "tblPr"}  # 같은 요소가 두 번 있으면 마지막 것만 남깁니다


def _normalize_tree(root):
    for el in root.iter():
        name = el.tag.split("}")[-1] if isinstance(el.tag, str) else ""
        if name not in _ORDER:
            continue
        order = _ORDER[name].split()
        kids = list(el)
        if name in _SINGLE:
            seen = {}
            for k in kids:
                seen[k.tag] = k
            kids = [k for k in kids if seen[k.tag] is k]
        kids.sort(key=lambda k: order.index(k.tag.split("}")[-1]) if k.tag.split("}")[-1] in order else len(order))
        for k in list(el):
            el.remove(k)
        for k in kids:
            el.append(k)


def save_document(doc, path):
    """꼬리 문단 정리 + XML 순서 정리 후 저장."""
    ensure_tail(doc)
    _normalize_tree(doc.element)
    for sec in doc.sections:
        for part in (sec.header, sec.footer):
            _normalize_tree(part._element)
    _normalize_tree(doc.styles.element)
    doc.save(str(path))
