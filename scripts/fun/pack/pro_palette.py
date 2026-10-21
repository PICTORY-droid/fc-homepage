"""프리미엄 PPT 팔레트 50종 — 사람이 고른 5가지 기준색(바탕·주색·보조색·금속색·진한 글자색)에서 나머지를 계산합니다.

- mode "light": 아이보리 바탕 + 진한 글자 / "night": 어두운 바탕 + 밝은 글자(테마 색 자체를 뒤집어 두므로 PowerPoint 에서 색 변형도 그대로 동작)
- vibe: 이 팔레트가 어울리는 분위기. 표지·본문 구도, 카드 모양, 글꼴이 분위기에 맞춰 골라집니다.
  classic(격조) · minimal(절제) · modern(세련) · geo(기하) · cyber(미래·사이버) · playful(위트·귀여움) · bold(화려·당당)
- 계절(season)은 사이트의 계절 목록과 맞추려고 번호 순서(0~12 봄 · 13~24 여름 · 25~37 가을 · 38~49 겨울)를 지킵니다.
"""
import colorsys

import pack_kit as pk

# (이름, 영문 낱말, mode, vibe, 바탕, 주색, 보조색, 금속색, 진한색)
LUX = [
    # ── 봄 0~12
    ("아이보리 로즈골드", "IVORY", "light", "classic", "#FAF5EF", "#B97A6E", "#8E5F57", "#C9A27A", "#4B2F2B"),
    ("블러시 샴페인", "BLUSH", "light", "minimal", "#FBF4F1", "#D4A39B", "#B48866", "#C9AA7C", "#5A3B38"),
    ("세이지 크림", "SAGE", "light", "minimal", "#F6F4EA", "#7D9481", "#B5A173", "#B99C5C", "#2E4437"),
    ("화이트 골드", "GOLD", "light", "classic", "#FCFAF4", "#C7A557", "#8B8572", "#D4B56A", "#3C3726"),
    ("라일락 실버", "LILAC", "light", "modern", "#F5F3F9", "#8C82B0", "#A7AEBB", "#B9B3CB", "#38325A"),
    ("민트 플래티넘", "MINT", "light", "modern", "#F0F6F4", "#6E9C92", "#A2ADB3", "#BCC5C4", "#22413D"),
    ("피치 코퍼", "PEACH", "light", "playful", "#FDF3EC", "#D78C6B", "#A65D43", "#C98D5C", "#5B3023"),
    ("아이스 블루", "ICE", "light", "modern", "#F2F6FA", "#6C8EB6", "#AABDD2", "#C2CBD6", "#21354F"),
    ("로제 브론즈", "ROSE", "light", "classic", "#FBF4F2", "#B3626E", "#9A7A5E", "#B88A60", "#4C2230"),
    ("올리브 샴페인", "OLIVE", "light", "geo", "#F7F5EB", "#868C58", "#C1AA6A", "#C4AC70", "#3A3D20"),
    ("플럼 샴페인", "PLUM", "night", "bold", "#1D1520", "#D2B27E", "#B67C9A", "#DDC08C", "#EAD6AE"),
    ("누드 모카", "NUDE", "light", "minimal", "#F8F1EA", "#A47F67", "#7B5A48", "#B89B7B", "#42302A"),
    ("오팔 펄", "OPAL", "light", "playful", "#F8F7F5", "#9A9DBA", "#D6B7A8", "#C6B9AF", "#3C3F5C"),
    # ── 여름 13~24
    ("네이비 샴페인", "NAVY", "night", "classic", "#0F1A2E", "#CDB07A", "#7F98C0", "#D7BD88", "#E8DCC0"),
    ("에메랄드 브라스", "EMERALD", "night", "bold", "#0C2A24", "#C0A15A", "#4FA58C", "#CDB06C", "#E6DCB8"),
    ("마린 화이트", "MARINE", "light", "modern", "#F4F8FA", "#1F5C86", "#5BA3C4", "#B7C4CE", "#0F2F4A"),
    ("코발트 아이보리", "COBALT", "light", "bold", "#F9F7F0", "#2848A8", "#D9A441", "#CDAA5D", "#14264F"),
    ("아쿠아 스틸", "AQUA", "light", "geo", "#F0F7F7", "#2F8F9A", "#8FB5BD", "#B2C4C8", "#123D44"),
    ("레몬 크림", "LEMON", "light", "playful", "#FFFBEA", "#E3B21E", "#7C9A6B", "#D2AE4E", "#4A3C0F"),
    ("피스타치오 크림", "PISTACHIO", "light", "playful", "#F7FAEC", "#8DAE5B", "#D6A58A", "#B7B06C", "#34471E"),
    ("스카이 펄", "SKY", "light", "minimal", "#F4F8FC", "#7FA6D2", "#E3B8C5", "#BCC8D6", "#27405F"),
    ("네온 아쿠아", "NEON", "night", "cyber", "#0A1220", "#34E1D0", "#7A6CFF", "#8FEFE6", "#D6FBF6"),
    ("터콰이즈 골드", "TURQUOISE", "light", "classic", "#F5F8F4", "#1D7F7A", "#C2A25A", "#C4A45C", "#16413F"),
    ("코랄 샌드", "CORAL", "light", "geo", "#FBF4EE", "#D96A5B", "#E5B27E", "#C99A62", "#5A2A24"),
    ("선셋 로즈", "SUNSET", "light", "bold", "#FFF4EE", "#D2506A", "#F0A15E", "#D4A265", "#5B1E33"),
    # ── 가을 25~37
    ("버건디 샴페인", "BURGUNDY", "light", "classic", "#F8F2EC", "#6E1F33", "#B08D57", "#C0A064", "#3E1220"),
    ("코퍼 차콜", "COPPER", "night", "modern", "#181717", "#C2794F", "#8E8B86", "#D18B62", "#EFE0D2"),
    ("올리브 브론즈", "BRONZE", "light", "geo", "#F5F2E8", "#6D6A2E", "#B38B4D", "#B68F52", "#302F14"),
    ("코냑 크림", "COGNAC", "light", "classic", "#FAF3EA", "#9C5328", "#D2A25E", "#C48F4F", "#4A2511"),
    ("임페리얼 퍼플", "IMPERIAL", "night", "bold", "#1B1030", "#C9A24B", "#8F6CD2", "#D8B766", "#EADFC2"),
    ("머스터드 네이비", "MUSTARD", "light", "playful", "#FBF6E6", "#D0A02A", "#2E3A5C", "#C8A040", "#262F4D"),
    ("토프 아이보리", "TAUPE", "light", "minimal", "#F6F2EC", "#8C7A6B", "#B7A692", "#B09C7C", "#3B322B"),
    ("와인 로즈", "WINE", "light", "modern", "#F9F1F0", "#8A2D45", "#D69AA3", "#C79A82", "#451524"),
    ("포레스트 골드", "FOREST", "night", "classic", "#0F1F18", "#C6A55E", "#5F8F6E", "#D3B873", "#E7DDB8"),
    ("오닉스 골드", "ONYX", "night", "bold", "#0D0D0F", "#D4AF5A", "#8C8C92", "#E0C070", "#F0E3BD"),
    ("앰버 스모크", "AMBER", "night", "geo", "#1A1410", "#E0963A", "#A8715A", "#E8A94E", "#F2DFC3"),
    ("시나몬 로즈", "CINNAMON", "light", "minimal", "#FAF2EE", "#A9604E", "#CFA08C", "#BF9072", "#4A281F"),
    ("퓨터 실버", "PEWTER", "light", "cyber", "#F3F3F2", "#6F7A86", "#A9B2BC", "#B5BCC4", "#272E36"),
    # ── 겨울 38~49
    ("미드나잇 실버", "MIDNIGHT", "night", "cyber", "#0B1022", "#A9B8D9", "#6C7BFF", "#C4CEE6", "#E3E9F6"),
    ("모노 블랙", "MONO", "light", "minimal", "#F7F7F5", "#1C1C1E", "#8E8E93", "#B5B5B5", "#1C1C1E"),
    ("플래티넘 아이스", "PLATINUM", "light", "cyber", "#F1F4F7", "#5E7894", "#38B6CF", "#BCC6D0", "#1F3045"),
    ("제이드 실버", "JADE", "night", "classic", "#0D2521", "#BFC9C6", "#3F9C85", "#CDD6D3", "#E4ECE9"),
    ("크림슨 골드", "CRIMSON", "light", "bold", "#FAF3F1", "#B3202F", "#1F2A44", "#C6A15B", "#3A0F16"),
    ("샴페인 누아르", "NOIR", "night", "classic", "#131211", "#D9C39A", "#A58D68", "#E6D3AB", "#F3EBDD"),
    ("베이비 블루", "BABY", "light", "playful", "#FBF9F2", "#8DB6E0", "#F0C7A9", "#C9BFA6", "#2C4468"),
    ("로즈 쿼츠", "QUARTZ", "light", "minimal", "#FBF3F4", "#D59AA9", "#A9A3C4", "#C9B2A8", "#5A3341"),
    ("다크 로즈골드", "ROSEGOLD", "night", "modern", "#1C1517", "#D49A8A", "#9E7B84", "#E0AB9B", "#F1DDD6"),
    ("일렉트릭 바이올렛", "VIOLET", "night", "cyber", "#0E0A1E", "#8F6BFF", "#2EE6C9", "#B7A3FF", "#E6DEFF"),
    ("스노우 포레스트", "SNOW", "light", "geo", "#F4F7F5", "#2F5D4A", "#A9BFB4", "#B3B9A8", "#17342A"),
    ("골든 레드", "LUCKY", "night", "bold", "#1E0B10", "#E2B659", "#C0283C", "#EAC871", "#F6E3B4"),
]
assert len(LUX) == 50 and len({t[0] for t in LUX}) == 50 and len({t[1] for t in LUX}) == 50, "팔레트 이름·낱말이 50개가 아니거나 중복"

