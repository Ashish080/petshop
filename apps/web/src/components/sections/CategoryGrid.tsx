import Link from "next/link";
import { motion } from "framer-motion";
import { Bird, Bone, Cat, Dog, Fish, Rabbit, ChevronRight } from "lucide-react";

const categories = [
  { name: "Dogs", href: "/pets?species=dog", icon: Dog },
  { name: "Cats", href: "/pets?species=cat", icon: Cat },
  { name: "Birds", href: "/pets?species=bird", icon: Bird },
  { name: "Fish", href: "/pets?species=fish", icon: Fish },
  { name: "Small Pets", href: "/pets?species=hamster", icon: Bone },
  { name: "Rabbits", href: "/pets?species=rabbit", icon: Rabbit },
];

export default function CategoryGrid() {
  return (
    <section className="py-24 bg-[#050505]">
      <div className="container-app">
        <div className="flex items-center gap-4 mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">Taxonomy</span>
            <div className="h-[1px] flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-px bg-white/5 border border-white/5 rounded-[32px] overflow-hidden">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} href={category.href} className="group relative bg-[#050505] p-12 transition-all hover:bg-white/[0.02]">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 text-white/20 group-hover:text-brand transition-colors transform group-hover:scale-110 duration-500">
                        <Icon size={40} strokeWidth={1} />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">
                      {category.name}
                    </h3>
                    <ChevronRight size={14} className="mt-4 text-white/10 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
