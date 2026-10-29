"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import toast from "react-hot-toast";
interface StepQRCodeProps {
  secret: string;
  qrCodeUrl: string;
  onContinue: () => void;
  onBack: () => void;
  onClose: () => void;
}

export default function StepQRCode({
  secret,
  qrCodeUrl,
  onContinue,
  onBack,
  onClose,
}: StepQRCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secret);

      setCopied(true);
      toast.success("Security code copied!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Failed to copy security code");
    }
  };
  return (
    <div className="space-y-3 px-3">
      <p className="mt-1 text-sm text-[#777980]">
        Secure your Mind Unite account with two-factor authentication (2FA).
      </p>
      <p className="mt-1 text-sm text-[#777980]">
        1. Install Google Authenticator app or any other authenticator app of
        your choice on your mobile device.
      </p>
      <p className="mt-1 text-sm text-[#777980]">
        2. Add your account to the authenticator app through the add new account
        flow.
      </p>
      <p className="mt-1 text-sm text-[#777980]">3. Scan the QR code.</p>

      <div className="mt-5 flex flex-col items-center gap-4">
        {/* Real QR Code */}
        <div className="flex h-48 w-48 items-center justify-center rounded-md border bg-white p-2">
          <QRCodeSVG value={qrCodeUrl} size={180} />
        </div>

        <div className="w-full">
          <div className="mt-1 flex items-center gap-2 rounded-md border bg-gray-50 px-3 py-2">
            <code className="flex-1 text-sm font-medium break-all">
              {secret}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 cursor-pointer text-xs font-medium text-primaryColor"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#777980]">
        Scan this QR Code or copy the security code
      </p>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="rounded-md bg-primaryColor  cursor-pointer px-4 py-2 text-sm font-medium text-white"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
