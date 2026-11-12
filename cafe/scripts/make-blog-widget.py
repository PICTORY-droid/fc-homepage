"""네이버 블로그 사이드바 위젯 이미지 — python3 cafe/scripts/make-blog-widget.py

결과(홈페이지 정적 파일로 배포되어 위젯 코드의 이미지 주소가 됨):
  public/widget/cafe-forms.png  (가로 340, 블로그에는 가로 170으로 표시 · 세로는 카드 높이에 맞춤) — 우체국보험 길잡이 카페 분위기(사선 띠·편지봉투 캐릭터) + 블로그 프로필 위젯 구조
  cafe/out/블로그_위젯_코드.txt — 위젯 직접 등록 창에 붙여 넣을 코드
"""
import re
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
TEMPLATE = (ROOT / "cafe/scripts/blog-widget.html").as_uri()
SITE = "https://korea-bohum.vercel.app"
CAFE = "https://cafe.naver.com/f-e/cafes/31270965/menus/14?viewType=I"  # 「편지지·엑셀·이력서 양식」 게시판(사진형 목록)
WIDGETS = [
    ("forms", "cafe-forms.png", 0, "무료 엑셀 양식 60종", "우체국보험 길잡이 카페 무료 엑셀 양식 60종 - 보험 만기·갱신 달력, 한 달 가계부, 생활비 예산표, 월간 일정 달력, 주간 업무 계획표"),
]
DOOR = ROOT / "cafe/assets/door/door-main.html"  # 카페 대문 — 편지봉투 캐릭터를 그대로 가져옴
LIMIT = 2000  # 네이버 위젯 코드 글자 수 한도(영문 2천 자)


def code(file, h, alt):
    return (f'<a href="{CAFE}" target="_blank"><img src="{SITE}/widget/{file}" width="170" height="{h // 2}" '
            f'alt="{alt}" border="0"></a>')


def main():
    out = ROOT / "public/widget"
    char = re.search(r"<svg class='char'.*?</svg>", DOOR.read_text(encoding="utf-8"), re.S).group(0)
    lines = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for kind, file, h, name, alt in WIDGETS:
            pg = b.new_page(viewport={"width": 340, "height": 1200})
            pg.goto(TEMPLATE)
            pg.evaluate("document.fonts.ready")
            pg.evaluate("c => render(c)", char)
            pg.wait_for_timeout(200)
            over = pg.evaluate("()=>[...document.querySelectorAll('.card *')].filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.textContent)")
            if over:
                raise SystemExit(f"글자가 칸을 넘침: {kind} {over}")
            h = pg.evaluate("Math.ceil(document.getElementById('card').getBoundingClientRect().bottom) + 12")
            h += h % 2  # 블로그 표시 높이(h/2)가 정수가 되게
            assert h // 2 <= 600, ("네이버 위젯 세로 한도 600px 초과", h)
            pg.screenshot(path=str(out / file), clip={"x": 0, "y": 0, "width": 340, "height": h})
            c = code(file, h, alt)
            assert len(c) <= LIMIT, (kind, len(c))
            lines += [f"■ 위젯명: {name}", c, ""]
        b.close()
    (ROOT / "cafe/out").mkdir(exist_ok=True)
    (ROOT / "cafe/out/블로그_위젯_코드.txt").write_text("\n".join(lines), encoding="utf-8")
    print("\n".join(lines))


main()
