"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const products = [
  { name: "Puppy Star Kit", price: 1299, image: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop" },
  { name: "Premium Nutrition", price: 4500, image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=800&auto=format&fit=crop" },
  { name: "Orthopedic Bed", price: 8900, image: "https://images.unsplash.com/photo-1742565954706-14f3b03c4938?q=80&w=800&auto=format&fit=crop" },
  { name: "Smart Pet Tech", price: 12000, image: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?q=80&w=800&auto=format&fit=crop" },
];

export default function BestSellingProducts() {
  return (
    <section className="py-32 bg-[#050505]">
      <div className="container-app">
        
        <div className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand/10 border border-brand/20">
                    <Sparkles size={14} className="text-brand" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Essentials & Tools</h3>
            </div>
            <Link href="/products" className="text-[10px] font-black uppercase tracking-[0.3em] text-brand hover:text-white transition-colors">View All Essentials</Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {products.map((product, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group"
                >
                    <div className="relative aspect-square rounded-[32px] overflow-hidden bg-white/[0.02] border border-white/5 transition-all duration-700 group-hover:border-brand/30">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button className="h-12 px-6 bg-white text-black font-black uppercase italic tracking-[0.2em] text-[10px] rounded-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-brand hover:text-white">
                                Acquire <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between items-start px-2">
                        <div>
                            <h4 className="text-lg font-bold text-white italic uppercase tracking-tighter leading-none mb-1 group-hover:text-brand transition-colors">{product.name}</h4>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Inventory Stocked</p>
                        </div>
                        <p className="text-sm font-black text-brand italic tracking-tight">₹{product.price.toLocaleString()}</p>
                    </div>
                </motion.div>
            ))}
        </div>

      </div>
    </section>
  );
}
