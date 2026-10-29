"use client";

import {
  useGetSecurityOverviewQuery,
  useResendRecoveryEmailOtpMutation,
} from "@/feature/slice/admin/securitySettings";
import { BiQr } from "react-icons/bi";
import { Copy, Monitor, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import RegenerateCode from "./2FactorAuthentication/RegenerateCode";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import RecoveryEmail from "./recoverymailSetup/RecoveryEmail";
import VerifyOtp from "./recoverymailSetup/VerifyOtp";
import Success from "./recoverymailSetup/Success";
import RegenerateBackupCode from "./2FactorAuthentication/Enable2FactorModal/RegenerateBackupCode";
import { divIcon } from "leaflet";
import { MdOutlineMailLock } from "react-icons/md";
import { BsKey } from "react-icons/bs";
import toast from "react-hot-toast";

interface AuthenticationMethodsProps {
  onEnableTwoFactor: () => void;
}

export default function AuthenticationMethods({
  onEnableTwoFactor,
}: AuthenticationMethodsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recoveryCodesModalOpen, setRecoveryCodesModalOpen] = useState(false);
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);
  const [recoveryDetailsModalOpen, setRecoveryDetailsModalOpen] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [enableTwoFactorAfterEmailVerification, setEnableTwoFactorAfterEmailVerification] = useState(false);

  const { data, isLoading } = useGetSecurityOverviewQuery({});
  const [resendRecoveryOtp, { isLoading: isResendingRecoveryOtp }] =
    useResendRecoveryEmailOtpMutation();
  const securityData = data?.data || [];
  const recoveryEmail = securityData?.recovery_email?.trim();
  const hasRecoveryEmail = Boolean(recoveryEmail && recoveryEmail !== "N/A");

  const handleRecoveryEmailClick = () => {
    if (hasRecoveryEmail) {
      setRecoveryDetailsModalOpen(true);
      return;
    }

    setStep(1);
    setRecoveryModalOpen(true);
  };

  const handleBackupCodesClick = () => {
    if (securityData?.two_factor_enabled !== true) {
      setShowVerifyEmailModal(true);
      return;
    }

    if (!hasRecoveryEmail) {
      setShowVerifyEmailModal(true);
      return;
    }

    if (!securityData?.recovery_email_verified) {
      setRecoveryDetailsModalOpen(true);
      return;
    }

    setIsModalOpen(true);
  };

  const handleVerifyRecoveryEmail = async (continueToEnableTwoFactor = false) => {
    setEnableTwoFactorAfterEmailVerification(continueToEnableTwoFactor);
    try {
      await resendRecoveryOtp(undefined).unwrap();
      toast.success("Verification code sent to your recovery email.");
      setRecoveryDetailsModalOpen(false);
      setStep(2);
      setRecoveryModalOpen(true);
    } catch (error: any) {
      setEnableTwoFactorAfterEmailVerification(false);
      toast.error(
        error?.data?.message || "Unable to resend the verification code.",
      );
    }
  };

  const handleGenerateSuccess = (codes: string[]) => {
    // First modal close
    setIsModalOpen(false);

    // Store recovery codes
    setRecoveryCodes(codes);

    // Open recovery codes modal
    setRecoveryCodesModalOpen(true);
  };

  return (
    <div className="">
      <section className="h-full rounded-md border p-4">
        <h2 className="text-headerColor text-[20px] font-semibold leading-[130%] tracking-[0.1px] ">
          Authentication Method
        </h2>

        <div className="mt-5 space-y-5  ">
          {/* Authenticator App */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              <BiQr size={24} className="text-black" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-black text-[16px] font-semibold leading-[150%] tracking-[0.08px]">
                Authenticator App
              </p>

              <p className="mt-1 text-[#7B7B7B] text-[14px] font-normal leading-[140%] tracking-[0.07px]">
                Use an authenticator app to generate codes.
              </p>
            </div>

            {securityData?.two_factor_enabled ? (
              <span className="rounded-full border border-[#287F6E] px-2 py-1 text-center text-[12px] font-semibold leading-[132%] text-[#287F6E]">
                Active
              </span>
            ) : (
              <span></span>
            )}
          </div>

          {/* Backup Codes */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              <BsKey size={24} className="text-black" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-black text-[16px] font-semibold leading-[150%] tracking-[0.08px]">
                Backup Codes
              </p>

              <p className="mt-1 text-[#7B7B7B] text-[14px] font-normal leading-[140%] tracking-[0.07px]">
                {securityData?.backup_codes_count || "N/A"}
              </p>
            </div>

            <button
              type="button"
              className="cursor-pointer"
              onClick={handleBackupCodesClick}
            >
              <MoreHorizontal size={16} className="text-black" />
            </button>
          </div>

          {/* Recovery Email */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              <MdOutlineMailLock size={24} className="text-black" />
            </div>

            <button
              type="button"
              className="min-w-0 flex-1 cursor-pointer text-left"
              onClick={handleRecoveryEmailClick}
            >
              <p className="text-black text-[16px] font-semibold leading-[150%] tracking-[0.08px]">
                Recovery Email
              </p>

              <p className="mt-1 text-[#7B7B7B] text-[14px] font-normal leading-[140%] tracking-[0.07px]">
                {securityData?.recovery_email || "N/A"}
              </p>
            </button>

            {securityData?.recovery_email_verified ? (
              <span className="rounded-full bg-green-100 px-2 py-1 text-[9px] font-semibold text-[#287F6E] border border-[#287F6E]">
                Verified
              </span>
            ) : hasRecoveryEmail ? (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[9px] font-semibold text-amber-700">
                Unverified
              </span>
            ) : (
              <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-[9px] font-medium text-gray-500">
                Not added
              </span>
            )}

            <button
              type="button"
              className="cursor-pointer"
              aria-label={
                hasRecoveryEmail ? "View recovery email" : "Add recovery email"
              }
              onClick={handleRecoveryEmailClick}
            >
              <MoreHorizontal size={16} className="text-black" />
            </button>
          </div>
        </div>
      </section>

      {/* Generate Backup Codes Modal */}

      <CustomModal
        open={isModalOpen}
        onOpenChange={(open) => setIsModalOpen(open)}
        title="Generate Backup Codes"
        size="sm"
      >
        <RegenerateCode onSuccess={handleGenerateSuccess} />
      </CustomModal>

      <CustomModal
        open={showVerifyEmailModal}
        onOpenChange={setShowVerifyEmailModal}
        title={
          securityData?.two_factor_enabled !== true && securityData?.recovery_email_verified
            ? "Enable Two-Factor Authentication"
            : "Recovery Email Required"
        }
        size="sm"
      >
        <div className="px-3">
          <p className="text-[14px] text-[#7B7B7B]">
            {securityData?.two_factor_enabled !== true && securityData?.recovery_email_verified
              ? "Enable 2FA before generating backup codes."
              : hasRecoveryEmail
                ? "Verify your recovery email before enabling 2FA and generating backup codes."
                : "Add and verify a recovery email before enabling 2FA and generating backup codes."}
          </p>
          {securityData?.two_factor_enabled !== true && securityData?.recovery_email_verified ? (
            <button
              type="button"
              className="mt-5 w-full rounded-sm bg-primaryColor px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primaryColor/90"
              onClick={() => {
                setShowVerifyEmailModal(false);
                onEnableTwoFactor();
              }}
            >
              Enable 2FA
            </button>
          ) : !hasRecoveryEmail ? (
            <button
              type="button"
              className="mt-5 w-full rounded-sm bg-primaryColor px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primaryColor/90"
              onClick={() => {
                setShowVerifyEmailModal(false);
                setEnableTwoFactorAfterEmailVerification(
                  securityData?.two_factor_enabled !== true,
                );
                setStep(1);
                setRecoveryModalOpen(true);
              }}
            >
              Add Recovery Email
            </button>
          ) : securityData?.two_factor_enabled !== true ? (
            <button
              type="button"
              className="mt-5 w-full rounded-sm bg-primaryColor px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primaryColor/90"
              onClick={() => {
                setShowVerifyEmailModal(false);
                void handleVerifyRecoveryEmail(true);
              }}
            >
              Verify Recovery Email
            </button>
          ) : null}
        </div>
      </CustomModal>

      {/* Generated Recovery Codes Modal */}
      <CustomModal
        open={recoveryCodesModalOpen}
        onOpenChange={(open) => {
          setRecoveryCodesModalOpen(open);

          if (!open) {
            setRecoveryCodes([]);
          }
        }}
        title="Your Recovery Codes"
        size="sm"
      >
        <RegenerateBackupCode
          recoveryCodes={recoveryCodes}
          onClose={() => setRecoveryCodesModalOpen(false)}
        />
      </CustomModal>
      <CustomModal
        open={recoveryDetailsModalOpen}
        onOpenChange={setRecoveryDetailsModalOpen}
        title="Recovery Email"
        size="sm"
      >
        <div className="px-3 pb-2">
          <p className="text-sm text-[#7B7B7B]">Your current recovery email</p>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-3">
            <span className="min-w-0 break-all text-sm font-medium text-headerColor">
              {recoveryEmail}
            </span>
            {securityData?.recovery_email_verified && (
              <span className="shrink-0 rounded-full border border-[#287F6E] bg-green-100 px-2 py-1 text-[10px] font-semibold text-[#287F6E]">
                Verified
              </span>
            )}
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            {!securityData?.recovery_email_verified && (
              <button
                type="button"
                disabled={isResendingRecoveryOtp}
                className="w-full rounded-sm bg-primaryColor px-4 py-2 text-center text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => void handleVerifyRecoveryEmail()}
              >
                {isResendingRecoveryOtp ? "Sending Code..." : "Verify Email"}
              </button>
            )}
            <button
              type="button"
              className={`w-full rounded-sm px-4 py-2 text-center text-sm font-semibold transition-colors ${
                securityData?.recovery_email_verified
                  ? "bg-primaryColor text-white hover:bg-primaryColor/90"
                  : "border border-borderColor text-headerColor hover:bg-gray-50"
              }`}
              onClick={() => {
                setRecoveryDetailsModalOpen(false);
                setStep(1);
                setRecoveryModalOpen(true);
              }}
            >
              Change Email
            </button>
          </div>
        </div>
      </CustomModal>
      {/* Recovery Email Flow */}
      <CustomModal
        open={recoveryModalOpen}
        onOpenChange={(open) => {
          setRecoveryModalOpen(open);

          if (!open) {
            setStep(1);
            setEnableTwoFactorAfterEmailVerification(false);
          }
        }}
        title={
          step === 1
            ? "Recovery Email"
            : step === 2
              ? "Verify OTP"
              : "Recovery Email"
        }
        size="sm"
      >
        {step === 1 && <RecoveryEmail onSuccess={() => setStep(2)} />}
        {step === 2 && <VerifyOtp onSuccess={() => setStep(3)} />}
        {step === 3 && (
          <Success
            onClose={() => {
              const shouldEnableTwoFactor = enableTwoFactorAfterEmailVerification;
              setRecoveryModalOpen(false);
              setEnableTwoFactorAfterEmailVerification(false);
              if (shouldEnableTwoFactor) onEnableTwoFactor();
            }}
          />
        )}
      </CustomModal>
    </div>
  );
}
