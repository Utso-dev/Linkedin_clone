import { Skeleton } from "@/components/ui/skeleton";
export default function SubscriptionSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col"
          >
            {/* Header Skeleton */}
            <div className="p-6 border-b border-gray-100 flex flex-col items-center">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Feature List Skeleton */}
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <Skeleton
                    className="h-4 rounded"
                    style={{ width: `${55 + (idx % 3) * 15}%` }}
                  />
                  <Skeleton className="w-5 h-5 rounded-full shrink-0 ml-3" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
