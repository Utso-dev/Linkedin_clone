"use client";

import CustomModal from "@/components/reusable/dashboard/CustomModal";
import { Pencil, X } from "lucide-react";
import type { CategorySection } from "./CategorySectionCard";

interface ViewSectionDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    section: CategorySection | null;
    onEditTab?: (tabName: string) => void;
    onDeleteTab?: (tabName: string) => void;
}

const badgeStyles: Record<string, string> = {
    biotechnology: "bg-[#DDF7F5] text-[#19A7A8]",
    psychotropics: "bg-[#FFF0E7] text-[#FF8A3D]",
};

const fallbackBadge = "bg-gray-100 text-gray-600";

export default function ViewSectionDetailsModal({
    open,
    onOpenChange,
    section,
    onEditTab,
    onDeleteTab,
}: ViewSectionDetailsModalProps) {
    if (!section) return null;

    return (
        <CustomModal
            open={open}
            onOpenChange={onOpenChange}
            title="See More"
            size="md"
            className="gap-4 px-5 py-5 md:px-6 md:py-6"
        >
            <div className="flex w-full flex-col gap-5 border-t border-[#E0E0E0] pt-4">
                <div>
                    <span
                        className={`inline-flex rounded px-3 py-1 text-xs font-medium ${badgeStyles[section.category] ?? fallbackBadge}`}
                    >
                        {section.categoryLabel}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-[#1D1F2C]">
                        {section.title}
                    </h3>
                </div>

                <div>
                    <p className="mb-3 text-sm font-medium text-[#6F7178]">
                        Subcategories / Sections
                    </p>

                    {section.subsections.length === 0 ? (
                        <p className="text-sm text-[#9A9CA3]">
                            No tabs added yet.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {section.subsections.map((subsection) => (
                                <div
                                    key={subsection}
                                    className="flex w-full items-center justify-between rounded-full border border-[#E0E0E0] px-3 py-2 text-sm text-[#4A4C56]"
                                >
                                    <span className="truncate">{subsection}</span>
                                    <div className="ml-3 flex shrink-0 items-center">
                                        <span className="mx-2 h-5 w-px bg-[#E0E0E0]" />
                                        <button
                                            type="button"
                                            aria-label={`Edit ${subsection}`}
                                            className="rounded p-0.5 hover:bg-gray-100"
                                            onClick={() => onEditTab?.(subsection)}
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label={`Remove ${subsection}`}
                                            className="ml-1.5 rounded p-0.5 hover:bg-gray-100"
                                            onClick={() => onDeleteTab?.(subsection)}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CustomModal>
    );
}
