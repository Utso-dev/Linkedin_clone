"use client";

import { LeftAngleIcon } from "@/public/svgIcons/Icons";
import CustomSelect from "./dashboard/CustomSelect";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageSize?: boolean;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export default function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  showPageSize = false,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50],
}: PaginationProps) {
  const getPages = () => {
    if (totalPages <= 0) return [];

    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (page >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const pagesToShow = getPages();

  const isFirstPage = page <= 1;
  const isLastPage = totalPages === 0 || page >= totalPages;

  return (
    <div className="flex items-center justify-end gap-3 mt-5">
      {/* Previous */}
      <button
        type="button"
        disabled={isFirstPage}
        onClick={() => {
          if (!isFirstPage) {
            onPageChange(page - 1);
          }
        }}
        className={`pr-2 py-1 flex items-center justify-center rounded-md border border-[#A5A5AB] bg-white shadow-sm transition ${
          isFirstPage
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <LeftAngleIcon className="w-5 h-5" />
        <span>Previous</span>
      </button>

      {/* Page Numbers */}
      {pagesToShow.length > 0 && (
        <ul className="flex items-center gap-3">
          {pagesToShow.map((p, idx) =>
            p === "..." ? (
              <li key={`ellipsis-${idx}`} className="text-gray-400 select-none">
                ...
              </li>
            ) : (
              <li key={p}>
                <button
                  type="button"
                  disabled={page === p}
                  onClick={() => onPageChange(Number(p))}
                  className={`px-3 py-1 flex items-center justify-center rounded-md font-medium transition ${
                    page === p
                      ? "bg-[#E9E9EA] text-[#4A4C56] cursor-default"
                      : "bg-red-100 text-red-500 hover:bg-red-200 cursor-pointer"
                  }`}
                >
                  {p}
                </button>
              </li>
            ),
          )}
        </ul>
      )}

      {/* Next */}
      <button
        type="button"
        disabled={isLastPage}
        onClick={() => {
          if (!isLastPage) {
            onPageChange(page + 1);
          }
        }}
        className={`pl-2 py-1 flex items-center justify-center rounded-md border border-[#A5A5AB] bg-white shadow-sm transition ${
          isLastPage
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <span>Next</span>
        <LeftAngleIcon className="w-5 h-5 rotate-180" />
      </button>

      {/* Page Size */}
      {showPageSize && onPageSizeChange && (
        <div className="w-[110px] shrink-0">
          <CustomSelect
            options={pageSizeOptions.map((size) => ({
              label: `${size} Result`,
              value: size,
            }))}
            value={pageSize}
            onChange={(value) => onPageSizeChange(Number(value))}
            placeholder="Select Result"
            className="h-[40px] w-full"
          />
        </div>
      )}
    </div>
  );
}
