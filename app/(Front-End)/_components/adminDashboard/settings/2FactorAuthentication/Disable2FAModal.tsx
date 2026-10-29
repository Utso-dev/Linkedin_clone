"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import { useState } from "react";
import { useDesablePasswdMutation } from "@/feature/slice/admin/securitySettings";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface Disable2FAModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function Disable2FAModal({
  open,
  onOpenChange,
  onSuccess,
}: Disable2FAModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [DesablePasswd] = useDesablePasswdMutation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      password,
    };
    try {
      const response = await DesablePasswd(payload).unwrap();

      if (response.status) {
        toast.success(response.message || "Password disabled successfully");
        onSuccess();
        onOpenChange(false);
        setPassword("");
      } else {
        setError(response.message || "Failed to disable password");
      }
    } catch (error: any) {
      setError(
        error?.data?.message || error?.message || "Failed to disable password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title="Disable 2FA"
      size="xsm"
    >
      <div className="px-3">
        <p className="text-[#4A4C56] text-[14px] font-normal leading-[140%] tracking-[0.07px] mb-5">
          Enter your password to disable two-factor authentication.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <CustomInput
              label="Password"
              className=""
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              error={error}
            />
            <div className="">
              {showPassword ? (
                <EyeIcon
                  className="absolute right-3 top-11 cursor-pointer text-grayColor1"
                  onClick={() => setShowPassword(false)}
                  size={20}
                />
              ) : (
                <EyeOffIcon
                  className="absolute right-3 top-11 cursor-pointer text-grayColor1"
                  onClick={() => setShowPassword(true)}
                  size={20}
                />
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            {/* <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md border px-4 py-2 text-sm font-medium cursor-pointer"
            >
              Cancel
            </button> */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 h-8 cursor-pointer rounded-md border border-[#F38B94] bg-[#FBD8DB] px-5 text-center text-[14px] font-semibold leading-[140%] tracking-[0.07px] text-redColor disabled:cursor-not-allowed disabled:opacity-60"
            >
              Disable 2FA
            </button>
          </div>
        </form>
      </div>
    </CustomModal>
  );
}
