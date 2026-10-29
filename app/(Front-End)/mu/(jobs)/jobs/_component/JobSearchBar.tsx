"use client";

import React, { useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";

import JobFilterModal from "./JobFilterModal";
import { JOB_TYPE_OPTIONS } from "./jobdata";

interface JobSearchBarProps {
  activeFilter: string;
  searchParam: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (search: string) => void;
}

export const JobSearchBar: React.FC<JobSearchBarProps> = ({
  activeFilter,
  searchParam,
  onFilterChange,
  onSearchChange,
}) => {
  const [query, setQuery] = useState(searchParam);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(query.trim());
  };

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSubmit} className="relative w-full sm:flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grayColor1 text-lg" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Job.."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border text-sm focus:outline-none focus:border-primaryColor transition-colors"
          />
        </form>
        <button
          onClick={handleSubmit}
          className="w-full cursor-pointer sm:w-auto px-7 py-2.5 bg-primaryColor hover:shadow-xl text-white rounded-full text-sm font-medium transition-colors"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 border border-borderColor rounded-full text-sm text-descriptionColor hover:bg-bgColor transition-colors cursor-pointer"
        >
          <span>Filter</span>
          <FiSliders className="text-sm" />
        </button>
      </div>

      <JobFilterModal
        open={isFilterModalOpen}
        setOpen={setIsFilterModalOpen}
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto mt-4 pb-5 scrollbar-hide">
        {JOB_TYPE_OPTIONS.map((filter) => {
          const isActive = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-5 py-2 cursor-pointer hover:shadow-lg rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primaryColor text-white"
                  : "bg-white border border-borderColor text-descriptionColor hover:bg-bgColor"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
