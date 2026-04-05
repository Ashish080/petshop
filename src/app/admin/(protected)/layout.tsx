import Link from 'next/link';
import { Package, LayoutDashboard, ShoppingCart, Settings, ClipboardList, Menu, X, ArrowLeft } from 'lucide-react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    redirect('/auth/login');
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-slate-200 bg-white flex-col shrink-0 shadow-sm z-30">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-xl font-black text-lg shadow-lg shadow-indigo-200">
            K
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight tracking-tight text-slate-900 uppercase">Kanha Admin</h2>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider">WORKSPACE v3.0</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Management</p>
          
          <Link href="/admin" className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all group">
            <LayoutDashboard size={18} className="opacity-70 group-hover:opacity-100" /> 
            <span>Dashboard</span>
          </Link>
          
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all group">
            <Package size={18} className="opacity-70 group-hover:opacity-100" /> 
            <span>Inventory</span>
          </Link>
          
          <Link href="/admin/billing" className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all group">
            <ClipboardList size={18} className="opacity-70 group-hover:opacity-100" /> 
            <span>Billing & GST</span>
          </Link>
42:
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all group">
            <ShoppingCart size={18} className="opacity-70 group-hover:opacity-100" /> 
            <span>Orders & Sales</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <Link href="/" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-white hover:text-indigo-600 transition-all border border-slate-200 bg-white">
            <ArrowLeft size={16} /> <span>Storefront</span>
          </Link>
        </div>
      </aside>
      
      {/* Mobile Topbar */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Menu size={20} />
            </button>
            <div className="hidden sm:block font-semibold text-sm text-slate-400 uppercase tracking-widest">
              Internal Ops
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end hidden sm:flex">
               <span className="text-xs font-bold text-slate-900">{session.user.name || 'Admin'}</span>
               <span className="text-[10px] font-bold text-slate-400 capitalize">{session.user.role}</span>
             </div>
             <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100 shadow-sm">
               {session.user.name?.charAt(0) || 'A'}
             </div>
          </div>
        </header>
        
        {/* Workspace Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

