// 꽃 60종 — 꽃머리 방식(fl_kit)별로 색·모양을 달리해 서로 다른 꽃을 그립니다. 200x200 칸, 오리지널 SVG.
import { rad, cup, rose, ball, spike, trumpet, branch, drop, water, head, hang, fullScene, withStem, bg, stem, leafP, circle, ellipse, rect, path, g, star, mix, GR, GR2 } from "./fl_kit.mjs";

// ── 방사형 16
export const daisy = head(rad({ n: 16, rx: 36, ry: 8, c1: "#ffffff", c2: "#f4f4fa", cen: "#ffd23f", cr: 14, layers: 2 }));
export const sunflower = head(rad({ n: 20, rx: 40, ry: 9, c1: "#ffc61a", c2: "#ffb300", cen: "#7a4a1a", cr: 22, layers: 2, tip: "point", seeds: true }));
export const cosmos = head(rad({ n: 8, rx: 40, ry: 15, c1: "#ff9ec4", c2: "#ffb8d4", cen: "#ffd23f", cr: 9, layers: 1, tip: "notch" }));
export const gerbera = head(rad({ n: 26, rx: 40, ry: 6, c1: "#ff8a3d", c2: "#ffb066", cen: "#5a3a2a", cr: 12, layers: 2 }));
export const chrysanthemum = head(rad({ n: 30, rx: 38, ry: 5.5, c1: "#ffd23f", c2: "#fff08a", cen: "#e8a800", cr: 8, layers: 3 }));
export const dahlia = head(rad({ n: 18, rx: 40, ry: 12, c1: "#ff5d8f", c2: "#ff8fb4", cen: "#ffd23f", cr: 8, layers: 3, tip: "point" }));
export const zinnia = head(rad({ n: 20, rx: 38, ry: 10, c1: "#e8334a", c2: "#ff6a7a", cen: "#ffcf3a", cr: 9, layers: 3 }));
export const marigold = head(rad({ n: 22, rx: 36, ry: 11, c1: "#ff9a1a", c2: "#ffc233", cen: "#d97a00", cr: 8, layers: 3, tip: "notch" }));
export const aster = head(rad({ n: 24, rx: 38, ry: 5.5, c1: "#b08cff", c2: "#d4bcff", cen: "#ffd23f", cr: 10, layers: 2 }));
export const anemone = head(rad({ n: 7, rx: 40, ry: 17, c1: "#ff4d6d", c2: "#ff7a90", cen: "#2a2a3a", cr: 13, layers: 1, dot: "#6a6aa0" }));
export const poppy = head(rad({ n: 5, rx: 42, ry: 22, c1: "#ff3b30", c2: "#ff6a5a", cen: "#2a2230", cr: 9, layers: 2, dot: "#8a8aa0" }));
export const camellia = head(rad({ n: 9, rx: 38, ry: 17, c1: "#e8334a", c2: "#ff6a7a", cen: "#ffd23f", cr: 13, layers: 3 }));
export const portulaca = head(rad({ n: 5, rx: 36, ry: 20, c1: "#e8399f", c2: "#ff7ac4", cen: "#ffd23f", cr: 8, layers: 2, tip: "notch" }));
export const cornflower = head(rad({ n: 12, rx: 38, ry: 8, c1: "#4a7bff", c2: "#8aa8ff", cen: "#2a3a9a", cr: 8, layers: 2, tip: "notch" }));
export const dianthus = head(rad({ n: 10, rx: 36, ry: 12, c1: "#ff6fb5", c2: "#ffb8dc", cen: "#c2185b", cr: 9, layers: 2, tip: "notch" }));
export const pansy = head(rad({ n: 5, rx: 40, ry: 22, c1: "#8a4aff", c2: "#ffd23f", cen: "#fff4a0", cr: 9, layers: 2 }));
// ── 겹꽃 6
export const rosered = head(rose({ c1: "#e0243a", c2: "#ff5a6a", rings: 6, r: 38 }));
export const rosepink = head(rose({ c1: "#ff7ab0", c2: "#ffb0d0", rings: 6, r: 38 }));
export const roseyellow = head(rose({ c1: "#ffc61a", c2: "#ffe066", rings: 6, r: 38, wavy: true }));
export const rosewhite = head(rose({ c1: "#fff4f0", c2: "#ffe0e4", rings: 6, r: 38, wavy: true }));
export const peony = head(rose({ c1: "#ff8fb8", c2: "#ffc2d8", rings: 7, r: 44, wavy: true }));
export const ranunculus = head(rose({ c1: "#ff9a3d", c2: "#ffc27a", rings: 8, r: 34 }));
// ── 컵 6
export const tulipred = head(cup({ c1: "#ff3b4e", c2: "#e0243a" }), { y: 100 });
export const tulipyellow = head(cup({ c1: "#ffd23f", c2: "#ffb300" }), { y: 100 });
export const tulippink = head(cup({ c1: "#ff8fb8", c2: "#ff6aa0", pointy: true }), { y: 100 });
export const crocus = head(cup({ c1: "#9a6aff", c2: "#7a4ae0", w: 20, h: 36 }), { y: 120 });
export const snowdrop = head(cup({ c1: "#ffffff", c2: "#e8f0f0", w: 16, h: 40, pointy: true }), { y: 120 });
export const tulipPurple = head(cup({ c1: "#b45cff", c2: "#8a3ae0", w: 28, h: 44 }), { y: 100 });
// ── 공 6
export const hydrangeablue = head(ball({ c1: "#5a8aff", c2: "#9ab8ff", r: 40, n: 36, fr: 9, star5: true, cen: "#ffe27a" }), { y: 90 });
export const hydrangeapink = head(ball({ c1: "#ff8ab8", c2: "#ffc0da", r: 40, n: 36, fr: 9, star5: true, cen: "#ffe27a" }), { y: 90 });
export const lilac = head(ball({ c1: "#b08cff", c2: "#d4bcff", r: 34, n: 40, fr: 6, star5: true, cen: "#fff" }), { y: 84 });
export const allium = head(ball({ c1: "#b45cff", c2: "#d49aff", r: 36, n: 44, fr: 5, star5: true, cen: "#fff" }), { y: 70, leaves: 2 });
export const pompon = head(ball({ c1: "#ff6a9a", c2: "#ffa0c0", r: 38, n: 60, fr: 7 }), { y: 90 });
export const babybreath = head(ball({ c1: "#ffffff", c2: "#f0f6ff", r: 46, n: 90, fr: 4.4, star5: true, cen: "#ffe27a" }), { y: 90 });
// ── 이삭 6
export const lavender = head(spike({ c1: "#9a6aff", c2: "#c4a0ff", n: 16, len: 96, fr: 6, w: 18 }), { y: 72 });
export const foxglove = head(spike({ c1: "#e86aff", c2: "#ffb0f4", n: 11, len: 98, fr: 8, w: 22, bell: true }), { y: 74 });
export const delphinium = head(spike({ c1: "#3a6aff", c2: "#7aa0ff", n: 12, len: 96, fr: 8, w: 24 }), { y: 74 });
export const gladiolus = head(spike({ c1: "#ff5a3a", c2: "#ff9a6a", n: 9, len: 96, fr: 10, w: 28 }), { y: 74 });
export const hyacinth = head(spike({ c1: "#6a8aff", c2: "#a0b8ff", n: 12, len: 70, fr: 7, w: 24, bell: true }), { y: 96 });
export const lupine = head(spike({ c1: "#ff6aa0", c2: "#8a6aff", n: 14, len: 96, fr: 7, w: 20 }), { y: 74 });
// ── 나팔 8
export const lily = head(trumpet({ c1: "#ffffff", c2: "#fff0f4", n: 6, r: 44, throat: "#ffd23f", wide: 12 }));
export const morningglory = head(trumpet({ c1: "#4a7bff", c2: "#6a9aff", n: 5, r: 40, throat: "#ffffff", wide: 20, round: true, stamen: false }));
export const hibiscus = head(trumpet({ c1: "#ff3b7a", c2: "#ff6a9a", n: 5, r: 44, throat: "#ffd23f", wide: 18, round: true }));
export const daffodil = head(trumpet({ c1: "#ffe066", c2: "#fff08a", n: 6, r: 38, throat: "#ff9a1a", wide: 12, stamen: false }));
export const freesia = head(trumpet({ c1: "#ffb347", c2: "#ffd27a", n: 6, r: 34, throat: "#fff4a0", wide: 10 }));
export const calla = (p) => withStem(p, path("M100 100 Q58 90 62 44 Q100 30 138 56 Q140 96 100 100Z", "#ffffff", "#e8eef0", 2) + path("M100 100 Q100 70 104 46", "none", "#e8eef0", 2) + rect(98, 56, 8, 38, "#ffd23f", 4), { x: 100, y: 100 });
export const tigerlily = head(trumpet({ c1: "#ff7a1a", c2: "#ff9a4a", n: 6, r: 44, throat: "#ffd23f", wide: 11 }));
export const trumpetvine = head(trumpet({ c1: "#ff8a3a", c2: "#ffaa6a", n: 5, r: 38, throat: "#ffe27a", wide: 18, round: true }));
// ── 꽃가지 6
export const cherry = hang(branch({ c1: "#ffc2d8", c2: "#ffe0ec", n: 9, fr: 15 }));
export const plum = hang(branch({ c1: "#ffffff", c2: "#ffe0e8", n: 8, fr: 14, wood: "#5a4a4a" }));
export const azalea = hang(branch({ c1: "#ff5aa8", c2: "#ff8ac4", n: 8, fr: 16 }));
export const magnolia = hang(branch({ c1: "#fff0f6", c2: "#ffc2da", n: 5, fr: 20, five: false }));
export const peachblossom = hang(branch({ c1: "#ff8fb0", c2: "#ffb8d0", n: 9, fr: 14, wood: "#6a4a3a" }));
export const cornelian = hang(branch({ c1: "#ffd23f", c2: "#ffe680", n: 9, fr: 12, wood: "#8a6a4a" }));
// ── 늘어짐 3
export const wisteria = hang(drop({ c1: "#9a6aff", c2: "#c4a0ff", n: 5, len: 90, fr: 7 }));
export const lilyvalley = hang(drop({ c1: "#fff", c2: "#fff", n: 3, len: 80, fr: 6, bell: true }));
export const bleedingheart = hang(drop({ c1: "#ff6aa0", c2: "#ffc0da", n: 3, len: 70, fr: 7 }));
// ── 물 위 3
export const lotus = fullScene(water({ c1: "#ff9ac4", c2: "#ffc8e0", n: 9, r: 52 }));
export const waterlily = fullScene(water({ c1: "#ffffff", c2: "#e0f0ff", n: 8, r: 44 }));
export const lotuswhite = fullScene(water({ c1: "#fff4f8", c2: "#ffd0e0", n: 11, r: 56 }));
