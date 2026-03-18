import Link from 'next/link';
import { Dog, Cat, Fish, Bird, ShoppingBag, Scissors } from 'lucide-react';
import { themeConfig } from '@/config/theme';

const categories = [
    { name: 'Dogs', icon: Dog, href: '/pets?species=dog', color: '#FF7B54' },    // Coral
    { name: 'Cats', icon: Cat, href: '/pets?species=cat', color: '#70A1FF' },    // Sky Blue
    { name: 'Birds', icon: Bird, href: '/pets?species=bird', color: '#4ECDC4' }, // Mint
    { name: 'Fish', icon: Fish, href: '/pets?species=fish', color: '#4834D4' }, // Royal Blue
    { name: 'Hamsters', icon: ShoppingBag, href: '/pets?species=hamster', color: '#FFD93D' }, // Honey
    { name: 'Rabbits', icon: Scissors, href: '/pets?species=rabbit', color: '#A55EEA' }, // Lavender
];

export default function CategoryGrid() {
    return (
        <section className={themeConfig.spacing.section}>
            <div className={themeConfig.spacing.container}>
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3 text-text-primary">Shop by Category</h2>
                    <p className="max-w-2xl mx-auto text-lg text-text-light">
                        Find exactly what you're looking for, from new companions to everyday essentials.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link key={category.name} href={category.href} className="group block">
                                <div
                                    className={`bg-bg-page dark:bg-card-bg p-6 flex flex-col items-center justify-center text-center transition-all duration-500 hover:-translate-y-2 border border-card-border ${themeConfig.radius.lg} ${themeConfig.shadows.soft} hover:${themeConfig.shadows.hover}`}
                                >
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: `${category.color}10`, color: category.color }}
                                    >
                                        <Icon size={32} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="font-bold text-text-primary transition-colors group-hover:text-brand-primary">{category.name}</h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
