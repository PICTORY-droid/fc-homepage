"use client";
import { useRef, type ReactNode } from "react";

interface Props { src: string; alt: string; width: number; height: number; /** 있으면 미리보기 자리에 이 일러스트를 보여 주고, 누르면 공식 안내 이미지(src)를 크게 보여 줍니다. */ art?: ReactNode }

// 상품 안내 이미지 — 작은 미리보기 카드, 누르면 크게 보기(네이티브 dialog: Esc·포커스 이동 기본 지원)
export function ProductPoster({ src, alt, width, height, art }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const open = () => dialog.current?.showModal();
  const close = () => dialog.current?.close();

  return (
    <div className="mx-auto w-full max-w-[15rem] lg:mx-0 lg:h-full lg:max-w-none">
      <button type="button" onClick={open} aria-haspopup="dialog"
        className="group relative block w-full overflow-hidden lg:h-full rounded-card border border-ink/10 bg-paper shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
        {art ?? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} width={width} height={height} className="block w-full lg:h-full lg:object-cover lg:object-top" />
        )}
        <span aria-hidden="true" className="absolute right-2 top-2 rounded-full bg-ink/75 px-3 py-1 text-xs font-bold text-white">{art ? "🔍 공식 안내 이미지" : "🔍 크게 보기"}</span>
      </button>

      <dialog ref={dialog} aria-label={`${alt} 크게 보기`}
        onClick={(e) => { if (e.target === dialog.current) close(); }} // 바깥(배경)을 누르면 닫힘
        className="m-auto max-h-[94vh] max-w-[94vw] overflow-auto rounded-card bg-paper p-2 backdrop:bg-ink/70 backdrop:backdrop-blur-sm">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} width={width} height={height} className="mx-auto block max-h-[86vh] w-auto max-w-full rounded-xl" />
          <button type="button" onClick={close} autoFocus
            className="mt-2 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand text-base font-bold text-ink hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink">
            닫기
          </button>
        </div>
      </dialog>
    </div>
  );
}
