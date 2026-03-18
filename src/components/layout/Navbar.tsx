"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { brandConfig } from '@/config/brand';
import { navigationConfig } from '@/config/navigation';
import { themeConfig } from '@/config/theme';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white sticky top-0 z-50 shadow-sm border-b" style={{ borderColor: themeConfig.colors.background }}>
            <div className={themeConfig.spacing.container}>
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <span className="font-bold text-2xl tracking-tighter" style={{ color: themeConfig.colors.primary }}>
                                {brandConfig.name}
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navigationConfig.mainNav.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="font-medium hover:text-opacity-80 transition-colors"
                                style={{ color: themeConfig.colors.text }}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-gray-600 hover:text-black transition-colors" aria-label="User account">
                            <User size={20} />
                        </button>
                        <button className="text-gray-600 hover:text-black transition-colors relative" aria-label="Shopping cart">
                            <ShoppingCart size={20} />
                            <span className="absolute -top-2 -right-2 text-[10px] w-4 h-4 flex items-center justify-center text-white rounded-full bg-red-500">
                                0
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
                            style={{ color: themeConfig.colors.primary }}
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-lg absolute w-full left-0 border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navigationConfig.mainNav.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                                style={{ color: themeConfig.colors.text }}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
