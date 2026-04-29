import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { CartProvider } from "@/lib/cart";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Premium African Dining in Morningside, Durban`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "African restaurant Durban",
    "shisanyama Durban",
    "shisanyama Morningside",
    "cocktail lounge Durban",
    "restaurant Morningside Durban",
    "oxtail Durban",
    "traditional food Durban",
    "group dining Durban",
    "birthday dinner Durban",
    "private function venue Durban",
    "Delos Lounge Dining",
    "lounge dining Durban",
  ],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Premium African Dining in Morningside, Durban`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  // Next 16's app/icon.png + app/apple-icon.png conventions auto-emit the
  // primary <link rel="icon"> + apple-touch-icon. We add the legacy .ico and
  // android chrome PNGs here so older crawlers and Android home-screen
  // installs both have a sized asset.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0C0C0C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-black text-cream antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
