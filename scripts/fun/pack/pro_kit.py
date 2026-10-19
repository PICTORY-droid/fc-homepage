"""PPT 전문가용 도구 — 테마·마스터·레이아웃·자리표시자·구역·전환·애니메이션·발표자 노트·차트·하이퍼링크까지 PowerPoint 의 기본 기능으로 만듭니다.

- 색은 모두 '테마 색'으로 지정합니다 → [디자인 > 변형 > 색] 한 번으로 덱 전체 색이 바뀝니다.
- 글꼴은 테마 글꼴(제목/본문)을 따릅니다 → [디자인 > 변형 > 글꼴].
- 장식은 슬라이드 마스터(레이아웃)에 두고, 슬라이드에는 내용만 있습니다 → 레이아웃을 고치면 모든 쪽이 함께 바뀝니다.
- 제목·소제목·사진·쪽 번호는 진짜 자리표시자라 개요 보기, 슬라이드 쇼 탐색, 접근성 도구에서 인식됩니다.
- 사진 자리는 '그림 자리표시자'(아이콘을 눌러 사진 삽입, 자동으로 모양에 맞춰 잘림)입니다.
"""
import contextlib
import uuid

from lxml import etree
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.dml import MSO_LINE, MSO_THEME_COLOR as TC
from pptx.enum.shapes import MSO_SHAPE as SH, PP_PLACEHOLDER
from pptx.enum.text import MSO_ANCHOR, MSO_AUTO_SIZE, PP_ALIGN
from pptx.opc.constants import RELATIONSHIP_TYPE as RT
from pptx.oxml.ns import qn
from pptx.util import Inches, Pt

A = "http://schemas.openxmlformats.org/drawingml/2006/main"
P = "http://schemas.openxmlformats.org/presentationml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NSDECL = f'xmlns:a="{A}" xmlns:p="{P}" xmlns:r="{R}"'
AUTHOR = "우체국보험 상담 안내"

# 색 이름표 → (테마 색, 밝기). 모든 도형·글자는 이 이름표로만 색을 정합니다.
TOK = {
    "main": (TC.ACCENT_1, 0), "accent": (TC.ACCENT_2, 0), "deep": (TC.TEXT_2, 0), "deep2": (TC.ACCENT_3, 0),
    "soft": (TC.ACCENT_4, 0), "pale": (TC.BACKGROUND_2, 0), "white": (TC.BACKGROUND_1, 0), "ink": (TC.TEXT_1, 0),
    "tint": (TC.ACCENT_1, 0.8), "mist": (TC.ACCENT_1, 0.9), "atint": (TC.ACCENT_2, 0.8), "mute": (TC.TEXT_1, 0.45),
    "gold": (TC.ACCENT_5, 0), "sky": (TC.ACCENT_6, 0),
}
SCHEME = {"main": ("accent1", None), "accent": ("accent2", None), "deep": ("tx2", None), "deep2": ("accent3", None),
          "soft": ("accent4", None), "pale": ("bg2", None), "white": ("bg1", None), "ink": ("tx1", None),
          "tint": ("accent1", (20000, 80000)), "mist": ("accent1", (10000, 90000)), "atint": ("accent2", (20000, 80000)),
          "mute": ("tx1", (55000, 45000)), "gold": ("accent5", None), "sky": ("accent6", None)}

GEOM = {  # 사진·장식 모양 이름 → (도형 종류, prstGeom 이름, 조정값)
    "rect": (SH.RECTANGLE, "rect", {}),
    "round": (SH.ROUNDED_RECTANGLE, "roundRect", {"adj": 6000}),
    "pill": (SH.ROUNDED_RECTANGLE, "roundRect", {"adj": 50000}),
    "oval": (SH.OVAL, "ellipse", {}),
    "arch": (SH.ROUND_2_SAME_RECTANGLE, "round2SameRect", {"adj1": 50000, "adj2": 0}),
    "leaf": (SH.ROUND_2_DIAG_RECTANGLE, "round2DiagRect", {"adj1": 36000, "adj2": 0}),
    "snip": (SH.SNIP_2_DIAG_RECTANGLE, "snip2DiagRect", {"adj1": 0, "adj2": 16667}),
}


def clr_xml(tok, alpha=None):
    """색 이름표 → <a:schemeClr> 또는 <a:srgbClr> XML 문자열"""
    if tok.startswith("#"):
        inner = f'<a:alpha val="{int(alpha * 1000)}"/>' if alpha is not None else ""
        return f'<a:srgbClr val="{tok[1:].upper()}">{inner}</a:srgbClr>'
    val, lum = SCHEME[tok]
    inner = f'<a:lumMod val="{lum[0]}"/><a:lumOff val="{lum[1]}"/>' if lum else ""
    if alpha is not None:
        inner += f'<a:alpha val="{int(alpha * 1000)}"/>'
    return f'<a:schemeClr val="{val}">{inner}</a:schemeClr>'


