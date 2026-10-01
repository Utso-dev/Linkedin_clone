import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStatusUpdateForApplicantsMutation } from "@/feature/slice/jobs/jobSlice";
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
  className,
}: {
  row: any;
  className?: string;
}) {
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useStatusUpdateForApplicantsMutation();
  // Handle status update
  const handleStatusChange = async (
    applicationId: string | number,
    newStatus: string,
  ) => {
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

  // Status badge styling helper
  const getBadgeConfig = (status: string) => {
    const s = status?.toLowerCase() || "";
    switch (s) {
      case "accepted":
      case "hired":
        return {
          label: "Hired",
          colorClass:
            "bg-[#ecfdf5] text-[#10b981] border-[#a7f3d0] hover:bg-[#d1fae5] [&_svg]:text-[#10b981]",
        };
      case "pending":
        return {
          label: "Pending",
          colorClass:
            "bg-[#fefce8] text-[#d97706] border-[#fde68a] hover:bg-[#fef9c3] [&_svg]:text-[#d97706]",
        };
      case "reviewing":
      case "in progress":
        return {
          label: "Reviewed",
          colorClass:
            "bg-[#fefce8] text-[#d97706] border-[#fde68a] hover:bg-[#fef9c3] [&_svg]:text-[#d97706]",
        };
      case "interview":
      case "interviewed":
        return {
          label: "Interview",
          colorClass:
            "bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe] hover:bg-[#dbeafe] [&_svg]:text-[#3b82f6]",
        };
      case "shortlisted":
        return {
          label: "Shortlisted",
          colorClass:
            "bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe] hover:bg-[#dbeafe] [&_svg]:text-[#2563eb]",
        };
      case "offered":
        return {
          label: "Offered",
          colorClass:
            "bg-[#f5f3ff] text-[#8b5cf6] border-[#ddd6fe] hover:bg-[#ede9fe] [&_svg]:text-[#8b5cf6]",
        };
      case "rejected":
        return {
          label: "Rejected",
          colorClass:
            "bg-[#fef2f2] text-[#ef4444] border-[#fecaca] hover:bg-[#fee2e2] [&_svg]:text-[#ef4444]",
        };
      default:
        return {
          label: status
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : "Pending",
          colorClass:
            "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 [&_svg]:text-gray-700",
        };
    }
  };
  const badge = getBadgeConfig(row?.status);
  return (
    <div className={className || "flex justify-center px-4 py-2"}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={isUpdatingStatus}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center justify-between gap-1.5 transition-colors cursor-pointer outline-none min-w-27.5 ${badge.colorClass}`}
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
              onClick={() => handleStatusChange(row.id || row.id, opt.value)}
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
