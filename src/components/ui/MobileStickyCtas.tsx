"use client";

import { usePathname } from 'next/navigation';
import { MessageCircle, Phone } from 'lucide-react';
import { brandConfig } from '@/config/brand';

export default function MobileStickyCtas() {
    const pathname = usePathname();
    if (pathname === '/auth/login' || pathname === '/auth/register') return null;
    const handleWhatsApp = () => {
        window.open(`https://wa.me/${brandConfig.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I am interested in purchasing a pet.`, '_blank');
    };

    const handleCall = () => {
        window.open(`tel:${brandConfig.phone.replace(/[^0-9]/g, '')}`, '_self');
    };

    return (
        <div className="fixed sm:hidden bottom-0 left-0 right-0 bg-white dark:bg-card-bg border-t border-card-border p-3 flex gap-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <button 
                onClick={handleWhatsApp}
                className="flex-1 bg-green-500 text-white font-black text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-500/20"
            >
                <MessageCircle size={18} fill="currentColor" />
                WhatsApp
            </button>
            <button 
                onClick={handleCall}
                className="flex-1 bg-brand-primary text-white font-black text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
            >
                <Phone size={18} fill="currentColor" />
                Call Now
            </button>
        </div>
    );
}
