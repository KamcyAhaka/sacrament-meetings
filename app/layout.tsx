import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Oak Hills 2nd Ward - Sacrament Meeting Planner",
    template: "%s | Oak Hills 2nd Ward",
  },
  description: "Access, view, and print weekly sacrament meeting programs online.",
  openGraph: {
    title: "Oak Hills 2nd Ward - Sacrament Meeting Planner",
    description: "Access, view, and print weekly sacrament meeting programs online.",
    url: "https://sacrament.oakhills2nd.org",
    siteName: "Sacrament Planner",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        alt: "Oak Hills 2nd Ward Sacrament Meeting Planner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oak Hills 2nd Ward - Sacrament Meeting Planner",
    description: "Access, view, and print weekly sacrament meeting programs online.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-200">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
