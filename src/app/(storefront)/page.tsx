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
import ScrollFadeIn from "@/components/ui/ScrollFadeIn";

export default function Home() {
  return (
    <>
      <Hero />
      <PetSearchFilter />
      <ScrollFadeIn delay={100}><FeaturedPets /></ScrollFadeIn>
      <ScrollFadeIn delay={100}><WhyChooseUs /></ScrollFadeIn>
      <ScrollFadeIn delay={50}><OffersBanner /></ScrollFadeIn>
      <ScrollFadeIn delay={100}><Testimonials /></ScrollFadeIn>
      <ScrollFadeIn delay={50}><Guarantee /></ScrollFadeIn>
      <ScrollFadeIn delay={100}><BestSellingProducts /></ScrollFadeIn>
      <ScrollFadeIn delay={100}><Services /></ScrollFadeIn>
      <ScrollFadeIn delay={100}><BlogPreview /></ScrollFadeIn>
    </>
  );
}
