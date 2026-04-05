import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PetCard from '@/components/cards/PetCard';
import { themeConfig } from '@/config/theme';

export default function FeaturedPets({ pets }: { pets: any[] }) {
    const featuredPets = pets || [];

    return (
        <section className={`${themeConfig.spacing.section} bg-white dark:bg-[#1a1a2e] transition-colors duration-300`}>
            <div className={themeConfig.spacing.container}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary font-black text-[10px] uppercase tracking-widest mb-4 border border-brand-primary/20">
                            Furry Friends
                        </div>
                        <h2 className="text-3xl font-black tracking-tight sm:text-5xl mb-4 text-text-primary">
                            Meet Our Featured Pets
                        </h2>
                        <p className="max-w-2xl text-lg font-medium text-text-light leading-relaxed">
                            These lovely companions are waiting for a forever home. Read their stories and find your new best friend.
                        </p>
                    </div>
                    <Link
                        href="/pets"
                        className="flex items-center gap-2 px-8 py-4 bg-brand-primary text-white font-black rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
                    >
                        View All Pets <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredPets.map((pet) => (
                        <PetCard key={pet.id || pet._id} {...pet} />
                    ))}
                    {featuredPets.length === 0 && (
                        <div className="col-span-full py-20 text-center text-text-light font-bold uppercase tracking-widest">
                            No featured pets at the moment
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

