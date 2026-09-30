import type { Metadata } from "next";
import { DM_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", weight: "400", subsets: ["latin"] });
const dmMono = DM_Mono({ variable: "--font-dm-mono", weight: ["400", "500"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Art / Gallery — bookchaowalit",
  description: "A visible gallery shell for an AI-art project in progress.",
  keywords: ["AI art gallery", "bookchaowalit", "creative technology"],
  authors: [{ name: "bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "bookchaowalit",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", url: "/", title: "AI Art / Gallery — bookchaowalit", description: "A visible gallery shell for an AI-art project in progress.", siteName: "AI Art / Gallery" },
  twitter: { card: "summary", title: "AI Art / Gallery — bookchaowalit", description: "A visible gallery shell for an AI-art project in progress.", creator: "@bookchaowalit" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${instrumentSerif.variable} ${dmMono.variable}`}>{children}</body></html>;
}
