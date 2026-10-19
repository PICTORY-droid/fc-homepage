// 감성 편지지 10종 — 파일은 public/fun/stationery/ 에 있고 scripts/fun/make-stationery.mjs 로 만듭니다. (id 는 scripts/fun/stationery-art.mjs 와 같아야 합니다)
export interface Stationery { id: string; name: string; desc: string }

export const stationery: Stationery[] = [
  { id: "01-airmail", name: "에어메일", desc: "빨강·파랑 사선 테두리의 항공우편" },
  { id: "02-stamps", name: "우표 콜라주", desc: "우표와 소인이 모인 따뜻한 한 장" },
  { id: "03-mailbox", name: "빨간 우체통", desc: "점선 테두리와 우체통 그림" },
  { id: "04-postmark", name: "소인 엽서", desc: "빈티지 엽서 틀과 둥근 소인" },
  { id: "05-sky", name: "하늘 편지", desc: "구름 사이를 나는 편지봉투" },
  { id: "06-flower", name: "꽃 편지", desc: "파스텔 꽃으로 꾸민 편지지" },
  { id: "07-kraft", name: "크래프트 포장지", desc: "포장지 위에 놓인 작은 소포 편지" },
  { id: "08-night", name: "별밤 편지", desc: "달과 별이 뜬 밤하늘" },
  { id: "09-biker", name: "달려라 집배원", desc: "편지를 싣고 달리는 오토바이" },
  { id: "10-simple", name: "심플 오렌지", desc: "깔끔한 보내는 사람·받는 사람 칸" },
];

export const stationeryFile = (id: string, ext: "png" | "docx" | "jpg") => (ext === "jpg" ? `/fun/stationery/thumbs/${id}.jpg` : `/fun/stationery/${id}.${ext}`);
