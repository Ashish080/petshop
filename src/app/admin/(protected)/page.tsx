import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

async function getStats() {
    try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/admin/stats`, {
            cache: 'no-store',
            headers: {
                // We're already authed in this server component, 
                // but the API route checks session too.
                // In some setups, we might need to pass cookies.
            }
        });
        if (!res.ok) return null;
        const result = await res.json();
        return result.data;
    } catch (e) {
        console.error('Failed to fetch stats:', e);
        return null;
    }
}

export default async function AdminPage() {
    const session = await auth();
    if (session?.user?.role !== 'admin') redirect('/auth/login');

    const stats = await getStats();

    return <AdminDashboardClient initialStats={stats} />;
}
