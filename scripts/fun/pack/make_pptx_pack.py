"""PPT 6항목 × 50종을 public/fun/pack/pptx/<항목>/ 에 만들고 미리보기(표지 JPG)와 목록(pack.data.json)을 갱신합니다.
사용: python3 make_pptx_pack.py [항목키 ...]   (생략하면 6항목 모두)"""
import os
import shutil
import subprocess
import sys
import tempfile

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


def run(keys):
    for key in keys:
        build, flavor, label = ITEMS[key]
        messages = copy_pptx.COPY[key]
        pk.check_unique(messages, key)
        d = pk.out_dir("pptx", key)
        shutil.rmtree(d, ignore_errors=True)
        d = pk.out_dir("pptx", key)
        files, entries = [], []
        for i in range(50):
            pal = pk.palette(i)
            f = os.path.join(d, f"{key}-{i + 1:02d}.pptx")
            build(f, i, pal, messages[i])
            files.append(f)
            entries.append({"no": i + 1, "name": pal["name"], "tag": messages[i], "flavor": flavor(i), "main": pal["main"], "soft": pal["soft"], "dark": pal["dark"], "season": pk.season_of(i)})
        thumbs(files, os.path.join(d, "thumbs"), 480 if key != "news" else 420)
        pk.write_manifest("pptx-" + key, entries)
        print(key, "50개 완료")


if __name__ == "__main__":
    run(sys.argv[1:] or list(ITEMS))
