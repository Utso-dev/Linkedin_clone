"use client";

import { useRecoveryEmailOtpVerifyMutation } from "@/feature/slice/admin/securitySettings";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormData {
  otp: string;
}

interface Props {
  onSuccess: () => void;
}

export default function VerifyOtp({ onSuccess }: Props) {
  const {
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [verifyOtp, { isLoading }] = useRecoveryEmailOtpVerifyMutation();

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    clearErrors("otp");

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    setValue("otp", updated.join(""));

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (!pastedData) return;

    clearErrors("otp");

    const updated = ["", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      updated[index] = digit;
    });

    setOtp(updated);
    setValue("otp", pastedData);

    const nextIndex = Math.min(pastedData.length, 4) - 1;

    if (nextIndex >= 0) {
      document.getElementById(`otp-${nextIndex}`)?.focus();
    }
  };

  const handleSubmitOtp = async (data: FormData) => {
    if (data.otp.length !== 4) {
      setError("otp", {
        type: "manual",
        message: "Please enter a 4-digit OTP.",
      });
      return;
    }

    try {
      await verifyOtp(data).unwrap();
      toast.success("OTP verified successfully");
      onSuccess();
    } catch (err: any) {
      const message = err?.data?.message || "Invalid or expired OTP.";
      setError("otp", { type: "manual", message });
      toast.error(message);
    }
  };

  return (
    <div className="px-3">
      <p className="mb-5 text-sm text-[#4A4C56]">
        Enter the OTP sent to your recovery email.
      </p>

      <div>
        <div className="flex justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              value={digit}
              maxLength={1}
              inputMode="numeric"
              onChange={(e) => handleChange(e.target.value, index)}
              onPaste={handlePaste}
              className={`h-12 w-12 border bg-white text-center text-lg outline-none ${
                errors.otp
                  ? "border-red-500 text-red-500"
                  : "border-[#8B8D94] text-[#1D1F2C]"
              } ${index === 0 ? "rounded-l-lg" : "border-l-0"} ${
                index === 3 ? "rounded-r-lg" : ""
              }`}
            />
          ))}
        </div>

        {errors.otp && (
          <p className="mt-2 text-center text-sm text-red-500">
            {errors.otp.message}
          </p>
        )}
      </div>

      <button
        type="button"
        disabled={isLoading}
        onClick={handleSubmit(handleSubmitOtp)}
        className="mt-5 w-full cursor-pointer rounded-lg bg-primaryColor py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}
