"use client";
import { useGetRecruiterDashboardDataQuery } from "@/feature/slice/jobs/jobSlice";

function page() {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetRecruiterDashboardDataQuery({});
  const dashboardData = response?.data;
  const activityFeed = dashboardData?.activity_feed || [];
  return (
    <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-headerColor">
              Activity Feed
            </h3>
          </div>
      <div className="lg:col-span-4 bg-white rounded-2xl border border-borderColor/80 p-5 flex flex-col justify-between">
        <div>

          <div className="  ">
            {activityFeed.length > 0 ? (
              activityFeed.map((item) => (
                <div
                  key={item.id}
                  className="pt-3.5 first:pt-0 last:border-b-0 last:pb-0 border-b pb-4 flex items-start gap-3"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-buttonColor shrink-0 mt-1.5 shadow-xs" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-headerColor truncate">
                        {item.title}
                      </h4>
                      <span className="text-sm text-grayColor1 shrink-0">
                        {item.time || item.created_at_human}
                      </span>
                    </div>
                    <p className="text-sm text-grayColor1 mt-0.5 line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-grayColor1">
                No recent activities recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
