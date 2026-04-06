'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { brandConfig } from '@/config/brand';
import { Mail, Lock, ArrowRight, User, Heart, Sparkles, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motionPresets } from '@/lib/motion';

export default function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error('Invalid credentials. New here? Switch to Sign Up!');
          return;
        }

        toast.success('Welcome back to the family! 🐾');
        router.push('/');
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: 'user',
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || 'Registration failed. Try again.');
          return;
        }

        toast.success('Account created! Now you can login. 🐾');
        setIsLogin(true);
      }
    } catch (error) {
      toast.error("Something went wrong. Let's try again.");
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-bg-primary relative overflow-hidden transition-all">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[10%] -left-[5%] w-[40%] aspect-square bg-brand/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-[10%] -right-[5%] w-[40%] aspect-square bg-accent/5 rounded-full blur-[120px]"
        />
      </div>

      <motion.div
        {...motionPresets.fadeUp}
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-[--radius-xl] overflow-hidden shadow-lg border border-border bg-bg-primary/40 backdrop-blur-3xl z-10"
      >
        {/* Left Side: Welcoming Visuals */}
        <div className="hidden lg:block lg:col-span-5 bg-brand p-16 flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)]" />
          </div>

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
              <div className="w-12 h-12 rounded-[--radius-lg] bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart size={24} fill="currentColor" />
              </div>
              <span className="text-h4 font-extrabold tracking-tighter uppercase">{brandConfig.name}</span>
            </Link>

            <h1 className="text-display font-extrabold leading-none tracking-tighter mb-8">
              BRING <br />
              JOY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-100">
                HOME.
              </span>
            </h1>
            <p className="text-white/80 font-medium text-body-lg leading-relaxed max-w-xs">
              Join Lucknow's most premium pet community and experience next-gen care.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            {[
              { icon: Sparkles, text: 'Exclusive Member Benefits' },
              { icon: ShoppingBag, text: 'Waitlist for Premium Breeds' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[--radius-md] bg-white/10 flex items-center justify-center border border-white/10">
                  <item.icon size={18} />
                </div>
                <span className="text-label font-bold uppercase tracking-widest">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="lg:col-span-7 bg-bg-primary p-12 lg:p-20 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              {...motionPresets.fade}
            >
              <div className="mb-12">
                <h2 className="text-h2 font-extrabold text-text-primary tracking-tighter mb-3">
                  {isLogin ? 'Welcome Back!' : 'Join the Pack.'}
                </h2>
                <p className="text-text-secondary font-bold text-body-lg">
                  {isLogin
                    ? 'Enter your details to resume your journey.'
                    : 'Create an account to start your premium experience.'}
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleAuth}>
                {!isLogin && (
                  <Input
                    label="Full Name"
                    placeholder="Enter full name"
                    iconLeft={<User />}
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                )}

                <Input
                  label="Email ID"
                  type="email"
                  placeholder="your@email.com"
                  iconLeft={<Mail />}
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  iconLeft={<Lock />}
                  iconRight={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <Button
                  type="submit"
                  loading={loading}
                  size="lg"
                  fullWidth
                  className="mt-4"
                  iconRight={!loading && <ArrowRight size={20} />}
                >
                  {isLogin ? 'Start Exploring ⚡' : 'Create Account 🐾'}
                </Button>
              </form>

              <div className="mt-10 pt-10 border-t border-border text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-label font-bold text-text-tertiary uppercase tracking-widest hover:text-brand transition-colors"
                >
                  {isLogin ? 'New to the family? Create Account' : 'Already a member? Sign In'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
