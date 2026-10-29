"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import Loading from "@/components/reusable/Loader";
import { useEnablePasswordMutation } from "@/feature/slice/admin/securitySettings";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface StepPasswordProps {
  onSuccess: (data: { secret: string; qr_code_url: string }) => void;
  onClose: () => void;
}
export default function StepPassword({
  onSuccess,
  onClose,
}: StepPasswordProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [enablePassword, { isLoading }] = useEnablePasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await enablePassword({ password }).unwrap();
      console.log("Full Response:", res);

      const secret = res?.secret || res?.data?.secret;
      const qr_code_url = res?.qr_code_url || res?.data?.qr_code_url;

      if (secret && qr_code_url) {
        onSuccess({
          secret,
          qr_code_url,
        });
      } else {
        setError("QR data not found. Please try again.");
      }
    } catch (err: any) {
      const message =
        err?.data?.message || "Something went wrong. Please try again.";
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-3">
      <p className="text-sm text-[#777980]">
        Please enter your password to continue enabling 2FA.
      </p>

      <div className="mt-3 relative">
        <CustomInput
          label="Password"
          type={showPassword ? "text" : "password"}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          error={error}
        />
        {showPassword ? (
          <Eye
            className="absolute right-3 top-[41%] -translate-y-1/2 cursor-pointer text-grayColor1"
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <EyeOff
            className="absolute right-3 top-[41%] -translate-y-1/2 cursor-pointer text-grayColor1"
            onClick={() => setShowPassword(true)}
          />
        )}

        <div className="w-full pt-6">
          {isLoading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md w-full cursor-pointer bg-primaryColor px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
