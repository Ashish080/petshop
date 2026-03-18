import { petsData } from '@/data/pets';
import PetCard from '@/components/cards/PetCard';
import { themeConfig } from '@/config/theme';

export const metadata = { title: "Our Pets" };

export default function PetsPage() {
    return (
        <div className="py-16 min-h-screen" style={{ backgroundColor: themeConfig.colors.background }}>
            <div className={themeConfig.spacing.container}>
                <h1 className="text-4xl font-bold mb-8" style={{ color: themeConfig.colors.primary }}>Our Lovely Pets</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {petsData.map(pet => (
                        <PetCard key={pet.id} {...pet} />
                    ))}
                </div>
            </div>
        </div>
    );
}
