// components/reusable/dashboard/DeleteConfirmationModal.tsx

import React from "react";
import CustomModal from "@/components/reusable/dashboard/CustomModal"; 

type DeleteConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
};

export default function CustomDeletModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Do you want to delete this user?",
    description = "Click “Delete Now” if you want to delete otherwise press cancel.",
    confirmText = "Delete Now",
    cancelText = "Cancel",
}: DeleteConfirmationModalProps) {
    return (
        <CustomModal
            open={isOpen}
            onOpenChange={onClose}
            title={title}
            size="xsm"
            closeButtonType="custom"
        >
            <div className="flex flex-col gap-6 w-full">

                <p className="text-[#777980] font-['Segoe_UI'] text-[16px] font-normal leading-[150%] tracking-[0.08px]">
                    {description}
                </p>


                <div className="flex items-center justify-end gap-2.5 ] w-full pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-2 rounded-lg border border-[#DFDFDF] text-[#777980] font-['Segoe_UI'] text-[14px] min-w-[125px] font-semibold leading-[140%] tracking-[0.07px] cursor-pointer transition-colors"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-5 py-2.5 rounded-lg bg-[#EB3D4D] text-[#FFF] font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px] cursor-pointer transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </CustomModal>
    );
}
