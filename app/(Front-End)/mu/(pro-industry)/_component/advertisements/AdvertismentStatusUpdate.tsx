import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateAdvertisementStatusMutation } from "@/feature/slice/jobs/advertisementSlice";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "draft", label: "Draft" },
];

function AdvertismentStatusUpdate({
  row,
  disabled = false,
  className,
}: {
  row: { id: string | number; status?: string };
  disabled?: boolean;
  className?: string;
}) {
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateAdvertisementStatusMutation();

  const status = row.status?.toLowerCase() || "draft";
  const statusConfig = {
    active: {
      label: "Active",
      className:
        "bg-lightGreenColor2/10 text-lightGreenColor2 border-lightGreenColor2/30 hover:bg-lightGreenColor2/20",
    },
    inactive: {
      label: "Inactive",
      className:
        "bg-redColor/10 text-redColor border-redColor/30 hover:bg-redColor/20",
    },
    draft: {
      label: "Draft",
      className:
        "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
    },
  }[status as "active" | "inactive" | "draft"] || {
    label: status,
    className: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
  };

  const handleStatusChange = async (newStatus: string) => {
    if (disabled || isUpdatingStatus || newStatus === status) return;

    try {
      const response = await updateStatus({
        id: row.id,
        data: { status: newStatus },
      }).unwrap();
      toast.success(response?.message || `Status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Advertisement status update error:", error);
      toast.error(
        error?.data?.message || "Failed to update advertisement status",
      );
    }
  };

  const buttonClassName = `inline-flex min-w-20.5 items-center justify-between gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium capitalize outline-none transition-colors ${
    disabled || isUpdatingStatus
      ? "cursor-not-allowed opacity-60"
      : "cursor-pointer"
  } ${statusConfig.className}`;

  return (
    <div className={className || "flex justify-center px-3"}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={disabled || isUpdatingStatus}
            className={buttonClassName}
          >
              <span>{statusConfig.label}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="z-50 w-36 bg-white shadow-lg"
        >
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className="cursor-pointer py-1.5 text-xs"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default AdvertismentStatusUpdate;