import Image from "next/image";
import { packDownloadName, packFile, packThumb, type PackEntry, type PackItem } from "@/config/pack";

const BUTTON: Record<PackItem["ext"], string> = { xlsx: "엑셀", pptx: "PPT", docx: "Word", svg: "SVG" };

// 자료 꾸러미 카드 — 미리보기 그림이 있으면 그림, 없으면 테마 색 견본을 보여 주고 한글 파일 이름으로 내려받게 합니다.
export function PackCard({ item, entry }: { item: PackItem; entry: PackEntry }) {
  const thumb = packThumb(item, entry.no);
  const no = String(entry.no).padStart(2, "0");
  return (
    <li className="flex flex-col overflow-hidden rounded-card border border-ink/10 bg-paper">
      {thumb ? (
        <div className="relative w-full bg-paper-gray" style={{ aspectRatio: item.aspect ?? 794 / 1123 }}>
          <Image src={thumb} alt={`${item.title} ${entry.name} 미리보기`} fill unoptimized={item.thumb === "svg"} sizes="(min-width:1024px) 22vw, (min-width:640px) 33vw, 50vw" className="object-cover" />
        </div>
      ) : (
        <div className="relative flex aspect-[4/3] flex-col justify-between p-4" style={{ backgroundColor: entry.soft }}>
          <span className="text-xs font-bold" style={{ color: entry.dark }}>{entry.season} · {entry.flavor}</span>
          <span aria-hidden="true" className="text-5xl font-black leading-none" style={{ color: entry.dark }}>{no}</span>
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2" style={{ backgroundColor: entry.main }} />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold text-ink">{no}. {entry.name}</h3>
        {thumb && <p className="mt-0.5 text-xs font-semibold text-ink-sub">{entry.flavor}</p>}
        <p className="mt-1 flex-1 text-sm leading-snug text-ink-sub">{entry.tag}</p>
        <a href={packFile(item, entry)} download={packDownloadName(item, entry)}
          className="mt-3 flex min-h-[44px] items-center justify-center rounded-xl bg-brand px-2 text-sm font-bold text-ink hover:brightness-95">
          {BUTTON[item.ext]}<span className="sr-only"> ({item.title} {entry.name} 내려받기)</span>
        </a>
      </div>
    </li>
  );
}
