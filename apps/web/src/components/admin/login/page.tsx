import { brandConfig } from '@/config/brand';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
    return (
        <div className="pt-8 pb-16 min-h-screen bg-bg-primary flex items-center justify-center">
            <div className="w-full max-w-md p-8 bg-bg-tertiary border border-border rounded-[--radius-xl] shadow-md">
                <h1 className="text-h3 text-text-primary mb-2 text-center">Admin Login</h1>
                <p className="text-body-sm text-center mb-8">{brandConfig.name} Control Panel</p>
                <form className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-label-lg text-text-primary block">Email</label>
                        <input type="email" className="w-full bg-bg-elevated border border-border rounded-[--radius-md] px-4 py-3 text-body-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-brand transition-all" placeholder="admin@example.com" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-label-lg text-text-primary block">Password</label>
                        <input type="password" className="w-full bg-bg-elevated border border-border rounded-[--radius-md] px-4 py-3 text-body-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-brand transition-all" placeholder="••••••••" />
                    </div>
                    <Button type="submit" variant="primary" size="lg" fullWidth>
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
}
