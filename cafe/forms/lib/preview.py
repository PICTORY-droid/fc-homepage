"""실제 사용 화면 미리보기 — LibreOffice 로 시트를 그린 뒤 스프레드시트 창 모양 틀에 넣습니다."""
import html
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageChops

SOFFICE_PROFILE = Path(tempfile.gettempdir()) / "forms-lo-profile"


def sheet_pngs(xlsx: Path, out_stem: Path, dpi: int = 120) -> list:
    """미리보기용 엑셀 → 쪽마다 PNG(여백 잘라 냄). 쪽 순서 = 시트 순서."""
    work = Path(tempfile.mkdtemp(prefix="pv-"))
    try:
        subprocess.run(["soffice", f"-env:UserInstallation={SOFFICE_PROFILE.as_uri()}", "--headless",
                        "--convert-to", "pdf", "--outdir", str(work), str(xlsx)],
                       check=True, capture_output=True, timeout=180)
        pdf = work / (xlsx.stem + ".pdf")
        subprocess.run(["pdftoppm", "-r", str(dpi), "-png", str(pdf), str(work / "p")], check=True)
        outs = []
        for k, page in enumerate(sorted(work.glob("p*.png"))):
            im = Image.open(page).convert("RGB")
            bg = Image.new("RGB", im.size, (255, 255, 255))
            box = ImageChops.difference(im, bg).getbbox()
            im = im.crop(box) if box else im
            o = Path(f"{out_stem}_{k}.png")
            im.save(o)
            outs.append(o)
        return outs
    finally:
        shutil.rmtree(work, ignore_errors=True)


CHROME = """<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:{W}px;font-family:'Noto Sans CJK KR','Malgun Gothic',sans-serif;background:#E9E5E0}}
.win{{margin:0;background:#fff;border:1px solid #C9C2BA;overflow:hidden}}
.title{{height:38px;background:#F4F1ED;display:flex;align-items:center;padding:0 14px;gap:10px;color:#4A3F3A;font-size:14px;border-bottom:1px solid #E2DCD5}}
.dots span{{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:6px}}
.title b{{font-weight:600}}
.menu{{height:34px;display:flex;align-items:flex-end;gap:22px;padding:0 18px;font-size:13px;color:#6B5E57;background:#F4F1ED}}
.menu span{{padding:6px 2px}}
.menu .on{{color:#A34506;border-bottom:3px solid #E8591A;font-weight:600}}
.tool{{height:44px;display:flex;align-items:center;gap:8px;padding:0 14px;border-bottom:1px solid #E2DCD5;font-size:12.5px;color:#4A3F3A}}
.pill{{border:1px solid #DED6CE;border-radius:5px;padding:4px 9px;background:#FFFDFA}}
.sep{{width:1px;height:22px;background:#E2DCD5;margin:0 4px}}
.fbar{{height:34px;display:flex;align-items:center;border-bottom:1px solid #E2DCD5;font-size:13px}}
.name{{width:90px;height:100%;display:flex;align-items:center;justify-content:center;border-right:1px solid #E2DCD5;color:#4A3F3A}}
.fx{{width:42px;text-align:center;color:#8A7D75;font-style:italic;font-family:serif;font-size:15px;border-right:1px solid #E2DCD5}}
.formula{{padding:0 12px;color:#4A3F3A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:'Noto Sans Mono CJK KR','Noto Sans CJK KR',monospace;font-size:12.5px}}
.sheet{{background:#fff;padding:0;line-height:0;max-height:{H}px;overflow:hidden}}
.sheet img{{display:block;max-width:100%}}
.tabs{{height:34px;display:flex;align-items:stretch;border-top:1px solid #E2DCD5;background:#F4F1ED;font-size:13px;padding-left:46px}}
.tabs span{{display:flex;align-items:center;padding:0 18px;color:#6B5E57;border-right:1px solid #E2DCD5}}
.tabs .on{{background:#fff;color:#A34506;font-weight:600;border-bottom:3px solid #E8591A}}
.status{{height:26px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;font-size:12px;color:#8A7D75;background:#F4F1ED;border-top:1px solid #E2DCD5}}
</style></head><body><div class="win">
<div class="title"><div class="dots"><span style="background:#F59A9A"></span><span style="background:#FFD66B"></span><span style="background:#7FD1B9"></span></div><b>{FNAME}</b><span style="color:#8A7D75">— 저장됨</span></div>
<div class="menu"><span>파일</span><span class="on">홈</span><span>삽입</span><span>페이지 레이아웃</span><span>수식</span><span>데이터</span><span>검토</span><span>보기</span></div>
<div class="tool"><span class="pill">맑은 고딕 ▾</span><span class="pill">10.5 ▾</span><span class="pill"><b>가</b></span><span class="pill"><i>가</i></span><span class="pill"><u>가</u></span><span class="sep"></span><span class="pill">≡ 가운데</span><span class="pill">₩ 쉼표</span><span class="sep"></span><span class="pill">조건부 서식</span><span class="pill">표 서식</span><span class="pill">Σ 합계</span><span class="pill">정렬 및 필터</span></div>
<div class="fbar"><div class="name">{CELL}</div><div class="fx">fx</div><div class="formula">{FORMULA}</div></div>
<div class="sheet"><img src="{IMG}" width="{IW}"></div>
<div class="tabs">{TABS}<span style="border:none;color:#B5ABA2">＋</span></div>
<div class="status"><span>준비</span><span>{ZOOM}</span></div>
</div></body></html>"""


class Chrome:
    """배너용 브라우저를 같이 씁니다(Playwright 동기 API는 한 번에 하나만 열 수 있음)."""

    def __init__(self, browser):
        self._pg = browser.new_page(viewport={"width": 1400, "height": 900}, device_scale_factor=1)

    def make(self, sheet_img: Path, out: Path, fname: str, sheets: list, active: str, cell: str, formula: str,
             width: int = 1400, max_h: int = 760) -> None:
        nat = Image.open(sheet_img).width
        tabs = "".join(f'<span class="{"on" if s == active else ""}">{html.escape(s)}</span>' for s in sheets)
        page = CHROME.format(W=width, H=max_h, FNAME=html.escape(fname), CELL=html.escape(cell), FORMULA=html.escape(formula or ""),
                             IMG=sheet_img.resolve().as_uri(), IW=min(nat, width - 2), TABS=tabs, ZOOM="100%")
        tmp = out.with_suffix(".html")
        tmp.write_text(page, encoding="utf-8")
        pg = self._pg
        pg.set_viewport_size({"width": width, "height": 900})
        pg.goto(tmp.resolve().as_uri())
        pg.wait_for_load_state("load")
        h = pg.evaluate("document.querySelector('.win').getBoundingClientRect().height")
        pg.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": width, "height": h})
        tmp.unlink()
