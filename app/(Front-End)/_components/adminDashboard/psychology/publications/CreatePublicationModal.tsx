"use client";

import { useEffect, useState } from "react";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import { Publication, PublicationNetwork } from "./PublicationTable";

export type PublicationFormValues = {
    title: string;
    network: PublicationNetwork | "";
    summary: string;
    date: string;
    footerNote: string;
    doiUrl: string;
};

interface CreatePublicationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "add" | "edit";
    publication?: Publication | null;
    onSubmit?: (data: PublicationFormValues) => void;
}

type FormErrors = Partial<Record<keyof PublicationFormValues, string>>;

const emptyForm: PublicationFormValues = {
    title: "",
    network: "",
    summary: "",
    date: "",
    footerNote: "",
    doiUrl: "",
};

const networkOptions = [
    { label: "Academic Journals", value: "Academic Journals" },
    { label: "Popular News and Magazines", value: "Popular News and Magazines" },
    { label: "Case Studies", value: "Case Studies" },
    { label: "Government Information", value: "Government Information" },
    { label: "Research Publications", value: "Research Publications" },
];

export default function CreatePublicationModal({
    open,
    onOpenChange,
    mode = "add",
    publication,
    onSubmit,
}: CreatePublicationModalProps) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (!open) return;

        if (mode === "edit" && publication) {
            setForm({
                title: publication.title,
                network: publication.network,
                summary: publication.summary,
                date: publication.date,
                footerNote: publication.footerNote ?? publication.volume,
                doiUrl: publication.doiUrl,
            });
        } else {
            setForm(emptyForm);
        }
        setErrors({});
    }, [open, mode, publication]);

    const updateField = <K extends keyof PublicationFormValues>(
        field: K,
        value: PublicationFormValues[K],
    ) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setForm(emptyForm);
            setErrors({});
        }
        onOpenChange(nextOpen);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: FormErrors = {};
        if (!form.title.trim()) nextErrors.title = "Article / journal title is required";
        if (!form.network) nextErrors.network = "Network is required";
        if (!form.date.trim()) nextErrors.date = "Publication date is required";
        if (!form.footerNote.trim()) nextErrors.footerNote = "Footer note is required";

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        onSubmit?.({
            ...form,
            title: form.title.trim(),
            summary: form.summary.trim(),
            date: form.date.trim(),
            footerNote: form.footerNote.trim(),
            doiUrl: form.doiUrl.trim(),
        });
        handleOpenChange(false);
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={handleOpenChange}
            title={
                mode === "edit"
                    ? "Edit Publication (Neuroscience)"
                    : "Add Publication (Neuroscience)"
            }
            size="lg"
            className="gap-4 px-5 py-5 md:px-6 md:py-6"
        >
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CustomInput
                        label="Article / Journal Title"
                        required
                        name="title"
                        placeholder="Add Title"
                        value={form.title}
                        onChange={(event) => updateField("title", event.target.value)}
                        error={errors.title}
                    />
                    <CustomSelect
                        label="Network"
                        required
                        placeholder="e.g. Academic Journals"
                        options={networkOptions}
                        value={form.network}
                        onChange={(value) =>
                            updateField("network", String(value) as PublicationNetwork)
                        }
                        error={errors.network}
                    />
                </div>

                <div className="w-full">
                    <label
                        htmlFor="summary"
                        className="mb-1.5 block text-base font-semibold leading-6 tracking-[0.08px] text-[#4A4C56] font-['Segoe_UI']"
                    >
                        Brief Summary / Abstract
                    </label>
                    <textarea
                        id="summary"
                        rows={5}
                        placeholder="Key summary of the research findings..."
                        value={form.summary}
                        onChange={(event) => updateField("summary", event.target.value)}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CustomInput
                        label="Publication Date"
                        required
                        name="date"
                        placeholder="e.g. Feb 2026"
                        value={form.date}
                        onChange={(event) => updateField("date", event.target.value)}
                        error={errors.date}
                    />
                    <CustomInput
                        label="Footer Note (Extra Meta)"
                        required
                        name="footerNote"
                        placeholder="e.g. Most downloaded article of 2025"
                        value={form.footerNote}
                        onChange={(event) => updateField("footerNote", event.target.value)}
                        error={errors.footerNote}
                    />
                </div>

                <CustomInput
                    label="Reference Link (DOI / URL)"
                    name="doiUrl"
                    type="url"
                    placeholder="https://doi.org/..."
                    value={form.doiUrl}
                    onChange={(event) => updateField("doiUrl", event.target.value)}
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                    <CustomButton
                        variant="ghost"
                        className="rounded-lg border border-[#D1D5DB] px-5 text-[#1D1F2C] hover:bg-gray-50"
                        onClick={() => handleOpenChange(false)}
                    >
                        Cancel
                    </CustomButton>
                    <CustomButton type="submit" className="rounded-lg px-5">
                        Save Publication Information
                    </CustomButton>
                </div>
            </form>
        </CustomModal>
    );
}
