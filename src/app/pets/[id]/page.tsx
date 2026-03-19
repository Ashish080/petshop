import { petsData } from '@/data/pets';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { themeConfig } from '@/config/theme';
import { ShieldCheck, Calendar, Phone, MessageCircle, Heart, Share2, Info } from 'lucide-react';
import { brandConfig } from '@/config/brand';
import AdoptPetButton from '@/components/ui/AdoptPetButton';

export default async function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const pet = petsData.find(p => p.id === resolvedParams.id);

    if (!pet) {
        notFound();
    }

    return (
        <div className="py-12 md:py-20 bg-bg-page min-h-screen transition-colors duration-300">
            <div className={themeConfig.spacing.container}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">

                    {/* Media Column */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                        <div className={`relative h-[400px] md:h-[600px] w-full overflow-hidden shadow-2xl border border-card-border group ${themeConfig.radius.lg}`}>
                            <Image
                                src={pet.image}
                                alt={pet.name}
                                fill
                                priority
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 70vw"
                            />

                            {/* Overlay Controls */}
                            <div className="absolute top-6 right-6 flex flex-col gap-3">
                                <button className="p-3 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full text-text-primary hover:text-brand-primary transition-all hover:scale-110 shadow-lg">
                                    <Heart size={20} className="hover:fill-brand-primary" />
                                </button>
                                <button className="p-3 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full text-text-primary hover:text-secondary transition-all hover:scale-110 shadow-lg">
                                    <Share2 size={20} />
                                </button>
                            </div>

                            {/* Status Overlay */}
                            <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-full font-black text-sm shadow-xl animate-bounce-slow">
                                <ShieldCheck size={18} strokeWidth={3} />
                                {pet.healthStatus}
                            </div>
                        </div>

                        {/* Gallery Thumbnails Mockup */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`relative aspect-square overflow-hidden border-2 border-transparent hover:border-brand-primary transition-all cursor-pointer bg-white/10 ${themeConfig.radius.md}`}>
                                    <Image
                                        src={pet.image}
                                        alt={`View ${i}`}
                                        fill
                                        className={`object-cover ${i > 1 ? 'opacity-40 grayscale' : ''}`}
                                        sizes="150px"
                                    />
                                    {i === 4 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-black">
                                            +5
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
                        <div className={`bg-white dark:bg-card-bg border border-card-border p-8 lg:p-10 sticky top-28 ${themeConfig.radius.lg} ${themeConfig.shadows.soft}`}>
                            <div className="mb-8">
                                <h1 className="text-4xl md:text-5xl font-black mb-3 text-text-primary leading-tight">
                                    {pet.name}
                                </h1>
                                <p className="text-xl text-secondary font-black tracking-tight">
                                    {pet.breed} • {pet.age}
                                </p>
                            </div>

                            {/* Detail Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="bg-bg-page/50 dark:bg-white/5 p-4 rounded-2xl border border-card-border/50">
                                    <span className="text-xs font-black uppercase tracking-widest text-text-light block mb-1">Gender</span>
                                    <span className="font-black text-text-primary">{pet.gender}</span>
                                </div>
                                <div className="bg-bg-page/50 dark:bg-white/5 p-4 rounded-2xl border border-card-border/50">
                                    <span className="text-xs font-black uppercase tracking-widest text-text-light block mb-1">Species</span>
                                    <span className="font-black text-text-primary">{pet.species}</span>
                                </div>
                                <div className="bg-bg-page/50 dark:bg-white/5 p-4 rounded-2xl border border-card-border/50 col-span-2 flex items-center gap-3">
                                    <Calendar className="text-secondary" size={20} />
                                    <div>
                                        <span className="text-xs font-black uppercase tracking-widest text-text-light block">Vaccinated</span>
                                        <span className="font-black text-text-primary">Up to date</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-10">
                                <h3 className="flex items-center gap-2 text-lg font-black mb-3 text-text-primary">
                                    <Info size={20} className="text-brand-primary" />
                                    About {pet.name}
                                </h3>
                                <p className="text-text-light leading-relaxed font-medium italic">
                                    "{pet.description}"
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4 pt-6 border-t border-card-border/50">
                                <AdoptPetButton pet={pet} />

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <a
                                        href={`tel:${brandConfig.phone}`}
                                        className={`flex flex-col items-center justify-center p-4 border border-card-border hover:bg-bg-page transition-all ${themeConfig.radius.lg}`}
                                    >
                                        <Phone size={20} className="mb-2 text-brand-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-light">Call Store</span>
                                    </a>
                                    <a
                                        href={brandConfig.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex flex-col items-center justify-center p-4 border border-card-border hover:bg-bg-page transition-all ${themeConfig.radius.lg}`}
                                    >
                                        <MessageCircle size={20} className="mb-2 text-green-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-light">WhatsApp</span>
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
