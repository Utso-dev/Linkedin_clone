"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CreateSectionModal from "./CreateSectionModal";

interface CategoryAddSectionActionProps {
    industryOptions?: { label: string; value: string }[];
}

export default function CategoryAddSectionAction({
    industryOptions,
}: CategoryAddSectionActionProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <CustomButton size="lg" onClick={() => setOpen(true)}>
                <PlusIcon className="h-4 w-4" />
                Add New Section
            </CustomButton>

            <CreateSectionModal
                open={open}
                onOpenChange={setOpen}
                industryOptions={industryOptions}
            />
        </>
    );
}
