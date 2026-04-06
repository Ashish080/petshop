'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Package, Truck, CheckCircle, Clock, Star, MapPin, 
  ChevronRight, ArrowRight, ShoppingBag, ShieldCheck, 
  MessageSquare, History, Tag, Activity, 
  User as UserIcon, Calendar, Bell, Settings, LogOut, Plus,
  Heart, Scissors, Syringe, Clipboard, Camera, Eye, EyeOff, Save, Key, Lock as LockIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function UserDashboardClient() {
  const { data: session, update } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('My Pets');
  const [selectedPet, setSelectedPet] = useState('Bella');

  // Profile Settings States
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || '',
    image: session?.user?.image || ''
  });
  const [passwordState, setPasswordState] = useState({
    current: '',
    new: '',
    confirm: '',
    showCurrent: false,
    showNew: false
  });
  const [updating, setUpdating] = useState(false);
  const fileInputRef = (typeof window !== 'undefined') ? require('react').useRef<HTMLInputElement>(null) : { current: null };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success('Analyzing asset: ' + file.name);
      // Logic for cloudinary or direct upload would go here
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const result = await res.json();
      if (result.success) setOrders(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    if (session?.user) {
        setProfileData({
            name: session.user.name || '',
            image: session.user.image || ''
        });
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
        const res = await fetch('/api/user/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: profileData.name, image: profileData.image })
        });
        const data = await res.json();
        if (data.success) {
            toast.success('Identity Updated Successfully');
            await update(); // Sync NextAuth session
        } else {
            toast.error(data.message);
        }
    } catch (err) {
        toast.error('Network failure in identity sync');
    } finally {
        setUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.new !== passwordState.confirm) {
        return toast.error('Security Keys do not match');
    }
    setUpdating(true);
    try {
        const res = await fetch('/api/user/profile', { // Unified API from earlier
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                currentPassword: passwordState.current, 
                newPassword: passwordState.new 
            })
        });
        const data = await res.json();
        if (data.success) {
            toast.success('Security Credentials Rotated');
            setPasswordState({ current: '', new: '', confirm: '', showCurrent: false, showNew: false });
        } else {
            toast.error(data.message);
        }
    } catch (err) {
        toast.error('Identity rotation failed');
    } finally {
        setUpdating(false);
    }
  };

  const menuItems = [
    { icon: Heart, label: 'My Pets' },
    { icon: Calendar, label: 'Appointments' },
    { icon: Package, label: 'My Orders' },
    { icon: Bell, label: 'Alerts', badge: 2 },
    { icon: Settings, label: 'Profile Settings' },
  ];

  const pets = [
    { name: 'Bella', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=200&auto=format&fit=crop', breed: 'Golden Retriever', age: '2 Years', weight: '24.5 kg', gender: 'Female' },
    { name: 'Max', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=200&auto=format&fit=crop', breed: 'Bulldog', age: '1 Year', weight: '18.2 kg', gender: 'Male' }
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-white border border-zinc-100 rounded-[32px] flex items-center justify-center animate-pulse shadow-2xl">
                <Heart size={32} className="text-[#FF7B54]" fill="#FF7B54" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Opening Passport...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex">
      {/* SIDEBAR */}
      <aside className="w-80 border-r border-[#F0F0F0] hidden lg:flex flex-col p-8 bg-white/50 backdrop-blur-xl shrink-0">
        <div className="bg-[#FFF4F0] p-6 rounded-[32px] mb-12 border border-[#FFE8E0] flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#FF7B54] shadow-sm relative overflow-hidden">
                {profileData.image ? (
                    <img src={profileData.image} className="w-full h-full object-cover" />
                ) : (
                    <UserIcon size={24} />
                )}
            </div>
            <div>
                <h4 className="font-black text-sm text-zinc-900 tracking-tight truncate w-32">{profileData.name || 'Valued Guest'}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#FF7B54]/60">Pet Owner</p>
            </div>
        </div>

        <nav className="flex-1 space-y-4">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 px-4">My Center</p>
            {menuItems.map((item) => {
                const isOrders = item.label === 'My Orders';
                return (
                <button 
                    key={item.label}
                    onClick={() => isOrders ? (window.location.href = '/orders') : setActiveTab(item.label)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${activeTab === item.label ? 'bg-[#FF7B54] text-white shadow-xl shadow-[#FF7B54]/20' : 'text-zinc-500 hover:bg-zinc-50'}`}
                >
                    <div className="flex items-center gap-4">
                        <item.icon size={20} className={activeTab === item.label ? 'stroke-[3]' : 'group-hover:scale-110 transition-transform'} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    {item.badge && (
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${activeTab === item.label ? 'bg-white text-[#FF7B54]' : 'bg-indigo-600 text-white'}`}>
                            {item.badge}
                        </span>
                    )}
                </button>
                );
            })}
        </nav>

        <button 
            onClick={() => signOut()}
            className="flex items-center gap-4 px-6 py-4 text-rose-500 font-black text-[11px] uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-all"
        >
            <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-16 max-w-7xl mx-auto overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
            <div>
                <h1 className="text-5xl font-black text-zinc-900 tracking-tighter italic mb-4">
                    {activeTab === 'Profile Settings' ? 'Security & Identity' : 'My Pets Passport'}
                </h1>
                <p className="text-zinc-400 font-bold text-lg">
                    {activeTab === 'Profile Settings' ? 'Manage your secure mission credentials.' : 'Welcome back to the fur-mily portal.'}
                </p>
            </div>
            {activeTab === 'My Pets' && (
                <button className="bg-[#FF7B54] text-white rounded-2xl px-8 py-4 font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#FF7B54]/20">
                    <Plus size={18} /> Add New Pet
                </button>
            )}
        </header>

        <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'My Pets' && (
                        <>
                            {/* PET TABS */}
                            <div className="flex gap-4 mb-12">
                                {pets.map(pet => (
                                    <button 
                                        key={pet.name}
                                        onClick={() => setSelectedPet(pet.name)}
                                        className={`px-8 py-3 rounded-2xl flex items-center gap-3 transition-all border ${selectedPet === pet.name ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/20' : 'bg-white text-zinc-500 border-zinc-100'}`}
                                    >
                                        <img src={pet.image} className="w-6 h-6 rounded-lg object-cover" />
                                        <span className="text-xs font-black uppercase tracking-widest">{pet.name}</span>
                                    </button>
                                ))}
                                <button className="w-10 h-10 rounded-xl border-2 border-dashed border-zinc-200 flex items-center justify-center text-zinc-300 hover:border-[#FF7B54] hover:text-[#FF7B54] transition-all">
                                    <Plus size={20} />
                                </button>
                            </div>

                            <section className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                                {/* PROFILE CARD */}
                                <div className="xl:col-span-4 space-y-8">
                                    <div className="bg-white rounded-[60px] p-12 border border-[#F0F0F0] shadow-[0_50px_100px_rgba(0,0,0,0.04)] text-center relative overflow-hidden group">
                                        <div className="w-48 h-48 bg-[#FFF4F0] rounded-[56px] mx-auto mb-8 p-1.5 border border-[#FFE8E0] relative group-hover:scale-105 transition-transform duration-700">
                                            <img 
                                                src={pets.find(p => p.name === selectedPet)?.image} 
                                                className="w-full h-full object-cover rounded-[48px]" 
                                            />
                                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full border border-zinc-100 shadow-sm text-[#FF7B54]">
                                                <Heart size={14} fill="currentColor" />
                                            </div>
                                        </div>
                                        
                                        <h2 className="text-4xl font-black text-zinc-900 tracking-tighter mb-2 italic">{selectedPet}</h2>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF7B54] mb-8">{pets.find(p => p.name === selectedPet)?.breed} • {pets.find(p => p.name === selectedPet)?.age}</p>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-zinc-50 rounded-[32px] p-6 border border-zinc-100">
                                                <span className="block text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">Weight</span>
                                                <span className="text-sm font-black text-zinc-900 italic">{pets.find(p => p.name === selectedPet)?.weight}</span>
                                            </div>
                                            <div className="bg-zinc-50 rounded-[32px] p-6 border border-zinc-100">
                                                <span className="block text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">Gender</span>
                                                <span className="text-sm font-black text-zinc-900 italic">{pets.find(p => p.name === selectedPet)?.gender}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ACTION CARDS & HISTORY */}
                                <div className="xl:col-span-8 space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-white p-10 rounded-[48px] border border-zinc-100 shadow-xl shadow-zinc-500/5 flex items-center gap-8 group hover:border-[#FF7B54]/20 transition-all">
                                            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center border border-rose-100 shrink-0 group-hover:scale-110 transition-transform">
                                                <Syringe size={28} />
                                            </div>
                                            <div>
                                                <span className="block text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Vaccination</span>
                                                <h4 className="text-xl font-black text-zinc-900 tracking-tight italic">Rabies Booster</h4>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-rose-500 mt-1">Due in 14 days</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-10 rounded-[48px] border border-zinc-100 shadow-xl shadow-zinc-500/5 flex items-center gap-8 group hover:border-indigo-600/20 transition-all">
                                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center border border-indigo-100 shrink-0 group-hover:scale-110 transition-transform">
                                                <Calendar size={28} />
                                            </div>
                                            <div>
                                                <span className="block text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Grooming</span>
                                                <h4 className="text-xl font-black text-zinc-900 tracking-tight italic">Spa Day</h4>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300 mt-1">Oct 24th, 10 AM</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* MEDICAL HISTORY */}
                                    <div className="bg-white rounded-[56px] border border-zinc-100 shadow-[0_50px_100px_rgba(0,0,0,0.05)] overflow-hidden">
                                        <div className="px-10 py-8 border-b border-zinc-50 flex justify-between items-center bg-zinc-50/10">
                                            <div className="flex items-center gap-3 italic">
                                                <Clipboard size={22} className="text-[#FF7B54]" />
                                                <h3 className="text-2xl font-black text-zinc-900 tracking-tighter">Medical History</h3>
                                            </div>
                                            <button className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#FF7B54] transition-colors">Download PDF</button>
                                        </div>
                                        
                                        <div className="p-10 space-y-6">
                                            {[
                                                { date: 'Aug 12', title: 'Annual Checkup', provider: 'Vet: Dr. Smith • General' },
                                                { date: 'May 04', title: 'Deworming', provider: 'Vet: Nurse Joy • Vaccine' }
                                            ].map((item, i) => (
                                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-zinc-50/50 rounded-[32px] border border-zinc-100 group hover:border-emerald-500 transition-all">
                                                    <div className="flex items-center gap-8 mb-4 md:mb-0">
                                                        <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center shadow-sm border border-zinc-100">
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{item.date.split(' ')[0]}</span>
                                                            <span className="text-lg font-black text-zinc-900 italic leading-none">{item.date.split(' ')[1]}</span>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-black text-zinc-900 text-lg italic tracking-tight">{item.title}</h5>
                                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{item.provider}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                                            <CheckCircle size={10} /> Completed
                                                        </span>
                                                        <button className="w-12 h-12 bg-white rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-300 group-hover:text-emerald-500 transition-all shadow-sm">
                                                            <ChevronRight size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    {activeTab === 'Profile Settings' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Profile Identity Component */}
                            <div className="lg:col-span-5 space-y-8">
                                <section className="bg-white rounded-[48px] p-10 border border-zinc-100 shadow-[0_30px_60px_rgba(0,0,0,0.03)] h-full">
                                    <div className="text-center mb-10">
                                        <div className="relative inline-block group">
                                            <div className="w-40 h-40 bg-[#FFF4F0] rounded-[48px] p-1 overflow-hidden border-2 border-zinc-50 border-dashed hover:border-[#FF7B54] transition-colors">
                                                {profileData.image ? (
                                                    <img src={profileData.image} className="w-full h-full object-cover rounded-[40px]" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#FF7B54]">
                                                        <UserIcon size={48} />
                                                    </div>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#FF7B54] text-white rounded-2xl flex items-center justify-center shadow-xl shadow-[#FF7B54]/20 border-4 border-white hover:scale-110 transition-all"
                                            >
                                                <Camera size={20} />
                                            </button>
                                            <input 
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </div>
                                        <h3 className="text-2xl font-black text-zinc-900 tracking-tighter italic mt-6">Display Identity</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#FF7B54] mt-1">This is how the fleet sees you.</p>
                                    </div>

                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div className="space-y-1.5 px-1">
                                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                                            <div className="relative">
                                                <UserIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
                                                <input 
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-3xl py-5 pl-14 pr-6 text-sm font-black text-zinc-900 focus:outline-none focus:ring-4 focus:ring-[#FF7B54]/5 focus:border-[#FF7B54] transition-all"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 px-1">
                                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Avatar Link (Photo URL)</label>
                                            <div className="relative">
                                                <ArrowRight size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
                                                <input 
                                                    type="text"
                                                    value={profileData.image}
                                                    onChange={(e) => setProfileData({ ...profileData, image: e.target.value })}
                                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-3xl py-5 pl-14 pr-6 text-sm font-black text-zinc-900 focus:outline-none focus:ring-4 focus:ring-[#FF7B54]/5 focus:border-[#FF7B54] transition-all"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={updating}
                                            className="w-full bg-zinc-900 text-white rounded-[32px] py-5 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all disabled:opacity-50"
                                        >
                                            <Save size={18} /> {updating ? 'Syncing...' : 'Sync Identity'}
                                        </button>
                                    </form>
                                </section>
                            </div>

                            {/* Credential Shield Component */}
                            <div className="lg:col-span-7">
                                <section className="bg-white rounded-[48px] p-10 border border-zinc-100 shadow-[0_30px_60px_rgba(0,0,0,0.03)] h-full">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-16 h-16 bg-zinc-900 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-zinc-900/10">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-zinc-900 tracking-tighter italic">Credential Shield</h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#FF7B54]">Secure credential rotation node.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2 space-y-1.5 px-1">
                                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Identity Secret (Current Password)</label>
                                            <div className="relative">
                                                <Key size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
                                                <input 
                                                    type={passwordState.showCurrent ? "text" : "password"}
                                                    value={passwordState.current}
                                                    onChange={(e) => setPasswordState({ ...passwordState, current: e.target.value })}
                                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-3xl py-5 pl-14 pr-14 text-sm font-black text-zinc-900 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setPasswordState({ ...passwordState, showCurrent: !passwordState.showCurrent })}
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-rose-500 transition-colors"
                                                >
                                                    {passwordState.showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 px-1">
                                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">New Node Key</label>
                                            <div className="relative">
                                                <LockIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
                                                <input 
                                                    type={passwordState.showNew ? "text" : "password"}
                                                    value={passwordState.new}
                                                    onChange={(e) => setPasswordState({ ...passwordState, new: e.target.value })}
                                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-3xl py-5 pl-14 pr-14 text-sm font-black text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setPasswordState({ ...passwordState, showNew: !passwordState.showNew })}
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-indigo-600 transition-colors"
                                                >
                                                    {passwordState.showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 px-1">
                                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Confirm Node Key</label>
                                            <div className="relative">
                                                <LockIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
                                                <input 
                                                    type={passwordState.showNew ? "text" : "password"}
                                                    value={passwordState.confirm}
                                                    onChange={(e) => setPasswordState({ ...passwordState, confirm: e.target.value })}
                                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-3xl py-5 pl-14 pr-14 text-sm font-black text-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 pt-4">
                                            <div className="flex flex-col gap-4">
                                                <button 
                                                    type="submit"
                                                    disabled={updating}
                                                    className="w-full bg-indigo-600 text-white rounded-[32px] py-6 font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                                                >
                                                    Rotate Security Credentials
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => toast.error('Check your registered email for reset instructions.')}
                                                    className="text-[9px] font-black uppercase tracking-widest text-[#FF7B54] hover:text-[#e66c4a] transition-colors"
                                                >
                                                    Forgot Node Keychain Access?
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </section>
                            </div>
                        </div>
                    )}


                    {(activeTab === 'Appointments' || activeTab === 'Alerts') && (
                        <div className="bg-white rounded-[60px] border border-zinc-100 shadow-2xl p-32 text-center">
                            <Activity size={64} className="mx-auto text-zinc-50 mb-8 animate-pulse" />
                            <h3 className="text-4xl font-black text-zinc-900 tracking-tighter italic mb-4">{activeTab} Node Offline</h3>
                            <p className="text-zinc-400 font-bold text-lg max-w-md mx-auto">This intelligence module is currently being provisioned for your elite pet care experience.</p>
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
