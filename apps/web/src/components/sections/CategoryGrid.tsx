import Link from 'next/link';
import { Dog, Cat, Fish, Bird, ShoppingBag, Scissors } from 'lucide-react';

const categories = [
    { name: 'Dogs', icon: Dog, href: '/pets?species=dog', color: 'text-brand', bg: 'bg-brand-muted' },
    { name: 'Cats', icon: Cat, href: '/pets?species=cat', color: 'text-info', bg: 'bg-info-muted' },
    { name: 'Birds', icon: Bird, href: '/pets?species=bird', color: 'text-success', bg: 'bg-success-muted' },
    { name: 'Fish', icon: Fish, href: '/pets?species=fish', color: 'text-accent', bg: 'bg-accent-muted' },
    { name: 'Hamsters', icon: ShoppingBag, href: '/pets?species=hamster', color: 'text-warning', bg: 'bg-warning-muted' },
    { name: 'Rabbits', icon: Scissors, href: '/pets?species=rabbit', color: 'text-accent', bg: 'bg-accent-muted' },
];

export default function CategoryGrid() {
    return (
        <section className="section-padding">
            <div className="container-app">
                <div className="text-center mb-10">
                    <h2 className="text-h1 mb-3">Shop by Category</h2>
                    <p className="text-body-lg max-w-2xl mx-auto">
                        Find exactly what you're looking for, from new companions to everyday essentials.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link key={category.name} href={category.href} className="group block">
                                <div className="bg-bg-tertiary p-6 flex flex-col items-center justify-center text-center transition-all duration-[--duration-slow] ease-[--ease-out-expo] hover:-translate-y-1.5 border border-border hover:border-border-hover rounded-[--radius-lg] shadow-xs hover:shadow-sm">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${category.bg} ${category.color}`}>
                                        <Icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-label-lg text-text-primary group-hover:text-brand transition-colors">{category.name}</h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
