import Link from 'next/link';
import { petsData } from '@/data/pets';
import { PetCard } from '@/components/cards/PetCard';

export function FeaturedPets() {
    // Show only top 4 pets for the homepage
    const featuredPets = petsData.slice(0, 4);

    return (
        <section className="py-16 md:py-24 bg-secondary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Meet Your New Best Friend</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-text-main mt-2">Pets Looking For a Home</h2>
                    </div>
                    <Link href="/pets" className="inline-flex items-center text-primary font-semibold hover:text-accent transition-colors">
                        View All Pets
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredPets.map((pet) => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
                </div>
            </div>
        </section>
    );
}
