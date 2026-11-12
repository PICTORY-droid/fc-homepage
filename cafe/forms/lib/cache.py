"""수식 결과(캐시 값)를 원본 엑셀에 끼워 넣기.

openpyxl 로 만든 파일은 수식만 있고 결과 값이 없어, 휴대폰 미리보기 등에서 빈칸으로 보입니다.
LibreOffice 로 다시 계산한 사본에서 값을 읽어, 원본(서식·유효성 검사·조건부 서식 그대로)의 <c> 에 <v> 를 넣습니다.
"""
import datetime as dt
import shutil
import tempfile
import zipfile
from pathlib import Path

from lxml import etree
from openpyxl import load_workbook

NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
RNS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
EPOCH = dt.datetime(1899, 12, 30)


def _serial(v):
    if isinstance(v, dt.datetime):
        return (v - EPOCH).total_seconds() / 86400
    if isinstance(v, dt.date):
        return (dt.datetime(v.year, v.month, v.day) - EPOCH).days
    if isinstance(v, dt.time):
        return (v.hour * 3600 + v.minute * 60 + v.second) / 86400
    return v


def sheet_paths(z: zipfile.ZipFile) -> dict:
    wbx = etree.fromstring(z.read("xl/workbook.xml"))
    rels = etree.fromstring(z.read("xl/_rels/workbook.xml.rels"))
    target = {r.get("Id"): r.get("Target") for r in rels}
    out = {}
    for s in wbx.iter(f"{{{NS}}}sheet"):
        t = target[s.get(f"{{{RNS}}}id")].lstrip("/")
        out[s.get("name")] = t if t.startswith("xl/") else "xl/" + t
    return out


def inject(orig: Path, recalced: Path) -> int:
    vals = load_workbook(recalced, data_only=True)
    n = 0
    tmp = Path(tempfile.mkdtemp()) / orig.name
    with zipfile.ZipFile(orig) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        paths = sheet_paths(zin)
        by_path = {p: name for name, p in paths.items()}
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename in by_path:
                ws = vals[by_path[item.filename]]
                root = etree.fromstring(data)
                for c in root.iter(f"{{{NS}}}c"):
                    f = c.find(f"{{{NS}}}f")
                    if f is None:
                        continue
                    v = _serial(ws[c.get("r")].value)
                    old = c.find(f"{{{NS}}}v")
                    if old is not None:
                        c.remove(old)
                    if v is None or v == "":
                        c.set("t", "str")
                        ve = etree.SubElement(c, f"{{{NS}}}v")
                        ve.text = ""
                    elif isinstance(v, bool):
                        c.set("t", "b")
                        etree.SubElement(c, f"{{{NS}}}v").text = "1" if v else "0"
                    elif isinstance(v, (int, float)):
                        if "t" in c.attrib:
                            del c.attrib["t"]
                        etree.SubElement(c, f"{{{NS}}}v").text = repr(float(v)) if isinstance(v, float) else str(v)
                    else:
                        c.set("t", "str")
                        etree.SubElement(c, f"{{{NS}}}v").text = str(v)
                    n += 1
                data = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)
            zout.writestr(item, data)
    shutil.move(str(tmp), orig)
    return n
