'use client';
import Link from 'next/link';
import { Package, LayoutDashboard, ShoppingCart, Settings, ClipboardList } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function AdminSidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard", color: "#FF7B54" },
    { href: "/admin/products", icon: Package, label: "Inventory", color: "#70A1FF" },
    { href: "/admin/billing", icon: ClipboardList, label: "Billing & GST", color: "#FFD93D" },
    { href: "/admin/orders", icon: ShoppingCart, label: "Sales Logs", color: "#2ECC71" },
  ];

  return (
    <aside className="w-80 h-full border-r-2 border-gray-100 bg-white flex flex-col shrink-0 relative z-20">
      <div className="p-8 border-b-2 border-gray-50 flex items-center gap-4">
        <div className="w-12 h-12 bg-[#FF7B54] text-white flex items-center justify-center rounded-2xl font-black text-xl shadow-lg shadow-[#FF7B54]/30">
          K
        </div>
        <div>
          <h2 className="font-black text-xl leading-tight tracking-tighter text-slate-900">KANHA PANEL</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-black">OPS CONTROL v3.0</p>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-6 py-10 space-y-2" data-lenis-prevent="true">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-6 px-2 opacity-50">Strategic Ops</p>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-black transition-all group border ${isActive ? 'bg-gray-50 border-gray-200 text-slate-900' : 'text-slate-800 border-transparent hover:bg-gray-50'}`}
              style={isActive ? { borderColor: `${item.color}30`, backgroundColor: `${item.color}10`, color: item.color } : {}}
            >
              <item.icon size={20} color={isActive ? item.color : undefined} className={!isActive ? "opacity-70 group-hover:opacity-100" : ""} /> 
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 border-t-2 border-gray-50">
        <Link href="/" className="flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-xs font-black text-gray-600 hover:bg-gray-100 transition-all border-2 border-gray-50">
          <Settings size={18} /> Storefront
        </Link>
      </div>
    </aside>
  );
}
