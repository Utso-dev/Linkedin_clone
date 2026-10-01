"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface CategoryTab {
    id: string;
    label: string;
}

interface CategoryTabsProps {
    tabs: CategoryTab[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (id: string) => void;
    maxVisible?: number;
    className?: string;
}

const tabClassName = (isActive: boolean) =>
    cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
        isActive
            ? "bg-[#1D1F2C] text-white"
            : "bg-[#F3F4F6] text-[#4A4C56] hover:bg-[#E8E9ED]",
    );

export default function CategoryTabs({
    tabs,
    value,
    defaultValue,
    onValueChange,
    maxVisible = 3,
    className,
}: CategoryTabsProps) {
    const [internalValue, setInternalValue] = useState(
        defaultValue ?? tabs[0]?.id ?? "",
    );
    const activeId = value ?? internalValue;

    const selectTab = (id: string) => {
        if (value === undefined) setInternalValue(id);
        onValueChange?.(id);
    };

    const visibleTabs = tabs.slice(0, maxVisible);
    const overflowTabs = tabs.slice(maxVisible);
    const isOverflowActive = overflowTabs.some((tab) => tab.id === activeId);

    return (
        <div
            className={cn(
                "inline-flex max-w-full items-center gap-2 overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white p-1 scrollbar-none",
                className,
            )}
        >
            {visibleTabs.map((tab) => {
                const isActive = tab.id === activeId;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => selectTab(tab.id)}
                        className={tabClassName(isActive)}
                    >
                        {tab.label}
                    </button>
                );
            })}

            {overflowTabs.length > 0 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            aria-pressed={isOverflowActive}
                            className={cn(tabClassName(isOverflowActive), "group")}
                        >
                            Other
                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-48 bg-white">
                        {overflowTabs.map((tab) => (
                            <DropdownMenuItem
                                key={tab.id}
                                onSelect={() => selectTab(tab.id)}
                                className={cn(
                                    "cursor-pointer",
                                    tab.id === activeId && "bg-gray-100 font-medium",
                                )}
                            >
                                {tab.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}
