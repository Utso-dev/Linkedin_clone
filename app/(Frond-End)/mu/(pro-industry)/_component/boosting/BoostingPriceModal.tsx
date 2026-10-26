"use client";

import RootDialog from "@/components/reusable/RootDialog";
import { useGetBoostingPlanQuery } from "@/feature/slice/jobs/boostingSlice";
import { Check } from "lucide-react";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";

interface BoostingPriceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  product?: any;
}

export default function BoostingPriceModal({
  open,
  setOpen,
  product,
}: BoostingPriceModalProps) {
  const { data: response, isLoading } = useGetBoostingPlanQuery(undefined, {
    skip: !open,
  });

  const [isCustom, setIsCustom] = useState(false);
  const [customDays, setCustomDays] = useState(20);

  const boostData = response?.data;
  const presetPackages = boostData?.preset_packages || [];
  const customSlider = boostData?.custom_slider;

  // Fallback defaults matching Image 2 & API response
  const fallbackPackages = [
    {
      id: 1,
      name: "Basic Free",
      duration_days: 7,
      price: 19.99,
      description: "Get started with more visibility",
      estimated_impressions: "Est. 5k - 10k Impression",
      features: [
        "Basic analytics",
        "Up to 5,000 impressions",
        "Standard placement",
        "Email support",
      ],
      badge: "Starter Tier",
    },
    {
      id: 2,
      name: "Growth Boost",
      duration_days: 14,
      price: 34.99,
      description: "Maximize your reach and engagement.",
      estimated_impressions: "Est. 15k - 25k Impression",
      features: [
        "Up to 15,000 impressions",
        "Targeted industry & location",
        "Featured placement",
        "Detailed analytics",
        "Priority support",
      ],
      badge: "Most Popular Plan",
    },
    {
      id: 3,
      name: "Best Value",
      duration_days: 30,
      price: 69.99,
      description: "For maximum exposure & impact.",
      estimated_impressions: "Est. 100k - 200k Impression",
      features: [
        "Up to 100,000 impressions",
        "Advanced targeting (industry, location, role, size)",
        "Premium placement (homepage & category)",
        "Full analytics & reporting",
        "Dedicated support",
      ],
      badge: "Best Value (Save 18%)",
    },
  ];

  const packagesToDisplay = useMemo(() => {
    if (presetPackages && presetPackages.length > 0) {
      return [...presetPackages].sort(
        (a: any, b: any) => (a.duration_days || 0) - (b.duration_days || 0),
      );
    }
    return fallbackPackages;
  }, [presetPackages]);

  const minDays = customSlider?.min_days ?? 3;
  const maxDays = customSlider?.max_days ?? 60;
  const dailyRate = customSlider?.daily_rate ?? 3.0;
  const totalCustomPrice = (dailyRate * customDays).toFixed(2);

  const minImpressionsK = Math.round(
    ((customSlider?.daily_estimated_impressions_min || 700) * customDays) /
      1000,
  );
  const maxImpressionsK = Math.round(
    ((customSlider?.daily_estimated_impressions_max || 1400) * customDays) /
      1000,
  );

  const getImpressionBoxStyle = (index: number) => {
    if (index === 0) {
      return {
        box: "border-dashed border-[#C4B5FD] bg-[#F5F3FF]",
        text: "text-[#7C3AED]",
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

  const handleSelectPreset = (pkg: any) => {
    if (isCustom) return;
    toast.success(
      `Selected ${pkg.name} for ${pkg.duration_days} days ($${pkg.price})`,
    );
  };

  const handlePayCustom = () => {
    toast.success(`Processing custom boost for ${customDays} days ($${totalCustomPrice})`);
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="!sm:max-w-4xl !md:max-w-4xl !lg:max-w-5xl rounded-2xl overflow-hidden p-0 max-h-[92vh] bg-white border border-slate-200"
      ariaLabel="Boosting Plans"
      ariaDescription="Overview of boosting plans and custom boosting options"
    >
      <div className="flex flex-col max-h-[90vh] overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Boosting Plans
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            manage boosting Overview features
          </p>
        </div>

        {/* 3 Preset Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 pt-2">
          {packagesToDisplay.map((item: any, index: number) => {
            const isPopular =
              index === 1 ||
              item.badge?.toLowerCase().includes("popular") ||
              item.name?.toLowerCase().includes("growth");
            const impressionStyle = getImpressionBoxStyle(index);

            return (
              <div
                key={item.id || index}
                className="relative rounded-2xl border border-slate-200 bg-white p-5 md:p-6 flex flex-col justify-between transition-shadow hover:shadow-sm"
              >
                {/* Popular Badge on Card 2 */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#009688] text-white text-[11px] font-bold px-3 py-0.5 rounded-md shadow-xs whitespace-nowrap">
                    Most Popular Plan
                  </div>
                )}

                <div>
                  {/* Plan Name */}
                  <h3 className="text-base md:text-lg font-bold text-slate-900">
                    {item.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ${Number(item.price).toFixed(2)}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      / {item.duration_days} Days
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 mt-2 min-h-8 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Estimated Impressions Box */}
                  <div
                    className={`border rounded-lg py-2.5 px-3 text-center my-4 ${impressionStyle.box}`}
                  >
                    <span
                      className={`text-xs font-semibold ${impressionStyle.text}`}
                    >
                      {item.estimated_impressions ||
                        `Est. ${index === 0 ? "5k - 10k" : index === 1 ? "15k - 25k" : "100k - 200k"} Impression`}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 my-4">
                    {(item.features || []).map(
                      (feature: string, fIdx: number) => (
                        <div
                          key={fIdx}
                          className="flex items-start gap-2 text-left"
                        >
                          <div className="w-4 h-4 rounded-full bg-[#009688] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                          </div>
                          <span className="text-xs text-slate-600 font-medium leading-tight">
                            {feature}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Boost Now Button */}
                <button
                  type="button"
                  disabled={isCustom}
                  onClick={() => handleSelectPreset(item)}
                  className={`w-full py-2.5 rounded-lg border text-xs font-semibold transition mt-4 ${
                    isCustom
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                      : "bg-white text-slate-600 border-slate-300 hover:border-[#009688] hover:text-[#009688] hover:bg-[#F0FDFA] cursor-pointer"
                  }`}
                >
                  Boost Now
                </button>
              </div>
            );
          })}
        </div>

        {/* Custom Boosting Section */}
        <div className="border-t border-slate-100 pt-6">
          {/* Header Row with Toggle Switch */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900">
                Custom Boosting
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Custom boosting Overview features
              </p>
            </div>

            {/* Switch Button */}
            <button
              type="button"
              role="switch"
              aria-checked={isCustom}
              onClick={() => setIsCustom((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isCustom ? "bg-[#009688]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isCustom ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Collapsible Custom Slider & Payment (Visible ONLY when Switch is ON) */}
          {isCustom && (
            <div className="mt-6 space-y-4 pt-2 animate-in fade-in-50 duration-200">
              {/* Duration and Estimated Impressions Label */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs md:text-sm text-slate-700 font-medium">
                  Custom boosting duration slider:{" "}
                  <span className="font-bold text-[#009688]">
                    {customDays} days
                  </span>
                </div>
                <div className="border border-[#2DD4BF] text-[#0D9488] bg-[#F0FDFA] px-3 py-1 rounded-md text-xs font-bold w-fit">
                  Est. {minImpressionsK}k - {maxImpressionsK}k Impression
                </div>
              </div>

              {/* Slider with Ticks */}
              <div className="relative py-3">
                <input
                  type="range"
                  min={minDays}
                  max={maxDays}
                  value={customDays}
                  onChange={(e) => setCustomDays(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#009688]"
                />
                <div className="flex justify-between items-center text-xs text-slate-400 mt-2 font-medium">
                  <span>Min {minDays} Days</span>
                  <span>Max {maxDays} Days</span>
                </div>
              </div>

              {/* Price Calculation Text */}
              <div className="text-center text-sm font-semibold text-[#009688] pt-1">
                ${dailyRate.toFixed(2)} x {customDays} Days = ${totalCustomPrice}{" "}
                Total
              </div>

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePayCustom}
                className="w-full py-3 rounded-xl bg-[#009688] hover:bg-[#008375] text-white font-bold text-sm transition shadow-sm cursor-pointer"
              >
                Pay USD ${totalCustomPrice}
              </button>
            </div>
          )}
        </div>
      </div>
    </RootDialog>
  );
}