def fill_xml(spec):
    """채우기 설명 → XML. spec: 색 이름표 | ('grad', 색1, 색2, 각도) | ('patt', 무늬, 앞색, 뒷색) | ('alpha', 색, 투명도%)"""
    if spec is None:
        return "<a:noFill/>"
    if isinstance(spec, str):
        return f"<a:solidFill>{clr_xml(spec)}</a:solidFill>"
    kind = spec[0]
    if kind == "alpha":
        return f"<a:solidFill>{clr_xml(spec[1], spec[2])}</a:solidFill>"
    if kind == "grad":
        return (f'<a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0">{clr_xml(spec[1])}</a:gs><a:gs pos="100000">{clr_xml(spec[2])}</a:gs></a:gsLst>'
                f'<a:lin ang="{int(spec[3] * 60000)}" scaled="0"/></a:gradFill>')
    if kind == "patt":
        return f'<a:pattFill prst="{spec[1]}"><a:fgClr>{clr_xml(spec[2])}</a:fgClr><a:bgClr>{clr_xml(spec[3])}</a:bgClr></a:pattFill>'
    raise ValueError(spec)


def set_color(cf, tok):
    """python-pptx ColorFormat 에 색 이름표 적용"""
    if tok.startswith("#"):
        cf.rgb = RGBColor.from_string(tok[1:].upper())
        return
    tc, br = TOK[tok]
    cf.theme_color = tc
    if br:
        cf.brightness = br


def _el(xml):
    return etree.fromstring(xml)


SHADOW = {
    "soft": (14, 3, 9), "lift": (26, 8, 14), "thin": (6, 1.5, 8), "glow": (22, 0, 18),
}


def shadow_xml(kind):
    blur, dist, alpha = SHADOW[kind]
    return (f'<a:effectLst><a:outerShdw blurRad="{int(blur * 12700)}" dist="{int(dist * 12700)}" dir="5400000" algn="t" rotWithShape="0">'
            f'{clr_xml("deep", alpha)}</a:outerShdw></a:effectLst>')


