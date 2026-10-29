// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/biotechnology/_components/FilterTabs.tsx

"use client";

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filterId: number) => void;
  filterCategories?: { id: number; name: string }[];
}

export const ProfileTabs = ({
  activeFilter,
  onFilterChange,
  filterCategories,
}: FilterTabsProps) => {
  return (
    <div className="w-full overflow-x-auto border-y border-borderColor">
      <div className="flex w-max">
        {filterCategories?.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            className={`flex items-center justify-center whitespace-nowrap px-5 py-2 text-sm font-medium transition-colors cursor-pointer ${
              category.name === activeFilter
                ? "bg-bgLightColor border-t border-grayColor1 border-b text-headerColor"
                : "bg-white text-descriptionColor hover:bg-[#ECEFF3] hover:text-headerColor"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};
