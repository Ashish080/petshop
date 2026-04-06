"use client";

import { useState } from "react";
import { Search, Command, Filter, Sparkles, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RECENT_SEARCHES = ["Golden Retriever", "Persian Kitten", "Labrador", "Premium Food"];

export default function PetSearchFilter() {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container-app max-w-4xl">
        
        {/* Command Bar Header */}
        <div className="flex items-center justify-between mb-8 px-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand/10 border border-brand/20">
                    <Command size={14} className="text-brand" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Global Search Protocol</h3>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-widest">
                <span>Press ⌘ K to activate</span>
            </div>
        </div>

        {/* The Bar */}
        <div className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-brand/20 via-transparent to-brand/20 rounded-[32px] blur-xl transition-opacity duration-700 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />
            
            <div className={`relative flex items-center h-20 bg-white/[0.02] backdrop-blur-3xl border rounded-[28px] px-8 transition-all duration-500 ${isFocused ? 'border-brand/40 bg-white/[0.04]' : 'border-white/5'}`}>
                <Search className={`mr-6 transition-colors duration-500 ${isFocused ? 'text-brand' : 'text-white/20'}`} size={24} />
                
                <input 
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search by breed, age, or category..."
                    className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-white placeholder:text-white/10 uppercase tracking-tight italic"
                />

                <div className="flex items-center gap-4">
                    {search && (
                        <button onClick={() => setSearch("")} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
                            <X size={18} />
                        </button>
                    )}
                    <div className="h-8 w-[1px] bg-white/5" />
                    <button className="flex items-center gap-3 px-6 h-12 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-xl transition-all group/btn">
                        <Filter size={16} className="text-white/60 group-hover/btn:text-brand transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Refine</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Quick Access Chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Suggested</span>
            {RECENT_SEARCHES.map((term, i) => (
                <button 
                    key={term}
                    className="flex items-center gap-3 group transition-all"
                >
                    <span className="text-xs font-bold text-white/40 group-hover:text-brand group-hover:translate-x-1 transition-all italic tracking-tight">{term}</span>
                    <ChevronRight size={12} className="text-white/10 group-hover:text-brand transition-colors" />
                </button>
            ))}
        </div>

      </div>
    </section>
  );
}
