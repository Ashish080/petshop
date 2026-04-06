import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { blogData } from '@/data/blog';
import { Button } from '@/components/ui/Button';

export default function BlogPreview() {
    return (
        <section className="section-padding bg-bg-primary transition-colors duration-[--duration-normal]">
            <div className="container-app">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-h1 mb-3">
                            Pet Care Tips & News
                        </h2>
                        <p className="text-body-lg max-w-2xl">
                            Read our latest articles for expert advice on keeping your pets healthy and happy.
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="hidden md:flex items-center gap-2 text-label-lg text-brand hover:text-brand-hover transition-colors"
                    >
                        View All Posts <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {blogData.map((post) => (
                        <Link key={post.id} href={`/blog/${post.id}`} className="group block">
                            <div className="bg-bg-tertiary h-full flex flex-col md:flex-row overflow-hidden border border-border transition-all duration-[--duration-slow] ease-[--ease-out-expo] hover:-translate-y-1 hover:shadow-sm hover:border-border-hover rounded-[--radius-lg]">
                                <div className="relative h-56 md:h-auto md:w-2/5 overflow-hidden shrink-0">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                                <div className="p-6 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3 text-body-sm text-accent">
                                        <Calendar size={14} />
                                        <span>{post.date}</span>
                                    </div>
                                    <h3 className="text-h4 mb-3 group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                                        {post.title}
                                    </h3>
                                    <p className="text-body-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <span className="text-label-lg text-brand flex items-center gap-1 mt-auto">
                                        Read More <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-10 md:hidden flex justify-center">
                    <Link href="/blog">
                        <Button variant="outline" icon={<ArrowRight size={16} />}>
                            View All Posts
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
