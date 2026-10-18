# 수정·오류 대응 지도 (하네스)

문제가 생기면 아래 표에서 **증상 → 고칠 파일 한 곳**만 찾으세요. 다른 파일은 건드리지 않습니다.

## A. 문구·내용을 바꾸고 싶을 때 (코드 지식 불필요)

| 하고 싶은 일 | 고칠 파일 | 비고 |
|---|---|---|
| 이름, 전화번호, 소속, 고지 문구 | `src/config/site.ts` | 전화번호는 여기 한 곳 |
| 심의번호 입력 | `src/config/site.ts` → `reviewNo` | 모든 배너/푸터에 자동 반영 |
| 페이지별 배너 상품·문구 | `src/config/banners.ts` | 페이지당 1개, 중복 시 빌드 실패 |
| 상담 분야 추가·삭제·문구 | `src/config/categories.ts` | 배너(`banners.ts`)에도 같은 key 추가 |
| 색상 | `tailwind.config.ts` | `brand`, `ink`, `paper` |
| 개인정보 항목·보유기간 | `src/config/site.ts` → `privacy` | |

## B. 고장났을 때

| 증상 | 의심 파일 | 확인 방법 |
|---|---|---|
| 빌드가 "콘텐츠 검사 실패"로 멈춤 | `scripts/check-content.mjs` 출력 | 메시지가 가리키는 config 파일 수정 |
| 상담 신청 버튼 눌러도 안 됨 | `src/app/api/consult/route.ts` | Vercel 로그에서 `[consult]` 검색 |
| "현재 접수가 어렵습니다" 표시 | 환경변수 | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FC_OWNER_ID` 확인 |
| 입력 검증 문구 수정 | `src/features/consult/schema.ts` | 서버와 브라우저가 같이 사용 |
| 전화번호 자동 하이픈 이상 | `src/lib/phone.ts` | |
| 저장소(DB) 교체 | `src/services/leads.ts` | 이 파일만 교체 |
| 스팸이 몰림 | `src/lib/rateLimit.ts` | 횟수 조절 또는 Turnstile 추가 |
| 화면 레이아웃 깨짐 | `src/components/` 해당 컴포넌트 | 페이지 파일은 조립만 담당 |
| 헤더/푸터 | `src/components/layout/` | |
| 보안 헤더 | `next.config.mjs` | |

## C. 구조 원칙

```
config/      내용(문구·상품·분야)      ← 대부분의 수정은 여기
components/  화면 조각 (표시만)
features/    기능별 로직 (검증·훅·API 호출)
services/    서버 비즈니스/DB 접근
lib/         공통 도구 (응답형식·전화번호·환경변수)
app/         라우팅과 조립만
scripts/     빌드 전 가드, QR 생성
db/          Supabase SQL
```

- 화면 코드는 DB/fetch 를 직접 부르지 않습니다.
- 응답 형식은 `src/lib/api.ts` 한 가지로 통일합니다.
- 상품명은 `banners.ts` 에만 존재합니다 (다른 곳에 복사하지 않음).
