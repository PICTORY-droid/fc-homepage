-- 성과 리포트용 조회문 — Supabase SQL Editor 에서 필요한 것만 골라 실행하세요. (조회 전용, 데이터 변경 없음)
-- 전제: db/site_events.sql, db/leads_attribution.sql 을 먼저 실행해 두었을 것

-- 1) 유입 경로별 퍼널(최근 30일): 방문 클릭 → 상담 시작 → 상담 완료
select coalesce(source, ref_host, '직접') as src,
       count(*) filter (where name = 'cta_click')     as cta_click,
       count(*) filter (where name = 'consult_start') as consult_start,
       count(*) filter (where name = 'consult_done')  as consult_done
from public.site_events
where created_at > now() - interval '30 days'
group by 1 order by consult_done desc, consult_start desc;

-- 2) 노션 글(캠페인)별 다운로드 · 소식받기 가입 · 상담 신청
select campaign,
       count(*) filter (where name = 'download')         as downloads,
       count(*) filter (where name = 'newsletter_optin') as newsletter_optin,
       count(*) filter (where name = 'consult_done')     as consult_done
from public.site_events
where source = 'notion' and created_at > now() - interval '30 days'
group by 1 order by downloads desc;

-- 3) 소식받기 가입률(다운로드 대비) — 콘텐츠 시리즈(label 앞부분)별
select split_part(label, '_', 1) as series,
       count(*) filter (where name = 'download')         as downloads,
       count(*) filter (where name = 'newsletter_optin') as optin
from public.site_events
where created_at > now() - interval '30 days' and name in ('download', 'newsletter_optin')
group by 1 order by downloads desc;

-- 4) 실제 상담 신청 건의 유입 경로(상담 건 기준, 이름·연락처는 조회하지 않음)
select coalesce(utm_source, ref_host, '직접') as src, utm_campaign, count(*) as leads
from leads
where created_at > now() - interval '30 days'
group by 1, 2 order by leads desc;

-- 5) /guide 버튼 클릭(보험노트 도착 후 행동)
select label, count(*) from public.site_events
where name = 'cta_click' and label in ('guide_find', 'guide_consult') and created_at > now() - interval '30 days'
group by 1;
