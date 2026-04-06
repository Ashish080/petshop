import { Suspense } from 'react';
import UserDashboardClient from './UserDashboardClient';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function UserDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/dashboard');
  }

  return (
    <div className="bg-zinc-50 min-h-screen relative overflow-hidden">
        {/* Ambient Logistics Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-400/5 rounded-full blur-[140px] -mr-64 -mt-64 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-400/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>
        
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-white border border-zinc-100 rounded-[32px] flex items-center justify-center animate-pulse shadow-2xl">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Negotiating Secure Mission Protocols...</p>
                </div>
            </div>
        }>
            <UserDashboardClient />
        </Suspense>
    </div>
  );
}
