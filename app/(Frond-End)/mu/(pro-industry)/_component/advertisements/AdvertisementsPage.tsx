"use client";

import GraphSkeleton from "@/components/reusable/All Skleton/GraphSkeleton";
import StateCardSkleton from "@/components/reusable/All Skleton/StateCardSkleton";
import CommonStateCard, {
  CommonStateCardProps,
} from "@/components/reusable/CommonStateCard";
import DynamicTable from "@/components/reusable/DynamicTable";
import Pagination from "@/components/reusable/Pagination";
import {
  useGetAdvertisementDashboardQuery,
  useGetAdvertisementDataQuery,
} from "@/feature/slice/jobs/advertisementSlice";
import {
  AdvertisementIcon,
  LikeIcon,
  OpenEyeIcon,
} from "@/public/svgIcons/Icons";
import { FileText, Zap } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AdvertismentStatusUpdate from "./AdvertismentStatusUpdate";
import ProductAction from "./ProductAction";

export default function AdvertisementsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: dashboardResponse, isLoading: isDashboardLoading } =
    useGetAdvertisementDashboardQuery({});

  const {
    data: listingResponse,
    isLoading: isListingLoading,
    isError,
    refetch,
  } = useGetAdvertisementDataQuery({
    page,
    per_page: pageSize,
  });

  const dashboardData = dashboardResponse?.data;
  const advertisements = listingResponse?.data || [];
  const pagination = listingResponse?.pagination;
  const stateCards: CommonStateCardProps[] = [
    {
      title: "All Product",
      total: dashboardData?.total_products ?? 0,
      growthPercentage: 2.8,
      badgeText: "+2.8%",
      isPositive: true,
      growthText: "",
      icon: AdvertisementIcon,
    },
    {
      title: "Total Active",
      total: dashboardData?.total_active_products ?? 0,
      badgeText: "Stable",
      isPositive: true,
      growthText: "",
      icon: FileText,
    },
    {
      title: "Total Views",
      total: dashboardData?.total_views ?? 0,
      growthPercentage: 54,
      badgeText: "+54%",
      isPositive: true,
      growthText: "",
      icon: OpenEyeIcon,
    },
    {
      title: "Total Likes",
      total: dashboardData?.total_likes ?? 0,
      growthPercentage: 54,
      badgeText: "+67%",
      isPositive: true,
      growthText: "",
      icon: LikeIcon,
    },
  ];

  // Table Columns Definition matching the screenshot design
  const columns = [
    {
      label: "No.",
      accessor: "no",
      formatter: (_: any, __: any, index: number) => (
        <span className="text-sm font-semibold text-headerColor px-3">
          {(page - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      label: "Products",
      accessor: "product_name",
      formatter: (_: any, row: any) => {
        const isBoosted = Boolean(
          row.is_boosted || (row.boost_days_left && row.boost_days_left > 0),
        );
        const boostText =
          row.boost_remaining_text ||
          (row.boost_days_left ? `${row.boost_days_left} days Left` : null);
        return (
          <div className="flex items-center gap-3 py-2 px-3 w-50">
            <div className="w-14 h-12 rounded-lg bg-bgColor border border-borderColor/60 overflow-hidden shrink-0 flex items-center justify-center">
              {row.image_url || row.image ? (
                <Image
                  src={row.image_url || row.image}
                  alt={row.product_name || "Product"}
                  width={56}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-primaryColor">
                  {(row.product_name || "P").charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h4
                title={row.product_name}
                className="text-sm font-semibold text-headerColor hover:text-primaryColor transition-colors block truncate max-w-xs"
              >
                {row.product_name}
              </h4>
              <p className="text-xs text-descriptionColor truncate mt-0.5">
                {row.industry?.name ||
                  row.creator?.name ||
                  row.product_id ||
                  "BioPac Systems"}
              </p>
              {isBoosted && (
                <div className="mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F5F3FF] text-LiteBlueColor border border-[#DDD6FE]">
                    <Zap className="w-3 h-3 fill-LiteBlueColor" />
                    {boostText || "Boosted"}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      label: "Network",
      accessor: "network_type",
      formatter: (val: string) => {
        const isPsychology = val?.toLowerCase() === "psychology";
        return (
          <div className="px-3">
            <span
              className={`inline-block text-sm font-medium px-2.5 py-0.5 leading-[120%] rounded-full capitalize ${
                isPsychology
                  ? "bg-orengeColor/10 text-orengeColor border border-orengeColor/30 "
                  : "bg-LiteBlueColor/10 text-LiteBlueColor border border-LiteBlueColor/30"
              }`}
            >
              {val || "Psychology"}
            </span>
          </div>
        );
      },
    },
    {
      label: "Industry",
      accessor: "industry_type",
      formatter: (val: string) => {
        const lower = val?.toLowerCase();
        const isBiotech = lower === "biotechnology" || lower === "biotech";
        const isPsychotropic = lower === "psychotropic";
        return (
          <div className="px-3">
            <span
              className={`inline-block text-sm font-medium px-2.5 leading-[120%] py-0.5 rounded-full capitalize ${
                isBiotech
                  ? "bg-orengeColor/10 text-orengeColor border border-orengeColor/30 "
                  : isPsychotropic
                    ? "bg-lightGreenColor2/10 text-lightGreenColor2 border border-lightGreenColor2/30"
                    : "bg-LiteBlueColor/10 text-LiteBlueColor border border-LiteBlueColor/30"
              }`}
            >
              {isBiotech ? "Biotech" : val || "Biotech"}
            </span>
          </div>
        );
      },
    },
    {
      label: "Status",
      accessor: "status",
      formatter: (_: string, row: any) => (
        <AdvertismentStatusUpdate row={row} />
      ),
    },
    {
      label: "Views",
      accessor: "views_count",
      formatter: (value: any, row: any) => {
        return (
          <span className="text-sm font-medium text-descriptionColor px-3 block">
            {value}
          </span>
        );
      },
    },
    {
      label: "Likes",
      accessor: "likes_count",
      formatter: (value: any, row: any) => {
        return (
          <span className="text-sm font-medium text-descriptionColor px-3 block">
            {value}
          </span>
        );
      },
    },
    {
      label: "Action",
      accessor: "actions",
      position: "justify-end",
      formatter: (_: any, row: any) => (
        <ProductAction row={row} onSuccess={refetch} />
      ),
    },
  ];

  return (
    <div className="w-full space-y-7 pb-10">
      {/* Top 3 Cards using CommonStateCard */}
      {isDashboardLoading ? (
        <div className="space-y-4">
          <StateCardSkleton />
          <GraphSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stateCards.map((card) => (
            <CommonStateCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {/* Product Advertisements Listings Section */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-headerColor">
          Your Product Listings
        </h2>

        <div className="overflow-hidden">
          <DynamicTable
            columns={columns}
            data={advertisements}
            tableMinWidth="960px"
            header={{
              bg: "#F9FAFB",
              padding: "12px 14px",
              text: "#4B5563",
              fontWeight: "600",
              fontSize: "13px",
            }}
            rowStyle={{
              hover: true,
              hoverbg: "hover:bg-gray-50/70",
              border: "border-b border-x-0 border-borderColor/60",
            }}
            noDataMessage="No product advertisements found."
          />
        </div>
        {pagination && pagination.total > 0 && (
          <Pagination
            page={pagination.current_page || page}
            pageSize={pagination.per_page || pageSize}
            total={pagination.total}
            totalPages={pagination.last_page}
            onPageChange={setPage}
            showPageSize
            onPageSizeChange={(newPageSize) => {
              setPageSize(newPageSize);
              setPage(1);
            }}
            pageSizeOptions={[10, 15, 20, 30]}
          />
        )}
      </div>
    </div>
  );
}
