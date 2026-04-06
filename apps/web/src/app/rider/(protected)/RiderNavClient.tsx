'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LogOut, User, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiderNavClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

const navItems = [
  { href: '/rider', icon: Home, label: 'Home', exact: true },
  { href: '/rider/profile', icon: User, label: 'Profile', exact: false },
];

export default function RiderNavClient({ user }: RiderNavClientProps) {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const syncStatus = () => setIsOnline(window.navigator.onLine);

    syncStatus();
    window.addEventListener('online', syncStatus);
    window.addEventListener('offline', syncStatus);

    return () => {
      window.removeEventListener('online', syncStatus);
      window.removeEventListener('offline', syncStatus);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed bottom-20 left-0 right-0 z-40 px-4">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-bg-elevated/90 px-3 py-2 shadow-xs backdrop-blur-xl">
          {isOnline ? (
            <Wifi size={14} className="text-success" />
          ) : (
            <WifiOff size={14} className="text-danger" />
          )}
          <span className="text-[11px] font-semibold tracking-[0.12em] text-text-secondary uppercase">
            {isOnline ? 'Live sync' : 'Offline mode'}
          </span>
        </div>
      </div>

      <nav className="fixed bottom-4 left-0 right-0 z-50 px-4">
        <div className="premium-panel mx-auto flex max-w-lg items-center justify-between rounded-[28px] px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-text-primary text-text-inverse shadow-xs">
              {user.name?.slice(0, 1)?.toUpperCase() || 'R'}
            </div>
            <div className="min-w-0">
              <p className="text-kicker">Rider app</p>
              <p className="truncate text-sm font-semibold text-text-primary">
                {user.name || 'Delivery partner'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {navItems.map(({ href, icon: Icon, label, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold transition-all',
                    active
                      ? 'bg-text-primary text-text-inverse shadow-xs'
                      : 'text-text-secondary hover:bg-bg-tertiary'
                  )}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => signOut({ callbackUrl: '/rider/auth/login' })}
              className="rounded-full border border-border bg-bg-tertiary p-2.5 text-text-tertiary transition-colors hover:text-danger"
              aria-label="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
