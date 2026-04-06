'use client';

import { MessageCircle, Phone } from 'lucide-react';
import { brandConfig } from '@/config/brand';
import { Button } from '@/components/ui/Button';

export default function MobileStickyCtas() {
  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${brandConfig.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I am interested in purchasing a pet.`,
      '_blank'
    );
  };

  const handleCall = () => {
    window.open(`tel:${brandConfig.phone.replace(/[^0-9]/g, '')}`, '_self');
  };

  return (
    <div className="fixed md:hidden bottom-0 left-0 right-0 bg-bg-elevated/80 backdrop-blur-xl border-t border-border p-4 flex gap-4 z-50 shadow-md">
      <Button
        onClick={handleWhatsApp}
        variant="success"
        fullWidth
        size="lg"
        icon={<MessageCircle size={18} fill="currentColor" />}
        className="shadow-lg shadow-success/10"
      >
        WhatsApp
      </Button>
      <Button
        onClick={handleCall}
        variant="brand"
        fullWidth
        size="lg"
        icon={<Phone size={18} fill="currentColor" />}
        className="shadow-lg shadow-brand/10"
      >
        Call Now
      </Button>
    </div>
  );
}
