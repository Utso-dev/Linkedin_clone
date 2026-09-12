"use client";

import {
  JobsIcon,
  LineChartIcon,
  RecommendedJobIcon,
  SaveJobIcon,
} from "@/public/svgIcons/Icons";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SubscriptionCard from "../../../(subscription)/_component/SubscriptionCard";

function JobsLeftSidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const [isMobile, setOpenMobile] = useState(false);

  const menuItems = [
    {
      label: "All Jobs",
      slug: "/mu/jobs",
      icon: JobsIcon,
    },
    {
      label: "Recommended Jobs",
      slug: "/mu/jobs/recommended-jobs",
      icon: RecommendedJobIcon,
    },
    {
      label: "Recently added jobs.",
      slug: "/mu/jobs/recent-jobs",
      icon: PlusIcon,
    },
    {
      label: "Saved job",
      slug: "/mu/jobs/saved-jobs",
      icon: SaveJobIcon,
    },
  ];

  const isActive = (href: string): boolean => {
    if (href === "/mu/jobs") {
      return pathname === "/mu/jobs";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col justify-between min-h-130 h-full">
      {/* Top Navigation */}
      <div>
        <h3 className="text-lg border-b py-3 border-[#D2D2D5] font-semibold text-headerColor">
          Jobs
        </h3>

        <div className="mt-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.slug}
              href={item.slug}
              onClick={onItemClick}
              className={`flex items-center gap-3 p-2 text-sm rounded-md transition ${
                isActive(item.slug)
                  ? "text-headerColor bg-lightGreenColor font-medium"
                  : "text-grayColor1 hover:text-headerColor hover:bg-gray-50"
              }`}
            >
              {item.icon && <item.icon className="w-4.5 h-4.5" />}
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Common Navigation */}
      <div className="pt-6 mt-auto ">
        <Link
          href={`/mu/jobs/my-applications`}
          onClick={onItemClick}
          className={`flex items-center gap-3 p-2 text-sm rounded-md transition ${
            isActive(`/mu/jobs/my-applications`)
              ? "text-headerColor bg-lightGreenColor font-medium"
              : "text-grayColor1 hover:text-headerColor hover:bg-gray-50"
          }`}
        >
          <LineChartIcon className="w-4.5 h-4.5" />
          My Applications
        </Link>
      </div>
      <div className="pt-6 mt-auto ">
        <SubscriptionCard />
      </div>
    </div>
  );
}

export default JobsLeftSidebar;
