import { headers } from "next/headers";
import Breadcrumb from "../../../_components/Breadcrumb";

export default async function FrontEndLayout({
  children,
  
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();

  const pathname = headersList.get("x-current-path") || "";
  const params = headersList.get("x-current-params") || "";
  
  return (
    <div>
      <div className="">
      {pathname !== `/mu/jobs/subscription/${params}` && <Breadcrumb />} 
        {/* <div className="lg:grid lg:grid-cols-12  sm:pb-8 pb-6 gap-4 xl:gap-6 mb-10">
          <div className="hidden lg:block col-span-3   lg:sticky lg:top-19  lg:overflow-y-auto self-start">
            <JobsLeftSidebar />
          </div>
          <div className="xl:col-span-6 lg:border-x lg:px-4 xl:px-6 border-[#D2D2D5] lg:col-span-6 col-span-12">
            {children}
          </div>
          <div className="hidden lg:block col-span-3   lg:sticky lg:top-19  lg:overflow-y-auto self-start">
            <TopJobsRightbar />
          </div>
        </div> */}
        <div>{children}</div>
      </div>
    </div>
  );
}
