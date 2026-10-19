// 상단 메뉴 구성 — 항목을 바꾸려면 이 파일만 고치면 됩니다. (그룹을 누르면 펼쳐지는 토글 메뉴)
import { categories } from "./categories";
import { funItems } from "./fun";

export interface NavLink { label: string; href: string }
export interface NavGroup { id: string; title: string; items: NavLink[] }

export const navGroups: NavGroup[] = [
  {
    id: "products", title: "보험 상품",
    items: [
      ...categories.map((c) => ({ label: c.title, href: `/c/${c.slug}` })),
      { label: "보험 상품 전체", href: "/products" },
      { label: "상품 비교", href: "/compare" },
    ],
  },
  {
    id: "check", title: "보장 점검·계산",
    items: [
      { label: "내게 맞는 보장 찾기", href: "/find" },
      { label: "간편 계산기", href: "/tools" },
    ],
  },
  {
    id: "fun", title: "즐길거리",
    items: [{ label: "즐길거리 전체 보기", href: "/fun" }, ...funItems.map((f) => ({ label: f.title, href: f.href }))],
  },
  {
    id: "info", title: "안내·상담",
    items: [
      { label: "상담 신청", href: "/consult" },
      { label: "담당 FC 소개", href: "/profile" },
      { label: "이용 안내", href: "/guide" },
      { label: "개인정보 처리방침", href: "/privacy" },
    ],
  },
];
