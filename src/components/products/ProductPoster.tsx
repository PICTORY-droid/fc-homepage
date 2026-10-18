"use client";
import { useRef } from "react";

interface Props { src: string; alt: string; width: number; height: number }

// 상품 안내 이미지 — 작은 미리보기 카드, 누르면 크게 보기(네이티브 dialog: Esc·포커스 이동 기본 지원)
export function ProductPoster({ src, alt, width, height }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const open = () => dialog.current?.showModal();
  const close = () => dialog.current?.close();

  return (
    <div className="mx-auto w-full max-w-[15rem] md:mx-0">
      <button type="button" onClick={open} aria-haspopup="dialog"
        className="group relative block w-full overflow-hidden rounded-card border border-ink/10 bg-paper shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} width={width} height={height} className="block w-full" />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-3 pb-3 pt-8 text-center text-sm font-bold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100">
          🔍 크게 보기
        </span>
      </button>
      <p className="mt-2 text-center text-xs text-ink-sub">이미지를 누르면 크게 볼 수 있어요</p>

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
