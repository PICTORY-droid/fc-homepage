import Image from "next/image";
import Link from "next/link";
import { SHEET_ASPECT, collectionCardThumb, collectionPath, type SheetCollection } from "@/config/sheets";

// 테마 모음 카드 — 서식 카드와 같은 크기의 미리보기 + 이름 + '디자인 50가지 보기'. 누르면 테마 모음 페이지로 이동합니다. (표시만 담당)
export function CollectionCard({ c }: { c: SheetCollection }) {
  return (
    <li className="overflow-hidden rounded-card border border-ink/10 bg-paper">
      <Link href={collectionPath(c)} className="flex h-full flex-col">
        <div className="relative w-full bg-paper-gray" style={{ aspectRatio: SHEET_ASPECT }}>
          <Image src={collectionCardThumb(c, 1)} alt={`${c.item.title} 테마 모음 미리보기`} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw" className="object-cover" />
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-paper">테마 {c.count}가지</span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-base font-bold text-ink">{c.item.title}</h3>
          <p className="mt-1 flex-1 text-sm leading-snug text-ink-sub">{c.item.short}</p>
          <p className="mt-2 text-sm font-semibold text-brand-deep">디자인 {c.count}가지 보기</p>
        </div>
      </Link>
    </li>
  );
}
