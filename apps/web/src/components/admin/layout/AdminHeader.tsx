'use client';

import { Bell, Search, Command, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminHeaderProps {
  user: {
    name: string;
    initials: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-20 border-b border-white/5 bg-[#0F0F10]/80 backdrop-blur-xl px-8 flex items-center justify-between shrink-0 z-40 sticky top-0">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative group max-w-md w-full hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand transition-colors" size={18} />
          <input 
            placeholder="Search missions, inventory, logs..." 
            className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/40 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 pointer-events-none">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all group">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand rounded-full border-2 border-[#0F0F10] animate-pulse" />
        </button>

        <div className="h-10 w-[1px] bg-white/10 mx-2" />

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-warning flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-brand/20">
            {user.initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-white uppercase tracking-tight leading-none mb-1">{user.name}</p>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Senior Admin</p>
          </div>
          <ChevronDown size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
        </motion.button>
      </div>
    </header>
  );
}
