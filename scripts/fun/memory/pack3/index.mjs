// 전통문화 편지지 그림 목록 — 모듈별로 그룹을 묶고, 별칭·빈 그림은 뺍니다.
import * as hanbok from "./hanbok.mjs";
import * as arch from "./arch.mjs";
import * as food from "./food.mjs";
import * as play from "./play.mjs";
import * as music from "./music.mjs";
import * as craft from "./craft.mjs";
import * as festival from "./festival.mjs";
import * as symbol from "./symbol.mjs";
import * as heritage from "./heritage.mjs";
import * as extra from "./extra.mjs";
const SKIP = new Set(["fd_gimchi2", "fd_ssam", "fd_sungnyung", "mu_gwaenggwari2", "cr_norigaeCraft", "cr_dojang", "cr_hwaro", "cr_sopbap", "cr_bangseokjin", "cr_kkotsin2", "cr_nabal2", "cr_hanji", "sy_gaeguri", "sy_baekho"]);
const SCENE_EX = new Set(["ex_bukchon", "ex_seodang", "ex_jangteo", "ex_julDarigi", "ex_hwasal", "ex_hanbokAutumn", "ex_hanbokSeollal", "ex_hanbokSpring", "ex_hanbokWinter", "ex_gaenari"]);
// 화면 필터용 묶음(sub) — 키 접두사로 정하고, 몇몇은 직접 지정합니다.
const SUB_OF = { hb: "hanbok", ar: "hanok", fd: "food", pl: "play", mu: "music", cr: "craft", fe: "season", fs: "season", sy: "symbol", hr: "heritage", hg: "hangul" };
const SUB_OVERRIDE = { ex_bride: "hanbok", ex_groom: "hanbok", ex_dolbok: "hanbok", ex_hanbokAutumn: "hanbok", ex_hanbokSeollal: "hanbok", ex_hanbokSpring: "hanbok", ex_hanbokWinter: "hanbok", ex_bukchon: "hanok", ex_seodang: "play", ex_jangteo: "play", ex_julDarigi: "play", ex_hwasal: "play", ex_gaenari: "season", ex_hamjin: "craft", ex_chorye: "craft", ex_dolsang: "play", ex_jesa: "craft", ex_darye: "craft", hr_hunminjeongeum: "hangul", hr_jikji: "hangul", hr_donguibogam: "hangul", hr_bibim: "craft", hr_gogeum: "heritage", fe_hangulnal: "hangul", cr_buteuk: "hangul", cr_byeoru: "hangul", cr_munbangu: "hangul", hg_calli: "hangul", mu_sijo: "hangul", mu_dongyo: "hangul" };
const subOf = (k) => SUB_OVERRIDE[k] ?? (k.startsWith("ex_") ? "food" : SUB_OF[k.split("_")[0]]);
const take = (mod, group, scene) => Object.entries(mod).filter(([k]) => !SKIP.has(k)).map(([k, fn]) => ({ key: k, sub: subOf(k), scene: scene || SCENE_EX.has(k), hero: fn }));
export const cultureHeroes = [
  ...take(hanbok, "", false), ...take(arch, "hanok", true), ...take(food, "food", false), ...take(play, "play", false),
  ...take(music, "music", false), ...take(craft, "craft", false), ...take(festival, "season", true), ...take(symbol, "symbol", false),
  ...take(heritage, "heritage", false), ...take(extra, "extra", false),
];
