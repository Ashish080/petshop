import { ReactNode } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, Truck, User, LogOut, ChevronRight, PawPrint } from 'lucide-react';

export default async function RiderLayout({ children }: { children: ReactNode }) {
    const session = await auth();
    if (!session || (session.user.role !== 'rider' && session.user.role !== 'admin')) {
        redirect('/auth/login');
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-outfit">
            {/* Mobile Header */}
            <header className="bg-white border-b border-slate-100 flex justify-between items-center px-6 py-4 sticky top-0 z-50 backdrop-blur-md bg-white/80">
                <Link href="/rider" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                        <Truck size={22} />
                    </div>
                    <div>
                        <span className="block font-black text-slate-900 leading-none">Rider Hub</span>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none mt-1">Active Duty</span>
                    </div>
                </Link>
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden ring-4 ring-indigo-50">
                    <img 
                        src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} 
                        alt="avatar" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-lg mx-auto w-full p-4 pt-6 pb-32">
                {children}
            </main>

            {/* Premium Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 px-8 py-3 flex justify-around items-center z-50 shadow-[0_-10px_35px_rgba(0,0,0,0.05)] sm:max-w-lg sm:mx-auto sm:rounded-t-[32px] sm:border-x">
                <Link href="/rider" className="flex flex-col items-center gap-1.5 group">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-active:scale-90 transition-transform">
                        <Package size={22} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasks</span>
                </Link>
                <Link href="/rider/profile" className="flex flex-col items-center gap-1.5 group opacity-40">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-active:scale-90 transition-transform">
                        <User size={22} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</span>
                </Link>
                <Link href="/api/auth/signout" className="flex flex-col items-center gap-1.5 group">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 group-active:scale-90 transition-transform">
                        <LogOut size={22} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stop</span>
                </Link>
            </nav>
        </div>
    );
}
