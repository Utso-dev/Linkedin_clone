"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import CategorySectionCard, { CategorySection, SubcategoryItem } from "./CategorySectionCard";
import ViewSectionDetailsModal from "./ViewSectionDetailsModal";
import CreateTabModal from "./CreateTabModal";
import CreateSectionModal from "./CreateSectionModal";
import {
    useCreateCategoryTabMutation,
    useDeleteCategorySectionMutation,
    useDeleteCategoryTabMutation,
    useUpdateCategoryTabMutation,
} from "@/feature/slice/admin/categories";

interface CategorySectionListProps {
    sections: CategorySection[];
    activeTab?: string;
    onEditSection?: (section: CategorySection, data: { industryType: string; sectionHeading: string }) => void;
    industryOptions?: { label: string; value: string }[];
}

export default function CategorySectionList({
    sections,
    activeTab = "all",
    onEditSection,
    industryOptions,
}: CategorySectionListProps) {
    const visibleSections =
        activeTab === "all"
            ? sections
            : sections.filter((section) => section.category === activeTab);

    const [selectedSectionId, setSelectedSectionId] = useState<string | number | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [tabModalOpen, setTabModalOpen] = useState(false);
    const [editingTab, setEditingTab] = useState<SubcategoryItem | string | undefined>();

    // Section Edit state
    const [editingSection, setEditingSection] = useState<CategorySection | null>(null);
    const [editSectionModalOpen, setEditSectionModalOpen] = useState(false);

    const [deleteSection] = useDeleteCategorySectionMutation();
    const [createTab] = useCreateCategoryTabMutation();
    const [updateTab] = useUpdateCategoryTabMutation();
    const [deleteTab] = useDeleteCategoryTabMutation();

    const selectedSection =
        sections.find((section) => String(section.id) === String(selectedSectionId)) ?? null;

    const openDetails = (section: CategorySection) => {
        setSelectedSectionId(section.id);
        setDetailsOpen(true);
    };

    const openCreateTab = (section?: CategorySection) => {
        if (section) setSelectedSectionId(section.id);
        setEditingTab(undefined);
        setTabModalOpen(true);
    };

    const openEditTab = (section: CategorySection, subcategory: string | SubcategoryItem) => {
        setSelectedSectionId(section.id);
        setEditingTab(subcategory);
        setTabModalOpen(true);
    };

    const handleOpenEditSection = (section: CategorySection) => {
        setEditingSection(section);
        setEditSectionModalOpen(true);
    };

    const handleSaveEditSection = (data: { industryType: string; sectionHeading: string }) => {
        if (!editingSection) return;
        onEditSection?.(editingSection, data);
    };

    const handleSaveTab = async (tabName: string) => {
        if (!selectedSectionId) return;

        try {
            if (editingTab && typeof editingTab === "object" && "id" in editingTab) {
                await updateTab({
                    id: editingTab.id,
                    body: { category_name: tabName },
                }).unwrap();
                toast.success("Subcategory updated successfully");
            } else {
                await createTab({
                    section_id: selectedSectionId,
                    category_name: tabName,
                }).unwrap();
                toast.success("Subcategory created successfully");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to save subcategory");
        }
    };

    const handleDeleteTab = async (section: CategorySection, subcategory: string | SubcategoryItem) => {
        try {
            const tabId = typeof subcategory === "object" ? subcategory.id : subcategory;
            await deleteTab(tabId).unwrap();
            toast.success("Subcategory deleted successfully");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete subcategory");
        }
    };

    const handleDeleteSection = async (section: CategorySection) => {
        try {
            await deleteSection(section.id).unwrap();
            toast.success("Section deleted successfully");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete section");
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleSections.map((section) => (
                    <CategorySectionCard
                        key={section.id}
                        section={section}
                        onEdit={handleOpenEditSection}
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
                onEditTab={(subcategory) => {
                    if (selectedSection) openEditTab(selectedSection, subcategory);
                }}
                onDeleteTab={(subcategory) => {
                    if (selectedSection) handleDeleteTab(selectedSection, subcategory);
                }}
            />

            <CreateTabModal
                open={tabModalOpen}
                onOpenChange={setTabModalOpen}
                initialValue={typeof editingTab === "object" ? editingTab.name : (editingTab || "")}
                onSubmit={handleSaveTab}
            />

            <CreateSectionModal
                open={editSectionModalOpen}
                onOpenChange={setEditSectionModalOpen}
                industryOptions={industryOptions}
                initialValues={
                    editingSection
                        ? {
                              industryType: editingSection.category,
                              sectionHeading: editingSection.title,
                          }
                        : undefined
                }
                onSubmit={handleSaveEditSection}
            />
        </>
    );
}
