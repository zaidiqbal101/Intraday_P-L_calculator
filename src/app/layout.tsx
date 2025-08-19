import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intraday P&L Calculator - Calculate Trading Profits",
  description: "Calculate intraday and delivery trading profits with our free P&L calculator. Get detailed breakdowns of brokerage, STT, and other charges instantly.",
  keywords: ["intraday P&L calculator", "trading profit calculator", "stock market P&L", "intraday trading calculator", "delivery trading calculator", "brokerage calculator"],
  openGraph: {
    title: "Intraday P&L Calculator - Calculate Trading Profits",
    description: "Use our free intraday P&L calculator to compute trading profits and losses with detailed charge breakdowns for intraday and delivery trades.",
    url: "https://intraday-pl-calculator.com",
    siteName: "Intraday P&L Calculator",
    images: [
      {
        url: "https://intraday-pl-calculator.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Intraday P&L Calculator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Intraday P&L Calculator",
    description: "Calculate trading profits and losses with our free intraday and delivery P&L calculator, including detailed charge breakdowns.",
    images: ["https://intraday-pl-calculator.com/og-image.jpg"],
  },
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
      <head>
        <link rel="canonical" href="https://intraday-pl-calculator.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">{children}</main>
          <footer className="text-center p-4 text-sm text-gray-500 border-t">
            Powered by{" "}
            <a
              href="https://github.com/zaidiqbal101"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Zaid Iqbal
            </a>
            {" "} |{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Intraday P&L Calculator
            </a>
            {" "} |{" "}
            <a href="/blog" className="text-blue-600 hover:underline">
              Trading Blog
            </a>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}