"use client";

import GraphSkeleton from "@/components/reusable/All Skleton/GraphSkeleton";
import StateCardSkleton from "@/components/reusable/All Skleton/StateCardSkleton";
import CommonAnalyticsGraph, {
  GraphSeriesItem,
} from "@/components/reusable/CommonAnalyticsGraph";
import CommonStateCard from "@/components/reusable/CommonStateCard";
import { useGetAdvertisementsQuery } from "@/feature/slice/jobs/analyticSlice";
import {
  ActiveIcon,
  ApplicantIcon,
  OpenEyeIcon,
} from "@/public/svgIcons/Icons";
import { MousePointerClick, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const GRAPH_SERIES: GraphSeriesItem[] = [
  { dataKey: "impressions", name: "Impressions", color: "#04A1B7" },
  { dataKey: "clicks", name: "Clicks", color: "#07C3BB" },
  { dataKey: "ctr", name: "CTR", color: "#F59E0B" },
];

export default function AnalyticsAdvertisementPage() {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetAdvertisementsQuery({});

  const analyticsData = response?.data;
  const cards = analyticsData?.cards;
  const topCampaigns =
    analyticsData?.top_performing_campaigns ||
    analyticsData?.top_performing_products ||
    [];
  const graph = analyticsData?.graph;
  const placementsObj = analyticsData?.placements || {};
  const placementList = Object.values(placementsObj) as any[];

  // Active range filter (Weekly | Monthly)
  const [activeRange, setActiveRange] = useState<"weekly" | "monthly">("weekly");

  // Keep active range aligned if graph payload specifies a default
  useEffect(() => {
    if (graph?.active === "weekly" || graph?.active === "monthly") {
      setActiveRange(graph.active);
    }
  }, [graph?.active]);

  // Direct array from graph response
  const chartData = (graph?.[activeRange] || []).map((item: any) => ({
    ...item,
    impressions: item.impressions ?? item.views ?? 0,
    clicks: item.clicks ?? item.likes ?? 0,
    ctr: item.ctr ?? 0,
  }));

  const stateCards = [
    {
      title: "Total Spend",
      data: cards?.total_spend,
      icon: ApplicantIcon,
    },
    {
      title: "Total Impressions",
      data: cards?.total_impressions,
      icon: OpenEyeIcon,
    },
    {
      title: "Total Clicks",
      data: cards?.total_clicks,
      icon: MousePointerClick,
    },
    {
      title: "Avg CTR",
      data: cards?.avg_ctr,
      icon: TrendingUp,
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
          Failed to load advertisement analytics.
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
      {/* 5 State Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5">
        {stateCards.map(({ title, data, icon }) => (
          <CommonStateCard
            key={title}
            title={title}
            total={
              data?.formatted ??
              (data?.total !== undefined ? Number(data.total).toLocaleString() : 0)
            }
            growthPercentage={data?.growth_percentage ?? 0}
            badgeText={data?.growth ? data.growth.split(" ")[0] : undefined}
            isPositive={data?.is_positive ?? true}
            growthText="From last month"
            icon={icon}
          />
        ))}
      </div>

      {/* Bottom Grid: Top Performing Campaigns (Left) & Advertisement Performance Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Top Performing Campaigns & Placements */}
        <div className="lg:col-span-4 xl:col-span-4 bg-white rounded-2xl border border-borderColor/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-headerColor mb-5">
              Top Performing Campaigns
            </h3>

            {/* Table Header */}
            <div className="grid grid-cols-12 text-sm font-semibold text-headerColor pb-3 border-b border-borderColor/40">
              <div className="col-span-6">Campaign</div>
              <div className="col-span-3 text-right">Impr.</div>
              <div className="col-span-3 text-right">Clicks</div>
            </div>

            {/* Campaigns List */}
            <div className="divide-y divide-borderColor/20">
              {topCampaigns.length > 0 ? (
                topCampaigns.map((campaign: any, index: number) => (
                  <div
                    key={campaign.id || index}
                    className="grid grid-cols-12 items-center py-3.5 hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="col-span-6 flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primaryColor shrink-0" />
                      <span
                        className="text-sm font-semibold text-headerColor truncate"
                        title={campaign.product_name}
                      >
                        {campaign.product_name || `Campaign #${campaign.id || index + 1}`}
                      </span>
                    </div>
                    <div className="col-span-3 text-right text-sm text-grayColor1 font-normal">
                      {Number(
                        campaign.impressions ?? campaign.views_count ?? 0,
                      ).toLocaleString()}
                    </div>
                    <div className="col-span-3 text-right text-sm text-grayColor1 font-normal">
                      {Number(
                        campaign.clicks ??
                          campaign.click_count ??
                          campaign.likes_count ??
                          0,
                      ).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-grayColor1">
                  No campaigns found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Advertisement Performance Chart */}
        <div className="lg:col-span-8 xl:col-span-8 bg-white rounded-2xl border border-borderColor/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-headerColor">
                  {graph?.title || "Advertisement Performance"}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-grayColor1 mt-1">
                  {graph?.subtitle || "Impressions vs Clicks"}
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-3">
                {/* Range Toggle: Weekly | Monthly */}
                <div className="inline-flex items-center bg-bgLightColor p-1 rounded-sm">
                  {(["weekly", "monthly"] as const).map((rangeKey) => {
                    const isSelected = activeRange === rangeKey;
                    return (
                      <button
                        key={rangeKey}
                        type="button"
                        onClick={() => setActiveRange(rangeKey)}
                        className={`px-3.5 py-1 text-xs font-semibold rounded-sm transition-all capitalize cursor-pointer ${
                          isSelected
                            ? "bg-white text-headerColor shadow-xs"
                            : "text-grayColor1 hover:text-headerColor"
                        }`}
                      >
                        {rangeKey}
                      </button>
                    );
                  })}
                </div>

                {/* Legend matching Impressions vs Clicks */}
                <div className="flex items-center gap-4 text-xs font-medium text-grayColor1">
                  {GRAPH_SERIES.map((s) => (
                    <div key={s.dataKey} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="text-headerColor font-medium">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reusable Common Analytics Graph */}
            <CommonAnalyticsGraph
              data={chartData}
              series={GRAPH_SERIES}
              subtitle={graph?.subtitle || "Impressions vs Clicks"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
