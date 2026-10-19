"""PPT 6항목 × 50종을 public/fun/pack/pptx/<항목>/ 에 만들고 미리보기(표지 JPG)와 목록(pack.data.json)을 갱신합니다.
사용: python3 make_pptx_pack.py [항목키 ...]   (생략하면 6항목 모두)"""
import os
import shutil
import subprocess
import sys
import tempfile

import json

import copy_pptx
import pack_kit as pk
import pptx_items as I

ITEMS = {
    "talk": (I.build_talk, I.talk_flavor, "발표템플릿"),
    "family": (I.build_family, I.family_flavor, "가족소개"),
    "birthday": (I.build_birthday, I.bday_flavor, "돌잔치"),
    "wedding": (I.build_wedding, I.wed_flavor, "결혼식"),
    "review": (I.build_review, I.review_flavor, "보장점검"),
    "news": (I.build_news, I.news_flavor, "카드뉴스"),
}
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
LABEL = {"talk": "PRESENTATION", "family": "FAMILY ALBUM", "birthday": "FIRST BIRTHDAY", "wedding": "WEDDING", "review": "INSURANCE CHECK", "news": "CARD NEWS"}
MARKS = ["서울", "대전", "광주", "부산", "춘천", "전주", "강릉", "속초", "여수", "경주"]
# 테마(이름) 순서와 같은 표지 그림 — 계절 감성에 맞춘 소재
HERO = ("sp.magnolia sp.sprout sp.cherry sp.rapeseed au.rice sp.umbrella sp.azalea sp.swallow sp.lunch sp.carnation sp.lilac sp.butterfly sp.bicycle "
        "su.rain su.hydrangea su.watermelon su.sunflower su.shell su.firefly sp.rainbow su.fan su.surfboard su.cicada su.windchime su.lotus "
        "au.cosmos au.songpyeon au.persimmon au.pampas ob.mailbox au.ginkgo au.books ob.camera au.dragonfly au.chestnut au.scarecrow ob.pencils ob.roastpotato "
        "wi.snowflake wi.bun wi.fireplace wi.camellia wi.pouch su.milkyway au.teacup wi.tangerine wi.tree wi.cabin wi.snowman wi.sunrise").split()
assert len(HERO) == 50
PROFILE = os.path.join(tempfile.gettempdir(), "lo_pptx_profile")


def thumbs(files, out_dir, width):
    """각 PPT 첫 장을 JPG 로 — LibreOffice 로 첫 쪽만 PDF 로 바꾼 뒤 pdftoppm."""
    os.makedirs(out_dir, exist_ok=True)
    tmp = tempfile.mkdtemp()
    opt = 'pdf:impress_pdf_Export:{"PageRange":{"type":"string","value":"1"}}'
    for k in range(0, len(files), 25):
        subprocess.run(["soffice", f"-env:UserInstallation=file://{PROFILE}", "--headless", "--convert-to", opt, "--outdir", tmp] + files[k:k + 25],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=900, check=False)
    for f in files:
        base = os.path.splitext(os.path.basename(f))[0]
        pdf = os.path.join(tmp, base + ".pdf")
        if not os.path.exists(pdf):
            raise RuntimeError(f"미리보기 변환 실패: {f}")
        subprocess.run(["pdftoppm", "-jpeg", "-jpegopt", "quality=82", "-singlefile", "-f", "1", "-l", "1", "-scale-to-x", str(width), "-scale-to-y", "-1", pdf, os.path.join(out_dir, base)], check=True)
    shutil.rmtree(tmp, ignore_errors=True)


def fresh_palette(i, pal):
    """봄(0~12)은 싱그럽고 향기롭게, 여름(13~24)은 청량하고 맑게 — 색을 더 밝고 또렷하게 바꿉니다. 가을·겨울은 그대로."""
    import colorsys
    name, h, s, l = pk.THEMES[i]
    hx = lambda hh, ss, ll: pk._hex(hh, ss, ll)
    if i < 13:  # 봄: 꽃잎 색 + 새잎 초록
        s2 = min(0.72, s + 0.14)
        pal.update(main=hx(h, s2, 0.55), dark=hx(h, min(0.6, s2), 0.28), soft=hx(h, 0.7, 0.9), pale=hx(h, 0.6, 0.97), accent=hx(128, 0.5, 0.40))
    elif i < 25:  # 여름: 하늘·바다빛으로 한 톤 끌어 오고 맑게
        diff = (195 - h + 540) % 360 - 180  # 하늘·바다 빛(195°) 쪽으로 가장 가까운 방향
        hh = h if 160 <= h <= 260 else (h + diff * 0.6) % 360
        pal.update(main=hx(hh, 0.68, 0.46), dark=hx(hh, 0.7, 0.22), soft=hx(hh, 0.8, 0.9), pale=hx(hh, 0.7, 0.96), accent=hx(190, 0.7, 0.42))
    return pal


def make_covers(key, offset):
    """표지 그림 50장을 만들어 임시 폴더에 둡니다(Playwright + Chromium 필요: PW_PATH, CHROMIUM_PATH)."""
    out = tempfile.mkdtemp(prefix=f"cover_{key}_")
    specs = []
    for i in range(50):
        p = fresh_palette(i, pk.palette(i))
        specs.append({"id": f"{key}-{i + 1:02d}", "wide": key != "news", "style": (i + offset) % 4, "label": LABEL[key], "mark": MARKS[(i + offset) % len(MARKS)],
                      "main": p["main"], "soft": p["soft"], "dark": p["dark"], "pale": p["pale"], "accent": p["accent"], "hero": HERO[i], "season": pk.season_of(i)})
    spec_path = os.path.join(out, "spec.json")
    with open(spec_path, "w", encoding="utf-8") as f:
        json.dump(specs, f, ensure_ascii=False)
    subprocess.run(["node", os.path.join(ROOT, "scripts", "fun", "memory", "covers.mjs"), spec_path, out], check=True, cwd=ROOT)
    return out


def run(keys):
    for key in keys:
        build, flavor, label = ITEMS[key]
        messages = copy_pptx.COPY[key]
        I.COVER["dir"], I.COVER["key"] = make_covers(key, list(ITEMS).index(key)), key
        pk.check_unique(messages, key)
        d = pk.out_dir("pptx", key)
        shutil.rmtree(d, ignore_errors=True)
        d = pk.out_dir("pptx", key)
        files, entries = [], []
        for i in range(50):
            pal = fresh_palette(i, pk.palette(i))
            pal["name"] = copy_pptx.NAMES[i]
            f = os.path.join(d, f"{key}-{i + 1:02d}.pptx")
            build(f, i, pal, messages[i])
            files.append(f)
            entries.append({"no": i + 1, "name": pal["name"], "tag": messages[i], "flavor": flavor(i), "main": pal["main"], "soft": pal["soft"], "dark": pal["dark"], "season": pk.season_of(i)})
        thumbs(files, os.path.join(d, "thumbs"), 480 if key != "news" else 420)
        pk.write_manifest("pptx-" + key, entries)
        print(key, "50개 완료")


if __name__ == "__main__":
    run(sys.argv[1:] or list(ITEMS))
