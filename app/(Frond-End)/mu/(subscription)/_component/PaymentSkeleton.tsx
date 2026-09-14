import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left Side Skeleton */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <Skeleton className="h-8 w-36 mb-3" />
            <div className="w-full h-px bg-borderColor mb-8" />
          </div>

          {/* Card Number Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>

          {/* Expiry & CVC Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>

          {/* Checkbox Skeleton */}
          <div className="flex items-center gap-2.5 pt-1">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Pay Button Skeleton */}
          <Skeleton className="h-12 w-full rounded-lg" />

          {/* Disclaimer Skeleton */}
          <div className="space-y-2 pt-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>

        {/* Right Side Skeleton (Order Summary) */}
        <div className="md:col-span-5 bg-gray-50/50 p-6 md:p-8 rounded-xl space-y-6">
          <div>
            <Skeleton className="h-8 w-44 mb-3" />
            <div className="w-full h-px bg-borderColor mb-6" />
          </div>

          {/* Plan Info Skeleton */}
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-12" />
          </div>

          <div className="w-full h-px bg-borderColor" />

          {/* Subtotal & VAT Skeleton */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>

          <div className="w-full h-px bg-borderColor" />

          {/* Total Skeleton */}
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};