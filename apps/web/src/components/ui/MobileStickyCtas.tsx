'use client';

import { MessageCircle, Phone, ArrowUpRight } from 'lucide-react';
import { brandConfig } from '@/config/brand';
import { motion } from 'framer-motion';

export default function MobileStickyCtas() {
  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${brandConfig.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I am interested in purchasing a pet.`,
      '_blank'
    );
  };

  const handleCall = () => {
    window.open(`tel:${brandConfig.phone.replace(/[^0-9]/g, '')}`, '_self');
  };

  return (
    <div className="fixed md:hidden bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[100]">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="glass rounded-[24px] p-2 flex items-center gap-2 shadow-premium border border-white/40"
      >
        <button
          onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-2.5 h-14 rounded-[18px] bg-text-primary text-white text-sm font-bold uppercase italic tracking-wider transition-all active:scale-95"
        >
          <Phone size={18} fill="currentColor" className="text-brand" />
          Call Support
        </button>

        <button
          onClick={handleWhatsApp}
          className="w-14 h-14 flex items-center justify-center rounded-[18px] bg-[#25D366] text-white shadow-lg shadow-[#25D366]/20 transition-all active:scale-90"
        >
          <MessageCircle size={24} fill="currentColor" />
        </button>
        
        <div className="absolute -top-3 -right-2 bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg rotate-12 animate-bounce">
          LIVE
        </div>
      </motion.div>
    </div>
  );
}
