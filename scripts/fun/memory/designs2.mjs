// 계절과 상관없는 주제 편지지 400장 — 동물 50 · 장소 100 · 날씨 50 · 커피 50 · 창가 50 · 정원/꽃 100
import { pal } from "./base.mjs";
import * as an_a from "./pack2/an_a.mjs"; import * as an_b from "./pack2/an_b.mjs"; import * as an_c from "./pack2/an_c.mjs";
import * as pl_kr from "./pack2/pl_kr.mjs"; import * as pl_life from "./pack2/pl_life.mjs"; import * as pl_world from "./pack2/pl_world.mjs";
import * as wx from "./pack2/wx.mjs"; import * as cf from "./pack2/coffee.mjs"; import { windows } from "./pack2/win.mjs";
import * as fl from "./pack2/fl.mjs"; import * as gd from "./pack2/garden.mjs";
import { animal } from "./pack2/text_animal.mjs"; import { place } from "./pack2/text_place.mjs"; import { weather } from "./pack2/text_weather.mjs";
import { coffee } from "./pack2/text_coffee.mjs"; import { win } from "./pack2/text_window.mjs"; import { flower, garden } from "./pack2/text_garden.mjs";

// ── 색 만들기: 색상(0~359)에서 a(주색)·b(연한 면)·c(보색 포인트)·d(짙은 제목색)·bg(바탕)를 뽑습니다.
const hex = (h, s, l) => { s /= 100; l /= 100; const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return "#" + [f(0), f(8), f(4)].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("").toUpperCase(); };
const NP = 100;
const palettes = Array.from({ length: NP }, (_, i) => {
  const h = (i * 137.508) % 360, s = 62 + (i % 4) * 6, la = 68 + (i % 3) * 3;
  return pal({ a: hex(h, s, la), b: hex(h, 78, 91), c: hex((h + 160) % 360, 62, 72), d: hex(h, 52, 30), bg: hex(h, 100, 97) });
});

// ── 배치: 깔끔한 현대식 8종만 씁니다(우표·우편번호 같은 옛 장식 없음).
// 낱개 그림(동물·커피·꽃)은 꿈결 하늘·안개 달·색 매트까지 11종, 풍경 그림(네모난 장면)은 큰 그림 8종을 씁니다.
const LAYS_SCENE = ["arch", "circle", "card", "corner", "frame", "band", "blob", "slant"];
const LAYS_OBJ = ["dream", "mat", "mist", "arch", "circle", "dream", "card", "mist", "corner", "frame", "mat", "band", "blob", "slant"];
const CATS = {
  animal: { label: "동물", mark: "동물", cls: " 이름 : ", n1: "오늘도", n2: "함께해 줘" },
  place: { label: "장소", mark: "여행", cls: " 이름 : ", n1: "여기 어때?", n2: "같이 가자" },
  weather: { label: "날씨", mark: "날씨", cls: " 이름 : ", n1: "오늘 날씨", n2: "참 좋다" },
  coffee: { label: "커피", mark: "카페", cls: " 이름 : ", n1: "커피 한 잔", n2: "할래?" },
  window: { label: "창가", mark: "창가", cls: " 이름 : ", n1: "창밖을", n2: "봐 봐" },
  flower: { label: "꽃", mark: "꽃말", cls: " 이름 : ", n1: "꽃 한 송이", n2: "드릴게요" },
  garden: { label: "정원", mark: "정원", cls: " 이름 : ", n1: "마당에", n2: "놀러 와" },
};
const heroOf = (mods, key) => { for (const m of mods) if (m[key]) return m[key]; throw new Error("그림을 찾을 수 없음: " + key); };
const OFF = { animal: 0, place: 4, weather: 8, coffee: 2, window: 6, flower: 3, garden: 5 };
const EYE = { animal: "ANIMAL", place: "PLACE", weather: "WEATHER", coffee: "COFFEE", window: "WINDOW", garden: "GARDEN" };
const make = (cat, rows, getHero, offset, scene = () => false) => rows.map(([key, title, tag], i) => {
  const sc = scene(i), lays = sc ? LAYS_SCENE : LAYS_OBJ, lay = lays[(i + OFF[cat]) % lays.length];
  const o = { eyebrow: EYE[cat], editTitle: true };
  return { id: `${cat}-${String(i + 1).padStart(2, "0")}`, season: cat, n: 11 + (offset + i) * 7, title, tag, hero: getHero(key, i), p: palettes[(i * 7 + OFF[cat] * 13 + offset * 3) % NP], layout: lay, scene: sc, ...o };
});
// 정원/꽃은 한 묶음(100장) — 꽃 60 + 정원 40, 번호는 꽃 01~60, 정원 61~100 으로 이어 붙입니다.
const gardenAll = [...flower.map((r) => ["f", ...r]), ...garden.map((r) => ["g", ...r])];
export const designs2 = [
  ...make("animal", animal, (k) => heroOf([an_a, an_b, an_c], k), 0),
  ...make("place", place, (k) => heroOf([pl_kr, pl_life, pl_world], k), 50, () => true),
  ...make("weather", weather, (k) => heroOf([wx], k), 150, () => true),
  ...make("coffee", coffee, (k) => heroOf([cf], k), 200),
  ...make("window", win, (k, i) => windows[i], 250, () => true),
  ...make("garden", gardenAll.map(([, ...r]) => r), (k, i) => (i < flower.length ? heroOf([fl], k) : heroOf([gd], k)), 300, (i) => i >= flower.length),
];
// 배치+색 조합이 겹치면 색을 한 칸씩 옮겨 모두 서로 다르게 만듭니다.
const seen = new Set();
for (const d of designs2) { let k = palettes.indexOf(d.p); while (seen.has(d.layout + "|" + k)) k = (k + 1) % NP; seen.add(d.layout + "|" + k); d.p = palettes[k]; }
