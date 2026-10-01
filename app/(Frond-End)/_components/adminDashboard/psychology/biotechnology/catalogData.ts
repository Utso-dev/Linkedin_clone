import { CategoryTab } from "../CategoryTabs";
import { Product } from "../ProductCard";

export interface ProductCatalog {
    id: string;
    title: string;
    tabs: CategoryTab[];
    products: Product[];
}

export const biotechnologyCatalogs: ProductCatalog[] = [
    {
        id: "neuroscientific-equipment",
        title: "Neuroscientific and Psychophysiological Equipment",
        tabs: [
            { id: "all", label: "All Items" },
            { id: "brain-scanners", label: "Brain Scanners" },
            { id: "psychological-monitoring", label: "Psychological Monitoring Devices" },
            { id: "stimulus-generation", label: "Stimulus Generation Tools" },
            { id: "response-measurement", label: "Response Measurement Devices" },
            { id: "motor-sensory", label: "Motor Sensory Equipment" },
        ],
        products: [
            {
                id: "ns-1",
                title: "SIGNA One – AI-powered MRI workflow platform",
                categoryId: "brain-scanners",
                category: "Brain Scanners",
                description:
                    "AI-assisted MRI system for high-resolution brain imaging in research and clinical labs.",
                imageUrl: "/images/admin/Physiology1.png",
                learnMoreHref: "#",
            },
            {
                id: "ns-2",
                title: "Fingertip Pulse Oximeter OLED Version Jumbo Display",
                categoryId: "psychological-monitoring",
                category: "Psychological Monitoring Devices",
                description:
                    "Compact fingertip monitor for pulse rate and oxygen saturation in lab and clinical settings.",
                imageUrl: "/images/admin/Physiology2.png",
                learnMoreHref: "#",
            },
            {
                id: "ns-3",
                title: "Transcutaneous Electrical Nerve Stimulation Unit",
                categoryId: "psychological-monitoring",
                category: "Psychological Monitoring Devices",
                description:
                    "Portable TENS device used for sensory stimulation and behavioral research protocols.",
                imageUrl: "/images/admin/Physiology3.png",
                learnMoreHref: "#",
            },
            {
                id: "ns-4",
                title: "EEG Recording Headset 16-Channel",
                categoryId: "brain-scanners",
                category: "Brain Scanners",
                description:
                    "Lightweight headset for capturing brain activity during cognitive and behavioral studies.",
                imageUrl: "/images/admin/Physiology4.png",
                learnMoreHref: "#",
            },
            {
                id: "ns-5",
                title: "Stimulus Presentation Tablet Kit",
                categoryId: "stimulus-generation",
                category: "Stimulus Generation Tools",
                description:
                    "Calibrated display kit for delivering visual and auditory stimuli with precise timing.",
                imageUrl: "/images/admin/Physiology5.png",
                learnMoreHref: "#",
            },
            {
                id: "ns-6",
                title: "Response Pad with Dual Triggers",
                categoryId: "response-measurement",
                category: "Response Measurement Devices",
                description:
                    "Low-latency response pad for collecting reaction times in experimental tasks.",
                imageUrl: "/images/admin/Physiology6.png",
                learnMoreHref: "#",
            },
        ],
    },
    {
        id: "psychological-assessment",
        title: "Psychological Assessment Instruments",
        tabs: [
            { id: "all", label: "All Items" },
            { id: "intelligence", label: "Intelligence and Cognitive Tests" },
            { id: "personality", label: "Personality Assessments" },
            { id: "neuropsychological", label: "Neuropsychological assessment" },
        ],
        products: [
            {
                id: "pa-1",
                title: "Wechsler Adult Intelligence Scale Kit",
                categoryId: "intelligence",
                category: "Intelligence and Cognitive Tests",
                description:
                    "Standardized cognitive battery for measuring adult intellectual functioning across core domains.",
                imageUrl: "/images/admin/Physiology7.png",
                learnMoreHref: "#",
            },
            {
                id: "pa-2",
                title: "Minnesota Multiphasic Personality Inventory",
                categoryId: "personality",
                category: "Personality Assessments",
                description:
                    "Widely used personality inventory supporting clinical evaluation and research protocols.",
                imageUrl: "/images/admin/Physiology8.png",
                learnMoreHref: "#",
            },
            {
                id: "pa-3",
                title: "Trail Making Test Forms A and B",
                categoryId: "neuropsychological",
                category: "Neuropsychological assessment",
                description:
                    "Paper-based executive function measure for attention, processing speed, and set shifting.",
                imageUrl: "/images/admin/Physiology9.png",
                learnMoreHref: "#",
            },
            {
                id: "pa-4",
                title: "Raven Progressive Matrices Set",
                categoryId: "intelligence",
                category: "Intelligence and Cognitive Tests",
                description:
                    "Non-verbal reasoning test used to assess fluid intelligence independent of language.",
                imageUrl: "/images/admin/Physiology1.png",
                learnMoreHref: "#",
            },
            {
                id: "pa-5",
                title: "Big Five Inventory Scoring Pack",
                categoryId: "personality",
                category: "Personality Assessments",
                description:
                    "Short-form personality measure covering extraversion, agreeableness, and related traits.",
                imageUrl: "/images/admin/Physiology2.png",
                learnMoreHref: "#",
            },
        ],
    },
];
