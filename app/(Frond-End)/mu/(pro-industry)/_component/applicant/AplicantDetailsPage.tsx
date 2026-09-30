"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import Pagination from "@/components/reusable/Pagination";

import { useGetAllJobApplicantsQuery } from "@/feature/slice/jobs/jobSlice";
import { ApplicantItemType } from "@/lib/type";
import { OpenEyeIcon } from "@/public/svgIcons/Icons";
import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { HiOutlineSelector } from "react-icons/hi";
import AllJobList from "../jobs/AllJobList";
import EmptyJobs from "../jobs/EmptyJobs";
import ApplicantStatusUpdate from "./ApplicantStatusUpdate";
import ApplicantsFilter from "./ApplicantsFilter";

export interface AplicantDetailsPageProps {
  id?: string | number;
}

export default function AplicantDetailsPage({
  id,
}: AplicantDetailsPageProps = {}) {
  const params = useParams();
  const jobId = id || (params?.id as string | number) || 1;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [applicantToDelete, setApplicantToDelete] =
    useState<ApplicantItemType | null>(null);

  // Construct query params for API
  const queryParams = useMemo(() => {
    const p: Record<string, any> = {
      current_page: currentPage,
      limit: limit,
    };
    if (selectedStatus && selectedStatus !== "all") {
      p.status = selectedStatus;
    }
    if (searchQuery.trim()) {
      p.search = searchQuery.trim();
    }
    return p;
  }, [currentPage, limit, selectedStatus, searchQuery]);

  // Fetch job applicants from API
  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useGetAllJobApplicantsQuery(
    { id: jobId, params: queryParams },
    { skip: !jobId },
  );

  const rawApplicants: ApplicantItemType[] = useMemo(() => {
    return (responseData?.data || []) as ApplicantItemType[];
  }, [responseData]);

  const totalCount = responseData?.total ?? rawApplicants.length;
  const totalPages =
    responseData?.last_page ?? Math.max(1, Math.ceil(totalCount / limit));

  const renderHeaderLabel = (text: string, sortable: boolean = true) => (
    <div className="flex items-center gap-1.5 font-medium text-xs md:text-sm text-gray-500 whitespace-nowrap">
      <span>{text}</span>
      {sortable && (
        <HiOutlineSelector className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      )}
    </div>
  );

  // DynamicTable Columns Configuration
  const columns = [
    {
      label: renderHeaderLabel("ID"),
      accessor: "application_id",
      width: "80px",
      position: "justify-start",
      formatter: (_: any, row: ApplicantItemType) => (
        <div className="px-4 py-3.5 text-sm text-descriptionColor font-normal whitespace-nowrap">
          #{row.application_id || row.id}
        </div>
      ),
    },
    {
      label: renderHeaderLabel("Applicant Name"),
      accessor: "applicant_name",

      position: "justify-start",
      formatter: (_: any, row: ApplicantItemType) => (
        <div className="flex items-center gap-2 px-4 py-3.5">
          <div className="w-10 h-10 rounded-full bg-[#dcf4f2] text-[#009dae] flex items-center justify-center shrink-0 overflow-hidden border border-gray-100 font-semibold text-xs">
            {row.avatar ? (
              <img
                src={row.avatar}
                alt={row.applicant_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>
                {row.applicant_name
                  ? row.applicant_name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "U"}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h4
              className="text-sm font-semibold text-headerColor truncate hover:text-primaryColor transition-colors cursor-pointer"
              title={row.applicant_name}
            >
              {row.applicant_name}
            </h4>
            <p
              className="text-xs text-descriptionColor truncate mt-0.5"
              title={row.email}
            >
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      label: renderHeaderLabel("Position"),
      accessor: "position",
      position: "justify-start",
      formatter: (_: any, row: ApplicantItemType) => (
        <div
          className="px-4 py-3.5 text-sm text-descriptionColor truncate"
          title={row.position}
        >
          {row.position || "N/A"}
        </div>
      ),
    },
    {
      label: renderHeaderLabel("Applied On"),
      accessor: "applied_on",

      position: "justify-start",
      formatter: (_: any, row: ApplicantItemType) => (
        <div className="px-4 py-3.5 text-sm text-descriptionColor whitespace-nowrap">
          {row.applied_on || "N/A"}
        </div>
      ),
    },
    {
      label: renderHeaderLabel("Network"),
      accessor: "network",

      position: "justify-start",
      formatter: (_: any, row: ApplicantItemType) => (
        <div className="px-4 py-3.5 text-sm text-descriptionColor whitespace-nowrap">
          {row.network || "N/A"}
        </div>
      ),
    },
    {
      label: (
        <span className="font-medium text-xs md:text-sm text-gray-500">
          Status
        </span>
      ),
      accessor: "status",

      position: "justify-center",
      formatter: (_: any, row: ApplicantItemType) => (
        <ApplicantStatusUpdate row={row} />
      ),
    },
    {
      label: (
        <span className="font-medium text-xs md:text-sm text-gray-500">
          Action
        </span>
      ),
      accessor: "action",

      position: "justify-center",
      formatter: (_: any, row: ApplicantItemType) => (
        <div className="flex items-center justify-center gap-2.5 px-4 py-3.5">
          {/* View Details Eye Icon */}
          <button
            type="button"
            className="p-1 rounded text-gray-400 hover:text-primaryColor transition-colors cursor-pointer"
            title="View Applicant"
            aria-label="view applicant"
          >
            <OpenEyeIcon className="w-4.5 h-4.5" />
          </button>

          {/* Delete Trash Icon */}
          <button
            type="button"
            className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Delete Applicant"
            aria-label="delete applicant"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full pb-10 mt-4">
      {/* Top Filter Bar */}
      <ApplicantsFilter status_count={responseData?.status_counts} />
      {/* Content Section */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-grayColor2 p-8 text-center my-4">
          <div className="animate-spin w-8 h-8 border-3 border-primaryColor border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm text-descriptionColor">Loading applicants...</p>
        </div>
      ) : isError ? (
        <AllJobList />
      ) : rawApplicants.length === 0 ? (
        <EmptyJobs
          clearAllFilters={() => {
            setSearchQuery("");
            setSelectedStatus("all");
            setCurrentPage(1);
          }}
        />
      ) : (
        /* Dynamic Table */
        <div className="bg-white rounded-xl border border-grayColor2 overflow-hidden shadow-xs">
          <DynamicTable
            columns={columns}
            data={rawApplicants}
            header={{
              position: "justify-start",
              padding: "14px 16px",
              bg: "#F8FAFC",
              text: "#4B5563",
              fontWeight: "600",
              fontSize: "13px",
              rounded: "0px",
            }}
            rowStyle={{
              hover: true,
              hoverbg: "hover:bg-[#F9FAFB]",
              border: "border-b border-gray-100",
            }}
            noDataMessage="No applicants found."
          />
        </div>
      )}

      {/* Pagination Component */}
      {!isLoading && !isError && totalCount > 0 && (
        <div className="mt-5">
          <Pagination
            page={currentPage}
            pageSize={limit}
            total={totalCount}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
            showPageSize={true}
            onPageSizeChange={(sz) => {
              setLimit(sz);
              setCurrentPage(1);
            }}
            pageSizeOptions={[10, 20, 50]}
          />
        </div>
      )}
    </div>
  );
}
