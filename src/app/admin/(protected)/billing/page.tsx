"use client";

import { useState } from 'react';
import { User, Copy, Printer, Save, Send, Trash2, Plus } from 'lucide-react';
import { brandConfig } from '@/config/brand';

interface InvoiceItem {
    id: string;
    desc: string;
    hsn: string;
    qty: number;
    rate: number;
    gst: number;
}

export default function BillingPage() {
    const [customerName, setCustomerName] = useState("Rahul Verma");
    const [customerPhone, setCustomerPhone] = useState("+91 98765 43210");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerAddress, setCustomerAddress] = useState("Gomti Nagar, Lucknow");
    const [gstNumber, setGstNumber] = useState("");
    const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [globalGst, setGlobalGst] = useState(12);
    
    const [items, setItems] = useState<InvoiceItem[]>([
        { id: '1', desc: 'Golden Retriever Pup (45 Days)', hsn: '01012100', qty: 1, rate: 28000, gst: 12 },
        { id: '2', desc: 'Royal Canin Dog Food (3kg)', hsn: '23091090', qty: 2, rate: 1200, gst: 5 },
    ]);

    const [paymentStatus, setPaymentStatus] = useState('Unpaid');

    // Calculations
    const getTotals = () => {
        let subtotal = 0;
        let totalGst = 0;

        items.forEach(item => {
            const base = item.qty * item.rate;
            const gstAmt = base * (item.gst / 100);
            subtotal += base;
            totalGst += gstAmt;
        });

        return {
            subtotal,
            cgst: totalGst / 2,
            sgst: totalGst / 2,
            totalGst,
            grand: subtotal + totalGst
        };
    };

    const totals = getTotals();

    const addItem = () => {
        setItems([
            ...items, 
            { id: Date.now().toString(), desc: '', hsn: '', qty: 1, rate: 0, gst: globalGst }
        ]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const formatCurrency = (num: number) => `₹${Math.round(num).toLocaleString('en-IN')}`;
    
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="pb-20">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    🧾 Create GST Invoice
                </h1>
                <p className="text-sm font-medium text-gray-500 mt-1">
                    Vyapar-style invoicing · Auto GST Calculation · Instant Print
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* LEFT: FORM AREA */}
                <div className="xl:col-span-8 space-y-6">
                    
                    {/* CUSTOMER CARD */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                            <span className="font-bold text-sm text-gray-700 flex items-center gap-2">
                                <User size={16} className="text-gray-400" /> Customer Details
                            </span>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Customer Name *</label>
                                    <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Phone Number</label>
                                    <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Email (Optional)</label>
                                    <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Address</label>
                                    <input type="text" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1.5">GST Number</label>
                                    <input type="text" value={gstNumber} onChange={e => setGstNumber(e.target.value)} placeholder="e.g. 22AAAAA0000A1Z5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all uppercase" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Invoice Date</label>
                                    <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PRODUCTS CARD */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                            <span className="font-bold text-sm text-gray-700 flex items-center gap-2">
                                📦 Products / Services
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global GST:</span>
                                <select 
                                    value={globalGst} 
                                    onChange={e => {
                                        const v = Number(e.target.value);
                                        setGlobalGst(v);
                                        setItems(items.map(i => ({...i, gst: v})));
                                    }}
                                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none focus:border-brand-primary"
                                >
                                    <option value={5}>5%</option>
                                    <option value={12}>12%</option>
                                    <option value={18}>18%</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-5 overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr>
                                        <th className="text-left text-[10px] uppercase tracking-widest font-black text-gray-400 pb-3 w-[35%]">Item / Description</th>
                                        <th className="text-left text-[10px] uppercase tracking-widest font-black text-gray-400 pb-3 w-[12%]">HSN</th>
                                        <th className="text-left text-[10px] uppercase tracking-widest font-black text-gray-400 pb-3 w-[10%]">Qty</th>
                                        <th className="text-left text-[10px] uppercase tracking-widest font-black text-gray-400 pb-3 w-[15%]">Rate (₹)</th>
                                        <th className="text-left text-[10px] uppercase tracking-widest font-black text-gray-400 pb-3 w-[12%]">GST%</th>
                                        <th className="text-right text-[10px] uppercase tracking-widest font-black text-gray-400 pb-3 w-[12%]">Total</th>
                                        <th className="w-[4%]"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(item => {
                                        const itemTotal = (item.qty * item.rate) * (1 + item.gst/100);
                                        return (
                                        <tr key={item.id} className="border-t border-gray-100">
                                            <td className="py-2 pr-2">
                                                <input type="text" value={item.desc} onChange={e => updateItem(item.id, 'desc', e.target.value)} placeholder="Description" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-brand-primary" />
                                            </td>
                                            <td className="py-2 pr-2">
                                                <input type="text" value={item.hsn} onChange={e => updateItem(item.id, 'hsn', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-brand-primary" />
                                            </td>
                                            <td className="py-2 pr-2">
                                                <input type="number" min={1} value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-brand-primary" />
                                            </td>
                                            <td className="py-2 pr-2">
                                                <input type="number" min={0} value={item.rate} onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-brand-primary" />
                                            </td>
                                            <td className="py-2 pr-2">
                                                <select value={item.gst} onChange={e => updateItem(item.id, 'gst', Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-brand-primary">
                                                    <option value={5}>5%</option>
                                                    <option value={12}>12%</option>
                                                    <option value={18}>18%</option>
                                                </select>
                                            </td>
                                            <td className="py-2 pr-2 text-right font-bold text-gray-800 text-sm">
                                                {formatCurrency(itemTotal)}
                                            </td>
                                            <td className="py-2 text-right">
                                                <button onClick={() => removeItem(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                            <button onClick={addItem} className="mt-4 w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-brand-primary transition-colors flex items-center justify-center gap-2">
                                <Plus size={16} /> Add Item
                            </button>
                        </div>
                    </div>

                    {/* NOTES CARD */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                            <span className="font-bold text-sm text-gray-700 flex items-center gap-2">
                                📝 Notes & Payment
                            </span>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Notes for Customer</label>
                                <input type="text" defaultValue="Free vet consultation included. Diet plan shared. Thank you for choosing us!" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-primary" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Payment Method</label>
                                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-primary">
                                    <option>Bank Transfer</option>
                                    <option>UPI / GPay</option>
                                    <option>Cash</option>
                                    <option>Card</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Payment Status</label>
                                <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-primary">
                                    <option>Paid</option>
                                    <option>Unpaid</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT: TOTALS & PREVIEW */}
                <div className="xl:col-span-4 space-y-6">
                    
                    {/* TOTALS */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-5 space-y-3 border-b border-gray-100">
                            <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(totals.subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                                <span>CGST</span>
                                <span>{formatCurrency(totals.cgst)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                                <span>SGST</span>
                                <span>{formatCurrency(totals.sgst)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-orange-500">
                                <span>Total Tax</span>
                                <span>{formatCurrency(totals.totalGst)}</span>
                            </div>
                        </div>
                        <div className="p-5 bg-brand-primary/5 flex justify-between items-center">
                            <span className="text-sm font-black uppercase tracking-widest text-gray-800">Grand Total</span>
                            <span className="text-2xl font-black text-brand-primary">{formatCurrency(totals.grand)}</span>
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="grid grid-cols-3 gap-2">
                        <button className="py-3 px-2 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 hover:text-brand-primary hover:border-brand-primary transition-colors flex flex-col items-center gap-1 shadow-sm">
                            <Printer size={18} /> Print
                        </button>
                        <button className="py-3 px-2 bg-green-500 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-green-600 transition-colors flex flex-col items-center gap-1 shadow-sm">
                            <Save size={18} /> Save
                        </button>
                        <button className="py-3 px-2 bg-blue-600 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-colors flex flex-col items-center gap-1 shadow-sm">
                            <Send size={18} /> Send
                        </button>
                    </div>

                    {/* INVOICE PREVIEW V2 */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mt-6 print:absolute print:top-0 print:left-0 print:w-full print:border-none print:shadow-none print:h-screen print:z-50">
                        <div className="bg-brand-primary p-6 text-white flex justify-between items-start">
                            <div>
                                <h3 className="font-serif text-xl font-bold tracking-tight">{brandConfig.name}</h3>
                                <p className="text-[10px] font-medium opacity-80 mt-0.5">{brandConfig.address}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-black">INVOICE</div>
                                <div className="text-[10px] font-bold opacity-80 mt-1">#INV-0042</div>
                            </div>
                        </div>

                        <div className="p-6 text-sm">
                            <div className="mb-6 flex justify-between pb-6 border-b border-gray-100">
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Bill To</div>
                                    <div className="font-bold text-gray-900">{customerName || 'Walk-in Customer'}</div>
                                    <div className="text-xs text-gray-500 mt-1">{customerPhone}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Date</div>
                                    <div className="font-bold text-gray-900">{formatDate(invoiceDate)}</div>
                                    <div className={`mt-2 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded inline-block ${paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {paymentStatus}
                                    </div>
                                </div>
                            </div>

                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-2 font-black text-gray-400 uppercase tracking-widest w-1/2">Item</th>
                                        <th className="text-left py-2 font-black text-gray-400 uppercase tracking-widest">Qty</th>
                                        <th className="text-right py-2 font-black text-gray-400 uppercase tracking-widest">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="border-b border-gray-50">
                                            <td className="py-2 text-gray-700 font-semibold">{item.desc || 'Item'}</td>
                                            <td className="py-2 text-gray-500">{item.qty}</td>
                                            <td className="py-2 text-right font-bold text-gray-900">{formatCurrency((item.rate * item.qty) * (1 + item.gst/100))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-6 space-y-1 text-xs">
                                <div className="flex justify-between font-semibold text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(totals.subtotal)}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-gray-600">
                                    <span>GST Amount</span>
                                    <span>{formatCurrency(totals.totalGst)}</span>
                                </div>
                                <div className="flex justify-between font-black text-base text-gray-900 mt-2 pt-2 border-t border-gray-900">
                                    <span>Total</span>
                                    <span>{formatCurrency(totals.grand)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
