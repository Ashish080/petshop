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
import { useOrderStream } from '@/hooks/useOrderStream';

function LiveOrderTracker({ order }: { order: any }) {
    const [status, setStatus] = useState(order.orderStatus);
    
    useOrderStream({
        orderId: order._id,
        onUpdate: (data) => {
            if (data.orderStatus) setStatus(data.orderStatus);
        }
    });

    const getStatusMessage = (s: string) => {
        switch(s) {
            case 'pending': return 'Preparing your pet\'s treats...';
            case 'confirmed': return 'Mission confirmed. Dispatching soon.';
            case 'accepted': return 'Rider assigned to your mission.';
            case 'picked': return 'Package secured. Heading your way.';
            case 'out-for-delivery': return 'Scout is right around the corner!';
            default: return 'Tracking active mission...';
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand text-white p-8 rounded-[--radius-3xl] shadow-xl shadow-brand/20 relative overflow-hidden mb-12 group"
        >
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                <Truck size={120} />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                        <Activity size={16} />
                    </div>
                    <span className="text-overline tracking-[0.2em] opacity-80">Live Mission Tracking</span>
                </div>
                <h3 className="text-h3 font-black tracking-tight mb-2 italic">#{order.orderNumber}</h3>
                <p className="text-body-lg font-bold opacity-90 mb-8">{getStatusMessage(status)}</p>
                
                <Link href="/orders">
                    <button className="bg-white text-brand px-8 py-3 rounded-[--radius-xl] font-black text-label-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        View Live Map <ChevronRight size={16} />
                    </button>
                </Link>
            </div>
            {/* Ambient Logistics Glow */}
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </motion.div>
    );
}

export default function UserDashboardClient() {
  const { data: session, update } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('My Pets');
  const [selectedPet, setSelectedPet] = useState('Bella');

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.orderStatus));
  const primaryActive = activeOrders[0];

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-bg-elevated border border-border rounded-[--radius-2xl] flex items-center justify-center animate-pulse shadow-md">
                <Heart size={32} className="text-brand fill-brand" />
            </div>
            <p className="text-overline opacity-70">Opening Passport...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* SIDEBAR */}
      <aside className="w-80 border-r border-border hidden lg:flex flex-col p-8 bg-bg-secondary/50 backdrop-blur-xl shrink-0">
        <div className="bg-brand-muted p-6 rounded-[--radius-2xl] mb-12 border border-border flex items-center gap-4">
            <div className="w-12 h-12 bg-bg-elevated rounded-[--radius-lg] flex items-center justify-center text-brand shadow-sm relative overflow-hidden">
                {profileData.image ? (
                    <img src={profileData.image} className="w-full h-full object-cover" />
                ) : (
                    <UserIcon size={24} />
                )}
            </div>
            <div>
                <h4 className="font-bold text-label-lg text-text-primary tracking-tight truncate w-32">{profileData.name || 'Valued Guest'}</h4>
                <p className="text-overline text-brand opacity-80">Pet Owner</p>
            </div>
        </div>

        <nav className="flex-1 space-y-4">
            <p className="text-overline mb-6 px-4">My Center</p>
            {menuItems.map((item) => {
                const isOrders = item.label === 'My Orders';
                return (
                <button 
                    key={item.label}
                    onClick={() => isOrders ? (window.location.href = '/orders') : setActiveTab(item.label)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-[--radius-xl] transition-all group ${activeTab === item.label ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-text-secondary hover:bg-bg-tertiary'}`}
                >
                    <div className="flex items-center gap-4">
                        <item.icon size={20} className={activeTab === item.label ? 'stroke-[3]' : 'group-hover:scale-110 transition-transform'} />
                        <span className="text-label-sm font-bold uppercase tracking-wider">{item.label}</span>
                    </div>
                    {item.badge && (
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${activeTab === item.label ? 'bg-white text-brand' : 'bg-info text-white'}`}>
                            {item.badge}
                        </span>
                    )}
                </button>
                );
            })}
        </nav>

        <button 
            onClick={() => signOut()}
            className="flex items-center gap-4 px-6 py-4 text-danger font-bold text-label-sm uppercase tracking-wider hover:bg-danger/10 rounded-[--radius-xl] transition-all"
        >
            <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-16 max-w-7xl mx-auto overflow-y-auto custom-scrollbar">
        <header className="flex justify-between items-end mb-12">
            <div>
                <h1 className="text-display min-h-[1.5em] text-text-primary tracking-tighter italic mb-2">
                    {activeTab === 'Profile Settings' ? 'Security & Identity' : 'My Pets Passport'}
                </h1>
                <p className="text-text-secondary font-semibold text-lg">
                    {activeTab === 'Profile Settings' ? 'Manage your secure mission credentials.' : 'Welcome back to the fur-mily portal.'}
                </p>
            </div>
            {activeTab === 'My Pets' && (
                <button className="bg-brand text-white rounded-[--radius-xl] px-8 py-4 font-bold text-label-sm uppercase tracking-wider flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-md shadow-brand/20">
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
                                        className={`px-8 py-3 rounded-[--radius-xl] flex items-center gap-3 transition-all border ${selectedPet === pet.name ? 'bg-info text-white border-info shadow-md shadow-info/20' : 'bg-bg-elevated text-text-secondary border-border hover:bg-bg-secondary'}`}
                                    >
                                        <img src={pet.image} className="w-6 h-6 rounded-[--radius-sm] object-cover" />
                                        <span className="text-label-sm font-bold uppercase tracking-wider">{pet.name}</span>
                                    </button>
                                ))}
                                <button className="w-12 h-12 rounded-[--radius-xl] border-2 border-dashed border-border flex items-center justify-center text-text-tertiary hover:border-brand hover:text-brand transition-all">
                                    <Plus size={20} />
                                </button>
                            </div>

                            {primaryActive && <LiveOrderTracker order={primaryActive} />}

                            <section className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                                {/* PROFILE CARD */}
                                <div className="xl:col-span-4 space-y-8">
                                    <div className="bg-bg-elevated rounded-[--radius-3xl] p-12 border border-border shadow-sm text-center relative overflow-hidden group">
                                        <div className="w-48 h-48 bg-brand-muted rounded-[--radius-3xl] mx-auto mb-8 p-1.5 border border-brand/20 relative group-hover:scale-105 transition-transform duration-700">
                                            <img 
                                                src={pets.find(p => p.name === selectedPet)?.image} 
                                                className="w-full h-full object-cover rounded-[--radius-2xl]" 
                                            />
                                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-bg-elevated px-4 py-2 rounded-full border border-border shadow-sm text-brand">
                                                <Heart size={14} fill="currentColor" />
                                            </div>
                                        </div>
                                        
                                        <h2 className="text-h2 font-bold text-text-primary tracking-tighter mb-2 italic">{selectedPet}</h2>
                                        <p className="text-overline text-brand mb-8">{pets.find(p => p.name === selectedPet)?.breed} • {pets.find(p => p.name === selectedPet)?.age}</p>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-bg-secondary rounded-[--radius-xl] p-6 border border-border">
                                                <span className="text-overline block mb-1">Weight</span>
                                                <span className="text-label-lg font-bold text-text-primary italic">{pets.find(p => p.name === selectedPet)?.weight}</span>
                                            </div>
                                            <div className="bg-bg-secondary rounded-[--radius-xl] p-6 border border-border">
                                                <span className="text-overline block mb-1">Gender</span>
                                                <span className="text-label-lg font-bold text-text-primary italic">{pets.find(p => p.name === selectedPet)?.gender}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ACTION CARDS & HISTORY */}
                                <div className="xl:col-span-8 space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-bg-elevated p-10 rounded-[--radius-2xl] border border-border shadow-sm flex items-center gap-8 group hover:border-danger hover:shadow-md transition-all">
                                            <div className="w-16 h-16 bg-danger-muted text-danger rounded-[--radius-xl] flex items-center justify-center border border-danger/20 shrink-0 group-hover:scale-110 transition-transform">
                                                <Syringe size={28} />
                                            </div>
                                            <div>
                                                <span className="text-overline block mb-1">Vaccination</span>
                                                <h4 className="text-h4 font-bold text-text-primary tracking-tight italic">Rabies Booster</h4>
                                                <p className="text-overline text-danger mt-1">Due in 14 days</p>
                                            </div>
                                        </div>
                                        <div className="bg-bg-elevated p-10 rounded-[--radius-2xl] border border-border shadow-sm flex items-center gap-8 group hover:border-info hover:shadow-md transition-all">
                                            <div className="w-16 h-16 bg-info-muted text-info rounded-[--radius-xl] flex items-center justify-center border border-info/20 shrink-0 group-hover:scale-110 transition-transform">
                                                <Calendar size={28} />
                                            </div>
                                            <div>
                                                <span className="text-overline block mb-1">Grooming</span>
                                                <h4 className="text-h4 font-bold text-text-primary tracking-tight italic">Spa Day</h4>
                                                <p className="text-overline text-text-secondary mt-1">Oct 24th, 10 AM</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* MEDICAL HISTORY */}
                                    <div className="bg-bg-elevated rounded-[--radius-3xl] border border-border shadow-sm overflow-hidden">
                                        <div className="px-10 py-8 border-b border-border flex justify-between items-center bg-bg-secondary">
                                            <div className="flex items-center gap-3 italic">
                                                <Clipboard size={22} className="text-brand" />
                                                <h3 className="text-h3 font-bold text-text-primary tracking-tighter">Medical History</h3>
                                            </div>
                                            <button className="text-overline hover:text-brand transition-colors">Download PDF</button>
                                        </div>
                                        
                                        <div className="p-10 space-y-6">
                                            {[
                                                { date: 'Aug 12', title: 'Annual Checkup', provider: 'Vet: Dr. Smith • General' },
                                                { date: 'May 04', title: 'Deworming', provider: 'Vet: Nurse Joy • Vaccine' }
                                            ].map((item, i) => (
                                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-bg-secondary rounded-[--radius-2xl] border border-border group hover:border-success transition-all">
                                                    <div className="flex items-center gap-8 mb-4 md:mb-0">
                                                        <div className="w-14 h-14 bg-bg-elevated rounded-[--radius-lg] flex flex-col items-center justify-center shadow-sm border border-border">
                                                            <span className="text-[9px] font-bold uppercase tracking-wider text-text-tertiary">{item.date.split(' ')[0]}</span>
                                                            <span className="text-label-lg font-bold text-text-primary italic leading-none mt-0.5">{item.date.split(' ')[1]}</span>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-text-primary text-lg italic tracking-tight">{item.title}</h5>
                                                            <p className="text-overline mt-1">{item.provider}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-success-muted text-success rounded-full text-[9px] font-bold uppercase tracking-wider border border-success/20">
                                                            <CheckCircle size={10} /> Completed
                                                        </span>
                                                        <button className="w-12 h-12 bg-bg-elevated rounded-[--radius-lg] border border-border flex items-center justify-center text-text-tertiary group-hover:text-success transition-all shadow-sm">
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
                                <section className="bg-bg-elevated rounded-[--radius-3xl] p-10 border border-border shadow-sm h-full">
                                    <div className="text-center mb-10">
                                        <div className="relative inline-block group">
                                            <div className="w-40 h-40 bg-brand-muted rounded-[--radius-3xl] p-1 overflow-hidden border-2 border-dashed border-border hover:border-brand transition-colors">
                                                {profileData.image ? (
                                                    <img src={profileData.image} className="w-full h-full object-cover rounded-[--radius-2xl]" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-brand">
                                                        <UserIcon size={48} />
                                                    </div>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute -bottom-2 -right-2 w-12 h-12 bg-brand text-white rounded-[--radius-lg] flex items-center justify-center shadow-lg border-4 border-bg-elevated hover:scale-110 transition-all"
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
                                        <h3 className="text-h3 font-bold text-text-primary tracking-tighter italic mt-6">Display Identity</h3>
                                        <p className="text-overline text-brand mt-1">This is how the fleet sees you.</p>
                                    </div>

                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div className="space-y-1.5 px-1">
                                            <label className="text-overline ml-1">Full Legal Name</label>
                                            <div className="relative">
                                                <UserIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-disabled" />
                                                <input 
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="w-full bg-bg-secondary border border-border rounded-[--radius-xl] py-5 pl-14 pr-6 text-body-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 px-1">
                                            <label className="text-overline ml-1">Avatar Link (Photo URL)</label>
                                            <div className="relative">
                                                <ArrowRight size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-disabled" />
                                                <input 
                                                    type="text"
                                                    value={profileData.image}
                                                    onChange={(e) => setProfileData({ ...profileData, image: e.target.value })}
                                                    className="w-full bg-bg-secondary border border-border rounded-[--radius-xl] py-5 pl-14 pr-6 text-body-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={updating}
                                            className="w-full bg-text-primary text-text-inverse rounded-[--radius-xl] py-5 font-bold text-label-sm uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-text-secondary transition-all disabled:opacity-50"
                                        >
                                            <Save size={18} /> {updating ? 'Syncing...' : 'Sync Identity'}
                                        </button>
                                    </form>
                                </section>
                            </div>

                            {/* Credential Shield Component */}
                            <div className="lg:col-span-7">
                                <section className="bg-bg-elevated rounded-[--radius-3xl] p-10 border border-border shadow-sm h-full">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-16 h-16 bg-text-primary text-text-inverse rounded-[--radius-xl] flex items-center justify-center shadow-lg">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-h3 font-bold text-text-primary tracking-tighter italic">Credential Shield</h3>
                                            <p className="text-overline text-brand">Secure credential rotation node.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2 space-y-1.5 px-1">
                                            <label className="text-overline ml-1">Identity Secret (Current Password)</label>
                                            <div className="relative">
                                                <Key size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-disabled" />
                                                <input 
                                                    type={passwordState.showCurrent ? "text" : "password"}
                                                    value={passwordState.current}
                                                    onChange={(e) => setPasswordState({ ...passwordState, current: e.target.value })}
                                                    className="w-full bg-bg-secondary border border-border rounded-[--radius-xl] py-5 pl-14 pr-14 text-body-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-danger/10 focus:border-danger transition-all"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setPasswordState({ ...passwordState, showCurrent: !passwordState.showCurrent })}
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-text-disabled hover:text-danger transition-colors"
                                                >
                                                    {passwordState.showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 px-1">
                                            <label className="text-overline ml-1">New Node Key</label>
                                            <div className="relative">
                                                <LockIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-disabled" />
                                                <input 
                                                    type={passwordState.showNew ? "text" : "password"}
                                                    value={passwordState.new}
                                                    onChange={(e) => setPasswordState({ ...passwordState, new: e.target.value })}
                                                    className="w-full bg-bg-secondary border border-border rounded-[--radius-xl] py-5 pl-14 pr-14 text-body-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-info/10 focus:border-info transition-all"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setPasswordState({ ...passwordState, showNew: !passwordState.showNew })}
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-text-disabled hover:text-info transition-colors"
                                                >
                                                    {passwordState.showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 px-1">
                                            <label className="text-overline ml-1">Confirm Node Key</label>
                                            <div className="relative">
                                                <LockIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-disabled" />
                                                <input 
                                                    type={passwordState.showNew ? "text" : "password"}
                                                    value={passwordState.confirm}
                                                    onChange={(e) => setPasswordState({ ...passwordState, confirm: e.target.value })}
                                                    className="w-full bg-bg-secondary border border-border rounded-[--radius-xl] py-5 pl-14 pr-14 text-body-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-info/10 focus:border-info transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 pt-4">
                                            <div className="flex flex-col gap-4">
                                                <button 
                                                    type="submit"
                                                    disabled={updating}
                                                    className="w-full bg-info text-white rounded-[--radius-xl] py-6 font-bold text-label-sm uppercase tracking-wider shadow-md hover:bg-info-hover hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                                                >
                                                    Rotate Security Credentials
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => toast.error('Check your registered email for reset instructions.')}
                                                    className="text-label-sm font-bold uppercase tracking-wider text-brand hover:text-brand-hover transition-colors"
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
                        <div className="bg-bg-elevated rounded-[--radius-3xl] border border-border shadow-sm p-32 text-center">
                            <Activity size={64} className="mx-auto text-text-disabled mb-8 animate-pulse" />
                            <h3 className="text-h2 font-bold text-text-primary tracking-tighter italic mb-4">{activeTab} Node Offline</h3>
                            <p className="text-text-secondary font-semibold text-lg max-w-md mx-auto">This intelligence module is currently being provisioned for your elite pet care experience.</p>
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
