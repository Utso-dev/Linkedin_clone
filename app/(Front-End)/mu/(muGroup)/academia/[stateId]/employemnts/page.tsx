"use client";

import { useParams } from "next/navigation";
import AcademiHeader from "../_components/AcademiHeader";
import EmploymentCard from "./_components/EmploymentCard";
import EmploymentLoading from "./_components/EmploymentLoading";
import { useGetStateByJobOfferingQuery } from "@/feature/slice/jobs/jobSlice";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import { StateNames } from "@/public/staticData";

export type Employment = {
  id: number;
  job_id?: string;
  job_title?: string;
  title?: string;
  slug?: string;
  position?: string;
  status?: string;
  work_mode?: string;
  employment_type?: string;
  location?: string;
  company_name?: string;
  created_at?: string;
  created_at_human?: string;
  salary_min?: string;
  salary_max?: string;
  salary_type?: string;
  state_id?: number;
  city_id?: number;
  category?: string;
  sub_category?: string | null;
  employment_offering?: "state" | "private" | string;
  network_type?: string;
  industry?: {
    id: number;
    name: string;
    slug: string;
    logo?: string;
    website?: string;
    is_own_industry?: boolean;
  };
  [key: string]: any;
};

export default function Page() {
  const params = useParams();
  const stateId = params?.stateId as string;

  // 1. State / Institution Offerings Query with Cursor Pagination
  const {
    combinedData: stateJobs,
    isLoading: isStateLoading,
    isFetchingMore: isStateFetchingMore,
    hasMore: hasMoreState,
    loadMore: loadMoreState,
    observerRef: stateObserverRef,
    data: stateResponse,
  } = useCursorQuery<Employment>(
    useGetStateByJobOfferingQuery,
    {
      code: stateId,
      employment_offering: "state",
    },
    {
      limit: 10,
    },
  );

  // 2. Private Practice Offerings Query with Cursor Pagination
  const {
    combinedData: privateJobs,
    isLoading: isPrivateLoading,
    isFetchingMore: isPrivateFetchingMore,
    hasMore: hasMorePrivate,
    loadMore: loadMorePrivate,
    observerRef: privateObserverRef,
    data: privateResponse,
  } = useCursorQuery<Employment>(
    useGetStateByJobOfferingQuery,
    {
      code: stateId,
      employment_offering: "private",
    },
    {
      limit: 10,
    },
  );

  const stateDisplayName =
    stateResponse?.state?.name ||
    privateResponse?.state?.name ||
    StateNames[stateId] ||
    stateId;

  const stateOfferingsCount =
    stateResponse?.state_jobs_count ??
    stateResponse?.total_jobs ??
    stateJobs.length;

  const privateOfferingsCount =
    privateResponse?.private_jobs_count ??
    privateResponse?.total_jobs ??
    privateJobs.length;

  if (isStateLoading && isPrivateLoading) {
    return <EmploymentLoading />;
  }

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {/* 1. Sticky Header */}
      <div className="sticky top-0 z-20 bg-white pb-3 pt-1 lg:pl-6 border-b border-borderColor/40 shrink-0">
        <AcademiHeader
          title={`Employment Opportunities in ${stateDisplayName}`}
        />
      </div>

      {/* 2. Scrollable Data Container */}
      <div className="flex-1 min-h-0 overflow-y-auto max-h-[calc(100vh-220px)] mt-4 pr-1 scrollbar-thin">
        <div className="w-full flex flex-col md:flex-row min-h-50 gap-6">
          {/* Column 1: State and Institution Offerings */}
          <div className="flex-1 space-y-4 xl:space-y-6 px-0 py-2 lg:py-0 lg:px-6 lg:border-r border-liteDescriptionColor">
            <div className="sticky top-0 z-10 flex items-center gap-1 p-2 bg-bgColor rounded shadow-2xs">
              <h2 className="text-blackColor text-base font-semibold leading-[150%] tracking-[0.08px]">
                State and Institution Offerings
              </h2>
              <p className="text-[#777980] text-base font-normal leading-[150%] tracking-[0.08px]">
                {`(${stateOfferingsCount} Offerings)`}
              </p>
            </div>

            {isStateLoading ? (
              <div className="py-12 flex justify-center">
                <span className="w-8 h-8 border-3 border-primaryColor border-t-transparent rounded-full animate-spin" />
              </div>
            ) : stateJobs.length > 0 ? (
              <div className="space-y-4">
                {stateJobs.map((opportunity: Employment) => (
                  <EmploymentCard key={opportunity.id} data={opportunity} />
                ))}

                {hasMoreState && (
                  <div
                    ref={stateObserverRef}
                    className="py-3 flex flex-col items-center justify-center gap-2"
                  >
                    {isStateFetchingMore ? (
                      <span className="w-6 h-6 border-2 border-primaryColor border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => loadMoreState()}
                        className="text-xs sm:text-sm text-primaryColor hover:underline font-medium cursor-pointer"
                      >
                        Load more offerings...
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center py-10">
                <p className="text-center text-gray-500">
                  No state institution offerings available.
                </p>
              </div>
            )}
          </div>

          {/* Column 2: Private Practice Offerings */}
          <div className="flex-1 space-y-4 xl:space-y-6 px-0 py-2 lg:py-0 ">
            <div className="sticky top-0 z-10 flex items-center gap-1 p-2 bg-bgColor rounded shadow-2xs">
              <h2 className="text-blackColor text-base font-semibold leading-[150%] tracking-[0.08px]">
                Private Practice Offerings
              </h2>
              <p className="text-[#777980] text-base font-normal leading-[150%] tracking-[0.08px]">
                {`(${privateOfferingsCount} Offerings)`}
              </p>
            </div>

            {isPrivateLoading ? (
              <div className="py-12 flex justify-center">
                <span className="w-8 h-8 border-3 border-primaryColor border-t-transparent rounded-full animate-spin" />
              </div>
            ) : privateJobs.length > 0 ? (
              <div className="space-y-4">
                {privateJobs.map((opportunity: Employment) => (
                  <EmploymentCard key={opportunity.id} data={opportunity} />
                ))}

                {hasMorePrivate && (
                  <div
                    ref={privateObserverRef}
                    className="py-3 flex flex-col items-center justify-center gap-2"
                  >
                    {isPrivateFetchingMore ? (
                      <span className="w-6 h-6 border-2 border-primaryColor border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => loadMorePrivate()}
                        className="text-xs sm:text-sm text-primaryColor hover:underline font-medium cursor-pointer"
                      >
                        Load more offerings...
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center py-10">
                <p className="text-center text-gray-500">
                  No private practice offerings available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
