"use client";

import {
  useGetBiotechnologyQuery,
  useGetProductFeedQuery,
} from "@/feature/slice/biotechnologySlice";
import { LayoutGrid, Menu } from "lucide-react";
import React, { useMemo } from "react";
import {
  IndustryFeedTabItem,
  IndustryFeedTabs,
  IndustryHeader,
} from "../../_components";

function BioTechLayout({ children }: { children: React.ReactNode }) {
  const { data: biotechData } = useGetBiotechnologyQuery("biotechnology");
  const { data: feedData } = useGetProductFeedQuery({
    network_type: "psychology",
    industry_type: "biotechnology",
    view: "all",
    per_page: 12,
  });

  const sectionsCount = Array.isArray(biotechData?.data)
    ? biotechData.data.length
    : biotechData?.data?.sections?.length || 2;

  const productsCount =
    feedData?.pagination?.total || feedData?.total_products || feedData?.total;

  const tabs: IndustryFeedTabItem[] = useMemo(
    () => [
      {
        id: "all-products",
        label: "All Products View",
        href: "/mu/psychology-network/industry/biotechnology",
        icon: <LayoutGrid className="w-4 h-4" />,
        count: productsCount,
      },
      {
        id: "sections",
        label: "Section-wise View",
        href: "/mu/psychology-network/industry/biotechnology/sections",
        icon: <Menu className="w-4 h-4" />,
        count: sectionsCount,
      },
    ],
    [productsCount, sectionsCount],
  );

  return (
    <div className="w-full flex flex-col">
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden md:block">
        <IndustryHeader
          title="Biotechnology"
          description="Explore the latest biotech equipment releases advancing brain health research and treatment."
        />
      </div>

      {/* Common Tabs Navigation and Search */}
      <IndustryFeedTabs
        initialPath="/mu/psychology-network/industry/biotechnology"
        tabs={tabs}
      />

      {children}
    </div>
  );
}

export default BioTechLayout;
