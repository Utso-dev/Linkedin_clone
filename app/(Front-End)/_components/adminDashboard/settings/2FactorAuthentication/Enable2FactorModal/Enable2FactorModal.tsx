"use client";

import { useState } from "react";
import StepPassword from "./StepPassword";
import StepQRCode from "./StepQRCode";
import StepEmailCode from "./StepEmailCode";
import StepBackupCodes from "./StepBackupCodes";
import CustomModal from "@/components/reusable/dashboard/CustomModal";

interface Enable2FactorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function Enable2FactorModal({
  open,
  onOpenChange,
  onSuccess,
}: Enable2FactorModalProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const [qrData, setQrData] = useState<{
    secret: string;
    qr_code_url: string;
  } | null>(null);

  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const goToNextStep = () => setCurrentStep((prev) => prev + 1);
  const goToPrevStep = () => setCurrentStep((prev) => prev - 1);

  

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setCurrentStep(1);
      setQrData(null);
      setBackupCodes([]);
    }, 300);
  };

  const handleSuccess = () => {
    onSuccess();
    handleClose();
  };

  const handlePasswordSuccess = (data: {
    secret: string;
    qr_code_url: string;
  }) => {
    setQrData(data);
    goToNextStep();
  };

  const handleEmailSuccess = (codes: string[]) => {
    setBackupCodes(codes);
    goToNextStep();
  };

  const getTitle = () => {
    switch (currentStep) {
      case 1:
        return "Enter Password";
      case 2:
        return "Set up an authenticator app";
      case 3:
        return "Two-Factor Authentication";
      case 4:
        return "";
      default:
        return "Enable 2FA";
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="xsm"
      showCloseButton={true}
    >
      {currentStep === 1 && (
        <StepPassword
          onSuccess={handlePasswordSuccess}
          onClose={handleClose}
        />
      )}

      {currentStep === 2 && qrData && (
        <StepQRCode
          secret={qrData.secret}
          qrCodeUrl={qrData.qr_code_url}
          onContinue={goToNextStep}
          onBack={goToPrevStep}
          onClose={handleClose}
        />
      )}

      {currentStep === 3 && (
        <StepEmailCode
          onSuccess={handleEmailSuccess}
          onBack={goToPrevStep}
          onClose={handleClose}
        />
      )}

      {currentStep === 4 && (
        <StepBackupCodes
          codes={backupCodes}
          onDone={handleSuccess}
          onClose={handleClose}
        />
      )}
    </CustomModal>
  );
}