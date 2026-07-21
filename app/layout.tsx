import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AnnouncementBanner } from "@/components/announcement-banner";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Neura Tech AI — Building the Future of Artificial Intelligence",
    template: "%s — Neura Tech AI",
  },
  description:
    "Neura Tech AI develops open-source and enterprise AI models, research, tools, and intelligent systems for the next generation.",
  metadataBase: new URL("https://neuratech.ai"),
  openGraph: {
    title: "Neura Tech AI",
    description:
      "Open-source and enterprise AI models, research, and tools for the next generation.",
    url: "https://neuratech.ai",
    siteName: "Neura Tech AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neura Tech AI",
    description: "Building the future of artificial intelligence.",
  },
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body">
        <Providers>
          <AnnouncementBanner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
