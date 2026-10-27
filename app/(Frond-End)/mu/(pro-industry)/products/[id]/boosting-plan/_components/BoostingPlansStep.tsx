"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import { useLazyGetBoostOrderSummaryQuery } from "@/feature/slice/jobs/boostingSlice";
import {
  BoostPackage,
  CustomSliderConfig,
  OrderSummary,
  PlanConfig,
} from "@/types/boosting";
import { Check, Loader2, PackageOpen } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

interface BoostingPlansStepProps {
  productId: string | number;
  presetPackages: BoostPackage[];
  customSlider?: CustomSliderConfig;
  product?: any;
  initialPlanConfig?: PlanConfig;
  onNext: (orderSummary: OrderSummary, planConfig: PlanConfig) => void;
}

export default function BoostingPlansStep({
  productId,
  presetPackages = [],
  customSlider,
  product,
  initialPlanConfig,
  onNext,
}: BoostingPlansStepProps) {
  // Sort plans ascending by duration
  const packagesToDisplay = useMemo(() => {
    if (Array.isArray(presetPackages) && presetPackages.length > 0) {
      return [...presetPackages].sort(
        (a, b) => (a.duration_days || 0) - (b.duration_days || 0),
      );
    }
    return [];
  }, [presetPackages]);

  const [isCustom, setIsCustom] = useState(
    initialPlanConfig?.isCustom ?? packagesToDisplay.length === 0,
  );
  const [customDays, setCustomDays] = useState(
    initialPlanConfig?.customDays ?? 20,
  );
  const [selectedPkgId, setSelectedPkgId] = useState<number | null>(
    initialPlanConfig?.pkgId ?? null,
  );
  const [loading, setLoading] = useState(false);

  const [fetchOrderSummary] = useLazyGetBoostOrderSummaryQuery();

  // Custom Slider configuration
  const minDays = customSlider?.min_days ?? 3;
  const maxDays = customSlider?.max_days ?? 60;
  const dailyRate = customSlider?.daily_rate ?? 3.0;
  const totalCustomPrice = (dailyRate * customDays).toFixed(2);

  const minImpressionsK = Math.round(
    ((customSlider?.daily_estimated_impressions_min || 4000) * customDays) /
      1000,
  );
  const maxImpressionsK = Math.round(
    ((customSlider?.daily_estimated_impressions_max || 7000) * customDays) /
      1000,
  );

  const getImpressionBoxStyle = (index: number) => {
    if (index === 0) {
      return {
        box: "border-dashed border-LiteBlueColor/60 bg-[#F5F3FF]",
        text: "text-LiteBlueColor",
      };
    }
    if (index === 1) {
      return {
        box: "border-dashed border-[#5EEAD4] bg-[#F0FDFA]",
        text: "text-[#0D9488]",
      };
    }
    return {
      box: "border-dashed border-[#FDBA74] bg-[#FFF7ED]",
      text: "text-[#EA580C]",
    };
  };

  const handleSelectPlan = async (
    pkgId: number | null,
    days: number | null,
  ) => {
    if (!productId) {
      toast.error("Product ID is missing.");
      return;
    }
    setLoading(true);

    try {
      const isCustomPlan = !pkgId;
      const activePkgId = pkgId;
      const activeDays = days || customDays;

      const params = pkgId
        ? { boost_package_id: pkgId }
        : { custom_days: activeDays };

      const res = await fetchOrderSummary({
        productId,
        ...params,
      }).unwrap();

      let summary: OrderSummary;

      if (res?.data?.order_summary) {
        summary = res.data.order_summary;
      } else {
        const chosenPkg = packagesToDisplay.find((p) => p.id === pkgId);
        const calcPrice = isCustomPlan
          ? Number(totalCustomPrice)
          : Number(chosenPkg?.price || 0);

        summary = {
          product_id: String(product?.product_id || product?.id || productId),
          product_name: product?.product_name || "Product",
          product_image: product?.image_url || product?.image || null,
          plan_title: chosenPkg
            ? `${chosenPkg.name} Boosting`
            : `Custom Boosting (${activeDays} Days)`,
          duration_days: chosenPkg ? chosenPkg.duration_days : activeDays,
          duration_text: chosenPkg
            ? `${chosenPkg.duration_days} Days`
            : `${activeDays} Days`,
          estimated_impressions: chosenPkg
            ? chosenPkg.estimated_impressions
            : `Est. ${minImpressionsK}k – ${maxImpressionsK}k Impression`,
          subtotal: calcPrice,
          subtotal_formatted: `$${calcPrice.toFixed(2)}`,
          vat: 0.0,
          vat_formatted: "$0.00",
          total: calcPrice,
          total_formatted: `$${calcPrice.toFixed(2)}`,
          currency: "USD",
        };
      }

      onNext(summary, {
        pkgId: activePkgId,
        customDays: activeDays,
        isCustom: isCustomPlan,
      });
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Failed to load order summary. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Preset Packages from API */}
      {packagesToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {packagesToDisplay.map((item: BoostPackage, index: number) => {
            const isPopular =
              Boolean(
                item.badge && item.badge.toLowerCase().includes("popular"),
              ) || index === 1;
            const badgeText =
              item.badge || (isPopular ? "Most Popular Plan" : null);
            const impressionStyle = getImpressionBoxStyle(index);

            return (
              <div
                key={item.id || index}
                className="relative rounded-2xl border border-borderColor bg-white p-4 flex flex-col justify-between transition-all hover:shadow-md hover:border-slate-300"
              >
                {/* Popular or Feature Badge */}
                {badgeText && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primaryColor text-white leading-[160%] text-xs font-bold px-3 py-0.5 rounded-md shadow-xs whitespace-nowrap">
                    {badgeText}
                  </div>
                )}

                <div>
                  {/* Plan Name */}
                  <h3 className="text-lg font-bold text-headerColor">
                    {item.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mt-3">
                    <p className="text-3xl font-extrabold text-headerColor">
                      ${Number(item.price).toFixed(2)}
                    </p>
                    <p className="text-xs font-medium text-descriptionColor">
                      / {item.duration_days} Days
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-descriptionColor mt-2 min-h-8 leading-relaxed">
                    {item.description || "Maximize your reach and engagement."}
                  </p>

                  {/* Estimated Impressions Box */}
                  <div
                    className={`border rounded-lg py-2.5 px-3 text-center my-4 ${impressionStyle.box}`}
                  >
                    <p
                      className={`text-sm font-semibold ${impressionStyle.text}`}
                    >
                      {item.estimated_impressions ||
                        `Est. ${(item.duration_days || 7) * 2}k - ${(item.duration_days || 7) * 5}k Impression`}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 my-4 mt-6">
                    {(item.features || []).map(
                      (feature: string, fIdx: number) => (
                        <div
                          key={fIdx}
                          className="flex items-start gap-2 text-left"
                        >
                          <div className="w-4 h-4 rounded-full bg-primaryColor flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-white stroke-3" />
                          </div>
                          <p className="text-sm text-headerColor/80 leading-[120%]">
                            {feature}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Boost Now Button */}
                <ButtonReuseable
                  type="button"
                  disabled={isCustom}
                  loading={loading && selectedPkgId === item.id}
                  sendingMsg={
                    <span className="inline-flex items-center gap-1.5 justify-center">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Preparing...
                    </span>
                  }
                  title="Boost Now"
                  onClick={() => {
                    setSelectedPkgId(item.id);
                    handleSelectPlan(item.id, null);
                  }}
                  className="py-2! bg-primaryColor! mt-2"
                  
                />
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State when no API packages are available */
        <div className="rounded-2xl border border-dashed border-borderColor bg-white p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <PackageOpen className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-headerColor">
            No Boosting Plans Available
          </h3>
          <p className="text-xs text-descriptionColor mt-1 max-w-sm">
            There are currently no preset boosting plans available for this
            product. You can customize your boosting duration below.
          </p>
        </div>
      )}

      {/* Custom Boosting Section */}
      <div className="border border-borderColor bg-white rounded-2xl p-6 transition-shadow hover:shadow-xs">
        {/* Header Row with Toggle Switch */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base md:text-lg font-bold text-headerColor">
              Custom Boosting
            </h3>
            <p className="text-xs text-descriptionColor mt-0.5">
              Set customized duration and reach parameters
            </p>
          </div>

          {/* Switch Toggle Button */}
          <button
            type="button"
            role="switch"
            aria-checked={isCustom}
            onClick={() => setIsCustom((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isCustom ? "bg-primaryColor" : "bg-slate-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                isCustom ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Collapsible Slider & Action (Visible only when switch is active) */}
        {isCustom && (
          <div className="mt-6 space-y-5 pt-3 border-t border-borderColor/60 animate-in fade-in-50 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs md:text-sm text-headerColor font-medium">
                Custom duration:{" "}
                <span className="font-bold text-primaryColor">
                  {customDays} days
                </span>
              </div>
              <div className="border border-[#2DD4BF] text-[#0D9488] bg-[#F0FDFA] px-3 py-1 rounded-md text-xs font-bold w-fit">
                Est. {minImpressionsK}k - {maxImpressionsK}k Impression
              </div>
            </div>

            {/* Slider */}
            <div className="py-2">
              <input
                type="range"
                min={minDays}
                max={maxDays}
                value={customDays}
                onChange={(e) => setCustomDays(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primaryColor"
              />
              <div className="flex justify-between items-center text-xs text-slate-400 mt-2 font-medium">
                <span>Min {minDays} Days</span>
                <span>Max {maxDays} Days</span>
              </div>
            </div>

            {/* Calculation Text */}
            <div className="text-center text-sm font-semibold text-primaryColor pt-1">
              ${dailyRate.toFixed(2)} x {customDays} Days = ${totalCustomPrice}{" "}
              Total
            </div>

            {/* Pay Button */}
            <ButtonReuseable
              type="button"
              disabled={loading}
              loading={loading && selectedPkgId === null}
              sendingMsg={
                <span className="inline-flex items-center gap-1.5 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Preparing checkout...
                </span>
              }
              title={`Pay USD $${totalCustomPrice}`}
              onClick={() => {
                setSelectedPkgId(null);
                handleSelectPlan(null, customDays);
              }}
              className="w-full h-auto! py-3.5! rounded-xl bg-primaryColor! hover:bg-primaryColor/90! text-white font-bold text-sm cursor-pointer shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
