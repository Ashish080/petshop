import { brandConfig } from '@/config/brand';
import { themeConfig } from '@/config/theme';

export default function FloatingWhatsApp() {
    const whatsappUrl = `https://wa.me/${brandConfig.whatsapp.replace(/\D/g, '')}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed bottom-6 right-6 z-50 p-4 transition-transform hover:scale-110 flex items-center justify-center ${themeConfig.radius.full} ${themeConfig.shadows.hover}`}
            style={{ backgroundColor: '#25D366', color: 'white' }}
            aria-label="Chat on WhatsApp"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
        </a>
    );
}
