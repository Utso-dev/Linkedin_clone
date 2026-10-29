import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function JoblistSkleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200/80 p-4 md:p-5 flex flex-col justify-between"
        >
          <div>
            {/* Top Header: Logo + Title/Company + Status Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Skeleton className="w-10 h-10 md:w-11 md:h-11 rounded-full shrink-0" />
                <div>
                  <Skeleton className="h-4 w-32 md:w-36 rounded mb-1.5" />
                  <Skeleton className="h-3 w-20 md:w-24 rounded" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full shrink-0" />
            </div>

            {/* Badges / Tags */}
            <div className="flex items-center gap-1.5 mt-3">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>

            {/* Description */}
            <div className="space-y-1.5 mt-3">
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-4/5 rounded" />
            </div>
          </div>

          <div>
            {/* Dashed Divider */}
            <div className="border-b border-dashed border-gray-200 my-3.5" />

            {/* Location & Stats */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <Skeleton className="h-3.5 w-20 rounded" />
              <Skeleton className="h-3.5 w-16 rounded" />
              <Skeleton className="h-3.5 w-20 rounded" />
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-9 flex-1 rounded-lg" />
              <Skeleton className="h-9 flex-1 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}