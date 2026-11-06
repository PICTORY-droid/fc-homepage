// 원고 마크다운 → 스마트에디터에 붙여 넣을 HTML. 지원: ## 소제목, 문단, - 목록, 1. 목록, | 표 |, > 알림 상자, **굵게**, [글](주소)
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** 줄 안 꾸밈 — 주소 바꾸기(linkFn)는 UTM 붙이기 등에 씁니다. */
export function inline(s, linkFn = (u) => u) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${esc(linkFn(u.replace(/&amp;/g, "&")))}">${t}</a>`);
}

/** 본문에 나온 링크 주소 목록 */
export const linksOf = (md) => [...md.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)].map((m) => m[1]);

export function toHtml(md, linkFn) {
  const out = [];
  const lines = md.replace(/\r/g, "").split("\n");
  let i = 0;
  const take = (re) => { const block = []; while (i < lines.length && re.test(lines[i])) block.push(lines[i++]); return block; };
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (/^###\s/.test(l)) { out.push(`<h3>${inline(l.replace(/^###\s+/, ""), linkFn)}</h3>`); i++; continue; }
    if (/^##\s/.test(l)) { out.push(`<h2>${inline(l.replace(/^##\s+/, ""), linkFn)}</h2>`); i++; continue; }
    if (/^>\s?/.test(l)) { const b = take(/^>\s?/); out.push(`<blockquote>${b.map((x) => inline(x.replace(/^>\s?/, ""), linkFn)).join("<br>")}</blockquote>`); continue; }
    if (/^-\s/.test(l)) { const b = take(/^-\s/); out.push(`<ul>${b.map((x) => `<li>${inline(x.replace(/^-\s+/, ""), linkFn)}</li>`).join("")}</ul>`); continue; }
    if (/^\d+\.\s/.test(l)) { const b = take(/^\d+\.\s/); out.push(`<ol>${b.map((x) => `<li>${inline(x.replace(/^\d+\.\s+/, ""), linkFn)}</li>`).join("")}</ol>`); continue; }
    if (/^\|/.test(l)) {
      const rows = take(/^\|/).filter((r) => !/^\|\s*:?-{2,}/.test(r)).map((r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
      const [head, ...body] = rows;
      out.push(`<table><thead><tr>${head.map((c) => `<th>${inline(c, linkFn)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c, linkFn)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
      continue;
    }
    const b = take(/^(?!\s*$)(?!#{2,3}\s)(?!>)(?!-\s)(?!\d+\.\s)(?!\|)/);
    out.push(`<p>${b.map((x) => inline(x, linkFn)).join("<br>")}</p>`);
  }
  return out.join("\n");
}

/** 글자 수(공백 제외) — 정보성 글 분량 확인용 */
export const textLength = (md) => md.replace(/[#>*|\-\s]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").length;

/** 원고 마크다운 → 스마트에디터에 그대로 붙일 '보통 글'(꾸밈 기호 없음). 소제목은 【 】, 표는 한 줄씩 · 로 풉니다. */
export function toPlain(md, linkFn = (u) => u) {
  const out = [];
  let head = null;
  for (const raw of md.replace(/\r/g, "").split("\n")) {
    let l = raw;
    if (/^\|\s*:?-{2,}/.test(l)) continue;
    if (/^\|/.test(l)) {
      const cells = l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      if (!head) { head = cells; continue; }
      l = `· ${cells[0]} — ${cells.slice(1).join(" / ")}`;
    } else head = null;
    const plainPara = !/^(#|-\s|\d+\.\s|>|\|)/.test(raw) && raw.trim() !== "";
    if (plainPara) l = l.replace(/([.!?])\s+(?=\S)/g, "$1\n"); // 보통 문단은 한 문장에 한 줄
    l = l.replace(/^###?\s+(.*)$/, "【$1】").replace(/^-\s+/, "· ").replace(/^>\s?/, "※ ")
      .replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `${t}(${linkFn(u)})`);
    out.push(l);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
