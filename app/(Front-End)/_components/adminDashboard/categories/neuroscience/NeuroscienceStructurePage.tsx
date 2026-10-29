"use client";

import toast from "react-hot-toast";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import FilterTabs from "@/components/reusable/dashboard/FilterTabs";
import Loading from "@/components/reusable/Loader";
import { CategorySection } from "../CategorySectionCard";
import CategoryAddSectionAction from "../CategoryAddSectionAction";
import CategorySectionList from "../CategorySectionList";
import {
    useCreateNeuroscienceSectionMutation,
    useGetNeuroscienceSectionsQuery,
    useUpdateNeuroscienceSectionMutation,
} from "@/feature/slice/admin/categories";

interface NeuroscienceStructurePageProps {
    activeTab?: string;
}

const industryOptions = [
    { label: "Biotechnology", value: "biotechnology" },
    { label: "Psychotropics", value: "psychotropics" },
];

export default function NeuroscienceStructurePage({
    activeTab = "all",
}: NeuroscienceStructurePageProps) {
    const tabs = [
        { id: "all", label: "All" },
        { id: "biotechnology", label: "Biotechnology" },
        { id: "psychotropics", label: "Psychotropics" },
    ];

    const typeFilter = activeTab === "all" ? "" : activeTab;
    const { data, isLoading, isError } = useGetNeuroscienceSectionsQuery({
        query: { type: typeFilter, per_page: 50, page: 1 },
    });

    const [createNeuroscienceSection] = useCreateNeuroscienceSectionMutation();
    const [updateNeuroscienceSection] = useUpdateNeuroscienceSectionMutation();

    const handleCreateSection = async (formData: {
        industryType: string;
        sectionHeading: string;
    }) => {
        try {
            await createNeuroscienceSection({
                industry_type: formData.industryType,
                name: formData.sectionHeading,
            }).unwrap();
            toast.success("Neuroscience section created successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to create section");
        }
    };

    const handleUpdateSection = async (
        section: CategorySection,
        formData: { industryType: string; sectionHeading: string }
    ) => {
        try {
            await updateNeuroscienceSection({
                id: section.id,
                body: {
                    industry_type: formData.industryType,
                    name: formData.sectionHeading,
                },
            }).unwrap();
            toast.success("Neuroscience section updated successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update section");
        }
    };

    const sections: CategorySection[] = (data?.data?.sections || []).map((sec) => ({
        id: sec.id,
        category: sec.industry_type,
        categoryLabel:
            sec.industry_type === "biotechnology"
                ? "Biotechnology"
                : sec.industry_type === "psychotropics"
                ? "Psychotropics"
                : sec.industry_type,
        title: sec.name,
        subsections: (sec.categories || []).map((c) => ({
            id: c.id,
            name: c.category_name,
        })),
        hasMore: (sec.categories || []).length > 3,
    }));

    return (
        <>
            <div className="pb-4 border-b border-[#E0E0E0]">
                <CustomTitleDescription
                    title="Neuroscience Structure"
                    description="Manage your industry sections and tabs."
                    action={
                        <CategoryAddSectionAction
                            industryOptions={industryOptions}
                            onSubmit={handleCreateSection}
                        />
                    }
                />
            </div>

            <FilterTabs tabs={tabs} paramKey="tab" className="my-4" />

            {isLoading ? (
                <div className="py-12">
                    <Loading text="Loading neuroscience sections..." />
                </div>
            ) : isError ? (
                <div className="py-12 text-center text-red-500">
                    Failed to load neuroscience sections. Please try again.
                </div>
            ) : sections.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                    No neuroscience sections found.
                </div>
            ) : (
                <CategorySectionList
                    sections={sections}
                    activeTab={activeTab}
                    onEditSection={handleUpdateSection}
                    industryOptions={industryOptions}
                />
            )}
        </>
    );
}
