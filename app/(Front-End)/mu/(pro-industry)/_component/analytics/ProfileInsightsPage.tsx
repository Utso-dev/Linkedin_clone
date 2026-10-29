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
import { useGetProfileInsightQuery } from "@/feature/slice/jobs/analyticSlice";
import { ActiveIcon, OpenEyeIcon, PlusUserIcon } from "@/public/svgIcons/Icons";
import { useEffect, useState } from "react";

const GRAPH_SERIES: GraphSeriesItem[] = [
  { dataKey: "new_followers", name: "Net Followers", color: "#10B981" },
  { dataKey: "post_engagement", name: "Post Impression", color: "#F59E0B" },
  { dataKey: "profile_visits", name: "Profile Visit", color: "#EF4444" },
];

const RANGE_OPTIONS: Option[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function ProfileInsightsPage() {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetProfileInsightQuery({});

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

  // Card metric items configuration
  const cardItems = [
    {
      id: "new_followers",
      title: "New Followers",
      total: cards?.new_followers?.total ?? 0,
      growthPercentage: cards?.new_followers?.growth_percentage,
      badgeText: cards?.new_followers?.growth
        ? cards.new_followers.growth.split(" ")[0]
        : undefined,
      isPositive: cards?.new_followers?.is_positive ?? true,
      growthText: "From last month",
      icon: PlusUserIcon,
    },
    {
      id: "post_engagement",
      title: "Post Impression",
      total: cards?.post_engagement?.total ?? 0,
      growthPercentage: cards?.post_engagement?.growth_percentage,
      badgeText: cards?.post_engagement?.growth
        ? cards.post_engagement.growth.split(" ")[0]
        : undefined,
      isPositive: cards?.post_engagement?.is_positive ?? true,
      growthText: "From last month",
      icon: ActiveIcon,
    },
    {
      id: "profile_visits",
      title: "Profile Visit",
      total: cards?.profile_visits?.total ?? 0,
      growthPercentage: cards?.profile_visits?.growth_percentage,
      badgeText: cards?.profile_visits?.growth
        ? cards.profile_visits.growth.split(" ")[0]
        : undefined,
      isPositive: cards?.profile_visits?.is_positive ?? true,
      growthText: "From last month",
      icon: OpenEyeIcon,
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
          Failed to load profile insights analytics.
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
      {/* 3 Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

      {/* Main Profile Insights Card */}
      <div className="bg-white rounded-2xl border border-borderColor/80 p-5 sm:p-6 shadow-xs">
        {/* Header handled directly at root */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-headerColor">
              {graph?.title || "Profile Insights"}
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
          subtitle={graph?.subtitle || "Profile Insights Per Month"}
        />
      </div>
    </div>
  );
}
