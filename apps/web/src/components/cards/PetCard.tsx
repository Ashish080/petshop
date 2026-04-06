"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Star, Sparkles } from 'lucide-react';
import { brandConfig } from '@/config/brand';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { interactions, easing, duration } from '@/lib/motion';

interface PetCardProps {
    id: string;
    name: string;
    breed: string;
    age: string;
    image: string;
    healthStatus: string;
    price?: number;
}

export default function PetCard({ id, name, breed, age, image, healthStatus, price }: PetCardProps) {
    const waLink = `https://wa.me/${brandConfig.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I am interested in ${name} (${breed}). Is it available?`;

    return (
        <motion.div 
            whileHover={{ y: -6, transition: { duration: duration.normal, ease: easing.outExpo } }}
            className="bg-bg-tertiary border border-border rounded-[--radius-xl] overflow-hidden hover:shadow-sm hover:border-border-hover transition-all duration-[--duration-slow] group relative"
        >
            {/* Image */}
            <div className="relative h-72 w-full overflow-hidden bg-bg-secondary">
                <Image
                    src={image}
                    alt={`Photo of ${breed}`}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                    <Badge variant="brand" size="lg" className="glass">
                        <Sparkles size={12} /> Premium
                    </Badge>
                </div>

                {/* Wishlist */}
                <button className="absolute top-4 right-4 p-2.5 glass rounded-full text-text-disabled hover:text-danger hover:scale-110 transition-all">
                    <Heart size={18} />
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-h3 text-text-primary tracking-tight leading-none mb-1">{name}</h3>
                        <p className="text-overline text-brand">{breed}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-bg-secondary px-2.5 py-1 rounded-[--radius-md] border border-border">
                        <Star size={14} className="text-warning fill-warning" />
                        <span className="text-label text-text-primary">4.9</span>
                    </div>
                </div>

                {/* Health Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {['Health OK', 'KCI Cert', 'Vaccinated'].map((tag) => (
                        <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                    ))}
                </div>

                {/* Price + Actions */}
                <div className="flex items-center justify-between pt-5 border-t border-border">
                    <div>
                        <div className="text-h3 text-stat text-text-primary tracking-tight">₹{price?.toLocaleString('en-IN') || '25,000'}</div>
                        <div className="text-overline mt-0.5">Live In Lucknow</div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Link href="/contact" className="p-3 bg-bg-secondary rounded-[--radius-lg] text-text-secondary hover:bg-bg-inset transition-all">
                             <MessageCircle size={20} />
                        </Link>
                        <Link 
                            href={waLink}
                            target="_blank"
                            className="bg-text-primary text-text-inverse p-3 rounded-[--radius-lg] hover:bg-brand transition-all shadow-xs hover:scale-105 active:scale-95 group/btn"
                        >
                            <span className="sr-only">Inquire via WhatsApp</span>
                            <Sparkles size={20} className="group-hover/btn:rotate-12 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
