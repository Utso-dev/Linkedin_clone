import CustomTitleDescription from '@/components/reusable/dashboard/CustomTitleDes'
import FilterTabs from '@/components/reusable/dashboard/FilterTabs';
import { CategorySection } from '../CategorySectionCard';
import CategoryAddSectionAction from '../CategoryAddSectionAction';
import CategorySectionList from '../CategorySectionList';

interface PsychologyStructurePageProps {
    activeTab?: string;
}

const sections: CategorySection[] = [
    {
        id: "experimental-tools",
        category: "biotechnology",
        categoryLabel: "Biotechnologies",
        title: "Experimental Tools for Behavioral and Cognitive Studies",
        subsections: [
            "Stimulus Generation Tools",
            "Response Measurement Devices",
            "Motor Sensory Equipment",
        ],
        hasMore: true,
    },
    {
        id: "laboratory-setup",
        category: "biotechnology",
        categoryLabel: "Biotechnologies",
        title: "General Laboratory and Clinical Setup",
        subsections: [
            "General Supplies",
            "Environmental Control Systems",
        ],
    },
    {
        id: "assessment-tools",
        category: "psychotropics",
        categoryLabel: "Psychotropics",
        title: "Psychological Assessment Tools",
        subsections: [
            "Cognitive and Intelligence Assessments",
            "Personality Evaluation Tools",
            "Neuropsychological Evaluation Tools",
        ],
        hasMore: true,
    },
];

export default function PsychologyStructurePage({
    activeTab = "all",
}: PsychologyStructurePageProps) {
    const tabs = [
        { id: "all", label: "All" },
        { id: "biotechnology", label: "Biotechnology" },
        { id: "psychotropics", label: "Psychotropics" },
    ];

    return (
        <>
            <div className="pb-4 border-b border-[#E0E0E0]">
                <CustomTitleDescription
                    title="Psychology Structure"
                    description="Manage your industry sections and tabs."
                    action={
                        <CategoryAddSectionAction
                            industryOptions={[
                                { label: "Biotechnologies", value: "biotechnology" },
                                { label: "Psychotropics", value: "psychotropics" },
                            ]}
                        />
                    }
                />
            </div>

            <FilterTabs tabs={tabs} paramKey="tab" className="my-4" />

            <CategorySectionList sections={sections} activeTab={activeTab} />
        </>
    );
}
