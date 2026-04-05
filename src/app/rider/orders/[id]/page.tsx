'use client';

import { useState, useTransition, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Phone, MessageSquare, ChevronLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_SEQUENCE = ['placed', 'accepted', 'picked', 'out-for-delivery', 'delivered'];

export default function RiderOrderDetails({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter();
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`); 
      if (!res.ok) throw new Error('Order not found');
      const result = await res.json();
      setOrder(result.data);
    } catch (e) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const nextStatus = (current: string) => {
    const idx = STATUS_SEQUENCE.indexOf(current);
    if (idx < 0 || idx === STATUS_SEQUENCE.length - 1) return null;
    return STATUS_SEQUENCE[idx + 1];
  };

  const updateStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/rider/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success(`Order moved to ${newStatus}`);
      router.refresh();
      fetchOrder();
    } catch (e) {
      toast.error('Could not update status');
    } finally {
      setUpdating(false);
    }
  };

  const acceptOrder = async () => {
    try {
        setUpdating(true);
        const res = await fetch(`/api/rider/orders`, {
          method: 'PATCH',
          body: JSON.stringify({ orderId: id, action: 'accept' }),
          headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error('Failed to accept order');
        toast.success(`Order accepted!`);
        router.refresh();
        fetchOrder();
      } catch (e) {
        toast.error('Order may already be taken');
      } finally {
        setUpdating(false);
      }
  }

  if (loading && !order) return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="w-16 h-16 border-[6px] border-indigo-600 border-t-transparent rounded-full animate-spin shadow-2xl shadow-indigo-100"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ">Establishing Secure Link...</p>
      </div>
  );

  if (!order) return <div className="text-center py-20 bg-white rounded-[40px] m-4 border-2 border-slate-100 shadow-xl font-black text-slate-900">Task Disconnected</div>;

  const currentStatus = order.orderStatus;
  const next = nextStatus(currentStatus);

  return (
    <div className="space-y-8 min-h-screen pb-32">
      <div className="flex items-center gap-2 -ml-3 sticky top-[72px] z-40 py-2">
        <button onClick={() => router.back()} className="p-3 bg-white text-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 hover:text-indigo-600 transition-colors border border-slate-100 flex items-center justify-center active:scale-95">
          <ChevronLeft size={24} />
        </button>
        <span className="bg-white px-5 py-3.5 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 text-[10px] font-black uppercase tracking-widest text-slate-900 flex-1">Mission: #{order.orderNumber.slice(-8)}</span>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-[80px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
                <h1 className="text-3xl font-black text-slate-900 mb-1">{order.user.name || 'Anonymous Platform User'}</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commissionable: <span className="text-indigo-600">₹ {order.total}</span></p>
            </div>
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300"><Clock size={24} /></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
            <a href={`tel:${order.user.phone}`} className="flex-1 py-5 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center gap-2.5 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-100 border border-emerald-100/50 active:scale-95 transition-all">
                <Phone size={18} strokeWidth={3} /> Voice link
            </a>
            <a href={`https://wa.me/${order.user.phone}`} target="_blank" className="flex-1 py-5 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center gap-2.5 font-black text-[10px] uppercase tracking-widest hover:bg-sky-50 hover:text-sky-600 border border-slate-100 active:scale-95 transition-all">
                <MessageSquare size={18} strokeWidth={3} /> Messaging
            </a>
        </div>
      </div>

      {/* Progress Monitor */}
      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-2xl shadow-indigo-500/5 overflow-hidden relative">
        <h3 className="text-lg font-black text-slate-900 mb-10 tracking-tight flex items-center gap-3">
             Logistic Pipeline <div className="h-1 bg-indigo-600 rounded-full flex-1 opacity-10"></div>
        </h3>
        
        <div className="relative pl-10 space-y-12 before:absolute before:left-[13px] before:top-2 before:bottom-2 before:w-[3px] before:bg-slate-100 border-l border-slate-50">
          {STATUS_SEQUENCE.map((s, i) => {
            const currentIdx = STATUS_SEQUENCE.indexOf(currentStatus);
            const thisIdx = STATUS_SEQUENCE.indexOf(s);
            const isCompleted = currentIdx >= thisIdx;
            const isActive = currentStatus === s;
            
            return (
              <div key={s} className="relative group/step">
                <div className={`absolute -left-[38px] top-1 w-6 h-6 rounded-full border-4 bg-white transition-all duration-700 z-10 ${isCompleted ? 'border-indigo-600 bg-indigo-600 shadow-xl shadow-indigo-500/20' : 'border-slate-100'}`}>
                    {isCompleted && <CheckCircle size={10} className="text-white absolute -left-0.5 -top-0.5" />}
                </div>
                {isActive && <div className="absolute -left-[45px] -top-1 w-10 h-10 border-2 border-indigo-600/10 rounded-full animate-ping"></div>}
                
                <div className="flex flex-col">
                   <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isCompleted ? 'text-indigo-600' : 'text-slate-300'}`}>Checkpoint {i+1}</span>
                   <h4 className={`text-md font-black transition-all ${isCompleted ? 'text-slate-900' : 'text-slate-300 opacity-60'}`}>{s.replace('-', ' ')}</h4>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 bg-slate-50 p-2 rounded-3xl group">
          {!order.riderId ? (
            <button 
                onClick={acceptOrder}
                disabled={updating}
                className="w-full py-6 px-6 bg-indigo-600 text-white rounded-[22px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {updating ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Truck size={22} strokeWidth={3} /> Accept This Mission</>}
            </button>
          ) : next ? (
            <button 
                onClick={() => updateStatus(next)}
                disabled={updating}
                className="w-full py-6 px-6 bg-indigo-600 text-white rounded-[22px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {updating ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Truck size={22} strokeWidth={3} /> Proceed: {next.replace('-', ' ')}</>}
            </button>
          ) : currentStatus === 'delivered' ? (
            <div className="w-full py-6 px-6 bg-emerald-50 text-emerald-700 rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 border border-emerald-100 group-hover:scale-[1.01] transition-transform">
               <CheckCircle size={22} strokeWidth={4} /> Mission Accomplished
            </div>
          ) : null}
        </div>
      </div>

      {/* Target Coordinates */}
      <div className="bg-slate-900 rounded-[40px] p-10 text-white relative group overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:scale-125 transition-transform duration-[4s]">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" alt="grid" className="w-full h-full object-cover" />
          </div>
          <div className="absolute top-0 right-0 p-6 opacity-5 flex"><Truck size={240} /></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-3xl mb-4 group-hover:rotate-[360deg] transition-transform duration-[2s]">
                <MapPin size={28} className="text-indigo-400" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">Drop Identification</p>
             <h4 className="text-xl font-black max-w-xs">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zipCode}</h4>
          </div>
          <div className="absolute bottom-6 right-8 text-white/50 text-[8px] font-black uppercase tracking-[0.4em] mix-blend-difference">Geospatial Grid: 41.40338, 2.17403</div>
      </div>
    </div>
  );
}
