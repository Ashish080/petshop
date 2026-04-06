import { petsData } from '@/data/pets';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ShieldCheck, Calendar, Phone, MessageCircle, Heart, Share2, Info } from 'lucide-react';
import { brandConfig } from '@/config/brand';
import AdoptPetButton from '@/components/ui/AdoptPetButton';
import { Badge } from '@/components/ui/Badge';

export default async function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const pet = petsData.find(p => p.id === resolvedParams.id);

    if (!pet) {
        notFound();
    }

    return (
        <div className="py-12 md:py-20 bg-bg-primary min-h-screen transition-colors duration-[--duration-normal]">
            <div className="container-app">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">

                    {/* Media Column */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                        <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden shadow-md border border-border group rounded-[--radius-xl]">
                            <Image
                                src={pet.image}
                                alt={pet.name}
                                fill
                                priority
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 70vw"
                            />

                            {/* Overlay Controls */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <button className="p-2.5 glass rounded-full text-text-primary hover:text-brand transition-all hover:scale-110 shadow-sm">
                                    <Heart size={18} />
                                </button>
                                <button className="p-2.5 glass rounded-full text-text-primary hover:text-accent transition-all hover:scale-110 shadow-sm">
                                    <Share2 size={18} />
                                </button>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute bottom-4 left-4">
                                <Badge variant="success" size="lg" dot>{pet.healthStatus}</Badge>
                            </div>
                        </div>

                        {/* Gallery Thumbnails */}
                        <div className="grid grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="relative aspect-square overflow-hidden border-2 border-transparent hover:border-brand transition-all cursor-pointer rounded-[--radius-md]">
                                    <Image
                                        src={pet.image}
                                        alt={`View ${i}`}
                                        fill
                                        className={`object-cover ${i > 1 ? 'opacity-40 grayscale' : ''}`}
                                        sizes="150px"
                                    />
                                    {i === 4 && (
                                        <div className="absolute inset-0 bg-overlay flex items-center justify-center text-white font-semibold">
                                            +5
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
                        <div className="bg-bg-tertiary border border-border p-8 sticky top-28 rounded-[--radius-xl] shadow-xs">
                            <div className="mb-6">
                                <h1 className="text-h1 text-text-primary mb-2 leading-tight">
                                    {pet.name}
                                </h1>
                                <p className="text-h5 text-accent">
                                    {pet.breed} • {pet.age}
                                </p>
                            </div>

                            {/* Detail Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                <div className="bg-bg-secondary p-4 rounded-[--radius-lg] border border-border/50">
                                    <span className="text-overline block mb-1">Gender</span>
                                    <span className="text-label-lg text-text-primary">{pet.gender}</span>
                                </div>
                                <div className="bg-bg-secondary p-4 rounded-[--radius-lg] border border-border/50">
                                    <span className="text-overline block mb-1">Species</span>
                                    <span className="text-label-lg text-text-primary">{pet.species}</span>
                                </div>
                                <div className="bg-bg-secondary p-4 rounded-[--radius-lg] border border-border/50 col-span-2 flex items-center gap-3">
                                    <Calendar className="text-accent" size={18} />
                                    <div>
                                        <span className="text-overline block">Vaccinated</span>
                                        <span className="text-label-lg text-text-primary">Up to date</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="flex items-center gap-2 text-h5 mb-3">
                                    <Info size={18} className="text-brand" />
                                    About {pet.name}
                                </h3>
                                <p className="text-body-sm italic leading-relaxed">
                                    "{pet.description}"
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-4 pt-6 border-t border-border">
                                <AdoptPetButton pet={pet} />

                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <a
                                        href={`tel:${brandConfig.phone}`}
                                        className="flex flex-col items-center justify-center p-4 border border-border hover:bg-bg-secondary transition-all rounded-[--radius-lg]"
                                    >
                                        <Phone size={18} className="mb-2 text-brand" />
                                        <span className="text-overline">Call Store</span>
                                    </a>
                                    <a
                                        href={brandConfig.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center justify-center p-4 border border-border hover:bg-bg-secondary transition-all rounded-[--radius-lg]"
                                    >
                                        <MessageCircle size={18} className="mb-2 text-success" />
                                        <span className="text-overline">WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export function generateStaticParams() {
    return petsData.map((pet) => ({
        id: pet.id,
    }));
}
