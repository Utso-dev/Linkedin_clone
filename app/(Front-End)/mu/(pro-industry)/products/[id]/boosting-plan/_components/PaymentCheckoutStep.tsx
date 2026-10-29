"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import { useSendBoostOtpMutation } from "@/feature/slice/jobs/boostingSlice";
import { OrderSummary } from "@/types/boosting";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { ArrowLeft, Lock } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import OrderSummaryCard from "./OrderSummaryCard";

// Common element options matching SubscriptionPayment.tsx
const elementOptions = {
  style: {
    base: {
      fontSize: "14px",
      color: "#111827",
      fontFamily: "inherit",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#ef4444",
    },
  },
};

interface PlanConfig {
  pkgId: number | null;
  customDays: number;
  isCustom: boolean;
}

interface PaymentCheckoutStepProps {
  productId: string | number;
  orderSummary: OrderSummary;
  planConfig: PlanConfig;
  onBack: () => void;
  onNext: (paymentMethodId: string, email: string) => void;
}

export default function PaymentCheckoutStep({
  productId,
  orderSummary,
  planConfig,
  onBack,
  onNext,
}: PaymentCheckoutStepProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [sendBoostOtp, { isLoading: isOtpSending }] = useSendBoostOtpMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Payment gateway is initializing. Please wait.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setErrorMessage("Card element not found. Please re-enter your card.");
      return;
    }

    try {
      setErrorMessage("");

      // 1. Create Stripe Token / PaymentMethod
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
      });

      if (error) {
        setErrorMessage(error.message || "Invalid card details. Please check.");
        return;
      }

      // 2. Dispatch OTP to user's email
      const payload = planConfig.isCustom
        ? { custom_days: planConfig.customDays }
        : { boost_package_id: planConfig.pkgId };

      const response = await sendBoostOtp({
        productId,
        ...payload,
      }).unwrap();

      toast.success(response?.message || "OTP sent to your registered email.");
      const email = response?.data?.email || "";

      // Move to Step 3 with generated paymentMethodId and email
      onNext(paymentMethod.id, email);
    } catch (err: any) {
      setErrorMessage(
        err?.data?.message ||
          err?.message ||
          "Failed to process card details. Please try again.",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-descriptionColor hover:text-headerColor transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to boosting plans</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Side: Payment Form (matching SubscriptionPayment pattern) */}
        <div className="md:col-span-7 bg-white p-4 md:p-6  rounded-xl border border-borderColor shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl md:text-2xl font-semibold text-headerColor">
              Payment
            </h2>
            <span className="text-xs text-descriptionColor flex items-center gap-1 font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              256-bit encrypted
            </span>
          </div>

          <div className="w-full h-px bg-borderColor mb-6" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-headerColor mb-2">
                Card Number
              </label>
              <div className="w-full px-3.5 py-3 border border-borderColor rounded-lg bg-white focus-within:ring-1 focus-within:ring-primaryColor focus-within:border-primaryColor transition">
                <CardNumberElement
                  options={{
                    ...elementOptions,
                    showIcon: true,
                  }}
                />
              </div>
            </div>

            {/* Expiration Date & CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-headerColor mb-2">
                  Expiration Date
                </label>
                <div className="w-full px-3.5 py-3 border border-borderColor rounded-lg bg-white focus-within:ring-1 focus-within:ring-primaryColor focus-within:border-primaryColor transition">
                  <CardExpiryElement options={elementOptions} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-headerColor mb-2">
                  CVC
                </label>
                <div className="w-full px-3.5 py-3 border border-borderColor rounded-lg bg-white focus-within:ring-1 focus-within:ring-primaryColor focus-within:border-primaryColor transition">
                  <CardCvcElement options={elementOptions} />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-sm text-red-500 font-medium animate-in fade-in-50">
                {errorMessage}
              </p>
            )}

            {/* Pay Button */}
            <ButtonReuseable
              type="submit"
              disabled={!stripe || isOtpSending}
              loading={isOtpSending}
              sendingMsg="Validating & Sending OTP..."
              title={`Pay USD ${orderSummary.total_formatted}`}
              className="w-full cursor-pointer py-3"
            />

            {/* Disclaimer */}
            <p className="text-xs text-descriptionColor leading-relaxed">
              Your personal data will be used to process your boost order,
              support your experience throughout this website, and for other
              purposes described in our privacy policy.
            </p>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="md:col-span-5 sticky top-28">
          <OrderSummaryCard orderSummary={orderSummary} />
        </div>
      </div>
    </div>
  );
}
