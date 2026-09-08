"use client";

import { useState } from "react";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomButton from "@/components/reusable/dashboard/CustomButton";

const defaultIndustryOptions = [
    { label: "Biotechnologies", value: "biotechnology" },
    { label: "Psychotropics", value: "psychotropics" },
];

interface CreateSectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    industryOptions?: { label: string; value: string }[];
    onSubmit?: (data: { industryType: string; sectionHeading: string }) => void;
}

export default function CreateSectionModal({
    open,
    onOpenChange,
    industryOptions = defaultIndustryOptions,
    onSubmit,
}: CreateSectionModalProps) {
    const emptyForm = {
        industryType: industryOptions[0]?.value ?? "",
        sectionHeading: "",
    };
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<{
        industryType?: string;
        sectionHeading?: string;
    }>({});

    const resetForm = () => {
        setForm(emptyForm);
        setErrors({});
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) resetForm();
        onOpenChange(nextOpen);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: typeof errors = {};
        if (!form.industryType) nextErrors.industryType = "Industry type is required";
        if (!form.sectionHeading.trim()) {
            nextErrors.sectionHeading = "Section heading is required";
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        onSubmit?.({
            industryType: String(form.industryType),
            sectionHeading: form.sectionHeading.trim(),
        });
        handleOpenChange(false);
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={handleOpenChange}
            title="Create New Section"
            size="md"
            className="gap-4 px-5 py-5 md:px-6 md:py-6"
        >
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
                <div className="border-t border-[#E0E0E0] pt-4">
                    <CustomSelect
                        label="Industry Type"
                        required
                        options={industryOptions}
                        value={form.industryType}
                        onChange={(value) => {
                            setForm((prev) => ({ ...prev, industryType: String(value) }));
                            setErrors((prev) => ({ ...prev, industryType: undefined }));
                        }}
                        placeholder="Select industry type"
                        error={errors.industryType}
                    />
                </div>

                <CustomInput
                    label="Section Heading"
                    required
                    name="sectionHeading"
                    placeholder="e.g. Diagnostic Imaging"
                    value={form.sectionHeading}
                    onChange={(event) => {
                        setForm((prev) => ({
                            ...prev,
                            sectionHeading: event.target.value,
                        }));
                        setErrors((prev) => ({ ...prev, sectionHeading: undefined }));
                    }}
                    error={errors.sectionHeading}
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                    <CustomButton
                        variant="ghost"
                        className="rounded-full border border-[#D1D5DB] px-5 text-[#1D1F2C] hover:bg-gray-50"
                        onClick={() => handleOpenChange(false)}
                    >
                        Cancel
                    </CustomButton>
                    <CustomButton type="submit" className="rounded-full px-5">
                        Save Section Information
                    </CustomButton>
                </div>
            </form>
        </CustomModal>
    );
}
