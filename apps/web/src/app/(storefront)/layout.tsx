import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-grow pb-32">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </>
  );
}

