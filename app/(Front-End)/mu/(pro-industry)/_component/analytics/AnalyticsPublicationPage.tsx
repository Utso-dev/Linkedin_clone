"use client";

import GraphSkeleton from "@/components/reusable/All Skleton/GraphSkeleton";
import StateCardSkleton from "@/components/reusable/All Skleton/StateCardSkleton";
import CommonAnalyticsGraph, {
  GraphSeriesItem,
} from "@/components/reusable/CommonAnalyticsGraph";
import CommonStateCard from "@/components/reusable/CommonStateCard";
import SelecteInputField, {
  Option,
} from "@/components/reusable/InputFiled/SelecteInputField";
import { useGetPublicationsInsightQuery } from "@/feature/slice/jobs/analyticSlice";
import {
  ActiveIcon,
  ApplicantIcon,
  LikeIcon,
  OpenEyeIcon,
} from "@/public/svgIcons/Icons";
import { useEffect, useState } from "react";

const GRAPH_SERIES: GraphSeriesItem[] = [
  { dataKey: "publications_views", name: "Publication Views", color: "#0CAF60" },
  { dataKey: "publications_likes", name: "Publication Like", color: "#FFC837" },
];

const RANGE_OPTIONS: Option[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function AnalyticsPublicationPage() {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetPublicationsInsightQuery({});

  const analyticsData = response?.data;
  const cards = analyticsData?.cards;
  const graph = analyticsData?.graph;

  const [activeRange, setActiveRange] = useState<"weekly" | "monthly">(
    "weekly",
  );

  // Keep active range in sync with response
  useEffect(() => {
    if (graph?.active === "weekly" || graph?.active === "monthly") {
      setActiveRange(graph.active);
    }
  }, [graph?.active]);

  // Current graph data points for selected period
  const chartData = graph?.[activeRange];

  // 4 Metric State Cards configuration
  const cardItems = [
    {
      id: "total_publications",
      title: "Total Publications",
      total: cards?.total_publications?.total ?? 0,
      growthPercentage: cards?.total_publications?.growth_percentage,
      badgeText: cards?.total_publications?.growth
        ? cards.total_publications.growth.split(" ")[0]
        : undefined,
      isPositive: cards?.total_publications?.is_positive ?? true,
      growthText: "From last month",
      icon: ApplicantIcon,
    },
    {
      id: "active_publications",
      title: "Active Publications",
      total: cards?.active_publications?.total ?? 0,
      growthPercentage: cards?.active_publications?.growth_percentage,
      badgeText: cards?.active_publications?.growth
        ? cards.active_publications.growth.split(" ")[0]
        : undefined,
      isPositive: cards?.active_publications?.is_positive ?? true,
      growthText: "From last month",
      icon: ActiveIcon,
    },
    {
      id: "publications_views",
      title: "Publication Views",
      total: cards?.publications_views?.total ?? 0,
      growthPercentage: cards?.publications_views?.growth_percentage,
      badgeText: cards?.publications_views?.growth
        ? cards.publications_views.growth.split(" ")[0]
        : undefined,
      isPositive: cards?.publications_views?.is_positive ?? true,
      growthText: "From last month",
      icon: OpenEyeIcon,
    },
    {
      id: "total_publications_like",
      title: "Total Like",
      total: cards?.total_publications_like?.total ?? 0,
      growthPercentage: cards?.total_publications_like?.growth_percentage,
      badgeText: cards?.total_publications_like?.growth
        ? cards.total_publications_like.growth.split(" ")[0]
        : undefined,
      isPositive: cards?.total_publications_like?.is_positive ?? true,
      growthText: "From last month",
      icon: LikeIcon,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StateCardSkleton />
        <GraphSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-borderColor/80 p-8 text-center space-y-3">
        <p className="text-red-500 font-semibold text-sm">
          Failed to load publications insights analytics.
        </p>
        <button
          onClick={() => refetch()}
          className="text-xs bg-primaryColor text-white px-4 py-2 rounded-lg hover:bg-primaryColor/90 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 4 State Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cardItems.map((item) => (
          <CommonStateCard
            key={item.id}
            title={item.title}
            total={item.total}
            growthPercentage={item.growthPercentage}
            badgeText={item.badgeText}
            isPositive={item.isPositive}
            growthText={item.growthText}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Main Publications Insights Card */}
      <div className="bg-white rounded-2xl border border-borderColor/80 p-5 sm:p-6 shadow-xs">
        {/* Header handled directly at root */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-headerColor">
              {graph?.title || "Publications Insights"}
            </h2>
            {/* Dynamic Series Legend matching design */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2 text-xs font-medium text-grayColor1">
              {GRAPH_SERIES.map((s) => (
                <div key={s.dataKey} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-gray-600 font-medium">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Range Dropdown using SelecteInputField */}
          <div className="w-32 self-start sm:self-auto">
            <SelecteInputField
              value={activeRange}
              onChange={(val) => setActiveRange(val as "weekly" | "monthly")}
              options={RANGE_OPTIONS}
              className="h-9 text-xs font-medium rounded-lg border-borderColor bg-white"
            />
          </div>
        </div>

        {/* Lightweight, 60fps smooth animated Graph Component */}
        <CommonAnalyticsGraph
          data={chartData}
          series={GRAPH_SERIES}
          subtitle={graph?.subtitle || "Publications Insights Per Month"}
        />
      </div>
    </div>
  );
}
