"use client";

import GraphSkeleton from "@/components/reusable/All Skleton/GraphSkeleton";
import StateCardSkleton from "@/components/reusable/All Skleton/StateCardSkleton";
import CommonStateCard, {
  CommonStateCardProps,
} from "@/components/reusable/CommonStateCard";
import DynamicTable from "@/components/reusable/DynamicTable";
import {
  useGetAdvertisementDashboardQuery,
  useGetAdvertisementDataQuery,
} from "@/feature/slice/jobs/advertisementSlice";
import {
  AdvertisementIcon,
  LikeIcon,
  OpenEyeIcon,
} from "@/public/svgIcons/Icons";
import { Eye, FileText, Pencil, Trash2, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AdvertisementDeleteModal from "./AdvertisementDeleteModal";
import AdvertismentStatusUpdate from "./AdvertismentStatusUpdate";
import AdvertismentViewModal from "./AdvertismentViewModal";
import BoostingPriceModal from "../boosting/BoostingPriceModal";

export default function AdvertisementsPage() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string | number | null>(
    null,
  );

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewAdId, setViewAdId] = useState<string | number | null>(null);

  const [boostingModalOpen, setBoostingModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: dashboardResponse, isLoading: isDashboardLoading } =
    useGetAdvertisementDashboardQuery({});

  const {
    data: listingResponse,
    isLoading: isListingLoading,
    isError,
    refetch,
  } = useGetAdvertisementDataQuery({});

  const dashboardData = dashboardResponse?.data;
  const advertisements = listingResponse?.data || [];
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
          {index + 1}
        </span>
      ),
    },
    {
      label: "Products",
      accessor: "product_name",
      formatter: (_: any, row: any) => {
        const isBoosted = Boolean(
          row.is_boosted || (row.boost_days_left && row.boost_days_left > 0)
        );
        const boostText =
          row.boost_remaining_text ||
          (row.boost_days_left ? `${row.boost_days_left} days Left` : null);

        return (
          <div className="flex items-center gap-3 py-2 px-3 min-w-55">
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
              <Link
                href={`/mu/products/${row.id}`}
                className="text-sm font-semibold text-headerColor hover:text-primaryColor transition-colors block truncate max-w-xs"
              >
                {row.product_name}
              </Link>
              <p className="text-xs text-descriptionColor truncate mt-0.5">
                {row.industry?.name || row.creator?.name || row.product_id || "BioPac Systems"}
              </p>
              {isBoosted && (
                <div className="mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]">
                    <Zap className="w-3 h-3 fill-[#7C3AED]" />
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
      label: "Impression",
      accessor: "impressions_count",
      formatter: (_: any, row: any) => {
        const count = row.impressions_count ?? row.views_count ?? 0;
        return (
          <span className="text-sm font-medium text-descriptionColor px-3 block">
            {Number(count).toLocaleString()}
          </span>
        );
      },
    },
    {
      label: "Click",
      accessor: "clicks_count",
      formatter: (_: any, row: any) => {
        const count = row.clicks_count ?? row.likes_count ?? 0;
        return (
          <span className="text-sm font-medium text-descriptionColor px-3 block">
            {Number(count).toLocaleString()}
          </span>
        );
      },
    },
    {
      label: "Action",
      accessor: "actions",
      position: "justify-end",
      formatter: (_: any, row: any) => {
        const isBoosted = Boolean(
          row.is_boosted || (row.boost_days_left && row.boost_days_left > 0)
        );

        return (
          <div className="flex items-center justify-end gap-2 pr-3">
            <button
              type="button"
              disabled={isBoosted}
              onClick={() => {
                if (!isBoosted) {
                  setSelectedProduct(row);
                  setBoostingModalOpen(true);
                }
              }}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                isBoosted
                  ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                  : "border-[#7C3AED] bg-white text-[#7C3AED] hover:bg-[#F5F3FF] cursor-pointer"
              }`}
            >
              <Zap
                className={`w-3.5 h-3.5 ${
                  isBoosted ? "fill-slate-300" : "fill-[#7C3AED]"
                }`}
              />
              <span>Boost Now</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewAdId(row.id);
                setViewModalOpen(true);
              }}
              className="p-1.5 rounded-lg border border-borderColor hover:bg-bgColor text-gray-500 hover:text-primaryColor transition-colors cursor-pointer"
              title="View Ad"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedAdId(row.id);
                setDeleteModalOpen(true);
              }}
              className="p-1.5 rounded-lg border border-borderColor hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
              title="Delete Ad"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <Link
              href={`/mu/products/${row.id}/edit`}
              className="p-1.5 rounded-lg border border-borderColor hover:bg-bgColor text-gray-500 hover:text-primaryColor transition-colors cursor-pointer"
              title="Edit Ad"
            >
              <Pencil className="w-4 h-4" />
            </Link>
          </div>
        );
      },
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
      </div>

      <AdvertisementDeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        adId={selectedAdId}
      />

      <AdvertismentViewModal
        open={viewModalOpen}
        setOpen={setViewModalOpen}
        adId={viewAdId}
      />

      <BoostingPriceModal
        open={boostingModalOpen}
        setOpen={setBoostingModalOpen}
        product={selectedProduct}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}
