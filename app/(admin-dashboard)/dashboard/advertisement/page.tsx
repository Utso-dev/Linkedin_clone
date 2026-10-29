import AdvertisementTable from "@/app/(Front-End)/_components/adminDashboard/advertisement/AdvertisementDataTable";
import AdPerformanceOverview from "@/app/(Front-End)/_components/adminDashboard/advertisement/AdvertisementOverViewChat";
import AdvertisementPerformance from "@/app/(Front-End)/_components/adminDashboard/advertisement/AdvertisementPerfomance";
import AdvertisementStatusCard from "@/app/(Front-End)/_components/adminDashboard/advertisement/AdvertisementStatusCard";

export default function page() {
  return (
    <div>
      <div></div>

      <div className="mb-4">
        <AdvertisementStatusCard />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 pb-4">
        {/* First component - 8 columns */}
        <div className="xl:col-span-8">
          <AdvertisementPerformance />
        </div>

        {/* Second component - 4 columns */}
        <div className="xl:col-span-4">
          <AdPerformanceOverview />
        </div>
      </div>
      <div>
        <AdvertisementTable />
      </div>
    </div>
  );
}
