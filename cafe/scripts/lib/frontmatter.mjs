// 카페 원고(.md) 머리말 읽기 — "키: 값" 과 "키: [가, 나]" 만 지원하는 작은 해석기입니다. (외부 패키지 없이)
export function parseFrontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) return { meta: null, body: text };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const i = line.indexOf(":");
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    const raw = line.slice(i + 1).trim();
    meta[key] = raw.startsWith("[") && raw.endsWith("]")
      ? raw.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean)
      : raw;
  }
  return { meta, body: m[2] };
}
