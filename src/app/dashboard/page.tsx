"use client";

import { themeConfig } from '@/config/theme';
import { brandConfig } from '@/config/brand';
import Image from 'next/image';
import { Activity, Calendar, Syringe, Plus, Settings, User, Bell, Search, Heart, ChevronRight, PawPrint, ShoppingBag, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock Data for demonstration
const mockPets = [
    {
        id: "pet-1",
        name: "Bella",
        breed: "Golden Retriever",
        age: "2 Years",
        weight: "24.5 kg",
        gender: "Female",
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop",
        records: [
            { date: "Aug 12, 2025", title: "Annual Checkup", Vet: "Dr. Smith", status: "Completed", type: "General" },
            { date: "May 04, 2025", title: "Deworming", Vet: "Nurse Joy", status: "Completed", type: "Vaccine" }
        ]
    },
    {
        id: "pet-2",
        name: "Max",
        breed: "Persian Cat",
        age: "1 Year",
        weight: "4.2 kg",
        gender: "Male",
        image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=600&auto=format&fit=crop",
        records: [
            { date: "Oct 01, 2025", title: "Skin Consultation", Vet: "Dr. Gupta", status: "Scheduled", type: "Specialist" }
        ]
    }
];

export default function DashboardPage() {
    // Initializing state with empty array for a "Real New User" experience
    const [petList, setPetList] = useState<any[]>([]);
    const [activePetIndex, setActivePetIndex] = useState(0);
    const [userName, setUserName] = useState('Valued Guest');
    const router = useRouter();

    // Load user and pet data from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedEmail = localStorage.getItem('userEmail');
            if (!savedEmail) {
                // Not logged in -> Redirect to login
                router.push('/login');
                return;
            }

            const parts = savedEmail.split('@')[0].split('.');
            let namePart = 'User';
            if (parts.length > 0) {
                namePart = parts[parts.length - 1];
            }
            const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
            setUserName(formattedName);

            // Load PURCHASED pets for THIS USER
            const myPetsRaw = localStorage.getItem(`myPets_${savedEmail}`);
            if (myPetsRaw) {
                setPetList(JSON.parse(myPetsRaw));
            }
        }
    }, [router]);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userEmail');
            // We keep myPets so if they log in again they see them, but they are NOT accessible without login
            window.location.href = '/';
        }
    };

    const activePet = petList[activePetIndex];

    return (
        <div className="min-h-screen bg-bg-page flex flex-col md:flex-row transition-colors duration-300 font-outfit">
            {/* Sidebar */}
            <aside className="w-full md:w-80 bg-nav-bg border-r border-card-border p-8 flex flex-col gap-10 sticky top-0 md:h-screen shrink-0 overflow-y-auto">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden relative shadow-lg shadow-brand-primary/20 border-2 border-white text-brand-primary flex items-center justify-center bg-white">
                            <User size={30} />
                        </div>
                        <div>
                            <h3 className="font-black text-text-primary text-base leading-none mb-1">{userName}</h3>
                            <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Pet Owner</p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-light px-4 mb-2">My Center</p>
                        <a href="#" className="flex items-center justify-between group px-5 py-4 bg-brand-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/25 transition-all">
                            <div className="flex items-center gap-3">
                                <Activity size={20} /> My Pets
                            </div>
                        </a>
                        {[
                            { icon: Calendar, label: "Appointments" },
                            { icon: ShoppingBag, label: "My Orders" },
                            { icon: Bell, label: "Alerts", badge: "2" },
                            { icon: Settings, label: "Profile Settings" },
                        ].map((item, idx) => (
                            <a key={idx} href="#" className="flex items-center justify-between px-5 py-4 text-text-light hover:text-text-primary hover:bg-brand-primary/5 rounded-2xl font-black text-sm transition-all group">
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} className="group-hover:text-brand-primary transition-colors" /> {item.label}
                                </div>
                                {item.badge && (
                                    <span className="w-5 h-5 flex items-center justify-center bg-secondary text-white text-[10px] rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </a>
                        ))}
                        <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl font-black text-sm transition-all mt-4 border border-transparent hover:border-red-500/20">
                            <LogOut size={20} /> Logout
                        </button>
                    </nav>
                </div>

                {/* Quick Toggle for Demonstration */}
                <div className="mt-auto hidden lg:block">
                    <div className="bg-bg-page p-4 rounded-2xl border border-card-border/50 text-xs font-bold text-text-light">
                        <p className="mb-3 uppercase tracking-wider text-[9px] opacity-70 italic">Dev Control: View States</p>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => setPetList([])} className="w-full py-2 bg-white dark:bg-card-bg border border-card-border rounded-lg hover:border-brand-primary transition-all">Show: No Pets</button>
                            <button onClick={() => setPetList(mockPets)} className="w-full py-2 bg-white dark:bg-card-bg border border-card-border rounded-lg hover:border-brand-primary transition-all">Show: My Pets</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto">
                <header className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-3 tracking-tighter">My Pets Passport</h1>
                        <p className="text-text-light font-medium text-lg max-w-xl">Welcome back to the fur-mily portal.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <button className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-white font-black rounded-2xl shadow-xl shadow-brand-primary/25 hover:scale-105 transition-all">
                            <Plus size={20} strokeWidth={3} />
                            Add New Pet
                        </button>
                    </div>
                </header>

                {petList.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-nav-bg rounded-[48px] border-2 border-dashed border-card-border text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-40 h-40 bg-brand-primary/5 rounded-full flex items-center justify-center mb-8 relative">
                            <PawPrint size={80} className="text-brand-primary opacity-20" />
                            <Search size={32} className="absolute text-brand-primary" />
                        </div>
                        <h2 className="text-3xl font-black text-text-primary mb-4">No Pets Found Yet!</h2>
                        <p className="text-text-light font-medium max-w-sm mb-10 text-lg">
                            It looks like you haven't added any furry friends to your passport system. Ready to find a companion?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/pets" className="px-10 py-5 bg-secondary text-white font-black rounded-2xl shadow-xl shadow-secondary/20 hover:-translate-y-1 transition-all">
                                Meet Our Pets
                            </Link>
                            <button onClick={() => setPetList(mockPets)} className="px-10 py-5 border-2 border-card-border text-text-primary font-black rounded-2xl hover:bg-brand-primary/5 transition-all">
                                Add Manually
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ACTIVE DASHBOARD */
                    <div className="space-y-10">
                        {/* Pet Switcher (If multiple pets) */}
                        {petList.length > 1 && (
                            <div className="flex gap-4 p-2 bg-nav-bg/50 border border-card-border rounded-3xl w-fit">
                                {petList.map((pet, idx) => (
                                    <button
                                        key={pet.id}
                                        onClick={() => setActivePetIndex(idx)}
                                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm transition-all ${activePetIndex === idx ? 'bg-secondary text-white shadow-lg' : 'text-text-light hover:bg-card-bg'}`}
                                    >
                                        <div className="w-6 h-6 rounded-lg relative overflow-hidden border border-white/20">
                                            <Image src={pet.image} alt={pet.name} fill className="object-cover" />
                                        </div>
                                        {pet.name}
                                    </button>
                                ))}
                                <button className="w-12 h-12 flex items-center justify-center text-text-light hover:text-brand-primary transition-all">
                                    <Plus size={20} />
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12 items-start">
                            {/* Pet Profile Card */}
                            <div className="xl:col-span-1">
                                <div className="bg-nav-bg rounded-[40px] p-10 border border-card-border shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 rounded-bl-[100px] -z-1 transition-all group-hover:scale-110"></div>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-40 h-40 rounded-[48px] overflow-hidden border-8 border-bg-page shadow-2xl relative mb-8 rotate-3 transition-transform group-hover:rotate-0">
                                            <Image src={activePet.image} fill className="object-cover" alt={activePet.name} />
                                        </div>
                                        <h2 className="text-4xl font-black text-text-primary mb-2 line-clamp-1">{activePet.name}</h2>
                                        <p className="text-secondary font-black tracking-tight mb-8">{activePet.breed} • {activePet.age}</p>

                                        <div className="grid grid-cols-2 gap-4 w-full">
                                            <div className="bg-bg-page p-5 rounded-3xl border border-card-border group-hover:bg-brand-primary/5 transition-colors">
                                                <span className="text-[10px] text-text-light font-black uppercase tracking-[0.2em] block mb-2">Weight</span>
                                                <span className="text-xl font-black text-text-primary">{activePet.weight}</span>
                                            </div>
                                            <div className="bg-bg-page p-5 rounded-3xl border border-card-border group-hover:bg-brand-primary/5 transition-colors">
                                                <span className="text-[10px] text-text-light font-black uppercase tracking-[0.2em] block mb-2">Gender</span>
                                                <span className="text-xl font-black text-text-primary">{activePet.gender}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Records & Activity */}
                            <div className="xl:col-span-2 space-y-10">
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="bg-nav-bg p-8 rounded-[32px] border border-card-border flex items-center gap-6 shadow-xl hover:-translate-y-1 transition-all group">
                                        <div className="p-5 rounded-2xl bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-lg">
                                            <Syringe size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-text-light font-black text-[10px] uppercase tracking-[0.2em] mb-1">Vaccination</h3>
                                            <p className="text-xl font-black text-text-primary mb-1">Rabies Booster</p>
                                            <p className="text-xs font-black text-brand-primary/70">Due in 14 days</p>
                                        </div>
                                    </div>
                                    <div className="bg-nav-bg p-8 rounded-[32px] border border-card-border flex items-center gap-6 shadow-xl hover:-translate-y-1 transition-all group">
                                        <div className="p-5 rounded-2xl bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-all shadow-lg">
                                            <Calendar size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-text-light font-black text-[10px] uppercase tracking-[0.2em] mb-1">Grooming</h3>
                                            <p className="text-xl font-black text-text-primary mb-1">Spa Day</p>
                                            <p className="text-xs font-black text-text-light opacity-60 italic whitespace-nowrap">Oct 24th, 10 AM</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-nav-bg rounded-[40px] p-10 border border-card-border shadow-2xl overflow-hidden min-h-[400px]">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-2xl font-black text-text-primary flex items-center gap-3">
                                            <Activity className="text-brand-primary" size={24} />
                                            Medical History
                                        </h3>
                                        <button className="text-[10px] font-black tracking-widest uppercase text-brand-primary hover:underline">Download PDF</button>
                                    </div>

                                    <div className="space-y-4">
                                        {activePet.records?.map((record: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-6 bg-bg-page/50 rounded-3xl border border-card-border/50 hover:bg-brand-primary/5 hover:border-brand-primary/20 transition-all cursor-pointer group">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-white dark:bg-card-bg rounded-2xl flex flex-col items-center justify-center shadow-sm border border-card-border group-hover:scale-110 transition-transform">
                                                        <span className="text-[10px] font-black uppercase tracking-tighter transform translate-y-0.5">{record.date.split(' ')[0]}</span>
                                                        <span className="text-lg font-black leading-none">{record.date.split(' ')[1].replace(',', '')}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-text-primary text-lg leading-tight mb-1">{record.title}</h4>
                                                        <p className="text-xs font-black text-text-light">Vet: {record.Vet} • <span className="text-secondary/80">{record.type}</span></p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="hidden sm:inline-block px-4 py-1.5 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-500/20">
                                                        {record.status}
                                                    </span>
                                                    <ChevronRight className="text-text-light group-hover:translate-x-1 transition-transform" size={20} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
