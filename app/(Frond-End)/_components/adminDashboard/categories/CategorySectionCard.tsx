"use client";

import CustomButton from "@/components/reusable/dashboard/CustomButton";
import { Pencil, X } from "lucide-react";
import CategorySectionActions from "./CategorySectionActions";

export interface CategorySection {
    id: string;
    category: string;
    categoryLabel: string;
    title: string;
    subsections: string[];
    hasMore?: boolean;
}

interface CategorySectionCardProps {
    section: CategorySection;
    onEdit?: (section: CategorySection) => void;
    onDelete?: (section: CategorySection) => void;
    onCreateTab?: (section: CategorySection) => void;
    onSeeMore?: (section: CategorySection) => void;
    onEditTab?: (section: CategorySection, tabName: string) => void;
    onDeleteTab?: (section: CategorySection, tabName: string) => void;
}

const badgeStyles: Record<string, string> = {
    biotechnology: "bg-[#DDF7F5] text-[#19A7A8]",
    psychotropics: "bg-[#FFF0E7] text-[#FF8A3D]",
};

const fallbackBadge = "bg-gray-100 text-gray-600";

export default function CategorySectionCard({
    section,
    onEdit,
    onDelete,
    onCreateTab,
    onSeeMore,
    onEditTab,
    onDeleteTab,
}: CategorySectionCardProps) {
    return (
        <article className="flex min-h-85 flex-col rounded-2xl border border-[#E0E0E0] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <span
                        className={`inline-flex rounded px-3 py-1 text-xs font-medium ${badgeStyles[section.category] ?? fallbackBadge}`}
                    >
                        {section.categoryLabel}
                    </span>
                    <h3 className="mt-2 max-w-70 text-lg font-semibold leading-6 text-[#1D1F2C]">
                        {section.title}
                    </h3>
                </div>

                <CategorySectionActions
                    section={section}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>

            <div className="mt-auto pt-6">
                <p className="mb-3 text-xs text-[#6F7178]">
                    Subcategories / Sections
                </p>

                <div className="space-y-3">
                    {section.subsections.slice(0, 3).map((subsection) => (
                        <div
                            key={subsection}
                            className="flex w-fit max-w-full items-center rounded-full border border-[#E0E0E0] px-3 py-2 text-sm text-[#4A4C56]"
                        >
                            <span className="truncate">{subsection}</span>
                            <span className="mx-2 h-5 w-px bg-[#E0E0E0]" />
                            <button
                                type="button"
                                aria-label={`Edit ${subsection}`}
                                className="shrink-0 rounded p-0.5 hover:bg-gray-100"
                                onClick={() => onEditTab?.(section, subsection)}
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                aria-label={`Remove ${subsection}`}
                                className="ml-1.5 shrink-0 rounded p-0.5 hover:bg-gray-100"
                                onClick={() => onDeleteTab?.(section, subsection)}
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                {(section.hasMore || section.subsections.length > 3) && (
                    <button
                        type="button"
                        className="mt-3 text-xs font-medium text-[#0EA5B7] hover:underline"
                        onClick={() => onSeeMore?.(section)}
                    >
                        See More +
                    </button>
                )}

                <CustomButton
                    fullWidth
                    className="mt-4"
                    onClick={() => onCreateTab?.(section)}
                >
                    Create New Tab
                </CustomButton>
            </div>
        </article>
    );
}
