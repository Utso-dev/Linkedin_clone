"use client";
import MainPageLeftSidebar from "@/app/(Frond-End)/_components/mainPage/MainPageLeftSidebar";
import CustomBackButton from "@/components/reusable/CustomBackButton";
import { cn } from "@/lib/utils";
import { RightArrowIcon } from "@/public/svgIcons/Icons";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";

function NetworkSidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div>
      <div className="lg:hidden">
        <div className="mb-4">
          <CustomBackButton className="text-base" iconClassName="w-4 h-4" />
        </div>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label="toggle-manage-network-sidebar"
          aria-controls="manage-network-sidebar"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-base w-full pb-3 border-b border-borderColor flex justify-between items-center font-semibold cursor-pointer text-primaryColor"
        >
          Manage Network <RightArrowIcon className="w-6 h-6" />
        </button>
      </div>

      <div
        className={cn(
          "fixed top-0 left-0 z-999 h-screen w-full backdrop-blur-xs transform transition-transform duration-300 ease-in-out lg:hidden",
          menuOpen
            ? "translate-x-0 bg-blackColor/20 opacity-100 "
            : "-translate-x-full opacity-0  pointer-events-none",
        )}
      >
        <div
          id="manage-network-sidebar"
          className="absolute top-0 left-0 h-full max-w-[320px] w-[80%] bg-whiteColor p-4 shadow-xl"
        >
          <button
            type="button"
            aria-label="close-manage-network"
            className="absolute top-4 right-4 z-10 text-headerColor"
            onClick={() => setMenuOpen(false)}
          >
            <HiX className="text-2xl" />
          </button>
          <MainPageLeftSidebar onItemClick={() => setMenuOpen(false)} />
        </div>
      </div>
      <div className="mt-3 lg:mt-0">{children}</div>
    </div>
  );
}

export default NetworkSidebarLayout;
