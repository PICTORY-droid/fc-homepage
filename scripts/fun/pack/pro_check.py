"""PDF 로 바꾼 미리보기에서 글자가 겹쳐 보이는 곳을 찾습니다(단어 상자가 서로 크게 겹치면 겹침으로 봄)."""
import re
import subprocess


def overlaps(pdf):
    out = subprocess.run(["pdftotext", "-bbox", pdf, "-"], capture_output=True, text=True).stdout
    bad = []
    for pno, page in enumerate(out.split("<page ")[1:], 1):
        ws = [(float(a), float(b), float(c), float(d), t) for a, b, c, d, t in
              re.findall(r'xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</word>', page)]
        for i in range(len(ws)):
            x0, y0, x1, y1, t = ws[i]
            if (x1 - x0) < 1 or (y1 - y0) < 1:
                continue
            for j in range(i + 1, len(ws)):
                a0, b0, a1, b1, u = ws[j]
                ix, iy = min(x1, a1) - max(x0, a0), min(y1, b1) - max(y0, b0)
                if ix > 0 and iy > 0:
                    area = ix * iy
                    small = min((x1 - x0) * (y1 - y0), (a1 - a0) * (b1 - b0))
                    if small > 0 and area / small > 0.35:
                        bad.append((pno, t, u))
    return bad
