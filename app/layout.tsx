import type { Metadata } from "next";
import font from "next/font/local";
import "./globals.css";
import content from "../data/portfolio.json";

export const metadata: Metadata = {
  title: content.site.title,
  description: content.site.description,
};

const sf = font({
  src: "../public/fonts/SF-Pro.woff2",
  weight: "1 1000",
  variable: "--font-sf",
});

const sfMono = font({
  src: "../public/fonts/SF-Mono.woff2",
  weight: "300 900",
  variable: "--font-sf-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sf.variable} ${sfMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
