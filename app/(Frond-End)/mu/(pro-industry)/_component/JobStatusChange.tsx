import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import { useStatusUpdateForJobsMutation } from "@/feature/slice/jobs/jobSlice";
import toast from "react-hot-toast";
import { JobItem } from "./JobListCard";

function JobStatusChange({ value, row }: { value: string; row: JobItem }) {
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useStatusUpdateForJobsMutation();
  // Handle single job row status update
  const handleStatusChange = async (
    jobId: number | string,
    newStatus: string,
  ) => {
    const payload: { status: string; rejection_reason?: string } = {
      status: newStatus,
    };

    try {
      const res = await updateStatus({
        id: jobId,
        data: payload,
      }).unwrap();
      toast.success(res?.message || `Job status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Status update error:", error);
      toast.error(error?.data?.message || "Failed to update job status");
    }
  };
  const currentVal =
    value?.toLowerCase() === "active"
      ? "published"
      : value?.toLowerCase() || "published";

  const getBadgeStyle = (status: string) => {

    switch (status) {
      case "published":
      case "active":
        return "bg-buttonColor/15 text-buttonColor border-[#b2e7e2] [&_svg]:text-buttonColor";
      case "archive":
      case "archived":
        return "bg-[#fef4d8] text-[#d97706] border-[#fde68a] [&_svg]:text-[#d97706]";
      case "rejected":
        return "bg-[#fee2e2] text-[#ef4444] border-[#fecaca] [&_svg]:text-[#ef4444]";
      case "expired":
        return "bg-redColor/15 text-redColor border-redColor [&_svg]:text-redColor";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };
  return (
    <div className="flex justify-center px-2 py-2">
      <div className="w-30">
        <SelecteInputField
          value={currentVal}
          onChange={(val) => handleStatusChange(row.id, val)}
          disabled={isUpdatingStatus}
          options={[
            { value: "published", label: "Active" },
            { value: "archive", label: "Archive" },
            { value: "expired", label: "Expired" },
            { value: "rejected", label: "Rejected" },
          ]}
          className={`h-9 text-xs md:text-sm font-medium rounded-lg shadow-none border-0!  ${getBadgeStyle(currentVal)}`}
        />
      </div>
    </div>
  );
}

export default JobStatusChange;
