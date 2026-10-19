# 새 기능 설정 안내 (신뢰 장치 · 상담 UX · 비교 · 관리자)

## 바로 쓰는 기능 (설정 필요 없음)
프로필 섹션, 공시 기준 표시, 이용 안내(/guide), 3단계 상담 신청, 모바일 하단 고정 버튼,
상품 검색·필터, 상품 비교(/compare), 보장 찾기(/find), 보험금 지급사유 표, 카톡 미리보기 이미지, 구조화 데이터

## 내가 채우면 완성되는 것
| 할 일 | 위치 |
|---|---|
| 카톡 상담 버튼 켜기 | `src/config/site.ts` 의 `contact.kakaoUrl` 에 오픈프로필 주소 입력 |
| 한 줄 소개·상담 방식 수정 | `src/config/site.ts` 의 `profile` |
| 미리보기 이미지 다시 만들기 | 상품이 바뀌면 `node scripts/make-og.mjs` (최초 1회 `npm i -D playwright`) |

## 관리자 화면 (/admin) 켜기
1. Vercel → Settings → Environment Variables 에 추가 (값은 길고 무작위로, 코드에 적지 않기)
   - `ADMIN_PASSWORD` : 12자 이상
   - `ADMIN_SESSION_SECRET` : 32자 이상
2. (메모 기능을 쓸 때) Supabase → SQL Editor 에서 `db/leads_admin.sql` 한 번 실행
3. 재배포 후 `/admin` 접속

## Supabase 일시중지 방지 (자동)
- `vercel.json` 의 cron 이 매주 월요일 `/api/cron/keepalive` 를 호출합니다.
- Vercel 환경변수에 `CRON_SECRET`(16자 이상 무작위)을 등록해야 동작합니다.

## 상담 신청자 보관 기간(3년) 만료 알림
- 상담 신청일로부터 36개월(`site.privacy.retentionMonths`)이 되기 30일 전부터, 매주 월요일 `/api/cron/retention` 이 담당 FC 이메일로 대상자의 이름·연락처 끝 4자리·접수일·만료일을 보냅니다. 한 번 알린 건은 다시 보내지 않습니다.
- 준비: ① Supabase 에서 `db/leads_retention.sql` 실행 ② Vercel 환경변수 `RESEND_API_KEY`, `RETENTION_MAIL_TO`(받을 이메일), `CRON_SECRET` 등록. (`MAIL_FROM` 은 선택)
- 메일을 받으면 Supabase `leads` 표(와 구글 시트)에서 해당 줄을 직접 삭제합니다.
