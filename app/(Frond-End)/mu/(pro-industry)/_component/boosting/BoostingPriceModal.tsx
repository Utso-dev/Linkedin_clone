"use client";

import RootDialog from "@/components/reusable/RootDialog";
import {
  useConfirmBoostMutation,
  useGetBoostingPlanQuery,
  useLazyGetBoostOrderSummaryQuery,
  usePurchaseBoostMutation,
  useResendBoostOtpMutation,
  useSendBoostOtpMutation,
} from "@/feature/slice/jobs/boostingSlice";
import {
  BoostPackage,
  BoostPackagesResponse,
  OrderSummary,
} from "@/types/boosting";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

interface BoostingPriceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  product?: any;
  onSuccess?: () => void;
}

// Inner Modal Form that has access to Stripe Elements hooks
interface ModalContentProps {
  product: any;
  boostData: BoostPackagesResponse["data"] | undefined;
  isLoadingPlans: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function BoostingModalInner({
  product,
  boostData,
  isLoadingPlans,
  onClose,
  onSuccess,
}: ModalContentProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Plans, 2: Checkout, 3: OTP, 4: Success
  const [isCustom, setIsCustom] = useState(false);
  const [customDays, setCustomDays] = useState(20);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(1);
  const [selectedPkg, setSelectedPkg] = useState<BoostPackage | null>(null);

  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const [otpEmail, setOtpEmail] = useState<string>("");
  const [saveCard, setSaveCard] = useState<boolean>(true);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // RTK Query endpoints
  const [fetchOrderSummary] = useLazyGetBoostOrderSummaryQuery();
  const [sendBoostOtp] = useSendBoostOtpMutation();
  const [resendBoostOtp] = useResendBoostOtpMutation();
  const [purchaseBoost] = usePurchaseBoostMutation();
  const [confirmBoost] = useConfirmBoostMutation();

  const presetPackages = boostData?.preset_packages || [];
  const customSlider = boostData?.custom_slider;

  // Fallback defaults matching Image 2 & API documentation
  const fallbackPackages: BoostPackage[] = [
    {
      id: 1,
      name: "Basic Free",
      duration_days: 7,
      price: 19.99,
      daily_price: 2.86,
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
      daily_price: 2.5,
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
      daily_price: 2.33,
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
        (a: any, b: any) => (a.duration_days || 0) - (b.duration_days || 0)
      );
    }
    return fallbackPackages;
  }, [presetPackages]);

  // Set default selected package
  useEffect(() => {
    if (packagesToDisplay.length > 0 && !selectedPkg) {
      setSelectedPkg(packagesToDisplay[0]);
      setSelectedPackageId(packagesToDisplay[0].id);
    }
  }, [packagesToDisplay, selectedPkg]);

  const minDays = customSlider?.min_days ?? 3;
  const maxDays = customSlider?.max_days ?? 60;
  const dailyRate = customSlider?.daily_rate ?? 3.0;
  const totalCustomPrice = (dailyRate * customDays).toFixed(2);

  const minImpressionsK = Math.round(
    ((customSlider?.daily_estimated_impressions_min || 4000) * customDays) /
      1000
  );
  const maxImpressionsK = Math.round(
    ((customSlider?.daily_estimated_impressions_max || 7000) * customDays) /
      1000
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

  // Cooldown countdown for Step 3 (OTP)
  useEffect(() => {
    let interval: any;
    if (step === 3 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const productId = product?.id ?? product?.product_id;

  // 1. Move to Step 2: Fetch Order Summary
  const handleSelectPlan = async (
    pkgId: number | null,
    days: number | null
  ) => {
    if (!productId) {
      toast.error("Product information not found.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    try {
      const params = pkgId
        ? { boost_package_id: pkgId }
        : { custom_days: days };

      const res = await fetchOrderSummary({
        productId,
        ...params,
      }).unwrap();

      if (res?.data?.order_summary) {
        setOrderSummary(res.data.order_summary);
      } else {
        // Fallback construct if backend returns custom structure
        const chosenPkg = packagesToDisplay.find((p) => p.id === pkgId);
        setOrderSummary({
          product_id: String(product?.product_id || product?.id || ""),
          product_name: product?.product_name || "BioPac MP160",
          product_image: product?.image_url || product?.image || null,
          plan_title: chosenPkg
            ? `${chosenPkg.name} Boosting`
            : `Custom Boosting (${days} Days)`,
          duration_days: chosenPkg ? chosenPkg.duration_days : days || 20,
          duration_text: chosenPkg
            ? `${chosenPkg.duration_days} Days`
            : `${days} Days`,
          estimated_impressions: chosenPkg
            ? chosenPkg.estimated_impressions
            : `Est. ${minImpressionsK}k – ${maxImpressionsK}k Impression`,
          subtotal: chosenPkg ? chosenPkg.price : Number(totalCustomPrice),
          subtotal_formatted: chosenPkg
            ? `$${chosenPkg.price.toFixed(2)}`
            : `$${totalCustomPrice}`,
          vat: 0.0,
          vat_formatted: "$0.00",
          total: chosenPkg ? chosenPkg.price : Number(totalCustomPrice),
          total_formatted: chosenPkg
            ? `$${chosenPkg.price.toFixed(2)}`
            : `$${totalCustomPrice}`,
          currency: "USD",
        });
      }
      setStep(2); // Screen 3: Payment Checkout
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Failed to load order summary. Please try again.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. User Clicks [ Pay USD $... ] in Step 2 -> Validate Card & Send OTP
  const handleSendOtp = async () => {
    if (!stripe || !elements) {
      setErrorMsg("Stripe has not initialized yet. Please wait a moment.");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const cardEl = elements.getElement(CardElement);
      if (!cardEl) {
        setErrorMsg("Card element is not ready. Please re-enter card details.");
        return;
      }

      // Tokenize card directly in Step 2 so card validation errors are caught before sending OTP
      const { paymentMethod, error: stripeErr } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardEl,
        });

      if (stripeErr) {
        setErrorMsg(stripeErr.message || "Invalid card details. Please check.");
        return;
      }

      setPaymentMethodId(paymentMethod.id);

      // Send OTP to user's registered email
      const payload = isCustom
        ? { custom_days: customDays }
        : { boost_package_id: selectedPackageId };

      const res = await sendBoostOtp({
        productId,
        ...payload,
      }).unwrap();

      if (res?.data?.email) {
        setOtpEmail(res.data.email);
      }
      toast.success(res?.message || "OTP sent to your registered email.");
      setTimer(60);
      setCanResend(false);
      setOtpDigits(["", "", "", ""]);
      setStep(3); // Screen 4: OTP Pin Input
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Failed to send OTP. Please check your card and try again.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // 3. Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || !productId) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const payload = isCustom
        ? { custom_days: customDays }
        : { boost_package_id: selectedPackageId };

      const res = await resendBoostOtp({
        productId,
        ...payload,
      }).unwrap();

      toast.success(res?.message || "OTP resent to your registered email.");
      setTimer(res?.data?.cooldown_seconds || 60);
      setCanResend(false);
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Please wait before requesting another OTP.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle 4-Digit OTP Inputs
  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) {
      const next = [...otpDigits];
      next[index] = "";
      setOtpDigits(next);
      return;
    }

    // Single digit input
    const char = cleanVal.slice(-1);
    const next = [...otpDigits];
    next[index] = char;
    setOtpDigits(next);

    // Focus next box
    if (index < 3 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (pastedData) {
      const next = ["", "", "", ""];
      for (let i = 0; i < pastedData.length; i++) {
        next[i] = pastedData[i];
      }
      setOtpDigits(next);
      const focusIdx = Math.min(pastedData.length, 3);
      otpInputsRef.current[focusIdx]?.focus();
    }
  };

  const otpCode = otpDigits.join("");

  // 5. Confirm Purchase with OTP and Payment Method
  const handleConfirmPurchase = async () => {
    if (!stripe || otpCode.length !== 4 || !productId) return;
    setLoading(true);
    setErrorMsg("");

    try {
      let activePaymentMethod = paymentMethodId;

      // Fallback: If paymentMethodId isn't set, try creating it from CardElement
      if (!activePaymentMethod && elements) {
        const cardEl = elements.getElement(CardElement);
        if (cardEl) {
          const { paymentMethod, error: stripeErr } =
            await stripe.createPaymentMethod({
              type: "card",
              card: cardEl,
            });
          if (stripeErr) {
            setErrorMsg(stripeErr.message || "Card verification failed.");
            setLoading(false);
            return;
          }
          activePaymentMethod = paymentMethod.id;
          setPaymentMethodId(paymentMethod.id);
        }
      }

      if (!activePaymentMethod) {
        setErrorMsg(
          "Payment method is missing. Please go back and enter card details."
        );
        setLoading(false);
        return;
      }

      const payload = isCustom
        ? {
            custom_days: customDays,
            otp: otpCode,
            payment_method: activePaymentMethod,
          }
        : {
            boost_package_id: selectedPackageId,
            otp: otpCode,
            payment_method: activePaymentMethod,
          };

      const res = await purchaseBoost({
        productId,
        ...payload,
      }).unwrap();

      // Check if 3D Secure (SCA) authentication is required by bank
      if (res?.data?.requires_action) {
        const { paymentIntent, error: actionErr } =
          await stripe.handleCardAction(
            res.data.payment_intent_client_secret
          );

        if (actionErr) {
          setErrorMsg(actionErr.message || "3D Secure verification failed.");
          setLoading(false);
          return;
        }

        // Confirm 3DS payment with backend
        await confirmBoost({
          productId,
          payment_intent_id: paymentIntent.id,
        }).unwrap();
      }

      toast.success(
        res?.message || "Product boosted successfully! Your campaign is live."
      );
      setStep(4); // Payment Successful Screen
      onSuccess?.();
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Payment failed. Please verify your OTP and card details.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-h-[90vh] overflow-y-auto p-6 md:p-8">
      {/* ================= STEP 1: Screen 2 (Boosting Plans Modal) ================= */}
      {step === 1 && (
        <div>
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Boosting Plans
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                manage boosting Overview features
              </p>
            </div>
            {product?.product_name && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 truncate max-w-[200px]">
                {product.product_name}
              </span>
            )}
          </div>

          {/* 3 Preset Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 pt-2">
            {packagesToDisplay.map((item: BoostPackage, index: number) => {
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
                      {item.description || "Get started with more visibility"}
                    </p>

                    {/* Estimated Impressions Box */}
                    <div
                      className={`border rounded-lg py-2.5 px-3 text-center my-4 ${impressionStyle.box}`}
                    >
                      <span
                        className={`text-xs font-semibold ${impressionStyle.text}`}
                      >
                        {item.estimated_impressions ||
                          `Est. ${
                            index === 0
                              ? "5k - 10k"
                              : index === 1
                              ? "15k - 25k"
                              : "100k - 200k"
                          } Impression`}
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
                        )
                      )}
                    </div>
                  </div>

                  {/* Boost Now Button */}
                  <button
                    type="button"
                    disabled={isCustom || loading}
                    onClick={() => {
                      setIsCustom(false);
                      setSelectedPkg(item);
                      setSelectedPackageId(item.id);
                      handleSelectPlan(item.id, null);
                    }}
                    className={`w-full py-2.5 rounded-lg border text-xs font-semibold transition mt-4 ${
                      isCustom
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                        : "bg-white text-slate-600 border-slate-300 hover:border-[#009688] hover:text-[#009688] hover:bg-[#F0FDFA] cursor-pointer"
                    }`}
                  >
                    {loading && selectedPackageId === item.id ? (
                      <span className="inline-flex items-center gap-1.5 justify-center">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      "Boost Now"
                    )}
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
                  ${dailyRate.toFixed(2)} x {customDays} Days = $
                  {totalCustomPrice} Total
                </div>

                {/* Pay Button */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setIsCustom(true);
                    setSelectedPackageId(null);
                    handleSelectPlan(null, customDays);
                  }}
                  className="w-full py-3 rounded-xl bg-[#009688] hover:bg-[#008375] text-white font-bold text-sm transition shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2 justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Preparing checkout...
                    </span>
                  ) : (
                    `Pay USD $${totalCustomPrice}`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= STEP 2: Screen 3 (Payment Checkout & Order Summary) ================= */}
      {step === 2 && orderSummary && (
        <div>
          {/* Back button */}
          <button
            type="button"
            onClick={() => {
              setErrorMsg("");
              setStep(1);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-5 cursor-pointer transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to plans</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Payment */}
            <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#009688]" />
                  <h3 className="text-base md:text-lg font-bold text-slate-900">
                    Payment
                  </h3>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  256-bit encrypted
                </span>
              </div>

              {/* Stripe Card Element */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Card Details (Card number, Expiry, CVV)
                </label>
                <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/50 hover:border-[#009688] focus-within:border-[#009688] focus-within:ring-1 focus-within:ring-[#009688] transition">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "15px",
                          color: "#1e293b",
                          fontFamily: "inherit",
                          "::placeholder": {
                            color: "#94a3b8",
                          },
                        },
                        invalid: {
                          color: "#ef4444",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Save Card Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="rounded border-slate-300 text-[#009688] focus:ring-[#009688] w-4 h-4"
                />
                <span className="text-xs text-slate-600 font-medium">
                  Save card details for future boosts
                </span>
              </label>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium leading-relaxed">
                  {errorMsg}
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                disabled={loading}
                onClick={handleSendOtp}
                className="w-full bg-[#009688] hover:bg-[#008375] text-white py-3.5 rounded-xl font-bold text-sm transition shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying details...</span>
                  </>
                ) : (
                  <span>Pay USD {orderSummary.total_formatted}</span>
                )}
              </button>
            </div>

            {/* Right: Order Summary */}
            <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wide">
                Order Summary
              </h4>

              {/* Product Info */}
              <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                  {orderSummary.product_image ? (
                    <Image
                      src={orderSummary.product_image}
                      alt={orderSummary.product_name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#009688]">
                      {(orderSummary.product_name || "P").charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">
                    {orderSummary.product_name}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Product ID: {orderSummary.product_id}
                  </p>
                </div>
              </div>

              {/* Plan Details */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    {orderSummary.plan_title}
                  </span>
                  <span className="font-bold text-slate-900">
                    {orderSummary.subtotal_formatted}
                  </span>
                </div>
                <p className="text-[11px] text-[#009688] font-semibold">
                  {orderSummary.estimated_impressions}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-2 text-xs text-slate-600 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {orderSummary.subtotal_formatted}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (0%)</span>
                  <span className="font-semibold text-slate-900">
                    {orderSummary.vat_formatted}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-[#009688]">
                    {orderSummary.total_formatted}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 3: Screen 4 (4-Digit OTP Pin Input) ================= */}
      {step === 3 && orderSummary && (
        <div>
          {/* Back button */}
          <button
            type="button"
            onClick={() => {
              setErrorMsg("");
              setStep(2);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-5 cursor-pointer transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change payment details</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: OTP Input */}
            <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-900">
                  Payment Verification
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your 4-digit OTP pin to confirm this payment{" "}
                  {otpEmail && (
                    <span className="font-semibold text-slate-700">
                      (sent to {otpEmail})
                    </span>
                  )}
                </p>
              </div>

              {/* 4 OTP Digit Boxes */}
              <div className="flex justify-center items-center gap-3 py-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputsRef.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    className="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-slate-300 focus:border-[#009688] focus:ring-2 focus:ring-[#009688]/20 outline-none transition bg-white shadow-xs"
                  />
                ))}
              </div>

              {/* Resend OTP with 60s cooldown timer */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">Didn&apos;t receive code?</span>
                {canResend ? (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleResendOtp}
                    className="text-[#009688] font-bold hover:underline cursor-pointer transition"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-slate-400 font-medium">
                    Resend in 00:{timer < 10 ? `0${timer}` : timer}
                  </span>
                )}
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium leading-relaxed">
                  {errorMsg}
                </div>
              )}

              {/* Confirm Purchase Button */}
              <button
                type="button"
                disabled={loading || otpCode.length !== 4}
                onClick={handleConfirmPurchase}
                className="w-full bg-[#009688] hover:bg-[#008375] text-white py-3.5 rounded-xl font-bold text-sm transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing payment...</span>
                  </>
                ) : (
                  <span>Confirm & Pay {orderSummary.total_formatted}</span>
                )}
              </button>
            </div>

            {/* Right: Order Summary Preview */}
            <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wide">
                Order Summary
              </h4>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <p className="font-bold text-sm text-slate-900">
                  {orderSummary.product_name}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {orderSummary.plan_title}
                </p>
                <p className="text-xs text-[#009688] font-semibold mt-0.5">
                  {orderSummary.estimated_impressions}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm">
                <span className="text-slate-800">Total</span>
                <span className="text-[#009688]">
                  {orderSummary.total_formatted}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 4: Screen 4 (Payment Successful Modal) ================= */}
      {step === 4 && (
        <div className="text-center py-8 px-4 max-w-md mx-auto space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-sm">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              Payment Process
            </h3>
            <p className="text-emerald-600 font-bold text-base mt-1">
              Payment Successful
            </p>
          </div>

          <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
            Your product boost campaign is now active and reaching professionals
            across the network!
          </p>

          {orderSummary && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left space-y-1.5 text-slate-600 mt-4">
              <div className="flex justify-between">
                <span>Product:</span>
                <span className="font-bold text-slate-900">
                  {orderSummary.product_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-semibold text-slate-900">
                  {orderSummary.duration_text}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Paid:</span>
                <span className="font-bold text-[#009688]">
                  {orderSummary.total_formatted}
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-6 bg-[#009688] hover:bg-[#008375] text-white py-3 rounded-xl font-bold text-sm transition shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

// Outer wrapper managing Stripe Elements & Dialog
export default function BoostingPriceModal({
  open,
  setOpen,
  product,
  onSuccess,
}: BoostingPriceModalProps) {
  const { data: response, isLoading } = useGetBoostingPlanQuery(undefined, {
    skip: !open,
  });

  const boostData = response?.data;
  const stripePublicKey =
    boostData?.stripe_public_key ||
    "pk_test_51UDHbqRBaxaeUOx4iA0SJjMfYNhUCOc6eZXJIvsK0WdWZBfBULPlIwsMdNk8KoaIsd7pIE1uvt8ucm6v4KJ68OSG00UZwpRkGE";

  const stripePromise = useMemo<Promise<Stripe | null> | null>(() => {
    if (!stripePublicKey) return null;
    return loadStripe(stripePublicKey);
  }, [stripePublicKey]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="!sm:max-w-4xl !md:max-w-4xl !lg:max-w-5xl rounded-2xl overflow-hidden p-0 max-h-[92vh] bg-white border border-slate-200"
      ariaLabel="Boosting Plans"
      ariaDescription="Overview of boosting plans and custom boosting options"
    >
      {stripePromise ? (
        <Elements stripe={stripePromise}>
          <BoostingModalInner
            product={product}
            boostData={boostData}
            isLoadingPlans={isLoading}
            onClose={handleClose}
            onSuccess={onSuccess}
          />
        </Elements>
      ) : (
        <div className="p-12 text-center text-sm text-slate-500">
          Loading payment gateway...
        </div>
      )}
    </RootDialog>
  );
}