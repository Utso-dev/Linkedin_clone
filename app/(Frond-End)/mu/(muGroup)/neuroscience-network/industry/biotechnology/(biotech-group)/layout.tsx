"use client";

import {
  useGetBiotechnologyQuery,
  useGetProductFeedQuery,
} from "@/feature/slice/biotechnologySlice";
import { LayoutGrid, Menu } from "lucide-react";
import React from "react";
import {
  IndustryFeedTabItem,
  IndustryFeedTabs,
  IndustryHeader,
} from "../../_components";

function NeuroscienceBioTechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: biotechData } = useGetBiotechnologyQuery({
    network_type: "neuroscience",
    industry_type: "biotechnology",
    view: "overview",
  });
  const { data: feedData } = useGetProductFeedQuery({
    network_type: "neuroscience",
    industry_type: "biotechnology",
    view: "all",
    per_page: 12,
  });

  const raw = biotechData?.data;
  const sectionsCount = raw?.length || raw?.sections?.length || 0;
  const productsCount =
    feedData?.pagination?.total ||
    feedData?.total_products ||
    feedData?.total ||
    0;

  const tabs: IndustryFeedTabItem[] = [
    {
      id: "all-products",
      label: "All Products View",
      href: "/mu/neuroscience-network/industry/biotechnology",
      icon: <LayoutGrid className="w-4 h-4" />,
      count: productsCount,
    },
    {
      id: "sections",
      label: "Section-wise View",
      href: "/mu/neuroscience-network/industry/biotechnology/sections",
      icon: <Menu className="w-4 h-4" />,
      count: sectionsCount,
    },
  ];

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
        initialPath="/mu/neuroscience-network/industry/biotechnology"
        tabs={tabs}
      />

      {children}
    </div>
  );
}

export default NeuroscienceBioTechLayout;
