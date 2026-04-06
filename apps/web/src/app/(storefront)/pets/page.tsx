import { petsData } from '@/data/pets';
import PetCard from '@/components/cards/PetCard';
import { themeConfig } from '@/config/theme';
import PetFilters from '@/components/ui/PetFilters';

export const metadata = { title: "Our Pets" };

export default function PetsPage() {
    return (
        <div className="py-12 md:py-20 min-h-screen bg-bg-page transition-colors duration-300">
            <div className={themeConfig.spacing.container}>
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-text-primary">Pet Listing Page</h1>
                    <p className="text-lg text-text-light max-w-2xl">
                        Find your perfect companion. Filter through our curated list of healthy and happy pets waiting for a home.
                    </p>
                </div>

                <PetFilters />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {petsData.map(pet => (
                        <PetCard key={pet.id} {...pet} />
                    ))}
                </div>
            </div>
        </div>
    );
}
