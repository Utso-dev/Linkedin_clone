"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import {
  useConfirmBoostMutation,
  usePurchaseBoostMutation,
  useResendBoostOtpMutation,
} from "@/feature/slice/jobs/boostingSlice";
import { OrderSummary } from "@/types/boosting";
import { useStripe } from "@stripe/react-stripe-js";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import OrderSummaryCard from "./OrderSummaryCard";

interface PlanConfig {
  pkgId: number | null;
  customDays: number;
  isCustom: boolean;
}

interface OtpVerificationStepProps {
  productId: string | number;
  orderSummary: OrderSummary;
  planConfig: PlanConfig;
  paymentMethodId: string;
  otpEmail: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function OtpVerificationStep({
  productId,
  orderSummary,
  planConfig,
  paymentMethodId,
  otpEmail,
  onBack,
  onSuccess,
}: OtpVerificationStepProps) {
  const stripe = useStripe();

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [resendBoostOtp, { isLoading: isResending }] =
    useResendBoostOtpMutation();
  const [purchaseBoost, { isLoading: isPurchasing }] =
    usePurchaseBoostMutation();
  const [confirmBoost, { isLoading: isConfirming }] =
    useConfirmBoostMutation();

  const isProcessing = isPurchasing || isConfirming;

  // 60-second cooldown timer
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) {
      const next = [...otpDigits];
      next[index] = "";
      setOtpDigits(next);
      return;
    }

    const char = cleanVal.slice(-1);
    const next = [...otpDigits];
    next[index] = char;
    setOtpDigits(next);

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

  const handleResendOtp = async () => {
    if (!canResend || !productId) return;
    setErrorMessage("");

    try {
      const payload = planConfig.isCustom
        ? { custom_days: planConfig.customDays }
        : { boost_package_id: planConfig.pkgId };

      const res = await resendBoostOtp({
        productId,
        ...payload,
      }).unwrap();

      toast.success(res?.message || "OTP resent to your registered email.");
      setTimer(res?.data?.cooldown_seconds || 60);
      setCanResend(false);
    } catch (err: any) {
      setErrorMessage(
        err?.data?.message ||
          err?.message ||
          "Please wait before requesting a new OTP."
      );
    }
  };

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otpDigits.join("");

    if (!stripe || otpCode.length !== 4 || !productId) return;
    setErrorMessage("");

    try {
      if (!paymentMethodId) {
        setErrorMessage(
          "Payment method is missing. Please go back and enter card details."
        );
        return;
      }

      const payload = planConfig.isCustom
        ? {
            custom_days: planConfig.customDays,
            otp: otpCode,
            payment_method: paymentMethodId,
          }
        : {
            boost_package_id: planConfig.pkgId,
            otp: otpCode,
            payment_method: paymentMethodId,
          };

      const res = await purchaseBoost({
        productId,
        ...payload,
      }).unwrap();

      // Handle 3D Secure SCA challenge if required by card issuer bank
      if (res?.data?.requires_action) {
        const { paymentIntent, error: actionErr } =
          await stripe.handleCardAction(
            res.data.payment_intent_client_secret
          );

        if (actionErr) {
          setErrorMessage(actionErr.message || "3D Secure authentication failed.");
          return;
        }

        await confirmBoost({
          productId,
          payment_intent_id: paymentIntent.id,
        }).unwrap();
      }

      toast.success(
        res?.message ||
          "Product boosted successfully! Your campaign is now active."
      );
      onSuccess();
    } catch (err: any) {
      setErrorMessage(
        err?.data?.message ||
          err?.message ||
          "Payment authorization failed. Please check your OTP and try again."
      );
    }
  };

  const otpCode = otpDigits.join("");

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-descriptionColor hover:text-headerColor transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Change payment method</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Side: OTP Verification Form */}
        <div className="md:col-span-7 bg-white p-4 md:p-6 rounded-xl border border-borderColor shadow-xs space-y-6">
          <div className="border-b border-borderColor pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primaryColor" />
              <h2 className="text-xl md:text-2xl font-semibold text-headerColor">
                Payment Verification
              </h2>
            </div>
            <p className="text-xs md:text-sm text-descriptionColor mt-1">
              Enter your 4-digit OTP code to confirm and activate this boost{" "}
              {otpEmail && (
                <span className="font-semibold text-headerColor">
                  (sent to {otpEmail})
                </span>
              )}
            </p>
          </div>

          <form onSubmit={handleConfirmPurchase} className="space-y-6">
            {/* 4 Digit Boxes */}
            <div className="py-2">
              <label className="block text-xs font-semibold text-headerColor mb-3 text-center">
                4-Digit PIN Code
              </label>
              <div className="flex justify-center items-center gap-3.5">
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
                    className="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-borderColor focus:border-primaryColor focus:ring-1 focus:ring-primaryColor outline-none transition bg-white shadow-xs"
                  />
                ))}
              </div>
            </div>

            {/* Resend OTP */}
            <div className="flex items-center justify-between text-xs md:text-sm px-2 pt-1 border-t border-borderColor">
              <span className="text-descriptionColor">Didn&apos;t receive code?</span>
              {canResend ? (
                <button
                  type="button"
                  disabled={isResending}
                  onClick={handleResendOtp}
                  className="text-primaryColor font-bold hover:underline cursor-pointer transition"
                >
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
              ) : (
                <span className="text-gray-400 font-medium">
                  Resend in 00:{timer < 10 ? `0${timer}` : timer}
                </span>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-sm text-red-500 font-medium animate-in fade-in-50">
                {errorMessage}
              </p>
            )}

            {/* Confirm Button */}
            <ButtonReuseable
              type="submit"
              disabled={isProcessing || otpCode.length !== 4}
              loading={isProcessing}
              sendingMsg="Confirming & Activating Boost..."
              title={`Confirm & Pay ${orderSummary.total_formatted}`}
              className="w-full cursor-pointer py-3"
            />
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
