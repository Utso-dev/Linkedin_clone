import React from "react";
import TopJobsRightbar from "../_component/TopJobsRightbar";

function JobsGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="lg:grid lg:grid-cols-12  sm:pb-8 pb-6 gap-4 xl:gap-6 mb-10">
        <div className="xl:col-span-8 lg:border-r lg:pr-4 xl:pr-6 border-borderColor lg:col-span-8 col-span-12">
          {children}
        </div>
        <div className="hidden lg:block col-span-4   lg:sticky lg:top-24  lg:overflow-y-auto self-start">
          <TopJobsRightbar />
        </div>
      </div>
    </div>
  );
}

export default JobsGroupLayout;
