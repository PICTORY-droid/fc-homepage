"""PPT 프리미엄 6항목 × 50종을 public/fun/pack/pptx/<항목>pro/ 에 만들고 미리보기와 목록(pack.data.json 의 pptx-<항목>pro 키)을 추가합니다.
기존 PPT(make_pptx_pack.py)는 건드리지 않습니다.
사용: python3 make_pro_pack.py [항목키 ...]   (생략하면 6항목 모두)

- 디자인 엔진: pro_kit(PPT 기능) · pro_design(디자인 언어) · pro_deck(블록) · pro_items(항목별 구성)
- 미리보기: pro_preview 가 LibreOffice 로 변환하고, pro_check 가 글자 겹침이 없는지 검사합니다."""
import os
import shutil
import subprocess
import sys
import tempfile

import copy_pptx
import pack_kit as pk
import pro_check
import pro_design as D
import pro_items as I
import pro_preview

ITEMS = {
    "talk": (I.build_talk, I.talk_flavor, "발표템플릿"),
    "family": (I.build_family, I.family_flavor, "가족소개"),
    "birthday": (I.build_birthday, I.bday_flavor, "돌잔치"),
    "wedding": (I.build_wedding, I.wed_flavor, "결혼식"),
    "review": (I.build_review, I.review_flavor, "보장점검"),
    "news": (I.build_news, I.news_flavor, "카드뉴스"),
}


def thumbs(files, out_dir, width):
    """각 PPT 첫 장을 JPG 로 — 미리보기용 복사본을 LibreOffice 로 첫 쪽만 PDF 로 바꾼 뒤 pdftoppm."""
    os.makedirs(out_dir, exist_ok=True)
    tmp = tempfile.mkdtemp()
    pro_preview.to_pdf(files, tmp, first_page_only=True)
    for f in files:
        base = os.path.splitext(os.path.basename(f))[0]
        pdf = os.path.join(tmp, base + ".pdf")
        subprocess.run(["pdftoppm", "-jpeg", "-jpegopt", "quality=82", "-singlefile", "-f", "1", "-l", "1", "-scale-to-x", str(width), "-scale-to-y", "-1", pdf, os.path.join(out_dir, base)], check=True)
        bad = pro_check.overlaps(pdf)
        assert not bad, f"{base}: 글자 겹침 {bad[:3]}"
    shutil.rmtree(tmp, ignore_errors=True)


def run(keys):
    for key in keys:
        build, flavor, label = ITEMS[key]
        messages = copy_pptx.COPY[key]
        pk.check_unique(messages, key)
        out = key + "pro"
        d = pk.out_dir("pptx", out)
        shutil.rmtree(d, ignore_errors=True)
        d = pk.out_dir("pptx", out)
        files, entries = [], []
        for i in range(50):
            pal = D.palette(i)
            pal["name"] = copy_pptx.NAMES[i]
            f = os.path.join(d, f"{out}-{i + 1:02d}.pptx")
            build(f, i, pal, messages[i])
            files.append(f)
            entries.append({"no": i + 1, "name": pal["name"], "tag": messages[i], "flavor": flavor(i), "main": pal["main"], "soft": pal["soft"], "dark": pal["deep"], "season": pal["season"]})
        thumbs(files, os.path.join(d, "thumbs"), 480 if key != "news" else 420)
        pk.write_manifest("pptx-" + out, entries)
        print(key, "50개 완료")


if __name__ == "__main__":
    run(sys.argv[1:] or list(ITEMS))
