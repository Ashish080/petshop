"use client";

import { themeConfig } from '@/config/theme';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PetSearchFilter() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [species, setSpecies] = useState('All');
    const [breed, setBreed] = useState('All');
    const [budget, setBudget] = useState('Any');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (species !== 'All') params.set('species', species);
        if (breed !== 'All') params.set('breed', breed);
        if (budget !== 'Any') params.set('budget', budget);
        
        router.push(`/pets?${params.toString()}`);
    };

    return (
        <div className="bg-white dark:bg-card-bg border-y border-card-border py-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/[0.02] to-secondary/[0.02] pointer-events-none"></div>
            
            <div className={themeConfig.spacing.container + " relative z-10"}>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                        <SlidersHorizontal size={22} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-text-primary tracking-tight">Find Your Perfect Companion</h2>
                        <p className="text-sm font-bold text-text-light uppercase tracking-widest mt-0.5">Customized Pet Matchmaking</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] ml-1">Species</label>
                        <select 
                            value={species}
                            onChange={(e) => setSpecies(e.target.value)}
                            className="w-full px-4 py-3.5 bg-bg-page border border-card-border rounded-xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 appearance-none shadow-sm cursor-pointer"
                        >
                            <option>All</option>
                            <option>Dog</option>
                            <option>Cat</option>
                            <option>Bird</option>
                        </select>
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] ml-1">Breed</label>
                        <select 
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                            className="w-full px-4 py-3.5 bg-bg-page border border-card-border rounded-xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 appearance-none shadow-sm cursor-pointer"
                        >
                            <option>All</option>
                            <option>Golden Retriever</option>
                            <option>Labrador</option>
                            <option>British Shorthair Cat</option>
                            <option>Persian Cat</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] ml-1">Budget</label>
                        <select 
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="w-full px-4 py-3.5 bg-bg-page border border-card-border rounded-xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 appearance-none shadow-sm cursor-pointer"
                        >
                            <option>Any</option>
                            <option>Under ₹10,000</option>
                            <option>₹10k - ₹25k</option>
                            <option>₹25k - ₹50k</option>
                        </select>
                    </div>

                    <div className="space-y-1.5 lg:col-span-1">
                        <label className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] ml-1">Keyword</label>
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                            <input 
                                type="text" 
                                placeholder="Golden, Puppy..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-11 pr-4 py-3.5 bg-bg-page border border-card-border rounded-xl font-bold text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-end">
                        <button 
                            onClick={handleSearch}
                            className="w-full px-4 py-4 bg-brand-primary text-white font-black rounded-xl shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3"
                        >
                            Search Pets <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

