"use client";

import { useGetSecurityOverviewQuery } from "@/feature/slice/admin/securitySettings";
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

export default function AuthenticationMethods() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recoveryCodesModalOpen, setRecoveryCodesModalOpen] = useState(false);
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const { data, isLoading } = useGetSecurityOverviewQuery({});
  const securityData = data?.data || [];

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
              onClick={() => {
                if (securityData?.two_factor_enabled === true) {
                  setIsModalOpen(true);
                } else {
                  setShowVerifyEmailModal(true);
                }
              }}
            >
              <MoreHorizontal size={16} className="text-black" />
            </button>
          </div>

          {/* Recovery Email */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              <MdOutlineMailLock size={24} className="text-black" />
            </div>

            <div className="min-w-0 flex-1 cursor-pointer">
              <p className="text-black text-[16px] font-semibold leading-[150%] tracking-[0.08px]">
                Recovery Email
              </p>

              <p className="mt-1 text-[#7B7B7B] text-[14px] font-normal leading-[140%] tracking-[0.07px]">
                {securityData?.recovery_email || "N/A"}
              </p>
            </div>

            {securityData?.recovery_email_verified ? (
              <span className="rounded-full bg-green-100 px-2 py-1 text-[9px] font-semibold text-[#287F6E] border border-[#287F6E]">
                Verified
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-semibold text-gray-500 border border-gray-500">
                Unverified
              </span>
            )}

            <button
              type="button"
              className="cursor-pointer"
              onClick={() => {
                setStep(1);
                setRecoveryModalOpen(true);
              }}
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
        title="Verify Recovery Email"
        size="sm"
      >
        <div className="px-3">
          <p className="text-[14px] text-[#7B7B7B]">
            Please enable 2FA before generating a backup code.
          </p>
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
      {/* Recovery Email Flow */}
      <CustomModal
        open={recoveryModalOpen}
        onOpenChange={(open) => {
          setRecoveryModalOpen(open);

          if (!open) {
            setStep(1);
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
        {step === 3 && <Success onClose={() => setRecoveryModalOpen(false)} />}
      </CustomModal>
    </div>
  );
}
