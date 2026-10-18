import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// 테스트에서도 '@/…' 경로 별칭을 사용할 수 있게 합니다.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
