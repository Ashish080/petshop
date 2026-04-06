"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chrome, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { brandConfig } from '@/config/brand';

export default function MockGoogleSignInPage() {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: Password, 3: Loading
    const router = useRouter();

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
        } else {
            setStep(3);
            setTimeout(() => {
                localStorage.setItem('userEmail', email || 'ashish.dev@gmail.com');
                router.push('/dashboard');
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 font-sans">
            <div className="bg-white w-full max-w-[450px] border border-[#dadce0] rounded-lg p-10 flex flex-col items-center">
                {/* Google Logo */}
                <div className="mb-6">
                    <svg width="75" height="24" viewBox="0 0 75 24">
                        <path fill="#4285F4" d="M10.64 12.91V10.4h9.23c.09.49.14.97.14 1.54 0 1.83-.5 3.36-1.4 4.54-1.29 1.7-3.13 2.61-5.46 2.61-4.08 0-7.39-3.32-7.39-7.4 0-4.08 3.31-7.4 7.39-7.4 2.01 0 3.7.73 4.99 1.95l-2.11 2.11c-.83-.8-1.92-1.28-2.88-1.28-2.5 0-4.57 2.07-4.57 4.62s2.07 4.62 4.57 4.62c2.01 0 3.42-1.12 3.86-2.61H10.64z" />
                        <path fill="#EA4335" d="M30 19.1c-2.45 0-4.45-1.9-4.45-4.43 0-2.53 2-4.43 4.45-4.43 2.45 0 4.45 1.9 4.45 4.43 0 2.53-2 4.43-4.45 4.43zm0-2.31c1.23 0 2.22-1.01 2.22-2.12 0-1.11-.99-2.12-2.22-2.12-1.23 0-2.22 1.01-2.22 2.12 0 1.11.99 2.12 2.22 2.12z" />
                        <path fill="#FBBC05" d="M39.67 19.1c-2.45 0-4.45-1.9-4.45-4.43 0-2.53 2-4.43 4.45-4.43 2.45 0 4.45 1.9 4.45 4.43 0 2.53-2-4.43 4.45-4.43zm0-2.31c1.23 0 2.22-1.01 2.22-2.12 0-1.11-.99-2.12-2.22-2.12-1.23 0-2.22 1.01-2.22 2.12 0 1.11.99 2.12 2.22 2.12z" />
                        <path fill="#4285F4" d="M49.46 19.1c-2.54 0-4.41-1.94-4.41-4.43 0-2.51 1.94-4.47 4.41-4.47 1.34 0 2.37.54 3.08 1.25l-1.61 1.61c-.42-.4-1-.74-1.47-.74-1.21 0-2.12 1-2.12 2.35s.92 2.35 2.12 2.35c.78 0 1.25-.31 1.63-.7.28-.28.46-.69.54-1.22h-2.17V12.4h4.48c.05.23.07.51.07.82 0 1.29-.36 2.82-1.44 3.9-1.05 1.06-2.4 1.98-4.57 1.98z" />
                        <path fill="#34A853" d="M56.4 1.5h2.24V18.8h-2.24z" />
                        <path fill="#EA4335" d="M64.44 19.1c-2.3 0-4.2-1.16-5.23-3.23l2.06-.85c.57 1.14 1.55 1.77 2.76 1.77 1.19 0 1.9-.74 1.9-1.81v-.15c-.4.24-.92.45-1.68.45-2.23 0-4.02-1.93-4.02-4.4s1.79-4.4 4.02-4.4c.76 0 1.28.21 1.68.45v-.27h2.12v7.94c0 1.83-1.07 3.23-3.61 3.23z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-normal text-[#202124] mb-2">{step === 3 ? 'Signing you in...' : 'Sign in'}</h2>
                <p className="text-base text-[#202124] mb-8">Use your Google Account to continue to {brandConfig.name}</p>

                {step === 3 ? (
                    <div className="flex flex-col items-center py-10">
                        <div className="w-12 h-12 border-4 border-[#4285F4] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <form onSubmit={handleNext} className="w-full">
                        {step === 1 ? (
                            <div className="space-y-6">
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#dadce0] rounded-md focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] outline-none text-base transition-all peer"
                                        placeholder="Email or phone"
                                    />
                                </div>
                                <div className="text-sm font-medium text-[#4285F4] hover:bg-blue-50/50 p-1 -ml-1 rounded transition-colors inline-block cursor-pointer">
                                    Forgot email?
                                </div>
                                <p className="text-sm text-[#5f6368] leading-relaxed">
                                    Not your computer? Use Guest mode to sign in privately. <span className="text-[#4285F4] font-medium cursor-pointer">Learn more</span>
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 p-1 pl-2 pr-4 border border-[#dadce0] rounded-full w-fit mb-8 mx-auto">
                                    <div className="w-5 h-5 bg-[#4285F4] rounded-full flex items-center justify-center text-[10px] text-white">A</div>
                                    <span className="text-sm font-medium text-[#3c4043]">{email}</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="password"
                                        autoFocus
                                        required
                                        className="w-full px-4 py-3 border border-[#dadce0] rounded-md focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] outline-none text-base transition-all"
                                        placeholder="Enter your password"
                                    />
                                </div>
                                <div className="text-sm font-medium text-[#4285F4] hover:bg-blue-50/50 p-1 -ml-1 rounded transition-colors inline-block cursor-pointer">
                                    Forgot password?
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-10">
                            <button
                                type="button"
                                className="text-sm font-medium text-[#4285F4] hover:bg-blue-50/50 px-4 py-2 rounded transition-colors"
                            >
                                {step === 1 ? 'Create account' : 'Back'}
                            </button>
                            <button
                                type="submit"
                                className="bg-[#1a73e8] hover:bg-[#1b66c9] text-white px-6 py-2 rounded-md text-sm font-medium shadow-sm transition-all flex items-center gap-2"
                            >
                                Next
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 text-xs text-[#5f6368]">
                <span className="cursor-pointer hover:bg-gray-100 p-1 rounded">English (United States)</span>
                <div className="flex items-center gap-4">
                    <span className="cursor-pointer hover:bg-gray-100 p-1 rounded">Help</span>
                    <span className="cursor-pointer hover:bg-gray-100 p-1 rounded">Privacy</span>
                    <span className="cursor-pointer hover:bg-gray-100 p-1 rounded">Terms</span>
                </div>
            </div>
        </div>
    );
}
