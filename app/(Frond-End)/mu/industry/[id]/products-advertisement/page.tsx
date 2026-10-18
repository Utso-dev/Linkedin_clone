"use client";

import { useGetIndustryProductPostQuery } from "@/feature/slice/jobs/industrySlice";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { EquipmentCard } from "../../../(muGroup)/psychology-network/industry/biotechnology/_components/EquipmentCard";

function Page() {
  const params = useParams();
  const industryId = params.id;
  const queryParams = useMemo(() => ({ industryId }), [industryId]);
  const {
    items,
    isInitialLoading,
    isFetchingMore,
    isError,
    hasMore,
    observerRef,
  } = useCursorQuery(useGetIndustryProductPostQuery, queryParams, {
    limit: 10,
  });



  return (
    <div className="mt-4">
      {isInitialLoading ? (
        <div className="py-12 text-center text-grayColor1">
          Loading products...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-gray-500">
          Failed to load products. Please try again later.
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-grayColor1">
          No products found.
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product, index) => (
            <EquipmentCard
              key={product.id || product.product_id}
              card={product}
              priority={index < 2}
             
            />
          ))}
        </div>
      )}

      {isFetchingMore && (
        <div className="py-6 text-center text-grayColor1">
          Loading more products...
        </div>
      )}

      {hasMore && !isFetchingMore && (
        <div ref={observerRef} className="h-2 w-full" />
      )}
    </div>
  );
}

export default Page;
