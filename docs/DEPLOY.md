# 배포 순서 (한 단계씩)

1. Supabase SQL Editor 에서 `db/schema.sql` → `db/leads_patch.sql` 순서로 실행 (이미 schema.sql 을 적용했다면 patch 만)
2. GitHub 에 새 저장소로 업로드 (`.env.local` 은 올리지 않음)
3. 호스팅에 저장소 연결 후 환경변수 입력: NEXT_PUBLIC_SITE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FC_OWNER_ID
4. 운영 전환 시 REQUIRE_REVIEW=1 → 심의번호·프로필 등이 비어 있으면 빌드가 실패하여 미심의 화면 공개를 막음
5. 도메인 연결 확정 후 `npm run qr -- https://도메인` 으로 명함용 QR 생성

호스팅 주의: Vercel 무료(Hobby)는 개인·비상업 용도로만 허용 (공식 문서 확인). 보험 상담 페이지는 상업 용도이므로 유료 플랜 또는 상업 이용이 허용되는 다른 호스팅을 확인 후 사용.
