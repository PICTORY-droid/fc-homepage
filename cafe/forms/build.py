"""무료 양식 자료실 엑셀 만들기 — python3 cafe/forms/build.py [번호 ...]

결과: cafe/forms/out/양식/NN_제목.xlsx, cafe/forms/out/미리보기/NN_제목_1.png, _2.png, report.json
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from lib.banner import BannerMaker  # noqa: E402
from lib.preview import Chrome, sheet_pngs  # noqa: E402
from lib.xl import Book  # noqa: E402
from lib.cache import inject  # noqa: E402
from specs import ALL  # noqa: E402

OUT = HERE / "out"
RECALC = Path("/root/.claude/skills/synced/fc5952c5-73be-43b2-a0ed-378230e24194_abd78265-d1ca-4b1b-b058-3887db3a1b45/xlsx/scripts/recalc.py")


def fname(spec):
    return f"{spec['id']:02d}_{spec['title'].replace(' ', '_').replace('·', '_')}"


def recalc(path: Path) -> dict:
    r = subprocess.run([sys.executable, str(RECALC), str(path), "120"], capture_output=True, text=True, cwd=RECALC.parent)
    try:
        return json.loads(r.stdout)
    except Exception:
        return {"error": r.stdout + r.stderr}


def preview_book(spec, bm):
    """미리보기용 통합 문서 — 시트마다 보여 줄 범위만 한 쪽에, 행·열 머리글을 함께 찍습니다(쪽 번호 = 시트 순서)."""
    b = Book(spec, bm)
    wb = b.build()
    for pv in b.preview:
        ws = wb[pv["sheet"]]
        ws.print_area = pv["range"]
        ws.print_title_rows = None
        ws.print_options.headings = True
        ws.page_setup.fitToHeight = 1
        ws.page_setup.fitToWidth = 1
        ws.oddFooter.center.text = ""
        ws.page_margins.left = ws.page_margins.right = ws.page_margins.top = ws.page_margins.bottom = 0.2
    return wb, b.preview


def main(ids):
    specs = [s for s in ALL if not ids or s["id"] in ids]
    (OUT / "양식").mkdir(parents=True, exist_ok=True)
    (OUT / "미리보기").mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="forms-"))
    report = {}
    with BannerMaker() as bm:
        ch = Chrome(bm.browser)
        for spec in specs:
            spec["_tmp"] = str(tmp / str(spec["id"]))
            Path(spec["_tmp"]).mkdir(parents=True, exist_ok=True)
            name = fname(spec)
            book = Book(spec, bm)
            wb = book.build()
            wb.calculation.fullCalcOnLoad = True
            dst = OUT / "양식" / f"{name}.xlsx"
            wb.save(dst)
            # 검증: 사본을 LibreOffice 로 다시 계산해 오류 0 확인
            chk = tmp / f"{name}_check.xlsx"
            shutil.copy(dst, chk)
            rep = recalc(chk)
            report[name] = {"recalc": rep}
            if rep.get("status") == "success":
                report[name]["cached"] = inject(dst, chk)
            sheets = [s["name"] for s in spec["sheets"]]
            pv_sheets = spec.get("pv", sheets[:2])
            pwb, pvs = preview_book(spec, bm)
            px_ = tmp / f"{name}_pv.xlsx"
            pwb.save(px_)
            recalc(px_)
            pages = sheet_pngs(px_, tmp / f"{name}_pv")
            for k, sh in enumerate(pv_sheets, 1):
                idx = sheets.index(sh)
                pv = pvs[idx]
                v = pwb[sh][pv["cell"]].value
                formula = v if isinstance(v, str) else ("" if v is None else str(v))
                big = spec["cat"] == "편지"  # 편지지는 A4 한 장이 다 보이게
                ch.make(pages[idx], OUT / "미리보기" / f"{name}_{k}.png", f"{name}.xlsx", sheets, sh, pv["cell"], formula,
                        width=1100 if big else 1400, max_h=1500 if big else 760)
            print(name, rep.get("status"), rep.get("total_formulas"), rep.get("total_errors"), flush=True)
    (OUT / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main([int(x) for x in sys.argv[1:]])
