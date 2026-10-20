"use client";
import { useMemo, useState } from "react";
import { DownloadCard } from "./DownloadCard";
import { stationeryCoverFile, stationeryCoverName, stationeryDownloadName, stationeryFile, type Stationery } from "@/config/stationery";

export interface SubOption { key: string; label: string }

/** 편지지 목록 — 세부 묶음(sub)이 있으면 위에 고르는 알약을 보여 주고, 고른 묶음만 보여 줍니다. */
export function StationeryGrid({ items, subs }: { items: Stationery[]; subs: SubOption[] }) {
  const [sub, setSub] = useState<string>("all");
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const it of items) if (it.sub) c[it.sub] = (c[it.sub] ?? 0) + 1;
    return c;
  }, [items]);
  const shown = sub === "all" ? items : items.filter((it) => it.sub === sub);
  const chip = (key: string, label: string, count: number) => (
    <button key={key} type="button" onClick={() => setSub(key)} aria-pressed={sub === key}
      className={`min-h-[44px] rounded-full border px-4 text-sm font-bold ${sub === key ? "border-brand bg-brand text-ink" : "border-ink/25 bg-paper text-ink hover:bg-paper-gray"}`}>
      {label} {count}
    </button>
  );
  return (
    <>
      {subs.length > 0 && (
        <div role="group" aria-label="세부 주제 고르기" className="mb-5 flex flex-wrap gap-2">
          {chip("all", "전체", items.length)}
          {subs.filter((s) => counts[s.key]).map((s) => chip(s.key, s.label, counts[s.key]))}
        </div>
      )}
      <ul data-reveal="stagger" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {shown.map((it) => (
          <DownloadCard key={it.id} title={it.name} desc={it.tag} thumb={stationeryFile(it, "jpg")} zoom={stationeryFile(it, "png")}
            links={[
              { label: "Word", href: stationeryFile(it, "docx"), filename: stationeryDownloadName(it, "docx") },
              { label: "PNG", href: stationeryFile(it, "png"), filename: stationeryDownloadName(it, "png") },
              { label: "엽서", href: stationeryCoverFile(it), filename: stationeryCoverName(it) },
            ]} />
        ))}
      </ul>
    </>
  );
}
