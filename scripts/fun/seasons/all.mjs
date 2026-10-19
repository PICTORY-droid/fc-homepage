// 편지지 80장 목록 (계절별 20장) — 장마다 id·제목·문구·그림·배치가 다릅니다.
import { springDesigns } from "./spring.mjs";
import { summerDesigns } from "./summer.mjs";
import { autumnDesigns } from "./autumn.mjs";
import { winterDesigns } from "./winter.mjs";

export const allDesigns = [...springDesigns, ...summerDesigns, ...autumnDesigns, ...winterDesigns];
