"""양식 명세 모음 — 분류별 파일의 FORMS 를 번호 순서로 합칩니다."""
from . import insurance, letter, life, money, work

ALL = sorted(insurance.FORMS + money.FORMS + life.FORMS + work.FORMS + letter.FORMS, key=lambda s: s["id"])
assert len({s["id"] for s in ALL}) == len(ALL), "양식 번호가 겹칩니다"
