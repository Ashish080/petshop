import { ReactNode } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import RiderNavClient from './RiderNavClient';

// ✅ FIXED: Restored as Server Component for SSR auth guard
export default async function RiderLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session || (session.user.role !== 'rider' && session.user.role !== 'admin')) {
    redirect('/rider/auth/login');
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col font-sans">
      <RiderNavClient user={session.user} />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-6 pb-28">
        {children}
      </main>
    </div>
  );
}
