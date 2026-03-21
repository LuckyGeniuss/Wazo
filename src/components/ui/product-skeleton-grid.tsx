export function ProductSkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="aspect-square bg-slate-100 animate-pulse"></div>
          <div className="p-3 space-y-3">
            <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-5 bg-slate-100 rounded animate-pulse w-1/3"></div>
              <div className="w-8 h-8 rounded-xl bg-slate-100 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
