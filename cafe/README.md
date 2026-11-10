# 우체국보험 길잡이 네이버 카페 키트

카페 주소: https://cafe.naver.com/304050modu
홈페이지와 같은 상품 데이터·광고 규칙을 쓰는 카페 원고 작업 폴더입니다.

## 폴더
- `cafe.config.json` — 카페명 후보·소개·메뉴·등급·글 아래 고지 (카페 관리 화면에 옮겨 적을 값)
- `posts/` — 원고. 파일 하나가 글 하나
- `scripts/` — 검사(check-cafe)·붙여넣기용 변환(build-cafe)·규칙(lib)
- `HARNESS.md` — 검사 항목 설명
- `out/` — 만든 결과 (저장소에 올리지 않음). 게시판별 `게시판_○○.txt` 는 확정 양식(사진1 → 인사 → 사진2 → 【소제목】 → 다음 글 → 상담 링크 → 공식 정보 → 민원 창구 → 작성일·출처, 한 문장 한 줄)으로 만들어짐

## 쓰는 순서
1. 원고 고치기
   ```bash
   code ~/fc-homepage/cafe/posts
   ```
2. 검사
   ```bash
   cd ~/fc-homepage && npm run cafe:check
   ```
3. 붙여넣기용 만들기
   ```bash
   cd ~/fc-homepage && npm run cafe:build && start cafe/out/index.html
   ```
4. 글을 열고 본문을 전체 선택해 복사 → 카페 글쓰기(스마트에디터)에 붙여 넣기 → 제목·게시판·태그는 목록에 적힌 대로
5. 상품 글은 심의를 받은 뒤 머리말 `status: 인증`, `reviewNo: 심의번호` 로 바꾸고 올리기

홈페이지로 가는 링크에는 `utm_source=naver_cafe&utm_campaign=<글 slug>` 가 자동으로 붙어서, 관리자 통계에서 어떤 카페 글이 상담으로 이어졌는지 볼 수 있습니다.
