"use client";

import { useState, useMemo } from "react";
import { NeuroscienceField } from "../_mock/neuroscienceData";
import { NeuroscienceFieldItem } from "./NeuroscienceFieldItem";
import { NeurosciencePagination } from "./NeurosciencePagination";

interface NeuroscienceFieldsListProps {
  fields: NeuroscienceField[];
  searchQuery?: string;
}

export const NeuroscienceFieldsList = ({
  fields,
  searchQuery = "",
}: NeuroscienceFieldsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  // Filter fields based on search query
  const filteredFields = useMemo(() => {
    if (!searchQuery.trim()) return fields;

    return fields.filter((field) =>
      field.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [fields, searchQuery]);

  // Always show 3 pages total for demo purposes
  const DEMO_TOTAL_PAGES = 3;

  // Calculate pagination - show empty array for pages beyond data
  const paginatedFields = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    // If page is beyond available data, return empty array
    if (start >= filteredFields.length) {
      return [];
    }

    return filteredFields.slice(start, end);
  }, [filteredFields, currentPage, pageSize]);

  // Handle page change - allow clicking even if no data
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // If no results after search (only when search is active)
  if (searchQuery.trim() && filteredFields.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-12">
        <p className="text-[#A5A5AB] font-['Segoe_UI'] text-lg">
          No psychology fields found matching "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Fields List */}
      <div className="flex w-full flex-col gap-4 pb-20">
        {paginatedFields.length > 0 ? (
          paginatedFields.map((field) => (
            <NeuroscienceFieldItem key={field.id} field={field} />
          ))
        ) : (
          <div className="flex w-full flex-col items-center justify-center border-b border-[#DFE1E7] bg-[#F6F8FA] p-12">
            <p className="text-[#A5A5AB] font-['Segoe_UI'] text-base">
              No more fields to display on this page
            </p>
          </div>
        )}
      </div>

      {/* Pagination - Always show with 3 pages */}
      <div className=" flex justify-end">
        <NeurosciencePagination
          currentPage={currentPage}
          totalPages={DEMO_TOTAL_PAGES}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};
