import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Moosa Alam",
  description:
    "CS student @ UofG, interested in systems, infrastructure and cybersecurity.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  openGraph: {
    title: "Moosa Alam",
    description:
      "CS student @ UofG, interested in systems, infrastructure and cybersecurity.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moosa Alam",
    description:
      "CS student @ UofG, interested in systems, infrastructure and cybersecurity.",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${jetbrains.variable} ${caveat.variable} h-full antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
