import { themeConfig } from '@/config/theme';
import { Package, Truck, Wallet, CheckCircle2, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export const metadata = { title: "Subscribe & Save" };

export default function SubscribePage() {
    return (
        <div className="py-20 min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <span className="px-4 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-bold uppercase tracking-widest mb-4 inline-block">Auto-Delivery</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: themeConfig.colors.primary }}>
                        Subscribe & Save 15%
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Never run out of your pet's favorite food and essentials. Set up a recurring delivery schedule and save on every order.
                    </p>
                </div>

                {/* How it works */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-primary" style={{ color: themeConfig.colors.primary }}>
                            <Package size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">1. Pick Products</h3>
                        <p className="text-gray-500 text-sm">Choose their exact food, treats, and grooming essentials.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-primary" style={{ color: themeConfig.colors.primary }}>
                            <Truck size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">2. Set Schedule</h3>
                        <p className="text-gray-500 text-sm">Define how often you need them delivered (e.g. every 4 weeks).</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-primary" style={{ color: themeConfig.colors.primary }}>
                            <Wallet size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">3. Save Money</h3>
                        <p className="text-gray-500 text-sm">Get 15% off forever plus free express shipping.</p>
                    </div>
                </div>

                {/* Create First Box UI */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8 md:p-12 sm:flex items-center gap-12">
                        <div className="relative w-full sm:w-1/3 h-64 bg-gray-50 rounded-2xl mb-8 sm:mb-0 pb-10 flex-shrink-0 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-6">
                            <Image src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=600&auto=format&fit=crop" alt="Premium Dog Food" width={200} height={200} className="object-contain absolute bottom-4 -rotate-6 shadow-2xl drop-shadow-xl" />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Customize Your Box</h2>

                            <div className="space-y-4 mb-8">
                                <label className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-colors border-primary bg-primary/5" style={{ borderColor: themeConfig.colors.primary }}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: themeConfig.colors.primary }}></div>
                                        <div>
                                            <p className="font-bold text-gray-800">Premium Royal Canin Dog Food</p>
                                            <p className="text-sm text-gray-500">12kg Adult Formula</p>
                                        </div>
                                    </div>
                                    <span className="font-bold" style={{ color: themeConfig.colors.primary }}>$39.09</span>
                                </label>

                                <label className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-gray-200 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full border border-gray-300"></div>
                                        <div>
                                            <p className="font-bold text-gray-800">Add Dental Treats +$9.99</p>
                                            <p className="text-sm text-gray-500">Pack of 30</p>
                                        </div>
                                    </div>
                                    <span className="text-gray-400 font-medium">$12.50</span>
                                </label>
                            </div>

                            <div className="flex items-end gap-6 mb-8 border-t pt-8 border-gray-100">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Frequency</label>
                                    <div className="relative">
                                        <select className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none appearance-none font-medium bg-white">
                                            <option>Every 2 Weeks</option>
                                            <option selected>Every 4 Weeks (Recommended)</option>
                                            <option>Every 6 Weeks</option>
                                            <option>Every 8 Weeks</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={20} />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Total</p>
                                    <p className="text-3xl font-extrabold" style={{ color: themeConfig.colors.primary }}>$39.09 <span className="text-sm line-through text-gray-400 font-medium ml-1">$45.99</span></p>
                                </div>
                            </div>

                            <button className="w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-black/10 transition-transform hover:-translate-y-1 block max-w-sm ml-auto" style={{ backgroundColor: themeConfig.colors.text }}>
                                Start Subscription
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                                <CheckCircle2 size={12} /> Cancel or pause anytime. No hidden fees.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
