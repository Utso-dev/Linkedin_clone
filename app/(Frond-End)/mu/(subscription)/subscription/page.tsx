import { getToken } from "@/lib/token";
import SubscriptionFilter from "../_component/SubscriptionFilter";
import SubscriptionCards from "../_component/SubscriptionPricingTable";

async function page({
  searchParams,
}: {
  searchParams: Promise<{ billing?: string }>;
}) {
  const { billing: billingCycle } = await searchParams;

  const token = await getToken();
  const data = await (async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/plans?billing_cycle=${billingCycle}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          next: { revalidate: 3600 },
        },
      );

      if (!res.ok) {
        console.error("API failed:", res.status, res.statusText);
        return null;
      }

      return res.json();
    } catch (error) {
      console.log(error, "error=====");
      return null;
    }
  })();

  const plans = data?.data?.plans || [];
  return (
    <div className="my-14 md:my-20">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-headerColor text-center">
          Choose your subscription plan
        </h1>
        <div>
          <SubscriptionFilter />
        </div>
      </div>
      <SubscriptionCards plans={plans} billingCycle={billingCycle} />
    </div>
  );
}

export default page;
