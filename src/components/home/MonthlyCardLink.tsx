import Image from "next/image";
import Link from "next/link";

// '이달의 양식' 카드 한 장 — 그림 + 제목만. 그림이 두 장이면(편지지) 나란히 놓아 빈 여백 없이 채웁니다. (표시만 담당, 서버·브라우저 어디서나 씀)
export function MonthlyCardLink({ href, title, thumbs }: { href: string; title: string; thumbs: string[] }) {
  const pair = thumbs.length > 1;
  return (
    <Link href={href} data-track="cta" data-label={`home/monthly/${href.replace("/fun/", "")}`}
      className="flex h-full flex-col overflow-hidden rounded-card border border-ink/10 bg-paper transition hover:-translate-y-0.5 hover:shadow-md">
      {thumbs.length > 0 && (
        <div className={`relative w-full bg-paper-gray ${pair ? "grid grid-cols-2 gap-2 p-2" : ""}`} style={{ aspectRatio: 16 / 10 }}>
          {pair
            ? thumbs.slice(0, 2).map((t) => (
                <div key={t} className="relative h-full overflow-hidden rounded-md shadow-sm">
                  <Image src={t} alt="" fill sizes="(min-width:640px) 16vw, 50vw" className="object-cover object-top" />
                </div>
              ))
            : <Image src={thumbs[0]} alt="" fill sizes="(min-width:640px) 33vw, 100vw" className="object-contain p-2" />}
        </div>
      )}
      <div className="p-3"><h3 className="text-base font-bold text-ink">{title}</h3></div>
    </Link>
  );
}
