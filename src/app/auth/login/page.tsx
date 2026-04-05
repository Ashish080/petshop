'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PawPrint, Lock, Mail, ArrowRight, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome back!');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-indigo-500/10 border border-slate-100 p-10 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white mb-6 transform rotate-3 shadow-xl shadow-indigo-500/20 hover:rotate-0 transition-transform duration-500">
              <PawPrint size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Access Portal</h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Command Center Login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Personnel Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                  placeholder="admin@petshop.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Access Key</label>
                <Link href="/auth/forgot" className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">Reset</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 group"
              loading={loading}
            >
              Sign In <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">Secondary Auth Options</p>
            <div className="flex gap-4">
              <button className="flex-1 px-4 py-3 border-2 border-slate-100 rounded-2xl text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <Github size={18} /> GitHub
              </button>
              <button className="flex-1 px-4 py-3 border-2 border-slate-100 rounded-2xl text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
          PetShop Platform v0.8.2-Stable
        </p>
      </div>
    </div>
  );
}
