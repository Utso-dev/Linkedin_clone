import React from "react";
import AnalyticsMenue from "../../(pro-industry)/_component/analytics/AnalyticsMenue";
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
      title: "Company Posts",
      href: `/mu/industry/${id}`,
    },
    {
      id: 2,
      title: "Job post",
      href: `/mu/industry/${id}/job-post`,
    },
    {
      id: 3,
      title: "Products advertisement",
      href: `/mu/industry/${id}/products-advertisement`,
    },
   
  ];
  return (
    <div className="py-10 md:py-14 xl:py-20">
      <IndustryHeroSection userId={id} />
      <AnalyticsMenue menuData={menuData} initialPath={`/mu/industry/${id}`} />
      {children}
    </div>
  );
}

export default layout;
