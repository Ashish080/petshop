import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import InventoryClient from './InventoryClient';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Package } from 'lucide-react';

export default async function InventoryPage() {
  const session = await auth();
  if (!session || session.user.role !== 'admin') redirect('/auth/login');

  await connectDB();
  const products = await Product.find().sort({ updatedAt: -1 }).lean();

  const serializedProducts = products.map(p => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  }));

  return (
    <div className="p-10 space-y-12 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-end">
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Assets Monitoring</h4>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Tactical Inventory Hub</h1>
        </div>
        <div className="flex items-center gap-6 pb-2">
            <div className="text-right">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Deployment Sync</span>
                <div className="flex items-center gap-2 justify-end">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Operational Real-time</span>
                </div>
            </div>
            <div className="h-10 w-[1px] bg-slate-200"></div>
            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400">
                <Package size={22} />
            </div>
        </div>
      </header>

      <InventoryClient initialProducts={serializedProducts} />
    </div>
  );
}
