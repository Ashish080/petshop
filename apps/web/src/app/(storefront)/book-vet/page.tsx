import { brandConfig } from '@/config/brand';
import { Calendar, Video, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const metadata = { title: "Book a Virtual Vet" };

export default function BookVetPage() {
    return (
        <div className="py-20 min-h-screen bg-bg-secondary">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <Badge variant="info" size="lg" className="mb-4">Telemedicine</Badge>
                    <h1 className="text-h1 text-brand mb-4">
                        Virtual Vet Consultation
                    </h1>
                    <p className="text-body-lg max-w-2xl mx-auto">
                        Talk to a certified veterinarian from the comfort of your home. Skip the waiting room and get expert advice instantly.
                    </p>
                </div>

                <div className="bg-bg-elevated rounded-[--radius-xl] shadow-md border border-border p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-h3 mb-6 border-b border-border pb-4">1. Consultation Details</h2>
                            <div className="space-y-4 mb-8">
                                <div className="space-y-1.5">
                                    <label className="text-label-lg text-text-primary block">Pet Name</label>
                                    <select className="w-full px-4 py-3 border border-border rounded-[--radius-md] focus:ring-2 focus:ring-ring/20 outline-none appearance-none bg-bg-tertiary text-body-sm text-text-primary">
                                        <option>Bella (Dog)</option>
                                        <option>Milo (Cat)</option>
                                        <option>+ Add New Pet</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-label-lg text-text-primary block">Reason for Visit</label>
                                    <textarea 
                                        rows={3} 
                                        className="w-full px-4 py-3 border border-border rounded-[--radius-md] focus:ring-2 focus:ring-ring/20 outline-none bg-bg-tertiary text-body-sm text-text-primary placeholder:text-text-disabled" 
                                        placeholder="E.g., Itching, change in appetite, general checkup..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-h3 mb-6 border-b border-border pb-4">2. Select Time Slot</h2>

                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-label-lg text-text-primary flex items-center gap-2"><Calendar size={16} /> Tomorrow, Oct 16</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="py-2.5 px-4 rounded-[--radius-md] border-2 border-border text-text-secondary text-body-sm hover:border-border-hover transition-colors">09:00 AM</button>
                                    <button className="py-2.5 px-4 rounded-[--radius-md] border-2 border-brand bg-brand-muted text-brand text-label-lg">10:30 AM</button>
                                    <button className="py-2.5 px-4 rounded-[--radius-md] border-2 border-border text-text-secondary text-body-sm hover:border-border-hover transition-colors">02:00 PM</button>
                                    <button className="py-2.5 px-4 rounded-[--radius-md] border-2 border-border text-text-secondary text-body-sm hover:border-border-hover transition-colors">04:15 PM</button>
                                </div>
                            </div>

                            <div className="bg-bg-secondary rounded-[--radius-md] p-4 mb-8 border border-border">
                                <p className="text-body-xs flex items-start gap-3">
                                    <Video size={18} className="shrink-0 text-info mt-0.5" />
                                    <span>A secure video link will be sent to your registered email and WhatsApp 15 minutes prior to the appointment.</span>
                                </p>
                            </div>

                            <Button variant="primary" size="lg" fullWidth>
                                Confirm Booking • $35.00
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
