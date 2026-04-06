'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, User, LogOut, Truck, Wifi, WifiOff } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface RiderNavClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export default function RiderNavClient({ user }: RiderNavClientProps) {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);
  const [toggling, setToggling] = useState(false);

  const toggleOnline = async () => {
    setToggling(true);
    // TODO: Persist to API when isOnline field is added to User model
    setIsOnline(prev => !prev);
    toast.success(isOnline ? 'You are now Offline' : 'You are now Online');
    setToggling(false);
  };

  const navItems = [
    { href: '/rider', icon: Package, label: 'Orders', exact: true },
    { href: '/rider/profile', icon: User, label: 'Profile', exact: false },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/rider" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Truck size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-black text-slate-900 tracking-tight">Rider Hub</p>
              <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Logistics Portal</p>
            </div>
          </Link>

          {/* Online Toggle */}
          <button
            onClick={toggleOnline}
            disabled={toggling}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isOnline ? <Wifi size={12} strokeWidth={3} /> : <WifiOff size={12} strokeWidth={3} />}
            {isOnline ? 'Online' : 'Offline'}
          </button>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-50 pb-safe">
        <div className="max-w-lg mx-auto px-6 h-16 flex items-center justify-around">
          {navItems.map(({ href, icon: Icon, label, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className="flex flex-col items-center gap-1 group">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  isActive ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'bg-slate-50 group-hover:bg-slate-100'
                }`}>
                  <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => signOut({ callbackUrl: '/rider/auth/login' })}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-rose-50 group-hover:bg-rose-100 transition-all">
              <LogOut size={20} className="text-rose-500" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}
