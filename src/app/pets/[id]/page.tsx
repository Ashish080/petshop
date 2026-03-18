import { petsData } from '@/data/pets';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { themeConfig } from '@/config/theme';
import { ShieldCheck, Calendar, Phone, MessageCircle } from 'lucide-react';
import { brandConfig } from '@/config/brand';

export default async function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const pet = petsData.find(p => p.id === resolvedParams.id);

    if (!pet) {
        notFound();
    }

    return (
        <div className="py-16 bg-white min-h-screen">
            <div className={themeConfig.spacing.container}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="relative h-96 md:h-[500px] w-full rounded-2xl overflow-hidden shadow-lg group">
                        <Image src={pet.image} alt={pet.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />

                        {/* Interactive Play Button Mockup */}
                        <button className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-10">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-black border-b-8 border-b-transparent ml-1"></div>
                            </div>
                            <span className="absolute bottom-6 font-bold text-white tracking-widest uppercase text-sm drop-shadow-md">View 360° Video</span>
                        </button>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold mb-2" style={{ color: themeConfig.colors.primary }}>{pet.name}</h1>
                        <p className="text-xl mb-6 text-gray-600">{pet.breed} • {pet.species}</p>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-medium">
                                <ShieldCheck size={18} /> {pet.healthStatus}
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">
                                <Calendar size={18} /> {pet.age}
                            </div>
                            <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full font-medium">
                                <span>{pet.gender}</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold mb-3" style={{ color: themeConfig.colors.text }}>About {pet.name}</h3>
                            <p className="text-gray-600 leading-relaxed">{pet.description}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href={`tel:${brandConfig.phone}`} className="flex-1 flex justify-center items-center gap-2 py-3 px-6 rounded-lg font-bold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: themeConfig.colors.primary }}>
                                <Phone size={20} /> Call Now
                            </a>
                            <a href={brandConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 py-3 px-6 rounded-lg font-bold text-white transition-opacity hover:opacity-90 bg-green-500">
                                <MessageCircle size={20} /> WhatsApp
                            </a>
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
