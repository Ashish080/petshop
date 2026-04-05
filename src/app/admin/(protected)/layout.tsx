import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <AdminSidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--card-border)] bg-[var(--bg-page)]/85 px-6 backdrop-blur-xl md:px-10">
          <p className="text-sm text-[var(--text-light)]">Signed in as admin</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-semibold uppercase text-[var(--primary)]">
            AD
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-5 py-8 md:px-10 md:py-10">
          <div className="mx-auto max-w-[110rem]">{children}</div>
        </main>
      </div>
    </div>
  );
}
