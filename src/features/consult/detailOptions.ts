// '기타 / 잘 모르겠어요' 선택 시 받는 상세 문진 항목 — 보기 문구와 요약 규칙은 이 파일에서만 관리합니다.
export const YESNO = ["yes", "no", "unknown"] as const;
export type YesNo = (typeof YESNO)[number];
export const YESNO_LABEL: Record<YesNo, string> = { yes: "있어요", no: "없어요", unknown: "잘 모르겠어요" };

export const INSURANCE_KINDS = ["indemnity", "cancer", "whole", "pension", "saving", "etc"] as const;
export type InsuranceKind = (typeof INSURANCE_KINDS)[number];
export const INSURANCE_KIND_LABEL: Record<InsuranceKind, string> = {
  indemnity: "실손의료비", cancer: "암·질병 보험", whole: "종신·정기 보험", pension: "연금 보험", saving: "저축 보험", etc: "기타",
};

export const FAMILY_HISTORY = ["cancer", "brain", "heart", "diabetes", "dementia", "none", "unknown"] as const;
export type FamilyHistory = (typeof FAMILY_HISTORY)[number];
export const FAMILY_HISTORY_LABEL: Record<FamilyHistory, string> = {
  cancer: "암", brain: "뇌혈관 질환", heart: "심장 질환", diabetes: "당뇨", dementia: "치매", none: "특별히 없어요", unknown: "잘 모르겠어요",
};

/** 건강 관련(민감정보) 항목 — 별도 동의가 있을 때만 받습니다. */
export const HEALTH_FIELDS = ["surgery", "surgeryNote", "treatment", "treatmentNote", "familyHistory"] as const;

/** 저장·표시에 쓰는 상세 문진 묶음 (값이 있는 항목만 담깁니다) */
export type DetailPayload = {
  hasInsurance?: YesNo;
  insuranceKinds?: InsuranceKind[];
  surgery?: YesNo;
  surgeryNote?: string;
  treatment?: YesNo;
  treatmentNote?: string;
  familyHistory?: FamilyHistory[];
  memo?: string;
};

type DetailSource = {
  hasInsurance?: string; insuranceKinds?: string[]; surgery?: string; surgeryNote?: string;
  treatment?: string; treatmentNote?: string; familyHistory?: string[]; memo?: string; healthConsent?: boolean;
};

const isYesNo = (v: unknown): v is YesNo => (YESNO as readonly unknown[]).includes(v);
const pick = <T extends string>(list: readonly T[], v: string[] | undefined): T[] => (v ?? []).filter((x): x is T => (list as readonly string[]).includes(x));

/** 건강 관련 입력이 하나라도 있는지 */
export function hasHealthInput(d: DetailSource): boolean {
  return Boolean(d.surgery || d.surgeryNote?.trim() || d.treatment || d.treatmentNote?.trim() || d.familyHistory?.length);
}

/** 입력값에서 값이 있는 항목만 골라 저장용 묶음으로 만듭니다. 건강 항목은 동의가 없으면 버립니다. */
export function buildDetailPayload(d: DetailSource): DetailPayload | null {
  const out: DetailPayload = {};
  if (isYesNo(d.hasInsurance)) out.hasInsurance = d.hasInsurance;
  const kinds = pick(INSURANCE_KINDS, d.insuranceKinds);
  if (kinds.length) out.insuranceKinds = kinds;
  if (d.healthConsent === true) {
    if (isYesNo(d.surgery)) out.surgery = d.surgery;
    if (d.surgeryNote?.trim()) out.surgeryNote = d.surgeryNote.trim();
    if (isYesNo(d.treatment)) out.treatment = d.treatment;
    if (d.treatmentNote?.trim()) out.treatmentNote = d.treatmentNote.trim();
    const fh = pick(FAMILY_HISTORY, d.familyHistory);
    if (fh.length) out.familyHistory = fh;
  }
  if (d.memo?.trim()) out.memo = d.memo.trim();
  return Object.keys(out).length ? out : null;
}

const yn = (v?: YesNo) => (v ? YESNO_LABEL[v] : "");

/** 사람이 읽는 줄 단위 요약 — 구글 시트·알림·관리자 화면에서 공통으로 사용 */
export function summarizeDetail(p: DetailPayload | null | undefined): string[] {
  if (!p) return [];
  const lines: string[] = [];
  if (p.hasInsurance) {
    const kinds = (p.insuranceKinds ?? []).map((k) => INSURANCE_KIND_LABEL[k]).join(", ");
    lines.push(`가입 중인 보험: ${yn(p.hasInsurance)}${kinds ? ` (${kinds})` : ""}`);
  }
  if (p.surgery) lines.push(`최근 5년 입원·수술 이력: ${yn(p.surgery)}${p.surgeryNote ? ` — ${p.surgeryNote}` : ""}`);
  if (p.treatment) lines.push(`치료·복약 중인 질환: ${yn(p.treatment)}${p.treatmentNote ? ` — ${p.treatmentNote}` : ""}`);
  if (p.familyHistory?.length) lines.push(`가족력: ${p.familyHistory.map((f) => FAMILY_HISTORY_LABEL[f]).join(", ")}`);
  if (p.memo) lines.push(`전하고 싶은 말: ${p.memo}`);
  return lines;
}
