export function SaveJobcardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-borderColor/80 p-4 sm:p-5 animate-pulse space-y-3.5"
        >
          {/* Top row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="w-8 h-2.5 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 pt-1">
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
          </div>

          {/* Description */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-4/5" />
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
