"use client";

import { themeConfig } from '@/config/theme';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function PetSearchFilter() {
    const [search, setSearch] = useState('');

    return (
        <div className="bg-white dark:bg-card-bg border-y border-card-border py-8">
            <div className={themeConfig.spacing.container}>
                <div className="flex items-center gap-3 mb-6">
                    <SlidersHorizontal size={20} className="text-brand-primary" />
                    <h2 className="text-lg font-black text-text-primary uppercase tracking-widest">Find Your Perfect Pet</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <select className="w-full px-4 py-3.5 bg-bg-page border border-card-border rounded-xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 appearance-none">
                        <option>All Pets</option>
                        <option>Dogs</option>
                        <option>Cats</option>
                        <option>Birds</option>
                    </select>
                    
                    <select className="w-full px-4 py-3.5 bg-bg-page border border-card-border rounded-xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 appearance-none">
                        <option>All Breeds</option>
                        <option>Golden Retriever</option>
                        <option>Labrador</option>
                        <option>Husky</option>
                        <option>Persian Cat</option>
                    </select>

                    <select className="w-full px-4 py-3.5 bg-bg-page border border-card-border rounded-xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 appearance-none">
                        <option>Any Budget</option>
                        <option>Under ₹10,000</option>
                        <option>₹10k - ₹25k</option>
                        <option>₹25k - ₹50k</option>
                        <option>₹50k+</option>
                    </select>

                    <select className="w-full px-4 py-3.5 bg-bg-page border border-card-border rounded-xl font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 appearance-none">
                        <option>Any Age</option>
                        <option>0–30 Days</option>
                        <option>30–60 Days</option>
                        <option>2–6 Months</option>
                    </select>

                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search breed, color..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-bg-page border border-card-border rounded-xl font-bold text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
