import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Providers } from "@/components/Providers";
import { brandConfig } from "@/config/brand";

// Body font — Outfit
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

// Display / heading font — Playfair Display (was declared in @theme but never loaded)
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
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
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body
        className="min-h-screen flex flex-col bg-bg-primary text-text-primary"
        style={{
          fontFamily: "var(--font-sans), sans-serif",
          backgroundColor: "var(--color-bg-primary)",
          color: "var(--color-text-primary)",
        }}
      >
        {/* Skip-to-content link for keyboard & screen-reader accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>

        <ThemeProvider>
          <Providers>
            <main id="main-content" className="flex-1 flex flex-col">
              {children}
            </main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
