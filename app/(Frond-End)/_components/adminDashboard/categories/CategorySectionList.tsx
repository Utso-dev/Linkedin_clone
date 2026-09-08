"use client";

import { useState } from "react";
import CategorySectionCard, { CategorySection } from "./CategorySectionCard";
import ViewSectionDetailsModal from "./ViewSectionDetailsModal";
import CreateTabModal from "./CreateTabModal";

interface CategorySectionListProps {
    sections: CategorySection[];
    activeTab?: string;
}

export default function CategorySectionList({
    sections: initialSections,
    activeTab = "all",
}: CategorySectionListProps) {
    const [sections, setSections] = useState(initialSections);
    const visibleSections =
        activeTab === "all"
            ? sections
            : sections.filter((section) => section.category === activeTab);
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [tabModalOpen, setTabModalOpen] = useState(false);
    const [editingTab, setEditingTab] = useState<string | undefined>();

    const selectedSection =
        sections.find((section) => section.id === selectedSectionId) ?? null;

    const openDetails = (section: CategorySection) => {
        setSelectedSectionId(section.id);
        setDetailsOpen(true);
    };

    const openCreateTab = (section?: CategorySection) => {
        if (section) setSelectedSectionId(section.id);
        setEditingTab(undefined);
        setTabModalOpen(true);
    };

    const openEditTab = (section: CategorySection, tabName: string) => {
        setSelectedSectionId(section.id);
        setEditingTab(tabName);
        setTabModalOpen(true);
    };

    const handleSaveTab = (tabName: string) => {
        if (!selectedSectionId) return;

        setSections((prev) =>
            prev.map((section) => {
                if (section.id !== selectedSectionId) return section;

                if (editingTab) {
                    return {
                        ...section,
                        subsections: section.subsections.map((item) =>
                            item === editingTab ? tabName : item,
                        ),
                    };
                }

                return {
                    ...section,
                    subsections: [...section.subsections, tabName],
                    hasMore: section.subsections.length + 1 > 3,
                };
            }),
        );
    };

    const handleDeleteTab = (section: CategorySection, tabName: string) => {
        setSections((prev) =>
            prev.map((item) =>
                item.id === section.id
                    ? {
                          ...item,
                          subsections: item.subsections.filter(
                              (name) => name !== tabName,
                          ),
                      }
                    : item,
            ),
        );
    };

    const handleDeleteSection = (section: CategorySection) => {
        setSections((prev) => prev.filter((item) => item.id !== section.id));
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleSections.map((section) => (
                    <CategorySectionCard
                        key={section.id}
                        section={section}
                        onDelete={handleDeleteSection}
                        onCreateTab={openCreateTab}
                        onSeeMore={openDetails}
                        onEditTab={openEditTab}
                        onDeleteTab={handleDeleteTab}
                    />
                ))}
            </div>

            <ViewSectionDetailsModal
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                section={selectedSection}
                onEditTab={(tabName) => {
                    if (selectedSection) openEditTab(selectedSection, tabName);
                }}
                onDeleteTab={(tabName) => {
                    if (selectedSection) handleDeleteTab(selectedSection, tabName);
                }}
            />

            <CreateTabModal
                open={tabModalOpen}
                onOpenChange={setTabModalOpen}
                initialValue={editingTab}
                onSubmit={handleSaveTab}
            />
        </>
    );
}
