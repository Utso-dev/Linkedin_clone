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
  LikeIcon,
  OpenEyeIcon,
} from "@/public/svgIcons/Icons";
import { useEffect, useState } from "react";

const GRAPH_SERIES: GraphSeriesItem[] = [
  { dataKey: "views", name: "Views", color: "#04A1B7" },
  { dataKey: "likes", name: "Like", color: "#07C3BB" },
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
  const topProducts = analyticsData?.top_performing_products || [];
  const graph = analyticsData?.graph;

  // Active range filter (Weekly | Monthly)
  const [activeRange, setActiveRange] = useState<"weekly" | "monthly">("weekly");

  // Keep active range aligned if graph payload specifies a default
  useEffect(() => {
    if (graph?.active === "weekly" || graph?.active === "monthly") {
      setActiveRange(graph.active);
    }
  }, [graph?.active]);

  // Direct array from graph response
  const chartData = graph?.[activeRange] || [];

  const stateCards = [
    {
      title: "Total Products",
      data: cards?.total_products,
      icon: ApplicantIcon,
    },
    {
      title: "Active Products",
      data: cards?.active_products,
      icon: ActiveIcon,
    },
    {
      title: "Product Views",
      data: cards?.product_views,
      icon: OpenEyeIcon,
    },
    {
      title: "Total Like",
      data: cards?.total_likes,
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
      {/* 4 State Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stateCards.map(({ title, data, icon }) => (
          <CommonStateCard
            key={title}
            title={title}
            total={data?.total ?? 0}
            growthPercentage={data?.growth_percentage ?? 0}
            badgeText={data?.growth ? data.growth.split(" ")[0] : undefined}
            isPositive={data?.is_positive ?? true}
            growthText="From last month"
            icon={icon}
          />
        ))}
      </div>

      {/* Bottom Grid: Top Performing Products (Left) & Advertisement Performance Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Top Performing Products */}
        <div className="lg:col-span-4 xl:col-span-4 bg-white rounded-2xl border border-borderColor/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-headerColor mb-5">
              Top Performing Products
            </h3>

            {/* Table Header */}
            <div className="grid grid-cols-12 text-sm font-semibold text-headerColor pb-3 border-b border-borderColor/40">
              <div className="col-span-6">Products</div>
              <div className="col-span-3 text-right">Views</div>
              <div className="col-span-3 text-right">Click</div>
            </div>

            {/* Products List */}
            <div className="divide-y divide-borderColor/20">
              {topProducts.length > 0 ? (
                topProducts.map((product: any, index: number) => (
                  <div
                    key={product.id || index}
                    className="grid grid-cols-12 items-center py-3.5 hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="col-span-6 flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primaryColor shrink-0" />
                      <span
                        className="text-sm font-semibold text-headerColor truncate"
                        title={product.product_name}
                      >
                        {product.product_name || `Product ${index + 1}`}
                      </span>
                    </div>
                    <div className="col-span-3 text-right text-sm text-grayColor1 font-normal">
                      {Number(product.views_count ?? 0).toLocaleString()}
                    </div>
                    <div className="col-span-3 text-right text-sm text-grayColor1 font-normal">
                      {Number(
                        product.likes_count ??
                          product.click_count ??
                          product.clicks ??
                          0,
                      ).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-sm text-grayColor1">
                  No products found
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
                  {graph?.subtitle || "Views vs Like"}
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

                {/* Legend matching design */}
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
              subtitle={graph?.subtitle || "Product Insight"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
