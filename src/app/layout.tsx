import type { Metadata } from "next";
import { Bodoni_Moda, Montserrat } from "next/font/google";
import "./globals.css";

const editorial = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-editorial",
  weight: "variable",
});

const sans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Christie Kanska — Voice, Piano & Composition",
  description: "The music, story, performances and teaching practice of Christie Kanska.",
  metadataBase: new URL("https://christie-kanska-piano.vercel.app"),
  openGraph: {
    title: "Christie Kanska — Voice, Piano & Composition",
    description: "A life in music — vocalist, pianist, composer and educator.",
    images: ["/christie-hero.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${editorial.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}
