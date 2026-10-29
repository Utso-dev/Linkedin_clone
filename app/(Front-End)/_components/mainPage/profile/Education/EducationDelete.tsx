"use client";
import RootDialog from "@/components/reusable/RootDialog";
import { useDeleteStudyMutation } from "@/feature/slice/user/studySlice";
import { SettingIcon } from "@/public/svgIcons/Icons";
import toast from "react-hot-toast";

function EducationDelete({
  educationId,
  setIsOpen,
  open,
}: {
  educationId: number;
  open: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const [deleteStudy, { isLoading, isError }] = useDeleteStudyMutation();
  const handleDeleteStudy = async () => {
    try {
      const result = await deleteStudy(educationId).unwrap();
      toast.success(
        result.data?.message || "Successfully deleted the education.",
      );
      setIsOpen(false);
    } catch (error) {
      
      toast.error(error?.data?.message || "Failed to delete the education.");
    }
  };
  return (
    <RootDialog open={open} setOpen={setIsOpen}>
      <div className="md:p-6 p-4">
        <div className="text-center flex flex-col items-center justify-center gap-4">
          <div className="flex justify-center items-center w-14 h-14 rounded-sm bg-redColor border border-borderColor/20 ">
            <SettingIcon className="w-7 h-7 text-whiteColor" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-redColor">
              Delete Education?
            </h2>
            <p className="text-sm text-descriptionColor  leading-[140%] mt-2">
              Are you sure you want to delete this education? You’ll no longer
              be able see post or access in this education!
            </p>
          </div>
          <div className="flex mt-6 items-center justify-center gap-3">
            <button
              className="px-6 rounded-full py-2 cursor-pointer  text-base font-semibold text-descriptionColor transition-all hover:bg-bgColor active:scale-95"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteStudy}
              disabled={isLoading}
              className="px-6 rounded-full disabled:text-descriptionColor disabled:bg-bgColor disabled:cursor-not-allowed bg-primaryColor py-2 cursor-pointer  text-base font-semibold text-white transition-all hover:bg-[#008c99] active:scale-95"
            >
              {isLoading ? "Deleting..." : "Delete Education"}
            </button>
          </div>
        </div>
      </div>
    </RootDialog>
  );
}

export default EducationDelete;
