"use client";
import { useEffect, useState } from "react";
import type { MonthlyChoice } from "@/config/monthly";
import { MonthlyCardLink } from "./MonthlyCardLink";

// 감성 편지지 카드 — 처음에는 후보의 첫 장(이달의 빛깔)을 그리고, 화면이 열리면 후보 중 한 장을 무작위로 골라 바꿉니다.
// (서버 화면과 첫 그림을 같게 해 깜빡임·불일치 오류가 없게 함)
export function RandomMonthlyCard({ pool }: { pool: MonthlyChoice[] }) {
  const [i, setI] = useState(0);
  useEffect(() => { if (pool.length > 1) setI(Math.floor(Math.random() * pool.length)); }, [pool.length]);
  const c = pool[i] ?? pool[0];
  return c ? <MonthlyCardLink href={c.href} title={c.title} thumb={c.thumb} /> : null;
}
