"use client";

import IndustrySkleton from "@/components/reusable/All Skleton/IndustrySkleton";
import { useGetProductFeedQuery } from "@/feature/slice/biotechnologySlice";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { EquipmentCard } from "../../_components";

export default function NeurosciencePsychopharmacologyPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const queryParams = useMemo(() => {
    return {
      network_type: "neuroscience",
      industry_type: "psychotropics",
      view: "all",
      per_page: 12,
      ...(search.trim() ? { search: search.trim() } : {}),
    };
  }, [search]);

  const {
    items: products,
    isInitialLoading,
    isFetchingMore,
    observerRef,
  } = useCursorQuery<any>(useGetProductFeedQuery, queryParams, {
    getItemId: (item) => item.id,
  });

  return (
    <div className="flex w-full flex-col min-w-0">
      <div className="flex w-full flex-1 flex-col min-w-0">
        <div className="flex w-full flex-col gap-6 py-6 min-w-0">
          {isInitialLoading ? (
            <IndustrySkleton />
          ) : products.length > 0 ? (
            <>
              <div className="grid w-full grid-cols-1 gap-4 xl:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {products.map((item, index) => (
                  <EquipmentCard
                    key={item.id}
                    card={item}
                    priority={index < 2}
                  />
                ))}
              </div>

              {isFetchingMore && (
                <div className="py-4 text-center text-sm text-[#78797E]">
                  Loading more medications...
                </div>
              )}

              <div ref={observerRef} className="h-1" />
            </>
          ) : (
            <div className="flex w-full justify-center py-16">
              <p className="text-liteDescriptionColor font-['Segoe_UI'] text-base">
                {search
                  ? `No medications found matching "${search}".`
                  : "No medications found."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
