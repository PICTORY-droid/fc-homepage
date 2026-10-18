// 간단한 요청 제한(인스턴스 메모리). 서버리스에서는 인스턴스별로 동작하는 '최선 노력' 방식입니다.
// 더 강한 제한이 필요하면 이 파일만 교체하세요 (예: Upstash, Cloudflare Turnstile).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const cur = hits.get(key);
  if (!cur || cur.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    if (hits.size > 5000) for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);
    return false;
  }
  cur.count += 1;
  return cur.count > MAX_HITS;
}
