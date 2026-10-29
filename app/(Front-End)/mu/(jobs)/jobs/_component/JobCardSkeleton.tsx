import { Skeleton } from "@/components/ui/skeleton";

export const JobCardSkeleton = () => {
  return (
    <div className="p-4 rounded-2xl border  w-full flex gap-3 ">
      <Skeleton className="hidden md:block w-12 h-12 rounded-full shrink-0" />
      <div className="flex-1">
        <div className="flex items-start w-full justify-between gap-3.5">
          <Skeleton className="md:hidden w-12 h-12 rounded-full shrink-0" />
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            <Skeleton className="h-5 w-[65%] sm:w-[55%] rounded-md" />
            <Skeleton className="w-5 h-5 rounded-full" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full shrink-0" />
        </div>
        <div className="space-y-2 mt-2">
          <Skeleton className="h-4 w-32 rounded-md" />
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <Skeleton className="h-10 w-28 rounded-full" />
          <div className="flex items-end gap-3">
            <Skeleton className="h-4 w-20 rounded-md" />
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="w-7 h-6 rounded-md" />
              <Skeleton className="h-4 w-8 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
