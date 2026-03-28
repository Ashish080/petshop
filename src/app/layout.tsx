import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Providers } from "@/components/Providers";
import { brandConfig } from "@/config/brand";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: `${brandConfig.name} - ${brandConfig.tagline}`,
  description: brandConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Providers>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <FloatingWhatsApp />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
