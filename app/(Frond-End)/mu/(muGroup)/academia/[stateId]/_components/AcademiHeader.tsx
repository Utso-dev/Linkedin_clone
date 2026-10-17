"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FilterIcon, SearchIcon } from "@/public/svgIcons/Icons";
import { useState, useEffect, useRef } from "react";

type PropType = {
    title: string;
    description?: string;
    selectedDegree?: string;
    setSelectedDegree?: (value: string) => void;
    filterData?: {
        key: string;
        label: string;
    }[];
    onSearch?: (query: string) => void;
    searchPlaceHolder?: string;
};

export default function AcademiHeader({
    selectedDegree,
    setSelectedDegree,
    filterData,
    title,
    description,
    onSearch,
    searchPlaceHolder = "Search...",
}: PropType) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!onSearch) return;
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            onSearch(searchQuery);
        }, 500);
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [searchQuery, onSearch]);

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Title */}
            <div className="space-y-1 md:space-y-2">
                <h1 className="text-headerColor text-xl sm:text-2xl md:text-[32px] font-semibold leading-[130%]">
                    {title}
                </h1>
                {description && (
                    <p className="text-descriptionColor text-sm sm:text-base font-normal leading-[150%] tracking-[0.08px]">
                        {description}
                    </p>
                )}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 md:justify-between">
                {/* Filter */}
                {filterData && (
                    <div className="sm:max-w-60.5 px-2 py-1 flex sm:grid sm:grid-cols-[auto_1fr] gap-2 md:gap-3 items-center justify-between bg-sectionColor w-full md:w-fit rounded-lg">
                        <h2 className="text-descriptionColor text-sm md:text-base font-normal leading-[150%] tracking-[0.08px] whitespace-nowrap">
                            Filter Degree
                        </h2>
                        <Select
                            value={selectedDegree}
                            onValueChange={setSelectedDegree}
                        >
                            <SelectTrigger className="bg-white w-full max-w-34.5 sm:max-w-full md:w-34.5 grid grid-cols-[auto_1fr_auto] focus-visible:border-grayColor2 focus-visible:ring-0">
                                <FilterIcon className="w-4 h-4 md:w-5 md:h-5" />
                                <SelectValue placeholder="Select a degree" />
                            </SelectTrigger>
                            <SelectContent className="z-99">
                                <SelectGroup>
                                    <SelectItem value="all">All</SelectItem>
                                    {filterData.map((item) => (
                                        <SelectItem key={item.key} value={item.key}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Search */}
                {onSearch && (
                    <div className="w-full flex justify-end gap-2 md:gap-3">
                        <div className="flex-1 sm:max-w-80 flex items-center gap-2 px-3 py-2 border border-liteDescriptionColor rounded-full">
                            <SearchIcon className="w-4 h-4 md:w-5 md:h-5" />
                            <input
                                type="text"
                                id="search"
                                placeholder={searchPlaceHolder}
                                className="w-full outline-none text-sm md:text-base"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}