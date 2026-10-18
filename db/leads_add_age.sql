-- 가입 대상 연령 칸 추가 (이미 leads 테이블을 만든 경우 한 번만 실행)
alter table public.leads add column if not exists insured_age smallint;
