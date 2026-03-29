import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://codereview-ai.com'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "CodeReview AI — Revisión de código con IA en segundos",
    template: "%s — CodeReview AI",
  },
  description:
    "Pega tu código y obtén un análisis completo: bugs, seguridad OWASP, performance y mejores prácticas. Powered by Claude AI. Gratis para empezar.",
  keywords: [
    "code review ia", "revisión de código inteligencia artificial",
    "análisis de código automático", "detector vulnerabilidades código",
    "owasp code review", "herramienta code review", "ai code reviewer español",
  ],
  authors: [{ name: "CodeReview AI" }],
  creator: "CodeReview AI",
  openGraph: {
    title: "CodeReview AI — Revisión de código con IA",
    description: "Detecta bugs, vulnerabilidades OWASP y problemas de performance en segundos. Sin instalar nada.",
    type: "website",
    url: APP_URL,
    siteName: "CodeReview AI",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeReview AI — Revisión de código con IA",
    description: "Detecta bugs, vulnerabilidades OWASP y problemas de performance en segundos.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
