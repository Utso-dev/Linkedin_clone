"use client";

import { IndustryCategoryType } from "@/lib/type";

interface FilterTabsProps {
  activeCategoryId: number | string | "all";
  onFilterChange: (id: number | "all") => void;
  industryData: (IndustryCategoryType | { id: number; category_name: string } | any)[];
}

export const FilterTabs = ({
  activeCategoryId,
  onFilterChange,
  industryData = [],
}: FilterTabsProps) => {
  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto  border-y bg-white border-[#E0E0E1]">
        <div className="flex max-w-2xl ">
        <button
          onClick={() => onFilterChange("all")}
          className={`shrink-0 flex items-center justify-center gap-2.5 whitespace-nowrap px-5 py-2 font-['Segoe_UI'] text-sm font-medium transition ${
            activeCategoryId === "all"
              ? "bg-[#ECEFF3] text-black"
              : "bg-white text-[#78797E] hover:bg-[#ECEFF3] hover:text-black"
          }`}
        >
          All
        </button>
        {(industryData || []).map((category) => {
          const isSelected = String(activeCategoryId) === String(category.id);
          return (
            <button
              key={category.id}
              onClick={() => onFilterChange(category.id)}
              className={`shrink-0 flex items-center justify-center gap-2.5 whitespace-nowrap px-5 py-2 font-['Segoe_UI'] text-sm font-medium transition ${
                isSelected
                  ? "bg-[#ECEFF3] text-black"
                  : "bg-white text-[#78797E] hover:bg-[#ECEFF3] hover:text-black"
              }`}
            >
              {category?.category_name}
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
};
