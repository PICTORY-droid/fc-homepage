"""감성 편지지 10종 Word(.docx) 생성 — 그림을 쪽 배경으로 깔고, 받는 사람·날짜·보내는 사람과 본문을 바로 입력합니다.
배경 그림(JPG)은 scripts/fun/make-stationery-bg.mjs 가 받는 사람 등 글자만 뺀 것(글쓰기 줄은 그림에 포함)을 씁니다.
본문 줄 간격(44px)이 배경의 글쓰기 줄 간격과 같아서 글이 줄 위에 앉습니다.
"""
import copy
from docx.enum.text import WD_LINE_SPACING, WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
from docx.shared import Emu, Pt, Twips
from docx_kit import FONT, exact_height, new_document, px, rgb, run

GAP = 44  # 글쓰기 줄 간격(px)
PAGE_W, PAGE_H = 794, 1123

# id: 이름, 글자색, 날짜 줄 여부, 위치(px) — 위치는 scripts/fun/stationery-art.mjs 와 같은 값입니다.
#   fields = (x, y, w)  받는 사람(+날짜) 줄 / rules = (x, y, w, rows) 글쓰기 줄 / from_ = (x, y, w, 맞춤) 보내는 사람 줄
DESIGNS = {
    "01-airmail": dict(name="에어메일", color="6b5b4d", date=True, fields=(90, 190, 614), rules=(90, 250, 614, 17), from_=(90, 1010, 614, "right")),
    "02-stamps": dict(name="우표 콜라주", color="6b5b4d", date=False, fields=(70, 300, 654), rules=(70, 330, 654, 16), from_=(70, 1056, 654, "right")),
    "03-mailbox": dict(name="빨간 우체통", color="C4540A", date=True, fields=(96, 206, 602), rules=(96, 258, 602, 14), from_=(96, 880, 400, "left")),
    "04-postmark": dict(name="소인 엽서", color="6b5b4d", date=False, fields=(96, 230, 602), rules=(96, 262, 602, 17), from_=None),
    "05-sky": dict(name="하늘 편지", color="4a6b86", date=True, fields=(90, 340, 614), rules=(90, 392, 614, 15), from_=(90, 1054, 614, "right")),
    "06-flower": dict(name="꽃 편지", color="9a6a74", date=True, fields=(110, 240, 574), rules=(110, 296, 574, 15), from_=(170, 1000, 320, "left")),
    "07-kraft": dict(name="크래프트 포장지", color="7a5a34", date=False, fields=(100, 230, 594), rules=(100, 270, 594, 16), from_=(100, 996, 594, "right")),
    "08-night": dict(name="별밤 편지", color="47536f", date=False, fields=(104, 238, 586), rules=(104, 282, 586, 16), from_=(104, 1000, 586, "right")),
    "09-biker": dict(name="달려라 집배원", color="6b5b4d", date=True, fields=(80, 232, 634), rules=(80, 290, 634, 14), from_=(80, 930, 340, "left")),
    "10-simple": dict(name="심플 오렌지", color="888888", date=True, fields=(70, 150, 624), rules=(70, 262, 624, 18), from_=None, two_lines=True),
}


def _frame(p, x, y, w, h):
    """문단을 쪽 기준 고정 위치에 놓는 '틀'로 만듭니다(받는 사람·보내는 사람 줄)."""
    ppr = p._p.get_or_add_pPr()
    fr = OxmlElement("w:framePr")
    for k, v in (("w", px(w)), ("h", px(h)), ("hRule", "exact"), ("wrap", "around"), ("vAnchor", "page"), ("hAnchor", "page"), ("x", px(x)), ("y", px(y))):
        fr.set(qn(f"w:{k}"), str(v))
    ppr.insert(0, fr)


def _line(doc, left, right, x, y, w, h, color, align="left"):
    p = doc.add_paragraph()
    _frame(p, x, y, w, h)
    exact_height(p, h)
    if right:
        p.paragraph_format.tab_stops.add_tab_stop(Twips(px(w)), WD_TAB_ALIGNMENT.RIGHT)
    run(p, left, 12, True, color)
    if right:
        run(p, "\t" + right, 12, True, color)
    if align == "right" and not right:
        p.alignment = 2
    return p


def _background(doc, jpg_path):
    """그림을 쪽 전체 배경(글 뒤)으로 머리글에 고정합니다. 모든 쪽에 같은 배경이 깔립니다."""
    sec = doc.sections[0]
    hp = sec.header.paragraphs[0]
    exact_height(hp, 1)
    pic = hp.add_run().add_picture(str(jpg_path), width=Emu(7560000), height=Emu(10692000))
    inline = pic._inline
    anchor = parse_xml(
        f'<wp:anchor {nsdecls("wp", "a", "pic", "r")} distT="0" distB="0" distL="0" distR="0" simplePos="0" relativeHeight="0" '
        'behindDoc="1" locked="1" layoutInCell="1" allowOverlap="1">'
        '<wp:simplePos x="0" y="0"/>'
        '<wp:positionH relativeFrom="page"><wp:posOffset>0</wp:posOffset></wp:positionH>'
        '<wp:positionV relativeFrom="page"><wp:posOffset>0</wp:posOffset></wp:positionV>'
        '<wp:extent cx="7560000" cy="10692000"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:wrapNone/>'
        '<wp:docPr id="1" name="편지지 배경" descr="편지지 배경 그림"/><wp:cNvGraphicFramePr/></wp:anchor>')
    anchor.append(copy.deepcopy(inline.find(qn("a:graphic"))))
    inline.getparent().replace(inline, anchor)


def build(design_id, cfg, jpg_path):
    fx, fy, fw = cfg["fields"]
    rx, ry, rw, rows = cfg["rules"]
    rules_end = ry + rows * GAP
    # 위 여백 = 글쓰기 줄 시작 위치, 아래 여백 = 마지막 줄 끝(조금 여유) → 1쪽에 정확히 rows 줄이 들어가고 2쪽도 줄이 맞습니다
    doc = new_document(f"감성 편지지 · {cfg['name']}", (ry, PAGE_W - rx - rw, PAGE_H - rules_end - 6, rx))
    doc.sections[0].header_distance = Twips(0)
    _background(doc, jpg_path)
    c = cfg["color"]
    date = "날짜 :  20        년        월        일"
    if cfg.get("two_lines"):
        _line(doc, "받는 사람 : ", None, fx, fy, fw, 48, c)
        _line(doc, "보내는 사람 : ", date, fx, fy + 48, fw, 48, c)
    else:
        _line(doc, "받는 사람 : ", date if cfg["date"] else None, fx, fy, fw, 36, c)
    if cfg["from_"]:
        x, y, w, al = cfg["from_"]
        p = _line(doc, "보내는 사람 : ", None, x, y, w, 36, c, al)
        if al == "right":
            p.alignment = 2
    # 본문 — 문단 하나(줄 간격 = 배경 줄 간격). 글이 길어지면 다음 쪽으로 이어집니다.
    body = doc.add_paragraph()
    exact_height(body, GAP)
    body.paragraph_format.widow_control = False
    r = body.add_run()
    r.font.size = Pt(13)
    r.font.color.rgb = rgb("333333")
    return doc
