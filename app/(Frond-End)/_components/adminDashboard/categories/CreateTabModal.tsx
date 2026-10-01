"use client";

import { useEffect, useState } from "react";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomButton from "@/components/reusable/dashboard/CustomButton";

interface CreateTabModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValue?: string;
    onSubmit?: (tabName: string) => void;
}

export default function CreateTabModal({
    open,
    onOpenChange,
    initialValue = "",
    onSubmit,
}: CreateTabModalProps) {
    const [tabName, setTabName] = useState(initialValue);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            setTabName(initialValue);
            setError("");
        }
    }, [open, initialValue]);

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setTabName("");
            setError("");
        }
        onOpenChange(nextOpen);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!tabName.trim()) {
            setError("Subcategories / Section is required");
            return;
        }

        onSubmit?.(tabName.trim());
        handleOpenChange(false);
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={handleOpenChange}
            title={initialValue ? "Edit Tab" : "Create New Tab"}
            size="md"
            className="gap-4 px-5 py-5 md:px-6 md:py-6"
        >
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
                <div className="border-t border-[#E0E0E0] pt-4">
                    <CustomInput
                        label="Subcategories / Section"
                        required
                        name="tabName"
                        placeholder="e.g. Stimulus Generation Tools"
                        value={tabName}
                        onChange={(event) => {
                            setTabName(event.target.value);
                            setError("");
                        }}
                        error={error}
                    />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <CustomButton
                        variant="ghost"
                        className="rounded-full border border-[#D1D5DB] px-5 text-[#1D1F2C] hover:bg-gray-50"
                        onClick={() => handleOpenChange(false)}
                    >
                        Cancel
                    </CustomButton>
                    <CustomButton type="submit" className="rounded-full px-5">
                        {initialValue ? "Save Changes" : "Save Tab"}
                    </CustomButton>
                </div>
            </form>
        </CustomModal>
    );
}
