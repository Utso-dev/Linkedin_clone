import Breadcrumb from "../../../_components/Breadcrumb";
import JobsLeftSidebar from "./_component/JobsLeftSidebar";
import TopJobsRightbar from "./_component/TopJobsRightbar";

export default async function FrontEndLayout({
  children,
  
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="">
        
        <div className="lg:grid lg:grid-cols-11  sm:pb-8 pb-6 gap-4 xl:gap-6 mb-10">
          <div className="hidden lg:block col-span-3 xl:col-span-2   lg:sticky lg:top-24  lg:overflow-y-auto self-start">
            <JobsLeftSidebar />
          </div>
          <div className="xl:col-span-9 lg:border-l lg:pl-4 xl:pl-6 border-borderColor lg:col-span-9 col-span-12">
            {children}
          </div>
         
        </div>
        {/* <div>{children}</div> */}
      </div>
    </div>
  );
}
