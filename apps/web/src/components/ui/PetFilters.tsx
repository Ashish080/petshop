"use client";

import { ChevronDown } from 'lucide-react';

export default function PetFilters() {
    const filters = [
        { label: 'Pet Type', options: ['All', 'Dogs', 'Cats', 'Birds'] },
        { label: 'Breed', options: ['All', 'Golden Retriever', 'Persian', 'Husky'] },
        { label: 'Age', options: ['All', 'Puppy', 'Young', 'Adult'] },
        { label: 'Gender', options: ['All', 'Male', 'Female'] },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-3 mb-10 bg-bg-tertiary/50 p-3 backdrop-blur-sm border border-border rounded-[--radius-lg]">
            {filters.map((filter) => (
                <div key={filter.label} className="relative w-full sm:flex-1 lg:min-w-[180px]">
                    <select
                        className="w-full appearance-none bg-bg-elevated border border-border px-4 py-3 pr-10 text-body-sm text-text-primary rounded-[--radius-md] focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-brand transition-all duration-[--duration-fast]"
                    >
                        <option value="">{filter.label}</option>
                        {filter.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" size={16} />
                </div>
            ))}

            <div className="relative min-w-[150px]">
                <select
                    className="w-full appearance-none bg-bg-elevated border border-border px-4 py-3 pr-10 text-body-sm text-text-primary rounded-[--radius-md] focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-brand transition-all duration-[--duration-fast]"
                >
                    <option value="">Sort By</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" size={16} />
            </div>
        </div>
    );
}
