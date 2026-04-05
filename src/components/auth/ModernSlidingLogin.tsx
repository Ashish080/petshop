'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Twitter } from 'lucide-react';
import Link from 'next/link';
import { brandConfig } from '@/config/brand';

interface Props {
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
}

export function ModernSlidingLogin({
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
  loading,
}: Props) {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] bg-gradient-to-br from-[var(--bg-page)] to-[color-mix(in_srgb,var(--primary)_10%,var(--bg-page))] flex items-center justify-center p-4 sm:p-8 perspective-1000 overflow-hidden relative">
      
      {/* 3D Motion Graphic Background Elements */}
      <motion.div 
        className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }}
        animate={{
          x: [-200, 200, -200],
          y: [-100, 100, -100],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--secondary) 0%, transparent 70%)' }}
        animate={{
          x: [200, -200, 200],
          y: [100, -100, 100],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative w-full max-w-[900px] h-[600px] bg-[var(--card-bg)]/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-[var(--card-border)] flex transform-style-3d">
        
        {/* Form Container: Sign Up */}
        <motion.div 
          className="absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center px-12 z-10"
          initial={false}
          animate={{
            x: isSignUp ? '100%' : '0%',
            opacity: isSignUp ? 1 : 0,
            zIndex: isSignUp ? 20 : 10,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2 text-[var(--text-primary)]">Create Account</h2>
            <div className="flex justify-center gap-3 my-4">
              <button type="button" className="w-10 h-10 rounded-full border border-[var(--card-border)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors"><Chrome size={18} /></button>
              <button type="button" className="w-10 h-10 rounded-full border border-[var(--card-border)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors"><Github size={18} /></button>
              <button type="button" className="w-10 h-10 rounded-full border border-[var(--card-border)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors"><Twitter size={18} /></button>
            </div>
            <p className="text-sm text-[var(--text-light)]">or use your email for registration</p>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); /* Mock signup */ setIsSignUp(false); }}>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
              <input type="text" placeholder="Name" className="w-full pl-12 pr-4 py-3 bg-[color-mix(in_srgb,var(--card-border)_40%,transparent)] border border-[var(--card-border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]/50 text-sm" />
            </div>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
              <input type="email" placeholder="Email" className="w-full pl-12 pr-4 py-3 bg-[color-mix(in_srgb,var(--card-border)_40%,transparent)] border border-[var(--card-border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]/50 text-sm" />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
              <input type="password" placeholder="Password" className="w-full pl-12 pr-4 py-3 bg-[color-mix(in_srgb,var(--card-border)_40%,transparent)] border border-[var(--card-border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]/50 text-sm" />
            </div>
            <button type="submit" className="w-full py-4 mt-2 bg-[var(--primary)] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95">
              SIGN UP
            </button>
          </form>
        </motion.div>

        {/* Form Container: Sign In */}
        <motion.div 
          className="absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center px-12 z-20 bg-[var(--card-bg)]"
          initial={false}
          animate={{
            x: isSignUp ? '100%' : '0%',
            opacity: isSignUp ? 0 : 1,
            zIndex: isSignUp ? 10 : 20,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2 text-[var(--text-primary)]">Sign In</h2>
            <div className="flex justify-center gap-3 my-4">
              <button type="button" className="w-10 h-10 rounded-full border border-[var(--card-border)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors"><Chrome size={18} /></button>
              <button type="button" className="w-10 h-10 rounded-full border border-[var(--card-border)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors"><Github size={18} /></button>
            </div>
            <p className="text-sm text-[var(--text-light)]">or use your email account</p>
          </div>
          
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email" 
                className="w-full pl-12 pr-4 py-3 bg-[color-mix(in_srgb,var(--card-border)_40%,transparent)] border border-[var(--card-border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]/50 text-sm font-medium" 
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full pl-12 pr-4 py-3 bg-[color-mix(in_srgb,var(--card-border)_40%,transparent)] border border-[var(--card-border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]/50 text-sm font-medium" 
              />
            </div>
            <div className="flex justify-center mt-2 mb-4">
              <Link href="#" className="text-xs font-semibold text-[var(--text-light)] hover:text-[var(--primary)] transition-colors">
                Forgot your password?
              </Link>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 bg-[var(--primary)] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-80 scale-95' : 'active:scale-95'}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'SIGN IN'}
            </button>
            
            <div className="mt-8 pt-6 border-t border-[var(--card-border)] text-center pb-4">
               <p className="text-xs text-[var(--text-light)] mb-2">Demo usage: <code className="text-[var(--text-primary)]">user@example.com / user123</code></p>
               <Link href="/" className="text-xs font-bold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors flex items-center justify-center gap-1">
                 ← Return to storefront
               </Link>
            </div>
          </form>
        </motion.div>

        {/* Overlay Container - The Moving Part */}
        <motion.div 
          className="absolute top-0 left-1/2 w-1/2 h-full overflow-hidden z-50 pointer-events-none rounded-[30px]"
          initial={false}
          animate={{ x: isSignUp ? '-100%' : '0%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          {/* Overlay Background */}
          <motion.div 
            className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-[var(--secondary)] via-[var(--primary)] to-[var(--primary)] text-white"
            initial={false}
            animate={{ x: isSignUp ? '50%' : '0%' }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            {/* Overlay Left */}
            <motion.div 
              className="absolute top-0 right-1/2 w-1/2 h-full flex flex-col items-center justify-center px-12 text-center pointer-events-auto"
              initial={false}
              animate={{ x: isSignUp ? '0%' : '-20%' }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <h2 className="text-4xl font-black mb-4">Welcome Back!</h2>
              <p className="text-sm font-medium opacity-90 mb-8 leading-relaxed">
                To keep connected with us please login with your personal info
              </p>
              <button 
                onClick={() => setIsSignUp(false)}
                className="px-10 py-3 border-2 border-white rounded-xl font-bold uppercase tracking-wider hover:bg-white hover:text-[var(--primary)] transition-all active:scale-95"
              >
                Sign In
              </button>
            </motion.div>

            {/* Overlay Right */}
            <motion.div 
              className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-12 text-center pointer-events-auto"
              initial={false}
              animate={{ x: isSignUp ? '20%' : '0%' }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <h2 className="text-4xl font-black mb-4">Hello, Friend!</h2>
              <p className="text-sm font-medium opacity-90 mb-8 leading-relaxed">
                Enter your personal details and start your journey with {brandConfig.name}
              </p>
              <button 
                onClick={() => setIsSignUp(true)}
                className="px-10 py-3 border-2 border-white flex items-center gap-2 rounded-xl font-bold uppercase tracking-wider hover:bg-[color-mix(in_srgb,var(--bg-page)_15%,white)] hover:text-[#ff7a00] transition-colors active:scale-95"
              >
                Sign Up <ArrowRight size={16} strokeWidth={3} />
              </button>
            </motion.div>
            
            {/* 3D Glass Orbs over Overlay */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 backdrop-blur-md rounded-full shadow-2xl border border-white/20 animate-pulse" />
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 backdrop-blur-md rounded-full shadow-2xl border border-white/20 animate-pulse animation-delay-2000" />
            
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
