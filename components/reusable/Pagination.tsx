"use client";

import { LeftAngleIcon } from "@/public/svgIcons/Icons";
import SelecteInputField from "./InputFiled/SelecteInputField";

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
    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-end sm:gap-3">
      {/* Previous */}
      <button
        type="button"
        disabled={isFirstPage}
        onClick={() => {
          if (!isFirstPage) {
            onPageChange(page - 1);
          }
        }}
        className={`flex h-9 items-center justify-center rounded-md border border-liteDescriptionColor bg-white pl-1 pr-2 text-sm shadow-sm transition sm:h-10 ${
          isFirstPage
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <LeftAngleIcon className="w-4 h-4" />
        <span>Prev</span>
      </button>

      {/* Page Numbers */}
      {pagesToShow.length > 0 && (
        <ul className="flex min-w-0 items-center gap-1 sm:gap-3">
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
                  className={`flex h-9 items-center justify-center rounded-md px-2 text-sm font-medium transition sm:h-10 sm:px-3 ${
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
        className={`flex h-9 items-center justify-center rounded-md border border-liteDescriptionColor bg-white pl-2 pr-1 text-sm shadow-sm transition sm:h-10 ${
          isLastPage
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <span>Next</span>
        <LeftAngleIcon className="w-4 h-4 rotate-180" />
      </button>

      {/* Page Size */}
      {showPageSize && onPageSizeChange && (
        <div className="order-last flex w-full justify-center sm:order-none sm:w-18.5 sm:shrink-0">
          <SelecteInputField
            options={pageSizeOptions.map((size) => ({
              label: `${size}`,
              value: String(size),
            }))}
            value={String(pageSize)}
            onChange={(value) => onPageSizeChange(Number(value))}
            placeholder="Select Result"
            className="h-9 w-20 sm:h-10 sm:w-full"
          />
        </div>
      )}
    </div>
  );
}
