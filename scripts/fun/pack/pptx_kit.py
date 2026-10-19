"""PPT(python-pptx) 공통 도구 — 테마(색·글꼴) 심기, 10가지 프레임, 감성 모티프, 글·도형·표 도우미.

- 슬라이드는 '제목만' 레이아웃 위에 도형을 얹어 만들어 제목이 개요 보기에 나타납니다.
- 색과 글꼴은 테마에 넣어 두어 PowerPoint 의 [디자인 > 글꼴/색]으로도 바꿀 수 있습니다.
- 사진 자리는 점선 도형이라 도형 채우기 > 그림 으로 사진을 넣을 수 있습니다.
"""
import math
import random
from lxml import etree
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.dml import MSO_LINE
from pptx.enum.shapes import MSO_SHAPE as SH
from pptx.enum.text import MSO_ANCHOR, MSO_AUTO_SIZE, PP_ALIGN
from pptx.opc.constants import RELATIONSHIP_TYPE as RT
from pptx.oxml.ns import qn
from pptx.util import Emu, Inches, Pt

FONT = "맑은 고딕"
AUTHOR = "우체국보험 상담 안내"
A = "http://schemas.openxmlformats.org/drawingml/2006/main"

# 테마 번호(0~49) → 모티프 종류
MOTIF_OF = ["flower5", "sun", "petals", "dots", "leaves", "drops", "flower5", "cloud", "leaves", "heart",
            "dots", "petals", "leaves", "drops", "dots", "dots", "sun", "wave", "stars", "cloud",
            "leaves", "wave", "dots", "lantern", "flower5", "flower5", "moon", "dots", "leaves", "leaves",
            "leaves", "stars", "dots", "stars", "dots", "snow", "lantern", "dots", "snow", "dots",
            "heart", "flower5", "lantern", "moon", "lantern", "cloud", "stars", "snow", "moon", "sun"]


def _borders(cell, color, w_pt=0.75):
    """표 칸 테두리(왼·오·위·아래) — 칸 속성에서 채우기보다 앞에 와야 해서 맨 앞에 넣는다."""
    tcPr = cell._tc.get_or_add_tcPr()
    for k, tag in enumerate(("lnL", "lnR", "lnT", "lnB")):
        ln = etree.Element(f"{{{A}}}{tag}", w=str(int(w_pt * 12700)), cap="flat", cmpd="sng", algn="ctr")
        sf = etree.SubElement(ln, f"{{{A}}}solidFill")
        etree.SubElement(sf, f"{{{A}}}srgbClr").set("val", _hex(color))
        etree.SubElement(ln, f"{{{A}}}prstDash").set("val", "solid")
        tcPr.insert(k, ln)


def rgb(h):
    return RGBColor.from_string(h.lstrip("#").upper())


def _hex(h):
    return h.lstrip("#").upper()


def _mix(a, b, t):
    a, b = _hex(a), _hex(b)
    return "#%02X%02X%02X" % tuple(round(int(a[i:i + 2], 16) * (1 - t) + int(b[i:i + 2], 16) * t) for i in (0, 2, 4))


