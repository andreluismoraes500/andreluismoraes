import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "André Luis de Moraes — Desenvolvedor Full Stack",
  description:
    "Desenvolvedor Full Stack especializado em React, Next.js, TypeScript e Node.js. Construo produtos digitais rápidos, escaláveis e bonitos.",
  openGraph: {
    title: "André Luis de Moraes — Desenvolvedor Full Stack",
    description: "Sites, SaaS, e-commerces e APIs sob medida com React, Next.js e Node.js.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image", title: "André Luis de Moraes — Desenvolvedor Full Stack" },
};

export const viewport: Viewport = { themeColor: "#050505", colorScheme: "dark" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
