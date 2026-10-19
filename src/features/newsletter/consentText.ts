// 새 양식 알림의 동의 안내 — 목적·수집 항목·보유 기간·해지 방법·거부 권리를 한 곳에서 만듭니다. (문구가 바뀌면 VERSION 을 올리세요)
export const NEWSLETTER_CONSENT_VERSION = "2026-10-v1";

export interface NewsletterConsentInfo { channel: string; retentionMonths: number; unsubscribePath: string; contactPhone: string }

export function newsletterConsentText(i: NewsletterConsentInfo): string {
  return `새 양식·이달의 양식 소식을 ${i.channel}로 보내 드리기 위해 연락처를 수집하며, 동의일로부터 ${i.retentionMonths}개월간 보관한 뒤 파기합니다. 광고성 정보 수신에 동의하신 경우에만 발송하고, 동의하지 않으셔도 자료는 그대로 받으실 수 있습니다. 해지는 ${i.unsubscribePath} 에서 연락처를 입력하시거나 ${i.contactPhone} 로 말씀하시면 바로 처리합니다.`;
}
