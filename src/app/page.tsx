import Hero from "@/components/sections/Hero";
import CategoryGrid from "@/components/sections/CategoryGrid";
import FeaturedPets from "@/components/sections/FeaturedPets";
import BestSellingProducts from "@/components/sections/BestSellingProducts";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Services from "@/components/sections/Services";
import OffersBanner from "@/components/sections/OffersBanner";
import Testimonials from "@/components/sections/Testimonials";
import BlogPreview from "@/components/sections/BlogPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedPets />
      <WhyChooseUs />
      <BestSellingProducts />
      <OffersBanner />
      <Services />
      <Testimonials />
      <BlogPreview />
    </>
  );
}
