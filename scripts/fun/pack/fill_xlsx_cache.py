"""엑셀 꾸러미 파일에 '계산된 값'을 저장합니다 — make_xlsx_pack.py 다음, koreanize.mjs 전에 실행하세요.

왜 필요한가: XlsxWriter 는 수식의 결과를 계산하지 못해 모든 수식 칸에 0 을 저장합니다.
PC 엑셀·한셀은 열 때 다시 계산하지만, 휴대폰 파일 미리보기·메신저 첨부 미리보기처럼 다시 계산하지 않는 화면에서는 0 으로 보입니다.
이 스크립트는 LibreOffice 로 전체를 다시 계산한 뒤, 그 결과만 각 수식 칸의 저장값(<v>)에 써 넣습니다.
서식·차트·미니 그래프·데이터 막대 등 나머지 XML 은 한 글자도 바꾸지 않습니다. (열 때 다시 계산 설정은 그대로)

사용:  python3 fill_xlsx_cache.py [항목키 ...]    (생략하면 6항목 모두, public/fun/pack/xlsx/<항목>/*.xlsx)
필요:  LibreOffice(soffice)와 python3-uno. 스크립트가 soffice 를 띄우고 끝나면 닫습니다.
"""
from __future__ import annotations

import glob
import html
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import zipfile

import uno  # noqa: E402  (LibreOffice 의 python3-uno)
from com.sun.star.beans import PropertyValue

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
PUB = os.path.join(ROOT, "public", "fun", "pack", "xlsx")
ITEMS = ["ledger", "policy", "saving", "gift", "allowance", "quote"]
PORT = 2002
CELL = re.compile(r'<c r="([A-Z]+)(\d+)"([^>]*)>(<f[^>]*/>|<f[^>]*>.*?</f>)(?:<v>.*?</v>)?</c>', re.S)
VALUE, STRING = 1, 2  # com.sun.star.sheet.FormulaResult


def prop(name, value):
    p = PropertyValue(); p.Name = name; p.Value = value
    return p


def col_index(letters: str) -> int:
    n = 0
    for ch in letters:
        n = n * 26 + (ord(ch) - 64)
    return n - 1


def sheet_paths(z: zipfile.ZipFile) -> dict[str, str]:
    """시트 이름 → 시트 XML 경로"""
    wb = z.read("xl/workbook.xml").decode("utf-8")
    rels = z.read("xl/_rels/workbook.xml.rels").decode("utf-8")
    target = {m.group(1): m.group(2) for m in re.finditer(r'<Relationship Id="([^"]+)"[^>]*Target="([^"]+)"', rels)}
    target.update({m.group(2): m.group(1) for m in re.finditer(r'<Relationship[^>]*Target="([^"]+)"[^>]*Id="([^"]+)"', rels)})
    out = {}
    for m in re.finditer(r'<sheet [^>]*name="([^"]+)"[^>]*r:id="([^"]+)"', wb):
        t = target[m.group(2)]
        out[html.unescape(m.group(1))] = t if t.startswith("xl/") else "xl/" + t.lstrip("/")
    return out


def number(v: float) -> str:
    if v == int(v) and abs(v) < 1e15:
        return str(int(v))
    return repr(v)


def cached_xml(xml: str, sheet) -> tuple[str, int]:
    count = 0

    def repl(m):
        nonlocal count
        col, row, attrs, f = m.group(1), m.group(2), m.group(3), m.group(4)
        cell = sheet.getCellByPosition(col_index(col), int(row) - 1)
        attrs = re.sub(r'\s+t="[^"]*"', "", attrs)
        count += 1
        if cell.getError() != 0:
            raise SystemExit(f"계산 오류가 있는 칸이 있습니다: {sheet.getName()}!{col}{row}")
        if cell.FormulaResultType2 == STRING:
            return f'<c r="{col}{row}"{attrs} t="str">{f}<v>{html.escape(cell.getString(), quote=False)}</v></c>'
        return f'<c r="{col}{row}"{attrs}>{f}<v>{number(cell.getValue())}</v></c>'

    return CELL.sub(repl, xml), count


def fill(desktop, path: str, tmpdir: str) -> int:
    work = os.path.join(tmpdir, "work.xlsx")  # LibreOffice 는 영문 경로에서 여는 것이 안전함
    shutil.copyfile(path, work)
    doc = desktop.loadComponentFromURL(uno.systemPathToFileUrl(work), "_blank", 0, (prop("Hidden", True),))
    try:
        doc.calculateAll()
        out = os.path.join(tmpdir, "out.xlsx")
        total = 0
        with zipfile.ZipFile(path) as zin, zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zout:
            by_path = {p: name for name, p in sheet_paths(zin).items()}
            for info in zin.infolist():
                data = zin.read(info.filename)
                if info.filename in by_path:
                    xml, n = cached_xml(data.decode("utf-8"), doc.Sheets.getByName(by_path[info.filename]))
                    data, total = xml.encode("utf-8"), total + n
                zout.writestr(info, data)
    finally:
        doc.close(True)
    shutil.move(out, path)
    return total


def connect():
    proc = subprocess.Popen(["soffice", "--headless", "--invisible", "--norestore", "--nologo",
                             f"--accept=socket,host=localhost,port={PORT};urp;"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    ctx = uno.getComponentContext()
    resolver = ctx.ServiceManager.createInstanceWithContext("com.sun.star.bridge.UnoUrlResolver", ctx)
    for _ in range(60):
        try:
            rctx = resolver.resolve(f"uno:socket,host=localhost,port={PORT};urp;StarOffice.ComponentContext")
            return proc, rctx.ServiceManager.createInstanceWithContext("com.sun.star.frame.Desktop", rctx)
        except Exception:
            time.sleep(1)
    proc.terminate()
    raise SystemExit("LibreOffice 에 연결하지 못했습니다.")


def main(keys):
    files = [f for k in keys for f in sorted(glob.glob(os.path.join(PUB, k, "*.xlsx")))]
    if not files:
        raise SystemExit("대상 엑셀 파일이 없습니다.")
    proc, desktop = connect()
    try:
        with tempfile.TemporaryDirectory() as tmp:
            for i, f in enumerate(files, 1):
                n = fill(desktop, f, tmp)
                if i % 25 == 0 or i == len(files):
                    print(f"{i}/{len(files)} 완료 (마지막 파일 수식 {n}칸)", flush=True)
    finally:
        try:
            desktop.terminate()
        except Exception:
            pass
        proc.terminate()


if __name__ == "__main__":
    main(sys.argv[1:] or ITEMS)
