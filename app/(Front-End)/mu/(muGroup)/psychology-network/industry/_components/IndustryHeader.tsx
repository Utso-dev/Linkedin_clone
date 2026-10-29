// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/_components/IndustryHeader.tsx

"use client";

import { SearchInput } from "../../_components/SearchInput";
import { FilterButton } from "../../_components/FilterButton";

interface IndustryHeaderProps {
  onSearch?: (value: string) => void;
  title: string;
  description?: string;
}

export const IndustryHeader = ({
  onSearch = () => {},
  title,
  description,
}: IndustryHeaderProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-4 md:gap-10">
      {/* Desktop Layout */}
      <div className="hidden w-full flex-col items-start justify-between md:flex">
        <h1 className="flex-1 text-[#1D1F2C] font-['Segoe_UI'] text-[32px] font-semibold leading-[130%]">
          {title}
        </h1>
        {description && <h4 className="text-[#A5A5AB] pt-2">{description}</h4>}
      </div>

      {/* Mobile Layout */}
      <div className="flex w-full flex-col gap-4 md:hidden ">
        <h1 className="text-[#1D1F2C] font-['Segoe_UI'] text-2xl font-semibold leading-[130%]">
          {title}
        </h1>
        {description && <p className="text-[#A5A5AB] text-sm">{description}</p>}
      </div>
    </div>
  );
};
