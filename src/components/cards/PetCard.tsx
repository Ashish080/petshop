import Image from 'next/image';
import Link from 'next/link';
import { Pet } from '@/data/pets';

interface PetCardProps {
    pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
    return (
        <div className="group bg-background rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border border-primary/5 flex flex-col h-full hover:-translate-y-1">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {pet.vaccinationBadge && (
                    <div className="absolute top-3 left-3 bg-secondary text-text-inverse text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Vaccinated
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">
                        {pet.name}
                    </h3>
                    <span className="text-sm font-medium text-text-muted bg-primary/10 px-2 py-1 rounded-md">
                        {pet.gender}
                    </span>
                </div>

                <p className="text-primary font-medium mb-3">{pet.breed}</p>

                <div className="flex items-center gap-4 text-sm text-text-muted mb-6 mt-auto">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {pet.age}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Health: {pet.health}
                    </div>
                </div>

                <Link
                    href={`/pets/${pet.id}`}
                    className="w-full text-center block bg-secondary text-text-inverse py-3 rounded-xl font-medium hover:bg-secondary/90 transition-colors"
                >
                    Enquire Now
                </Link>
            </div>
        </div>
    );
}
