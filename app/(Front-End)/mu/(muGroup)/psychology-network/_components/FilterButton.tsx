"use client";

import { Button } from "@/components/ui/button";

interface FilterButtonProps {
  onClick?: () => void;
}

export const FilterButton = ({ onClick }: FilterButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1 rounded-full bg-[#04A1B7] px-9 py-2 font-medium text-white hover:bg-[#048a9e] md:w-auto"
    >
      Search
    </Button>
  );
};
