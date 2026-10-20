import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Moosa Alam — Systems & Networking",
  description:
    "Moosa Alam is a University of Guelph Computer Science co-op student building hands-on experience in Linux, networking, cloud infrastructure, and automation.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  openGraph: {
    title: "Moosa Alam — Systems & Networking",
    description:
      "Computer Science co-op student exploring systems, networking, cloud infrastructure, and automation.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moosa Alam — Systems & Networking",
    description:
      "Computer Science co-op student exploring systems, networking, cloud infrastructure, and automation.",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  themeColor: "#f5efd8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${jetbrains.variable} h-full antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
