import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import OrdersClient from './OrdersClient';

export default async function OrdersPage() {
    const session = await auth();
    if (!session) redirect('/auth/login');

    await connectDB();
    const orders = await Order.find({ 'user.email': session.user.email })
        .sort({ createdAt: -1 })
        .lean();

    const serializedOrders = orders.map(o => ({
        ...o,
        _id: o._id.toString(),
        riderId: o.riderId?.toString(),
        items: o.items.map((i: any) => ({
            ...i,
            _id: i._id.toString(),
            productId: i.productId?.toString()
        })),
        createdAt: new Date(o.createdAt).toLocaleDateString('en-GB'),
        updatedAt: new Date(o.updatedAt).toLocaleDateString('en-GB')
    }));

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order Archives</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose mt-1 shrink-0">Historical & active mission logs</p>
                </header>

                <OrdersClient orders={serializedOrders as any} />
            </div>
        </div>
    );
}
