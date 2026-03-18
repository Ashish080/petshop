import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { blogData } from '@/data/blog';
import { themeConfig } from '@/config/theme';

export default function BlogPreview() {
    return (
        <section className={`${themeConfig.spacing.section} bg-bg-page transition-colors duration-300`}>
            <div className={themeConfig.spacing.container}>
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight sm:text-5xl mb-3 text-text-primary">
                            Pet Care Tips & News
                        </h2>
                        <p className="max-w-2xl text-lg text-text-light font-medium">
                            Read our latest articles for expert advice on keeping your pets healthy and happy.
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="hidden md:flex items-center gap-2 font-black text-brand-primary hover:text-secondary transition-colors"
                    >
                        View All Posts <ArrowRight size={20} strokeWidth={3} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {blogData.map((post) => (
                        <Link key={post.id} href={`/blog/${post.id}`} className="group block">
                            <div
                                className={`bg-white dark:bg-card-bg h-full flex flex-col md:flex-row overflow-hidden border border-card-border transition-all duration-500 hover:-translate-y-2 hover:${themeConfig.shadows.hover} ${themeConfig.radius.lg}`}
                            >
                                <div className="relative h-56 md:h-auto md:w-2/5 overflow-hidden shrink-0">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                                <div className="p-6 md:p-8 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3 text-sm font-black text-secondary">
                                        <Calendar size={16} strokeWidth={2.5} />
                                        <span>{post.date}</span>
                                    </div>
                                    <h3 className="text-xl font-black mb-3 group-hover:text-brand-primary transition-colors line-clamp-2 text-text-primary leading-tight">
                                        {post.title}
                                    </h3>
                                    <p className="mb-4 line-clamp-3 text-sm flex-grow text-text-light font-medium leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <span
                                        className="font-black text-sm flex items-center gap-1 mt-auto text-brand-primary"
                                    >
                                        Read More <ArrowRight size={16} strokeWidth={2.5} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-10 md:hidden flex justify-center">
                    <Link href="/blog">
                        <button
                            className={`flex items-center gap-2 px-6 py-3 font-semibold border ${themeConfig.radius.md}`}
                            style={{ color: themeConfig.colors.primary, borderColor: themeConfig.colors.primary }}
                        >
                            View All Posts <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
