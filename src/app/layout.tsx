import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { themeConfig } from "@/config/theme";
import { brandConfig } from "@/config/brand";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body
        style={{
          '--theme-background': themeConfig.colors.background,
          '--theme-primary': themeConfig.colors.primary,
          '--theme-secondary': themeConfig.colors.secondary,
          '--theme-accent': themeConfig.colors.accent,
          '--theme-text-main': themeConfig.colors.text.main,
          '--theme-text-muted': themeConfig.colors.text.muted,
          '--theme-text-inverse': themeConfig.colors.text.inverse,
          '--theme-radius-small': themeConfig.radius.small,
          '--theme-radius-medium': themeConfig.radius.medium,
          '--theme-radius-large': themeConfig.radius.large,
          '--theme-radius-full': themeConfig.radius.full,
          '--theme-shadow-soft': themeConfig.shadows.soft,
          '--theme-shadow-medium': themeConfig.shadows.medium,
        } as React.CSSProperties}
        className="bg-background text-text-main min-h-screen flex flex-col font-sans"
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
