import { site } from "@/config/site";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { KakaoButton } from "@/components/KakaoButton";

// 담당 FC 소개 — 표시만 담당 (내용은 config/site.ts 의 profile 에서 수정)
export function ProfileSection() {
  const { profile, contact } = site;
  return (
    <Section title="담당 FC를 소개합니다" tone="card">
      <div className="max-w-3xl">
        <h3 className="text-3xl font-extrabold text-ink">{profile.role}</h3>
        <p className="mt-3 text-lg text-ink-sub">{profile.intro}</p>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-paper p-4">
            <dt className="font-semibold text-ink-sub">상담 전화</dt>
            <dd className="mt-1 text-lg font-bold text-ink"><a href={`tel:${contact.fcPhone}`}>{contact.fcPhone}</a></dd>
          </div>
          <div className="rounded-xl bg-paper p-4">
            <dt className="font-semibold text-ink-sub">응대 시간</dt>
            <dd className="mt-1 text-ink">{contact.hours}</dd>
          </div>
        </dl>
        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          {profile.approach.map(([t, d], i) => (
            <li key={t} className="rounded-xl bg-paper p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm font-bold text-ink">{i + 1}</span>
              <p className="mt-2 font-bold text-ink">{t}</p>
              <p className="mt-1 text-sm text-ink-sub">{d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/consult">상담 신청하기</ButtonLink>
          <KakaoButton />
        </div>
      </div>
    </Section>
  );
}
