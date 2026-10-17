import React from "react";
import AnalyticsMenue from "../_component/analytics/AnalyticsMenue";

function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const menuData = [
    {
      id: 1,
      title: "Job Overview",
      href: "/mu/analytics",
    },
    {
      id: 2,
      title: "Advertisements",
      href: "/mu/analytics/advertisement",
    },
    {
      id: 3,
      title: "Profile Insights",
      href: "/mu/analytics/profile-insights",
    },
    {
      id: 4,
      title: "Publications Insights",
      href: "/mu/analytics/publications-insights",
    },
  ];
  return (
    <div className="h-full">
      <div className="pb-4">
        <h1 className="md:text-2xl text-xl font-bold text-headerColor">
          Analytics Overview
        </h1>
        <p className="text-grayColor1 text-base mt-1">
          Track your recruitment performance and engagement insights.
        </p>
      </div>
      <div className="border-b border-borderColor pb-2">
        <AnalyticsMenue menuData={menuData} initialPath="/mu/analytics" />
      </div>
      <div className="pt-4">{children}</div>
    </div>
  );
}

export default AnalyticsLayout;
