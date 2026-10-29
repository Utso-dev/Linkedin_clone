"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePublicationStatusUpdateMutation } from "@/feature/slice/jobs/publicationSlice";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "active", label: "Active", dotColor: "bg-[#25C86D]" },
  { value: "inactive", label: "Inactive", dotColor: "bg-[#EB3D4D]" },
  { value: "draft", label: "Draft", dotColor: "bg-[#E59800]" },
];

export default function PublicationStatusUpdate({
  row,
  disabled = false,
  className,
}: {
  row: { id: string | number; status?: string };
  disabled?: boolean;
  className?: string;
}) {
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    usePublicationStatusUpdateMutation();

  const status = row.status?.toLowerCase() || "draft";

  const statusConfig = {
    active: {
      label: "Active",
      dotColor: "bg-[#25C86D]",
      className:
        "bg-[#E6F8F6] text-[#25C86D] border-[#25C86D]/30 hover:bg-[#E6F8F6]/80",
    },
    inactive: {
      label: "Inactive",
      dotColor: "bg-[#EB3D4D]",
      className:
        "bg-[#FEECEC] text-[#EB3D4D] border-[#EB3D4D]/30 hover:bg-[#FEECEC]/80",
    },
    draft: {
      label: "Draft",
      dotColor: "bg-[#E59800]",
      className:
        "bg-[#FEF6E6] text-[#E59800] border-[#E59800]/30 hover:bg-[#FEF6E6]/80",
    },
  }[status as "active" | "inactive" | "draft"] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    dotColor: "bg-gray-400",
    className: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
  };

  const handleStatusChange = async (newStatus: string) => {
    if (disabled || isUpdatingStatus || newStatus === status) return;

    try {
      const response = await updateStatus({
        id: row.id,
        status: newStatus,
      }).unwrap();
      toast.success(response?.message || `Status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Publication status update error:", error);
      toast.error(
        error?.data?.message || "Failed to update publication status",
      );
    }
  };

  return (
    <div className={className || "flex justify-center px-2"}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={disabled || isUpdatingStatus}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-sm font-medium capitalize outline-none transition-colors ${
              disabled || isUpdatingStatus
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
            } ${statusConfig.className}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusConfig.dotColor}`}
            />
            <span>{statusConfig.label}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-90" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="z-50 w-32 bg-white shadow-lg rounded-lg border border-borderColor/60 p-1"
        >
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className="cursor-pointer py-1.5 px-2 text-sm flex items-center gap-2 hover:bg-gray-50 rounded"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${option.dotColor}`} />
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
