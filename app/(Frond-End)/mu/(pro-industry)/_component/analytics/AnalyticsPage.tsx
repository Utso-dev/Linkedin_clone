"use client";

import GraphSkeleton from "@/components/reusable/All Skleton/GraphSkeleton";
import StateCardSkleton from "@/components/reusable/All Skleton/StateCardSkleton";
import CommonAnalyticsGraph, {
  GraphSeriesItem,
} from "@/components/reusable/CommonAnalyticsGraph";
import CommonStateCard from "@/components/reusable/CommonStateCard";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import { useGetJobOverviewQuery } from "@/feature/slice/jobs/analyticSlice";
import {
  ActiveIcon,
  ApplicantIcon,
  OpenEyeIcon,
} from "@/public/svgIcons/Icons";
import { useEffect, useState } from "react";

const GRAPH_SERIES: GraphSeriesItem[] = [
  { dataKey: "total_applicants", name: "Total Applicant", color: "#0CAF60" },
  { dataKey: "job_views", name: "Job Views", color: "#FFC837" },
  { dataKey: "active_positions", name: "Active Positions", color: "#EB3D4D" },
];

const RANGE_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function AnalyticsPage() {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetJobOverviewQuery({});

  const overviewData = response?.data;
  const cards = overviewData?.cards;
  const graph = overviewData?.graph;

  const [activeRange, setActiveRange] = useState<"weekly" | "monthly">("weekly");

  // Sync default range if specified by graph
  useEffect(() => {
    if (graph?.active === "weekly" || graph?.active === "monthly") {
      setActiveRange(graph.active);
    }
  }, [graph?.active]);

  // Direct array from graph response
  const chartData = graph?.[activeRange] || [];

  // Card metric items configuration
  const cardItems = [
    {
      id: "job_views",
      title: "Job Views",
      total: cards?.job_views?.total ?? 0,
      growthPercentage: cards?.job_views?.growth_percentage,
      badgeText: cards?.job_views?.growth
        ? cards.job_views.growth.split(" ")[0]
        : undefined,
      isPositive: cards?.job_views?.is_positive ?? true,
      growthText: "From last month",
      icon: OpenEyeIcon,
    },
    {
      id: "total_applicants",
      title: "Total Applicant",
      total: cards?.total_applicants?.total ?? 0,
      growthPercentage: cards?.total_applicants?.growth_percentage,
      badgeText: cards?.total_applicants?.growth
        ? cards.total_applicants.growth.split(" ")[0]
        : undefined,
      isPositive: cards?.total_applicants?.is_positive ?? true,
      growthText: "From last month",
      icon: ApplicantIcon,
    },
    {
      id: "active_positions",
      title: "Active Positions",
      total: cards?.active_positions?.total ?? 0,
      growthPercentage: cards?.active_positions?.growth_percentage,
      badgeText: cards?.active_positions?.growth
        ? cards.active_positions.growth.split(" ")[0]
        : undefined,
      isPositive: cards?.active_positions?.is_positive ?? true,
      growthText: "From last month",
      icon: ActiveIcon,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <StateCardSkleton />
        <GraphSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-borderColor/80 p-8 text-center space-y-3">
        <p className="text-red-500 font-semibold text-sm">
          Failed to load job overview analytics.
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

      {/* Jobs Overview Graph Card */}
      <div className="bg-white rounded-2xl border border-borderColor/80 p-5 sm:p-6 shadow-xs">
        {/* Graph Header handled directly at root */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-headerColor">
              {graph?.title || "Jobs Overview Graph"}
            </h2>
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

          {/* Range Dropdown Filter using SelecteInputField */}
          <div className="w-32 self-start sm:self-auto">
            <SelecteInputField
              value={activeRange}
              onChange={(val) => setActiveRange(val as "weekly" | "monthly")}
              options={RANGE_OPTIONS}
              className="h-9 text-xs font-medium rounded-sm border-borderColor bg-white"
            />
          </div>
        </div>

        {/* Reusable Common Analytics Graph Component */}
        <CommonAnalyticsGraph
          data={chartData}
          series={GRAPH_SERIES}
          subtitle={graph?.subtitle || "Applications Over Time"}
        />
      </div>
    </div>
  );
}
