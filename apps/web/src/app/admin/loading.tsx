export default function AdminLoading() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-3 border-border border-t-brand rounded-full animate-spin" />
            <p className="text-body-sm text-text-tertiary animate-pulse">Loading admin panel...</p>
        </div>
    );
}
