import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { blogData } from "@/data/blog";
import { Button } from "@/components/ui/Button";

export default function BlogPreview() {
  return (
    <section className="section-padding">
      <div className="container-app">
        <div className="mb-10 flex items-end justify-between gap-6 md:mb-12">
          <div className="max-w-2xl">
            <p className="text-kicker">Knowledge hub</p>
            <h2 className="mt-2 text-h1 text-text-primary">Pet care guides and updates</h2>
            <p className="mt-3 text-body-lg text-text-secondary">
              Quick reads for nutrition, grooming, and everyday care decisions.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-2 rounded-full border border-border bg-bg-elevated px-4 py-2.5 text-label-lg font-semibold text-text-primary transition-all hover:border-brand/30 hover:text-brand md:inline-flex"
          >
            View all posts
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {blogData.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group block">
              <article className="overflow-hidden rounded-[--radius-xl] border border-border bg-bg-elevated/90 shadow-xs transition-all duration-[--duration-normal] hover:-translate-y-1 hover:border-brand/30 hover:shadow-soft">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-bg-tertiary/85 px-3 py-1 text-body-xs text-text-secondary">
                    <Calendar size={12} />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-h4 leading-snug text-text-primary transition-colors group-hover:text-brand">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-body-sm leading-relaxed text-text-secondary">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-label-lg font-semibold text-text-primary transition-colors group-hover:text-brand">
                    Read article
                    <ArrowRight size={14} />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link href="/blog">
            <Button variant="outline" iconRight={<ArrowRight size={16} />}>
              View all posts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
