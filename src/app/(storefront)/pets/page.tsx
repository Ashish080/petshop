import { Search, SlidersHorizontal, Cat, Dog, Bird, Info } from 'lucide-react';
import PetCard from '@/components/cards/PetCard';
import { themeConfig } from '@/config/theme';

export const dynamic = 'force-dynamic';

async function getPets(searchParams: { [key: string]: string | undefined }) {
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.species && searchParams.species !== 'All') params.set('species', searchParams.species);
    
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/pets?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) return [];
        const result = await res.json();
        return result.data || [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

export default async function PetsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const resolvedParams = await searchParams;
    const pets = await getPets(resolvedParams);

    return (
        <div className="bg-bg-page min-h-screen pb-20">
            <div className="bg-white dark:bg-card-bg border-b border-card-border pt-12 pb-8">
                <div className={themeConfig.spacing.container}>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary font-black text-[10px] uppercase tracking-widest mb-4 border border-brand-primary/20">
                                Furry Friends
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-4">Find Your New Best Friend</h1>
                            <p className="text-lg font-medium text-text-light max-w-2xl leading-relaxed">
                                Browse our collection of healthy, certified, and playful pets waiting for their forever homes in Lucknow.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-3">
                                {[
                                    "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=100&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=100&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=100&auto=format&fit=crop"
                                ].map((url, i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-card-bg overflow-hidden shadow-lg">
                                        <img src={url} alt="pet" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs font-black text-text-primary uppercase tracking-widest bg-white pr-4 py-2 rounded-full shadow-sm border border-slate-100 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Currently Available
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[300px] relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-light group-focus-within:text-brand-primary transition-colors" size={20} />
                            <input 
                                type="text"
                                placeholder="Search by breed, color or name..."
                                className="w-full pl-14 pr-6 py-5 bg-bg-page border-2 border-transparent rounded-[24px] font-bold text-text-primary placeholder:text-text-light focus:outline-none focus:border-brand-primary/30 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="px-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] font-black text-[11px] uppercase tracking-widest text-text-primary hover:border-brand-primary transition-all flex items-center gap-2 shadow-sm">
                                <Dog size={18} /> Dogs
                            </button>
                            <button className="px-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] font-black text-[11px] uppercase tracking-widest text-text-primary hover:border-brand-primary transition-all flex items-center gap-2 shadow-sm">
                                <Cat size={18} /> Cats
                            </button>
                            <button className="px-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] font-black text-[11px] uppercase tracking-widest text-text-primary hover:border-brand-primary transition-all flex items-center gap-2 shadow-sm">
                                <SlidersHorizontal size={18} /> Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={themeConfig.spacing.container + " py-16"}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {pets.map((pet: any) => (
                        <PetCard key={pet._id || pet.id} {...pet} />
                    ))}
                </div>

                {pets.length === 0 && (
                    <div className="text-center py-40">
                         <div className="w-24 h-24 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-brand-primary/20">
                            <Info size={40} className="text-brand-primary opacity-50" />
                        </div>
                        <h2 className="text-3xl font-black text-text-primary mb-3">No matching companions found</h2>
                        <p className="text-lg font-medium text-text-light max-w-md mx-auto">
                            Try adjusting your filters or search keywords. Our inventory changes daily!
                        </p>
                    </div>
                )}

                <div className="mt-20 p-12 bg-indigo-900 rounded-[40px] text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="text-center md:text-left">
                            <h3 className="text-3xl font-black mb-3">Don't see what you're looking for?</h3>
                            <p className="text-indigo-200 font-bold max-w-xl">
                                We can source specific breeds or help you find your dream pet through our verified network of ethical breeders.
                            </p>
                        </div>
                        <button className="px-10 py-5 bg-white text-indigo-900 font-black rounded-2xl uppercase tracking-widest text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all">
                            Request Custom Breed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
