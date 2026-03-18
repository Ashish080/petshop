import Link from 'next/link';

const categories = [
    { id: 'dogs', name: 'Shop for Dogs', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400', link: '/pets?species=dog' },
    { id: 'cats', name: 'Shop for Cats', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400', link: '/pets?species=cat' },
    { id: 'birds', name: 'Shop for Birds', image: 'https://images.unsplash.com/photo-1552728089-571ebd6a45cb?auto=format&fit=crop&q=80&w=400', link: '/pets?species=bird' },
    { id: 'small', name: 'Small Pets', image: 'https://images.unsplash.com/photo-1425082661705-1834bfd08dca?auto=format&fit=crop&q=80&w=400', link: '/pets?species=small' }
];

export function CategoryGrid() {
    return (
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">Shop by Pet</h2>
                <p className="text-text-muted max-w-2xl mx-auto">Find everything your specific furry, feathery, or scaly friend needs.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <Link key={category.id} href={category.link} className="group relative rounded-2xl overflow-hidden aspect-square shadow-soft hover:shadow-medium transition-all block">
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={category.image}
                            alt={category.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <h3 className="text-xl md:text-2xl font-bold text-text-inverse text-center">{category.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
