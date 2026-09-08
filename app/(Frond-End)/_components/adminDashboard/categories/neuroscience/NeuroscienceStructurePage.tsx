import CustomTitleDescription from '@/components/reusable/dashboard/CustomTitleDes'
import FilterTabs from '@/components/reusable/dashboard/FilterTabs';
import { CategorySection } from '../CategorySectionCard';
import CategoryAddSectionAction from '../CategoryAddSectionAction';
import CategorySectionList from '../CategorySectionList';

interface NeuroscienceStructurePageProps {
    activeTab?: string;
}

const industryOptions = [
    { label: "Biotechnology", value: "biotechnology" },
    { label: "Psychotropics", value: "psychotropics" },
  
];

const sections: CategorySection[] = [
    {
        id: "brain-imaging",
        category: "biotechnology",
        categoryLabel: "Biotechnology",
        title: "Brain Imaging and Mapping Tools",
        subsections: [
            "Functional MRI Systems",
            "EEG Recording Devices",
            "MEG Analysis Software",
        ],
        hasMore: true,
    },
    {
        id: "neural-stimulation",
        category: "biotechnology",
        categoryLabel: "Biotechnology",
        title: "Neural Stimulation Equipment",
        subsections: [
            "Transcranial Magnetic Stimulation",
            "Deep Brain Stimulation Tools",
        ],
    },
    {
        id: "clinical-assessment",
        category: "psychotropics",
        categoryLabel: "Psychotropics",
        title: "Clinical Assessment Instruments",
        subsections: [
            "Neurological Exam Kits",
            "Memory Evaluation Tools",
            "Motor Function Assessments",
        ],
        hasMore: true,
    },
    {
        id: "clinical-treatment",
        category: "psychotropics",
        categoryLabel: "Psychotropics",
        title: "Clinical Treatment Tools",
        subsections: [
            "Neurological Exam Kits",
            "Memory Evaluation Tools",
            "Motor Function Assessments",
        ],
    },
];

export default function NeuroscienceStructurePage({
    activeTab = "all",
}: NeuroscienceStructurePageProps) {
    const tabs = [
        { id: "all", label: "All" },
        { id: "biotechnology", label: "Biotechnology" },
        { id: "psychotropics", label: "Psychotropics" },
    ];

    return (
        <>
            <div className="pb-4 border-b border-[#E0E0E0]">
                <CustomTitleDescription
                    title="Neuroscience Structure"
                    description="Manage your industry sections and tabs."
                    action={<CategoryAddSectionAction industryOptions={industryOptions} />}
                />
            </div>

            <FilterTabs tabs={tabs} paramKey="tab" className="my-4" />

            <CategorySectionList sections={sections} activeTab={activeTab} />
        </>
    );
}