class Deck:
    """한 개의 PPT 파일. style: 프레임 번호(0~9), theme_i: 테마 번호(0~49), size: 'wide'(16:9) | 'square'(1:1)"""

    def __init__(self, pal, style, theme_i, size="wide", title="PPT", cover_img=None):
        self.pal, self.style, self.ti = pal, style, theme_i
        self.cover_img = cover_img
        self.prs = Presentation()
        self.W, self.H = (13.333, 7.5) if size == "wide" else (7.5, 7.5)
        self._resize()
        self._patch_theme(title)
        self.rect = (0.7, 1.7, self.W - 0.7, self.H - 0.5)
        self.tbox = (0.7, 0.45, self.W - 2.6, 0.95)
        self.sbox = (0.7, 2.0, 6.0, 1.0)
        self.title_color = pal["dark"]
        self.cal = "l" if cover_img else ("c" if style in (3, 6, 8) else "l")  # 표지 글 정렬
        self.cover_size = 36 if size == "wide" else 30
        self.prs.core_properties.author = AUTHOR
        self.prs.core_properties.title = title
        self.prs.core_properties.comments = "자유롭게 편집해서 사용하세요."

    # ── 준비
    def _resize(self):
        old_w, old_h = self.prs.slide_width, self.prs.slide_height
        self.prs.slide_width, self.prs.slide_height = Inches(self.W), Inches(self.H)
        fx, fy = self.prs.slide_width / old_w, self.prs.slide_height / old_h
        m = self.prs.slide_master
        for coll in [m.shapes] + [l.shapes for l in m.slide_layouts]:
            for shp in coll:
                if shp.left is not None:
                    shp.left, shp.width = int(shp.left * fx), int(shp.width * fx)
                    shp.top, shp.height = int(shp.top * fy), int(shp.height * fy)

    def _patch_theme(self, name):
        part = self.prs.slide_master.part.part_related_by(RT.THEME)
        root = etree.fromstring(part.blob)
        p = self.pal
        root.set("name", name)
        clr = {"dk2": p["dark"], "lt2": p["pale"], "accent1": p["main"], "accent2": p["accent"], "accent3": p["dark"],
               "accent4": p["soft"], "accent5": _mix(p["main"], p["accent"], 0.5), "accent6": _mix(p["dark"], "#FFFFFF", 0.4),
               "hlink": p["main"], "folHlink": p["dark"]}
        for tag, val in clr.items():
            el = root.find(f".//{{{A}}}{tag}")
            if el is not None:
                for ch in list(el):
                    el.remove(ch)
                etree.SubElement(el, f"{{{A}}}srgbClr").set("val", _hex(val))
        for tag in ("majorFont", "minorFont"):
            f = root.find(f".//{{{A}}}{tag}")
            if f is not None:
                f.find(f"{{{A}}}latin").set("typeface", FONT)
                ea = f.find(f"{{{A}}}ea")
                ea.set("typeface", FONT)
        part._blob = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)

    # ── 슬라이드
    def slide(self, cover=False):
        s = self.prs.slides.add_slide(self.prs.slide_layouts[5])
        self.s = s
        if cover and self.cover_img:
            self._image_cover(s)
        else:
            self._frame(s, cover)
        return s

    def _image_cover(self, s):
        """그림 한 장(우표·폴라로이드·항공우편·승차권)을 깔고 그 위에 제목 글을 올립니다. 글자는 그대로 고칠 수 있어요."""
        W, H = self.W, self.H
        s.shapes.add_picture(self.cover_img, 0, 0, Inches(W), Inches(H)).name = "표지 그림"
        self.title_color = self.pal["dark"]
        if W > H:
            self.tbox = (W * 0.07, H * 0.3, W * 0.5, 1.7)
            self.sbox = (W * 0.07, H * 0.3 + 1.85, W * 0.5, 1.2)
        else:
            self.tbox = (W * 0.1, H * 0.14, W * 0.8, 1.6)
            self.sbox = (W * 0.1, H * 0.14 + 1.75, W * 0.8, 1.2)

    def save(self, path):
        self.prs.save(path)

    # ── 도형·글 도우미 (현재 슬라이드 self.s 에 그린다)
    def shape(self, kind, x, y, w, h, fill=None, line=None, lw=1.0, rot=0, dash=False, name=None, adj=None, s=None):
        s = s or self.s
        shp = s.shapes.add_shape(kind, Inches(x), Inches(y), Inches(w), Inches(h))
        st = shp._element.find(qn("p:style"))
        if st is not None:
            shp._element.remove(st)
        if fill is None:
            shp.fill.background()
        else:
            shp.fill.solid(); shp.fill.fore_color.rgb = rgb(fill)
        if line is None:
            shp.line.fill.background()
        else:
            shp.line.color.rgb = rgb(line); shp.line.width = Pt(lw)
            if dash:
                shp.line.dash_style = MSO_LINE.DASH
        if rot:
            shp.rotation = rot
        if adj is not None:
            shp.adjustments[0] = adj
        if name:
            shp.name = name
        return shp

    def text(self, x, y, w, h, content, size=16, bold=False, color=None, align="l", anchor="t", italic=False, spacing=1.15, bullet=False, name=None, space_after=0, s=None):
        s = s or self.s
        tb = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
        if name:
            tb.name = name
        self._fill_text(tb.text_frame, content, size, bold, color or self.pal["ink"], align, anchor, italic, spacing, bullet, space_after)
        return tb

    def _fill_text(self, tf, content, size, bold, color, align, anchor, italic, spacing, bullet, space_after=0):
        tf.word_wrap = True
        tf.auto_size = MSO_AUTO_SIZE.NONE
        tf.margin_left = tf.margin_right = Inches(0.06)
        tf.margin_top = tf.margin_bottom = Inches(0.03)
        tf.vertical_anchor = {"t": MSO_ANCHOR.TOP, "m": MSO_ANCHOR.MIDDLE, "b": MSO_ANCHOR.BOTTOM}[anchor]
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
            f.color.rgb = rgb(color)
            if bullet:
                pPr = para._p.get_or_add_pPr()
                pPr.set("marL", "285750"); pPr.set("indent", "-285750")
                bu = etree.SubElement(pPr, f"{{{A}}}buFont"); bu.set("typeface", "Arial")
                ch = etree.SubElement(pPr, f"{{{A}}}buChar"); ch.set("char", "•")

    def title(self, content, size=30, color=None, align="l", box=None):
        t = self.s.shapes.title
        el = t._element
        tree = el.getparent()
        tree.remove(el); tree.append(el)  # 장식 도형 위로 올린다(카드·리본 안에서도 제목이 보이게)
        x, y, w, h = box or self.tbox
        t.left, t.top, t.width, t.height = Inches(x), Inches(y), Inches(w), Inches(h)
        self._fill_text(t.text_frame, content, size, True, color or self.title_color, align, "m", False, 1.05, False)
        return t

    def box(self, x, y, w, h, fill=None, line=None, lw=1.0, radius=0.08, dash=False, name=None):
        return self.shape(SH.ROUNDED_RECTANGLE, x, y, w, h, fill, line, lw, dash=dash, name=name, adj=radius)

    def photo(self, x, y, w, h, label="사진을 넣어 주세요", size=12, shape="round"):
        """사진 자리: 점선 도형. 도형 채우기 > 그림 으로 사진을 넣을 수 있어요."""
        p = self.pal
        kind = SH.OVAL if shape == "oval" else SH.ROUNDED_RECTANGLE
        shp = self.shape(kind, x, y, w, h, fill=p["soft"], line=p["main"], lw=1.5, dash=True, name="사진 자리", adj=0.06 if shape != "oval" else None)
        self._fill_text(shp.text_frame, label, size, False, p["dark"], "c", "m", False, 1.0, False)
        return shp

    def table(self, x, y, w, rows, col_w=None, row_h=0.45, size=12, head=True, first_col=False, name="표"):
        p = self.pal
        n, m = len(rows), len(rows[0])
        gf = self.s.shapes.add_table(n, m, Inches(x), Inches(y), Inches(w), Inches(row_h * n))
        gf.name = name
        tbl = gf.table
        tbl.first_row = head
        tbl.horz_banding = False
        cw = col_w or [w / m] * m
        for j, v in enumerate(cw):
            tbl.columns[j].width = Inches(v)
        for i, row in enumerate(rows):
            tbl.rows[i].height = Inches(row_h)
            for j, v in enumerate(row):
                c = tbl.cell(i, j)
                c.vertical_anchor = MSO_ANCHOR.MIDDLE
                c.margin_left = c.margin_right = Inches(0.08)
                hd = head and i == 0
                fc = hd or (first_col and j == 0)
                c.fill.solid()
                c.fill.fore_color.rgb = rgb(p["main"] if hd else p["soft"] if fc else ("#FFFFFF" if i % 2 else p["pale"]))
                tf = c.text_frame
                tf.word_wrap = True
                para = tf.paragraphs[0]
                para.alignment = PP_ALIGN.CENTER if (hd or j > 0) else PP_ALIGN.LEFT
                _borders(c, p["soft"] if not hd else p["main"])
                run = para.add_run(); run.text = str(v)
                run.font.size = Pt(size); run.font.bold = bool(hd or fc)
                run.font.color.rgb = rgb("#FFFFFF" if hd else p["dark"] if fc else p["ink"])
        return gf

    # ── 모티프
    def motif(self, cx, cy, size, cols=None, seed=None):
        p = self.pal
        c1, c2, c3 = cols or (p["main"], p["soft"], p["accent"])
        kind = MOTIF_OF[self.ti]
        r = random.Random(self.ti * 31 + (seed or 0))
        add = lambda k, x, y, w, h, f, rot=0: self.shape(k, x, y, w, h, fill=f, rot=rot, name="장식")
        if kind == "flower5":
            for (fx, fy, fs, ps) in ((0, 0, 1.0, 0), (-0.55, 0.45, 0.5, 20), (0.55, 0.5, 0.42, 40)):
                R, pr = size * 0.26 * fs, size * 0.3 * fs
                for k in range(5):
                    a = math.radians(k * 72 + ps)
                    px, py = cx + fx * size + R * math.sin(a), cy + fy * size - R * math.cos(a)
                    add(SH.OVAL, px - pr * 0.45, py - pr * 0.7, pr * 0.9, pr * 1.4, c1 if k % 2 == 0 else c2, k * 72 + ps)
                add(SH.OVAL, cx + fx * size - pr * 0.3, cy + fy * size - pr * 0.3, pr * 0.6, pr * 0.6, c3)
        elif kind == "petals":
            for k in range(8):
                s_ = size * r.uniform(0.18, 0.32)
                add(SH.TEAR, cx + r.uniform(-0.5, 0.5) * size - s_ / 2, cy + r.uniform(-0.5, 0.5) * size - s_ / 2, s_, s_, [c1, c2, c3][k % 3], r.uniform(0, 360))
        elif kind == "sun":
            add(SH.SUN, cx - size * 0.45, cy - size * 0.45, size * 0.9, size * 0.9, c1)
            for k in range(3):
                add(SH.OVAL, cx + r.uniform(-0.6, 0.6) * size, cy + r.uniform(0.45, 0.7) * size, size * 0.1, size * 0.1, c2)
        elif kind == "drops":
            for k in range(7):
                s_ = size * r.uniform(0.14, 0.26)
                add(SH.TEAR, cx + r.uniform(-0.55, 0.55) * size - s_ / 2, cy + r.uniform(-0.55, 0.55) * size - s_ / 2, s_, s_, [c1, c2, c3][k % 3], 315)
        elif kind == "dots":
            for k in range(11):
                s_ = size * r.uniform(0.07, 0.22)
                add(SH.OVAL, cx + r.uniform(-0.55, 0.55) * size - s_ / 2, cy + r.uniform(-0.55, 0.55) * size - s_ / 2, s_, s_, [c1, c2, c3][k % 3])
        elif kind == "leaves":
            for k in range(6):
                lw_, lh = size * 0.17, size * r.uniform(0.42, 0.62)
                add(SH.OVAL, cx + r.uniform(-0.45, 0.45) * size - lw_ / 2, cy + r.uniform(-0.3, 0.3) * size - lh / 2, lw_, lh, [c1, c2, c3][k % 3], r.uniform(-65, 65))
        elif kind == "wave":
            for k, c in enumerate((c2, c1, c3)):
                add(SH.WAVE, cx - size * 0.6, cy - size * 0.3 + k * size * 0.26, size * 1.2, size * 0.3, c)
        elif kind == "stars":
            for k in range(6):
                s_ = size * r.uniform(0.14, 0.34)
                add(SH.STAR_5_POINT, cx + r.uniform(-0.55, 0.55) * size - s_ / 2, cy + r.uniform(-0.55, 0.55) * size - s_ / 2, s_, s_, [c1, c2, c3][k % 3], r.uniform(-20, 20))
        elif kind == "snow":
            for k in range(6):
                s_ = size * r.uniform(0.14, 0.34)
                add(SH.STAR_6_POINT, cx + r.uniform(-0.55, 0.55) * size - s_ / 2, cy + r.uniform(-0.55, 0.55) * size - s_ / 2, s_, s_, [c1, c2, c3][k % 3], r.uniform(0, 60))
        elif kind == "moon":
            add(SH.MOON, cx - size * 0.3, cy - size * 0.5, size * 0.6, size, c1)
            for k in range(3):
                s_ = size * r.uniform(0.1, 0.2)
                add(SH.STAR_5_POINT, cx + r.uniform(0.1, 0.55) * size, cy + r.uniform(-0.5, 0.5) * size, s_, s_, [c2, c3][k % 2])
        elif kind == "cloud":
            add(SH.CLOUD, cx - size * 0.55, cy - size * 0.35, size * 0.95, size * 0.55, c2)
            add(SH.CLOUD, cx - size * 0.1, cy - size * 0.1, size * 0.6, size * 0.38, c1)
            for k in range(3):
                s_ = size * 0.12
                add(SH.TEAR, cx - size * 0.3 + k * size * 0.3, cy + size * 0.32, s_, s_, c3, 315)
        elif kind == "heart":
            for k, (fx, fy, fs, rt) in enumerate(((0, 0, 0.55, 0), (-0.4, 0.3, 0.32, -18), (0.42, 0.28, 0.3, 16))):
                add(SH.HEART, cx + fx * size - size * fs / 2, cy + fy * size - size * fs / 2, size * fs, size * fs, [c1, c2, c3][k], rt)
        elif kind == "lantern":
            for k, fx in enumerate((-0.38, 0.0, 0.38)):
                lw_, lh = size * 0.3, size * (0.5 - 0.08 * (k % 2))
                x0, y0 = cx + fx * size - lw_ / 2, cy - lh / 2 + (k % 2) * size * 0.14
                add(SH.ROUNDED_RECTANGLE, x0, y0, lw_, lh, [c1, c2, c3][k])
                add(SH.RECTANGLE, x0 + lw_ * 0.25, y0 - size * 0.05, lw_ * 0.5, size * 0.05, c3 if k != 2 else c1)
                add(SH.RECTANGLE, x0 + lw_ * 0.25, y0 + lh, lw_ * 0.5, size * 0.05, c3 if k != 2 else c1)

    # ── 프레임(10가지)
    def _frame(self, s, cover):
        p, W, H, st = self.pal, self.W, self.H, self.style
        sh = lambda *a, **k: self.shape(*a, **k)
        wide = W > H
        bg = p["pale"]
        tc = p["dark"]
        tb = (0.7, 0.5, W - 2.7, 0.95)
        rect = (0.7, 1.75, W - 0.7, H - 0.5)
        mo = (W - 0.95, 0.85, 1.1, None)  # 작은 모티프(우상단)
        cv_title = (W * 0.1, H * 0.34, W * 0.8, 1.5)
        cv_sub = (W * 0.1, H * 0.34 + 1.6, W * 0.8, 1.2)
        cv_motif = (W * 0.8, H * 0.22, H * 0.42, None)
        deco = []
        if st == 0:  # 위 띠 / 왼쪽 큰 면
            if cover:
                bg = p["pale"]; deco = [(SH.RECTANGLE, 0, 0, W * 0.38, H, p["main"]), (SH.OVAL, -W * 0.08, H * 0.62, W * 0.3, W * 0.3, _mix(p["main"], "#FFFFFF", 0.18))]
                cv_title = (W * 0.43, H * 0.3, W * 0.52, 1.7); cv_sub = (W * 0.43, H * 0.3 + 1.8, W * 0.52, 1.2)
                cv_motif = (W * 0.19, H * 0.38, W * 0.3, "w")
            else:
                deco = [(SH.RECTANGLE, 0, 0, W, 0.3, p["main"]), (SH.RECTANGLE, 0, 0.3, W, 0.06, p["accent"])]
        elif st == 1:  # 세로 띠
            if cover:
                deco = [(SH.RECTANGLE, 0, 0, W * 0.16, H, p["main"]), (SH.RECTANGLE, W * 0.16, 0, 0.1, H, p["accent"])]
                cv_title = (W * 0.24, H * 0.32, W * 0.62, 1.6); cv_sub = (W * 0.24, H * 0.32 + 1.7, W * 0.62, 1.2)
                cv_motif = (W * 0.8, H * 0.74, H * 0.36, None)
            else:
                deco = [(SH.RECTANGLE, 0, 0, 0.45, H, p["main"]), (SH.RECTANGLE, 0.45, 0, 0.07, H, p["accent"])]
                tb = (1.0, 0.5, W - 3.0, 0.95); rect = (1.0, 1.75, W - 0.7, H - 0.5)
        elif st == 2:  # 큰 원
            bg = "#FFFFFF"
            if cover:
                deco = [(SH.OVAL, W * 0.58, -H * 0.25, H * 1.15, H * 1.15, p["soft"]), (SH.OVAL, W * 0.78, H * 0.58, H * 0.5, H * 0.5, p["main"])]
                cv_title = (W * 0.07, H * 0.3, W * 0.55, 1.6); cv_sub = (W * 0.07, H * 0.3 + 1.7, W * 0.5, 1.2)
                cv_motif = (W * 0.8, H * 0.24, H * 0.42, None)
            else:
                deco = [(SH.OVAL, W - 2.5, -1.6, 4.2, 4.2, p["soft"]), (SH.OVAL, W - 1.2, 0.3, 0.45, 0.45, p["main"])]
        elif st == 3:  # 액자
            if cover:
                deco = [(SH.RECTANGLE, 0.3, 0.3, W - 0.6, H - 0.6, None, p["main"], 3.0), (SH.RECTANGLE, 0.5, 0.5, W - 1.0, H - 1.0, None, p["soft"], 1.0)]
                cv_title = (W * 0.12, H * 0.34, W * 0.76, 1.5); cv_sub = (W * 0.12, H * 0.34 + 1.6, W * 0.76, 1.2)
                cv_motif = (W * 0.5, H * 0.2, H * 0.24, None)
            else:
                deco = [(SH.RECTANGLE, 0.28, 0.28, W - 0.56, H - 0.56, None, p["main"], 2.25), (SH.RECTANGLE, 0.42, 0.42, W - 0.84, H - 0.84, None, p["soft"], 0.75)]
                tb = (0.9, 0.6, W - 3.2, 0.9); rect = (0.9, 1.7, W - 0.9, H - 0.75); mo = (W - 1.25, 1.05, 1.0, None)
        elif st == 4:  # 물결
            bg = "#FFFFFF"
            if cover:
                deco = [(SH.WAVE, -0.3, H * 0.62, W + 0.6, H * 0.4, p["soft"]), (SH.WAVE, -0.3, H * 0.74, W + 0.6, H * 0.34, p["main"])]
                cv_title = (W * 0.08, H * 0.2, W * 0.62, 1.6); cv_sub = (W * 0.08, H * 0.2 + 1.7, W * 0.6, 1.2)
                cv_motif = (W * 0.82, H * 0.28, H * 0.4, None)
            else:
                deco = [(SH.WAVE, -0.2, H - 0.78, W + 0.4, 0.8, p["soft"]), (SH.WAVE, -0.2, H - 0.5, W + 0.4, 0.55, p["main"])]
                rect = (0.7, 1.7, W - 0.7, H - 1.0)
        elif st == 5:  # 대각선(삼각)
            if cover:
                deco = [(SH.RIGHT_TRIANGLE, 0, H * 0.42, W * 0.45, H * 0.58, p["soft"]), (SH.RIGHT_TRIANGLE, 0, H * 0.66, W * 0.26, H * 0.34, p["main"]), (SH.RIGHT_TRIANGLE, W * 0.64, 0, W * 0.36, H * 0.4, p["soft"], None, 1, 180)]
                cv_title = (W * 0.08, H * 0.16, W * 0.62, 1.6); cv_sub = (W * 0.08, H * 0.16 + 1.7, W * 0.6, 1.2)
                cv_motif = (W * 0.84, H * 0.7, H * 0.4, None)
            else:
                deco = [(SH.RIGHT_TRIANGLE, 0, H - 0.9, 1.9, 0.9, p["soft"]), (SH.RIGHT_TRIANGLE, 0, H - 0.5, 1.0, 0.5, p["main"])]
        elif st == 6:  # 카드
            bg = p["dark"] if cover else p["main"]
            if cover:
                deco = [(SH.ROUNDED_RECTANGLE, 0.5, 0.5, W - 1.0, H - 1.0, "#FFFFFF", None, 1, 0, 0.05)]
                cv_title = (W * 0.12, H * 0.33, W * 0.76, 1.5); cv_sub = (W * 0.12, H * 0.33 + 1.6, W * 0.76, 1.2)
                cv_motif = (W * 0.5, H * 0.2, H * 0.22, None)
            else:
                deco = [(SH.ROUNDED_RECTANGLE, 0.3, 0.3, W - 0.6, H - 0.6, "#FFFFFF", None, 1, 0, 0.035)]
                tb = (0.8, 0.6, W - 3.0, 0.95); rect = (0.8, 1.75, W - 0.8, H - 0.7); mo = (W - 1.3, 1.05, 1.0, None)
        elif st == 7:  # 아치
            if cover:
                deco = [(SH.ROUND_2_SAME_RECTANGLE, W * 0.6, H * 0.14, W * 0.3, H * 0.86, p["soft"], None, 1, 0, 0.5), (SH.ROUND_2_SAME_RECTANGLE, W * 0.65, H * 0.26, W * 0.2, H * 0.74, p["main"], None, 1, 0, 0.5)]
                cv_title = (W * 0.07, H * 0.3, W * 0.5, 1.7); cv_sub = (W * 0.07, H * 0.3 + 1.8, W * 0.48, 1.2)
                cv_motif = (W * 0.75, H * 0.52, W * 0.15, "w")
            else:
                deco = [(SH.ROUND_2_SAME_RECTANGLE, W - 1.7, 0, 1.0, 1.7, p["soft"], None, 1, 180, 0.5)]
                mo = (W - 1.2, 0.85, 0.8, None)
        elif st == 8:  # 우표
            bg = p["main"] if cover else p["soft"]
            if cover:
                deco = [(SH.RECTANGLE, 0.55, 0.55, W - 1.1, H - 1.1, "#FFFFFF", p["soft"], 3.0, 0, None, True)]
                cv_title = (W * 0.12, H * 0.33, W * 0.76, 1.5); cv_sub = (W * 0.12, H * 0.33 + 1.6, W * 0.76, 1.2)
                cv_motif = (W * 0.5, H * 0.21, H * 0.24, None)
            else:
                deco = [(SH.RECTANGLE, 0.3, 0.3, W - 0.6, H - 0.6, "#FFFFFF", p["main"], 2.0, 0, None, True)]
                tb = (0.85, 0.6, W - 3.1, 0.9); rect = (0.85, 1.7, W - 0.85, H - 0.7); mo = (W - 1.3, 1.05, 1.0, None)
        elif st == 9:  # 리본
            bg = "#FFFFFF"
            if cover:
                deco = [(SH.PENTAGON, 0, H * 0.3, W * 0.84, 2.0, p["main"]), (SH.RECTANGLE, 0, H * 0.3 + 2.0, W * 0.78, 0.07, p["accent"])]
                cv_title = (W * 0.06, H * 0.3 + 0.12, W * 0.72, 1.76); cv_sub = (W * 0.06, H * 0.3 + 2.3, W * 0.7, 1.2)
                cv_motif = (W * 0.88, H * 0.2, H * 0.34, None)
            else:
                deco = [(SH.PENTAGON, 0, 0.42, W * 0.78, 0.98, p["main"])]
                tb = (0.7, 0.45, W * 0.78 - 1.2, 0.9); rect = (0.7, 1.8, W - 0.7, H - 0.5); mo = (W - 0.95, 0.85, 1.1, None)
        if cover:
            tc = "#FFFFFF" if (st in (9,) or (st == 0 and False)) else tc
            if st == 9:
                tc = "#FFFFFF"
        else:
            if st == 9:
                tc = "#FFFFFF"
        s.background.fill.solid()
        s.background.fill.fore_color.rgb = rgb(bg)
        for d in deco:
            kind, x, y, w, h = d[:5]
            fill = d[5] if len(d) > 5 else None
            line = d[6] if len(d) > 6 else None
            lw = d[7] if len(d) > 7 else 1.0
            rot = d[8] if len(d) > 8 else 0
            adj = d[9] if len(d) > 9 else None
            dash = d[10] if len(d) > 10 else False
            self.shape(kind, x, y, w, h, fill=fill, line=line, lw=lw, rot=rot, adj=adj, dash=dash, name="장식", s=s)
        self.title_color, self.rect = tc, rect
        if cover:
            self.tbox, self.sbox = cv_title, cv_sub
            mx, my, ms, flag = cv_motif
            cols = ("#FFFFFF", p["soft"], p["accent"]) if flag == "w" else None
            self.motif(mx, my, ms, cols)
        else:
            self.tbox = tb
            mx, my, ms, _ = mo
            if not self.cover_img:  # 그림 표지를 쓰는 덱은 안쪽 쪽에 클립아트를 넣지 않습니다
                self.motif(mx, my, ms)
