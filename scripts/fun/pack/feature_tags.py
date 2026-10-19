"""엑셀 카드 밑에 보이는 기능 문구. 각 양식(생성 코드)에 실제로 들어 있는 구성에서 뽑아 카드마다 다르게 만듭니다."""
import xlsx_allowance as A
import xlsx_gift as G
import xlsx_ledger as L
import xlsx_policy as P
import xlsx_quote as Q
import xlsx_saving as S

CH = {"column": "세로 막대", "bar": "가로 막대", "line": "꺾은선", "area": "영역", "pie": "원", "doughnut": "도넛"}


def _c(kind, sub=None):
    """차트 종류 → '꺾은선 그래프' 같은 말"""
    return ("누적 막대" if (kind == "column" and sub == "stacked") else CH[kind]) + " 그래프"


def tag(key, i):
    """key: 항목 키, i: 0~49 (pack_kit.THEMES 순서)"""
    if key == "ledger":
        t = L.TYPES[i % 5]
        m, ms, c = L.COMBOS[i // 5]
        return f"{t['exp'][0][0]}·{t['exp'][1][0]} 분류 · 월별 {_c(m, ms)} · 분류별 {_c(c)} · 예산 비교"
    if key == "policy":
        _, people = P.FLAVORS[i % 5]
        k, w = P.PAIRS[i // 5]
        return f"{'·'.join(people[:3])} 구분 · 종류별 {_c(k)} · 대상별 {_c(w)} · 만기 자동 계산"
    if key == "saving":
        sub = i // 5
        rate = round(0.032 + (sub % 4) * 0.004, 3)
        ct, cs = S.CHARTS[sub]
        goal, base = S.GOALS[i % 5]
        monthly = int(round(base * S.SCALE[sub], -4)) // 10000
        return f"{goal} 월 {monthly}만원 · {S.MONTHS[sub]}개월 · 연 {rate * 100:.1f}% 계산 · 원금·이자 {_c(ct, cs)} · 달성률"
    if key == "gift":
        k, r = G.PAIRS[i // 5]
        return f"{G.FOCUS[i % 5][0]} 목록 · 종류별 {_c(k)} · 관계별 {_c(r)} · 이름 조회"
    if key == "allowance":
        _, cats, _, _ = A.AGES[i % 5]
        p, m = A.CHARTS[i // 5]
        return f"{'·'.join(cats[:3])} 분류 · 지출 {_c(p)} · 월별 {_c(m)} · 저금 목표"
    if key == "quote":
        trade, _ = Q.TRADES[i % 5]
        items = Q.ITEMS[i % 5]
        r = (i // 5) % len(items)
        items = items[r:] + items[:r]
        return f"{trade} · {items[0][0]}, {items[1][0]} 등 품목 선택 · 단가·부가세 자동 계산"
    raise KeyError(key)
