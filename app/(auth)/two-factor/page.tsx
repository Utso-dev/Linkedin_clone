"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import {
  useTwoFactorEmailCodeVerifyMutation,
  useTwoFactorRecoveryEmailMutation,
} from "@/feature/slice/admin/securitySettings";
import { setToken } from "@/lib/token";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";


export default function page() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [errorRecovery, setErrorRecovery] = useState("");
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const route = useRouter();
  const [twoFactorEmailCode, { isLoading }] =
    useTwoFactorEmailCodeVerifyMutation();
  const [twoFactorRecoveryEmail, { isLoading: isRecoveryLoading }] =
    useTwoFactorRecoveryEmailMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        email: email,
        code: code,
      };
      const response = await twoFactorEmailCode(payload).unwrap();
      toast.success("2FA verification successful!");
      await setToken(response?.token || response.data.token);
      route.push(`/mu/home`);
    } catch (error) {
      setError(error?.data?.message || "Invalid code. Please try again.");
      setErrorRecovery("");
    }
  };
  const handleEmailRecovery = async () => {
    try {
      const payload = {
        email: email,
      };
      const response = await twoFactorRecoveryEmail(payload).unwrap();
     
      route.push(
        `/recovery-email?email=${email}&recovery=${response?.masked_email}`,
      );
    } catch (error) {
      setErrorRecovery(
        error?.data?.message ||
          "Failed to send recovery email. Please try again.",
      );
      setError("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-3">
      <h4 className="text-xl md:text-2xl font-semibold text-headerColor text-center">
        Enter the code you see on your authentication app
      </h4>

      <CustomInput
        type="text"
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="xxx-xxx"
        maxLength={6}
        error={error}
        className={`text-center tracking-widest text-lg ${error ? "border-red-500" : "border-gray-300"}`}
      />

      {/* <button type="button" className="text-sm font-medium text-primaryColor">
        Resend Code
      </button> */}

      <div className="flex flex-col text-center  gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md w-full flex justify-center bg-primaryColor text-center cursor-pointer px-4 py-3 text-base font-medium text-white disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
        </button>
        <div className="text-center">
          Use{" "}
          <Link
            href={`/backup-codes?email=${email}`}
            className="text-primaryColor"
          >
            Backup codes
          </Link>{" "}
        </div>
        <div className="text-grayColor1">
          Don’t have access device? Send code to{" "}
          <button
            className="text-primaryColor  cursor-pointer "
            onClick={handleEmailRecovery}
            disabled={isRecoveryLoading}
          >
            your recovery email
          </button>{" "}
        </div>
        {errorRecovery && (
          <p className="mt-1.5 text-xs text-red-500">{errorRecovery}</p>
        )}
      </div>
    </form>
  );
}
