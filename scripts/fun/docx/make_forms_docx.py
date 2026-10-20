"""직업별 이력서·자기소개서 Word 600개 (포지션 30 × 양식 10 × 이력서·자기소개서).
실행: python3 scripts/fun/docx/make_forms_docx.py [--thumbs]
 - public/fun/forms/<이력서|자기소개서>_<포지션>_<1~10>_<양식이름>.docx 를 만들고, --thumbs 면 미리보기 jpg 도 만듭니다.
 - 모든 파일은 (양식 구조, 색 톤)이 서로 달라야 하며, 겹치면 멈춥니다."""
import hashlib
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE))
import cover_layouts, cover_layouts2, resume_layouts, resume_layouts2  # noqa: E402
from guide_page import add_guide  # noqa: E402
from cover_data import Q  # noqa: E402
from doc_blocks import save  # noqa: E402
from resume_data import POSITIONS  # noqa: E402
from skins import SANS, SERIF, skin  # noqa: E402

ROOT = HERE.parents[2]
OUT = ROOT / "public" / "fun" / "forms"
THUMBS = OUT / "thumbs"
LARGE = THUMBS / "large"  # 클릭하면 보이는 큰 미리보기 — 모든 쪽을 세로로 이어 붙인 그림


RESUME_LAYOUTS = resume_layouts.LAYOUTS + resume_layouts2.LAYOUTS
COVER_LAYOUTS = cover_layouts.LAYOUTS + cover_layouts2.LAYOUTS
VARIANTS = 10
# src/config/forms.ts 의 variantNames 와 같아야 합니다 (downloads.test.ts 가 파일 존재를 확인)
RESUME_NAMES = ["정석형", "사이드바형", "타임라인형", "요약형", "카드형", "NCS형", "경력기술서형", "신입활동형", "포트폴리오형", "JSONResume형"]
COVER_NAMES = ["문항형", "줄노트형", "좌우2단형", "STAR형", "서술형", "NCS4문항형", "준비4단계형", "경험3카드형", "두괄식형", "직무매칭형"]


def file_name(kind, pos, v):
    """forms.ts 의 formDownloadName 과 같은 규칙 — 예) 이력서_백엔드개발자_1_정석형.docx"""
    names = RESUME_NAMES if kind == "resume" else COVER_NAMES
    return f"{'이력서' if kind == 'resume' else '자기소개서'}_{pos['name'].replace(' ', '').replace('/', '·')}_{v + 1}_{names[v]}.docx"


KEYS = {}  # 한글 파일 이름(확장자 제외) → 'kind-포지션id-번호' (미리보기 그림 이름)


def skin_for(kind, p, v):
    idx = (3 * p + 7 * v + (13 if kind == "cover" else 0)) % 25
    return skin(idx, SERIF if (p + v) % 2 == 0 else SANS)


def main(thumbs):
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.docx"):
        old.unlink()
    seen, hashes = set(), set()
    for p, (pid, pos) in enumerate(POSITIONS.items()):
        assert pid in Q, pid
        for v in range(VARIANTS):
            for kind, layouts in (("resume", RESUME_LAYOUTS), ("cover", COVER_LAYOUTS)):
                sk = skin_for(kind, p, v)
                sig = (kind, v, sk["idx"], sk["head"])
                assert sig not in seen, f"양식 중복: {pid} {sig}"
                seen.add(sig)
                doc = layouts[v](pos, sk, p) if kind == "resume" else layouts[v](pid, pos["name"], sk, p)
                add_guide(doc, kind, pid, pos["name"], sk)
                path = OUT / file_name(kind, pos, v)
                KEYS[path.stem] = f"{kind}-{pid}-{v + 1}"
                save(doc, path)
                h = hashlib.sha256(zipfile.ZipFile(path).read("word/document.xml")).hexdigest()
                assert h not in hashes, f"내용 중복: {path.name}"
                hashes.add(h)
        print("✔", pid, flush=True)
    print(f"파일 {len(hashes)}개, 서로 다른 양식 {len(seen)}개")
    if thumbs:
        make_thumbs()


def make_large(pdf, key):
    from PIL import Image
    pre = pdf.with_suffix("")
    subprocess.run(["pdftoppm", "-jpeg", "-scale-to-x", "760", "-scale-to-y", "-1", str(pdf), str(pre)], check=True)
    imgs = [Image.open(f) for f in sorted(pdf.parent.glob(f"{pdf.stem}-*.jpg"))]
    sheet = Image.new("RGB", (760, sum(i.height for i in imgs) + 12 * (len(imgs) - 1)), "#E9ECEF")
    y = 0
    for i in imgs:
        sheet.paste(i, (0, y)); y += i.height + 12
    sheet.save(LARGE / f"{key}.jpg", quality=70, optimize=True, progressive=True)
    for f in pdf.parent.glob(f"{pdf.stem}-*.jpg"):
        f.unlink()


def make_thumbs():
    tmp = Path("/tmp/forms_thumbs"); tmp.mkdir(exist_ok=True)
    THUMBS.mkdir(exist_ok=True)
    files = sorted(str(f) for f in OUT.glob("*.docx"))
    # soffice 는 한 번에 많은 파일을 주면 중간에 멈추는 일이 있어, 40개씩 나눠 돌리고 빠진 것은 다시 시도합니다
    for _ in range(4):
        todo = [f for f in files if not (tmp / (Path(f).stem + ".pdf")).exists()]
        if not todo:
            break
        for i in range(0, len(todo), 40):
            subprocess.run(["soffice", "--headless", "-env:UserInstallation=file:///tmp/lo_forms_profile", "--convert-to", "pdf", "--outdir", str(tmp), *todo[i:i + 40]],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=600)
    missing = [f for f in files if not (tmp / (Path(f).stem + ".pdf")).exists()]
    assert not missing, f"PDF 변환 실패 {len(missing)}개: {missing[:3]}"
    pages = {}
    LARGE.mkdir(exist_ok=True)
    for old in list(THUMBS.glob('*.jpg')) + list(LARGE.glob('*.jpg')):
        old.unlink()
    for pdf in sorted(tmp.glob("*.pdf")):
        n = int(subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout.split("Pages:")[1].split()[0])
        pages[KEYS[pdf.stem]] = n
        make_large(pdf, KEYS[pdf.stem])
        subprocess.run(["pdftoppm", "-jpeg", "-jpegopt", "quality=82", "-f", "1", "-l", "1", "-scale-to-x", "420", "-scale-to-y", "-1", str(pdf), str(THUMBS / KEYS[pdf.stem]), "-singlefile"], check=True)
    bad = {k: v for k, v in pages.items() if v > 3}
    print("쪽 수 분포:", {n: sum(1 for v in pages.values() if v == n) for n in sorted(set(pages.values()))}, "| 3쪽 초과:", bad or "없음")


if __name__ == "__main__":
    main("--thumbs" in sys.argv)
