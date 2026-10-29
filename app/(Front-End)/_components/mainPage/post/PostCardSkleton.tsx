import { Skeleton } from "@/components/ui/skeleton";

function PostCardSkleton() {
  return (
    <div>
      <article className="rounded-xl border border-borderColor  p-3 md:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-56" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton className="h-3 w-56" />
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-3 w-3" />
        </div>

        <Skeleton className="mt-4 h-73 w-full rounded-none" />

        <div className="mt-2 grid grid-cols-2 gap-2 pt-2">
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      </article>
    </div>
  );
}

export default PostCardSkleton;
