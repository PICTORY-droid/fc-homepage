// 즐길거리 자료 꾸러미(엑셀·PPT·워드·인쇄물·SVG) — 항목마다 50종.
// 파일은 public/fun/pack/<형식>/<항목>/ 에 있고, 목록(pack.data.json)은 scripts/fun/pack/ 의 make_*.py 가 만듭니다.
import data from "./pack.data.json";

export type PackExt = "xlsx" | "pptx" | "docx" | "svg";
export type Season = "봄" | "여름" | "가을" | "겨울";
export const packSeasons: Season[] = ["봄", "여름", "가을", "겨울"];

export interface PackEntry { no: number; name: string; tag: string; flavor: string; main: string; soft: string; dark: string; season: Season }
export interface PackItem {
  key: string; // 파일·목록 키 (예: ledger)
  title: string; // 화면 제목 (예: 가계부)
  short: string; // 한 줄 설명
  fileLabel: string; // 내려받는 한글 파일 이름 앞부분 (예: 가계부)
  ext: PackExt;
  thumb?: "jpg" | "svg"; // 미리보기가 있으면 형식
  aspect?: number; // 미리보기 가로/세로 비율(기본 0.707=A4 세로)
}
export interface PackGroup { slug: string; title: string; short: string; lead: string; icon: string; howto: string; items: PackItem[] }

export const packGroups: PackGroup[] = [
  {
    slug: "excel", title: "엑셀 양식", icon: "📊",
    short: "가계부·보험 증권 정리표·저축 플래너·경조사비 장부·용돈기입장·견적서, 각 50종. 수식과 차트가 들어 있어 받아서 바로 쓰고 고칠 수 있어요.",
    lead: "항목마다 50가지 한국 감성 테마로 만든 엑셀 양식이에요. 노란 칸에 입력하면 합계·그래프가 자동으로 바뀌고, 수식·서식·분류는 마음대로 고칠 수 있어요.",
    howto: "엑셀(Excel)·한컴오피스 한셀·구글 스프레드시트에서 열 수 있어요. 휴대폰에서는 엑셀 앱을 권해요. 처음 들어 있는 예시 줄은 지우고 쓰세요.",
    items: [
      { key: "ledger", title: "가계부", short: "1인가구·부부·핵가족·대가족·소상공인 5유형. 월별 요약·예산 비교·대시보드 차트", fileLabel: "가계부", ext: "xlsx" },
      { key: "policy", title: "보험 증권 정리표", short: "가입한 보험을 한 장에 정리하고 월 보험료·만기 일정을 자동 계산하는 점검용 양식", fileLabel: "보험증권정리표", ext: "xlsx" },
      { key: "saving", title: "월 저축·적금 플래너", short: "목표 금액과 월 납입액으로 만기 수령액·달성률을 계산하고 달마다 비교해요", fileLabel: "저축플래너", ext: "xlsx" },
      { key: "gift", title: "경조사비 장부", short: "받은 마음·드린 마음을 종류별·관계별·이름별로 정산하고 답례를 챙겨요", fileLabel: "경조사비장부", ext: "xlsx" },
      { key: "allowance", title: "용돈기입장", short: "유치원부터 대학생까지 연령별 용돈 기록과 저금 목표 막대", fileLabel: "용돈기입장", ext: "xlsx" },
      { key: "quote", title: "자동 계산 견적서", short: "단가표에서 고르면 금액·부가세·합계가 자동으로 나오는 A4 한 장 견적서", fileLabel: "견적서", ext: "xlsx" },
    ],
  },
  {
    slug: "ppt", title: "PPT 템플릿", icon: "🎞️",
    short: "발표·가족 소개·돌잔치·결혼식·보험 점검 양식·카드뉴스, 각 50종. 글과 사진 자리를 바로 고쳐 쓸 수 있는 PowerPoint 파일이에요.",
    lead: "항목마다 50가지 한국 감성 테마로 만든 PowerPoint 템플릿이에요. 글·색·사진 자리를 마음대로 고쳐서 발표, 초대, 소개 자료로 쓰세요.",
    howto: "PowerPoint·한컴오피스 한쇼·구글 슬라이드에서 열 수 있어요. 사진을 넣으려면 점선 칸을 누르고 ‘도형 채우기 → 그림’을 고르세요. 글꼴은 맑은 고딕이에요.",
    items: [
      { key: "talk", title: "발표 템플릿", short: "사업 제안·교육·업무 보고·모임 소개·연말 결산 5가지 구성의 6장 발표 자료", fileLabel: "발표템플릿", ext: "pptx", thumb: "jpg", aspect: 16 / 9 },
      { key: "family", title: "가족 소개 슬라이드", short: "부부·아이와 함께·3대 가족·1인 가구·반려동물, 구성원 소개와 가족 이야기", fileLabel: "가족소개", ext: "pptx", thumb: "jpg", aspect: 16 / 9 },
      { key: "birthday", title: "돌잔치 슬라이드", short: "성장 기록·돌잡이·사진·감사 인사·첫 번째 이야기 중심의 돌잔치 영상용 슬라이드", fileLabel: "돌잔치", ext: "pptx", thumb: "jpg", aspect: 16 / 9 },
      { key: "wedding", title: "결혼식 슬라이드", short: "소개·러브스토리·식순·오시는 길·감사 인사 중심의 결혼식 상영용 슬라이드", fileLabel: "결혼식", ext: "pptx", thumb: "jpg", aspect: 16 / 9 },
      { key: "review", title: "보험 보장 점검 양식", short: "본인·부부·가족·부모님·사업장별로 가입 내용을 정리하는 빈칸 채우기형 발표 자료(정리용)", fileLabel: "보장점검양식", ext: "pptx", thumb: "jpg", aspect: 16 / 9 },
      { key: "news", title: "카드뉴스", short: "알뜰 팁·건강 습관·계절 안부·감사·오늘의 한마디, 정사각 7장 카드뉴스", fileLabel: "카드뉴스", ext: "pptx", thumb: "jpg", aspect: 1 },
    ],
  },
];

const all = data as unknown as Record<string, PackEntry[]>;

export const getGroup = (slug: string) => packGroups.find((g) => g.slug === slug);
export const getItem = (group: PackGroup, key: string) => group.items.find((i) => i.key === key);
export const packEntries = (item: PackItem): PackEntry[] => all[`${item.ext}-${item.key}`] ?? [];
export const entriesBySeason = (item: PackItem, season: Season) => packEntries(item).filter((e) => e.season === season);

const nn = (n: number) => String(n).padStart(2, "0");
const clean = (s: string) => s.replace(/[\\/:*?"<>|\s]+/g, "");

export const packFile = (item: PackItem, no: number) => `/fun/pack/${item.ext}/${item.key}/${item.key}-${nn(no)}.${item.ext}`;
export const packThumb = (item: PackItem, no: number) => (item.thumb ? `/fun/pack/${item.ext}/${item.key}/thumbs/${item.key}-${nn(no)}.${item.thumb}` : undefined);

/** 내려받을 때 보이는 한글 파일 이름 — 예) 가계부_01_1인가구_매화피는아침.xlsx */
export const packDownloadName = (item: PackItem, e: PackEntry) => `${item.fileLabel}_${nn(e.no)}_${clean(e.flavor)}_${clean(e.name)}.${item.ext}`;
