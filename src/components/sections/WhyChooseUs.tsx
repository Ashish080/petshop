import { siteContentConfig } from '@/config/site-content';

export function WhyChooseUs() {
    const { title, items } = siteContentConfig.homepage.whyChooseUs;

    return (
        <section className="py-16 md:py-24 bg-primary text-text-inverse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-16">{title}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {items.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-text-inverse/10 flex items-center justify-center mb-6 shadow-soft">
                                {/* Dynamically render an icon based on string name - using emoji or simple SVG placeholder for now */}
                                {item.icon === 'star' && <span className="text-3xl text-accent">★</span>}
                                {item.icon === 'heart' && <span className="text-3xl text-accent">♥</span>}
                                {item.icon === 'truck' && <span className="text-3xl text-accent">🚚</span>}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                            <p className="text-text-inverse/80 max-w-xs">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
