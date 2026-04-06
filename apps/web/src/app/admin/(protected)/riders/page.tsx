'use client';
import { useState, useEffect } from 'react';
import { Truck, MapPin, Shield, Star, Search, Clock, Activity } from 'lucide-react';

export default function RiderManagementPage() {
  const [riders, setRiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/riders')
      .then(res => res.json())
      .then(data => {
        if (data.success) setRiders(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-12 space-y-12">
      <header>
        <h1 className="text-5xl font-black text-rose-500 tracking-tighter italic">Fleet Operations</h1>
        <p className="text-gray-400 font-bold text-lg mt-2">Oversee mission critical rider performance and location metrics across the network. 🛵🛰️</p>
      </header>

      <div className="bg-white rounded-[48px] border-2 border-gray-50 shadow-2xl shadow-rose-500/5 overflow-hidden">
        <div className="p-8 border-b-2 border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border-2 border-gray-50 w-96">
            <Search size={18} className="text-gray-400" />
            <input type="text" placeholder="Search mission nodes..." className="bg-transparent outline-none text-xs font-black uppercase tracking-widest flex-1" />
          </div>
          <button className="px-8 py-3 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all">
             Global Sync
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Tactical Unit</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Communication</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Mission Status</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Node Metrics</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="px-10 py-20 text-center text-gray-400 font-bold italic uppercase tracking-widest">Decoding Fleet Telemetrics...</td></tr>
              ) : riders.map((rider) => (
                <tr key={rider._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center border-2 border-rose-100 shadow-sm group-hover:scale-110 transition-transform">
                        <Truck size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 tracking-tight italic text-lg">{rider.name}</h4>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#EB4D4B]">Deployment Ready</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <MapPin size={12} className="text-gray-400" /> {rider.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Clock size={12} className="text-gray-400" /> Last Seen: Just Now
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 bg-emerald-50 text-emerald-600 border-emerald-100">
                      Standby
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-amber-400" fill="#FBC531" />
                        <span className="text-sm font-black text-slate-800 italic">4.9</span>
                      </div>
                      <div className="h-6 w-[2px] bg-gray-100" />
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-indigo-400" />
                        <span className="text-sm font-black text-slate-800 italic">12 Ops</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
