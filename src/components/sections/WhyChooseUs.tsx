import { themeConfig } from '@/config/theme';
import { Award, Stethoscope, Utensils, Syringe } from 'lucide-react';

export default function WhyChooseUs() {
    return (
        <section className={`${themeConfig.spacing.section} bg-brand-primary text-white overflow-hidden relative`}>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>

            <div className={`${themeConfig.spacing.container} relative z-10`}>
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white">
                        Why 500+ Families Choose Kanha
                    </h2>
                    <p className="text-lg text-white/80 font-medium">
                        We don't just sell pets — we build lifelong bonds. Every companion is ethically raised and strictly vetted.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {[
                        { 
                            icon: Award, 
                            title: "Breed Certificate", 
                            desc: "Every pet comes with KCI / IKC certified breed papers proving authenticity and lineage."
                        },
                        { 
                            icon: Stethoscope, 
                            title: "Free Vet Consultation", 
                            desc: "First vet visit is on us. Your pet gets a complete health check on arrival."
                        },
                        { 
                            icon: Utensils, 
                            title: "Free Diet Plan", 
                            desc: "Customized 30-day nutrition plan prepared by our in-house vet nutritionist."
                        },
                        { 
                            icon: Syringe, 
                            title: "Fully Vaccinated", 
                            desc: "All pets are vaccinated, dewormed, and health-checked before going home."
                        }
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white/10 border border-white/20 backdrop-blur-sm p-8 rounded-3xl hover:bg-white/15 transition-all hover:-translate-y-2 group">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                <feature.icon size={32} strokeWidth={2} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black mb-3 text-white">{feature.title}</h3>
                            <p className="text-white/70 font-medium leading-relaxed text-sm">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
