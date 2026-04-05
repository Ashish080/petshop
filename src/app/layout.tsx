import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Providers } from "@/components/Providers";
import { brandConfig } from "@/config/brand";
import { ClientMotionLayer } from "@/components/motion/ClientMotionLayer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: `${brandConfig.name} — ${brandConfig.tagline}`,
  description: brandConfig.description,
  openGraph: {
    title: `${brandConfig.name} — ${brandConfig.tagline}`,
    description: brandConfig.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <ThemeProvider>
          <Providers>
            <ClientMotionLayer />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
