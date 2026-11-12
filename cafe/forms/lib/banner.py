"""손그림체 머리 배너 PNG 만들기 — banner.html 을 Playwright 로 찍습니다(2배 해상도)."""
from pathlib import Path
from playwright.sync_api import sync_playwright

from .theme import ACCENTS

HTML = (Path(__file__).parent / "banner.html").resolve().as_uri()
BRAND = "우체국보험 FC가 드리는<br>무료 나눔 양식"


def accent_js(cat: str) -> dict:
    a = ACCENTS[cat]
    return {"main": "#" + a["main"], "soft": "#" + a["soft"], "deep": "#" + a["deep"],
            "line": "#" + a["main"], "stripe2": "#9FC7E8" if cat != "생활" else "#F2A07B",
            "hl": "#FFE08A"}


class BannerMaker:
    """with BannerMaker() as bm: bm.make(path, w, h, title, sub, cat, motif)"""

    def __enter__(self):
        self._pw = sync_playwright().start()
        self._b = self._pw.chromium.launch()
        self.browser = self._b
        self._pg = self._b.new_page(viewport={"width": 1600, "height": 300}, device_scale_factor=2)
        self._pg.goto(HTML)
        self._pg.wait_for_function("document.fonts.ready.then(() => true)")
        return self

    def __exit__(self, *exc):
        self._b.close()
        self._pw.stop()

    def make(self, out: Path, w: int, h: int, title: str, sub: str, cat: str, motif: str) -> None:
        pg = self._pg
        pg.set_viewport_size({"width": w, "height": h})
        pg.reload()
        pg.evaluate("document.fonts.load('34px Jua')")
        pg.evaluate("document.fonts.load('20px Gaegu')")
        pg.wait_for_function("document.fonts.ready.then(() => true)")
        tsize = 34 if len(title) <= 16 else 30
        r = pg.evaluate("(d) => render(d)", {"w": w, "h": h, "title": title, "sub": sub, "accent": accent_js(cat),
                                            "motif": motif, "tsize": tsize, "ssize": 22, "brand": BRAND})
        if r["overflow"]:
            raise ValueError(f"배너 글자가 넘칩니다: {title} (폭 {w}px)")
        out.parent.mkdir(parents=True, exist_ok=True)
        pg.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": w, "height": h}, omit_background=True)
