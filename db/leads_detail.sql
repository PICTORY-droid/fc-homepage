-- '기타 / 잘 모르겠어요' 상세 문진 저장용 컬럼 — Supabase SQL Editor 에서 한 번만 실행하세요.
-- 건강 관련 내용(민감정보)이 들어갈 수 있으므로 RLS 를 켠 상태(서버 service-role 로만 접근)를 유지하세요.
alter table leads add column if not exists detail jsonb;
