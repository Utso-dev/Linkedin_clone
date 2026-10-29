"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import RootDialog from "@/components/reusable/RootDialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuickApplyModal from "./QuickApplyModal";
import { ApplyActionType } from "./JobApplyAaction";

interface ApplyTypeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
 
  jobData?: ApplyActionType;
}

function ApplyTypeModal({
  open,
  setOpen,
  jobData
}: ApplyTypeModalProps) {
  const router = useRouter();
  const [quickApplyOpen, setQuickApplyOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuickApplyOpen(false);
    }
  }, [open]);

  const handleOpenQuickApply = () => {
    setQuickApplyOpen(true);
  };

  const handleCloseQuickApply = (isOpen: boolean) => {
    setQuickApplyOpen(isOpen);
    if (!isOpen) {
      setOpen(false);
    }
  };

  return (
    <>
      <RootDialog
        open={open && !quickApplyOpen}
        setOpen={setOpen}
        className="max-w-130! "
      >
        <div className="p-4 md:p-6">
          <h4 className="font-semibold text-lg md:text-xl text-headerColor pb-7 md:pb-10">
            Apply for this Job?
          </h4>
          <p className="text-base text-grayColor1 pb-6 md:pb-8">
            Choose how you'd like to apply for this position. Both options are
            easy and secure.
          </p>

          <div className="flex justify-end gap-2">
            <ButtonReuseable
              className="bg-white! py-2! px-4! text-grayColor1! border border-gray2Color!"
              title="Custom Apply"
              onClick={() => {
                setOpen(false);
                if (jobData?.jobId) {
                  router.push(`/mu/jobs-details/${jobData.jobId}/custom-apply`);
                }
              }}
            />
            <ButtonReuseable
              className="px-4! py-2! bg-primaryColor!"
              title="Quick Apply"
              onClick={handleOpenQuickApply}
            />
          </div>
        </div>
      </RootDialog>

      <QuickApplyModal
        open={quickApplyOpen}
        setOpen={handleCloseQuickApply}
        jobData={jobData}
      />
    </>
  );
}

export default ApplyTypeModal;
