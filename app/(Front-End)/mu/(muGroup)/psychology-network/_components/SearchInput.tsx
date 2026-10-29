"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export const SearchInput = ({
  placeholder = "Search",
  onSearch,
}: SearchInputProps) => {
  return (
    <div className="relative w-full md:w-75">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-full border border-[#A5A5AB] bg-white py-2 pl-9 pr-4 text-sm focus-visible:ring-1 focus-visible:ring-[#04A1B7]"
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  );
};
