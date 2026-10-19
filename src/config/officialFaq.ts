// 우체국보험 공식 홈페이지 '자주하는 질문' — 챗봇이 그대로 보여주는 원문입니다.
// 질문·답변은 officialFaq.data.json 에 있고(원문 그대로, 구분선만 정리), 내용을 바꾸려면 그 파일만 고치세요.
// 출처: https://epostlife.go.kr/IPCCFQ0001.do (사용자 제공 자료)
import data from "./officialFaq.data.json";

export interface OfficialFaq { id: string; category: string; question: string; answer: string }

export const officialFaq: OfficialFaq[] = data as OfficialFaq[];

/** 챗봇 '자주 묻는 질문' 분류 버튼 순서 (분류 이름은 데이터의 category 값과 같아야 합니다) */
export const officialFaqCategories = ["보험가입", "납입·자동이체", "환급금대출", "계약사항", "생존보험금", "사고보험금", "세제", "로그인/인증"] as const;

export const officialFaqSource = "우체국보험 공식 자주하는 질문";
