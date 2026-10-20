// 장면(풍경) 그림 도구 — 200x200 둥근 사각 안에 하늘·땅·소재를 그립니다.
import { circle, ellipse, rect, path, g, star, mix, rng, cloud as kcloud } from "../../seasons/kit.mjs";
export { circle, ellipse, rect, path, g, star, mix, rng };

export const SKY = {
  day: ["#6cc3ff", "#eaf8ff"], sunset: ["#ff8f7a", "#ffe9a8"], dusk: ["#7a64d8", "#ffb8c9"], night: ["#16225a", "#5a6fd0"], dawn: ["#ffc2d6", "#fff6d2"],
  gray: ["#aab9cf", "#eef2f8"], teal: ["#4fcfd3", "#e8fbfb"], pink: ["#ffb3d1", "#fff0f6"], gold: ["#ffcf6b", "#fff6dc"], mint: ["#9fe6c8", "#f2fff9"], lav: ["#b9a6ff", "#f3eeff"], deep: ["#2d3f9c", "#8fb4ff"],
};
export const sc = (key, sky, inner) => `<defs><linearGradient id="g_${key}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient><clipPath id="c_${key}"><rect width="200" height="200" rx="16"/></clipPath></defs><g clip-path="url(#c_${key})"><rect width="200" height="200" fill="url(#g_${key})"/>${inner}</g>`;

