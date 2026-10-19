"""엑셀 6항목 × 50종을 public/fun/pack/xlsx/<항목>/ 에 만들고 목록(pack.data.json)을 갱신합니다.
사용: python3 make_xlsx_pack.py [항목키 ...]   (생략하면 6항목 모두)"""
import os
import sys

import copy_xlsx
import pack_kit as pk
import xlsx_allowance, xlsx_gift, xlsx_ledger, xlsx_policy, xlsx_quote, xlsx_saving

ITEMS = {
    "ledger": (xlsx_ledger, copy_xlsx.LEDGER, "가계부"),
    "policy": (xlsx_policy, copy_xlsx.POLICY, "보험증권정리표"),
    "saving": (xlsx_saving, copy_xlsx.SAVING, "저축플래너"),
    "gift": (xlsx_gift, copy_xlsx.GIFT, "경조사비장부"),
    "allowance": (xlsx_allowance, copy_xlsx.ALLOWANCE, "용돈기입장"),
    "quote": (xlsx_quote, copy_xlsx.QUOTE, "견적서"),
}


def run(keys):
    for key in keys:
        mod, messages, label = ITEMS[key]
        pk.check_unique(messages, key)
        d = pk.out_dir("xlsx", key)
        for old in os.listdir(d):
            path = os.path.join(d, old)
            if os.path.isfile(path):  # thumbs/·large/ 미리보기 폴더는 남깁니다
                os.remove(path)
        entries = []
        for i in range(50):
            pal = pk.palette(i)
            fname = f"{key}-{i + 1:02d}.xlsx"
            mod.build(os.path.join(d, fname), i, pal, messages[i])
            entries.append({"no": i + 1, "name": pal["name"], "tag": messages[i], "flavor": mod.flavor(i), "main": pal["main"], "soft": pal["soft"], "dark": pal["dark"], "season": pk.season_of(i)})
        pk.write_manifest("xlsx-" + key, entries)
        print(key, "50개 완료")


if __name__ == "__main__":
    run(sys.argv[1:] or list(ITEMS))