DARK_TXT, LIGHT_TXT = "#1A1613", "#FFFFFF"


def _rgb(h):
    return tuple(int(h[k:k + 2], 16) / 255 for k in (1, 3, 5))


def _hex(rgb):
    return "#%02X%02X%02X" % tuple(max(0, min(255, round(c * 255))) for c in rgb)


def _hls(h):
    r, g, b = _rgb(h)
    hh, l, s = colorsys.rgb_to_hls(r, g, b)
    return hh * 360, l, s


def _mk(h, l, s):
    return _hex(colorsys.hls_to_rgb((h % 360) / 360.0, max(0, min(1, l)), max(0, min(1, s))))


def mix(a, b, t):
    """a 에서 b 쪽으로 t(0~1)만큼 섞은 색"""
    ra, rb = _rgb(a), _rgb(b)
    return _hex(tuple(x + (y - x) * t for x, y in zip(ra, rb)))


def luminance(h):
    def f(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (f(c) for c in _rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def on_color(bg):
    """이 색 위에 올릴 글자색(어두운 글자·흰 글자 중 대비가 큰 쪽)"""
    return DARK_TXT if contrast(bg, DARK_TXT) >= contrast(bg, LIGHT_TXT) else LIGHT_TXT


def palette(i):
    name, word, mode, vibe, bg, main, accent, gold, deep = LUX[i]
    night = mode == "night"
    hd, ld, sd = _hls(deep)
    hb, lb, sb = _hls(bg)
    if night:
        page = bg
        panel = _mk(hb, min(0.5, lb + 0.045), sb)
        out = {
            "ink": mix(deep, "#FFFFFF", 0.72), "white": panel, "bg": page, "deep": deep, "deep2": _mk(hb, lb * 0.62, sb),
            "soft": _mk(hb, min(0.6, lb + 0.10), sb), "sky": mix(accent, bg, 0.30),
        }
        out["snow"] = out["ink"]
        out["snow2"] = mix(out["ink"], bg, 0.28)
        out["snow3"] = mix(out["ink"], bg, 0.50)
        panel_for_main = panel
    else:
        out = {
            "ink": _mk(hd, min(sd, 0.25), 0.13), "white": mix(bg, "#FFFFFF", 0.72), "bg": bg, "deep": deep,
            "deep2": _mk(hd, min(sd, 0.50), max(0.07, ld * 0.62)), "soft": mix(bg, main, 0.20), "sky": mix(accent, bg, 0.45),
        }
        out["snow"] = "#FFFFFF"
        out["snow2"] = mix("#FFFFFF", out["deep2"], 0.22)
        out["snow3"] = mix("#FFFFFF", out["deep2"], 0.42)
        panel_for_main = out["white"]
    out.update({
        "name": name, "word": word, "mode": mode, "vibe": vibe, "night": night, "season": pk.season_of(i), "hue": _hls(main)[0],
        "main": main, "accent": accent, "gold": gold,
        "onmain": on_color(main), "onaccent": on_color(accent),
        # 번호·큰 글자에 쓸 색: 주색이 바탕과 대비가 모자라면 진한 색으로
        "numc": "main" if contrast(main, panel_for_main) >= 3.0 else "deep",
    })
    return out


def vibe_rank(i):
    """같은 분위기 팔레트 중 몇 번째인지(구도를 돌려 쓰기 위해)"""
    v = LUX[i][3]
    return sum(1 for k in range(i) if LUX[k][3] == v)
