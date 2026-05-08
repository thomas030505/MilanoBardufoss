import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://milanobardufoss.no";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Milano Bardufoss — Pizza, grill og kebab | Bestill på nett",
    template: "%s | Milano Bardufoss",
  },
  description:
    "Hos Milano Bardufoss serverer vi maten slik den skal smake: rykende fersk og av høy kvalitet. Bestill på nett, så står maten klar når du kommer innom.",
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "Milano Bardufoss",
    url: SITE_URL,
    title: "Milano Bardufoss — Pizza, grill og kebab",
    description:
      "Bestill pizza, grill og kebab fra Milano Bardufoss. Henting på Rustahøgdveien 16 — åpent hver dag 13–22.",
  },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/site.webmanifest",
  appleWebApp: { title: "Milano" },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ec",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="nb-NO"
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-center" />
        <CookieBanner />
      </body>
    </html>
  );
}
