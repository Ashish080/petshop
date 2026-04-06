import { Suspense } from 'react';
import AnalyticsClient from './AnalyticsClient';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AnalyticsPage() {
  const session = await auth();
  
  if (session?.user?.role !== 'admin') {
    redirect('/auth/login');
  }

  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initialising Intelligence Node...</p>
            </div>
        </div>
    }>
      <AnalyticsClient />
    </Suspense>
  );
}
