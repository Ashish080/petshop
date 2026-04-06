import { Package, Truck, Wallet, CheckCircle2, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const metadata = { title: "Subscribe & Save" };

export default function SubscribePage() {
    return (
        <div className="py-20 min-h-screen bg-bg-secondary">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <Badge variant="brand" size="lg" className="mb-4">Auto-Delivery</Badge>
                    <h1 className="text-h1 text-brand mb-4">
                        Subscribe & Save 15%
                    </h1>
                    <p className="text-body-lg max-w-2xl mx-auto">
                        Never run out of your pet's favorite food and essentials. Set up a recurring delivery schedule and save on every order.
                    </p>
                </div>

                {/* How it works */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        { icon: Package, title: "1. Pick Products", desc: "Choose their exact food, treats, and grooming essentials." },
                        { icon: Truck, title: "2. Set Schedule", desc: "Define how often you need them delivered (e.g. every 4 weeks)." },
                        { icon: Wallet, title: "3. Save Money", desc: "Get 15% off forever plus free express shipping." },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="text-center">
                            <div className="w-14 h-14 mx-auto bg-bg-elevated rounded-full flex items-center justify-center shadow-sm mb-4 text-brand border border-border">
                                <Icon size={24} />
                            </div>
                            <h3 className="text-h5 mb-2">{title}</h3>
                            <p className="text-body-xs">{desc}</p>
                        </div>
                    ))}
                </div>

                {/* Create First Box */}
                <div className="bg-bg-elevated rounded-[--radius-xl] shadow-md overflow-hidden border border-border">
                    <div className="p-8 md:p-12 sm:flex items-center gap-12">
                        <div className="relative w-full sm:w-1/3 h-64 bg-bg-secondary rounded-[--radius-lg] mb-8 sm:mb-0 pb-10 flex-shrink-0 border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-6">
                            <Image src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=600&auto=format&fit=crop" alt="Premium Dog Food" width={200} height={200} className="object-contain absolute bottom-4 -rotate-6 shadow-2xl drop-shadow-xl" />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-h3 mb-6">Customize Your Box</h2>

                            <div className="space-y-4 mb-8">
                                <label className="flex items-center justify-between p-4 border-2 border-brand rounded-[--radius-md] cursor-pointer bg-brand-muted">
                                    <div className="flex items-center gap-4">
                                        <div className="w-5 h-5 rounded-full border-4 border-bg-primary shadow-sm bg-brand" />
                                        <div>
                                            <p className="text-label-lg text-text-primary">Premium Royal Canin Dog Food</p>
                                            <p className="text-body-xs">12kg Adult Formula</p>
                                        </div>
                                    </div>
                                    <span className="text-label-lg text-brand">$39.09</span>
                                </label>

                                <label className="flex items-center justify-between p-4 border-2 border-border rounded-[--radius-md] cursor-pointer hover:border-border-hover transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-5 h-5 rounded-full border border-border" />
                                        <div>
                                            <p className="text-label-lg text-text-primary">Add Dental Treats +$9.99</p>
                                            <p className="text-body-xs">Pack of 30</p>
                                        </div>
                                    </div>
                                    <span className="text-body-sm text-text-secondary">$12.50</span>
                                </label>
                            </div>

                            <div className="flex items-end gap-6 mb-8 border-t border-border pt-8">
                                <div className="flex-1">
                                    <label className="text-label-lg text-text-primary block mb-2">Delivery Frequency</label>
                                    <div className="relative">
                                        <select className="w-full px-4 py-3 border border-border rounded-[--radius-md] outline-none appearance-none text-body-sm bg-bg-tertiary text-text-primary">
                                            <option>Every 2 Weeks</option>
                                            <option>Every 4 Weeks (Recommended)</option>
                                            <option>Every 6 Weeks</option>
                                            <option>Every 8 Weeks</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3.5 text-text-tertiary pointer-events-none" size={18} />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-overline mb-1">Total</p>
                                    <p className="text-h2 text-stat text-brand">$39.09 <span className="text-body-sm line-through text-text-disabled ml-1">$45.99</span></p>
                                </div>
                            </div>

                            <Button variant="brand" size="lg" fullWidth className="max-w-sm ml-auto">
                                Start Subscription
                            </Button>
                            <p className="text-center text-body-xs mt-4 flex items-center justify-center gap-1">
                                <CheckCircle2 size={12} /> Cancel or pause anytime. No hidden fees.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
