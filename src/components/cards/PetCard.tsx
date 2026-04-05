"use client";

import Image from 'next/image';
import { useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, MessageCircle } from 'lucide-react';
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
    const reduce = useReducedMotion();
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const rotateX = useTransform(my, [-0.5, 0.5], [6, -6]);
    const rotateY = useTransform(mx, [-0.5, 0.5], [-7, 7]);

    const springX = useSpring(rotateX, { stiffness: 260, damping: 24 });
    const springY = useSpring(rotateY, { stiffness: 260, damping: 24 });

    const handleWhatsApp = () => {
        window.open(`https://wa.me/${brandConfig.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I am interested in ${name} (${breed}). Is it available?`, '_blank');
    };

    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        mx.set(px);
        my.set(py);
    };

    const onLeave = () => {
        mx.set(0);
        my.set(0);
    };

    return (
        <motion.div
            className="group relative rounded-[var(--space-f21)] border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[0_18px_50px_-28px_rgba(15,18,24,0.2)] gpu"
            style={{
                rotateX: reduce ? 0 : springX,
                rotateY: reduce ? 0 : springY,
                transformPerspective: 900,
            }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            whileHover={{ y: -4, transition: { duration: 0.35 } }}
        >
            <div className="relative h-56 w-full overflow-hidden rounded-t-[var(--space-f21)] bg-[var(--bg-page)]">
                <Image
                    src={image}
                    alt={`Photo of ${breed}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 88vw, (max-width: 1200px) 50vw, 25vw"
                />

                <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                    <div className="flex items-center gap-1 rounded-md bg-green-100/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-green-800 shadow-sm backdrop-blur-sm dark:bg-green-900/80 dark:text-green-100">
                        <CheckCircle2 size={12} /> Verified
                    </div>
                    <div className="inline-flex w-fit items-center gap-1 rounded-md bg-amber-100/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-amber-900 shadow-sm backdrop-blur-sm dark:bg-amber-900/70 dark:text-amber-100">
                        <Award size={12} /> KCI Cert
                    </div>
                </div>
            </div>

            <div className="p-5">
                <h3 className="mb-1 text-xl font-semibold text-[var(--text-primary)]">
                    {name !== 'Milo' && name !== 'Bella' ? breed : name}
                </h3>
                <div className="mb-4 text-xs font-medium text-[var(--text-light)]">
                    {age} • {healthStatus}
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-[var(--bg-page)] p-2.5">
                        <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-light)]">Vaccination</div>
                        <div className="text-sm font-semibold text-[var(--text-primary)]">Up to date</div>
                    </div>
                    <div className="rounded-xl bg-[var(--bg-page)] p-2.5">
                        <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-light)]">Free vet</div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-[var(--text-primary)]">
                            Included <CheckCircle2 size={12} className="text-[var(--secondary)]" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-4">
                    <div>
                        <div className="text-lg font-semibold text-[var(--primary)]">
                            ₹{price ? price.toLocaleString('en-IN') : '28,000'}
                        </div>
                        <div className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-light)]">Negotiable</div>
                    </div>
                    <motion.button
                        type="button"
                        onClick={handleWhatsApp}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(255,122,0,0.55)]"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <MessageCircle size={16} /> Inquire
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
