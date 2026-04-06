import { petsData } from '@/data/pets';
import PetCard from '@/components/cards/PetCard';
import PetFilters from '@/components/ui/PetFilters';

export const metadata = { title: "Our Pets" };

export default function PetsPage() {
    return (
        <div className="py-12 md:py-20 min-h-screen bg-bg-primary transition-colors duration-[--duration-normal]">
            <div className="container-app">
                <div className="mb-12">
                    <h1 className="text-h1 mb-4">Pet Listing Page</h1>
                    <p className="text-body-lg max-w-2xl">
                        Find your perfect companion. Filter through our curated list of healthy and happy pets waiting for a home.
                    </p>
                </div>

                <PetFilters />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {petsData.map(pet => (
                        <PetCard key={pet.id} {...pet} />
                    ))}
                </div>
            </div>
        </div>
    );
}
