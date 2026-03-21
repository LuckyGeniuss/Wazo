import { Skeleton } from "@/components/ui/skeleton";

export function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Gallery Skeleton */}
        <div className="space-y-3">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="flex gap-2">
            <Skeleton className="w-20 h-20 rounded-xl" />
            <Skeleton className="w-20 h-20 rounded-xl" />
            <Skeleton className="w-20 h-20 rounded-xl" />
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="space-y-5">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-3/4" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-32" />
          </div>

          <div className="flex items-baseline gap-4">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-6 w-24" />
          </div>

          <div className="flex gap-3 mt-6">
            <Skeleton className="flex-1 h-14 rounded-2xl" />
            <Skeleton className="w-14 h-14 rounded-2xl" />
            <Skeleton className="w-14 h-14 rounded-2xl" />
          </div>

          <Skeleton className="w-full h-14 rounded-2xl mt-4" />

          <div className="grid grid-cols-3 gap-3 py-4 border-t border-b mt-6">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>

          <Skeleton className="h-24 rounded-2xl w-full mt-4" />
        </div>
      </div>
    </div>
  );
}
