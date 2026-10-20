import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Moosa Alam | Cloud, Systems & Software Engineer",
  description:
    "Explore Moosa Alam's interactive portfolio of cloud reliability, distributed systems, security, and networking projects.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  openGraph: {
    title: "Moosa Alam | Cloud, Systems & Software Engineer",
    description:
      "An interactive portfolio of cloud reliability, distributed systems, security, and networking projects.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moosa Alam | Cloud, Systems & Software Engineer",
    description:
      "An interactive portfolio of cloud reliability, distributed systems, security, and networking projects.",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  themeColor: "#172c2e",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${outfit.variable} ${jetbrains.variable} h-full antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
