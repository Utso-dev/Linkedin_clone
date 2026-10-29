"use client";

import { useEffect, useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomRadioButton from "@/components/reusable/dashboard/CustomRadioButton";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import CustomSwitch from "@/components/reusable/dashboard/CustomSwitch";
import CustomTextArea from "@/components/reusable/dashboard/CustomTextArea";
import { DatePicker } from "@/components/reusable/dashboard/DatePicker";
import {
  Plan,
  PlanFeatureOption,
  PlanFeatureValue,
  PlanPayload,
} from "@/feature/slice/admin/subscription/subscriptionType";
import {
  useCreatePlanMutation,
  useGetPlanFeaturesQuery,
  useUpdatePlanMutation,
} from "@/feature/slice/admin/subscription/subscriptionApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CreatePlanModalProps {
  data?: Plan | null;
  onClose?: () => void;
  onSuccess?: () => void;
}

const toDateValue = (value?: string): Date | undefined => {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed;
};

const formatDateValue = (value?: Date) => {
  if (!value) return "";
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isFeatureAvailableForType = (
  feature?: PlanFeatureOption,
  type?: "premium" | "industry",
) => {
  if (!feature) return true;
  if (!type || !feature.plan_types?.length) return true;
  return feature.plan_types.includes(type);
};

export default function CreatePlan({
  data,
  onClose,
  onSuccess,
}: CreatePlanModalProps) {
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const {
    data: featuresResponse,
    isLoading: isFeaturesLoading,
    isError: isFeaturesError,
  } = useGetPlanFeaturesQuery();
  const router = useRouter();

  const featureOptions = featuresResponse?.data;

  const [formData, setFormData] = useState({
    name: data?.name || "",
    shortDescription: data?.short_description || "",
    billingRate: String(data?.billing_rate ?? "0.00").replace("$", ""),
    billingCycle: data?.billing_cycle || "yearly",
    discount: String(data?.discount_percent ?? "0"),
    badgeColor: data?.badge_color || "#04A1B7",
    status: data ? data.status === "active" : true,
    revenuecatStoreIdIos: data?.revenuecat_store_identifier_ios || "",
    revenuecatStoreIdAndroid: data?.revenuecat_store_identifier_android || "",
    revenuecatEntitlementId: data?.revenuecat_entitlement_identifier || "",
  });

  const [selectedFeatures, setSelectedFeatures] = useState<PlanFeatureValue[]>(
    [],
  );
  const [date, setDate] = useState<Date | undefined>(
    toDateValue(data?.discount_duration),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [planType, setPlanType] = useState<"premium" | "industry">(
    data?.plan_type ?? "premium",
  );

  useEffect(() => {
    if (!featureOptions?.length) return;

    const mapped = (data?.features ?? [])
      .map((feature) => {
        const match = featureOptions.find(
          (option) => option.value === feature || option.label === feature,
        );
        return match;
      })
      .filter(
        (option): option is PlanFeatureOption =>
          Boolean(option) && isFeatureAvailableForType(option, planType),
      )
      .map((option) => option.value);

    setSelectedFeatures(mapped);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureOptions, data?.features]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlanTypeChange = (value: string) => {
    setPlanType(value as "premium" | "industry");
    const type = value as "premium" | "industry";
    setSelectedFeatures((prev) =>
      prev.filter((feature) => {
        const option = featureOptions?.find((f) => f.value === feature);
        return !option || isFeatureAvailableForType(option, type);
      }),
    );
  };

  const handleFeatureToggle = (value: PlanFeatureValue) => {
    setSelectedFeatures((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: PlanPayload = {
      name: formData.name,
      plan_type: planType,
      short_description: formData.shortDescription,
      billing_rate: Number(formData.billingRate) || 0,
      billing_cycle: formData.billingCycle === "yearly" ? "yearly" : "monthly",
      discount_percent: Number(formData.discount) || 0,
      discount_duration: formatDateValue(date),
      badge_color: formData.badgeColor,
      status: formData.status ? "active" : "inactive",
      revenuecat_store_identifier_ios: formData.revenuecatStoreIdIos.trim() || null,
      revenuecat_store_identifier_android: formData.revenuecatStoreIdAndroid.trim() || null,
      revenuecat_entitlement_identifier: formData.revenuecatEntitlementId.trim() || null,
      features: selectedFeatures,
    };

    try {
      if (data?.id) {
        await updatePlan({ id: data.id, body: payload }).unwrap();
        toast.success("Plan updated successfully.");
      } else {
        await createPlan(payload).unwrap();
        toast.success("Plan created successfully.");
      }
      onSuccess?.();
      onClose?.();
      router.push("/dashboard/subscription/plan-pricing");
    } catch (err) {
      console.error(err);
      toast.error(
        data?.id ? "Failed to update plan." : "Failed to create plan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-[10px] ">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className=" border-[#E1E4EA]">
          <h2 className="text-[#1D1F2C] text-2xl font-semibold leading-[130%] tracking-[0.12px] ">
            {data ? "Edit Plan" : "Create New Plan"}
          </h2>
          <p className="mt-2  text-base font-normal leading-[150%] tracking-[0.08px] text-[#4A4C56]">
            Create a new subscription plan with pricing and features.
          </p>
        </div>

        <div className="py-4">
          <hr className="border-[#E1E4EA]" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Left Side - Plan Information */}
          <div className="space-y-5 border border-[#E2E8F0] p-4 rounded-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className=" text-xl font-semibold leading-[130%] tracking-[0.1px] text-[#1D1F2C]">
                  Plan Information
                </h3>
                <p className=" mt-1  text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
                  Add Subscription
                </p>
              </div>

              {/* Plan Type Radio Buttons */}
              <div className="text-right">
                <CustomRadioButton
                  label="Plan Type"
                  value={planType}
                  onChange={handlePlanTypeChange}
                  options={[
                    { label: "Premium", value: "premium" },
                    { label: "Industry", value: "industry" },
                  ]}
                  className="justify-end"
                />
              </div>
            </div>

            <CustomInput
              label="Plan Name"
              required
              placeholder="Enter subscription name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <CustomTextArea
              label="Short Description (Max 150 characters)"
              placeholder="Brief description about this plan..."
              value={formData.shortDescription}
              onChange={(e) => handleChange("shortDescription", e.target.value)}
              maxLength={150}
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Billing Rate"
                required
                placeholder="0.00"
                value={formData.billingRate}
                onChange={(e) => handleChange("billingRate", e.target.value)}
                type="number"
              />
              <CustomSelect
                label="Billing Cycle"
                required
                value={formData.billingCycle}
                onChange={(v) => handleChange("billingCycle", v as string)}
                options={[
                  { label: "Monthly", value: "monthly" },
                  { label: "Yearly", value: "yearly" },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Discount %"
                type="number"
                placeholder="0%"
                value={formData.discount}
                onChange={(e) => handleChange("discount", e.target.value)}
              />
              <div>
                <div className="flex items-center gap-2 relative mt-">
                  <input
                    type="color"
                    value={formData.badgeColor}
                    onChange={(e) => handleChange("badgeColor", e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded mt-7  absolute left-2"
                  />
                  <CustomInput
                    label="Badge Color"
                    value={formData.badgeColor}
                    onChange={(e) => handleChange("badgeColor", e.target.value)}
                    className="ps-16"
                  />
                </div>
              </div>
            </div>

            <DatePicker
              label="Discount Duration"
              date={date}
              setDate={setDate}
              placeholder="Select date"
            />

            <div className="space-y-5 border-t border-[#E1E4EA] pt-5">
              <CustomInput
                label="RevenueCat Store Identifier (iOS)"
                placeholder="Enter iOS store identifier"
                value={formData.revenuecatStoreIdIos}
                onChange={(e) => handleChange("revenuecatStoreIdIos", e.target.value)}
              />

              <CustomInput
                label="RevenueCat Store Identifier (Android)"
                placeholder="Enter Android store identifier"
                value={formData.revenuecatStoreIdAndroid}
                onChange={(e) => handleChange("revenuecatStoreIdAndroid", e.target.value)}
              />

              <CustomInput
                label="RevenueCat Entitlement Identifier"
                placeholder="Enter entitlement identifier"
                value={formData.revenuecatEntitlementId}
                onChange={(e) => handleChange("revenuecatEntitlementId", e.target.value)}
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between rounded-lg  px-4 py-3">
              <div>
                <p className=" text-[#4A4C56] font-['Segoe_UI'] text-base font-semibold leading-6 tracking-[0.08px]">
                  Plan Status
                </p>
                <p className=" text-sm font-normal leading-[140%] tracking-[0.07px] text-[#A5A5AB] mt-1">
                  You can activate or deactivate this plan.
                </p>
              </div>
              <CustomSwitch
                checked={formData.status}
                onChange={(checked) => handleChange("status", checked)}
              />
            </div>
          </div>

          {/* Right Side - Features */}
          <div className="border p-4 rounded-lg">
            <div className="mb-6">
              <h3 className=" text-xl font-semibold leading-[130%] tracking-[0.1px] text-[#1D1F2C]">
                Plan Feature
              </h3>
              <p className="mt-1  text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
                Select and configure features for this plan
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3 overflow-y-auto pr-1">
              {isFeaturesLoading ? (
                <p className="px-4 py-3 text-sm text-[#777980]">
                  Loading features...
                </p>
              ) : isFeaturesError ? (
                <p className="px-4 py-3 text-sm text-red-500">
                  Failed to load features.
                </p>
              ) : !featureOptions?.length ? (
                <p className="px-4 py-3 text-sm text-[#777980]">
                  No features available.
                </p>
              ) : (
                featureOptions.map((item) => {
                  const isAvailable = isFeatureAvailableForType(
                    item,
                    planType,
                  );
                  const isEnabled =
                    selectedFeatures.includes(item.value) && isAvailable;
                  return (
                    <div
                      key={item.value}
                      className="flex items-center justify-between rounded-lg pr-5 pb-5"
                    >
                      <div>
                        <span
                          className={`text-lg font-semibold leading-[130%] tracking-[0.1px] text-[#4A4C56] ${
                            !isAvailable ? "opacity-50" : ""
                          }`}
                        >
                          {item.label}
                        </span>
                        {!isAvailable && (
                          <p className="mt-1 text-xs font-normal leading-[140%] tracking-[0.07px] text-[#A5A5AB]">
                            Available for{" "}
                            {item.plan_types?.join(" & ") || "all"} plans only
                          </p>
                        )}
                      </div>
                      <CustomSwitch
                        checked={isEnabled}
                        disabled={!isAvailable}
                        onChange={() => handleFeatureToggle(item.value)}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E1E4EA] px-6 py-4">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-[#D9DDE5] px-6 text-[16px] font-medium text-[#0F172A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-lg border border-primaryColor bg-[#E9FAF7] px-5 text-base font-medium text-primaryColor hover:bg-[#DDF7FA] disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : data ? "Update Now" : "Create Now"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
