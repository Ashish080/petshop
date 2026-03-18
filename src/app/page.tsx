import { Hero } from "@/components/sections/Hero";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { FeaturedPets } from "@/components/sections/FeaturedPets";
import { BestSellingProducts } from "@/components/sections/BestSellingProducts";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { OffersBanner } from "@/components/sections/OffersBanner";
import { BlogPreview } from "@/components/sections/BlogPreview";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <CategoryGrid />
      <FeaturedPets />
      <BestSellingProducts />
      <WhyChooseUs />
      <ServicesSection />
      <TestimonialsSection />
      <OffersBanner />
      <BlogPreview />
    </div>
  );
}
