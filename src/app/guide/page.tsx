import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { BulletList } from "@/components/ui/BulletList";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/config/site";
import { productsMeta } from "@/config/products";

export const metadata: Metadata = {
  title: "이용 안내",
  description: "이 페이지의 성격, 상담 진행 방법, 상품 정보 기준과 공식 확인 방법을 안내합니다.",
};

const FLOW = [
  ["상담 신청", "분야와 연령, 연락처를 남기면 접수됩니다. 상담 신청만으로 가입이 진행되지 않습니다."],
  ["전화 연락", `희망하신 시간대에 ${site.contact.fcPhone} 번호로 연락드립니다.`],
  ["비교 설명", "상품요약서·약관 기준으로 가입 조건, 보장 내용, 유의사항을 설명드립니다."],
  ["결정", "충분히 검토하신 뒤 결정하세요. 가입 전 상품설명서와 약관 확인은 필수입니다."],
];

// 이용 안내 — 이 페이지의 성격·정보 기준·공식 확인 경로를 한 곳에서 안내
export default function GuidePage() {
  return (
    <>
      <Section title="이용 안내" lead="이 페이지를 이용하시기 전에 알아두시면 좋은 내용입니다.">
        <h3 className="text-xl font-bold text-ink">상담은 이렇게 진행돼요</h3>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2">
          {FLOW.map(([t, d], i) => (
            <li key={t} className="flex gap-4 rounded-card bg-paper-card p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-ink">{i + 1}</span>
              <span><b className="text-ink">{t}</b><br /><span className="text-sm text-ink-sub">{d}</span></span>
            </li>
          ))}
        </ol>
      </Section>
      <Section title="상품 정보는 이렇게 정리했어요" tone="card">
        <BulletList className="space-y-3 text-ink" items={[
          site.notices.basis,
          `판매 중인 상품 목록 출처: ${productsMeta.source} (${productsMeta.asOf} 확인)`,
          "온라인 전용(e마크) 상품과 판매가 중지된 상품은 이 페이지에 싣지 않습니다.",
          "보험금 지급 보장 등 법적 효력이 있는 내용은 각 상품의 약관과 상품설명서가 기준입니다.",
        ]} />
        <p className="mt-4 text-sm text-ink-sub">{site.notices.premium}</p>
      </Section>
      <Section title="공식 채널에서 확인하세요">
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={site.links.officialSite} external variant="outline">우체국보험 공식 사이트</ButtonLink>
          <ButtonLink href={`tel:${site.contact.officialCenterPhone}`} variant="outline">공식 고객센터 {site.contact.officialCenterPhone}</ButtonLink>
        </div>
        <p className="mt-6 text-sm text-ink-sub">
          개인정보는 상담 회신 목적으로만 사용합니다. 자세한 내용은 <Link className="underline" href="/privacy">개인정보처리방침</Link>을 확인하세요.
        </p>
      </Section>
    </>
  );
}
