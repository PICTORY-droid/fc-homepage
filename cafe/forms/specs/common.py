"""명세에서 같이 쓰는 조각 — 같은 수식을 여러 양식에 복사하지 않도록 여기서 만듭니다."""
from datetime import date as D, time as Tm  # noqa: F401  (명세 파일에서 함께 씀)

CHECK = ["✔"]
MONTHS = list(range(1, 13))
YEAR = {"key": "yr", "label": "연도", "value": 2026, "fmt": '0"년"', "kind": "int"}
MONTH = {"key": "mo", "label": "월", "value": 11, "fmt": '0"월"', "kind": "int", "opts": [str(i) for i in range(1, 13)]}
GUN = '#,##0"건"'
GAE = '#,##0"개"'
PCT = '0%'


def in_month(date_key, y="{P:yr}", m="{L}"):
    """날짜 열이 그 해·그 달에 드는 조건(SUMIFS·COUNTIFS 뒤쪽 인수)."""
    return '{R:%s},">="&DATE(%s,%s,1),{R:%s},"<"&DATE(%s,%s+1,1)' % (date_key, y, m, date_key, y, m)


def sum_month(head, amt, date_key, extra="", kind="money", y="{P:yr}", m="{L}"):
    return (head, "SUMIFS({R:%s},%s%s)" % (amt, in_month(date_key, y, m), extra), kind)


def cnt_month(head, date_key, extra="", y="{P:yr}", m="{L}"):
    return (head, "COUNTIFS(%s%s)" % (in_month(date_key, y, m), extra), "int")


def bar(x):
    """진행 막대(손으로 칠한 듯한 네모) — x 는 0~1 비율 수식."""
    v = f"MIN(1,MAX(0,{x}))"
    return f'REPT("■",ROUND({v}*10,0))&REPT("□",10-ROUND({v}*10,0))'


def dday(due, done_cond=None):
    """남은 날(D-n). done_cond 가 참이면 빈칸."""
    core = f"{{{due}}}-TODAY()"
    if done_cond:
        return f'IF(OR({{{due}}}="",{done_cond}),"",{core})'
    return f'IF({{{due}}}="","",{core})'


def progress_kpis(item, chk, label="할 일"):
    return [{"label": f"전체 {label}", "f": f"COUNTA({{R:{item}}})", "fmt": GAE},
            {"label": "끝낸 것", "f": f'COUNTIF({{R:{chk}}},"✔")', "fmt": GAE},
            {"label": "진행률", "f": f'IF(COUNTA({{R:{item}}})=0,0,COUNTIF({{R:{chk}}},"✔")/COUNTA({{R:{item}}}))', "fmt": PCT},
            {"label": "진행 막대", "f": bar(f'IF(COUNTA({{R:{item}}})=0,0,COUNTIF({{R:{chk}}},"✔")/COUNTA({{R:{item}}}))'), "fmt": "@"}]


def group_progress(title, label_key, labels, item, chk, chart=True):
    g = {"title": title, "label_h": "구분", "labels": labels, "total": True,
         "cols": [("전체", f"COUNTIFS({{R:{label_key}}},{{L}},{{R:{item}}},\"<>\")", "int"),
                  ("끝낸 것", f'COUNTIFS({{R:{label_key}}},{{L}},{{R:{chk}}},"✔")', "int"),
                  ("진행률", f'IF(COUNTIFS({{R:{label_key}}},{{L}},{{R:{item}}},"<>")=0,0,COUNTIFS({{R:{label_key}}},{{L}},{{R:{chk}}},"✔")/COUNTIFS({{R:{label_key}}},{{L}},{{R:{item}}},"<>"))', "pct")]}
    if chart:
        g["chart"] = {"type": "bar", "col": 0, "title": title}
    return g


def by_label(title, label_h, key, labels, amt=None, chart="bar", amt_h="금액", count_h="건수"):
    cols = [(count_h, f"COUNTIF({{R:{key}}},{{L}})", "int")]
    if amt:
        cols.append((amt_h, f"SUMIF({{R:{key}}},{{L}},{{R:{amt}}})", "money"))
    g = {"title": title, "label_h": label_h, "labels": labels, "total": True, "cols": cols}
    if chart:
        g["chart"] = {"type": chart, "col": 1 if amt else 0, "title": title}
    return g
