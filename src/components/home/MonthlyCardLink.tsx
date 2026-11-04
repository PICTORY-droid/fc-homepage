import Image from "next/image";
import Link from "next/link";

// '이달의 양식' 카드 한 장 — 그림 + 제목만. (표시만 담당, 서버·브라우저 어디서나 씀)
export function MonthlyCardLink({ href, title, thumb }: { href: string; title: string; thumb?: string }) {
  return (
    <Link href={href} data-track="cta" data-label={`home/monthly/${href.replace("/fun/", "")}`}
      className="flex h-full flex-col overflow-hidden rounded-card border border-ink/10 bg-paper transition hover:-translate-y-0.5 hover:shadow-md">
      {thumb && (
        <div className="relative w-full bg-paper-gray" style={{ aspectRatio: 16 / 10 }}>
          <Image src={thumb} alt="" fill sizes="(min-width:640px) 33vw, 100vw" className="object-contain p-2" />
        </div>
      )}
      <div className="p-3"><h3 className="text-base font-bold text-ink">{title}</h3></div>
    </Link>
  );
}
