import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-[#FAFAFA] overflow-hidden antialiased items-center justify-center p-0 md:p-3">
      {/* Premium Dashboard Shell */}
      <div className="flex w-full h-full max-w-[2000px] bg-[#0F0F10] md:rounded-[24px] border border-white/5 overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,107,0,0.05),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(124,92,252,0.05),transparent_50%)] pointer-events-none" />
        
        {/* Futuristic Sidebar */}
        <AdminSidebar />
        
        {/* Main Command Center */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <AdminHeader user={{ name: session.user?.name || 'Admin', initials: 'AD' }} />
          
          <main className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar relative z-10">
            <div className="max-w-[1400px] mx-auto animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
