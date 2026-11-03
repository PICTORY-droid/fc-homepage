import Image from "next/image";
import { ZoomThumb } from "./ZoomThumb";
import { DownloadIcon } from "@/components/ui/DownloadIcon";
import { buttonClass, cardClass } from "@/components/ui/styles";

export interface DownloadLink { label: string; href: string; filename?: string }

// 미리보기 + 받기 버튼 카드 — 편지지·이력서 양식·가계부 같은 내려받기 페이지가 같이 씁니다. zoom 을 주면 그림을 눌러 큰 미리보기를 엽니다.
export function DownloadCard({ title, desc, thumb, thumbAlt, zoom, aspect, links }: { title: string; desc: string; thumb?: string; thumbAlt?: string; zoom?: string; aspect?: number; links: DownloadLink[] }) {
  return (
    <li className={`flex flex-col ${cardClass}`}>
      {thumb && zoom && <ZoomThumb thumb={thumb} large={zoom} alt={thumbAlt ?? `${title} 미리보기`} title={title} aspect={aspect} />}
      {thumb && !zoom && (
        <div className="relative w-full bg-paper-gray" style={{ aspectRatio: aspect ?? 794 / 1123 }}>
          <Image src={thumb} alt={thumbAlt ?? `${title} 미리보기`} fill sizes="(min-width:1024px) 20vw, (min-width:640px) 33vw, 50vw" className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold text-ink">{title}</h3>
        {desc ? <p className="mt-1 flex-1 text-sm leading-snug text-ink-sub">{desc}</p> : <div className="flex-1" />}
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map((l, i) => (
            <a key={l.href} href={l.href} download={l.filename ?? true}
              className={buttonClass(i === 0 ? "primary" : "outline", "sm", "min-w-[4.25rem] flex-1 gap-1 !px-2")}>
              <DownloadIcon />{l.label}<span className="sr-only"> 받기 ({title})</span>
            </a>
          ))}
        </div>
      </div>
    </li>
  );
}
