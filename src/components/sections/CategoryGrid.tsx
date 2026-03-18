import Link from 'next/link';
import { Dog, Cat, Fish, Bird, ShoppingBag, Scissors } from 'lucide-react';
import { themeConfig } from '@/config/theme';

const categories = [
    { name: 'Dogs', icon: Dog, href: '/pets?species=dog', color: '#3b82f6' },
    { name: 'Cats', icon: Cat, href: '/pets?species=cat', color: '#ec4899' },
    { name: 'Small Pets', icon: Fish, href: '/pets?species=small', color: '#10b981' },
    { name: 'Birds', icon: Bird, href: '/pets?species=bird', color: '#f59e0b' },
    { name: 'Accessories', icon: ShoppingBag, href: '/products?category=accessories', color: '#8b5cf6' },
    { name: 'Grooming', icon: Scissors, href: '/services#grooming', color: '#f43f5e' },
];

export default function CategoryGrid() {
    return (
        <section className={themeConfig.spacing.section}>
            <div className={themeConfig.spacing.container}>
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3" style={{ color: themeConfig.colors.text }}>Shop by Category</h2>
                    <p className="max-w-2xl mx-auto text-lg" style={{ color: themeConfig.colors.textLight }}>
                        Find exactly what you're looking for, from new companions to everyday essentials.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link key={category.name} href={category.href} className="group block">
                                <div
                                    className={`bg-white p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 ${themeConfig.radius.lg} ${themeConfig.shadows.soft} hover:${themeConfig.shadows.medium}`}
                                >
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: `${category.color}15`, color: category.color }}
                                    >
                                        <Icon size={28} />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">{category.name}</h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
