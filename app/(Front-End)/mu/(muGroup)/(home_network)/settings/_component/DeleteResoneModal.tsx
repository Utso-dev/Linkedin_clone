"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import RootDialog from "@/components/reusable/RootDialog";
import { useDeleteYourAccountMutation } from "@/feature/slice/auth/authSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { clearToken } from "@/lib/token";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const REASONS = [
  "I have a duplicate account",
  "I’m not getting any value from my membership",
  "I’m getting too many emails",
  "I have a privacy concern",
  "I’m receiving unwanted contact",
  "Others",
];

interface DeleteResoneModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function DeleteResoneModal({ open, setOpen }: DeleteResoneModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customDescription, setCustomDescription] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { data: userProfile } = useGetUserProfileQuery("user");
  const [deleteYourAccount, { isLoading }] = useDeleteYourAccountMutation();

  const userName =
    userProfile?.data?.name ||
    userProfile?.name ||
    userProfile?.data?.first_name ||
    userProfile?.first_name ||
    "User";

  useEffect(() => {
    if (!open) {
      setStep(1);
      setSelectedReason("");
      setCustomDescription("");
      setPassword("");
      setError("");
    }
  }, [open]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      setError("Please select a reason for closing your account.");
      return;
    }
    if (selectedReason === "Others" && !customDescription.trim()) {
      setError("Please enter a description.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    const finalReason =
      selectedReason === "Others"
        ? customDescription.trim() || "Others"
        : selectedReason;

    try {
      const response: any = await deleteYourAccount({
        reason: finalReason,
        password,
      }).unwrap();

      toast.success(
        response?.message || "Account scheduled for deletion successfully."
      );
      await clearToken();
      setOpen(false);
      router.push("/login");
    } catch (err: any) {
      console.error("Delete account error:", err);
      const errMsg =
        err?.data?.message ||
        err?.message ||
        "Failed to delete account. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="p-6 sm:p-7 sm:max-w-120 w-full rounded-2xl bg-white shadow-xl"
      ariaLabel="Close and delete account"
    >
      {step === 1 ? (
        <form onSubmit={handleContinue} className="space-y-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-headerColor">
              Close and delete account
            </h3>
            <p className="text-sm text-descriptionColor mt-1">
              {userName}, we're sorry to see you go.
            </p>
          </div>

          <p className="text-sm text-[#4A4C56] font-normal pt-1">
            Tell us the reason for closing your account:
          </p>

          <div className="space-y-3 pt-1">
            {REASONS.map((reason) => {
              const isSelected = selectedReason === reason;
              return (
                <div key={reason} className="space-y-2">
                  <label
                    onClick={() => {
                      setSelectedReason(reason);
                      if (error) setError("");
                    }}
                    className="flex items-center gap-3 cursor-pointer select-none group"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-buttonColor bg-white"
                          : "border-[#8C8E99] group-hover:border-buttonColor"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-buttonColor" />
                      )}
                    </div>
                    <span className="text-sm text-[#4A4C56] leading-tight">
                      {reason}
                    </span>
                  </label>

                  {/* Show Description textarea only when "Others" is selected */}
                  {reason === "Others" && isSelected && (
                    <div className="pt-1 pl-1">
                      <textarea
                        value={customDescription}
                        onChange={(e) => {
                          setCustomDescription(e.target.value);
                          if (error) setError("");
                        }}
                        placeholder="Description"
                        rows={4}
                        className="w-full p-3.5 border border-borderColor rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-buttonColor placeholder:text-[#A0A3BD] resize-none transition-all"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {error && <p className="text-redColor text-xs mt-1">{error}</p>}

          <div className="pt-2">
            <ButtonReuseable
              title="Continue"
              type="submit"
              className="px-6 py-2.5! rounded-lg bg-buttonColor text-white font-medium hover:opacity-95 text-sm"
            />
          </div>
        </form>
      ) : (
        <form onSubmit={handleDeleteSubmit} className="space-y-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-headerColor">
              Close and delete account
            </h3>
            <p className="text-sm text-descriptionColor mt-1">
              Enter your password to close this account
            </p>
          </div>

          <div className="pt-2 space-y-1.5">
            <label
              htmlFor="delete-password"
              className="block text-sm text-[#4A4C56] font-medium"
            >
              Password
            </label>
            <input
              id="delete-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="*********"
              className="w-full h-12 px-3.5 border border-borderColor rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-buttonColor placeholder:text-[#A0A3BD] transition-all"
            />
            {error && <p className="text-redColor text-xs mt-1">{error}</p>}
          </div>

          <p className="text-redColor text-xs sm:text-sm leading-relaxed pt-1">
            Note: After logging out, you have only 30 days to recover your
            account. Otherwise, you may lose access to your account permanently.
          </p>

          <div className="pt-2">
            <ButtonReuseable
              title="Done"
              type="submit"
              loading={isLoading}
              sendingMsg="Deleting..."
              className="px-7 py-2.5! rounded-lg bg-buttonColor text-white font-medium hover:opacity-95 text-sm"
            />
          </div>
        </form>
      )}
    </RootDialog>
  );
}

export default DeleteResoneModal;