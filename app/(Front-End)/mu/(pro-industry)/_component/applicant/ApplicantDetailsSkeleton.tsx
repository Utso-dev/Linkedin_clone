import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicantDetailsSkeleton() {
  return (
    <div className="w-full pb-8 animate-pulse space-y-4">
      {/* Top Header Card Skeleton */}
      <div className="rounded-xl border border-grayColor2 bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-44 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl border border-grayColor2 bg-white p-5 md:p-6 space-y-3">
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="rounded-xl border border-grayColor2 bg-white p-5 md:p-6 space-y-3">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-1/4 mt-4" />
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-grayColor2 bg-white p-5 space-y-3.5">
            <Skeleton className="h-5 w-44 mb-3" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="rounded-xl border border-grayColor2 bg-white p-5 space-y-3">
            <Skeleton className="h-5 w-36 mb-2" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-20 rounded-md" />
              <Skeleton className="h-7 w-24 rounded-md" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          </div>
          <div className="rounded-xl border border-grayColor2 bg-white p-5 space-y-3">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
