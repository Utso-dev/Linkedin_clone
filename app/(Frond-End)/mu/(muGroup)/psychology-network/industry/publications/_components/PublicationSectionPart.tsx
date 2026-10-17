"use client";

import IndustrySkleton from "@/components/reusable/All Skleton/IndustrySkleton";
import { useGetPublicationsOneQuery } from "@/feature/slice/biotechnologySlice";
import { useGetNeurosciencePublicationsOneQuery } from "@/feature/slice/neuroscienceSlice";
import { PublicationDataType } from "@/lib/type";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import { usePathname } from "next/navigation";
import { PublicationsList } from "./PublicationsList";

export default function PublicationSectionPart() {
  const pathName = usePathname();
  const queryHook =
    pathName === "/mu/neuroscience-network/industry/publications"
      ? useGetNeurosciencePublicationsOneQuery
      : useGetPublicationsOneQuery;
  const {
    items: publications,
    isInitialLoading,
    isFetchingMore,
    observerRef,
  } = useCursorQuery<PublicationDataType>(
    queryHook,
    { query: "publications", per_page: 20 },
    { getItemId: (publication) => publication.id },
  );

  return (
    <div className="flex w-full flex-col min-w-0">
      <div className="flex w-full flex-col items-stretch gap-10 pt-2 min-w-0">
        {isInitialLoading ? (
          <IndustrySkleton />
        ) : (
          <>
            <PublicationsList publications={publications} />
            {isFetchingMore && (
              <div className="py-4 text-center text-sm text-descriptionColor">
                Loading more publications...
              </div>
            )}
            <div ref={observerRef} className="h-1" />
          </>
        )}
      </div>
    </div>
  );
}
