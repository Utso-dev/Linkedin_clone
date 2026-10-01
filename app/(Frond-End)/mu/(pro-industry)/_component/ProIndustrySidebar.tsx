"use client";

import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import {
  AdvertisementIcon,
  BarChartIcon,
  DashboardIcon,
  JobsIcon,
  MessageIcon,
  PencileIcon,
  SaveJobIcon,
} from "@/public/svgIcons/Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SubscriptionCard from "../../(subscription)/_component/SubscriptionCard";
import ProIndustrySetting from "./ProIndustrySetting";

function ProIndustrySidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const [isMobile, setOpenMobile] = useState(false);
  const { data, isLoading, isError } = useGetUserProfileQuery("Profile");

  const menuItems = [
    {
      label: "Industry Profile",
      slug: `/mu/industry-profile/${data?.user?.company_id}`,
      icon: DashboardIcon,
    },
    {
      label: "Recruiter Dashboard",
      slug: "/mu/recruiter-dashboard",
      icon: DashboardIcon,
    },
    {
      label: "Advertisement",
      slug: "/mu/advertisement",
      icon: AdvertisementIcon,
    },
    {
      label: "Job Listing",
      slug: "/mu/job-listing",
      icon: JobsIcon,
    },
    {
      label: "Analytics",
      slug: "/mu/analytics",
      icon: BarChartIcon,
    },
    {
      label: "Message",
      slug: "/mu/message",
      icon: MessageIcon,
    },
    {
      label: "Saved job",
      slug: "/mu/saved-jobs",
      icon: SaveJobIcon,
    },
    {
      label: "Post a job position",
      slug: "/mu/post-job-position",
      icon: PencileIcon,
    },
  ];

  const handleLinkClick = () => {
    onItemClick?.();
    if (isMobile) setOpenMobile(false);
  };

  const isActive = (href: string): boolean => {
    if (href === "/mu/my-network/my-connection") {
      return pathname === "/mu/my-network/my-connection";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-170px)] h-full">
      {/* Top Navigation */}
      <div>
        <h3 className="text-lg border-b py-3 border-[#D2D2D5] font-semibold text-headerColor">
          Pro Industry Dashboard
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
      <div className="pt-6  ">
        <ProIndustrySetting onItemClick={onItemClick} />
      </div>
      <div className="pt-6">
        <SubscriptionCard />
      </div>
    </div>
  );
}

export default ProIndustrySidebar;
