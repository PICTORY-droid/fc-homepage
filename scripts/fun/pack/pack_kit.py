"""콘텐츠 꾸러미(엑셀·PPT·워드·SVG·인쇄물) 공통 도구.

- THEMES: 계절 순서로 정리한 50가지 한국 감성 테마(이름 + 대표 색). 모든 항목이 같은 50개 테마를 씁니다.
- palette(i): 테마 번호 → 진한색/메인/연한색/강조색(hex)
- Manifest: public/fun/pack/ 와 src/config/pack.data.json 에 목록을 기록합니다.
"""
import colorsys
import json
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
PUBLIC = os.path.join(ROOT, "public", "fun", "pack")
MANIFEST = os.path.join(ROOT, "src", "config", "pack.data.json")

# (이름, 색상 H(0-360), 채도 0-1, 밝기 0-1) — 계절 순서: 봄 1~13, 여름 14~25, 가을 26~38, 겨울 39~50
THEMES = [
    ("매화 피는 아침", 335, 0.42, 0.52), ("대문 앞 햇살", 42, 0.62, 0.48), ("벚꽃 엔딩", 345, 0.55, 0.60),
    ("유채꽃 들판", 52, 0.72, 0.42), ("청보리 물결", 95, 0.42, 0.40), ("우산 둔 창가", 205, 0.38, 0.46),
    ("진달래 언덕", 318, 0.48, 0.50), ("제비 돌아온 처마", 215, 0.45, 0.30), ("모내기 하는 날", 120, 0.40, 0.38),
    ("어버이날 카네이션", 350, 0.60, 0.50), ("라일락 골목", 275, 0.38, 0.52), ("아카시아 향기", 80, 0.30, 0.46),
    ("연둣빛 신록", 138, 0.50, 0.34), ("노란 우산", 222, 0.50, 0.40), ("수국 정원", 255, 0.42, 0.55),
    ("평상 위 수박", 145, 0.48, 0.36), ("해바라기 길", 46, 0.80, 0.44), ("바닷가 등대", 198, 0.62, 0.38),
    ("반딧불 마을", 160, 0.50, 0.28), ("물웅덩이 놀이터", 190, 0.45, 0.45), ("대숲 바람", 150, 0.32, 0.33),
    ("섬마을 선착장", 208, 0.55, 0.34), ("매미 우는 오후", 100, 0.40, 0.42), ("처마 끝 풍경", 185, 0.30, 0.42),
    ("연꽃 연못", 330, 0.38, 0.55), ("코스모스 길", 320, 0.45, 0.56), ("한가위 보름달", 40, 0.70, 0.46),
    ("감나무 있는 집", 28, 0.72, 0.46), ("억새 언덕", 36, 0.34, 0.46), ("단풍 든 우체통", 12, 0.62, 0.42),
    ("은행잎 편지", 48, 0.76, 0.46), ("도서관 오후", 24, 0.36, 0.34), ("완행열차 창가", 18, 0.30, 0.40),
    ("장독대 고추잠자리", 8, 0.50, 0.40), ("밤 줍는 아침", 30, 0.42, 0.34), ("하얀 들판", 200, 0.20, 0.44),
    ("학교 종소리", 232, 0.42, 0.38), ("군고구마 골목", 22, 0.58, 0.38), ("하얀 아침", 212, 0.40, 0.58),
    ("골목 포장마차", 34, 0.62, 0.42), ("연탄불 아랫목", 16, 0.44, 0.34), ("붉은 동백", 355, 0.62, 0.42),
    ("설날 세배", 350, 0.46, 0.38), ("대보름 달집", 44, 0.64, 0.40), ("한지 등불", 38, 0.52, 0.52),
    ("새벽 시장 김", 195, 0.28, 0.40), ("성탄 우편함", 140, 0.42, 0.28), ("하얀 장독대", 220, 0.26, 0.50),
    ("그믐밤", 240, 0.38, 0.26), ("해돋이 언덕", 24, 0.78, 0.50),
]
assert len(THEMES) == 50 and len({t[0] for t in THEMES}) == 50


def _hex(h, s, l):
    r, g, b = colorsys.hls_to_rgb((h % 360) / 360.0, max(0.0, min(1.0, l)), max(0.0, min(1.0, s)))
    return "#%02X%02X%02X" % (round(r * 255), round(g * 255), round(b * 255))


def palette(i):
    """테마 i(0~49) → dict(name, dark, main, soft, pale, accent, ink)"""
    name, h, s, l = THEMES[i]
    return {
        "name": name,
        "dark": _hex(h, s, max(0.16, l - 0.20)),
        "main": _hex(h, s, l),
        "soft": _hex(h, min(1.0, s + 0.05), 0.88),
        "pale": _hex(h, min(1.0, s), 0.96),
        "accent": _hex(h + 150, min(0.42, s), 0.40),
        "ink": "#2B2B2B",
    }


def season_of(i):
    return ["봄", "여름", "가을", "겨울"][0 if i < 13 else 1 if i < 25 else 2 if i < 38 else 3]


def safe_name(text):
    """파일 이름에 못 쓰는 글자와 공백을 없앱니다(한글은 그대로)."""
    return re.sub(r"[\\/:*?\"<>|\s]+", "", text)


def out_dir(fmt, item):
    d = os.path.join(PUBLIC, fmt, item)
    os.makedirs(d, exist_ok=True)
    return d


def write_manifest(item, entries):
    """src/config/pack.data.json 의 item 키를 entries 로 교체합니다. entries: [{no,name,tag,main,soft}]"""
    data = {}
    if os.path.exists(MANIFEST):
        with open(MANIFEST, encoding="utf-8") as f:
            data = json.load(f)
    data[item] = entries
    data = dict(sorted(data.items()))
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")


def check_unique(items, label):
    assert len(items) == 50, f"{label}: 50개가 아닙니다({len(items)})"
    assert len(set(items)) == 50, f"{label}: 중복이 있습니다"
