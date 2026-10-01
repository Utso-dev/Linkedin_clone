"use client";

import { useState } from "react";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import PublicationTable, {
    Publication,
    initialPublications,
} from "./PublicationTable";
import CreateNewPublication from "./CreateNewPublication";
import CreatePublicationModal, {
    PublicationFormValues,
} from "./CreatePublicationModal";

export default function PublicationsPage() {
    const [publications, setPublications] = useState(initialPublications);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Publication | null>(null);

    const openAddModal = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const handleSubmit = (data: PublicationFormValues) => {
        if (!data.network) return;

        if (editing) {
            setPublications((prev) =>
                prev.map((item) =>
                    item.id === editing.id
                        ? {
                              ...item,
                              title: data.title,
                              network: data.network as Publication["network"],
                              summary: data.summary,
                              date: data.date,
                              footerNote: data.footerNote,
                              doiUrl: data.doiUrl,
                          }
                        : item,
                ),
            );
            return;
        }

        const nextId =
            publications.reduce((max, item) => Math.max(max, item.id), 0) + 1;

        setPublications((prev) => [
            ...prev,
            {
                id: nextId,
                title: data.title,
                network: data.network as Publication["network"],
                summary: data.summary,
                date: data.date,
                footerNote: data.footerNote,
                journal: "",
                volume: "",
                doiUrl: data.doiUrl,
                pmid: "",
                pmcid: "",
            },
        ]);
    };

    return (
        <div>
            <div className="pb-4 border-b border-[#E0E0E0]">
                <CustomTitleDescription
                    title="Neuroscience Publications"
                    description="Manage and organize research articles and journals in table view."
                    action={
                        <div className="flex gap-2">
                            <input type="text" placeholder="Search" className="w-full" />
                            <CreateNewPublication onClick={openAddModal} />
                        </div>
                    }
                />
            </div>

            <div className="mt-4">
                <PublicationTable
                    publications={publications}
                    onEdit={(row) => {
                        setEditing(row);
                        setModalOpen(true);
                    }}
                    onRemove={(id) =>
                        setPublications((prev) => prev.filter((item) => item.id !== id))
                    }
                />
            </div>

            <CreatePublicationModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                mode={editing ? "edit" : "add"}
                publication={editing}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
