"use client";

import { Search, SlidersHorizontal, History, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export default function PetSearchFilter() {
    const [search, setSearch] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const debouncedSearch = useDebounce(search, 800);

    const logSearch = useCallback(async (term: string) => {
        if (!term || term.length < 3) return;
        try {
            await fetch('/api/activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'search', productName: term })
            });
            fetchHistory();
        } catch (err) {}
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/activity/history?type=search');
            const data = await res.json();
            if (data.success) setHistory(data.data.slice(0, 3));
        } catch (err) {}
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
       if (debouncedSearch) {
          logSearch(debouncedSearch);
       }
    }, [debouncedSearch, logSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const selectClass = "w-full appearance-none bg-bg-elevated border border-border px-4 py-3 pr-10 rounded-[--radius-md] text-body-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-brand transition-all duration-[--duration-fast]";

    return (
        <div className="bg-bg-tertiary border-y border-border py-8">
            <div className="container-app">
                <div className="flex items-center gap-3 mb-6">
                    <SlidersHorizontal size={18} className="text-brand" />
                    <h2 className="text-label-lg text-text-primary uppercase tracking-wider">Find Your Perfect Pet</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    <select className={selectClass}>
                        <option>All Pets</option>
                        <option>Dogs</option>
                        <option>Cats</option>
                        <option>Birds</option>
                    </select>
                    
                    <select className={selectClass}>
                        <option>All Breeds</option>
                        <option>Golden Retriever</option>
                        <option>Labrador</option>
                        <option>Husky</option>
                        <option>Persian Cat</option>
                    </select>

                    <select className={selectClass}>
                        <option>Any Budget</option>
                        <option>Under ₹10,000</option>
                        <option>₹10k - ₹25k</option>
                        <option>₹25k - ₹50k</option>
                        <option>₹50k+</option>
                    </select>

                    <select className={selectClass}>
                        <option>Any Age</option>
                        <option>0–30 Days</option>
                        <option>30–60 Days</option>
                        <option>2–6 Months</option>
                    </select>

                    <div className="relative w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search breed, color..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border rounded-[--radius-md] text-body-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-brand transition-all duration-[--duration-fast]"
                        />
                        {history.length > 0 && !search && (
                            <div className="absolute top-14 left-0 w-full flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                {history.map((h, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setSearch(h)}
                                        className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary px-2 py-1 bg-bg-tertiary border border-border rounded-full hover:border-brand hover:text-brand transition-all"
                                    >
                                        <History size={10} className="inline mr-1" />
                                        {h}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
