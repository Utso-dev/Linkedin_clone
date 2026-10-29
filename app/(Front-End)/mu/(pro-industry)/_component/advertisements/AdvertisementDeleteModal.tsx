"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import RootDialog from "@/components/reusable/RootDialog";
import { useDeleteAdvertisementMutation } from "@/feature/slice/jobs/advertisementSlice";
import React from "react";
import toast from "react-hot-toast";

interface AdvertisementDeleteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  adId?: string | number | null;
}

function AdvertisementDeleteModal({
  open,
  setOpen,
  adId,

}: AdvertisementDeleteModalProps) {
  const [deleteAdvertisement, { isLoading }] = useDeleteAdvertisementMutation();

  const handleDelete = async () => {
    if (!adId) {
      toast.error("Invalid product advertisement ID");
      return;
    }

    try {
      const response = await deleteAdvertisement(adId).unwrap();
      toast.success(
        response?.message || "Product advertisement deleted successfully",
      );
      setOpen(false);
    
    } catch (error: any) {
      console.error("Error deleting advertisement:", error);
      toast.error(
        error?.data?.message ||
          "Failed to delete advertisement. Please try again.",
      );
    }
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="sm:max-w-md rounded-xl"
      ariaLabel="Delete Product"
      ariaDescription="Confirm if you want to delete this product advertisement"
    >
      <div className="p-6">
        <h3 className="text-base sm:text-lg font-semibold text-headerColor pr-6">
          Did you want to Delete this Product?
        </h3>
        <p className="text-xs sm:text-sm text-descriptionColor mt-1">
          If Yes Press &ldquo;Yes, Continue&rdquo; Otherwise Press &ldquo;No,
          Don&apos;t Delete&rdquo;
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

export default AdvertisementDeleteModal;