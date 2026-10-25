"use client";

import { useMemo, useState } from "react";

import { IndustryCategoryType } from "@/lib/type";
import { EquipmentCard } from "./EquipmentCard";
import { FilterTabs } from "./FilterTabs";
import ButtonReuseable from "@/components/reusable/CustomButton";

interface EquipmentGridProps {
  industryData?: IndustryCategoryType[] | any[];
  initialProducts?: any[];
}

export const EquipmentGrid = ({
  industryData = [],
  initialProducts = [],
}: EquipmentGridProps) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | "all">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(0);

  const ITEMS_PER_PAGE = 6;

  const allItems = useMemo(() => {
    // 1. If products array was passed directly (from new API response)
    if (initialProducts && initialProducts.length > 0) {
      if (activeCategoryId === "all") return initialProducts;
      return initialProducts.filter(
        (p) => p.category_id === activeCategoryId,
      );
    }

    // 2. Fallback for legacy nested structure
    const categories =
      activeCategoryId === "all"
        ? industryData
        : industryData.filter((cat) => cat.id === activeCategoryId);
    return categories.flatMap((cat) => cat?.industry_item || []);
  }, [industryData, initialProducts, activeCategoryId]);

  const visibleItems = allItems.slice(0, (currentPage + 1) * ITEMS_PER_PAGE);

  const handleFilterChange = (id: number | "all") => {
    setActiveCategoryId(id);
    setCurrentPage(0);
  };

  return (
    <div className="flex w-full flex-col  gap-4">
      <div className="w-full">
        <FilterTabs
          activeCategoryId={activeCategoryId}
          onFilterChange={handleFilterChange}
          industryData={industryData}
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-4 xl:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((item, index) => (
          <EquipmentCard key={item.id} card={item} priority={index < 2} />
        ))}
      </div>

      {allItems.length === 0 && (
        <div className="flex w-full justify-center py-12">
          <p className="text-liteDescriptionColor font-['Segoe_UI'] text-base">
            No equipment found in this category
          </p>
        </div>
      )}

      {visibleItems.length < allItems.length && (
        <div className="flex w-full items-center justify-center pt-2">
          <ButtonReuseable
            title="Load More"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          />
        </div>
      )}
    </div>
  );
};
