"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
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
            className={`bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 ${themeConfig.radius.lg} ${themeConfig.shadows.soft} hover:${themeConfig.shadows.hover}`}
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
                    <h3 className="text-xl font-bold" style={{ color: themeConfig.colors.text }}>{name}</h3>
                    <span className="text-sm font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-md">{age}</span>
                </div>
                <p className="text-sm mb-5" style={{ color: themeConfig.colors.textLight }}>{breed}</p>

                <Link href={`/pets/${id}`} className="block w-full">
                    <button
                        className={`w-full py-2.5 font-medium transition-colors border ${themeConfig.radius.md}`}
                        style={{
                            color: themeConfig.colors.primary,
                            borderColor: themeConfig.colors.primary,
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = themeConfig.colors.primary;
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = themeConfig.colors.primary;
                        }}
                    >
                        Enquire Now
                    </button>
                </Link>
            </div>
        </div>
    );
}
