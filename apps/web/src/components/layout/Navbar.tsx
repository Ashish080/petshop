"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShoppingCart, 
  Sparkles, 
  User, 
  Home, 
  Dog, 
  Package, 
  Phone,
  LayoutDashboard,
  MessageCircle,
  Command
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore, useCartUIStore } from "@/store/cartStore";
import SearchModal from "@/components/layout/SearchModal";
import NightWalkToggle from "@/components/ui/NightWalkToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();
  const cartCount = useCartStore((state) => state.itemCount);
  const { openCart } = useCartUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { title: "Home", href: "/", icon: Home },
    { title: "Gallery", href: "/pets", icon: Dog },
    { title: "Boutique", href: "/products", icon: Package },
  ];

  const dashboardHref =
    session?.user?.role === "admin"
      ? "/admin"
      : session?.user?.role === "rider"
        ? "/rider"
        : "/dashboard";

  return (
    <>
      {/* 1. TOP BRANDING BAR (Minimal) */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8'}`}>
        <div className="container-app flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-4">
            <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Sparkles size={20} fill="currentColor" />
            </div>
            <div className="hidden sm:block">
                <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand leading-none mb-1">Elite Connection</h1>
                <p className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Kanha Pet shop</p>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <NightWalkToggle />
            {status === "authenticated" ? (
                <Link href={dashboardHref} className="flex items-center gap-3 px-6 h-12 glass rounded-2xl border border-white/20 hover:border-brand/40 transition-all group">
                    <User size={16} className="text-brand group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Commander</span>
                </Link>
            ) : (
                <Link href="/auth/login" className="flex items-center gap-3 px-6 h-12 glass rounded-2xl border border-white/20 hover:border-brand/40 transition-all group">
                    <User size={16} className="text-white/40 group-hover:text-brand transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Enlist</span>
                </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 2. FLOATING ACTION DOCK (Bottom Center) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl px-4">
        <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.5 }}
            className="glass-card rounded-[32px] p-2 border border-white/40 shadow-2xl flex items-center justify-between gap-1 overflow-hidden"
        >
            {/* Dock Search */}
            <button 
                onClick={() => setIsSearchOpen(true)}
                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.03] text-white/40 hover:text-brand hover:bg-brand/10 transition-all group"
            >
                <Search size={22} className="group-hover:scale-110 transition-transform" />
            </button>

            <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block" />

            {/* Core Nav Links */}
            <div className="flex-1 flex items-center justify-center gap-2 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={cn(
                                "relative flex items-center justify-center h-14 rounded-2xl px-4 transition-all duration-500 overflow-hidden group",
                                isActive ? "bg-brand/10 text-brand" : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                            )}
                        >
                            <item.icon size={20} className={cn("z-10 group-hover:scale-110 transition-all", isActive ? "scale-110" : "")} />
                            <AnimatePresence>
                                {isActive && (
                                    <motion.span 
                                        layoutId="dock-label"
                                        className="ml-3 text-[10px] font-black uppercase tracking-widest z-10 hidden sm:block"
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                    >
                                        {item.title}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {isActive && (
                                <motion.div 
                                    layoutId="dock-bg"
                                    className="absolute inset-0 bg-brand/5 backdrop-blur-xl"
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="h-8 w-[1px] bg-white/10 mx-2" />

            {/* Smart Tools (Cart + Action) */}
            <div className="flex items-center gap-1">
                <button 
                    onClick={openCart}
                    className="relative w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.03] text-white/40 hover:text-brand hover:bg-brand/10 transition-all group"
                >
                    <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                    {cartCount > 0 && (
                        <span className="absolute top-3 right-3 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-black italic text-white shadow-lg">
                            {cartCount > 99 ? "99+" : cartCount}
                        </span>
                    )}
                </button>
                <Link 
                    href="https://wa.me/+919934567890" // Standard fallback, can pull from brandConfig
                    target="_blank"
                    className="h-14 px-6 rounded-2xl bg-brand text-white flex items-center gap-3 hover:translate-x-1 active:scale-95 transition-all shadow-xl hover:shadow-brand/20 group"
                >
                    <MessageCircle size={18} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Protocol</span>
                </Link>
            </div>
        </motion.div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
