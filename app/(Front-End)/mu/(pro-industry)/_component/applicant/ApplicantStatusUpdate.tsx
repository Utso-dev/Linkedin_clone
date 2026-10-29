import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStatusUpdateForApplicantsMutation } from "@/feature/slice/jobs/jobSlice";
import { getBadgeConfig } from "@/public/demoData/RealData";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewed" },
  { value: "interviewed", label: "Interview" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "offered", label: "Offered" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];
function ApplicantStatusUpdate({
  row,
  disabled,
  className,
}: {
  row: any;
  className?: string;
  disabled?: boolean;
}) {
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useStatusUpdateForApplicantsMutation();
  // Handle status update
  const handleStatusChange = async (
    applicationId: string | number,
    newStatus: string,
  ) => {
    if (disabled || isUpdatingStatus) return;

    try {
      const res = await updateStatus({
        application_id: applicationId,
        data: { status: newStatus },
      }).unwrap();
      toast.success(res?.message || `Status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Status update error:", error);
      toast.error(error?.data?.message || "Failed to update applicant status");
    }
  };

 
  const badge = getBadgeConfig(row?.status);
  const buttonClassName = `px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center justify-between gap-1.5 transition-colors cursor-pointer outline-none min-w-27.5 ${badge.colorClass}`

  return (
    <div className={className || "flex justify-center px-4 py-2"}>
     <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              disabled={isUpdatingStatus}
              className={buttonClassName}
            >
              <span>{badge.label}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-36 bg-white shadow-lg z-50"
          >
            {STATUS_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => handleStatusChange(row.id, opt.value)}
                className="text-xs cursor-pointer py-1.5"
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}

export default ApplicantStatusUpdate;
