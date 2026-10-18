-- FC 업무 앱 DB 스키마 (Supabase / PostgreSQL) v0.1
-- 원칙: 모든 테이블 created_at/updated_at/deleted_at, RLS로 본인 데이터만 접근, 민감정보 최소 수집

create extension if not exists pgcrypto;

create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

-- 1. 상품 카탈로그 (엑셀 '본상품'/'특약' 시트를 import)
create table products (
  id            text primary key,                -- P001, R001
  kind          text not null check (kind in ('product','rider')),
  category      text not null,                   -- 보장성/저축성/연금/단체특약...
  name          text not null,
  effective_on  date,
  status        text not null check (status in ('판매','판매중지')),
  channel       text,
  min_age       int, max_age int,
  term_note     text, limit_note text, coverage_note text,
  verified      boolean not null default false,  -- 사업방법서 대조 완료 여부
  source_url    text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- 2. 영업 대상(개인/기업 공통)
create table prospects (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id),
  type        text not null check (type in ('company','clinic','person')),
  name        text not null,
  address     text,
  phone       text,
  segment     text,                              -- 5-49인 제조업체 등
  employees   int,
  stage       text not null default '발굴'
              check (stage in ('발굴','접촉','상담','제안','계약','보류')),
  next_contact_on date,
  priority    int,
  memo        text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index on prospects (owner_id, stage, next_contact_on) where deleted_at is null;
create unique index prospects_phone_uq on prospects (owner_id, phone) where phone is not null and deleted_at is null;

-- 3. 활동 기록 (방문/전화/문자)
create table activities (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id),
  prospect_id uuid not null references prospects(id),
  kind        text not null check (kind in ('방문','전화','문자','상담','제안','기타')),
  occurred_at timestamptz not null default now(),
  result      text,
  memo        text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- 4. 제안/계약 (상품 연결)
create table proposals (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id),
  prospect_id uuid not null references prospects(id),
  product_id  text references products(id),
  status      text not null default '제안' check (status in ('제안','검토','계약','거절')),
  monthly_premium int,
  memo        text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- 5. 개인정보 수집·이용 동의 (개인정보보호법 대응)
create table consents (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id),
  prospect_id uuid not null references prospects(id),
  purpose     text not null,                     -- 상담/마케팅 수신
  agreed      boolean not null,
  agreed_at   timestamptz,
  withdrawn_at timestamptz,
  created_at timestamptz not null default now()
);

-- 6. 홍보 콘텐츠/랜딩 리드
create table leads (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id),
  source      text not null,                     -- landing/qr/blog
  name        text, phone text, interest text,
  consent_marketing boolean not null default false,
  status      text not null default 'new',
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- updated_at 트리거
do $$ declare t text; begin
  foreach t in array array['products','prospects','activities','proposals'] loop
    execute format('create trigger %I_upd before update on %I for each row execute function set_updated_at()', t, t);
  end loop; end $$;

-- RLS: 본인 데이터만
alter table prospects enable row level security;
alter table activities enable row level security;
alter table proposals  enable row level security;
alter table consents   enable row level security;
alter table leads      enable row level security;
alter table products   enable row level security;

create policy own_prospects on prospects for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy own_activities on activities for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy own_proposals on proposals for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy own_consents on consents for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy own_leads on leads for select using (owner_id = auth.uid());
create policy products_read on products for select using (auth.role() = 'authenticated');
-- leads INSERT는 공개 폼 → 서버 라우트(service role)에서만 처리 (클라이언트 직접 삽입 금지)
