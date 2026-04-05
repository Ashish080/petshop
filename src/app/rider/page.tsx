import Link from 'next/link';
import { Package, Truck, ChevronRight, CheckCircle, Clock, MapPin, Search } from 'lucide-react';
import { auth } from '@/auth';
import { cookies } from 'next/headers';

async function getOrders(status?: string) {
    const cookieStore = await cookies();
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/rider/orders${status ? `?status=${status}` : ''}`, { 
            cache: 'no-store',
            headers: {
                Cookie: cookieStore.toString(),
            }
        });
        if (!res.ok) return [];
        const result = await res.json();
        return result.data || [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function getAvailableOrders() {
    const cookieStore = await cookies();
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/rider/orders?status=available`, { 
            cache: 'no-store',
            headers: {
                Cookie: cookieStore.toString(),
            }
        });
        if (!res.ok) return [];
        const result = await res.json();
        return result.data || [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

export default async function RiderDashboard() {
    const session = await auth();
    const [myOrders, availableOrders] = await Promise.all([
        getOrders(),
        getAvailableOrders()
    ]);

    const activeOrders = myOrders.filter((o: any) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');
    const pastOrders = myOrders.filter((o: any) => o.orderStatus === 'delivered');

    return (
        <div className="space-y-10 py-2">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Today's Missions</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose mt-1">{new Date().toLocaleDateString(undefined, {weekday: 'long', month: 'short', day: 'numeric'})}</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-2xl shadow-indigo-200 group active:scale-95 transition-transform overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="mb-4 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-sm relative z-10">
                        <Truck size={24} />
                    </div>
                    <span className="block text-3xl font-black relative z-10">{activeOrders.length}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100 relative z-10">Active Tasks</span>
                </div>
                <div className="bg-white rounded-[32px] p-6 text-slate-900 border border-slate-100 shadow-xl shadow-slate-200/20 group active:scale-95 transition-transform overflow-hidden relative">
                    <div className="mb-4 w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-50">
                        <CheckCircle size={24} />
                    </div>
                    <span className="block text-3xl font-black">{pastOrders.length}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Done</span>
                    <div className="absolute top-0 right-0 p-2 opacity-5 text-emerald-600"><CheckCircle size={48} /></div>
                </div>
            </div>

            {/* Availability */}
            {availableOrders.length > 0 && (
                <section>
                    <div className="flex justify-between items-center mb-6 px-1">
                        <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                             <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
                             Open Assignments
                        </h2>
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">New available</span>
                    </div>
                    <div className="space-y-4">
                        {availableOrders.map((order: any) => (
                            <Link href={`/rider/orders/${order._id}`} key={order._id} className="block group">
                                <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-xl shadow-slate-200/10 hover:border-indigo-600 transition-all flex justify-between items-center group-active:scale-[0.98]">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">₹ {order.total}</span>
                                            <span className="text-[10px] font-bold text-slate-300"># {order.orderNumber.slice(-8)}</span>
                                        </div>
                                        <h3 className="font-black text-slate-900 truncate pr-4">{order.items[0]?.name}{order.items.length > 1 ? ` +${order.items.length-1}` : ''}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* My Active Tasks */}
            <section>
                <div className="flex justify-between items-center mb-6 px-1">
                    <h2 className="text-xl font-black tracking-tight text-slate-900">Your Pipeline</h2>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeOrders.length} In Progress</span>
                </div>
                
                {activeOrders.length > 0 ? (
                    <div className="space-y-4">
                        {activeOrders.map((order: any) => (
                            <Link href={`/rider/orders/${order._id}`} key={order._id} className="block group">
                                <div className="bg-white rounded-[32px] p-6 border-2 border-slate-100 shadow-2xl shadow-indigo-500/5 hover:border-indigo-600 transition-all group-active:scale-[0.98] overflow-hidden relative">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-slate-50 rounded-[22px] p-2 border border-slate-100 relative group-hover:scale-105 transition-transform">
                                            <img src={order.items[0]?.image || 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=200&auto=format&fit=crop'} alt="item" className="w-full h-full object-cover rounded-xl" />
                                            {order.orderStatus === 'picked' && <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-100"></div>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{order.orderStatus}</span>
                                                <span className="text-sm font-black text-slate-900">₹ {order.total}</span>
                                            </div>
                                            <h3 className="font-black text-slate-900 mt-1">{order.user.name || 'Anonymous User'}</h3>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 group-hover:text-indigo-600 transition-colors">
                                                <MapPin size={10} className="text-indigo-600" />
                                                View Task Details
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-3 opacity-[0.03] text-indigo-900 pointer-events-none group-hover:translate-x-2 transition-transform"><Truck size={96} /></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200 shadow-inner">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100 overflow-hidden relative">
                             <Clock size={32} className="text-slate-300 relative z-10" />
                             <div className="absolute inset-0 bg-slate-200/30 -translate-y-full group-hover:translate-y-0 transition-transform"></div>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Rest Phase</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] max-w-[180px] mx-auto leading-relaxed">No active missions detected in your sector.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
