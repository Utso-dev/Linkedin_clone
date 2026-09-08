"use client";

import { useState } from "react";
import { Calendar, SquareArrowOutUpRight } from "lucide-react";
import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";

export type PublicationNetwork =
    | "Academic Journals"
    | "Popular News and Magazines"
    | "Case Studies"
    | "Government Information"
    | "Research Publications";

export type Publication = {
    id: number;
    title: string;
    summary: string;
    network: PublicationNetwork;
    date: string;
    journal: string;
    volume: string;
    footerNote?: string;
    doiUrl: string;
    pmid: string;
    pmcid: string;
};

const networkBadgeColor: Record<
    PublicationNetwork,
    React.ComponentProps<typeof CustomBadge>["color"]
> = {
    "Academic Journals": "blue",
    "Popular News and Magazines": "green",
    "Case Studies": "yellow",
    "Government Information": "gray",
    "Research Publications": "red",
};

export const initialPublications: Publication[] = [
    {
        id: 1,
        title: "Neural Correlates Of Decision-Making in Adolescents: A fMRI Study",
        summary:
            "This study investigates prefrontal cortex activation during high-stakes risk assessment in teenage subjects using functional magnetic resonance imaging.",
        network: "Academic Journals",
        date: "Feb 2026",
        journal: "Journal of Neuroscience",
        volume: "Vol. 46, Issue 2, pp. 123-145",
        footerNote: "Most downloaded article of 2026",
        doiUrl: "https://doi.org/10.1523/jneurosci.2026.001",
        pmid: "34567890",
        pmcid: "PMC1234567",
    },
    {
        id: 2,
        title: "Cognitive Behavioral Therapy Outcomes in Early-Onset Anxiety Disorders",
        summary:
            "A multi-center review of CBT protocols and long-term remission rates among adolescents with generalized anxiety.",
        network: "Popular News and Magazines",
        date: "Jan 2026",
        journal: "Psychology Today Review",
        volume: "Vol. 18, Issue 1, pp. 44-58",
        doiUrl: "https://doi.org/10.1000/psyrev.2026.018",
        pmid: "34567891",
        pmcid: "PMC1234568",
    },
    {
        id: 3,
        title: "Working Memory Training After Traumatic Brain Injury: A Case Series",
        summary:
            "Longitudinal case documentation of n-back training effects on attention and daily functioning after moderate TBI.",
        network: "Case Studies",
        date: "Dec 2025",
        journal: "Neurorehabilitation Reports",
        volume: "Vol. 12, Issue 4, pp. 201-218",
        doiUrl: "https://doi.org/10.1000/nrr.2025.012",
        pmid: "34567892",
        pmcid: "PMC1234569",
    },
    {
        id: 4,
        title: "National Guidelines for Mental Health Screening in Primary Care",
        summary:
            "Policy framework outlining recommended screening intervals, referral pathways, and data reporting standards.",
        network: "Government Information",
        date: "Nov 2025",
        journal: "Public Health Bulletin",
        volume: "Vol. 9, Issue 11, pp. 1-24",
        doiUrl: "https://doi.org/10.1000/phb.2025.009",
        pmid: "34567893",
        pmcid: "PMC1234570",
    },
    {
        id: 5,
        title: "Sleep Architecture and Emotional Regulation in Young Adults",
        summary:
            "Polysomnography findings linking REM density with next-day affect stability in a university cohort.",
        network: "Research Publications",
        date: "Oct 2025",
        journal: "Sleep and Affect Science",
        volume: "Vol. 7, Issue 3, pp. 88-109",
        doiUrl: "https://doi.org/10.1000/sas.2025.007",
        pmid: "34567894",
        pmcid: "PMC1234571",
    },
];

export default function PublicationTable({
    publications,
    onEdit,
    onRemove,
}: {
    publications: Publication[];
    onEdit?: (row: Publication) => void;
    onRemove?: (id: number) => void;
}) {
    const [deleting, setDeleting] = useState<Publication | null>(null);

    const columns: Column<Publication>[] = [
        {
            header: "No.",
            className: "align-top w-14",
            cell: (row) => (
                <span className="text-[#777980] font-['Segoe_UI'] text-sm">{row.id}</span>
            ),
        },
        {
            header: "ARTICLE TITLE & SUMMARY",
            className: "align-top min-w-70 max-w-100",
            cell: (row) => (
                <div className="flex max-w-100 flex-col gap-1">
                    <p className="font-['Segoe_UI'] text-sm font-semibold leading-[140%] text-[#1D1F2C]">
                        {row.title}
                    </p>
                    <p className="line-clamp-1 font-['Segoe_UI'] text-xs leading-[140%] text-[#777980]">
                        {row.summary}
                    </p>
                </div>
            ),
        },
        {
            header: "Network",
            className: "align-top whitespace-nowrap",
            cell: (row) => (
                <CustomBadge color={networkBadgeColor[row.network]}>
                    {row.network}
                </CustomBadge>
            ),
        },
        {
            header: "Meta (Date/Footer)",
            className: "align-top min-w-52",
            cell: (row) => (
                <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1.5 font-['Segoe_UI'] text-sm font-semibold text-[#1D1F2C]">
                        <Calendar className="h-3.5 w-3.5 text-[#777980]" />
                        {row.date}
                    </span>
                    <p className="font-['Segoe_UI'] text-xs leading-[140%] text-[#777980]">
                        {row.journal}
                    </p>
                    <p className="font-['Segoe_UI'] text-xs leading-[140%] text-[#777980]">
                        {row.footerNote || row.volume}
                    </p>
                </div>
            ),
        },
        {
            header: "Reference",
            className: "align-top min-w-44",
            cell: (row) => (
                <div className="flex flex-col gap-1">
                    <a
                        href={row.doiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-['Segoe_UI'] text-sm font-medium text-[#006EFF] hover:underline"
                    >
                        View DOI
                        <SquareArrowOutUpRight className="h-3.5 w-3.5" />
                    </a>
                    <p className="font-['Segoe_UI'] text-xs leading-[140%] text-[#777980]">
                        PMID - {row.pmid}
                    </p>
                    <p className="font-['Segoe_UI'] text-xs leading-[140%] text-[#777980]">
                        PMCID: {row.pmcid}
                    </p>
                </div>
            ),
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={publications}
                defaultPageSize={10}
                onEdit={onEdit}
                onDelete={setDeleting}
            />

            <CustomDeletModal
                isOpen={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={() => {
                    if (!deleting) return;
                    onRemove?.(deleting.id);
                }}
                title="Do you want to delete this publication?"
            />
        </>
    );
}
