'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { brandConfig } from '@/config/brand';
import { Mail, Lock, ArrowRight, Chrome, Github, PawPrint, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn, getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function AdminAuth() {
  const [isOn, setIsOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('admin@petshop.com');
  const [password, setPassword] = useState('');
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, duration: number }[]>([]);
  const router = useRouter();
  
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  
  useEffect(() => {
    setParticles([...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 2000,
      y: Math.random() * 1000,
      duration: 10 + Math.random() * 20
    })));
  }, []);

  const handleDragEnd = () => {
    if (y.get() > 50) {
      setIsOn(!isOn);
      if (!isOn) toast.success("System Booting...", { id: 'boot' });
    }
    y.set(0);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            toast.error('Access Denied: Invalid Credentials');
            return;
        }

        const session = await getSession();
        if (session?.user?.role !== 'admin') {
            toast.error('Unauthorized: Admin personnel only');
            return;
        }

        toast.success(`Welcome Commander, ${session.user.name}`);
        router.push('/admin');
    } catch {
        toast.error('System bypass failed. Try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <motion.div 
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: isOn ? "#FDFDFD" : "#0A0A0A" }}
    >
      {/* Lamp String */}
      <div className="absolute top-0 right-1/4 z-50 flex flex-col items-center">
        <div className="w-[2.5px] h-40 bg-zinc-500 shadow-lg" />
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 100 }}
          style={{ y }}
          onDragEnd={handleDragEnd}
          className="w-10 h-10 rounded-full bg-zinc-200 cursor-grab active:cursor-grabbing flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.2)] border-2 border-zinc-300 active:scale-90 transition-transform"
        >
           <div className="w-3 h-3 rounded-full bg-zinc-500" />
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {!isOn ? (
          <motion.div 
            key="dark-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            className="flex flex-col items-center text-center p-8 space-y-8"
          >
            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="text-white opacity-20 pointer-events-none"
            >
              <ShieldCheck size={160} />
            </motion.div>
            <div>
              <h2 className="text-4xl font-black text-zinc-500 tracking-tighter mb-4 uppercase">Secure Terminal</h2>
              <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-xs">Pull trigger to initialize link 🐾</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="light-scene"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] rounded-[60px] overflow-hidden glass border-white/50"
          >
            {/* Visual Side */}
            <div className="hidden lg:block lg:col-span-5 bg-zinc-900 p-16 relative overflow-hidden">
               <div className="absolute inset-0 opacity-10">
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-brand-primary)_0%,_transparent_70%)]" />
               </div>
               
               <motion.div 
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="relative z-10 w-full aspect-square rounded-[80px] overflow-hidden border-8 border-white/10 shadow-3xl"
               >
                 <Image 
                   src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop"
                   alt="Security"
                   fill
                   className="object-cover grayscale"
                   sizes="400px"
                 />
               </motion.div>
               
               <div className="mt-12 relative z-10">
                  <span className="text-brand-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Official Access</span>
                  <h2 className="text-5xl font-black text-white leading-tight mb-4 tracking-tighter">Command <br /> Center</h2>
                  <p className="text-zinc-500 font-medium text-lg italic">Welcome back, Administrator.</p>
               </div>
            </div>

            {/* Form Side */}
            <div className="lg:col-span-7 p-12 lg:p-20 bg-white/80 backdrop-blur-3xl flex flex-col justify-center">
                <div className="mb-12">
                   <h1 className="text-5xl font-black text-zinc-900 mb-4 tracking-tighter">Identify.</h1>
                   <p className="text-zinc-500 font-bold text-base leading-relaxed max-w-md">Enter your administrative credentials to bypass the security wall.</p>
                </div>

                <form className="space-y-8" onSubmit={handleLogin}>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Personnel Intel</label>
                      <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-brand-primary transition-colors" size={22} />
                        <input 
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-16 pr-8 py-6 bg-zinc-50 border border-zinc-100 rounded-[32px] focus:ring-[12px] focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all outline-none font-bold text-zinc-900" 
                          placeholder="admin@petshop.com" 
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Security Phrase</label>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-brand-primary transition-colors" size={22} />
                        <input 
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-16 pr-16 py-6 bg-zinc-50 border border-zinc-100 rounded-[32px] focus:ring-[12px] focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all outline-none font-bold text-zinc-900" 
                          placeholder="••••••••" 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 transition-colors">
                          {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                        </button>
                      </div>
                    </div>

                    <button disabled={loading} className="w-full py-6 bg-zinc-900 text-white rounded-[32px] font-black text-xl shadow-2xl shadow-zinc-900/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 group">
                      {loading ? (
                        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Authorize Entry
                          <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                </form>

                <div className="mt-16 flex items-center justify-between">
                   <Link href="/" className="text-xs font-black text-zinc-500 uppercase tracking-widest hover:text-zinc-900 transition-colors">
                     ← Return to Public
                   </Link>
                   <div className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Link Active</span>
                   </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y }}
            animate={{ 
              x: [p.x, p.x + 200, p.x], 
              y: [p.y, p.y + 200, p.y],
              scale: [1, 2, 1],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{ duration: p.duration, repeat: Infinity }}
            className="absolute w-4 h-4 bg-brand-primary rounded-full blur-xl"
          />
        ))}
      </div>
    </motion.div>
  );
}
