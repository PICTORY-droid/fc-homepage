import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";
import { textLink } from "@/components/ui/styles";

export const metadata: Metadata = { title: "개인정보처리방침" };

// 개인정보보호법 제30조·시행령 제31조 기재사항. 문구 값(위탁사·보호책임자·시행일)은 config/site.ts 의 privacy 에서만 고치세요.
const REMEDIES = [
  { name: "개인정보분쟁조정위원회", tel: "1833-6972", url: "https://www.kopico.go.kr" },
  { name: "개인정보침해신고센터 (한국인터넷진흥원)", tel: "118", url: "https://privacy.kisa.or.kr" },
  { name: "대검찰청", tel: "1301", url: "https://www.spo.go.kr" },
  { name: "경찰청", tel: "182", url: "https://ecrm.police.go.kr" },
] as const;

function Item({ no, title, children }: { no: string; title: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-bold">{no}. {title}</dt>
      <dd className="mt-1 space-y-2 text-ink-sub">{children}</dd>
    </div>
  );
}

export default function PrivacyPage() {
  const p = site.privacy;
  const contact = `${site.contact.fcPhone}${p.contactEmail ? ` / ${p.contactEmail}` : ""}`;
  return (
    <Section as="h1" title="개인정보처리방침">
      <dl className="space-y-6 text-ink">
        <Item no="1" title="수집·이용 목적"><p>{p.purpose}</p></Item>
        <Item no="2" title="수집 항목"><p>{p.items}</p></Item>
        <Item no="2-1" title="민감정보 (선택 수집)">
          <p>{p.sensitiveItems} 일반 개인정보 동의와 별도로 동의를 받으며, 동의하지 않아도 상담 신청이 가능합니다. 목적은 보장 상담에 한정되며 목적 달성 시 지체 없이 파기합니다.</p>
        </Item>
        <Item no="3" title="보유 및 이용 기간">
          <p>{p.retentionMonths ? `상담 신청일로부터 ${p.retentionMonths}개월간 보관하며, 이후 지체 없이 파기합니다.` : "상담 목적이 달성되면 지체 없이 파기합니다. (구체적 기간은 확정 후 안내)"}</p>
        </Item>
        <Item no="4" title="파기 절차 및 방법">
          <p>보유 기간이 끝나거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자 파일 형태의 정보는 복구할 수 없는 방법으로 삭제하며, 종이에 출력된 정보는 분쇄하거나 소각합니다.</p>
          <p>다른 법령에 따라 보관해야 하는 경우에는 해당 정보를 별도로 분리하여 그 법령이 정한 기간 동안만 보관합니다.</p>
        </Item>
        <Item no="5" title="제3자 제공"><p>법령에 근거가 있는 경우를 제외하고 제3자에게 제공하지 않습니다.</p></Item>
        <Item no="6" title="처리 위탁 및 국외 이전">
          <p>원활한 사이트 운영을 위해 아래 업체에 개인정보 처리를 위탁하며, 이 업체들의 서버가 국외에 있어 정보가 국외로 이전될 수 있습니다. 이전 항목은 2번의 수집 항목이며, 상담 신청 시 정보통신망을 통해 전송되고, 3번의 보유 기간 동안 보관된 뒤 파기됩니다.</p>
          <ul className="list-disc space-y-1 pl-5">
            {p.processors.map((v) => (
              <li key={v.name}><b className="text-ink">{v.name}</b> — {v.task} · 이전 국가: {v.country}</li>
            ))}
          </ul>
          <p>국외 이전을 원하지 않으시면 온라인 신청 대신 전화({site.contact.fcPhone})로 상담을 요청하실 수 있습니다.</p>
        </Item>
        <Item no="7" title="정보주체의 권리와 행사 방법">
          <p>언제든지 본인의 개인정보 열람, 정정·삭제, 처리 정지, 동의 철회를 요구하실 수 있습니다. 아래 10번의 연락처로 요청하시면 본인 확인 후 지체 없이 조치합니다.</p>
          <p>법정대리인이나 위임을 받은 분을 통해서도 요구하실 수 있으며, 이 경우 위임장을 제출하셔야 합니다.</p>
        </Item>
        <Item no="8" title="동의 거부 권리"><p>동의를 거부할 수 있으며, 거부 시 온라인 상담 신청이 제한됩니다. 전화로 문의하실 수 있습니다.</p></Item>
        <Item no="9" title="안전성 확보 조치">
          <ul className="list-disc space-y-1 pl-5">
            <li>전송 구간 암호화(HTTPS)를 적용합니다.</li>
            <li>저장소에는 접근 권한을 제한하고, 관리 화면은 비밀번호와 서명된 로그인 정보로 보호합니다.</li>
            <li>관리자 비밀번호는 복원할 수 없는 방식(해시)으로 저장합니다.</li>
            <li>접근 권한은 담당 FC 본인으로 한정합니다.</li>
          </ul>
        </Item>
        <Item no="10" title="개인정보 보호책임자">
          <p>{p.officer.name ? `${p.officer.name} (${p.officer.role})` : p.officer.role} · 연락처: {contact}</p>
        </Item>
        <Item no="11" title="이용 통계(비식별)">
          <p>서비스 개선을 위해 방문 횟수, 열어 본 페이지, 어느 링크·사이트에서 들어왔는지(유입 경로), 자료 미리보기·내려받기·전화·카카오톡 문의 버튼을 누른 횟수와 상담 신청의 시작·완료 횟수를 집계합니다. 자료를 처음 받은 뒤 연령대(10대~60대 이상)를 묻는 경우가 있으며, 답하지 않아도 되고 고른 연령대와 받은 자료 이름만 기록합니다. 이름·연락처·IP 주소와 연결하지 않으며, 광고나 개인 식별에 쓰지 않습니다.</p>
          <p>쿠키는 사용하지 않습니다. 방문 집계와 연령 질문 여부를 기억하기 위해 브라우저 저장소(sessionStorage·localStorage)에 개인을 알아볼 수 없는 표시만 저장하며, 브라우저 설정에서 언제든 지우실 수 있습니다.</p>
        </Item>
        <Item no="12" title="새 양식 알림 (선택, 광고성 정보 수신 동의)">
          <p>새 양식 소식을 {site.newsletter.channel}로 보내기 위해 연락처만 수집하며, 동의일로부터 {site.newsletter.retentionMonths}개월간 보관한 뒤 파기합니다. 동의하지 않아도 자료를 받는 데 지장이 없으며, <a className={textLink} href="/unsubscribe">해지 페이지</a>나 전화로 언제든 수신을 거부할 수 있습니다. 상담 신청 정보와는 따로 보관합니다.</p>
        </Item>
        <Item no="13" title="권익침해 구제 방법">
          <p>개인정보 침해에 대한 상담이나 분쟁 해결이 필요하시면 아래 기관에 문의하실 수 있습니다.</p>
          <ul className="list-disc space-y-1 pl-5">
            {REMEDIES.map((r) => (
              <li key={r.name}>{r.name} · {r.tel} · <a className={textLink} href={r.url} target="_blank" rel="noopener noreferrer">{r.url.replace("https://", "")}</a></li>
            ))}
          </ul>
        </Item>
        <Item no="14" title="문의"><p>{contact}</p></Item>
        <Item no="15" title="처리방침 변경 및 시행일">
          <p>이 처리방침은 {p.effectiveDate}부터 시행합니다. 내용이 바뀌면 이 페이지에 알려 드립니다.</p>
          <ul className="list-disc space-y-1 pl-5">
            {p.history.map((h) => <li key={h.date}>{h.date} — {h.note}</li>)}
          </ul>
        </Item>
      </dl>
    </Section>
  );
}
