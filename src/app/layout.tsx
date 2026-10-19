import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site, siteUrl } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { ClickTracker } from "@/components/analytics/ClickTracker";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.title, template: `%s | ${site.fcName}` },
  description: site.description,
  openGraph: {
    title: site.title, description: site.description, type: "website", locale: "ko_KR", siteName: site.title,
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: site.title }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/og/default.png"] },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#FF883A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-paper focus:p-3">
          본문 바로가기
        </a>
        <ScrollProgress />
        <RevealObserver />
        <ClickTracker />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
