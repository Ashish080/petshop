import Link from 'next/link';
import { Package, LayoutDashboard, ShoppingBag, ShoppingCart, Settings } from 'lucide-react';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Vyapar-Style Fixed Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-primary text-white flex items-center justify-center rounded-xl font-black">
            P
          </div>
          <div>
            <h2 className="font-black text-lg leading-tight tracking-tight">Admin Console</h2>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Vyapar Mode</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-2">Core Apps</p>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-brand-primary transition-all">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-brand-primary transition-all">
            <Package size={18} /> Products
          </Link>
          <Link href="/admin/inventory" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-brand-primary transition-all">
            <ShoppingBag size={18} /> Inventory
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-brand-primary transition-all">
            <ShoppingCart size={18} /> Orders
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">
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
