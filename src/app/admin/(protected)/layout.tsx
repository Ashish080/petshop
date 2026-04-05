import Link from 'next/link';
import { Package, LayoutDashboard, ShoppingBag, ShoppingCart, Settings, ClipboardList } from 'lucide-react';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden font-sans uppercase">
      {/* Vyapar-Style Fixed Sidebar */}
      <aside className="w-80 border-r-2 border-gray-100 bg-white flex flex-col shrink-0">
        <div className="p-8 border-b-2 border-gray-50 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FF7B54] text-white flex items-center justify-center rounded-2xl font-black text-xl shadow-lg shadow-[#FF7B54]/30">
            K
          </div>
          <div>
            <h2 className="font-black text-xl leading-tight tracking-tighter text-slate-900">KANHA PANEL</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-black">OPS CONTROL v3.0</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-6 py-10 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-6 px-2 opacity-50">Strategic Ops</p>
          
          <Link href="/admin" className="flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-black text-slate-800 hover:bg-[#FF7B54]/5 hover:text-[#FF7B54] transition-all group border border-transparent hover:border-[#FF7B54]/10">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          
          <Link href="/admin/products" className="flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-black text-slate-800 hover:bg-[#70A1FF]/5 hover:text-[#70A1FF] transition-all group border border-transparent hover:border-[#70A1FF]/10">
            <Package size={20} /> Inventory
          </Link>
          
          <Link href="/admin/billing" className="flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-black text-slate-800 hover:bg-[#FFD93D]/5 hover:text-[#FFD93D] transition-all group border border-transparent hover:border-[#FFD93D]/10">
            <ClipboardList size={20} /> Billing & GST
          </Link>

          <Link href="/admin/orders" className="flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-black text-slate-800 hover:bg-[#2ECC71]/5 hover:text-[#2ECC71] transition-all group border border-transparent hover:border-[#2ECC71]/10">
            <ShoppingCart size={20} /> Sales Logs
          </Link>
        </nav>
        
        <div className="p-6 border-t-2 border-gray-50">
          <Link href="/" className="flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-xs font-black text-gray-600 hover:bg-gray-100 transition-all border-2 border-gray-50">
            <Settings size={18} /> Storefront
          </Link>
        </div>
      </aside>
      
      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-gray-200 bg-white px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="font-semibold text-sm text-gray-500">
            Internal Operations
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs uppercase border border-brand-primary/20">
               AD
             </div>
          </div>
        </header>
        
        {/* Scrollable Workspace Viewport */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
