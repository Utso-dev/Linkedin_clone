"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PublicationsPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const pageSizeOptions = [8, 16, 24, 32];

export const PublicationsPagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PublicationsPaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="hidden items-center gap-1">
      <div className="flex items-center gap-1 py-1 pl-0 pr-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex h-8 items-center justify-center gap-1 rounded border border-[#A5A5AB] px-2 hover:bg-[#E9E9EA] disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="hidden text-sm text-[#1D1F2C] sm:inline">
            Previous
          </span>
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex h-8 w-8 flex-col items-center justify-center rounded px-1 ${
                currentPage === page
                  ? "bg-[#A5A5AB] text-white"
                  : "text-[#1D1F2C] hover:bg-[#A5A5AB] hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex h-8 items-center justify-center gap-1 rounded border border-[#A5A5AB] px-2 hover:bg-[#E9E9EA] disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <span className="hidden text-sm text-[#1D1F2C] sm:inline">Next</span>
          <ChevronRight className="h-5 w-5 text-[#1D1F2C]" />
        </button>
      </div>

      <Select
        value={String(pageSize)}
        onValueChange={(value) => onPageSizeChange(Number(value))}
      >
        <SelectTrigger className="h-8 w-30 gap-1 rounded border border-[#A5A5AB] py-1 pr-0">
          <SelectValue placeholder={`${pageSize} Results`} />
        </SelectTrigger>
        <SelectContent>
          {pageSizeOptions.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size} Results
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
