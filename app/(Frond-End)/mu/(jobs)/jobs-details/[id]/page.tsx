import JobsDetailsPage from "@/app/(Frond-End)/mu/(pro-industry)/_component/jobs/JobsDetailsPage";
import JobDetailsHeader from "../../../(pro-industry)/_component/jobs/JobDetailsHeader";
import TopJobsRightbar from "../../jobs/_component/TopJobsRightbar";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="lg:grid lg:grid-cols-11  sm:pb-8 pb-6 gap-4 xl:gap-6 mb-10">
      <div className="hidden lg:block col-span-3 xl:col-span-3   lg:sticky lg:top-19  lg:overflow-y-auto self-start">
            <TopJobsRightbar />
      </div>
      <div className="xl:col-span-8 lg:border-l lg:pl-4 xl:pl-6 border-[#D2D2D5] lg:col-span-8 col-span-12" >
      <JobDetailsHeader />
      <JobsDetailsPage id={id} />
      </div>
    </div>
  );
}

export default page;
