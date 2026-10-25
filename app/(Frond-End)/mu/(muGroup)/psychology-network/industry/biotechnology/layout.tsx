"use client";

import Search from "@/components/reusable/Search";
import {
  useGetBiotechnologyQuery,
  useGetProductFeedQuery,
} from "@/feature/slice/biotechnologySlice";
import { LayoutGrid, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IndustryHeader } from "../_components";

function BioTechLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: biotechData } = useGetBiotechnologyQuery("biotechnology");
  const { data: feedData } = useGetProductFeedQuery({
    network_type: "psychology",
    industry_type: "biotechnology",
    view: "all",
    per_page: 12,
  });

  const isSectionsActive = pathname.includes("/biotechnology/sections");
  const isAllProductsActive = !isSectionsActive;

  const sectionsCount = Array.isArray(biotechData?.data)
    ? biotechData.data.length
    : biotechData?.data?.sections?.length || 2;

  const productsCount =
    feedData?.pagination?.total || feedData?.total_products || feedData?.total;

  return (
    <div className="w-full flex flex-col">
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden md:block">
        <IndustryHeader
          title="Biotechnology"
          description="Explore the latest biotech equipment releases advancing brain health research and treatment."
        />
      </div>

      {/* Navigation Menu and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 mb-2">
        {/* Left Tabs */}
        <div className="flex items-center p-1 bg-sectionColor rounded-lg gap-1 self-start sm:self-auto">
          <Link
            href="/mu/psychology-network/industry/biotechnology"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              isAllProductsActive
                ? "bg-white text-primaryColor"
                : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <LayoutGrid
              className={`w-4 h-4 ${
                isAllProductsActive ? "text-primaryColor" : "text-slate-500"
              }`}
            />
            <span>All Products View</span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                isAllProductsActive
                  ? "bg-[#E0F2FE] text-primaryColor"
                  : "bg-[#E2E8F0] text-slate-500"
              }`}
            >
              {productsCount}
            </span>
          </Link>

          <Link
            href="/mu/psychology-network/industry/biotechnology/sections"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              isSectionsActive
                ? "bg-white text-primaryColor "
                : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <Menu
              className={`w-4 h-4 ${
                isSectionsActive ? "text-primaryColor" : "text-slate-500"
              }`}
            />
            <span>Section-wise View</span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                isSectionsActive
                  ? "bg-[#E0F2FE] text-primaryColor"
                  : "bg-[#E2E8F0] text-slate-500"
              }`}
            >
              {sectionsCount}
            </span>
          </Link>
        </div>

        {/* Right Search Input */}
        <div className="w-full sm:w-72 md:w-80">
          <Search placeHolder="search by product name or id" />
        </div>
      </div>

      {children}
    </div>
  );
}

export default BioTechLayout;
