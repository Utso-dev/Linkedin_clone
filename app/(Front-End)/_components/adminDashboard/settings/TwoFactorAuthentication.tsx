"use client";

import { useState } from "react";
import AuthenticationMethods from "./AuthenticationMethods";
import { AdLockIcon } from "@/public/svgIcons/AdminIcon";
import Disable2FAModal from "./2FactorAuthentication/Disable2FAModal";
import Enable2FactorModal from "./2FactorAuthentication/Enable2FactorModal/Enable2FactorModal";
import { useGetSecurityOverviewQuery } from "@/feature/slice/admin/securitySettings";
import { useResendRecoveryEmailOtpMutation } from "@/feature/slice/admin/securitySettings";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import RecoveryEmail from "./recoverymailSetup/RecoveryEmail";
import VerifyOtp from "./recoverymailSetup/VerifyOtp";
import Success from "./recoverymailSetup/Success";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function TwoFactorAuthentication() {
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [showRecoveryEmailModal, setShowRecoveryEmailModal] = useState(false);
  const [recoveryEmailStep, setRecoveryEmailStep] = useState(1);
  const { data, isLoading, refetch } = useGetSecurityOverviewQuery({});
  const [resendRecoveryOtp, { isLoading: isResendingRecoveryOtp }] =
    useResendRecoveryEmailOtpMutation();

  const is2FAEnabled = data?.data?.two_factor_enabled ?? false;
  const recoveryEmailVerified = data?.data?.recovery_email_verified ?? false;
  const hasRecoveryEmail = Boolean(data?.data?.recovery_email);

  const handleRecoveryEmailAction = async () => {
    if (hasRecoveryEmail) {
      try {
        await resendRecoveryOtp(undefined).unwrap();
        toast.success("Verification code sent to your recovery email.");
        setRecoveryEmailStep(2);
      } catch (error: any) {
        toast.error(
          error?.data?.message || "Unable to resend the verification code.",
        );
        return;
      }
    } else {
      setRecoveryEmailStep(1);
    }

    setShowVerifyEmailModal(false);
    setShowRecoveryEmailModal(true);
  };

  const handleEnableSuccess = () => {
    setShowEnableModal(false);
    refetch();
  };

  const handleEnableTwoFactorFromBackupCodes = () => {
    setShowEnableModal(true);
  };

  const handleDisableSuccess = () => {
    setShowDisableModal(false);
    refetch();
  };

  if (isLoading) {
    return (
      <section className="rounded-md">
        <div className="h-40 animate-pulse rounded-md bg-gray-100" />
      </section>
    );
  }

  return (
    <section className="rounded-md h-full">
      <h2 className="text-headerColor text-[20px] font-semibold leading-[130%] tracking-[0.1px]">
        Two-Factor Authentication (2FA)
      </h2>

      <p className="mt-1 text-sm font-normal leading-[150%] tracking-[0.08px] text-[#4A4C56]">
        Add an extra layer of security to your account.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4 h-full">
        <div className="mt-6 flex flex-col items-center gap-5 rounded-sm border p-6 min-[1095px]:flex-row">
          <div className="flex h-50 w-50 shrink-0 items-center justify-center rounded-full">
            <AdLockIcon className="text-primaryColor" />
          </div>

          <div>
            <p className="text-headerColor text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
              Two-Factor Authentication is{" "}
              <span className="font-semibold text-primaryColor">
                {is2FAEnabled ? "ON" : "OFF"}
              </span>
            </p>

            <p className="mt-1 text-[#777980] text-[14px] font-normal leading-[140%] tracking-[0.07px]">
              When enabled, you&apos;ll be required to enter a verification code
              in addition to your password when logging in.
            </p>

            {is2FAEnabled ? (
              <button
                type="button"
                onClick={() => setShowDisableModal(true)}
                className="mt-4 h-8 cursor-pointer rounded-md border border-[#F38B94] bg-[#FBD8DB] px-5 text-center text-[14px] font-semibold leading-[140%] tracking-[0.07px] text-redColor"
              >
                Disable 2FA
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!recoveryEmailVerified) {
                    setShowVerifyEmailModal(true);
                    return;
                  }

                  setShowEnableModal(true);
                }}
                className="mt-4 h-8 cursor-pointer rounded-md border border-primaryColor bg-primaryColor px-5 text-[14px] font-semibold text-white"
              >
                Enable 2FA
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 h-full">
          <AuthenticationMethods
            onEnableTwoFactor={handleEnableTwoFactorFromBackupCodes}
          />
        </div>
      </div>

      {/* Enable Modal */}
      <Enable2FactorModal
        open={showEnableModal}
        onOpenChange={setShowEnableModal}
        onSuccess={handleEnableSuccess}
      />

      {/* Disable Modal */}
      <Disable2FAModal
        open={showDisableModal}
        onOpenChange={setShowDisableModal}
        onSuccess={handleDisableSuccess}
      />

      <Dialog
        open={showVerifyEmailModal}
        onOpenChange={setShowVerifyEmailModal}
      >
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>

            <DialogDescription className="pt-2 text-[14px] text-gray-500">
              Please verify your recovery email before enabling 2FA.
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            disabled={isResendingRecoveryOtp}
            onClick={handleRecoveryEmailAction}
            className="mt-4 w-full rounded-md bg-primaryColor px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primaryColor/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResendingRecoveryOtp
              ? "Sending Code..."
              : hasRecoveryEmail
                ? "Verify Recovery Email"
                : "Add Recovery Email"}
          </button>
        </DialogContent>
      </Dialog>

      <CustomModal
        open={showRecoveryEmailModal}
        onOpenChange={(open) => {
          setShowRecoveryEmailModal(open);
          if (!open) setRecoveryEmailStep(1);
        }}
        title={recoveryEmailStep === 2 ? "Verify OTP" : "Recovery Email"}
        size="sm"
      >
        {recoveryEmailStep === 1 && (
          <RecoveryEmail onSuccess={() => setRecoveryEmailStep(2)} />
        )}
        {recoveryEmailStep === 2 && (
          <VerifyOtp onSuccess={() => setRecoveryEmailStep(3)} />
        )}
        {recoveryEmailStep === 3 && (
          <Success
            onClose={() => {
              setShowRecoveryEmailModal(false);
              refetch();
            }}
          />
        )}
      </CustomModal>
    </section>
  );
}
