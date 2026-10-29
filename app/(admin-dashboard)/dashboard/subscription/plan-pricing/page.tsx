import PlanPricingCard from "@/app/(Front-End)/_components/adminDashboard/subscription/planPricingCard/PlanPricingCard";
import PlanPricingTable from "@/app/(Front-End)/_components/adminDashboard/subscription/planPricingCard/PlanPricingTable";

export default function page() {
  return (
    <div>
      <div>
        <PlanPricingCard />
      </div>
      <div className="mt-4">
        <PlanPricingTable />
      </div>
    </div>
  );
}
