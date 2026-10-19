import Fuse from "fuse.js";
import { categories, getCategory, type CategorySlug } from "../../config/categories";
import { categoryKeywords, chatbotCopy, faq, OFFICIAL_FAQ_URL, type ChatLink } from "../../config/chatbot";
import { officialFaq, officialFaqCategories } from "../../config/officialFaq";
import { products, type Product } from "../../config/products";
import { site } from "../../config/site";
import { filterProducts } from "../productSearch";
import { buildFaqIndex, isDecisive, normFaq, queryGrams, searchFaq } from "./faqSearch";

// 안내 도우미 두뇌 — 화면과 무관한 순수 함수. 입력 글자를 어디로도 보내거나 저장하지 않습니다.
export interface ChatReply { text: string; links: ChatLink[]; suggestions: string[] }

const norm = (s: string) => s.toLowerCase().replace(/[\s.,!?~·'"()\-_/]+/g, "");
const MAX_PRODUCTS = 3;
const MAX_QUERY = 300; // 추천 질문(공식 질문 원문)도 그대로 받을 수 있게 입력칸 제한보다 넉넉히
const faqIndex = buildFaqIndex(officialFaq);
const officialLink: ChatLink = { label: "공식 자주하는 질문 전체 보기", href: OFFICIAL_FAQ_URL, external: true };

// 주민번호·전화번호·카드/계좌 번호처럼 보이는 숫자, 또는 관련 단어
const SENSITIVE = [/\d{6}\s*-?\s*[1-4]\d{6}/, /01[016789][-\s]?\d{3,4}[-\s]?\d{4}/, /\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}/, /\d{9,}/, /주민\s*(등록)?\s*번호|계좌\s*번호|카드\s*번호/];
export const looksSensitive = (input: string) => SENSITIVE.some((re) => re.test(input));

const consultLink = (topic?: string): ChatLink => ({ label: "상담 신청하기", href: topic ? `/consult?topic=${topic}` : "/consult" });
const kakaoLinks = (): ChatLink[] => (site.contact.kakaoUrl ? [{ label: "카카오톡으로 문의하기", href: site.contact.kakaoUrl, external: true }] : []);

/** 가장 긴 키워드가 맞은 길이 (없으면 0) */
function score(input: string, keywords: readonly string[]): number {
  return keywords.reduce((best, k) => (input.includes(norm(k)) ? Math.max(best, norm(k).length) : best), 0);
}

function productReply(list: Product[]): ChatReply {
  const shown = list.slice(0, MAX_PRODUCTS);
  const more = list.length > shown.length;
  return {
    text: shown.length === 1
      ? `'${shown[0].displayName}'을(를) 찾았어요. 가입 나이·기간·보장은 상품 페이지에서 확인하실 수 있어요.`
      : `관련 상품을 찾았어요.${more ? ` (${list.length}개 중 ${shown.length}개)` : ""} 가입 조건은 각 상품 페이지에서 확인하세요.`,
    links: [
      ...shown.map((p) => ({ label: p.displayName, href: `/products/${p.id}` })),
      ...(more ? [{ label: "보험 상품 전체 보기", href: "/products" }] : []),
      consultLink(shown[0].topic === "other" ? undefined : shown[0].topic),
    ],
    suggestions: [],
  };
}

function categoryReply(slug: CategorySlug): ChatReply {
  const c = getCategory(slug)!;
  const items = products.filter((p) => p.topic === slug).slice(0, MAX_PRODUCTS);
  return {
    text: `${c.title} 쪽이 궁금하시군요. ${c.short}${c.notice ? ` ${c.notice}` : ""}`,
    links: [
      { label: `${c.title} 안내 보기`, href: `/c/${c.slug}` },
      ...items.map((p) => ({ label: p.displayName, href: `/products/${p.id}` })),
      consultLink(slug),
    ],
    suggestions: [],
  };
}

const fuse = new Fuse(products, { keys: ["displayName", "slogan.headline", "slogan.tags"], threshold: 0.3, ignoreLocation: true, minMatchCharLength: 2 });

export function reply(rawInput: string): ChatReply {
  const input = rawInput.trim().slice(0, MAX_QUERY);
  if (!input) return { text: chatbotCopy.empty, links: [], suggestions: [] };
  if (looksSensitive(input)) return { text: chatbotCopy.sensitive.text, links: [consultLink()], suggestions: [] };

  const q = norm(input);

  // 0) 공식 자주하는 질문 — 분류 이름 그대로, 또는 질문과 거의 같은 입력
  const catName = officialFaqCategories.find((c) => normFaq(c) === normFaq(input));
  if (catName) {
    const inCat = officialFaq.filter((f) => f.category === catName);
    return { text: chatbotCopy.faqListText, links: [officialLink], suggestions: inCat.slice(0, 8).map((f) => f.question) };
  }
  const hits = searchFaq(faqIndex, input, 4);
  const grams = queryGrams(input).size;

  if (isDecisive(hits, input)) {
    const rest = hits.slice(1).filter((h) => h.score >= 0.4).map((h) => h.item.question);
    return { text: `${hits[0].item.answer}\n\n${chatbotCopy.faqSourceLine}`, links: [officialLink], suggestions: rest.slice(0, 3) };
  }
  // 구체적으로 입력했고 공식 질문과 많이 겹치면 목록으로
  if (grams >= 3 && hits[0] && hits[0].coverage >= 0.75) {
    return { text: chatbotCopy.faqListText, links: [officialLink], suggestions: hits.filter((h) => h.coverage >= 0.5).map((h) => h.item.question) };
  }

  // 1) 자주 묻는 질문 (가장 긴 키워드가 맞은 것)
  let bestFaq = null as (typeof faq)[number] | null, bestScore = 0;
  for (const f of faq) {
    const s = score(q, f.keywords);
    if (s > bestScore) { bestScore = s; bestFaq = f; }
  }
  if (bestFaq) return { text: bestFaq.text, links: bestFaq.links ?? [], suggestions: bestFaq.suggestions ?? [] };

  // 2) 분야 단어 찾기 (가장 긴 단어가 맞은 분야)
  let bestCat = null as CategorySlug | null, catScore = 0;
  for (const c of categories) {
    const s = score(q, categoryKeywords[c.slug]);
    if (s > catScore) { catScore = s; bestCat = c.slug; }
  }
  // 입력이 분야 단어 그대로(예: '연금', '암')이면 상품 목록보다 분야 안내를 먼저 보여줍니다.
  if (bestCat && catScore === q.length) return categoryReply(bestCat);

  // 3) 상품 이름이 그대로 들어간 경우
  if (q.length >= 2) {
    const exact = filterProducts(products, { q: input, group: "all", topic: "all" });
    if (exact.length > 0 && exact.length < products.length) return productReply(exact);
  }
  if (bestCat) return categoryReply(bestCat);

  // 4) 오타·비슷한 말 (퍼지 검색)
  if (q.length >= 3) {
    const near = fuse.search(input, { limit: MAX_PRODUCTS }).map((r) => r.item);
    if (near.length > 0) return productReply(near);
  }

  // 5) 공식 질문 중 비슷한 것들을 목록으로
  const near = searchFaq(faqIndex, input, 5).filter((h) => h.coverage >= 0.5);
  if (near.length > 0) return { text: chatbotCopy.faqListText, links: [officialLink], suggestions: near.map((h) => h.item.question) };

  // 6) 모르는 질문 → 상담 연결
  return { text: chatbotCopy.fallback.text, links: [consultLink(), ...kakaoLinks()], suggestions: [...chatbotCopy.fallback.suggestions] };
}
