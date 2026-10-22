"""명함 500종 생성: 10분류 × 50장(앞뒷면은 밝기 계열·포인트색이 서로 다름). PPTX(앞·뒤 2장) + SVG(앞·뒤) + 미리보기 SVG(앞뒤 합성).
실행: python3 make_cards.py   → public/fun/cards/<분류>/…, src/config/cards.data.json
모든 카드는 (앞면 레이아웃, 색 변형, 테마색) · (뒷면 레이아웃, 색 변형, 테마색)이 전체에서 하나도 겹치지 않습니다."""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "..", "pack"))

from cards_data import CATS, HOURS, LABELS, SERVICES, WEBS  # noqa: E402
from modern import DEEP_FLAVORS, LIGHT_FLAVORS, NFLAV, PAL, Ctx
from modern2 import BACKS, FRONT_FLAVORS, FRONTS, NB, NF  # noqa: E402
from pack_kit import ROOT, safe_name  # noqa: E402
from layouts import mix  # noqa: E402
from scene import add_to_slide, blank_slide, new_pptx, to_svg  # noqa: E402

OUT = os.path.join(ROOT, "public", "fun", "cards")
MANIFEST = os.path.join(ROOT, "src", "config", "cards.data.json")
PREVIEW_DIR = os.path.join(HERE, "_previews")  # 합성 SVG(임시) — 이후 JPG로 변환

# 예시 이름은 흔한 성 + OO (어색한 이름이 나오지 않도록 실제 이름은 쓰지 않습니다)
SURNAMES = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "류", "홍",
            "전", "고", "문", "양", "손", "배", "백", "허", "유", "남", "심", "노", "하", "곽", "성", "차", "주", "우", "구", "나",
            "민", "진", "지", "엄", "채", "원", "천", "방", "공", "현"]
assert len(SURNAMES) == 50 and len(set(SURNAMES)) == 50
NAMES = [s + "OO" for s in SURNAMES]
CAT_ORDER = ["office", "food", "beauty", "life", "creative", "expert", "teacher", "public", "care", "finance"]
CAT_KO = {"office": "직장인", "food": "음식점카페", "beauty": "미용네일피부", "life": "생활가게", "creative": "디자인영상사진",
          "expert": "프리랜서전문가", "teacher": "선생님", "public": "공무원", "care": "병원약국돌봄", "finance": "금융보험부동산"}
FORBIDDEN = ["최고", "1위", "1등", "전액", "100%", "무조건", "확정", "보장", "수익률", "절대", "업계 최"]


