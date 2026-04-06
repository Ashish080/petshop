import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, Scissors, Stethoscope } from "lucide-react";
import { servicesData } from "@/data/services";
import { siteContent } from "@/config/site-content";

const iconMap = {
  scissors: Scissors,
  stethoscope: Stethoscope,
  home: Home,
};

export default function Services() {
  const { services: content } = siteContent;

  return (
    <section className="section-padding relative">
      <div className="container-app">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <div className="max-w-2xl">
            <p className="text-kicker">Service ecosystem</p>
            <h2 className="mt-2 text-h1 text-text-primary">{content.title}</h2>
            <p className="mt-3 text-body-lg text-text-secondary">{content.subtitle}</p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-4 py-2.5 text-label-lg font-semibold text-text-primary transition-all hover:border-brand/30 hover:text-brand"
          >
            View all services
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {servicesData.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <article
                key={service.id}
                className="group overflow-hidden rounded-[--radius-xl] border border-border bg-bg-elevated/90 shadow-xs transition-all duration-[--duration-normal] hover:-translate-y-1 hover:border-brand/30 hover:shadow-soft"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-[14px] border border-white/20 bg-black/35 text-white backdrop-blur">
                    {Icon ? <Icon size={18} /> : null}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-h4 text-text-primary">{service.title}</h3>
                  <p className="mt-2 text-body-sm leading-relaxed text-text-secondary">
                    {service.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-label-lg font-semibold text-brand">
                      From ₹{service.priceStartingAt}
                    </span>
                    <Link
                      href={`/services#${service.title.toLowerCase().replace(" ", "-")}`}
                      className="inline-flex items-center gap-1 text-label-lg font-semibold text-text-primary transition-colors group-hover:text-brand"
                    >
                      Book
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
