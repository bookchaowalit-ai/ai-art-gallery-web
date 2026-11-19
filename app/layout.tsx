import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

// The font variable sits on <html>: the Reader shell tokens live on :root and read it from there.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const description = "An AI art gallery where every work carries its provenance. No works are filed yet.";

export const metadata: Metadata = {
  title: "AI Art Gallery | Bookchaowalit",
  description,
  keywords: ["AI art gallery", "bookchaowalit", "creative technology"],
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "Bookchaowalit",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", url: "/", title: "AI Art Gallery | Bookchaowalit", description, siteName: "Bookchaowalit" },
  twitter: { card: "summary_large_image", title: "AI Art Gallery | Bookchaowalit", description, creator: "@bookchaowalit" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
