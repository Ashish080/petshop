"use client";

import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { themeConfig } from '@/config/theme';
import { useRouter } from 'next/navigation';

interface Pet {
    id: string;
    name: string;
    breed: string;
    age: string;
    image: string;
    weight?: string;
    gender: string;
    description: string;
    healthStatus: string;
}

export default function AdoptPetButton({ pet }: { pet: Pet }) {
    const [purchased, setPurchased] = useState(false);
    const router = useRouter();

    const handleAdopt = () => {
        // Enforce login check (simplified)
        const user = localStorage.getItem('userEmail');
        if (!user) {
            router.push('/login');
            return;
        }

        const storageKey = `myPets_${user}`;
        const myPetsRaw = localStorage.getItem(storageKey);
        let myPets = myPetsRaw ? JSON.parse(myPetsRaw) : [];

        // Don't add if already exists
        if (!myPets.find((p: any) => p.id === pet.id)) {
            const petWithRecords = {
                ...pet,
                weight: (pet as any).weight || "To be measured",
                records: [
                    { date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ", 2026", title: "Adoption Registration", Vet: "Kanha Center", status: "Completed", type: "Process" }
                ]
            };
            myPets.push(petWithRecords);
            localStorage.setItem(storageKey, JSON.stringify(myPets));

            // LOG FOR ADMIN
            const transRaw = localStorage.getItem('allTransactions');
            let transactions = transRaw ? JSON.parse(transRaw) : [];
            transactions.unshift({
                id: `TXN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                name: pet.name,
                type: 'Adoption',
                price: `₹${(pet as any).price?.toLocaleString('en-IN') || '850'}`,
                customer: user,
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
            });
            localStorage.setItem('allTransactions', JSON.stringify(transactions.slice(0, 50)));
        }

        setPurchased(true);
        setTimeout(() => {
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <button
            onClick={handleAdopt}
            disabled={purchased}
            className={`w-full py-5 flex items-center justify-center gap-3 font-black text-xl transition-all ${purchased ? 'bg-green-500 text-white' : 'bg-secondary text-white hover:-translate-y-1 hover:shadow-xl active:scale-95 shadow-lg shadow-brand-primary/25'} ${themeConfig.radius.lg}`}
        >
            {purchased ? (
                <>
                    <Check size={24} strokeWidth={3} />
                    Added to Passport!
                </>
            ) : (
                <>
                    <ShoppingBag size={24} strokeWidth={3} />
                    Adopt {pet.name} Now
                </>
            )}
        </button>
    );
}
