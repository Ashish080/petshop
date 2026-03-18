import { themeConfig } from '@/config/theme';
import { brandConfig } from '@/config/brand';
import Image from 'next/image';
import { Activity, Calendar, Syringe, Plus, Settings } from 'lucide-react';

export const metadata = { title: "Pet Health Dashboard" };

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden relative">
                        <Image src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" alt="User" fill className="object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">Sarah Jenkins</h3>
                        <p className="text-sm text-gray-500">Premium Member</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-semibold" style={{ color: themeConfig.colors.primary }}>
                        <Activity size={20} /> Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <Calendar size={20} /> Appointments
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <Settings size={20} /> Settings
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-12">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold mb-2" style={{ color: themeConfig.colors.text }}>My Pets Passport</h1>
                        <p className="text-gray-500">Track and manage your furry family's wellness.</p>
                    </div>
                    <button className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white border shadow-sm rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Plus size={18} /> Add Pet
                    </button>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Pet Profile Card */}
                    <div className="xl:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                        <div className="mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl relative mb-6">
                            <Image src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop" auto="format" fill className="object-cover" alt="Bella" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Bella</h2>
                            <p className="text-gray-500 mb-6">Golden Retriever • 2 Years</p>
                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Weight</span>
                                    <span className="font-semibold text-gray-800">24.5 kg</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Gender</span>
                                    <span className="font-semibold text-gray-800">Female</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats & Records */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Status Cards */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="p-4 rounded-xl" style={{ backgroundColor: `${themeConfig.colors.primary}15`, color: themeConfig.colors.primary }}>
                                    <Syringe size={28} />
                                </div>
                                <div>
                                    <h3 className="text-gray-500 font-medium text-sm mb-1">Next Vaccination</h3>
                                    <p className="text-xl font-bold text-gray-800">Rabies Booster</p>
                                    <p className="text-sm font-semibold text-orange-500 mt-2">Due in 14 days</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
                                    <Calendar size={28} />
                                </div>
                                <div>
                                    <h3 className="text-gray-500 font-medium text-sm mb-1">Upcoming Grooming</h3>
                                    <p className="text-xl font-bold text-gray-800">Spa & De-shedding</p>
                                    <p className="text-sm font-semibold text-gray-600 mt-2">Oct 24th, 10:00 AM</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Health Records */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-6 text-gray-800">Health Records</h3>
                            <div className="space-y-6">
                                {[
                                    { date: "Aug 12, 2025", title: "Annual Checkup", Vet: "Dr. Smith", status: "Completed" },
                                    { date: "May 04, 2025", title: "Deworming", Vet: "Nurse Joy", status: "Completed" },
                                    { date: "Jan 18, 2025", title: "Microchip Installed", Vet: "Dr. Smith", status: "Completed" }
                                ].map((record, i) => (
                                    <div key={i} className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-1">{record.title}</h4>
                                            <p className="text-sm text-gray-500">{record.Vet} • {record.date}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                            {record.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
