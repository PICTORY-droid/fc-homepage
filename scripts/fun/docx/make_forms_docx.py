"""직업별 이력서·자기소개서 Word 200개 (포지션 20 × 양식 5 × 이력서·자기소개서).
실행: python3 scripts/fun/docx/make_forms_docx.py [--thumbs]
 - public/fun/forms/{resume|cover}-<포지션>-<1~5>.docx 를 만들고, --thumbs 면 미리보기 jpg 도 만듭니다.
 - 모든 파일은 (양식 구조, 색 톤)이 서로 달라야 하며, 겹치면 멈춥니다."""
import hashlib
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE))
import cover_layouts, resume_layouts  # noqa: E402
from cover_data import Q  # noqa: E402
from doc_blocks import save  # noqa: E402
from resume_data import POSITIONS  # noqa: E402
from skins import SANS, SERIF, skin  # noqa: E402

ROOT = HERE.parents[2]
OUT = ROOT / "public" / "fun" / "forms"
THUMBS = OUT / "thumbs"
LARGE = THUMBS / "large"  # 클릭하면 보이는 큰 미리보기 — 모든 쪽을 세로로 이어 붙인 그림


def skin_for(kind, p, v):
    idx = (3 * p + 7 * v + (13 if kind == "cover" else 0)) % 25
    return skin(idx, SERIF if (p + v) % 2 == 0 else SANS)


def main(thumbs):
    OUT.mkdir(parents=True, exist_ok=True)
    seen, hashes = set(), set()
    for p, (pid, pos) in enumerate(POSITIONS.items()):
        assert pid in Q, pid
        for v in range(5):
            for kind, layouts in (("resume", resume_layouts.LAYOUTS), ("cover", cover_layouts.LAYOUTS)):
                sk = skin_for(kind, p, v)
                sig = (kind, v, sk["idx"], sk["head"])
                assert sig not in seen, f"양식 중복: {pid} {sig}"
                seen.add(sig)
                doc = layouts[v](pos, sk, p) if kind == "resume" else layouts[v](pid, pos["name"], sk, p)
                path = OUT / f"{kind}-{pid}-{v + 1}.docx"
                save(doc, path)
                h = hashlib.sha256(zipfile.ZipFile(path).read("word/document.xml")).hexdigest()
                assert h not in hashes, f"내용 중복: {path.name}"
                hashes.add(h)
        print("✔", pid, flush=True)
    print(f"파일 {len(hashes)}개, 서로 다른 양식 {len(seen)}개")
    if thumbs:
        make_thumbs()


def make_large(pdf, n):
    from PIL import Image
    pre = pdf.with_suffix("")
    subprocess.run(["pdftoppm", "-jpeg", "-scale-to-x", "900", "-scale-to-y", "-1", str(pdf), str(pre)], check=True)
    imgs = [Image.open(f) for f in sorted(pdf.parent.glob(f"{pdf.stem}-*.jpg"))]
    sheet = Image.new("RGB", (900, sum(i.height for i in imgs) + 12 * (len(imgs) - 1)), "#E9ECEF")
    y = 0
    for i in imgs:
        sheet.paste(i, (0, y)); y += i.height + 12
    sheet.save(LARGE / f"{pdf.stem}.jpg", quality=80, optimize=True)
    for f in pdf.parent.glob(f"{pdf.stem}-*.jpg"):
        f.unlink()


def make_thumbs():
    tmp = Path("/tmp/forms_thumbs"); shutil.rmtree(tmp, ignore_errors=True); tmp.mkdir()
    THUMBS.mkdir(exist_ok=True)
    files = sorted(str(f) for f in OUT.glob("*.docx"))
    subprocess.run(["soffice", "--headless", "-env:UserInstallation=file:///tmp/lo_forms_profile", "--convert-to", "pdf", "--outdir", str(tmp), *files],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    pages = {}
    LARGE.mkdir(exist_ok=True)
    for pdf in sorted(tmp.glob("*.pdf")):
        n = int(subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout.split("Pages:")[1].split()[0])
        pages[pdf.stem] = n
        make_large(pdf, n)
        subprocess.run(["pdftoppm", "-jpeg", "-jpegopt", "quality=82", "-f", "1", "-l", "1", "-scale-to-x", "420", "-scale-to-y", "-1", str(pdf), str(THUMBS / pdf.stem), "-singlefile"], check=True)
    bad = {k: v for k, v in pages.items() if v > 3}
    print("쪽 수 분포:", {n: sum(1 for v in pages.values() if v == n) for n in sorted(set(pages.values()))}, "| 3쪽 초과:", bad or "없음")


if __name__ == "__main__":
    main("--thumbs" in sys.argv)
