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

export const dynamic = 'force-dynamic';

async function getFeaturedPets() {
    try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/pets?featured=true`, { cache: 'no-store' });
        if (!res.ok) return [];
        const result = await res.json();
        return result.data || [];
    } catch (e) {
        console.error('Failed to fetch featured pets:', e);
        return [];
    }
}

async function getBestSellers() {
    try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        // Mocking bestseller filter via products API if not implemented, 
        // but our products API doesn't have a bestseller filter yet.
        // For now, just take top 4.
        const res = await fetch(`${baseUrl}/api/products?limit=4`, { cache: 'no-store' });
        if (!res.ok) return [];
        const result = await res.json();
        return result.data || [];
    } catch (e) {
        console.error('Failed to fetch best sellers:', e);
        return [];
    }
}

export default async function Home() {
    const [featuredPets, bestSellers] = await Promise.all([
        getFeaturedPets(),
        getBestSellers()
    ]);

    return (
        <>
            <Hero />
            <PetSearchFilter />
            <ScrollFadeIn delay={100}>
                <FeaturedPets pets={featuredPets} />
            </ScrollFadeIn>
            <ScrollFadeIn delay={100}><WhyChooseUs /></ScrollFadeIn>
            <ScrollFadeIn delay={50}><OffersBanner /></ScrollFadeIn>
            <ScrollFadeIn delay={100}><Testimonials /></ScrollFadeIn>
            <ScrollFadeIn delay={50}><Guarantee /></ScrollFadeIn>
            <ScrollFadeIn delay={100}>
                <BestSellingProducts products={bestSellers} />
            </ScrollFadeIn>
            <ScrollFadeIn delay={100}><Services /></ScrollFadeIn>
            <ScrollFadeIn delay={100}><BlogPreview /></ScrollFadeIn>
        </>
    );
}

