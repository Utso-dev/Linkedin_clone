"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import {
  useGetSecurityOverviewQuery,
  usePostChangePasswordMutation,
} from "@/feature/slice/admin/securitySettings";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <CustomInput
        label={label}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="pr-10"
      />

      {!disabled && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[45px] cursor-pointer text-[#8C8C8C] transition-colors hover:text-[#4A4C56]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      )}
    </div>
  );
}
export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { data, isLoading: overViewLoading } = useGetSecurityOverviewQuery({});
  const OverviewData = data?.data;
  console.log(OverviewData, "fingd");

  const [postChangePassword, { isLoading }] = usePostChangePasswordMutation();

  const updatePassword = async () => {
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    if (OverviewData?.has_password !== false && !currentPassword.trim()) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: "Current password is required.",
      }));
      return;
    }

    if (!newPassword.trim()) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "New password is required.",
      }));
      return;
    }

    if (!confirmPassword.trim()) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Confirm new password is required.",
      }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      return;
    }

    try {
      await postChangePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      }).unwrap();

      setMessage("Password updated successfully.");
      setMessageType("success");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully.");
    } catch (error: any) {
      const newPasswordError = error?.data?.errors?.new_password?.[0];

      if (newPasswordError) {
        setErrors((prev) => ({
          ...prev,
          newPassword: newPasswordError,
        }));
        return;
      }

      setMessage(error?.data?.message || "Failed to update password.");
      setMessageType("error");
    }
  };

  // const updatePassword = async () => {
  //   setMessage("");
  //   setMessageType("error");

  //   if (OverviewData?.has_password !== false && !currentPassword.trim()) {
  //     setMessage("Current password is required.");
  //     return;
  //   }

  //   if (!newPassword.trim()) {
  //     setMessage("New password is required.");
  //     return;
  //   }

  //   if (!confirmPassword.trim()) {
  //     setMessage("Confirm new password is required.");
  //     return;
  //   }

  //   if (newPassword !== confirmPassword) {
  //     setMessage("New password and confirm password do not match.");
  //     return;
  //   }

  //   try {
  //     await postChangePassword({
  //       current_password: currentPassword,
  //       new_password: newPassword,
  //       new_password_confirmation: confirmPassword,
  //     }).unwrap();

  //     setMessage("Password updated successfully.");
  //     setMessageType("success");

  //     setCurrentPassword("");
  //     setNewPassword("");
  //     setConfirmPassword("");
  //   } catch (error: any) {
  //     const errorMessage =
  //       error?.data?.errors?.new_password?.[0] ||
  //       error?.data?.message ||
  //       "Failed to update password.";

  //     setMessage(errorMessage);
  //     setMessageType("error");
  //   }
  // };
  return (
    <section className="rounded-md border border-[#E8E8E8] p-4">
      <h2 className="text-headerColor  text-[20px] font-semibold leading-[130%] tracking-[0.1px]">
        Change Password
      </h2>

      <p className=" mt-2  text-sm font-normal leading-[150%] tracking-[0.08px] text-[#4A4C56]">
        Update your password regularly to keep your account secure.
      </p>

      <div className="mt-4.5 space-y-3">
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆"
          disabled={OverviewData?.has_password === false}
        />

        {errors.currentPassword && (
          <p className="text-[11px] text-red-500">{errors.currentPassword}</p>
        )}

        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆"
        />

        {errors.newPassword && (
          <p className="text-[11px] text-red-500">{errors.newPassword}</p>
        )}

        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆"
        />

        {/* <div className="flex items-center gap-1">
          <span className="h-1 flex-1 rounded bg-[#04A1B7]" />
          <span className="h-1 flex-1 rounded bg-[#04A1B7]" />
          <span className="h-1 flex-1 rounded bg-[#04A1B7]" />
          <span className="h-1 flex-1 rounded bg-[#04A1B7]" />

          <span className="ml-2 text-[9px] text-[#04A1B7]">
            Strong
          </span>
        </div> */}

        {errors.confirmPassword && (
          <p className="text-[11px] text-red-500">{errors.confirmPassword}</p>
        )}

        <button
          type="button"
          onClick={updatePassword}
          disabled={isLoading}
          className="py-2 w-full rounded-md border border-buttonColor bg-[#D3F4EF] text-center  text-[14px] font-semibold leading-[140%] tracking-[0.07px]  text-primaryColor transition cursor-pointer mt-4"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </section>
  );
}
