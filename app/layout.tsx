import type { Metadata } from "next";
import { DM_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", weight: "400", subsets: ["latin"] });
const dmMono = DM_Mono({ variable: "--font-dm-mono", weight: ["400", "500"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Art / Gallery — bookchaowalit",
  description: "A visible gallery shell for an AI-art project in progress.",
  keywords: ["AI art gallery", "bookchaowalit", "creative technology"],
  authors: [{ name: "bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "bookchaowalit",
  metadataBase: new URL("https://bookchaowalit.com"),
  alternates: { canonical: "https://bookchaowalit.com" },
  openGraph: { type: "website", locale: "en_US", url: "https://bookchaowalit.com", title: "AI Art / Gallery — bookchaowalit", description: "A visible gallery shell for an AI-art project in progress.", siteName: "AI Art / Gallery", images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Art / Gallery" }] },
  twitter: { card: "summary_large_image", title: "AI Art / Gallery — bookchaowalit", description: "A visible gallery shell for an AI-art project in progress.", images: ["/og-image.png"], creator: "@bookchaowalit" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${instrumentSerif.variable} ${dmMono.variable}`}>{children}</body></html>;
}
