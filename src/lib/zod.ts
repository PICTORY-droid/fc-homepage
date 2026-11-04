// zod 단일 진입점 — 브라우저 보안 정책(CSP)이 eval 을 막으므로, zod 가 빠른 검사용 코드를 즉석 생성(new Function)하지 않도록 끕니다.
// 검증 규칙과 결과는 같습니다. zod 는 이 파일에서 가져다 쓰세요.
import { z } from "zod";

z.config({ jitless: true });

export { z };
