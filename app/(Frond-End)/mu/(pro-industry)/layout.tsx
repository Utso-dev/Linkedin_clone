import React from "react";
import Breadcrumb from "../../_components/Breadcrumb";
import ProIndustrySidebar from "./_component/ProIndustrySidebar";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Breadcrumb />
      <div className="lg:grid lg:grid-cols-8 xl:grid-cols-10 sm:pb-8 pb-6 gap-6 md:pb-10 mb-10">
        <div className="hidden lg:block col-span-2 lg:sticky lg:top-25  lg:overflow-y-auto self-start">
          <ProIndustrySidebar />
        </div>
        <div className="xl:col-span-8 lg:border-l lg:pl-6 border-[#D2D2D5] lg:col-span-6 col-span-12">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default layout;
