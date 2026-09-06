"use client";

import Breadcrumb from "@/components/reusable/dashboard/BreadCumb";
import Image from "next/image";
import { IoMdNotifications } from "react-icons/io";
import { Menu, X } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useGetMyProfileQuery } from "@/feature/slice/user/userSlice";

export default function TopHeader() {
  const { openMobile, setOpenMobile } = useSidebar();

  const { data, error, isLoading, isSuccess } = useGetMyProfileQuery("");
  const profile = data?.data;

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] flex h-16 items-center justify-between border-b bg-white px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpenMobile(!openMobile)}
          className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none md:hidden"
          aria-label="Toggle navigation menu"
        >
          {openMobile ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        <Breadcrumb />
      </div>

      <div className="flex items-center justify-center gap-5">
        <IoMdNotifications className="h-5 w-5 text-gray-600" />

        <div className="flex items-center gap-2">
          <Image
            src={profile?.profile_image_url || "/images/default-avatar.png"}
            alt="Admin Image"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
            priority
          />
        </div>
      </div>
    </header>
  );
}