export const sun = (x, y, r, c = "#ffd54f") => circle(x, y, r * 1.9, c, 'opacity=".22"') + circle(x, y, r * 1.35, c, 'opacity=".35"') + circle(x, y, r, c);
export const moon = (x, y, r, c = "#fff7c2") => circle(x, y, r * 1.7, c, 'opacity=".2"') + circle(x, y, r, c) + circle(x + r * 0.35, y - r * 0.2, r * 0.8, "none") + circle(x - r * 0.3, y + r * 0.2, r * 0.18, mix(c, "#d6c36a", 0.35), 'opacity=".5"');
export const stars = (n, seed = 3, y1 = 0, y2 = 110, c = "#fff") => { const r = rng(seed); return Array.from({ length: n }, () => { const x = r() * 200, y = y1 + r() * (y2 - y1); return r() > 0.7 ? star(x, y, 3 + r() * 3, c, 0.95) : circle(x, y, 0.8 + r() * 1.2, c, 'opacity=".9"'); }).join(""); };
export const cl = (x, y, s = 0.3, c = "#fff", o = 0.95) => kcloud(x, y, s, c, o);
export const hill = (y, c, amp = 14, ph = 0, k = 1) => path(`M-10 ${y + Math.sin(ph) * amp} Q${50} ${y - amp * k + Math.sin(ph + 1) * amp * 0.5} 100 ${y + Math.sin(ph + 2) * amp * 0.5} T210 ${y + Math.sin(ph + 3) * amp} V210 H-10Z`, c);
export const flat = (y, c) => rect(-5, y, 210, 210 - y, c);
export const sea = (y, c1, c2) => rect(-5, y, 210, 210 - y, c1) + [0, 1, 2, 3].map((i) => path(`M-10 ${y + 8 + i * 14} q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0`, "none", c2, 2.4, 'opacity=".55"')).join("");
export const mount = (cx, by, w, h, c, snow = "") => path(`M${cx - w / 2} ${by} L${cx} ${by - h} L${cx + w / 2} ${by}Z`, c) + (snow ? path(`M${cx - w * 0.14} ${by - h * 0.72} L${cx} ${by - h} L${cx + w * 0.14} ${by - h * 0.72} L${cx + w * 0.05} ${by - h * 0.66} L${cx - w * 0.02} ${by - h * 0.74} L${cx - w * 0.08} ${by - h * 0.65}Z`, snow) : "");
export const pine = (x, y, s, c = "#2f9e6a", t = "#7a5a3a") => g(rect(-2, 0, 4, 10, t) + path("M0 -34 L-12 -10 H12Z", c) + path("M0 -24 L-15 2 H15Z", c) + path("M0 -12 L-18 12 H18Z", mix(c, "#000000", 0.1)), x, y, s);
export const tree = (x, y, s, c = "#58bd6d", t = "#8a6a4a") => g(rect(-2.5, -4, 5, 18, t) + circle(0, -16, 14, c) + circle(-9, -8, 10, mix(c, "#ffffff", 0.12)) + circle(9, -8, 10, mix(c, "#000000", 0.06)), x, y, s);
export const palm = (x, y, s, c = "#3fb57a") => g(path("M0 0 Q6 -22 2 -44", "none", "#a57a4a", 5) + [-50, -20, 10, 40, 70].map((r) => path("M2 -44 Q22 -52 36 -34 Q18 -42 2 -44Z", c, "none", 0, `transform="rotate(${r - 40} 2 -44)"`)).join("") + circle(-2, -42, 3.5, "#7a5a3a") + circle(6, -40, 3.5, "#7a5a3a"), x, y, s);
export const house = (x, y, w, h, wall, roof) => rect(x - w / 2, y - h, w, h, wall) + path(`M${x - w / 2 - 4} ${y - h} L${x} ${y - h - w * 0.42} L${x + w / 2 + 4} ${y - h}Z`, roof) + rect(x - w * 0.12, y - h * 0.5, w * 0.24, h * 0.5, mix(roof, "#000000", 0.2)) + rect(x + w * 0.2, y - h * 0.8, w * 0.18, w * 0.18, "#fff6c9");
export const bird = (x, y, s = 1, c = "#fff") => path(`M${x - 6 * s} ${y} q${3 * s} ${-5 * s} ${6 * s} 0 q${3 * s} ${-5 * s} ${6 * s} 0`, "none", c, 1.8 * s);
export const boat = (x, y, s, hull, sail = "#fff") => g(path("M-14 0 H14 L10 8 H-10Z", hull) + rect(-1, -26, 2, 26, "#6a5a4a") + path("M2 -26 L16 -4 H2Z", sail) + path("M-2 -22 L-12 -4 H-2Z", mix(sail, "#000000", 0.07)), x, y, s);
export const win = (x, y, w, h, c = "#fff0a8") => rect(x, y, w, h, c);
export const lamp = (x, y, s = 1, c = "#ffe27a") => g(rect(-1.5, 0, 3, 22, "#3a3a4a") + circle(0, -2, 6, c) + circle(0, -2, 12, c, 'opacity=".3"'), x, y, s);
export const roofHanok = (cx, by, w, h, c, tileC = "#3b3b4f") => path(`M${cx - w / 2 - 12} ${by + 2} Q${cx - w / 2 + 6} ${by + 2} ${cx - w * 0.3} ${by - h * 0.55} L${cx - w * 0.12} ${by - h} H${cx + w * 0.12} L${cx + w * 0.3} ${by - h * 0.55} Q${cx + w / 2 - 6} ${by + 2} ${cx + w / 2 + 12} ${by + 2} Q${cx} ${by + 8} ${cx - w / 2 - 12} ${by + 2}Z`, tileC) + rect(cx - w * 0.14, by - h - 2, w * 0.28, 4, mix(tileC, "#ffffff", 0.3), 2);
export const hanok = (cx, by, w, h, wall, tileC, post = "#8a4f3a") => rect(cx - w / 2 + 4, by - h * 0.55, w - 8, h * 0.55, wall) + [0, 1, 2, 3, 4].map((i) => rect(cx - w / 2 + 4 + i * ((w - 12) / 4), by - h * 0.55, 3.5, h * 0.55, post)).join("") + rect(cx - w * 0.2, by - h * 0.44, w * 0.4, h * 0.44, mix(wall, "#c9a773", 0.4)) + path(`M${cx - w * 0.2} ${by - h * 0.44} V${by} M${cx} ${by - h * 0.44} V${by}`, "none", post, 2) + roofHanok(cx, by - h * 0.55, w, h * 0.55, wall, tileC);
export const pagoda = (cx, by, s, c, tileC) => g([0, 1, 2, 3].map((i) => { const w = 60 - i * 11, y = -i * 22; return rect(-w * 0.32, y - 14, w * 0.64, 14, c) + roofHanok(0, y - 14, w, 12, c, tileC); }).join("") + rect(-1.5, -100, 3, 14, "#b08a3a") + circle(0, -104, 3.5, "#d9a93a"), cx, by, s);
export const fog = (y, c = "#fff", o = 0.6) => `<ellipse cx="60" cy="${y}" rx="80" ry="8" fill="${c}" opacity="${o}"/><ellipse cx="150" cy="${y + 8}" rx="70" ry="7" fill="${c}" opacity="${o * 0.8}"/>`;
export const glow = (x, y, r, c, o = 0.5) => circle(x, y, r, c, `opacity="${o}"`);
export const dotsRow = (xs, y, r, c) => xs.map((x) => circle(x, y, r, c)).join("");
export const sparkles = (c = "#fff") => star(30, 30, 5, c, 0.9) + star(172, 52, 4, c, 0.8);
