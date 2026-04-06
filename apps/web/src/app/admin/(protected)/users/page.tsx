'use client';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, Search } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (data.success) setUsers(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-12 space-y-12">
      <header>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">User Management</h1>
        <p className="text-gray-400 font-bold text-lg mt-2">Manage customer identities and access control protocols.</p>
      </header>

      <div className="bg-white rounded-[48px] border-2 border-gray-50 shadow-2xl shadow-indigo-500/5 overflow-hidden">
        <div className="p-8 border-b-2 border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border-2 border-gray-50 w-96">
            <Search size={18} className="text-gray-400" />
            <input type="text" placeholder="Search identities..." className="bg-transparent outline-none text-xs font-black uppercase tracking-widest flex-1" />
          </div>
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">
            Audit Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Identity</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Communication</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Level</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Node Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="px-10 py-20 text-center text-gray-400 font-bold">Synchronizing Control Panel...</td></tr>
              ) : users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-indigo-600 border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                        <User size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 tracking-tight italic text-lg">{user.name}</h4>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">ID: {user._id.slice(-8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Mail size={14} className="text-gray-400" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Phone size={14} className="text-gray-400" /> {user.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${user.role === 'admin' ? 'bg-rose-50 text-rose-500 border-rose-100' : user.role === 'rider' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Live Connection</span>
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
