"use client";
import { useMemo, useState } from "react";
import type { AgeBand, Concern, Who } from "@/config/finder";
import { productsForTopics, recommendFromDetail, recommendTopics, type DetailAnswers } from "./recommend";

export type FinderStep = 0 | 1 | 2 | 3 | 4; // 3 = 추가 문항('잘 모르겠어요'만), 4 = 결과

// '보장 찾기' 문답 진행 상태 (화면 컴포넌트에는 로직을 넣지 않음)
export function useFinder() {
  const [step, setStep] = useState<FinderStep>(0);
  const [who, setWho] = useState<Who>();
  const [ageBand, setAgeBand] = useState<AgeBand>();
  const [concern, setConcern] = useState<Concern>();
  const [detail, setDetail] = useState<DetailAnswers>({});

  const result = useMemo(() => {
    if (!who || !ageBand || !concern) return null;
    if (concern === "unknown") return { ...recommendFromDetail(detail, 3) };
    const topics = recommendTopics({ who, ageBand, concern });
    return { topics, products: productsForTopics(topics, 3), reasons: [] as string[] };
  }, [who, ageBand, concern, detail]);

  const setAnswer = <K extends keyof DetailAnswers>(key: K, value: DetailAnswers[K]) => setDetail((d) => ({ ...d, [key]: value }));
  const toggleIn = (key: "insuranceKinds" | "familyHistory", item: string, exclusive: readonly string[] = []) =>
    setDetail((d) => {
      const cur = (d[key] ?? []) as string[];
      let next = cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item];
      if (!cur.includes(item) && exclusive.includes(item)) next = [item];
      else if (!cur.includes(item)) next = next.filter((x) => !exclusive.includes(x));
      return { ...d, [key]: next } as DetailAnswers;
    });

  return {
    step, who, ageBand, concern, detail, result, setAnswer, toggleIn,
    totalSteps: concern === "unknown" ? 4 : 3,
    pickWho: (v: Who) => { setWho(v); setStep(1); },
    pickAge: (v: AgeBand) => { setAgeBand(v); setStep(2); },
    pickConcern: (v: Concern) => { setConcern(v); setStep(v === "unknown" ? 3 : 4); },
    showResult: () => setStep(4),
    back: () => setStep((s) => (s === 4 && concern !== "unknown" ? 2 : Math.max(s - 1, 0)) as FinderStep),
    restart: () => { setWho(undefined); setAgeBand(undefined); setConcern(undefined); setDetail({}); setStep(0); },
  };
}
