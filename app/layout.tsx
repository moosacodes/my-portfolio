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
  title: "Moosa Alam — MOOSA.EXE",
  description:
    "Moosa Alam is a University of Guelph Computer Science student building and investigating systems, networking, cloud infrastructure, and automation projects.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  openGraph: {
    title: "Moosa Alam — MOOSA.EXE",
    description:
      "Computer Science co-op student building and investigating the layers underneath reliable software.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moosa Alam — MOOSA.EXE",
    description:
      "Computer Science co-op student building and investigating the layers underneath reliable software.",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  themeColor: "#171a19",
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
