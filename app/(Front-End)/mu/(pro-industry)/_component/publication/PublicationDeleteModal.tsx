"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import RootDialog from "@/components/reusable/RootDialog";
import { usePublicationDeleteMutation } from "@/feature/slice/jobs/publicationSlice";
import React from "react";
import toast from "react-hot-toast";

interface PublicationDeleteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  publicationId?: string | number | null;
}

export default function PublicationDeleteModal({
  open,
  setOpen,
  publicationId,
}: PublicationDeleteModalProps) {
  const [deletePublication, { isLoading }] = usePublicationDeleteMutation();

  const handleDelete = async () => {
    if (!publicationId) {
      toast.error("Invalid publication ID");
      return;
    }

    try {
      const response = await deletePublication(publicationId).unwrap();
      toast.success(
        response?.message || "Publication deleted successfully",
      );
      setOpen(false);
    } catch (error: any) {
      console.error("Error deleting publication:", error);
      toast.error(
        error?.data?.message ||
          "Failed to delete publication. Please try again.",
      );
    }
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="sm:max-w-md rounded-xl"
      ariaLabel="Delete Publication"
      ariaDescription="Confirm if you want to delete this publication"
    >
      <div className="p-6">
        <h3 className="text-base sm:text-lg font-semibold text-headerColor pr-6">
          Do you want to Delete this Publication?
        </h3>
        <p className="text-xs sm:text-sm text-descriptionColor mt-1">
          If Yes press &ldquo;Yes, Continue&rdquo;. Otherwise press &ldquo;No, Don&apos;t Delete&rdquo;.
        </p>

        <div className="flex items-center gap-3 mt-6">
          <ButtonReuseable
            type="button"
            title="No, Don't Delete"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="flex-1 bg-white hover:bg-gray-50 text-headerColor! border border-borderColor text-sm font-medium shadow-none hover:shadow-xs py-2.5! md:py-2.5!"
          />

          <ButtonReuseable
            type="button"
            title="Yes, Continue"
            onClick={handleDelete}
            disabled={isLoading}
            loading={isLoading}
            sendingMsg="Deleting..."
            className="flex-1 bg-redColor! hover:bg-redColor/90! text-white text-sm font-medium shadow-none hover:shadow-xs py-2.5! md:py-2.5!"
          />
        </div>
      </div>
    </RootDialog>
  );
}
