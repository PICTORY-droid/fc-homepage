import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { BulletList } from "@/components/ui/BulletList";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/config/site";
import { productsMeta } from "@/config/products";
import { textLink } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "이용 안내",
  description: "이 페이지의 성격, 상담 진행 방법, 상품 정보 기준과 공식 확인 방법을 안내합니다. 계약 변경·해지·민원은 공식 고객센터에서 확인하세요.",
  alternates: { canonical: "/guide" },
};

const FLOW = [
  ["상담 신청", "분야와 연령, 연락처를 남기면 접수됩니다. 상담 신청만으로 가입이 진행되지 않습니다."],
  ["전화 연락", `희망하신 시간대에 상담 신청하신 방법 카카오톡 및 ${site.contact.fcPhone} 번호로 연락드립니다.`],
  ["비교 설명", "가입 조건, 보장 내용, 유의사항을 설명드립니다."],
  ["결정", "충분히 검토하신 뒤 결정하세요."],
];

// 이용 안내 — 이 페이지의 성격·정보 기준·공식 확인 경로를 한 곳에서 안내
export default function GuidePage() {
  return (
    <>
      <Section as="h1" title="이용 안내" lead="이 페이지를 이용하시기 전에 알아두시면 좋은 내용입니다.">
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
      <Section title="어떤 도움이 필요하세요?" lead="아래에서 목적에 맞는 곳을 골라 주세요." tone="card">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-card bg-paper p-5">
            <h3 className="font-bold text-ink">가입·보장 점검이 궁금해요</h3>
            <p className="mt-1 text-sm text-ink-sub">3가지 질문으로 살펴볼 분야를 찾고, 궁금한 점은 상담으로 남겨 주세요.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/find" trackLabel="guide_find">30초 보장 점검</ButtonLink>
              <ButtonLink href="/consult" variant="outline" trackLabel="guide_consult">상담 신청</ButtonLink>
            </div>
          </div>
          <div className="rounded-card bg-paper p-5">
            <h3 className="font-bold text-ink">계약 변경·해지·민원이에요</h3>
            <p className="mt-1 text-sm text-ink-sub">이미 가입한 계약의 변경·해지·민원 처리는 공식 고객센터에서 확인해 주세요.</p>
            <div className="mt-4">
              <ButtonLink href={`tel:${site.contact.officialCenterPhone}`} variant="outline">공식 고객센터 {site.contact.officialCenterPhone}</ButtonLink>
            </div>
          </div>
        </div>
      </Section>
      <Section title="상품 정보, 이렇게 안내해 드려요">
        <BulletList className="space-y-3 text-ink" items={[
          "우체국보험 상품요약서·사업방법서와 우정사업본부 고시를 바탕으로, 꼭 필요한 내용을 알기 쉽게 정리해 드려요. 상품마다 언제 기준으로 정리한 내용인지 날짜도 함께 적어 두었어요.",
          `지금 판매 중인 상품만 소개해 드려요. (참고: ${productsMeta.source}, ${productsMeta.asOf} 확인)`,
          "온라인으로만 가입하는 상품(e마크)과 판매가 끝난 상품은 이곳에서 소개하지 않아요.",
          "보험금을 언제, 얼마나 받으시는지는 각 상품의 약관과 상품설명서에 적힌 내용이 기준이에요.",
        ]} />
        <p className="mt-4 text-sm text-ink-sub">보험료와 보장 내용은 나이·건강 상태 같은 가입 조건에 따라 달라질 수 있어요. 가입하시기 전에 상품설명서와 약관을 꼭 함께 확인해 주세요.</p>
      </Section>
      <Section title="공식 채널에서 확인하세요" tone="card">
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={site.links.officialSite} external variant="outline">우체국보험 공식 사이트</ButtonLink>
          <ButtonLink href={`tel:${site.contact.officialCenterPhone}`} variant="outline">공식 고객센터 {site.contact.officialCenterPhone}</ButtonLink>
        </div>
        <p className="mt-6 text-sm text-ink-sub">
          개인정보는 상담 회신 목적으로만 사용합니다. 자세한 내용은 <Link className={textLink} href="/privacy">개인정보처리방침</Link>을 확인하세요.
        </p>
      </Section>
    </>
  );
}
