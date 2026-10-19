"""계절 편지지 Word(.docx) 생성 — 그림을 쪽 배경으로 깔고, 받는 사람·날짜·보내는 사람과 본문을 바로 입력합니다.
입력 자료: scripts/fun/seasons/build.mjs 가 만든 meta.json(글쓰기 영역 위치)과 bg/<id>.jpg(글자를 뺀 배경 그림).
본문 줄 간격(44px)이 배경의 글쓰기 줄 간격과 같아서 글이 줄 위에 앉습니다.
"""
import copy
import json
from pathlib import Path
from docx.enum.text import WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
from docx.shared import Emu, Pt, Twips
from docx_kit import exact_height, new_document, px, rgb, run

GAP = 44  # 글쓰기 줄 간격(px)
PAGE_W, PAGE_H = 794, 1123


def load_meta(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


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


def _background(doc, jpg_path, name):
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
        f'<wp:docPr id="1" name="편지지 배경" descr="{name} 편지지 배경 그림"/><wp:cNvGraphicFramePr/></wp:anchor>')
    anchor.append(copy.deepcopy(inline.find(qn("a:graphic"))))
    inline.getparent().replace(inline, anchor)


def build(m, jpg_path):
    """m: meta.json 의 한 항목 {id, name, color, date, fields, rules, from}"""
    fx, fy, fw = m["fields"]
    rx, ry, rw, rows = m["rules"]
    rules_end = ry + rows * GAP
    # 위 여백 = 글쓰기 줄 시작 위치, 아래 여백 = 마지막 줄 끝(조금 여유) → 1쪽에 정확히 rows 줄이 들어가고 2쪽도 줄이 맞습니다
    doc = new_document(f"편지지 · {m['name']}", (ry, PAGE_W - rx - rw, PAGE_H - rules_end - 6, rx))
    doc.sections[0].header_distance = Twips(0)
    _background(doc, jpg_path, m["name"])
    c = m["color"]
    date = "날짜 :  20        년        월        일"
    _line(doc, "받는 사람 : ", date if m["date"] else None, fx, fy, fw, 36, c)
    if m["from"]:
        x, y, w, al = m["from"]
        _line(doc, "보내는 사람 : ", None, x, y, w, 36, c, al)
    # 본문 — 문단 하나(줄 간격 = 배경 줄 간격). 글이 길어지면 다음 쪽으로 이어집니다.
    body = doc.add_paragraph()
    exact_height(body, GAP)
    body.paragraph_format.widow_control = False
    r = body.add_run()
    r.font.size = Pt(13)
    r.font.color.rgb = rgb("333333")
    return doc
