"""네이버 블로그 사이드바 위젯 이미지 — python3 cafe/scripts/make-blog-widget.py

결과(홈페이지 정적 파일로 배포되어 위젯 코드의 이미지 주소가 됨):
  public/widget/cafe-forms.png  (340×620, 블로그에는 170×310으로 표시) — 무료 엑셀 양식 60종(우체국 감성·은은한 손그림)
  cafe/out/블로그_위젯_코드.txt — 위젯 직접 등록 창에 붙여 넣을 코드
"""
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
TEMPLATE = (ROOT / "cafe/scripts/blog-widget.html").as_uri()
SITE = "https://korea-bohum.vercel.app"
CAFE = "https://cafe.naver.com/f-e/cafes/31270965/menus/14?viewType=I"  # 「편지지·엑셀·이력서 양식」 게시판(사진형 목록)
WIDGETS = [
    ("forms", "cafe-forms.png", 620, "무료 엑셀 양식 60종", "우체국보험 길잡이 카페 무료 엑셀 양식 60종 - 가계부, 보험 정리표, 편지지"),
]
LIMIT = 2000  # 네이버 위젯 코드 글자 수 한도(영문 2천 자)


def code(file, h, alt):
    return (f'<a href="{CAFE}" target="_blank"><img src="{SITE}/widget/{file}" width="170" height="{h // 2}" '
            f'alt="{alt}" border="0"></a>')


def main():
    out = ROOT / "public/widget"
    lines = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for kind, file, h, name, alt in WIDGETS:
            pg = b.new_page(viewport={"width": 340, "height": h})
            pg.goto(TEMPLATE)
            pg.evaluate("document.fonts.ready")
            pg.evaluate("() => render()")
            pg.wait_for_timeout(200)
            over = pg.evaluate("()=>[...document.querySelectorAll('.t')].filter(e=>{const r=e.getBoundingClientRect();return r.left<12||r.right>328}).map(e=>e.textContent)")
            if over:
                raise SystemExit(f"글자가 틀 밖으로 나감: {kind} {over}")
            pg.screenshot(path=str(out / file), clip={"x": 0, "y": 0, "width": 340, "height": h})
            c = code(file, h, alt)
            assert len(c) <= LIMIT, (kind, len(c))
            lines += [f"■ 위젯명: {name}", c, ""]
        b.close()
    (ROOT / "cafe/out").mkdir(exist_ok=True)
    (ROOT / "cafe/out/블로그_위젯_코드.txt").write_text("\n".join(lines), encoding="utf-8")
    print("\n".join(lines))


main()
