-- 상담 신청의 유입 정보(어느 글·채널에서 왔는지) 저장용 컬럼 — Supabase SQL Editor 에서 한 번만 실행하세요.
-- 실행 전에도 사이트는 정상 동작합니다(컬럼이 없으면 유입 정보만 빼고 접수).
alter table leads add column if not exists utm_source   text;
alter table leads add column if not exists utm_medium   text;
alter table leads add column if not exists utm_campaign text;
alter table leads add column if not exists ref_host     text;
create index if not exists leads_utm_campaign on leads (utm_campaign, created_at desc);

-- 예) 노션 글(캠페인)별 상담 신청 수
-- select coalesce(utm_source,'직접') as src, utm_campaign, count(*) from leads where created_at > now() - interval '30 days' group by 1,2 order by 3 desc;
