"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// 페이지 아래쪽의 상담 신청 폼 — 화면 가까이 오면(또는 #consult 로 바로 들어오면) 그때 불러옵니다.
// 첫 화면에서 쓰지 않는 폼 코드를 미리 실행하지 않아 첫 화면이 빨라져요. (/consult 페이지는 바로 그립니다)
const ConsultForm = dynamic(() => import("./ConsultForm").then((m) => m.ConsultForm), {
  ssr: false,
  loading: () => <FormPlaceholder />,
});

function FormPlaceholder() {
  return <div aria-hidden="true" className="min-h-[36rem] rounded-card border border-ink/10 bg-paper" />;
}

export function DeferredConsultForm({ initialTopic }: { initialTopic?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#consult" || !("IntersectionObserver" in window)) { setShow(true); return; }
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setShow(true); io.disconnect(); } }, { rootMargin: "800px 0px" });
    io.observe(el);
    const onHash = () => { if (window.location.hash === "#consult") setShow(true); };
    window.addEventListener("hashchange", onHash);
    return () => { io.disconnect(); window.removeEventListener("hashchange", onHash); };
  }, []);

  return <div ref={box}>{show ? <ConsultForm initialTopic={initialTopic} /> : <FormPlaceholder />}</div>;
}
