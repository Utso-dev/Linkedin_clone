"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
function SubscriptionFilter() {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const billingCycle = searchParams.get("billing") || "monthly";
  const setBillingCycle = (cycle: "monthly" | "yearly") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("billing", cycle);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <div>
      <div className="flex items-center justify-center gap-6 my-6">
        {/* Monthly */}
        <label
          onClick={() => setBillingCycle("monthly")}
          className="flex items-center gap-2 cursor-pointer text-sm font-medium"
        >
          <span
            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              billingCycle === "monthly"
                ? "border-[#00a8cc]"
                : "border-gray-300"
            }`}
          >
            {billingCycle === "monthly" && (
              <span className="w-2 h-2 rounded-full bg-[#00a8cc]" />
            )}
          </span>
          <span
            className={
              billingCycle === "monthly"
                ? "text-gray-900 font-medium"
                : "text-gray-400"
            }
          >
            Monthly
          </span>
        </label>
        {/* Yearly */}
        <label
          onClick={() => setBillingCycle("yearly")}
          className="flex items-center gap-2 cursor-pointer text-sm font-medium"
        >
          <span
            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              billingCycle === "yearly" ? "border-[#00a8cc]" : "border-gray-300"
            }`}
          >
            {billingCycle === "yearly" && (
              <span className="w-2 h-2 rounded-full bg-[#00a8cc]" />
            )}
          </span>
          <span
            className={
              billingCycle === "yearly"
                ? "text-gray-900 font-medium"
                : "text-gray-400"
            }
          >
            Yearly
          </span>
        </label>
      </div>
    </div>
  );
}

export default SubscriptionFilter;
