import RootDialog from "@/components/reusable/RootDialog";
import { ApplicantItemType } from "@/lib/type";
import toast from "react-hot-toast";

function ApplicantDeleteModal({
  open,
  setOpen,
  applicantToDelete,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  applicantToDelete: ApplicantItemType | null;
}) {
  return (
    <RootDialog open={open} setOpen={setOpen} ariaLabel="Delete Applicant">
      {applicantToDelete && (
        <div className="p-6">
          <h3 className="text-base font-bold text-headerColor mb-2">
            Remove Applicant
          </h3>
          <p className="text-sm text-descriptionColor mb-5">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-headerColor">
              {applicantToDelete.applicant_name}
            </span>{" "}
            (#{applicantToDelete.application_id}) from this job application
            list?
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                toast.success("Applicant removed successfully");
                setOpen(false);
              }}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </RootDialog>
  );
}

export default ApplicantDeleteModal;
