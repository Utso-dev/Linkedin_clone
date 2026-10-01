"use client";

import { PlusIcon } from "lucide-react";
import CustomButton from "@/components/reusable/dashboard/CustomButton";

interface CreateNewProductActionProps {
    onClick?: () => void;
}

export default function CreateNewProductAction({
    onClick,
}: CreateNewProductActionProps) {
    return (
        <CustomButton size="lg" onClick={onClick}>
            <PlusIcon className="h-4 w-4" />
            <p className="text-nowrap text-white">Add New Product</p>
        </CustomButton>
    );
}
