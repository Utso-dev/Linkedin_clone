"use client";

import IndustrySkleton from "@/components/reusable/All Skleton/IndustrySkleton";
import CustomBackButton from "@/components/reusable/CustomBackButton";
import { useGetProductFeedQuery } from "@/feature/slice/biotechnologySlice";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import { useParams } from "next/navigation";
import { useState } from "react";
import { EquipmentCard } from "../../../psychology-network/industry/biotechnology/_components/EquipmentCard";
import { FilterTabs } from "../../../psychology-network/industry/biotechnology/_components/FilterTabs";

interface CommonIndustrySectionPageProps {
  network_type?: string;
  industry_type?: string;
  section_id?: string | number;
}

export default function CommonIndustrySectionPage({
  network_type = "neuroscience",
  industry_type = "biotechnology",
  section_id,
}: CommonIndustrySectionPageProps) {
  const params = useParams();
  const effectiveSectionId = section_id ?? params?.sectionId;

  const [activeCategoryId, setActiveCategoryId] = useState<number | "all">(
    "all",
  );

  const queryParams = {
    per_page: 12,
    section_id: effectiveSectionId,
    industry_type,
    network_type,
    ...(activeCategoryId !== "all" ? { category_id: activeCategoryId } : {}),
  };

  const {
    items: products,
    data,
    isInitialLoading,
    isFetchingMore,
    observerRef,
  } = useCursorQuery<any>(useGetProductFeedQuery, queryParams, {
    getItemId: (item) => item.id,
  });

  const handleFilterChange = (id: number | "all") => {
    setActiveCategoryId(id);
  };

  return (
    <div className="flex w-full flex-1 flex-col min-w-0">
      <div className="flex w-full flex-col gap-6 pb-6 min-w-0">
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center gap-3">
            <CustomBackButton />
            <span className="text-xs font-semibold uppercase tracking-wider text-primaryColor">
              {data?.network_type || network_type} network
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1D1F2C]">
            {data?.section_name}
          </h1>
        </div>

        <div className="w-full">
          <FilterTabs
            activeCategoryId={activeCategoryId}
            onFilterChange={handleFilterChange}
            industryData={data?.categories || []}
          />
        </div>

        {isInitialLoading ? (
          <IndustrySkleton />
        ) : products.length > 0 ? (
          <>
            <div className="grid w-full grid-cols-1 gap-4 xl:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {products.map((item, index) => (
                <EquipmentCard key={item.id} card={item} priority={index < 2} />
              ))}
            </div>

            {isFetchingMore && (
              <div className="py-4 text-center text-sm text-[#78797E]">
                Loading more products...
              </div>
            )}

            <div ref={observerRef} className="h-1" />
          </>
        ) : (
          <div className="flex w-full justify-center py-16">
            <p className="text-liteDescriptionColor font-['Segoe_UI'] text-base">
              No products found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
