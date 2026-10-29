"use client";

import StateCardSkleton from "@/components/reusable/All Skleton/StateCardSkleton";
import CommonStateCard, {
  CommonStateCardProps,
} from "@/components/reusable/CommonStateCard";
import DynamicTable from "@/components/reusable/DynamicTable";
import SelecteInputField, {
  Option,
} from "@/components/reusable/InputFiled/SelecteInputField";
import Pagination from "@/components/reusable/Pagination";
import Search from "@/components/reusable/Search";
import {
  useGetBoostingAdvertisementCampaignQuery,
  usePauseBoostingCampaignMutation,
  useResumeBoostingCampaignMutation,
} from "@/feature/slice/jobs/boostingSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { LikeIcon, OpenEyeIcon } from "@/public/svgIcons/Icons";
import { BoostCampaignItem } from "@/types/boosting";
import dayjs from "dayjs";
import { CircleDot, Clock, Loader2, Pause, Play, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

const statusOptions: Option[] = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Expired" },
];

function AddCampaignContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("search") || "";
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // User profile query for personalized greeting
  const { data: profileResponse } = useGetUserProfileQuery("Profile");
  const userName =
    profileResponse?.data?.name ||
    profileResponse?.data?.user?.name ||
    profileResponse?.user?.name ||
    "Vin";

  // Reset page when search or status filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  // Query campaigns
  const queryParams = {
    page,
    per_page: pageSize,
    ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
  };

  const {
    data: campaignResponse,
    isLoading,
    isFetching,
  } = useGetBoostingAdvertisementCampaignQuery(queryParams);

  const [pauseCampaign] = usePauseBoostingCampaignMutation();
  const [resumeCampaign] = useResumeBoostingCampaignMutation();

  const metrics = campaignResponse?.data?.metrics;
  const campaignsList: BoostCampaignItem[] =
    campaignResponse?.data?.campaigns?.data || [];
  const meta = campaignResponse?.data?.campaigns?.meta;

  // Handle Pause
  const handlePause = async (campaignId: number) => {
    setActionLoadingId(campaignId);
    try {
      const res = await pauseCampaign(campaignId).unwrap();
      toast.success(res?.message || "Campaign paused successfully.");
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to pause campaign.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Resume
  const handleResume = async (campaignId: number) => {
    setActionLoadingId(campaignId);
    try {
      const res = await resumeCampaign(campaignId).unwrap();
      toast.success(res?.message || "Campaign resumed successfully.");
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to resume campaign.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const stateCards: CommonStateCardProps[] = [
    {
      title: "Active Ads",
      total: metrics?.active_campaigns ?? 0,
      badgeText: "Stable",
      isPositive: true,
      growthText: "",
      icon: CircleDot,
    },
    {
      title: "Expired Ads",
      total: metrics?.completed_campaigns ?? 0,
      growthPercentage: 78.8,
      badgeText: "+78.8%",
      isPositive: true,
      growthText: "From last month",
      icon: Clock,
    },
    {
      title: "Total Impression",
      total: metrics?.total_impressions ?? 0,
      growthPercentage: 78.8,
      badgeText: "+78.8%",
      isPositive: true,
      growthText: "From last month",
      icon: OpenEyeIcon,
    },
    {
      title: "Total Click",
      total: metrics?.total_clicks ?? 0,
      growthPercentage: 78.8,
      badgeText: "+78.8%",
      isPositive: true,
      growthText: "From last month",
      icon: LikeIcon,
    },
  ];

  // DynamicTable Columns Definition
  const columns = [
    {
      label: "No.",
      accessor: "no",
      position: "justify-center",
      width: "40px",
      formatter: (_: any, __: any, index: number) => {
        const rowNumber = (page - 1) * pageSize + index + 1;
        return (
          <span className="text-xs font-semibold text-slate-500 block text-center px-2 py-3.5">
            {rowNumber}
          </span>
        );
      },
    },
    {
      label: "Products",
      accessor: "product_name",
      position: "justify-start",
      width: "210px",
      formatter: (_: any, item: BoostCampaignItem) => {
        const isItemActive =
          item.is_active ||
          item.status === "active" ||
          item.status === "paused";
        const imageUrl = item.boostable?.image_url;

        return (
          <div className="flex items-center gap-3 py-3.5 px-2 ">
            {/* Product Image */}
            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-borderColor bg-slate-100 shrink-0 flex items-center justify-center">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={item.boostable?.product_name || "Product image"}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-primaryColor">
                  {(item.boostable?.product_name || "P").charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className=" text-start">
              <h4
                className="text-sm font-bold text-headerColor line-clamp-1"
                title={item.boostable?.product_name}
              >
                {item.boostable?.product_name || "BioPac MP160"}
              </h4>

              {/* Badge below title */}
              {isItemActive && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-md text-[11px] font-bold bg-[#F5F3FF] border border-[#DDD6FE] text-LiteBlueColor">
                  <Zap className="w-3 h-3 fill-LiteBlueColor" />
                  <span>{item.remaining_days} days Left</span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      label: "Price",
      accessor: "amount_paid",
      position: "justify-start",
      formatter: (_: any, item: BoostCampaignItem) => (
        <div className="py-3.5 px-2 whitespace-nowrap">
          <span className="text-xs text-descriptionColor block leading-tight">
            {item.duration_days} days
          </span>
          <span className="text-sm font-bold text-headerColor block mt-0.5">
            {item.amount_paid_formatted ||
              `$${Number(item.amount_paid || 0).toFixed(2)}`}
          </span>
        </div>
      ),
    },
    {
      label: "Start date",
      accessor: "starts_at",
      position: "justify-start",
      formatter: (_: any, item: BoostCampaignItem) => (
        <div className="text-xs sm:text-sm text-headerColor font-medium whitespace-nowrap px-2 py-3.5 block">
          {item.starts_at_formatted ||
            (item.starts_at && dayjs(item.starts_at).format("MMM DD, YYYY")) ||
            "—"}
        </div>
      ),
    },
    {
      label: "End Date",
      accessor: "ends_at",
      position: "justify-start",
      formatter: (_: any, item: BoostCampaignItem) => (
        <div className="text-xs sm:text-sm text-headerColor font-medium whitespace-nowrap px-2 py-3.5 block">
          {item.ends_at_formatted ||
            (item.ends_at && dayjs(item.ends_at).format("MMM DD, YYYY")) ||
            "—"}
        </div>
      ),
    },
    {
      label: "Impression",
      accessor: "total_impressions",
      position: "justify-start",
      formatter: (_: any, item: BoostCampaignItem) => (
        <div className="text-xs text-center sm:text-sm text-headerColor font-medium whitespace-nowrap px-2 py-3.5 block">
          {Number(item.total_impressions || 0).toLocaleString()}
        </div>
      ),
    },
    {
      label: "Click",
      accessor: "total_clicks",
      position: "justify-start",
      formatter: (_: any, item: BoostCampaignItem) => (
        <div className="text-xs text-center sm:text-sm text-headerColor font-medium whitespace-nowrap px-2 py-3.5 block">
          {Number(item.total_clicks || 0).toLocaleString()}
        </div>
      ),
    },
    {
      label: "CTR",
      accessor: "ctr",
      position: "justify-start",
      formatter: (_: any, item: BoostCampaignItem) => (
        <div className="text-xs text-center sm:text-sm text-headerColor font-medium whitespace-nowrap px-2 py-3.5 block">
          {item.ctr_formatted || `${item.ctr || 0}%`}
        </div>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      position: "justify-center",
      formatter: (_: any, item: BoostCampaignItem) => {
        const isItemActive = item.is_active || item.status === "active";
        const isItemPaused = item.is_paused || item.status === "paused";
        const isItemExpired =
          item.is_completed ||
          item.status === "completed" ||
          item.status === "expired";

        return (
          <div className="py-3.5 px-2 text-center whitespace-nowrap flex justify-center">
            {isItemActive ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#F0FDFA] border border-lightGreenColor2/60 text-lightGreenColor2">
                <span className="w-1.5 h-1.5 rounded-full bg-lightGreenColor2" />
                Active
              </span>
            ) : isItemPaused ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[#FFFBEB] border border-ratingColor/60 text-ratingColor">
                <span className="w-1.5 h-1.5 rounded-full bg-ratingColor" />
                Paused
              </span>
            ) : isItemExpired ? (
              <span className="inline-flex capitalize items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[#FAF5FF] border border-[#E9D5FF] text-LiteBlueColor">
                <span className="w-1.5 h-1.5 rounded-full bg-LiteBlueColor" />
                {item.status}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[#FEF2F2] border border-redColor/60 text-redColor">
                <span className="w-1.5 h-1.5 rounded-full bg-redColor" />
                Cancel
              </span>
            )}
          </div>
        );
      },
    },
    {
      label: "Action",
      accessor: "actions",
      position: "justify-end",
      formatter: (_: any, item: BoostCampaignItem) => {
        const isItemActive =
          item.is_active ||
          item.status === "active" ||
          item.status === "paused";
        const isItemPaused = item.is_paused || item.status === "paused";

        return (
          <div className="inline-flex items-center justify-end gap-2 py-3.5 px-2 pr-2 whitespace-nowrap w-full">
            {/* 1. Boost Now Button */}
            {isItemActive ? (
              <button
                type="button"
                disabled
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-xs font-semibold flex items-center gap-1 cursor-not-allowed select-none"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-300" />
                <span>Boost Now</span>
              </button>
            ) : (
              <Link
                href={`/mu/products/${item.boostable_id}/boosting-plan`}
                className="px-2.5 py-1.5 rounded-lg border border-LiteBlueColor/80 bg-white text-LiteBlueColor hover:bg-[#F5F3FF] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-LiteBlueColor" />
                <span>Boost Now</span>
              </Link>
            )}

            {/* 2. Pause / Resume Button */}
            {item.status === "active" ? (
              <button
                type="button"
                disabled={actionLoadingId === item.id}
                onClick={() => handlePause(item.id)}
                className="w-8 h-8 rounded-lg border border-borderColor bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 flex items-center justify-center transition cursor-pointer disabled:opacity-50 shrink-0"
                title="Pause Campaign"
              >
                {actionLoadingId === item.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
                ) : (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                )}
              </button>
            ) : isItemPaused ? (
              <button
                type="button"
                disabled={actionLoadingId === item.id}
                onClick={() => handleResume(item.id)}
                className="w-8 h-8 rounded-lg border border-ratingColor/60 bg-amber-50 hover:bg-amber-100 text-ratingColor flex items-center justify-center transition cursor-pointer disabled:opacity-50 shrink-0"
                title="Resume Campaign"
              >
                {actionLoadingId === item.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-ratingColor" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-300 flex items-center justify-center cursor-not-allowed shrink-0"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderColor pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-headerColor">
            Advertise Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-descriptionColor mt-1">
            Welcome back, {userName}! Here&apos;s what&apos;s happening on Mind
            Unite today.
          </p>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards */}
      {isLoading ? (
        <StateCardSkleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stateCards.map((card) => (
            <CommonStateCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {/* 3. Section Title & Search + Status Filters */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg sm:text-xl font-bold text-headerColor">
          Your Advertise Listings
        </h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Left: Search input */}
          <div className="w-full sm:w-80 md:w-96">
            <Search placeHolder="Search by product name, ID" />
          </div>

          {/* Right: Status filter */}
          <div className="w-full sm:w-44">
            <SelecteInputField
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={statusOptions}
              placeholder="All Status"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 4. Table of Campaigns */}
      <div className="border border-borderColor rounded-xl overflow-hidden bg-white shadow-2xs">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-descriptionColor">
            <Loader2 className="w-6 h-6 animate-spin text-primaryColor" />
            <span className="text-sm font-medium">Loading campaigns...</span>
          </div>
        ) : (
          <DynamicTable
            columns={columns}
            data={campaignsList}
            tableMinWidth="960px"
            header={{
              bg: "#F9FAFB",
              padding: "12px 16px",
              text: "#4B5563",
              fontWeight: "600",
              fontSize: "13px",
            }}
            rowStyle={{
              hover: true,
              hoverbg: "hover:bg-slate-50/70",
              border:
                "border-b last:border-b-0 border-x-0 border-borderColor/60",
            }}
            noDataMessage={
              searchQuery
                ? `No campaigns match "${searchQuery}".`
                : "No advertise campaigns found."
            }
          />
        )}
      </div>

      {/* 5. Pagination */}
      {meta && meta.total > 0 && (
        <div className="pt-2">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={meta.total}
            totalPages={meta.last_page}
            onPageChange={(p) => setPage(p)}
            showPageSize={true}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
            pageSizeOptions={[10, 15, 20, 30]}
          />
        </div>
      )}
    </div>
  );
}

export default function AddCampainPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-descriptionColor flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primaryColor" />
          <span>Loading advertise management dashboard...</span>
        </div>
      }
    >
      <AddCampaignContent />
    </Suspense>
  );
}
