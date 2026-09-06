"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const routeNames: Record<string, string> = {
  dashboard: "Dashboard",

  "user-management": "User Management",
  "basic-user": "Basic Users",

  "cleaner-request": "Cleaner Request",
  booking: "Bookings",
  payments: "Payments",
  jobAppruve: "Job Approvals",
  "danger-request": "Danger Request",

  settings: "Settings",
  analytics: "Analytics",
  subscription: "Subscription",
};

const nonClickableRoutes = ["user-management", "academia"];

export default function Breadcrumb() {
  const pathname = usePathname();

  const parts = pathname
    .split("/")
    .filter(Boolean)
    .filter((part) => !/^\d+$/.test(part));

  return (
    <div className="flex items-center gap-2 text-sm">
      {parts.map((part, index) => {
        const href = "/" + parts.slice(0, index + 1).join("/");
        const isLast = index === parts.length - 1;

        const label =
          routeNames[part] ||
          part
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

        const isClickable = !isLast && !nonClickableRoutes.includes(part);

        return (
          <div key={href} className="flex items-center gap-2">
            {isClickable ? (
              <Link href={href} className="text-[#6B7280] hover:text-[#111827]">
                {label}
              </Link>
            ) : (
              <span
                className={
                  isLast ? "font-medium text-[#111827]" : "text-[#6B7280]"
                }
              >
                {label}
              </span>
            )}

            {!isLast && (
              <MdKeyboardDoubleArrowRight className="h-4 w-4 text-[#9CA3AF]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
