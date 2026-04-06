'use client';

import { useState, useEffect } from 'react';
import { 
    TrendingUp, Users, Package, ShoppingBag, 
    Bell, Search, ChevronRight, Activity, 
    ArrowRight, MapPin, CheckCircle, Clock,
    ShieldAlert, AlertCircle, Check, X,
    Mail, MessageSquare, ExternalLink,
    LayoutDashboard, Wallet, BarChart3,
    Truck, Settings, LogOut, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { brandConfig } from '@/config/brand';
import toast from 'react-hot-toast';

// --- Sub-Views ---
import { FleetManagementView } from './FleetManagementView';
import { WalletManagementView } from './WalletManagementView';
import { AnalyticsDashboardView } from './AnalyticsDashboardView';

type AdminTab = 'overview' | 'orders' | 'inventory' | 'fleet' | 'wallet' | 'analytics';

export function AdminDashboardClient() {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        try {
            const res = await fetch('/api/admin/tickets');
            const data = await res.json();
            if (data.success) setTickets(data.data);
        } catch (err) {}
    };

    const fetchOrders = async () => {
        try {
            // Simplified order fetch for overview
            const res = await fetch('/api/admin/orders?limit=8');
            const data = await res.json();
            if (data.success) setOrders(data.data);
        } catch (err) {} finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
        fetchOrders();
    }, []);

    const sidebarItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
        { id: 'orders', icon: ShoppingBag, label: 'Mission Log' },
        { id: 'fleet', icon: Truck, label: 'Fleet Control' },
        { id: 'wallet', icon: Wallet, label: 'Wallet Support' },
        { id: 'analytics', icon: BarChart3, label: 'Mission Control' },
        { id: 'inventory', icon: Package, label: 'Catalog' },
    ];

    return (
        <div className="min-h-screen bg-bg-primary flex overflow-hidden">
            
            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: sidebarOpen ? 280 : 80 }}
                className="bg-bg-elevated border-r border-border flex flex-col h-screen fixed lg:static z-50 shadow-xl lg:shadow-none"
            >
                <div className="p-6 flex items-center justify-between mb-8 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand rounded-[--radius-lg] flex items-center justify-center font-bold text-white text-h4 shadow-lg shadow-brand/20">P</div>
                        {sidebarOpen && <h1 className="text-h5 font-bold text-text-primary tracking-tighter uppercase italic">PET HQ</h1>}
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const active = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as AdminTab)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group ${active ? 'bg-brand text-white shadow-lg shadow-brand/10' : 'text-text-tertiary hover:bg-bg-secondary hover:text-text-primary'}`}
                            >
                                <Icon size={20} className={active ? 'fill-white' : 'group-hover:scale-110 transition-transform'} />
                                {sidebarOpen && <span className="text-label-md font-bold uppercase tracking-tight">{item.label}</span>}
                                {active && (
                                    <motion.div 
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-1.5 h-6 bg-white rounded-full ml-1"
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-border mt-auto">
                    <button className="w-full flex items-center gap-4 px-4 py-3 text-text-tertiary hover:text-danger hover:bg-danger/5 transition-all rounded-2xl group">
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        {sidebarOpen && <span className="text-label font-bold uppercase tracking-wider">Sign Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Pane */}
            <main className="flex-1 h-screen overflow-y-auto relative custom-scrollbar">
                
                {/* Viewport Header */}
                <header className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-3xl border-b border-border/50 px-8 py-5">
                    <div className="flex items-center justify-between max-w-[1400px] mx-auto">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 bg-bg-elevated border border-border rounded-xl text-text-tertiary hover:text-brand transition-colors">
                                <Menu size={20} />
                            </button>
                            <div>
                                <p className="text-overline opacity-60">Admin Dashboard / {activeTab}</p>
                                <h2 className="text-label-lg font-bold text-text-primary uppercase tracking-tight italic">
                                    {sidebarItems.find(i => i.id === activeTab)?.label}
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="relative group hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" size={16} />
                                <input placeholder="Global search..." className="pl-10 pr-4 py-2.5 bg-bg-elevated border border-border rounded-xl text-label-sm w-64 outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all" />
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="w-11 h-11 bg-bg-elevated border border-border rounded-full flex items-center justify-center text-text-tertiary relative hover:text-brand transition-all shadow-sm">
                                    <Bell size={18} />
                                    <span className="absolute top-3 right-3 w-2 h-2 bg-danger rounded-full" />
                                </button>
                                <div className="w-11 h-11 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center font-bold text-brand text-label-lg shadow-sm">A</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="p-8 max-w-[1400px] mx-auto min-h-[calc(100vh-80px)]">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'overview' && <AdminOverview orders={orders} tickets={tickets} />}
                            {activeTab === 'fleet' && <FleetManagementView />}
                            {activeTab === 'wallet' && <WalletManagementView />}
                            {activeTab === 'analytics' && <AnalyticsDashboardView />}
                            {['orders', 'inventory'].includes(activeTab) && (
                                <div className="flex flex-col items-center justify-center py-32 text-center opacity-60 bg-bg-elevated rounded-[--radius-3xl] border border-dashed border-border">
                                     <ShoppingBag size={64} className="text-text-disabled mb-6 animate-bounce" />
                                     <h3 className="text-h3 font-bold text-text-tertiary uppercase italic tracking-tighter">Segment in Maintenance</h3>
                                     <p className="text-body-md text-text-disabled mt-2">The full list view for {activeTab} is being optimized for high-velocity scrolling.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

// Extraction of original Overview content to a sub-component for clarity
function AdminOverview({ orders, tickets }: any) {
    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Today's Revenue" value="₹42.5k" trend="+14.5%" icon={TrendingUp} colorClass="text-success" bgClass="bg-success/10" />
                <MetricCard title="Active Missions" value="12" trend="Live Ops" icon={Truck} colorClass="text-brand" bgClass="bg-brand/10" />
                <MetricCard title="Unassigned" value={orders.filter((o: any) => o.status === 'unassigned').length.toString()} trend="Pending Task" icon={Clock} colorClass="text-danger" bgClass="bg-danger/10" />
                <KPI value="8/15" label="Fleet Efficiency" icon={Users} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2">
                    <div className="bg-bg-elevated border border-border rounded-[--radius-3xl] overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-h4 font-bold italic text-text-primary uppercase tracking-tighter">Live Activity</h3>
                            <button className="text-label-sm font-semibold text-brand uppercase tracking-wider hover:underline px-4 py-2 bg-brand/5 rounded-[--radius-md]">View Archives</button>
                        </div>
                        <div className="p-6 text-text-tertiary text-center py-20 italic font-medium">Order registry syncing with mission control...</div>
                    </div>
                 </div>
                 <div className="lg:col-span-1">
                    <div className="bg-bg-elevated border border-border rounded-[--radius-3xl] p-8 shadow-sm h-full">
                         <h3 className="text-h5 font-bold italic text-brand uppercase tracking-tighter mb-6 flex items-center gap-2">
                            <AlertCircle size={20} /> High Priority Tickets
                         </h3>
                         <div className="space-y-4">
                             {tickets.map((t: any) => (
                                 <div key={t._id} className="p-4 bg-bg-secondary rounded-2xl border border-border border-l-4 border-l-danger hover:border-danger/30 transition-all">
                                     <p className="text-label-sm font-semibold text-danger uppercase tracking-wider mb-1">{t.issueType}</p>
                                     <p className="text-label-sm font-bold text-text-primary">{t.userEmail}</p>
                                 </div>
                             ))}
                             {tickets.length === 0 && <p className="text-label-sm text-text-disabled italic text-center py-10 uppercase tracking-widest">No issues reported</p>}
                         </div>
                    </div>
                 </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, icon: Icon, colorClass, bgClass }: any) {
    return (
        <div className="bg-bg-elevated border border-border p-6 rounded-[--radius-3xl] shadow-sm flex flex-col justify-between group hover:border-brand/40 transition-all">
            <div className="flex justify-between items-start mb-6">
                <span className="text-overline">{title}</span>
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${bgClass} ${colorClass}`}>
                    <Icon size={18} />
                </div>
            </div>
            <div>
                <h3 className="text-h2 text-stat text-text-primary tracking-tight mb-1">{value}</h3>
                <span className="text-label-sm font-semibold uppercase text-success tracking-wider">{trend} vs prev</span>
            </div>
        </div>
    );
}

function KPI({ value, label, icon: Icon }: any) {
    return (
        <div className="bg-bg-elevated border border-border p-6 rounded-[--radius-3xl] shadow-sm flex flex-col justify-between hover:border-info/40 transition-all">
            <div className="flex justify-between items-start mb-6 text-info">
                <span className="text-overline">{label}</span>
                <Icon size={18} />
            </div>
            <h3 className="text-h2 text-stat text-text-primary tracking-tight mb-1 opacity-80">{value}</h3>
            <span className="text-label-sm font-bold text-info uppercase tracking-tight">System Optimized</span>
        </div>
    );
}
