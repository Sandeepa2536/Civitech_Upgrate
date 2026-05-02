import type { Metadata } from "next";
import { Geist_Mono, Philosopher } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AlertProvider } from "@/components/AlertContext";
import { LoadingProvider } from "@/components/LoadingContext";
import Preloader from "@/components/Preloader";
import LayoutWrapper from "@/components/LayoutWrapper";

const philosopher = Philosopher({
  variable: "--font-philosopher",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Civitech Constructions (Pvt) Ltd",
    template: "%s | Civitech Constructions"
  },
  description: "Civitech Constructions (Pvt) Ltd is a premier civil engineering and construction firm in Sri Lanka, specializing in industrial, institutional, and commercial infrastructure with over 22 years of expertise.",
  keywords: ["Construction", "Engineering", "Civitech", "Sri Lanka", "Civil Engineering", "Factories", "Infrastructure", "ICTAD C4"],
  authors: [{ name: "Civitech Constructions" }],
  creator: "Civitech",
  metadataBase: new URL("https://civitech.lk"),
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: "https://civitech.lk",
    title: "Civitech Constructions (Pvt) Ltd",
    description: "Building Sri Lanka's future through engineering excellence and technical precision.",
    siteName: "Civitech Constructions",
    images: [
      {
        url: "/logo_withbg.png",
        width: 1200,
        height: 630,
        alt: "Civitech Constructions Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Civitech Constructions (Pvt) Ltd",
    description: "Premier Civil Engineering and Construction Firm in Sri Lanka",
    images: ["/logo_withbg.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${philosopher.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LoadingProvider>
            <Preloader />
            <AlertProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </AlertProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
