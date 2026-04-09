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

/**
 * ISR: revalidate every 60 seconds.
 *
 * REMOVED: `export const dynamic = 'force-dynamic'`
 * Reason: force-dynamic disables all Next.js static/ISR caching for the
 * most performance-sensitive page in the app, causing a full SSR hit on
 * every request and a 300–800ms TTFB penalty for repeat visitors.
 *
 * Per-fetch revalidation (revalidate: 60 in each data-fetch call) is
 * the correct pattern for product/catalog data that changes infrequently.
 */
export const revalidate = 60;

export default function Home() {
  return (
    <div className="noise-bg">
      <Hero />

      {/*
        Parallax is limited to the first 3 sections for performance.
        Running JS-based parallax on 13+ sections simultaneously causes
        continuous layout recalculations on scroll (main-thread jank).

        • Hero, PetSearchFilter, CategoryGrid → keep parallax (above the fold)
        • All sections below the fold → use plain ScrollStorySection without
          parallaxOffset so Framer uses a passive scroll observer instead.
      */}

      {/* Above-fold parallax (3 sections max) */}
      <ScrollStorySection parallaxOffset={80} direction="up" className="!min-h-fit">
        <PetSearchFilter />
      </ScrollStorySection>

      <ScrollStorySection parallaxOffset={50} direction="down" className="!min-h-fit">
        <CategoryGrid />
      </ScrollStorySection>

      <ScrollStorySection parallaxOffset={80} direction="down">
        <FeaturedPets />
      </ScrollStorySection>

      {/* Below-fold: no parallax offset — CSS scroll-linked reveal only */}
      <HorizontalShowcase />

      <ScrollStorySection direction="up">
        <WhyChooseUs />
      </ScrollStorySection>

      <ScrollStorySection direction="down" className="!min-h-fit">
        <OffersBanner />
      </ScrollStorySection>

      <ScrollStorySection direction="up">
        <BestSellingProducts />
      </ScrollStorySection>

      <ScrollStorySection direction="down">
        <Services />
      </ScrollStorySection>

      <ScrollStorySection direction="up">
        <Testimonials />
      </ScrollStorySection>

      <ScrollStorySection direction="down">
        <BlogPreview />
      </ScrollStorySection>

      <ScrollStorySection direction="up" className="!min-h-fit">
        <Guarantee />
      </ScrollStorySection>
    </div>
  );
}
