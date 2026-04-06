"use client";

import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

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
        const user = localStorage.getItem('userEmail');
        if (!user) {
            router.push('/login');
            return;
        }

        const storageKey = `myPets_${user}`;
        const myPetsRaw = localStorage.getItem(storageKey);
        let myPets = myPetsRaw ? JSON.parse(myPetsRaw) : [];

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
        <Button
            onClick={handleAdopt}
            disabled={purchased}
            variant={purchased ? 'success' : 'primary'}
            size="lg"
            fullWidth
            icon={purchased ? <Check size={22} strokeWidth={3} /> : <ShoppingBag size={22} strokeWidth={3} />}
        >
            {purchased ? 'Added to Passport!' : `Adopt ${pet.name} Now`}
        </Button>
    );
}
