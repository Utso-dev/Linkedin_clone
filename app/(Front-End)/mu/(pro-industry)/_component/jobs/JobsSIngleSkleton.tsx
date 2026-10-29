import { Skeleton } from "@/components/ui/skeleton";

export default function DetailsSkeleton() {
  return (
    <div className="container py-5 md:py-8">
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex justify-between gap-4">
          <div className="flex flex-1 gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-3.5 w-2/5" />
            </div>
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <div className="mt-5 flex gap-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-3">
          <Skeleton className="mb-5 h-5 w-36" />
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-3.5 w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-3 lg:col-span-2">
          {["overview", "schedule", "contact"].map((section) => (
            <div
              key={section}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <Skeleton className="mb-5 h-5 w-32" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}