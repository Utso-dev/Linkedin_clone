import React from "react";
import AnalyticsMenue from "../../(pro-industry)/_component/analytics/AnalyticsMenue";
import RelatedIndustry from "../../(pro-industry)/_component/RelatedIndustry";
import IndustryHeroSection from "../../(pro-industry)/industry-profile/_component/IndustryHeroSection";

async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const menuData = [
    {
      id: 1,
      title: "Posts",
      href: `/mu/industry/${id}`,
    },
    {
      id: 2,
      title: "Jobs",
      href: `/mu/industry/${id}/job-post`,
    },
    {
      id: 3,
      title: "Products",
      href: `/mu/industry/${id}/products-advertisement`,
    },
  ];
  return (
    <div className="pt-6 md:pt-8 pb-10 md:pb-14 xl:pb-20 max-w-250 mx-auto">
      <IndustryHeroSection userId={id} />
      <div className="pb-2 border-b border-borderColor">
        <AnalyticsMenue
          menuData={menuData}
          initialPath={`/mu/industry/${id}`}
        />
      </div>
      {children}
      
    </div>
  );
}

export default layout;
