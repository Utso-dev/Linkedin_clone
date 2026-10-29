"use client";

import StateCardSkleton from "@/components/reusable/All Skleton/StateCardSkleton";
import CommonStateCard, {
  CommonStateCardProps,
} from "@/components/reusable/CommonStateCard";
import DynamicTable from "@/components/reusable/DynamicTable";
import Pagination from "@/components/reusable/Pagination";
import { useGetMyPublicationsQuery } from "@/feature/slice/jobs/publicationSlice";
import {
  ApplicantIcon,
  OpenEyeIcon,
  PublicationsMenueIcon,
} from "@/public/svgIcons/Icons";
import dayjs from "dayjs";
import { ArrowUpRight, Calendar1, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PublicationAction from "./PublicationAction";
import PublicationStatusUpdate from "./PublicationStatusUpdate";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";

export default function PublicationPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
   const { data: userProfileData } = useGetUserProfileQuery("user");
   const isPremium = userProfileData?.subscription?.plan_type === "premium";
  // API Queries
  const {
    data: myPublicationsResponse,
    isLoading: isMyPublicationsLoading,
    isFetching: isMyPublicationsFetching,
  } = useGetMyPublicationsQuery({
    page: currentPage,
    per_page: perPage,
  });

  const publicationsList: any[] = myPublicationsResponse?.data || [];
  const pagination = myPublicationsResponse?.pagination;
  const insightCards = myPublicationsResponse?.cards;

  // Top 3 Stat Cards configuration matching screenshot
  const stateCards: CommonStateCardProps[] = [
    {
      title: "All Publications",
      total: insightCards?.total_publications?.total ?? 0,
      badgeText: insightCards?.total_publications?.growth ?? "+2.8%",
      isPositive: insightCards?.total_publications?.is_positive,

      icon: PublicationsMenueIcon,
      iconBg: "bg-[#E6F8F6]",
      iconColor: "text-primaryColor",
    },
    {
      title: "Active Publication",
      total: insightCards?.active_publications?.total ?? 0,
      badgeText: insightCards?.active_publications?.growth ?? "Stable",
      isPositive: insightCards?.active_publications?.is_positive,

      icon: ApplicantIcon,
      iconBg: "bg-[#E6F8F6]",
      iconColor: "text-primaryColor",
    },
    {
      title: "Publication Views",
      total: insightCards?.publications_views?.total ?? 0,
      badgeText: insightCards?.publications_views?.growth ?? "+54%",
      isPositive: insightCards?.publications_views?.is_positive,

      icon: OpenEyeIcon,
      iconBg: "bg-[#E6F8F6]",
      iconColor: "text-primaryColor",
    },
  ];

  // Table Columns Definition matching the exact screenshot design
  const columns = [
    {
      label: "No.",
      accessor: "no",
      position: "justify-center",
      width: "60px",
      formatter: (_: any, __: any, index: number) => (
        <span className="text-sm font-semibold text-headerColor text-center block px-2">
          {(currentPage - 1) * perPage + index + 1}
        </span>
      ),
    },
    {
      label: " Article Title & Summary",
      accessor: "title",

      formatter: (_: any, row: any) => (
        <div className="py-2.5 px-3 w-50">
          <h4
            title={row.title}
            className="text-left text-wrap font-semibold text-sm text-headerColor hover:text-primaryColor transition-colors line-clamp-1  cursor-pointer"
          >
            {row.title || "Untitled Publication"}
          </h4>
          <p className="text-xs text-descriptionColor line-clamp-1 mt-1 leading-relaxed">
            {row.short_abstract ||
              row.abstract ||
              "No summary or abstract provided for this article."}
          </p>
        </div>
      ),
    },
    {
      label: "Publish Date",
      accessor: "created_at",
      formatter: (val: string) => (
        <div className="flex items-center gap-1.5 px-3 text-sm leading-[140%] font-medium text-descriptionColor whitespace-nowrap">
          <Calendar1 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>{val ? dayjs(val).format("DD MMM YYYY") : "05 Feb 2026"}</span>
        </div>
      ),
    },
    {
      label: "Network",
      accessor: "network_type",
      formatter: (val: string) => {
        const network = String(val || "psychology").toLowerCase();
        const isPsychology = network === "psychology";
        const isNeuroscience = network === "neuroscience";

        return (
          <div className="px-3">
            <span
              className={`inline-block text-sm leading-[140%] font-medium px-3 py-0.5 rounded-full capitalize whitespace-nowrap ${
                isPsychology
                  ? "bg-orengeColor/10 text-orengeColor border border-orengeColor/30"
                  : isNeuroscience
                    ? "bg-blueColor/10 text-blueColor border border-blueColor/30"
                    : "bg-primaryColor/10 text-primaryColor border border-primaryColor/30"
              }`}
            >
              {val || "Psychology"}
            </span>
          </div>
        );
      },
    },
    {
      label: "Reference",
      accessor: "website_url",
      formatter: (_: any, row: any) => {
        const link = row.website_url || row.attachment_url;
        return (
          <div className="px-3">
            {link ? (
              <Link
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blueColor  hover:underline transition-colors whitespace-nowrap cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 text-blueColor" />
                <span>View Article</span>
              </Link>
            ) : (
              <span className="text-xs text-gray-400">N/A</span>
            )}
          </div>
        );
      },
    },
    {
      label: "Total View",
      accessor: "views_count",
      formatter: (val: number) => (
        <span className="text-sm font-medium text-descriptionColor px-3 block whitespace-nowrap">
          {(val ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      position: "justify-center",
      formatter: (_: string, row: any) => <PublicationStatusUpdate row={row} />,
    },
    {
      label: "Action",
      accessor: "actions",
      position: "justify-end",
      formatter: (_: any, row: any) => <PublicationAction ispremium={isPremium} row={row} />,
    },
  ];


  return (
    <div className="w-full space-y-7 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-headerColor">
            Pro Industry Publication
          </h1>
          <p className="text-sm sm:text-base text-descriptionColor mt-1">
            Add your publications in Health Industry
          </p>
        </div>

        <div className="shrink-0 self-start sm:self-auto">
          <Link
            href={isPremium ? `/mu/premium/publications/create` : `/mu/publications/create`}
            className="inline-flex items-center gap-1.5 bg-primaryColor hover:bg-primaryColor/90 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Publications</span>
          </Link>
        </div>
      </div>

      {/* Top 3 Stat Cards using CommonStateCard (layout="split") */}
      {isMyPublicationsLoading && !publicationsList.length ? (
        <StateCardSkleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stateCards.map((card) => (
            <CommonStateCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {/* Publication Listings Table Section */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-headerColor">
          Your Publication Listings
        </h2>

        {/* Dynamic Table */}
        <div className="bg-white rounded-2xl border border-borderColor/80 overflow-hidden ">
          <DynamicTable
            columns={columns}
            data={publicationsList}
            tableMinWidth="900px"
            header={{
              bg: "#F9FAFB",
              padding: "14px 16px",
              text: "#4B5563",
              fontWeight: "600",
              fontSize: "13px",
            }}
            rowStyle={{
              hover: true,
              hoverbg: "hover:bg-gray-50/70",
              border:
                "border-b last:border-b-0 border-x-0 border-borderColor/60",
            }}
            noDataMessage={
              isMyPublicationsLoading || isMyPublicationsFetching
                ? "Loading publications..."
                : "No publications found. Click 'Add New Publications' to create your first article."
            }
          />
        </div>

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <div className="pt-2">
            <Pagination
              page={currentPage}
              pageSize={perPage}
              total={pagination.total}
              totalPages={pagination.last_page || 1}
              onPageChange={(page) => setCurrentPage(page)}
              showPageSize={true}
              onPageSizeChange={(size) => {
                setPerPage(size);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 30, 50]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
