import { describe, expect, it } from "vitest";
import { newsletterConsentText } from "./consentText";

describe("새 양식 알림 동의 문구", () => {
  it("목적·보유 기간·해지 방법·거부 권리를 모두 담는다", () => {
    const t = newsletterConsentText({ channel: "문자(SMS)", retentionMonths: 12, unsubscribePath: "/unsubscribe", contactPhone: "010-0000-0000" });
    for (const k of ["소식", "12개월", "파기", "/unsubscribe", "010-0000-0000", "동의하지 않으셔도"]) expect(t).toContain(k);
  });
});
