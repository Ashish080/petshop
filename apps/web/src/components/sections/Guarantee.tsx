import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function Guarantee() {
    return (
        <section className="bg-warning-muted border-y border-warning/20 py-16 lg:py-20">
            <div className="container-app flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-warning rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <ShieldCheck size={48} className="text-white" strokeWidth={1.5} />
                </div>
                
                <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-h2 text-text-primary mb-4">
                        Our 100% Health & Authenticity Guarantee
                    </h2>
                    <p className="text-body-lg mb-8 max-w-3xl">
                        Every pet from Kanha comes with a written health guarantee. If your pet shows any health issues within 7 days, we cover the vet expenses — no questions asked.
                    </p>
                    
                    <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                        {[
                            "7-Day Health Guarantee",
                            "Pure Breed Certified",
                            "Vaccination Records",
                            "Lifetime Breeder Support"
                        ].map((point, i) => (
                            <Badge key={i} variant="warning" size="lg" dot>
                                {point}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
