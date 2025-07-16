import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TRPCProvider } from "@/lib/trpc/provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResearchPal Pro - Deep-dive any product in 30 seconds",
  description: "Production-ready Micro-SaaS for instant product intelligence reports. Pay-as-you-go research with comprehensive 8-section analysis.",
  keywords: ["product research", "market analysis", "consumer insights", "product intelligence"],
  authors: [{ name: "ResearchPal Pro" }],
  creator: "ResearchPal Pro",
  publisher: "ResearchPal Pro",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "ResearchPal Pro - Deep-dive any product in 30 seconds",
    description: "Production-ready Micro-SaaS for instant product intelligence reports. Pay-as-you-go research with comprehensive 8-section analysis.",
    siteName: "ResearchPal Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResearchPal Pro - Deep-dive any product in 30 seconds",
    description: "Production-ready Micro-SaaS for instant product intelligence reports. Pay-as-you-go research with comprehensive 8-section analysis.",
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCProvider>
            {children}
            <Toaster />
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}