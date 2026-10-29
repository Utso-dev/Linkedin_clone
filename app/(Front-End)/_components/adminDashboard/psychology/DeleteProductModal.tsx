"use client";

import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";

type DeleteProductModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
};

export default function DeleteProductModal({
    open,
    onOpenChange,
    onConfirm,
    title = "Do you want to delete this product?",
    description = "Click “Delete Now” if you want to delete otherwise press cancel.",
}: DeleteProductModalProps) {
    return (
        <CustomDeletModal
            isOpen={open}
            onClose={() => onOpenChange(false)}
            onConfirm={onConfirm}
            title={title}
            description={description}
            confirmText="Delete Now"
            cancelText="Cancel"
        />
    );
}
