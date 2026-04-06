'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Package, LayoutDashboard, ShoppingCart, 
  Settings, ClipboardList, Zap, LogOut,
  ChevronRight, Globe, ShieldAlert, Users,
  BarChart3, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminSidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Command Center", color: "#FF6B00", group: "Operations" },
    { href: "/admin/analytics", icon: BarChart3, label: "Strategic Vision", color: "#7C5CFC", group: "Operations" },
    { href: "/admin/inventory", icon: Package, label: "Supply Chain", color: "#00C48C", group: "Management" },
    { href: "/admin/orders", icon: ShoppingCart, label: "Mission Logs", color: "#FFB020", group: "Management" },
    { href: "/admin/riders", icon: Activity, label: "Fleet Telemetry", color: "#F04438", group: "Logistics" },
    { href: "/admin/users", icon: Users, label: "Personnel Hub", color: "#2E90FA", group: "Identity" },
    { href: "/admin/settings", icon: Settings, label: "Core Protocol", color: "#8E44AD", group: "Identity" },
  ];

  // Group items
  const groups = Array.from(new Set(navItems.map(i => i.group)));

  return (
    <aside className="w-[300px] h-full bg-[#0F0F10] border-r border-white/5 flex flex-col shrink-0 relative z-50 overflow-hidden">
      {/* Brand Identity */}
      <div className="p-8 pb-10 flex items-center gap-4 relative group">
        <div className="w-12 h-12 bg-gradient-to-br from-brand to-warning text-white flex items-center justify-center rounded-[18px] font-black text-xl shadow-xl shadow-brand/20 relative z-10 overflow-hidden transform group-hover:rotate-6 transition-transform">
           <Zap className="fill-white" size={24} />
           <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div>
          <h2 className="font-extrabold text-xl leading-tight tracking-tighter text-white">KANHA HQ</h2>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-bold mt-1">Strategic Operations</p>
        </div>
        
        {/* Glow behind logo */}
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-brand/10 blur-[60px] rounded-full pointer-events-none opacity-50" />
      </div>
      
      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto px-6 space-y-9 custom-scrollbar py-4" data-lenis-prevent="true">
        {groups.map(group => (
          <div key={group} className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2 px-4 leading-none">{group}</p>
            <div className="space-y-1.5">
              {navItems.filter(i => i.group === group).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl text-xs font-bold transition-all relative group overflow-hidden ${isActive ? 'text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'}`}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-white/10 transition-all">
                        <item.icon size={18} className={isActive ? "text-brand" : "text-white/30 group-hover:text-white/60 transition-colors"} />
                      </div>
                      <span className="tracking-tight uppercase italic">{item.label}</span>
                    </div>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div 
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-gradient-to-r from-brand/5 to-transparent border-l-[3px] border-brand z-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </AnimatePresence>
                    
                    {isActive && <ChevronRight size={14} className="text-brand relative z-10" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      
      {/* Utility Footer */}
      <div className="p-6 border-t border-white/5 space-y-3">
        <Link href="/" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all group border border-transparent hover:border-white/5 uppercase italic tracking-wider">
          <Globe size={18} className="group-hover:rotate-12 transition-transform" /> Storefront
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold text-danger/60 hover:text-danger hover:bg-danger/10 transition-all uppercase italic tracking-wider">
          <LogOut size={18} /> Exit Console
        </button>
      </div>
    </aside>
  );
}
