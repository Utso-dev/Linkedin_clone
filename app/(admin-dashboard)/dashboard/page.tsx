"use client";

import PendingApproval from "@/app/(Front-End)/_components/adminDashboard/dashboard/PendingApproval";
import RecentlyActivity from "@/app/(Front-End)/_components/adminDashboard/dashboard/RecentlyActivity";
import RevenueReportCard from "@/app/(Front-End)/_components/adminDashboard/dashboard/RevenieReportCard";
import StatusCard from "@/app/(Front-End)/_components/adminDashboard/dashboard/StatusCard";
import TotalRevenuePieCard from "@/app/(Front-End)/_components/adminDashboard/dashboard/TotalReveniewCard";
import UserGrowthCard from "@/app/(Front-End)/_components/adminDashboard/dashboard/UserGrothCard";

export default function page() {
  return (
    <div>
      <div>
        <StatusCard />
      </div>
      <div className="flex flex-col lg:flex-row w-full gap-6 h-full py-6">
        <div className="w-full">
          <RevenueReportCard />
        </div>
        <div className="w-full">
          <UserGrowthCard />
        </div>
        <div className="w-full">
          <TotalRevenuePieCard onRefresh={() => {}} />
        </div>
      </div>
      <div className="flex   w-full flex-col gap-6  lg:flex-row items-stretch">
        <div className="w-full md:max-w-[600px] flex flex-col ">
          <PendingApproval />
        </div>

        <div className="w-full  flex flex-col">
          <RecentlyActivity />
        </div>
      </div>
    </div>
  );
}
