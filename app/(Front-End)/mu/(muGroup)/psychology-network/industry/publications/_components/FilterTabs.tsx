"use client";

import { IndustryCategoryType } from "@/lib/type";

interface FilterTabsProps {
  activeCategoryId: number | "all";
  onFilterChange: (id: number | "all") => void;
  industryData: IndustryCategoryType[];
}

export const FilterTabs = ({
  activeCategoryId,
  onFilterChange,
  industryData,
}: FilterTabsProps) => {
  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto border-y border-[#E0E0E1]">
        <div className="flex flex-nowrap">
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
        {industryData
          .filter((cat) => cat.category_name?.toLowerCase() !== "all")
          .map((category, index) => (
          <button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            className={`shrink-0 flex items-center justify-center gap-2.5 whitespace-nowrap px-5 py-2 font-['Segoe_UI'] text-sm font-medium transition ${
              activeCategoryId === category.id
                ? "bg-[#ECEFF3] text-black"
                : "bg-white text-[#78797E] hover:bg-[#ECEFF3] hover:text-black"
            }`}
          >
            {category.category_name}
          </button>
        ))}
        </div>
      </div>
    </div>
  );
};
