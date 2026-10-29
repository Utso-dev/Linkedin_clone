"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PsychologyPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const pageSizeOptions = [5, 10, 15, 20];

export const PsychologyPagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PsychologyPaginationProps) => {
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
    <div className="hidden flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-1">
      {/* Pagination Controls */}
      <div className="flex items-center gap-1 py-1 pl-0 pr-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex items-center justify-center gap-1  rounded border border-[#A5A5AB] px-2 py-2 hover:bg-[#E9E9EA] disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden text-sm text-[#1D1F2C] sm:inline">
            Previous
          </span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex h-8 w-8 flex-col items-center justify-center rounded py-2 ${
                currentPage === page
                  ? "bg-[#A5A5AB] text-white"
                  : "text-[#1D1F2C] hover:bg-[#A5A5AB] hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center gap-1  rounded border border-[#A5A5AB] px-2 py-2 hover:bg-[#E9E9EA] disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <span className="hidden text-sm text-[#1D1F2C] sm:inline">Next</span>
          <ChevronRight className="h-4 w-4 text-[#1D1F2C]" />
        </button>
      </div>

      {/* Page Size Selector */}
      <Select
        value={String(pageSize)}
        onValueChange={(value) => onPageSizeChange(Number(value))}
      >
        <SelectTrigger className="h-auto  gap-1 rounded border border-[#A5A5AB] py-1 px-2 pr-0">
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
