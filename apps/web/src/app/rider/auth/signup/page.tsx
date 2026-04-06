'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, Lock, User, Phone, ArrowRight, 
  Truck, ShieldCheck, Zap, Globe, 
  Activity, MapPin, Fingerprint
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function RiderSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'rider' }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Rider application submitted!');
        router.push('/rider/auth/login');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden selection:bg-brand/30">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,0,0.05),transparent_70%)]" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-warning/5 blur-[120px] rounded-full animate-pulse decoration-5000" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] relative z-10"
      >
        {/* Header Protocol */}
        <div className="text-center mb-10">
            <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-20 h-20 bg-gradient-to-br from-brand to-warning rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand/20 relative group overflow-hidden"
            >
                <Truck size={32} className="text-white relative z-10" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none mb-3 px-4">Fleet Enlistment</h2>
            <div className="flex items-center justify-center gap-4">
                <div className="h-[1px] w-8 bg-white/10" />
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Protocol v7.4.2</p>
                <div className="h-[1px] w-8 bg-white/10" />
            </div>
        </div>

        {/* Identity Uplink Form */}
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <InputGroup 
                        icon={User} 
                        label="Agent Name" 
                        placeholder="Real name required" 
                        value={formData.name}
                        onChange={(val) => setFormData({ ...formData, name: val })}
                    />
                    <InputGroup 
                        icon={Mail} 
                        label="Identity Link / Email" 
                        placeholder="active_link@fleet.com" 
                        type="email"
                        value={formData.email}
                        onChange={(val) => setFormData({ ...formData, email: val })}
                    />
                    <InputGroup 
                        icon={Phone} 
                        label="Comm-Node / Phone" 
                        placeholder="+91-000-000-0000" 
                        type="tel"
                        value={formData.phone}
                        onChange={(val) => setFormData({ ...formData, phone: val })}
                    />
                    <InputGroup 
                        icon={Lock} 
                        label="Access Cipher / Pass" 
                        placeholder="Secure sequence" 
                        type="password"
                        value={formData.password}
                        onChange={(val) => setFormData({ ...formData, password: val })}
                    />
                </div>

                <button
                    disabled={loading}
                    className="w-full relative group h-16 bg-white text-black font-black uppercase italic tracking-widest rounded-2xl overflow-hidden transition-all active:scale-95 disabled:opacity-50 mt-4"
                >
                    <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                        {loading ? 'Transmitting Data...' : 'Initiate Uplink'}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
            </form>

            <div className="mt-10 flex items-center justify-between pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-widest">
                    <Fingerprint size={14} className="text-brand" /> SEC-LINK ACTIVE
                </div>
                <Link href="/rider/auth/login" className="text-[10px] font-black text-brand uppercase tracking-widest hover:text-warning transition-colors underline decoration-brand/30 underline-offset-4">Existing Agent? Login</Link>
            </div>
        </div>

        {/* Global Registry Banner */}
        <div className="mt-8 flex justify-center gap-8 opacity-20">
            <Globe size={20} className="text-white" />
            <ShieldCheck size={20} className="text-white" />
            <Activity size={20} className="text-white" />
            <MapPin size={20} className="text-white" />
        </div>
      </motion.div>
    </div>
  );
}

function InputGroup({ icon: Icon, label, placeholder, type = 'text', value, onChange }: any) {
    return (
        <div className="space-y-2 group">
            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <Icon size={16} className="text-white/20 group-focus-within:text-brand transition-colors" />
                    <div className="w-[1px] h-4 bg-white/10" />
                </div>
                <input 
                    type={type} 
                    required 
                    placeholder={placeholder}
                    className="w-full pl-14 pr-4 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-sm font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-brand/40 focus:bg-white/[0.04] focus:ring-4 focus:ring-brand/5 transition-all outline-none"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}
