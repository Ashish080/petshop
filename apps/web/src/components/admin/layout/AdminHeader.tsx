export function AdminHeader() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
      <div className="font-semibold text-sm text-gray-500 uppercase tracking-widest">
        Internal Operations
      </div>
      <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs uppercase border border-orange-200 shadow-sm">
            AD
          </div>
      </div>
    </header>
  );
}
