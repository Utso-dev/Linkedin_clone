"use client";

import {
  SettingIcon,
} from "@/public/svgIcons/Icons";
import { settingsMenuItems } from "@/components/reusable/Allmenus";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface BottomNavProps {
  onItemClick?: () => void;
}

export default function MainPageBottomNav({ onItemClick }: BottomNavProps) {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (settingsMenuItems.some((item) => pathname.startsWith(item.slug))) {
      setIsSettingsOpen(true);
    }
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  return (
    <div className="space-y-1 select-none">
      {/* 1. Apply for a Position */}
      {/* <Link
        href="/mu/jobs/apply"
        onClick={onItemClick}
        className={`flex items-center gap-3 p-2 text-sm rounded-md transition ${
          isActive("/mu/jobs/apply")
            ? "text-headerColor bg-lightGreenColor font-medium"
            : "text-grayColor1 hover:text-headerColor hover:bg-gray-50"
        }`}
      >
        <Briefcase className="w-4.5 h-4.5" />
        <span>Apply for a position</span>
      </Link> */}

      {/* 2. Settings Collapsible Parent */}
      <div>
        <button
          type="button"
          onClick={() => setIsSettingsOpen((prev) => !prev)}
          className={`w-full flex items-center justify-between p-2 text-sm rounded-md transition cursor-pointer ${
            settingsMenuItems.some((item) => isActive(item.slug))
              ? "text-headerColor font-medium"
              : "text-grayColor1 hover:text-headerColor hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <SettingIcon className="w-4.5 h-4.5" />
            <span>Settings</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isSettingsOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Settings Submenu Items */}
        {isSettingsOpen && (
          <div className="mt-1 space-y-1 pl-2">
            {settingsMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.slug);

              return (
                <Link
                  key={item.slug}
                  href={item.slug}
                  onClick={onItemClick}
                  className={`flex items-center gap-2.5 p-2 text-sm rounded-md transition ${
                    active
                      ? "bg-lightGreenColor text-headerColor font-medium"
                      : "text-grayColor1 hover:text-headerColor hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
