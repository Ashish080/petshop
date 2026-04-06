import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden font-sans uppercase">
      {/* Vyapar-Style Fixed Sidebar */}
      <AdminSidebar />
      
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
