"use client";
import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";
import { Chevron } from "@/components/ui/Chevron";
import { buttonClass, disclosureBodyClass, disclosureClass, disclosureHeadClass, inputClass, pillClass, textLink } from "@/components/ui/styles";
import { filterSections, withMode, type HubEntry, type HubMode, type HubSection } from "@/lib/fun/hubDirectory";

// 즐길거리 첫 페이지 — (종류 고르기) → 검색 → 분류별 토글. 누르면 펼쳐지고 다시 누르면 접혀요. (표시·화면 상태만 담당, 검색 규칙은 lib/fun/hubDirectory.ts)
interface Props {
  sections: HubSection[];
  searchLabel: string; // 예: "직무 검색"
  placeholder: string;
  modes?: HubMode[];
  modeCta?: string; // 종류 카드의 버튼 글자 (예: "직무 고르기")
}

const chip = "inline-flex items-center rounded-full bg-brand-tint px-3 py-1 text-sm font-bold text-brand-deep";

function EntryToggle({ e, open, onToggle, mode }: { e: HubEntry; open: boolean; onToggle: () => void; mode?: string }) {
  const panel = `hub-${useId().replace(/:/g, "")}`;
  return (
    <li className={disclosureClass(open)}>
      <h3>
        {/* 카드 모양 토글 — 위: 제목·설명, 아래: '펼쳐 보기' + 화살표 (간편 계산기 토글과 같은 짜임) */}
        <button type="button" aria-expanded={open} aria-controls={panel} onClick={onToggle} className={`${disclosureHeadClass} min-h-[8.5rem] flex-col gap-3 py-5`}>
          <span className="min-w-0">
            <span className="block text-lg font-bold leading-snug text-ink">{e.title}</span>
            {e.lead && <span className="mt-1 block text-sm font-normal leading-relaxed text-ink-sub">{e.lead}</span>}
          </span>
          <span className="mt-auto flex w-full items-center justify-between">
            <span className="text-sm font-bold text-brand-deep">{open ? "접기" : "펼쳐 보기"}</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-tint"><Chevron open={open} /></span>
          </span>
        </button>
      </h3>
      <div id={panel} hidden={!open} className={disclosureBodyClass}>
        {e.thumbs && e.thumbs.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-2">
            {e.thumbs.map((t) => (
              <div key={t.src} className="relative w-full overflow-hidden rounded-lg border border-ink/10 bg-paper-gray" style={{ aspectRatio: e.thumbAspect ?? 794 / 1123 }}>
                <Image src={t.src} alt={t.alt} fill sizes="(min-width:1024px) 8rem, (min-width:640px) 14vw, 30vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}
        {e.links && e.links.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {e.links.map((l) => (
              <li key={l.href}>
                <Link href={withMode(l.href, mode)} className={pillClass(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {e.cta && (
          <Link href={e.cta.href} className={buttonClass("soft", "sm", e.links?.length ? "mt-4" : "")}>
            {e.cta.label} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </li>
  );
}

export function HubDirectory({ sections, searchLabel, placeholder, modes, modeCta = "고르기" }: Props) {
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  const [mode, setMode] = useState<string | undefined>();
  const listRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  const shown = useMemo(() => filterSections(sections, query), [sections, query]);
  const searching = query.trim().length > 0;
  const allKeys = useMemo(() => sections.flatMap((s) => s.entries.map((e) => e.key)), [sections]);
  const toggle = (key: string) => setOpened((prev) => { const n = new Set(prev); if (n.has(key)) n.delete(key); else n.add(key); return n; });

  const pickMode = (key: string) => {
    setMode(key);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    listRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };
  const modeLabel = modes?.find((m) => m.key === mode)?.label;

  return (
    <div className="space-y-8">
      {modes && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {modes.map((m) => {
            const on = mode === m.key;
            return (
              <li key={m.key}>
                <button type="button" aria-pressed={on} onClick={() => pickMode(m.key)}
                  className={`group flex h-full w-full flex-col items-center gap-4 rounded-card border bg-paper p-6 text-center transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${on ? "border-brand-deep shadow-md" : "border-ink/10"}`}>
                  <span className="flex items-center gap-3">
                    {m.icon && <span aria-hidden="true" className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl transition duration-200 ${on ? "bg-brand" : "bg-brand-soft"}`}>{m.icon}</span>}
                    <span className="text-xl font-bold text-ink">{m.label}</span>
                  </span>
                  <span className="text-sm leading-relaxed text-ink-sub">{m.desc}</span>
                  <span className={buttonClass(on ? "primary" : "soft", "sm", "pointer-events-none")}>{on ? `${m.label} 선택됨` : modeCta} <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span></span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div ref={listRef} className="scroll-mt-24 space-y-4">
        <label htmlFor={inputId} className="sr-only">{searchLabel}</label>
        <div className="relative max-w-md">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-sub"><circle cx="9" cy="9" r="6" /><path d="m14 14 4 4" /></svg>
          <input id={inputId} type="search" value={query} onChange={(ev) => setQuery(ev.target.value.slice(0, 40))} placeholder={placeholder} className={`${inputClass} pl-11`} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {modeLabel && <span className="text-sm text-ink-sub"><b className="text-ink">{modeLabel}</b>로 바로 이동해요</span>}
          {!searching && (
            <span className="ml-auto flex gap-3 text-sm">
              <button type="button" className={textLink} onClick={() => setOpened(new Set(allKeys))}>모두 펼치기</button>
              <button type="button" className={textLink} onClick={() => setOpened(new Set())}>모두 접기</button>
            </span>
          )}
        </div>
        <p role="status" aria-live="polite" className="sr-only">{searching ? shown.length ? "검색 결과를 보여 드려요" : "검색 결과가 없어요" : ""}</p>
      </div>

      {shown.length === 0 ? (
        <div className="rounded-card bg-paper-card p-6 text-center">
          <p className="text-ink">&lsquo;{query}&rsquo;에 맞는 항목이 없어요.</p>
          <button type="button" onClick={() => setQuery("")} className={buttonClass("outline", "sm", "mt-3")}>검색어 지우기</button>
        </div>
      ) : (
        shown.map((s) => (
          <section key={s.key} aria-label={s.label}>
            {s.label && <h2 className="mb-3"><span className={chip}>{s.label}</span></h2>}
            {/* 토글을 카드처럼 2~3칸으로 나란히 — 펼친 카드만 길어지고 옆 카드는 그대로(items-start) */}
            <ul className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {s.entries.map((e) => (
                <EntryToggle key={e.key} e={e} mode={mode} open={searching || opened.has(e.key)} onToggle={() => toggle(e.key)} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
