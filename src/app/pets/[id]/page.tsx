import { petsData } from "@/data/pets";
import { notFound } from "next/navigation";
import { brandConfig } from "@/config/brand";

interface PageProps {
    params: Promise<{ id: string }>;
}

export function generateStaticParams() {
    return petsData.map((pet) => ({
        id: pet.id,
    }));
}

export default async function PetDetailPage(props: PageProps) {
    const params = await props.params;
    const pet = petsData.find((p) => p.id === params.id);

    if (!pet) {
        notFound();
    }

    return (
        <div className="bg-background min-h-screen py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-soft border border-primary/5 flex flex-col md:flex-row gap-10">
                    {/* Image Gallery */}
                    <div className="w-full md:w-1/2">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-medium">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={pet.image}
                                alt={pet.name}
                                className="w-full h-full object-cover"
                            />
                            {pet.vaccinationBadge && (
                                <div className="absolute top-4 left-4 bg-secondary text-text-inverse px-4 py-2 rounded-full font-bold shadow-sm">
                                    Vaccinated
                                </div>
                            )}
                        </div>

                        {/* Optional Video Thumbnail Placeholder */}
                        <div className="mt-4 flex gap-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-primary cursor-pointer relative opacity-60 hover:opacity-100 transition-opacity">
                                <img src={pet.image} alt="Thumbnail 1" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-primary/10 cursor-pointer flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Pet Details */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <div className="mb-3 flex items-center gap-3">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-wide">
                                {pet.breed}
                            </span>
                            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-wide">
                                {pet.gender}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-text-main mb-6 leading-tight">
                            {pet.name}
                        </h1>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-primary/5 p-5 rounded-2xl text-center">
                                <span className="text-text-muted text-sm block mb-1">Age</span>
                                <span className="text-xl font-bold text-text-main">{pet.age}</span>
                            </div>
                            <div className="bg-primary/5 p-5 rounded-2xl text-center">
                                <span className="text-text-muted text-sm block mb-1">Health</span>
                                <span className="text-xl font-bold text-text-main">{pet.health}</span>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-text-main mb-3">About {pet.name}</h3>
                            <p className="text-text-muted leading-relaxed text-lg">
                                {pet.description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                            <a
                                href={`https://wa.me/${brandConfig.whatsapp.replace(/\\D/g, '')}?text=Hi, I am interested in ${pet.name} (${pet.breed})`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex justify-center items-center bg-primary text-text-inverse py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-medium hover:-translate-y-1"
                            >
                                WhatsApp Us
                            </a>
                            <a
                                href={`tel:${brandConfig.phone.replace(/\\s/g, '')}`}
                                className="flex-1 flex justify-center items-center bg-background border-2 border-primary/20 text-primary py-4 rounded-full font-bold text-lg hover:border-primary/50 transition-all shadow-soft"
                            >
                                Call to Enquire
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
