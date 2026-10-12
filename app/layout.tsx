import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MOOSA.OS — Moosa Alam",
  description:
    "Interactive desktop portfolio for Moosa Alam. Computer Science @ University of Guelph. Systems · Cloud · Security. Featuring Todd.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  openGraph: {
    title: "MOOSA.OS — Moosa Alam",
    description:
      "Computer Science student at University of Guelph focused on systems, cloud infrastructure, and security.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOOSA.OS — Moosa Alam",
    description:
      "Computer Science @ Guelph. Systems · Cloud · Security. Open to infra, cloud, and networking co-op roles.",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  themeColor: "#121418",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${plusJakarta.variable} ${ibmPlex.variable} font-sans antialiased h-full bg-[var(--os-bg)] text-white`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
