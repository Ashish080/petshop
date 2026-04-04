import { themeConfig } from '@/config/theme';
import { brandConfig } from '@/config/brand';
import { Calendar, Clock, Video, User } from 'lucide-react';

export const metadata = { title: "Book a Virtual Vet" };

export default function BookVetPage() {
    return (
        <div className="py-20 min-h-screen bg-[#FAF7F2]">
            <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8`}>
                <div className="text-center mb-12">
                    <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-bold uppercase tracking-widest mb-4 inline-block">Telemedicine</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: themeConfig.colors.primary }}>
                        Virtual Vet Consultation
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Talk to a certified veterinarian from the comfort of your home. Skip the waiting room and get expert advice instantly.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Step 1: Select Type */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">1. Consultation Details</h2>
                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
                                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 outline-none appearance-none bg-gray-50">
                                        <option>Bella (Dog)</option>
                                        <option>Milo (Cat)</option>
                                        <option>+ Add New Pet</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                                    <textarea rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 outline-none bg-gray-50" placeholder="E.g., Itching, change in appetite, general checkup..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Select Time */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">2. Select Time Slot</h2>

                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-700 flex items-center gap-2"><Calendar size={18} /> Tomorrow, Oct 16</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="py-2 px-4 rounded-lg border-2 border-gray-200 text-gray-500 font-medium hover:border-gray-300 transition-colors">09:00 AM</button>
                                    <button className="py-2 px-4 rounded-lg border-2 border-primary bg-primary/5 text-primary font-bold" style={{ borderColor: themeConfig.colors.primary, color: themeConfig.colors.primary }}>10:30 AM</button>
                                    <button className="py-2 px-4 rounded-lg border-2 border-gray-200 text-gray-500 font-medium hover:border-gray-300 transition-colors">02:00 PM</button>
                                    <button className="py-2 px-4 rounded-lg border-2 border-gray-200 text-gray-500 font-medium hover:border-gray-300 transition-colors">04:15 PM</button>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
                                <p className="text-sm text-gray-600 flex items-start gap-3">
                                    <Video size={20} className="shrink-0 text-blue-500 mt-0.5" />
                                    <span>A secure video link will be sent to your registered email and WhatsApp 15 minutes prior to the appointment.</span>
                                </p>
                            </div>

                            <button className="w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-1" style={{ backgroundColor: themeConfig.colors.primary }}>
                                Confirm Booking • $35.00
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
