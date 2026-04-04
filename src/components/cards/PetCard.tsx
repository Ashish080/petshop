"use client";

import Image from 'next/image';
import { CheckCircle2, Award, Heart, MessageCircle } from 'lucide-react';
import { brandConfig } from '@/config/brand';

interface PetCardProps {
    id: string;
    name: string;
    breed: string;
    age: string;
    image: string;
    healthStatus: string;
    price?: number;
}

export default function PetCard({ name, breed, age, image, healthStatus, price }: PetCardProps) {
    const handleWhatsApp = () => {
        window.open(`https://wa.me/${brandConfig.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I am interested in ${name} (${breed}). Is it available?`, '_blank');
    };

    return (
        <div className="bg-white dark:bg-card-bg border border-card-border rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_rgba(27,67,50,0.08)] transition-all duration-300 group hover:-translate-y-1">
            <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                <Image
                    src={image}
                    alt={`Photo of ${breed}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Badges overlay */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                    <div className="bg-green-100/95 backdrop-blur-sm text-green-800 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm flex items-center gap-1">
                        <CheckCircle2 size={12} /> Verified
                    </div>
                    <div className="bg-amber-100/95 backdrop-blur-sm text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm flex items-center gap-1">
                        <Award size={12} /> KCI Cert
                    </div>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-xl font-black text-text-primary mb-1 font-serif">{name !== 'Milo' && name !== 'Bella' ? breed : name}</h3>
                <div className="text-xs font-bold text-text-light mb-3">{age} • {healthStatus}</div>
                
                {/* Pet Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-bg-page rounded-xl p-2.5">
                        <div className="text-[10px] uppercase font-black text-text-light tracking-widest mb-0.5">Vaccination</div>
                        <div className="text-sm font-bold text-text-primary leading-tight">Up to Date</div>
                    </div>
                    <div className="bg-bg-page rounded-xl p-2.5">
                        <div className="text-[10px] uppercase font-black text-text-light tracking-widest mb-0.5">Free Vet</div>
                        <div className="text-sm font-bold text-text-primary leading-tight flex items-center gap-1">
                            Included <CheckCircle2 size={12} className="text-green-500"/>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-card-border mt-auto">
                    <div>
                        <div className="text-lg font-black text-brand-primary">₹{price ? price.toLocaleString('en-IN') : '28,000'}</div>
                        <div className="text-[10px] font-bold text-text-light uppercase tracking-widest">Negotiable</div>
                    </div>
                    <button 
                        onClick={handleWhatsApp}
                        className="bg-brand-primary text-white px-4 py-2.5 rounded-xl font-black text-sm flex items-center gap-1.5 hover:bg-orange-600 transition-colors"
                    >
                        <MessageCircle size={16} /> Inquire
                    </button>
                </div>
            </div>
        </div>
    );
}
