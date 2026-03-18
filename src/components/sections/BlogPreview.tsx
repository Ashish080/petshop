import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { blogData } from '@/data/blog';
import { themeConfig } from '@/config/theme';

export default function BlogPreview() {
    return (
        <section className={`${themeConfig.spacing.section} bg-white`}>
            <div className={themeConfig.spacing.container}>
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3" style={{ color: themeConfig.colors.text }}>
                            Pet Care Tips & News
                        </h2>
                        <p className="max-w-2xl text-lg" style={{ color: themeConfig.colors.textLight }}>
                            Read our latest articles for expert advice on keeping your pets healthy and happy.
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="hidden md:flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity"
                        style={{ color: themeConfig.colors.primary }}
                    >
                        View All Posts <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {blogData.map((post) => (
                        <Link key={post.id} href={`/blog/${post.id}`} className="group block">
                            <div
                                className={`bg-white h-full flex flex-col md:flex-row overflow-hidden border border-gray-100 transition-all hover:${themeConfig.shadows.hover} ${themeConfig.radius.lg}`}
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
                                    <div className="flex items-center gap-2 mb-3 text-sm font-medium" style={{ color: themeConfig.colors.secondary }}>
                                        <Calendar size={16} />
                                        <span>{post.date}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 group-hover:opacity-80 transition-opacity line-clamp-2" style={{ color: themeConfig.colors.text }}>
                                        {post.title}
                                    </h3>
                                    <p className="mb-4 line-clamp-3 text-sm flex-grow" style={{ color: themeConfig.colors.textLight }}>
                                        {post.excerpt}
                                    </p>
                                    <span
                                        className="font-semibold text-sm flex items-center gap-1 mt-auto"
                                        style={{ color: themeConfig.colors.primary }}
                                    >
                                        Read More <ArrowRight size={16} />
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
