"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { track } from "@/features/analytics/track";
import { buttonClass } from "@/components/ui/styles";

// 미리보기 그림을 누르면 큰 그림이 창으로 열리고, 닫기 버튼·바깥 클릭·Esc 키로 닫힙니다. 연 횟수는 통계(preview)에 자료 제목으로 기록됩니다.
export function ZoomThumb({ thumb, large, alt, title, aspect = 794 / 1123 }: { thumb: string; large: string; alt: string; title: string; aspect?: number }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => { setOpen(true); track("preview", title); }} aria-label={`${title} 미리보기 크게 보기`} style={{ aspectRatio: aspect }} className="relative block w-full cursor-zoom-in bg-paper-gray">
        <Image src={thumb} alt={alt} fill sizes="(min-width:1024px) 20vw, (min-width:640px) 33vw, 50vw" className="object-cover" />
      </button>
      <dialog ref={ref} onClose={() => setOpen(false)} onClick={(e) => { if (e.target === ref.current) setOpen(false); }} aria-label={`${title} 미리보기`}
        className="m-auto max-h-[94vh] w-[min(94vw,900px)] overflow-hidden rounded-card bg-paper p-0 backdrop:bg-black/60">
        {open && (
          <div className="flex max-h-[94vh] flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-2">
              <p className="text-sm font-bold text-ink">{title}</p>
              <button type="button" onClick={() => setOpen(false)} autoFocus className={buttonClass("outline", "sm", "min-w-[44px] !px-3")}>닫기</button>
            </div>
            <div className="overflow-y-auto bg-paper-gray">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={large} alt={`${alt} (큰 그림)`} className="block h-auto w-full" />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