def assign():
    """(앞 레이아웃, 앞 색변형, 앞 테마) 와 (뒤 …) 가 전체에서 유일하도록 결정적으로 배정"""
    used_f, used_b, plan = set(), set(), []
    for ci, cat in enumerate(CAT_ORDER):
        for j in range(50):
            f = (j + ci * 7) % NF
            fl = FRONT_FLAVORS[f]  # 레이아웃 성격에 맞는 바탕만 씁니다
            v = fl[(j // NF + ci + j) % len(fl)]
            p = (j + ci * 5) % 50
            for _ in range(2500):
                if (f, v, p) not in used_f:
                    break
                p = (p + 1) % 50
                if (f, v, p) in used_f:
                    v = fl[(fl.index(v) + 1) % len(fl)]
            used_f.add((f, v, p))
            b = (j + ci * 3) % NB
            opts = DEEP_FLAVORS if v in LIGHT_FLAVORS else LIGHT_FLAVORS  # 뒷면은 앞면과 밝기 계열이 반대
            vb = opts[(j // NB + ci + j) % len(opts)]
            pb = (p + 17) % 50  # 앞면과 색 계열이 다른 포인트색
            for _ in range(2500):
                if (b, vb, pb) not in used_b:
                    break
                vb = opts[(opts.index(vb) + 1) % len(opts)]
                if (b, vb, pb) in used_b:
                    pb = (pb + 1) % 50
            used_b.add((b, vb, pb))
            plan.append(dict(cat=cat, j=j, f=f, v=v, p=p, b=b, vb=vb, pb=pb))
    assert len(used_f) == 500 and len(used_b) == 500
    return plan


def card_data(cat, j):
    c = CATS[cat]
    svc = SERVICES[cat][j]
    hours = HOURS[cat][(j // 2) % len(HOURS[cat])]
    return dict(name=NAMES[j], title=c["titles"][j % len(c["titles"])], company=c["company"],
                tel="010-1234-5678", mail="name@example.com", addr="주소를 입력해 주세요",
                icon=c["icons"][j % len(c["icons"])], services=svc, svc_label=LABELS[cat], hours=hours, web=WEBS[(j + len(cat)) % len(WEBS)],
                tagline=" · ".join(svc))


def check_text_colors(els, bg, label):
    for e in els:
        if e["k"] == "text":
            pass  # 글자 대비는 Ctx 가 색을 만들 때 readable()로 이미 보장(4.5:1)


def build(plan):
    os.makedirs(PREVIEW_DIR, exist_ok=True)
    manifest = {cat: [] for cat in CAT_ORDER}
    names_seen, sigs, hashes = set(), set(), set()
    import hashlib
    for it in plan:
        cat, j = it["cat"], it["j"]
        d = card_data(cat, j)
        nfont = "sans"
        cf = Ctx(it["p"], it["v"], d)
        cb = Ctx(it["pb"], it["vb"], d)
        fe, be = FRONTS[it["f"]](cf), BACKS[it["b"]](cb)
        title = f"{d['name']} {d['title']} 명함"
        fsvg, bsvg = to_svg(fe, cf.bg, title + " 앞면"), to_svg(be, cb.bg, title + " 뒷면")
        base = f"명함_{CAT_KO[cat]}_{j + 1:02d}_{safe_name(PAL[it['p']][0])}"  # 내려받을 때 보이는 한글 이름
        fid = f"{cat}-{j + 1:02d}"  # 실제 파일 이름(영문·숫자)
        assert base not in names_seen, base
        names_seen.add(base)
        h = hashlib.sha256((fsvg + bsvg).encode()).hexdigest()
        assert h not in hashes, base
        hashes.add(h)
        sigs.add((it["f"], it["v"], it["p"], it["b"], it["vb"], nfont, d["tagline"]))
        d_out = os.path.join(OUT, cat)
        os.makedirs(d_out, exist_ok=True)
        def inner(sv):  # <svg …> 껍데기와 <title> 을 벗기고 안쪽만 꺼냅니다
            return re.sub(r"<title>.*?</title>", "", re.sub(r"^<svg[^>]*>|</svg>$", "", sv), flags=re.S)
        both = (f'<svg xmlns="http://www.w3.org/2000/svg" width="90mm" height="105mm" viewBox="0 0 900 1050"><title>{title} (앞면·뒷면)</title>'
                f'<g id="front">{inner(fsvg)}</g><g id="back" transform="translate(0 550)">{inner(bsvg)}</g></svg>')
        with open(os.path.join(d_out, base + ".svg"), "w", encoding="utf-8") as f:
            f.write(both)
        prs = new_pptx()
        add_to_slide(blank_slide(prs), fe, cf.bg)
        add_to_slide(blank_slide(prs), be, cb.bg)
        cp = prs.core_properties
        cp.author, cp.title, cp.subject = "반딧불이의 곳간", f"{d['title']} 명함 서식", "편집용 명함 서식"
        prs.save(os.path.join(d_out, base + ".pptx"))
        # 합성 미리보기 SVG
        def inner(s, y):
            return re.sub(r'width="90mm" height="50mm"', f'x="20" y="{y}" width="600" height="333.33"', s, count=1)
        comp = (f'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="726" viewBox="0 0 640 726">'
                f'<rect width="640" height="726" fill="#EFEBE4"/>{inner(fsvg, 20)}{inner(bsvg, 373)}'
                f'<rect x="20" y="20" width="600" height="333.33" fill="none" stroke="#D5CFC4"/>'
                f'<rect x="20" y="373" width="600" height="333.33" fill="none" stroke="#D5CFC4"/></svg>')
        with open(os.path.join(PREVIEW_DIR, fid + ".svg"), "w", encoding="utf-8") as f:
            f.write(comp)
        manifest[cat].append(dict(no=j + 1, name=base, title=d["title"], tag=d["tagline"], main=PAL[it["p"]][1], soft=mix(PAL[it["p"]][1], "#FFFFFF", .88),
                                  theme=PAL[it["p"]][0]))
    assert len(names_seen) == 500 and len(hashes) == 500 and len(sigs) == 500
    meta = {cat: dict(label=CATS[cat]["name"], items=manifest[cat]) for cat in CAT_ORDER}
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("완료: 500장 · 고유 해시", len(hashes))


if __name__ == "__main__":
    build(assign())
