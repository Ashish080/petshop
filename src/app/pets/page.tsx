import { PetCard } from "@/components/cards/PetCard";
import { petsData } from "@/data/pets";

export const metadata = {
  title: "Our Pets - Find Your New Best Friend",
  description: "Browse our adorable pets available for adoption.",
};

export default function PetsPage() {
  return (
    <div className="bg-background min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
            Meet Our Adorable Pets
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            Find your new best friend from our carefully selected, healthy, and happy pets waiting for a loving home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {petsData.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </div>
    </div>
  );
}
