import Link from 'next/link';
import { Gift, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OffersBanner() {
    return (
        <section className="section-padding bg-bg-primary">
            <div className="container-app">
                <div className="relative overflow-hidden p-10 md:p-16 lg:p-20 flex flex-col md:flex-row items-center justify-between rounded-[--radius-xl] bg-text-primary shadow-lg group">
                    {/* Gradient Orbs */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand opacity-20 blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-accent opacity-10 blur-[120px]" />

                    <div className="relative z-10 md:max-w-2xl text-center md:text-left mb-10 md:mb-0">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[--radius-full] bg-brand/10 border border-brand/20 text-brand text-label-sm uppercase tracking-wider mb-8">
                           <Gift size={16} /> Limited Time Member Offer
                        </div>
                        <h2 className="text-h1 md:text-display text-text-inverse mb-6 tracking-tighter leading-[0.9]">
                            UNLOCK <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-orange-300">20% VEDIC</span> <br />
                            GROOMING.
                        </h2>
                        <p className="text-body-lg text-white/40 max-w-md leading-relaxed">
                            Treat your companion to Lucknow's most premium spa experience. Valid for first-time bookings.
                        </p>
                    </div>

                    <div className="relative z-10 w-full md:w-auto">
                        <Link href="/services#grooming">
                            <Button size="lg" variant="primary" iconRight={<ChevronRight size={22} />} className="!px-10 !py-6 !text-lg">
                                Claim Offer Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
