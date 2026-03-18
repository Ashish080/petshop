import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PetCard from '@/components/cards/PetCard';
import { petsData } from '@/data/pets';
import { themeConfig } from '@/config/theme';

export default function FeaturedPets() {
    const featuredPets = petsData.filter(pet => pet.isFeatured).slice(0, 4);

    return (
        <section className={`${themeConfig.spacing.section} bg-white dark:bg-[#1a1a2e] transition-colors duration-300`}>
            <div className={themeConfig.spacing.container}>
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3" style={{ color: themeConfig.colors.text }}>
                            Meet Our Featured Pets
                        </h2>
                        <p className="max-w-2xl text-lg" style={{ color: themeConfig.colors.textLight }}>
                            These lovely companions are waiting for a forever home. Read their stories and find your new best friend.
                        </p>
                    </div>
                    <Link
                        href="/pets"
                        className="hidden md:flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity"
                        style={{ color: themeConfig.colors.primary }}
                    >
                        View All Pets <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {featuredPets.map((pet) => (
                        <PetCard key={pet.id} {...pet} />
                    ))}
                </div>

                <div className="mt-10 md:hidden flex justify-center">
                    <Link href="/pets">
                        <button
                            className={`flex items-center gap-2 px-6 py-3 font-semibold border ${themeConfig.radius.md}`}
                            style={{ color: themeConfig.colors.primary, borderColor: themeConfig.colors.primary }}
                        >
                            View All Pets <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
