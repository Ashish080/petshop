import Hero from "@/components/sections/Hero";
import PetSearchFilter from "@/components/sections/PetSearchFilter";
import CategoryGrid from "@/components/sections/CategoryGrid";
import FeaturedPets from "@/components/sections/FeaturedPets";
import BestSellingProducts from "@/components/sections/BestSellingProducts";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Services from "@/components/sections/Services";
import OffersBanner from "@/components/sections/OffersBanner";
import Testimonials from "@/components/sections/Testimonials";
import Guarantee from "@/components/sections/Guarantee";
import BlogPreview from "@/components/sections/BlogPreview";
import { ScrollStorySection } from "@/components/ui/ScrollStory";
import { HorizontalShowcase } from "@/components/sections/HorizontalShowcase";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="noise-bg">
      <Hero />
      
      <ScrollStorySection parallaxOffset={100} direction="up" className="!min-h-fit">
        <PetSearchFilter />
      </ScrollStorySection>

      <ScrollStorySection parallaxOffset={70} direction="down" className="!min-h-fit">
        <CategoryGrid />
      </ScrollStorySection>

      <ScrollStorySection parallaxOffset={150} direction="down">
        <FeaturedPets />
      </ScrollStorySection>

      {/* Dynamic Collection Showcase (Vertical to Horizontal) */}
      <HorizontalShowcase />

      <ScrollStorySection parallaxOffset={80} direction="up">
        <WhyChooseUs />
      </ScrollStorySection>

      <ScrollStorySection parallaxOffset={50} direction="down" className="!min-h-fit">
        <OffersBanner />
      </ScrollStorySection>

      <ScrollStorySection parallaxOffset={120} direction="up">
        <BestSellingProducts />
      </ScrollStorySection>

      <ScrollStorySection parallaxOffset={80} direction="down">
        <Services />
      </ScrollStorySection>

      <ScrollStorySection parallaxOffset={100} direction="up">
        <Testimonials />
      </ScrollStorySection>

      <ScrollStorySection parallaxOffset={40} direction="down">
        <BlogPreview />
      </ScrollStorySection>

      <ScrollStorySection parallaxOffset={20} direction="up" className="!min-h-fit">
        <Guarantee />
      </ScrollStorySection>
    </div>
  );
}
