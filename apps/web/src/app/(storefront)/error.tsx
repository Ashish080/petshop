'use client';

import { Button } from '@/components/ui/Button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-[--radius-xl] bg-danger-muted border border-danger/20 flex items-center justify-center mb-6">
                <svg
                    className="w-10 h-10 text-danger"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                </svg>
            </div>
            <h2 className="text-h3 text-text-primary mb-2">Something went wrong</h2>
            <p className="text-body-sm mb-6 max-w-md">
                {error.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <Button onClick={reset} variant="primary">
                Try Again
            </Button>
        </div>
    );
}
