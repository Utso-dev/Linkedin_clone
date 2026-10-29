import { Skeleton } from "@/components/ui/skeleton";

function StateCardSkleton() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-borderColor/80 p-5 space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-8 h-8 rounded-lg bg-gray-100" />
              <Skeleton className="w-24 h-4 bg-gray-100 rounded" />
            </div>
            <Skeleton className="w-28 h-8 bg-gray-100 rounded mt-2" />
            <Skeleton className="w-36 h-4 bg-gray-100 rounded mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default StateCardSkleton;
