"use client";
import { useMemo, useState } from "react";
import type { AgeBand, Concern, Who } from "@/config/finder";
import { productsForTopics, recommendTopics } from "./recommend";

export type FinderStep = 0 | 1 | 2 | 3; // 3 = 결과

// '보장 찾기' 문답 진행 상태 (화면 컴포넌트에는 로직을 넣지 않음)
export function useFinder() {
  const [step, setStep] = useState<FinderStep>(0);
  const [who, setWho] = useState<Who>();
  const [ageBand, setAgeBand] = useState<AgeBand>();
  const [concern, setConcern] = useState<Concern>();

  const result = useMemo(() => {
    if (!who || !ageBand || !concern) return null;
    const topics = recommendTopics({ who, ageBand, concern });
    return { topics, products: productsForTopics(topics, 3) };
  }, [who, ageBand, concern]);

  return {
    step, who, ageBand, concern, result,
    pickWho: (v: Who) => { setWho(v); setStep(1); },
    pickAge: (v: AgeBand) => { setAgeBand(v); setStep(2); },
    pickConcern: (v: Concern) => { setConcern(v); setStep(3); },
    back: () => setStep((s) => (Math.max(s - 1, 0) as FinderStep)),
    restart: () => { setWho(undefined); setAgeBand(undefined); setConcern(undefined); setStep(0); },
  };
}
