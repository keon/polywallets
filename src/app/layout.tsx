import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://polywallets.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Polywallets — Polymarket Wallet Explorer",
    template: "%s | Polywallets",
  },
  description:
    "Explore any Polymarket wallet. View positions, P&L, win rate, trading style, leaderboard rankings, and more.",
  keywords: [
    "Polymarket",
    "wallet explorer",
    "prediction markets",
    "P&L tracker",
    "trading analytics",
    "leaderboard",
    "crypto",
    "polygon",
  ],
  authors: [{ name: "Polywallets" }],
  creator: "Polywallets",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Polywallets",
    title: "Polywallets — Polymarket Wallet Explorer",
    description:
      "Explore any Polymarket wallet. Positions, P&L, performance, leaderboard, and more.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Polywallets — Polymarket Wallet Explorer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Polywallets — Polymarket Wallet Explorer",
    description:
      "Explore any Polymarket wallet. Positions, P&L, performance, leaderboard, and more.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} antialiased`}
      >
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="e1300e9c-1997-4aec-8f36-ada3528ecf0c"
          strategy="afterInteractive"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
