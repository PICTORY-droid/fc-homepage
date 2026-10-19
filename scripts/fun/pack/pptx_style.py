"""PPT 새 디자인 — 선명한 파스텔 + 미니멀. 계절마다 색의 결을 정해 두고, 테마 색(hue)에서 한 벌의 팔레트를 만듭니다.

- main: 작은 강조(번호 동그라미·표 머리글·선)에 쓰는 선명한 중간 톤
- soft / pale: 큰 면에 쓰는 연한 파스텔(카드·표지 장식)
- dark: 글자용 깊은 톤(진하지만 탁하지 않게)
- accent: 계절 포인트 색(봄 민트·여름 레몬·가을 겨자·겨울 라벤더)
"""
import pack_kit as pk

# 계절별 (채도, main 밝기, 포인트 hue, 포인트 채도)
SEASON = {
    "봄": (0.70, 0.76, 150, 0.45),
    "여름": (0.72, 0.70, 48, 0.85),
    "가을": (0.55, 0.66, 38, 0.65),
    "겨울": (0.55, 0.74, 262, 0.50),
}
SEASON_EN = {"봄": "SPRING", "여름": "SUMMER", "가을": "AUTUMN", "겨울": "WINTER"}
# 이 테마들은 hue 가 어두운 갈색·회색에 가까워 계절 규칙을 그대로 쓰면 탁해 보여서 hue 를 조금 옮깁니다
HUE_FIX = {}


def palette(i):
    """테마 i → 팔레트. 먹색 글자 + 한 가지 선명한 파스텔 + 아주 연한 크림 바탕"""
    name, h, s, l = pk.THEMES[i]
    season = pk.season_of(i)
    ss, ml, ah, asat = SEASON[season]
    hx = pk._hex
    return {
        "name": name,
        "season": season,
        "main": hx(h, ss, ml),
        "dark": hx(h, 0.30, 0.22),
        "tint": hx(h, min(0.85, ss + 0.05), 0.80),
        "soft": hx(h, min(0.85, ss + 0.1), 0.90),
        "pale": hx(h, min(0.8, ss + 0.1), 0.955),
        "paper": hx(h, 0.40, 0.985),
        "accent": hx(h + 28, ss, ml + 0.08),
        "ink": "#26231F",
    }


DECOS = ["rings", "arc", "lines", "dots", "cross", "grid", "orbit"]


def mesh_spec(i, wide=True, soft=0.0, key="x"):
    """테마 i 의 번지는 빛 배경 한 장의 설명(색 5개 + 장식 종류 + 배치 씨앗)"""
    name, h, s, l = pk.THEMES[i]
    season = pk.season_of(i)
    hx = pk._hex
    sat = {"봄": 0.92, "여름": 0.95, "가을": 0.78, "겨울": 0.8}[season]
    li = {"봄": 0.76, "여름": 0.72, "가을": 0.7, "겨울": 0.76}[season]
    ah = SEASON[season][2]
    colors = [hx(h, sat, li), hx(h + 38, sat, li + 0.04), hx(h - 42, sat, li + 0.02), hx(ah, 0.8, 0.84), hx(h + 180, 0.55, 0.9)]
    return {"id": f"{key}{i + 1:02d}", "wide": wide, "seed": i * 13 + 5, "base": hx(h, 0.8, 0.93), "colors": colors,
            "line": "#FFFFFF", "deco": DECOS[(i * 3 + i // 7) % len(DECOS)], "soft": soft}
