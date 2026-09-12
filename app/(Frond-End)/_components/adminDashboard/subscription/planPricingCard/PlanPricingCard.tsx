"use client";

import {
  useDeactivePlanMutation,
  useGetPlanFeaturesQuery,
  useGetPlansQuery,
} from "@/feature/slice/admin/subscription/subscriptionApi";
import { Plan } from "@/feature/slice/admin/subscription/subscriptionType";
import { CorrectIcon } from "@/public/svgIcons/AdminIcon";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const parseRate = (rate: string) => Number(String(rate).replace(/[^0-9.]/g, "")) || 0;

const formatPrice = (rate: string) => {
  const value = parseRate(rate);
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

const formatDiscountDate = (value?: string) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function PlanPricingCard() {
  const { data: apiResponse, isLoading, isError } = useGetPlansQuery();
  const { data: featuresResponse } = useGetPlanFeaturesQuery();
  const [deactivePlan] = useDeactivePlanMutation();

  const [billingType, setBillingType] = useState<"monthly" | "annually">("annually");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const featureOptions = featuresResponse?.data ?? [];
  const plans = apiResponse?.data ?? [];

  const visiblePlans = useMemo(
    () =>
      plans.filter((plan) =>
        billingType === "monthly"
          ? plan.billing_cycle === "monthly"
          : plan.billing_cycle === "yearly"
      ),
    [plans, billingType]
  );

  const getFeatureLabel = (feature: string) =>
    featureOptions.find((option) => option.value === feature || option.label === feature)
      ?.label ?? feature;

  const getDiscountPercent = (plan: Plan) => Number(plan.discount_percent) || 0;

  const getOriginalPrice = (plan: Plan) => {
    const discount = getDiscountPercent(plan);
    const current = parseRate(plan.billing_rate);
    if (discount <= 0 || discount >= 100 || !current) return null;
    const original = current / (1 - discount / 100);
    return Number.isInteger(original) ? String(original) : original.toFixed(2);
  };

  const handleToggleActive = async (plan: Plan) => {
    try {
      await deactivePlan({ id: plan.id }).unwrap();
      toast.success(
        plan.status === "active"
          ? "Plan deactivated successfully."
          : "Plan activated successfully."
      );
    } catch {
      toast.error(
        plan.status === "active"
          ? "Failed to deactivate this plan."
          : "Failed to activate this plan."
      );
    } finally {
      setOpenMenuId(null);
    }
  };

 

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((planId) => planId !== id) : [...prev, id]
    );
  };

  return (
    <div className="">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A]">Plan & Pricing</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Create and manage subscription plans, pricing, and features.
          </p>
        </div>

        <Link
          href="/dashboard/subscription/plan-pricing/create-new-plan"
          className="flex items-center gap-2 rounded-lg bg-primaryColor px-5 py-2.5 text-sm font-medium text-white hover:bg-[#038a9c]"
        >
          + Add new plan
        </Link>
      </div>

      <div className="mb-4 flex justify-center">
        <div className="inline-flex items-center rounded-lg border border-[#E1E4EA] bg-[#F1F2F9] p-1">
          <button
            onClick={() => setBillingType("monthly")}
            className={`rounded-lg px-5 py-2 text-base font-semibold leading-[150%] tracking-[0.08px] transition ${
              billingType === "monthly"
                ? "bg-white text-[#170F49]"
                : "text-[#170F49]"
            }`}
          >
            Monthly billing
          </button>

          <button
            onClick={() => setBillingType("annually")}
            className={`rounded-lg px-5 py-2 text-base font-semibold leading-[150%] tracking-[0.08px] transition ${
              billingType === "annually"
                ? "bg-white text-[#170F49]"
                : "text-[#170F49]"
            }`}
          >
            Annually billing
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="py-12 text-center text-sm text-gray-400">Loading plans...</p>
      ) : isError ? (
        <p className="py-12 text-center text-sm text-red-500">Failed to load plans.</p>
      ) : visiblePlans.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400">
          No {billingType === "monthly" ? "monthly" : "yearly"} plans found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visiblePlans.map((plan) => {
            const discount = getDiscountPercent(plan);
            const originalPrice = getOriginalPrice(plan);
            const isExpanded = expandedIds.includes(plan.id);
            const features = plan.features ?? [];
            const visibleFeatures = isExpanded ? features : features.slice(0, 6);

            return (
              <div
                key={plan.id}
                className="relative flex flex-col rounded-2xl border border-[#E1E4EA] bg-white p-6"
              >
                <div className="absolute right-4 top-4">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === plan.id ? null : plan.id)
                    }
                    className="rounded-full p-1.5 text-[#64748B] hover:bg-gray-100"
                  >
                    ⋮
                  </button>

                  {openMenuId === plan.id && (
                    <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-[#E1E4EA] bg-white py-1 shadow-lg">
                      <button
                        onClick={() => handleToggleActive(plan)}
                        className="block w-full px-4 py-2.5 text-left text-sm text-[#0F172A] hover:bg-[#E9FAF7]"
                      >
                        {plan.status === "active"
                          ? "Deactivate this plan"
                          : "Active This Plan"}
                      </button>
                    
                    </div>
                  )}
                </div>

                <div className="mb-4 min-h-[143px]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-semibold leading-[130%] tracking-[0.12px] text-[#170F49]">
                      {plan.name}
                    </h3>

                    {discount > 0 && (
                      <span className="rounded-full bg-[#E9FAF7] px-2.5 py-0.5 text-xs font-medium text-primaryColor">
                        Save {discount}%
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-[56px] font-semibold leading-[130%] text-[#170F49]">
                      ${formatPrice(plan.billing_rate)}
                    </span>

                    <div className="flex flex-col">
                      <span className="text-base font-normal leading-[150%] tracking-[0.08px] text-[#A0A3BD]">
                        Per user
                      </span>

                      <p className="text-base font-normal leading-[150%] tracking-[0.08px] text-[#A0A3BD]">
                        {plan.billing_cycle === "monthly" ? "Monthly" : "Yearly"}
                      </p>
                    </div>
                  </div>

                  {discount > 0 && (
                    <p className="mt-1 text-sm text-[#94A3B8]">
                      {originalPrice && (
                        <span className="line-through">${originalPrice}</span>
                      )}{" "}
                      {plan.discount_duration && (
                        <span className="text-base text-primaryColor">
                          Until {formatDiscountDate(plan.discount_duration)}
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <div className="min-h-[50px] ">
                  <p className="text-base font-normal leading-6 tracking-[0.08px] text-[#514F6E]">
                    {plan.short_description}
                  </p>
                </div>

                <div className="w-full border-t border-[#E1E4EA]" />
                <ul className="space-y-2.5 mt-8">
                  {visibleFeatures.map((feature, idx) => (
                    <li key={`${plan.id}-${feature}-${idx}`} className="flex items-center gap-2">
                      <CorrectIcon />
                      <span className="text-base font-normal leading-[150%] tracking-[0.08px] text-[#6F6C8F]">
                        {getFeatureLabel(feature)}
                      </span>
                    </li>
                  ))}
                </ul>

                {features.length > 6 && (
                  <button
                    type="button"
                    onClick={() => toggleExpanded(plan.id)}
                    className="mt-5 flex items-center gap-1 text-base font-normal leading-[150%] tracking-[0.08px] text-primaryColor hover:underline"
                  >
                    <Plus className="h-4 w-4" />
                    {isExpanded ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
