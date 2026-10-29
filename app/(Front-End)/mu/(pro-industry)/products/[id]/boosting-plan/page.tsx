"use client";

import { useGetAdvertisemetDetailsQuery } from "@/feature/slice/jobs/advertisementSlice";
import {
  useGetBoostingPlanQuery,
  useGetBoostOrderSummaryQuery,
} from "@/feature/slice/jobs/boostingSlice";
import { OrderSummary, PlanConfig } from "@/types/boosting";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import BoostingPlansStep from "./_components/BoostingPlansStep";
import OtpVerificationStep from "./_components/OtpVerificationStep";
import PaymentCheckoutStep from "./_components/PaymentCheckoutStep";
import PaymentSuccessStep from "./_components/PaymentSuccessStep";

function ProductBoostingPlanContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id as string;

  const urlStepParam = searchParams.get("step");
  const urlPkgId = searchParams.get("boost_package_id");
  const urlCustomDays = searchParams.get("custom_days");
  const urlPmId = searchParams.get("pm_id");
  const urlEmail = searchParams.get("email");

  const initialStep = useMemo(() => {
    if (!urlStepParam) return 1;
    const parsed = Number(urlStepParam);
    return [1, 2, 3, 4].includes(parsed) ? (parsed as 1 | 2 | 3 | 4) : 1;
  }, [urlStepParam]);

  // States synchronized with URL params (no storage or cookies)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialStep);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [planConfig, setPlanConfig] = useState<PlanConfig>({
    pkgId: urlPkgId ? Number(urlPkgId) : null,
    customDays: urlCustomDays ? Number(urlCustomDays) : 20,
    isCustom: Boolean(urlCustomDays),
  });
  const [paymentMethodId, setPaymentMethodId] = useState<string>(
    urlPmId || "",
  );
  const [otpEmail, setOtpEmail] = useState<string>(urlEmail || "");

  // API Config queries
  const { data: configResponse, isLoading: isLoadingConfig } =
    useGetBoostingPlanQuery(undefined);

  const { data: productDetailsResponse } = useGetAdvertisemetDetailsQuery(id, {
    skip: !id,
  });

  const boostData = configResponse?.data;
  const product =
    productDetailsResponse?.data || productDetailsResponse?.product || null;

  // On page reload at Step 2 or 3, fetch order summary if missing in memory
  const orderQueryParams = useMemo(() => {
    if (!id || step <= 1) return null;
    if (urlPkgId) {
      return { productId: id, boost_package_id: Number(urlPkgId) };
    }
    if (urlCustomDays) {
      return { productId: id, custom_days: Number(urlCustomDays) };
    }
    return null;
  }, [id, step, urlPkgId, urlCustomDays]);

  const { data: summaryResponse, isLoading: isLoadingSummary } =
    useGetBoostOrderSummaryQuery(orderQueryParams, {
      skip: !orderQueryParams || Boolean(orderSummary),
    });

  // Populate orderSummary on reload
  useEffect(() => {
    if (summaryResponse?.data?.order_summary && !orderSummary) {
      setOrderSummary(summaryResponse.data.order_summary);
    }
  }, [summaryResponse, orderSummary]);

  // If reload occurs at Step 2 or 3 without package params, fall back to Step 1
  useEffect(() => {
    if (
      step > 1 &&
      !urlPkgId &&
      !urlCustomDays &&
      !orderSummary &&
      !isLoadingSummary
    ) {
      setStep(1);
      router.replace(`/mu/products/${id}/boosting-plan?step=1`, {
        scroll: false,
      });
    }
  }, [
    step,
    urlPkgId,
    urlCustomDays,
    orderSummary,
    isLoadingSummary,
    id,
    router,
  ]);

  const stripePublicKey =
    boostData?.stripe_public_key ||
    process.env.NEXT_PUBLIC_STRIPE_KEY ||
    "pk_test_51UDHbqRBaxaeUOx4iA0SJjMfYNhUCOc6eZXJIvsK0WdWZBfBULPlIwsMdNk8KoaIsd7pIE1uvt8ucm6v4KJ68OSG00UZwpRkGE";

  const stripePromise = useMemo<Promise<Stripe | null> | null>(() => {
    if (!stripePublicKey) return null;
    return loadStripe(stripePublicKey);
  }, [stripePublicKey]);

  // Navigate step and sync URL search params cleanly
  const navigateStep = (
    nextStep: 1 | 2 | 3 | 4,
    updates?: {
      summary?: OrderSummary | null;
      cfg?: PlanConfig;
      pmId?: string;
      email?: string;
    },
  ) => {
    setStep(nextStep);

    if (updates?.summary !== undefined) setOrderSummary(updates.summary);
    if (updates?.cfg !== undefined) setPlanConfig(updates.cfg);
    if (updates?.pmId !== undefined) setPaymentMethodId(updates.pmId);
    if (updates?.email !== undefined) setOtpEmail(updates.email);

    const activeCfg = updates?.cfg || planConfig;
    const activePmId =
      updates?.pmId !== undefined ? updates.pmId : paymentMethodId;
    const activeEmail =
      updates?.email !== undefined ? updates.email : otpEmail;

    const newParams = new URLSearchParams();
    newParams.set("step", String(nextStep));

    if (activeCfg.isCustom && activeCfg.customDays) {
      newParams.set("custom_days", String(activeCfg.customDays));
    } else if (activeCfg.pkgId) {
      newParams.set("boost_package_id", String(activeCfg.pkgId));
    }

    if (activePmId && nextStep >= 3) {
      newParams.set("pm_id", activePmId);
    }
    if (activeEmail && nextStep >= 3) {
      newParams.set("email", activeEmail);
    }

    router.replace(`/mu/products/${id}/boosting-plan?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderColor pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-headerColor flex items-center gap-2">
            <Zap className="w-6 h-6 text-LiteBlueColor fill-LiteBlueColor" />
            <span>Product Boosting Plans</span>
          </h1>
          <p className="text-xs sm:text-sm text-descriptionColor mt-0.5">
            Accelerate clinical reach and generate targeted professional
            impressions
          </p>
        </div>

        <Link
          href="/mu/products"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-semibold text-whiteColor bg-primaryColor transition hover:shadow-xl shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Step Indicators */}
      {step < 4 && (
        <div className="bg-white rounded-xl border border-borderColor p-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-center sm:text-left">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  step >= 1
                    ? "bg-primaryColor text-white"
                    : "bg-bgLightColor text-descriptionColor"
                }`}
              >
                1
              </div>
              <span
                className={`text-xs md:text-sm font-semibold whitespace-nowrap ${
                  step >= 1 ? "text-primaryColor" : "text-grayColor1"
                }`}
              >
                Choose Plan
              </span>
            </div>

            <div className="h-0.5 flex-1 mx-2 sm:mx-3 bg-borderColor self-start mt-3.5 sm:self-center sm:mt-0" />

            {/* Step 2 */}
            <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-center sm:text-left">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  step >= 2
                    ? "bg-primaryColor text-white"
                    : "bg-slate-100 text-grayColor1"
                }`}
              >
                2
              </div>
              <span
                className={`text-xs md:text-sm font-semibold whitespace-nowrap ${
                  step >= 2 ? "text-primaryColor" : "text-grayColor1"
                }`}
              >
                Payment
              </span>
            </div>

            <div className="h-0.5 flex-1 mx-2 sm:mx-3 bg-borderColor self-start mt-3.5 sm:self-center sm:mt-0" />

            {/* Step 3 */}
            <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-center sm:text-left">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  step >= 3
                    ? "bg-primaryColor text-white"
                    : "bg-slate-100 text-grayColor1"
                }`}
              >
                3
              </div>
              <span
                className={`text-xs md:text-sm font-semibold whitespace-nowrap ${
                  step >= 3 ? "text-primaryColor" : "text-grayColor1"
                }`}
              >
                Verify OTP
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Steps Content with Stripe Elements Provider */}
      {isLoadingConfig || (step > 1 && !orderSummary && isLoadingSummary) ? (
        <div className="py-20 text-center text-sm text-descriptionColor flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primaryColor" />
          <span>Loading boosting configuration...</span>
        </div>
      ) : stripePromise ? (
        <Elements stripe={stripePromise}>
          <div className="space-y-8 pb-14">
            {/* Step 1: Choose Plan */}
            {step === 1 && (
              <BoostingPlansStep
                productId={id}
                presetPackages={boostData?.preset_packages || []}
                customSlider={boostData?.custom_slider}
                product={product}
                initialPlanConfig={planConfig}
                onNext={(summary, cfg) => {
                  navigateStep(2, {
                    summary,
                    cfg,
                  });
                }}
              />
            )}

            {/* Step 2: Payment Checkout */}
            {step === 2 && orderSummary && (
              <PaymentCheckoutStep
                productId={id}
                orderSummary={orderSummary}
                planConfig={planConfig}
                onBack={() => navigateStep(1)}
                onNext={(pmId, email) => {
                  navigateStep(3, {
                    pmId,
                    email,
                  });
                }}
              />
            )}

            {/* Step 3: OTP Verification */}
            {step === 3 && orderSummary && (
              <OtpVerificationStep
                productId={id}
                orderSummary={orderSummary}
                planConfig={planConfig}
                paymentMethodId={paymentMethodId}
                otpEmail={otpEmail}
                onBack={() => navigateStep(2)}
                onSuccess={() => navigateStep(4)}
              />
            )}

            {/* Step 4: Success Screen */}
            {step === 4 && (
              <PaymentSuccessStep
                productId={id}
                orderSummary={orderSummary}
                onDone={() => {
                  router.push("/mu/products");
                }}
              />
            )}
          </div>
        </Elements>
      ) : (
        <div className="py-20 text-center text-sm text-red-500 font-medium">
          Stripe Public Key is missing! Check your configuration.
        </div>
      )}
    </div>
  );
}

export default function ProductBoostingPlanPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-descriptionColor flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primaryColor" />
          <span>Loading boosting configuration...</span>
        </div>
      }
    >
      <ProductBoostingPlanContent />
    </Suspense>
  );
}
