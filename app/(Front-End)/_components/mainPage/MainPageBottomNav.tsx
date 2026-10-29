"use client";

import { settingsMenuItems } from "@/components/reusable/Allmenus";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavProps {
  onItemClick?: () => void;
}

export default function MainPageBottomNav({ onItemClick }: BottomNavProps) {
  const pathname = usePathname();

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

      <div className="space-y-1">
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
    </div>
  );
}
