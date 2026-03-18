import Link from 'next/link';
import { blogData } from '@/data/blog';

export function BlogPreview() {
    const latestPosts = blogData.slice(0, 3);

    return (
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <span className="text-secondary font-bold tracking-wider uppercase text-sm">Pet Care & Tips</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-text-main mt-2">Latest From Our Blog</h2>
                </div>
                <Link href="/blog" className="inline-flex items-center text-primary font-semibold hover:text-accent transition-colors">
                    Read All Posts
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`} className="group bg-background rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 block">
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-text-main text-xs font-bold px-3 py-1.5 rounded-full">
                                {post.category}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-sm font-medium text-text-muted mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {post.date}
                            </div>
                            <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors mb-3 leading-snug">
                                {post.title}
                            </h3>
                            <p className="text-text-muted line-clamp-2">
                                {post.excerpt}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
