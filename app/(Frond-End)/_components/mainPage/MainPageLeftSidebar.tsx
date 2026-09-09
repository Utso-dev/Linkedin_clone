"use client";

import {
  GroupUserIcon,
  MultiUserIcon,
  PlusUserIcon,
  SingleUserIcon,
} from "@/public/svgIcons/Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SubscriptionCard from "../../mu/(jobs)/jobs/_component/SubscriptionCard";
import MainPageBottomNav from "./MainPageBottomNav";

function MainPageLeftSidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const [isMobile, setOpenMobile] = useState(false);

  const menuItems = [
    {
      label: "My Connections",
      slug: "/mu/my-network/my-connection",
      icon: MultiUserIcon,
    },
    {
      label: "Connection Requests",
      slug: "/mu/my-network/connection-requests",
      icon: PlusUserIcon,
    },
    {
      label: "Following & Followers",
      slug: "/mu/my-network/following",
      icon: SingleUserIcon,
    },
    {
      label: "Groups",
      slug: "/mu/my-network/groups",
      icon: GroupUserIcon,
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
          Manage Network
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
        <MainPageBottomNav onItemClick={onItemClick} />
      </div>
      <div className="pt-6">
        <SubscriptionCard />
      </div>
    </div>
  );
}

export default MainPageLeftSidebar;
