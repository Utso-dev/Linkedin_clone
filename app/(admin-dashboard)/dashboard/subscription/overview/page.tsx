import OverViewStatusCard from "@/app/(Front-End)/_components/adminDashboard/subscription/OverViewStatus";
import OverViewTable from "@/app/(Front-End)/_components/adminDashboard/subscription/OverViewTable";

export default function page() {
  return (
    <div>
      <div>
        <OverViewStatusCard />
      </div>
      <div className="mt-6">
        <OverViewTable />
      </div>
    </div>
  );
}