class Pro:
    """한 개의 PPT 파일."""

    def __init__(self, pal, size="wide", title="PPT", subject="", keywords="", fonts=("Georgia", "맑은 고딕")):
        self.pal = pal
        self.prs = Presentation()
        self.W, self.H = (13.333, 7.5) if size == "wide" else (7.5, 7.5)
        self.wide = size == "wide"
        self._resize()
        self._patch_theme(title, fonts)
        cp = self.prs.core_properties
        cp.author, cp.title, cp.subject, cp.keywords = AUTHOR, title, subject, keywords
        cp.comments, cp.category, cp.language = "자유롭게 편집해서 사용하세요.", "템플릿", "ko-KR"
        self.cont = None
        self.pfill = "soft"  # 사진 자리 바탕색(배경이 같은 색이면 Deck 이 바꿉니다)
        self.s = None
        self.sections = []  # (구역 이름, 시작 슬라이드 번호)
        self.layouts = {}
        self._tmp = None

    # ── 기본 준비 ─────────────────────────────────────────
    def _resize(self):
        old_w, old_h = self.prs.slide_width, self.prs.slide_height
        self.prs.slide_width, self.prs.slide_height = Inches(self.W), Inches(self.H)
        sz = self.prs.part._element.find(qn("p:sldSz"))
        if sz is not None and "type" in sz.attrib:
            del sz.attrib["type"]  # 16:9 · 1:1 인데 '4:3' 이라고 적혀 있으면 안 되므로
        fx, fy = self.prs.slide_width / old_w, self.prs.slide_height / old_h
        m = self.prs.slide_master
        for shp in m.shapes:
            if shp.left is not None:
                shp.left, shp.width = int(shp.left * fx), int(shp.width * fx)
                shp.top, shp.height = int(shp.top * fy), int(shp.height * fy)

    def _patch_theme(self, name, fonts):
        part = self.prs.slide_master.part.part_related_by(RT.THEME)
        root = etree.fromstring(part.blob)
        p = self.pal
        root.set("name", name)
        cs = root.find(f".//{{{A}}}clrScheme")
        cs.set("name", name)
        clr = {"dk1": p["ink"], "lt1": "#FFFFFF", "dk2": p["deep"], "lt2": p["bg"], "accent1": p["main"], "accent2": p["accent"],
               "accent3": p["deep2"], "accent4": p["soft"], "accent5": p["gold"], "accent6": p["sky"], "hlink": p["deep"], "folHlink": p["deep2"]}
        for tag, val in clr.items():
            el = root.find(f".//{{{A}}}{tag}")
            for ch in list(el):
                el.remove(ch)
            etree.SubElement(el, f"{{{A}}}srgbClr").set("val", val.lstrip("#").upper())
        fs = root.find(f".//{{{A}}}fontScheme")
        fs.set("name", name)
        major_latin, ea = fonts
        for tag, lat, kr in (("majorFont", major_latin, ea), ("minorFont", "맑은 고딕", "맑은 고딕")):
            f = fs.find(f"{{{A}}}{tag}")
            f.find(f"{{{A}}}latin").set("typeface", lat)
            f.find(f"{{{A}}}ea").set("typeface", kr)
        part._blob = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)

    # ── 레이아웃(마스터) 만들기 ────────────────────────────
    def begin_layouts(self):
        """쓰지 않는 레이아웃을 지우고 5개만 남깁니다: 표지·본문·본문(사진)·한 문장·마무리"""
        prs = self.prs
        lays = list(prs.slide_layouts)
        keep = {0: "표지", 1: "본문", 2: "마무리", 5: "본문 + 사진", 6: "한 문장"}
        self._tmp = prs.slides.add_slide(lays[6])
        for k, lay in enumerate(lays):
            if k not in keep:
                prs.slide_layouts.remove(lay)
        for k, nm in keep.items():
            lay = lays[k]
            lay._element.find(qn("p:cSld")).set("name", nm)
            if "type" in lay._element.attrib:
                del lay._element.attrib["type"]
            lay._element.set("userDrawn", "1")
            self.layouts[{"표지": "cover", "본문": "body", "마무리": "closing", "본문 + 사진": "photo", "한 문장": "quote"}[nm]] = lay
        m = self.prs.slide_master
        self._set_bg(m._element.find(qn("p:cSld")), "pale")

    def end_layouts(self):
        prs = self.prs
        sid = prs.slides._sldIdLst[0]
        prs.part.drop_rel(sid.rId)
        prs.slides._sldIdLst.remove(sid)
        self._tmp = None

    @staticmethod
    def _set_bg(csld, spec):
        old = csld.find(qn("p:bg"))
        if old is not None:
            csld.remove(old)
        bg = _el(f'<p:bg {NSDECL}><p:bgPr>{fill_xml(spec)}<a:effectLst/></p:bgPr></p:bg>')
        csld.insert(0, bg)

    def layout_begin(self, key, bg):
        """레이아웃 하나를 비우고 배경을 정한 뒤, 장식을 그릴 준비를 합니다."""
        lay = self.layouts[key]
        tree = lay.shapes._spTree
        for ch in list(tree)[2:]:
            tree.remove(ch)
        self._set_bg(lay._element.find(qn("p:cSld")), bg)
        # 임시 슬라이드의 도형 목록을 비우고 거기에 그립니다
        t = self._tmp.shapes._spTree
        for ch in list(t)[2:]:
            t.remove(ch)
        self.s = self._tmp
        self.cont = self._tmp.shapes
        self._lay = lay
        self._next_id = 100

    def layout_end(self):
        """임시 슬라이드에 그린 장식을 레이아웃으로 옮깁니다."""
        t = self._tmp.shapes._spTree
        tree = self._lay.shapes._spTree
        for ch in list(t)[2:]:
            tree.append(ch)
        self.cont = None

    def ph(self, ph_type, idx, name, x, y, w, h, sz=14, color="ink", bold=False, algn="l", anchor="ctr", major=False, spc=0,
           prompt="", caps=False, geom=None, rot=0, line=None, lnspc=110, vert=None, mute_fill=None):
        """레이아웃에 자리표시자(제목·소제목·본문·사진·쪽 번호)를 놓습니다. 글꼴·크기·색이 여기 정해져 슬라이드가 물려받습니다."""
        self._next_id += 1
        ph_attr = {"title": '<p:ph type="title"/>', "ctrTitle": '<p:ph type="ctrTitle"/>',
                   "sub": f'<p:ph type="subTitle" idx="{idx}"/>', "body": f'<p:ph type="body" sz="quarter" idx="{idx}"/>',
                   "pic": f'<p:ph type="pic" sz="quarter" idx="{idx}"/>', "num": f'<p:ph type="sldNum" sz="quarter" idx="{idx}"/>'}[ph_type]
        font = '<a:latin typeface="+mj-lt"/><a:ea typeface="+mj-ea"/>' if major else ""
        e = int(Inches(1) * 0)  # 자리 맞춤 여백은 아래 bodyPr 에서
        gx = ""
        if geom:
            _, prst, adj = GEOM[geom]
            gd = "".join(f'<a:gd name="{k}" fmla="val {v}"/>' for k, v in adj.items())
            gx = f'<a:prstGeom prst="{prst}"><a:avLst>{gd}</a:avLst></a:prstGeom>'
        fl = fill_xml(mute_fill) if ph_type == "pic" else "<a:noFill/>"
        ln = f'<a:ln w="12700">{fill_xml(line)}</a:ln>' if line else ""
        caps_attr = ' cap="all"' if caps else ""
        vert_attr = f' vert="{vert}"' if vert else ""
        rotattr = f' rot="{int(rot * 60000)}"' if rot else ""
        body = "<a:fld id=\"{%s}\" type=\"slidenum\"><a:rPr lang=\"en-US\"/><a:t>‹#›</a:t></a:fld>" % str(uuid.uuid4()).upper() if ph_type == "num" else f'<a:r><a:rPr lang="ko-KR"/><a:t>{prompt}</a:t></a:r>'
        xml = (f'<p:sp {NSDECL}><p:nvSpPr><p:cNvPr id="{self._next_id}" name="{name}"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>'
               f'<p:nvPr>{ph_attr}</p:nvPr></p:nvSpPr><p:spPr><a:xfrm{rotattr}><a:off x="{int(Inches(x))}" y="{int(Inches(y))}"/>'
               f'<a:ext cx="{int(Inches(w))}" cy="{int(Inches(h))}"/></a:xfrm>{gx}{fl}{ln}</p:spPr>'
               f'<p:txBody><a:bodyPr lIns="45720" rIns="45720" tIns="27432" bIns="27432" anchor="{anchor}"{vert_attr}><a:normAutofit/></a:bodyPr>'
               f'<a:lstStyle><a:lvl1pPr marL="0" indent="0" algn="{algn}"><a:lnSpc><a:spcPct val="{lnspc * 1000}"/></a:lnSpc><a:spcBef><a:spcPts val="0"/></a:spcBef><a:buNone/>'
               f'<a:defRPr sz="{int(sz * 100)}" b="{1 if bold else 0}" spc="{spc}"{caps_attr}><a:solidFill>{clr_xml(color)}</a:solidFill>{font}</a:defRPr></a:lvl1pPr></a:lstStyle>'
               f'<a:p>{body}</a:p></p:txBody></p:sp>')
        self._lay.shapes._spTree.append(_el(xml))

    # ── 슬라이드 ──────────────────────────────────────────
    def add(self, key, title=None, label=None, sub=None, extra=None, notes=None, section=None, vword=None):
        """레이아웃 key 로 새 쪽을 만듭니다. 제목·소제목은 자리표시자에 글자만 넣습니다."""
        lay = self.layouts[key]
        s = self.prs.slides.add_slide(lay)
        self.s, self.cont = s, s.shapes
        if section:
            self.sections.append((section, len(self.prs.slides)))
        for shp in list(s.placeholders):
            t = shp.placeholder_format.type
            idx = shp.placeholder_format.idx
            if t in (PP_PLACEHOLDER.TITLE, PP_PLACEHOLDER.CENTER_TITLE):
                want = title
            elif t == PP_PLACEHOLDER.SUBTITLE:
                want = sub
            elif idx in (12, 30) and t == PP_PLACEHOLDER.BODY:
                want = vword
            elif idx == 10:
                want = label
            elif idx == 11:
                want = extra
            else:
                continue  # 그림 자리표시자는 photo_slot 이 처리
            if want is None:
                shp._element.getparent().remove(shp._element)
            else:
                self._ph_text(shp, want)
        if lay.shapes._spTree.xpath('.//p:ph[@type="sldNum"]') and key in ("body", "photo", "quote"):
            self._add_slide_number(s, lay)
        if notes:
            s.notes_slide.notes_text_frame.text = notes
        return s

    def _add_slide_number(self, s, lay):
        src = lay.shapes._spTree.xpath('.//p:sp[p:nvSpPr/p:nvPr/p:ph[@type="sldNum"]]')[0]
        idx = src.xpath(".//p:ph")[0].get("idx")
        sid = max([int(x) for x in s.shapes._spTree.xpath(".//p:cNvPr/@id")] + [1]) + 1
        xml = (f'<p:sp {NSDECL}><p:nvSpPr><p:cNvPr id="{sid}" name="쪽 번호"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>'
               f'<p:nvPr><p:ph type="sldNum" sz="quarter" idx="{idx}"/></p:nvPr></p:nvSpPr><p:spPr/>'
               f'<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:fld id="{{{str(uuid.uuid4()).upper()}}}" type="slidenum"><a:rPr lang="en-US"/><a:t>‹#›</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>')
        s.shapes._spTree.append(_el(xml))

    @staticmethod
    def _ph_text(shp, text):
        tf = shp.text_frame
        lines = text if isinstance(text, (list, tuple)) else [text]
        for k, line in enumerate(lines):
            para = tf.paragraphs[0] if k == 0 else tf.add_paragraph()
            r = para.add_run()
            r.text = line
            r._r.get_or_add_rPr().set("lang", "ko-KR")

    def photo_slot(self, idx, x, y, w, h, geom="round", label="사진을 넣어 주세요", rot=0, descr="사진 자리 — 아이콘을 누르면 사진을 넣을 수 있어요", fill=None):
        """그림 자리표시자(idx)를 원하는 자리·모양으로 옮기고, 비었을 때 보이는 연한 바탕을 깝니다."""
        ph = None
        for shp in self.s.placeholders:
            if shp.placeholder_format.idx == idx:
                ph = shp
        assert ph is not None, f"그림 자리표시자 {idx} 없음"
        kind, prst, adj = GEOM[geom]
        # 비었을 때(그리고 미리보기에서) 보이는 바탕 — 사진을 넣으면 사진이 이 위를 덮습니다
        base = self.shape(kind, x, y, w, h, fill=fill or self.pfill, rot=rot, name=f"사진 바탕 {idx - 12}", adj=adj, text=label, tsize=11 if self.wide else 10, tcolor="mute")
        tree = ph._element.getparent()
        tree.remove(base._element)
        tree.insert(list(tree).index(ph._element), base._element)  # 바탕이 자리표시자 아래에 오도록
        ph.left, ph.top, ph.width, ph.height = Inches(x), Inches(y), Inches(w), Inches(h)
        sp = ph._element.spPr
        for old in sp.findall(qn("a:prstGeom")):
            sp.remove(old)
        gd = "".join(f'<a:gd name="{k}" fmla="val {v}"/>' for k, v in adj.items())
        geo = _el(f'<a:prstGeom {NSDECL} prst="{prst}"><a:avLst>{gd}</a:avLst></a:prstGeom>')
        sp.find(qn("a:xfrm")).addnext(geo)
        if rot:
            sp.find(qn("a:xfrm")).set("rot", str(int(rot * 60000)))
        ph._element.nvSpPr.cNvPr.set("descr", descr)
        return ph

    def drop_unused_pics(self):
        """자리를 정하지 않은 그림 자리표시자를 지웁니다."""
        for shp in list(self.s.placeholders):
            if shp.placeholder_format.type == PP_PLACEHOLDER.PICTURE and shp._element.spPr.find(qn("a:xfrm")) is None:
                shp._element.getparent().remove(shp._element)

    # ── 도형·글 ──────────────────────────────────────────
    def shape(self, kind, x, y, w, h, fill="main", line=None, lw=1.0, rot=0, dash=None, name=None, adj=None, alpha=None,
              shadow=None, descr=None, text=None, tsize=12, tcolor="ink", tbold=False, talign="c", flip=None, anchor="m"):
        shp = self.cont.add_shape(kind, Inches(x), Inches(y), Inches(w), Inches(h))
        el = shp._element
        st = el.find(qn("p:style"))
        if st is not None:
            el.remove(st)
        sp = el.spPr
        for tag in ("a:solidFill", "a:noFill", "a:gradFill", "a:pattFill", "a:ln"):
            for old in sp.findall(qn(tag)):
                sp.remove(old)
        f = fill if alpha is None or not isinstance(fill, str) else ("alpha", fill, alpha)
        sp.append(_el(f"<root {NSDECL}>{fill_xml(f)}</root>")[0])
        ln = f'<a:ln {NSDECL} w="{int(lw * 12700)}">{fill_xml(line)}' if line else f'<a:ln {NSDECL}><a:noFill/>'
        if line and dash:
            ln += f'<a:prstDash val="{dash}"/>'
        ln += "</a:ln>"
        sp.append(_el(ln))
        if shadow:
            sp.append(_el(shadow_xml(shadow).replace("<a:effectLst>", f"<a:effectLst {NSDECL}>")))
        if rot:
            shp.rotation = rot
        if adj:
            gd = sp.find(qn("a:prstGeom"))
            av = gd.find(qn("a:avLst"))
            if av is None:
                av = etree.SubElement(gd, qn("a:avLst"))
            for k, v in adj.items():
                g = etree.SubElement(av, qn("a:gd"))
                g.set("name", k); g.set("fmla", f"val {int(v)}")
        if flip:
            xf = sp.find(qn("a:xfrm"))
            if "v" in flip:
                xf.set("flipV", "1")
            if "h" in flip:
                xf.set("flipH", "1")
        if name:
            shp.name = name
        if descr:
            el.nvSpPr.cNvPr.set("descr", descr)
        if text is not None:
            self._fill_text(shp.text_frame, text, tsize, tbold, tcolor, talign, anchor, 1.1)
        return shp

    def freeform(self, pts, fill="main", line=None, lw=1.0, closed=True, name=None, alpha=None, shadow=None):
        """꼭짓점 목록(인치)으로 자유 도형을 그립니다."""
        fb = self.cont.build_freeform(Inches(pts[0][0]), Inches(pts[0][1]))
        fb.add_line_segments([(Inches(a), Inches(b)) for a, b in pts[1:]], close=closed)
        shp = fb.convert_to_shape()
        el = shp._element
        st = el.find(qn("p:style"))
        if st is not None:
            el.remove(st)
        sp = el.spPr
        for tag in ("a:solidFill", "a:noFill", "a:ln"):
            for old in sp.findall(qn(tag)):
                sp.remove(old)
        f = fill if alpha is None or not isinstance(fill, str) else ("alpha", fill, alpha)
        sp.append(_el(f"<root {NSDECL}>{fill_xml(f)}</root>")[0])
        sp.append(_el(f'<a:ln {NSDECL} w="{int(lw * 12700)}">{fill_xml(line)}</a:ln>' if line else f'<a:ln {NSDECL}><a:noFill/></a:ln>'))
        if shadow:
            sp.append(_el(shadow_xml(shadow).replace("<a:effectLst>", f"<a:effectLst {NSDECL}>")))
        if name:
            shp.name = name
        return shp

    def line(self, x1, y1, x2, y2, color="main", lw=1.0, dash=None, name=None, head=None, tail=None):
        c = self.cont.add_connector(1, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
        el = c._element
        st = el.find(qn("p:style"))
        if st is not None:
            el.remove(st)
        sp = el.spPr
        for old in sp.findall(qn("a:ln")):
            sp.remove(old)
        extra = (f'<a:prstDash val="{dash}"/>' if dash else "") + (f'<a:headEnd type="{head}"/>' if head else "") + (f'<a:tailEnd type="{tail}"/>' if tail else "")
        sp.append(_el(f'<a:ln {NSDECL} w="{int(lw * 12700)}" cap="rnd">{fill_xml(color)}{extra}</a:ln>'))
        if name:
            c.name = name
        return c

    def text(self, x, y, w, h, content, size=14, bold=False, color="ink", align="l", anchor="t", spacing=1.2, major=False, spc=None,
             vert=None, italic=False, bullet=False, name=None, space_after=0, caps=False, alpha=None):
        tb = self.cont.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
        if name:
            tb.name = name
        self._fill_text(tb.text_frame, content, size, bold, color, align, anchor, spacing, major, spc, vert, italic, bullet, space_after, caps)
        return tb

    def _fill_text(self, tf, content, size, bold, color, align, anchor, spacing=1.2, major=False, spc=None, vert=None, italic=False,
                   bullet=False, space_after=0, caps=False):
        tf.word_wrap = True
        tf.auto_size = MSO_AUTO_SIZE.NONE
        tf.margin_left = tf.margin_right = Inches(0.05)
        tf.margin_top = tf.margin_bottom = Inches(0.03)
        tf.vertical_anchor = {"t": MSO_ANCHOR.TOP, "m": MSO_ANCHOR.MIDDLE, "b": MSO_ANCHOR.BOTTOM}[anchor]
        if vert:
            tf._txBody.find(qn("a:bodyPr")).set("vert", vert)
        lines = content if isinstance(content, (list, tuple)) else [content]
        for k, line in enumerate(lines):
            para = tf.paragraphs[0] if k == 0 else tf.add_paragraph()
            para.alignment = {"l": PP_ALIGN.LEFT, "c": PP_ALIGN.CENTER, "r": PP_ALIGN.RIGHT}[align]
            para.line_spacing = spacing
            if space_after:
                para.space_after = Pt(space_after)
            run = para.add_run()
            run.text = line
            f = run.font
            f.size, f.bold, f.italic = Pt(size), bold, italic
            set_color(f.color, color)
            rPr = run._r.get_or_add_rPr()
            rPr.set("lang", "ko-KR")
            if spc is not None:
                rPr.set("spc", str(int(spc)))
            if caps:
                rPr.set("cap", "all")
            if major:
                etree.SubElement(rPr, qn("a:latin")).set("typeface", "+mj-lt")
                etree.SubElement(rPr, qn("a:ea")).set("typeface", "+mj-ea")
            if bullet:
                pPr = para._p.get_or_add_pPr()
                pPr.set("marL", "228600"); pPr.set("indent", "-228600")
                bc = etree.SubElement(pPr, qn("a:buClr")); bc.append(_el(clr_xml("main").replace("<a:schemeClr", f"<a:schemeClr xmlns:a=\"{A}\"", 1)))
                etree.SubElement(pPr, qn("a:buFont")).set("typeface", "Arial")
                etree.SubElement(pPr, qn("a:buChar")).set("char", "•")

    @contextlib.contextmanager
    def group(self, name, descr=None):
        """도형 여러 개를 하나의 그룹으로 묶습니다(선택 창에 이름이 보이고, 애니메이션도 한 덩어리로 움직입니다)."""
        g = self.cont.add_group_shape()
        g.name = name
        if descr:
            g._element.nvGrpSpPr.cNvPr.set("descr", descr)
        prev = self.cont
        self.cont = g.shapes
        try:
            yield g
        finally:
            self.cont = prev

    # ── 표·차트 ──────────────────────────────────────────
    def table(self, x, y, w, rows, col_w=None, row_h=0.45, size=12, head=True, first_col=False, name="표", head_fill="main", head_color="ink", zebra=True, line="soft"):
        n, m = len(rows), len(rows[0])
        gf = self.s.shapes.add_table(n, m, Inches(x), Inches(y), Inches(w), Inches(row_h * n))
        gf.name = name
        tbl = gf.table
        tbl.first_row, tbl.horz_banding = head, False
        tblPr = tbl._tbl.tblPr
        sid = tblPr.find(qn("a:tableStyleId"))
        if sid is not None:
            sid.text = "{2D5ABB26-0587-4C30-8999-92F81FD0307C}"  # 스타일 없음 · 격자 없음 → 아래 칸 서식이 그대로 보임
        cw = col_w or [w / m] * m
        for j, v in enumerate(cw):
            tbl.columns[j].width = Inches(v)
        for i, row in enumerate(rows):
            tbl.rows[i].height = Inches(row_h)
            for j, v in enumerate(row):
                c = tbl.cell(i, j)
                c.margin_left = c.margin_right = Inches(0.1)
                c.vertical_anchor = MSO_ANCHOR.MIDDLE
                is_head = head and i == 0
                fill = head_fill if is_head else ("white" if (i % 2 == (1 if head else 0)) or not zebra else "mist")
                tcPr = c._tc.get_or_add_tcPr()
                for k, tag in enumerate(("lnL", "lnR", "lnT", "lnB")):
                    if tag in ("lnL", "lnR"):
                        ln = _el(f'<a:{tag} {NSDECL} w="0"><a:noFill/></a:{tag}>')
                    else:
                        ln = _el(f'<a:{tag} {NSDECL} w="9525">{fill_xml(line)}</a:{tag}>')
                    tcPr.insert(k, ln)
                tcPr.append(_el(f"<root {NSDECL}>{fill_xml(fill)}</root>")[0])
                tf = c.text_frame
                tf.word_wrap = True
                para = tf.paragraphs[0]
                para.alignment = PP_ALIGN.CENTER if (j > 0 or is_head) and not (first_col and j == 0 and not is_head) else PP_ALIGN.LEFT
                run = para.add_run()
                run.text = v
                run.font.size = Pt(size)
                run.font.bold = is_head or (first_col and j == 0)
                set_color(run.font.color, head_color if is_head else ("deep" if first_col and j == 0 else "ink"))
                run._r.get_or_add_rPr().set("lang", "ko-KR")
        return gf

    def chart(self, kind, x, y, w, h, cats, series, size=11, legend=True, name="차트", numfmt=None, labels=True, doughnut_hole=62):
        """진짜 차트(데이터 시트가 들어 있어 우클릭 > 데이터 편집으로 수정). 색은 테마 색을 따릅니다."""
        from pptx.chart.data import CategoryChartData
        from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION, XL_LABEL_POSITION
        cd = CategoryChartData()
        cd.categories = cats
        for nm, vals in series:
            cd.add_series(nm, vals)
        ct = {"col": XL_CHART_TYPE.COLUMN_CLUSTERED, "line": XL_CHART_TYPE.LINE_MARKERS, "doughnut": XL_CHART_TYPE.DOUGHNUT,
              "bar": XL_CHART_TYPE.BAR_CLUSTERED, "area": XL_CHART_TYPE.AREA}[kind]
        gf = self.s.shapes.add_chart(ct, Inches(x), Inches(y), Inches(w), Inches(h), cd)
        gf.name = name
        ch = gf.chart
        ch.font.size = Pt(size)
        set_color(ch.font.color, "ink")
        ch.has_title = False
        ch.has_legend = legend
        if legend:
            ch.legend.position = XL_LEGEND_POSITION.BOTTOM
            ch.legend.include_in_layout = False
        plot = ch.plots[0]
        if kind == "doughnut":
            hole = plot._element.find(qn("c:holeSize"))
            if hole is not None:
                hole.set("val", str(doughnut_hole))
        if kind in ("col", "bar"):
            plot.gap_width = 70
        if labels:
            plot.has_data_labels = True
            dl = plot.data_labels
            dl.font.size = Pt(size)
            if numfmt:
                dl.number_format, dl.number_format_is_linked = numfmt, False
        if kind in ("col", "line", "bar", "area"):
            va = ch.value_axis
            va.has_major_gridlines = True
            va.major_gridlines.format.line.width = Pt(0.5)
            set_color(va.major_gridlines.format.line.color, "soft")
            va.format.line.fill.background()
            ch.category_axis.format.line.width = Pt(0.75)
            set_color(ch.category_axis.format.line.color, "soft")
        return gf

    # ── 전환·애니메이션·구역·링크 ──────────────────────────
    def transition(self, s, kind):
        """슬라이드 전환. kind 예: 'fade', 'push:l', 'wipe:r', 'cover:u', 'pull:d', 'split:horz', 'wedge', 'circle', 'dissolve'"""
        name, _, arg = kind.partition(":")
        inner = {"fade": "<p:fade/>", "wedge": "<p:wedge/>", "circle": "<p:circle/>", "dissolve": "<p:dissolve/>", "diamond": "<p:diamond/>",
                 "push": f'<p:push dir="{arg or "l"}"/>', "wipe": f'<p:wipe dir="{arg or "r"}"/>', "cover": f'<p:cover dir="{arg or "l"}"/>',
                 "pull": f'<p:pull dir="{arg or "r"}"/>', "split": f'<p:split orient="{arg or "horz"}" dir="out"/>',
                 "randomBar": f'<p:randomBar dir="{arg or "vert"}"/>'}[name]
        el = _el(f'<p:transition {NSDECL} spd="med">{inner}</p:transition>')
        sld = s._element
        for old in sld.findall(qn("p:transition")):
            sld.remove(old)
        anchor = sld.find(qn("p:clrMapOvr"))
        (anchor if anchor is not None else sld.find(qn("p:cSld"))).addnext(el)

    def animate(self, s, shapes, kind="fade", dur=450):
        """등장 애니메이션(앞 동작이 끝나면 자동으로 차례대로). shapes: 그룹·도형 목록. kind: fade | wipe-l | wipe-u | zoom"""
        ids = [sh.shape_id for sh in shapes]
        if not ids:
            return
        preset = {"fade": (10, 0, "fade"), "wipe-l": (22, 8, "wipe(left)"), "wipe-u": (22, 1, "wipe(up)"), "wipe-d": (22, 4, "wipe(down)")}[kind]
        pid, sub, filt = preset
        n = [2]

        def nid():
            n[0] += 1
            return n[0]

        effects = ""
        delay = 0
        for sp in ids:
            a, b, c, d_ = nid(), nid(), nid(), nid()
            effects += (
                f'<p:par><p:cTn id="{a}" fill="hold"><p:stCondLst><p:cond delay="{delay}"/></p:stCondLst><p:childTnLst>'
                f'<p:par><p:cTn id="{b}" presetID="{pid}" presetClass="entr" presetSubtype="{sub}" fill="hold" nodeType="afterEffect">'
                f'<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
                f'<p:set><p:cBhvr><p:cTn id="{c}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
                f'<p:tgtEl><p:spTgt spid="{sp}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
                f'<p:to><p:strVal val="visible"/></p:to></p:set>'
                f'<p:animEffect transition="in" filter="{filt}"><p:cBhvr><p:cTn id="{d_}" dur="{dur}"/><p:tgtEl><p:spTgt spid="{sp}"/></p:tgtEl></p:cBhvr></p:animEffect>'
                f'</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>')
            delay += dur
        xml = (f'<p:timing {NSDECL}><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
               f'<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
               f'<p:par><p:cTn id="{nid()}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst>'
               f'<p:childTnLst>{effects}</p:childTnLst></p:cTn></p:par>'
               f'</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
               f'<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
               f'</p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>')
        sld = s._element
        for old in sld.findall(qn("p:timing")):
            sld.remove(old)
        tr = sld.find(qn("p:transition"))
        (tr if tr is not None else sld.find(qn("p:clrMapOvr"))).addnext(_el(xml))

    def link_to(self, shape, slide):
        """도형을 누르면 그 슬라이드로 이동(실행 설정 > 하이퍼링크 > 현재 문서)"""
        shape.click_action.target_slide = slide

    def _write_sections(self):
        if not self.sections:
            return
        ids = [sid.get("id") for sid in self.prs.slides._sldIdLst]
        P14 = "http://schemas.microsoft.com/office/powerpoint/2010/main"
        body = ""
        for k, (nm, start) in enumerate(self.sections):
            end = self.sections[k + 1][1] - 1 if k + 1 < len(self.sections) else len(ids)
            sl = "".join(f'<p14:sldId id="{ids[j - 1]}"/>' for j in range(start, end + 1))
            body += f'<p14:section name="{nm}" id="{{{str(uuid.uuid4()).upper()}}}"><p14:sldIdLst>{sl}</p14:sldIdLst></p14:section>'
        ext = _el(f'<p:ext {NSDECL} uri="{{521415D9-36F7-43E2-AB2F-B90AF26B5E84}}"><p14:sectionLst xmlns:p14="{P14}">{body}</p14:sectionLst></p:ext>')
        root = self.prs.part._element
        lst = root.find(qn("p:extLst"))
        if lst is None:
            lst = etree.SubElement(root, qn("p:extLst"))
        lst.append(ext)

    def save(self, path):
        self._write_sections()
        self.prs.save(path)
