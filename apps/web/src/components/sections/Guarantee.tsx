import { themeConfig } from '@/config/theme';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Guarantee() {
    return (
        <section className="bg-amber-50 dark:bg-amber-900/10 border-y border-amber-200/50 py-16 lg:py-20">
            <div className={`${themeConfig.spacing.container} flex flex-col lg:flex-row items-center gap-10 lg:gap-16`}>
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-xl shadow-amber-400/20">
                    <ShieldCheck size={56} className="text-white" strokeWidth={1.5} />
                </div>
                
                <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4 font-serif">
                        Our 100% Health & Authenticity Guarantee
                    </h2>
                    <p className="text-lg text-text-light font-medium mb-8 max-w-3xl">
                        Every pet from Kanha comes with a written health guarantee. If your pet shows any health issues within 7 days, we cover the vet expenses — no questions asked. We stand behind every animal we sell.
                    </p>
                    
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6">
                        {[
                            "7-Day Health Guarantee",
                            "Pure Breed Certified",
                            "Vaccination Records",
                            "Lifetime Breeder Support"
                        ].map((point, i) => (
                            <div key={i} className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-500 text-sm bg-amber-100/50 dark:bg-amber-900/30 px-4 py-2 rounded-lg">
                                <CheckCircle2 size={18} /> {point}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
