import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import MobileStickyCtas from "@/components/ui/MobileStickyCtas";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-grow pb-16 sm:pb-0"> {/* padding bottom for sticky cta */}
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
      <MobileStickyCtas />
    </>
  );
}
