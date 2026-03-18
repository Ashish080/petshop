"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Phone, Calendar } from 'lucide-react';
import { themeConfig } from '@/config/theme';

interface PetCardProps {
    id: string;
    name: string;
    breed: string;
    age: string;
    image: string;
    healthStatus: string;
}

export default function PetCard({ id, name, breed, age, image, healthStatus }: PetCardProps) {
    return (
        <div
            className={`bg-white dark:bg-card-bg overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-card-border ${themeConfig.radius.lg} ${themeConfig.shadows.soft} hover:${themeConfig.shadows.hover}`}
        >
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={image}
                    alt={`Photo of ${name} the ${breed}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 text-green-700 shadow-sm">
                    <ShieldCheck size={14} />
                    {healthStatus}
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black text-text-primary">{name}</h3>
                    <span className="text-xs font-black px-2 py-1 bg-secondary/10 text-secondary rounded-full">{age}</span>
                </div>
                <p className="text-sm mb-5 text-text-light font-medium">{breed}</p>

                <div className="flex gap-3 mt-6">
                    <button
                        className={`flex-1 py-3 flex items-center justify-center gap-2 font-black text-sm transition-all border-2 border-secondary text-secondary hover:bg-secondary/5 ${themeConfig.radius.lg}`}
                    >
                        <Phone size={18} strokeWidth={2.5} />
                        Call Now
                    </button>
                    <Link href={`/pets/${id}`} className="flex-1">
                        <button
                            className={`w-full py-3 flex items-center justify-center gap-2 font-black text-sm transition-all bg-brand-primary text-white hover:opacity-90 shadow-lg shadow-brand-primary/20 ${themeConfig.radius.lg}`}
                        >
                            <Calendar size={18} strokeWidth={2.5} />
                            Book Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
