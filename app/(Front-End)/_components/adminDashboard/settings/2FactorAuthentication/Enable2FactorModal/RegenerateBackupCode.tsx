"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface RegenerateBackupCodeProps {
  recoveryCodes: string[];
  onClose: () => void;
}

export default function RegenerateBackupCode({
  recoveryCodes,
  onClose,
}: RegenerateBackupCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const codesText = recoveryCodes.join("\n");

      console.log("Copying:", codesText);

      await navigator.clipboard.writeText(codesText);

      toast.success("All backup codes copied");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy backup codes");
    }
  };

  return (
    <div className="px-3">
      <p className="mb-5 text-[14px] font-normal leading-[140%] tracking-[0.07px] text-[#4A4C56]">
        Your new recovery codes have been generated successfully. Please save
        them somewhere safe.
      </p>

      <div className="rounded-lg border bg-[#F0F0F0] p-4">
        <div className="flex items-center justify-between">
          <div className="text-[20px] font-medium leading-[130%] tracking-[0.1px] text-[#070707]">
            10 Backup Codes
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="cursor-pointer"
            title="Copy all backup codes"
          >
            <Copy size={18} className="text-primaryColor" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {recoveryCodes.map((code, index) => (
            <div
              key={`${code}-${index}`}
              className="flex items-center rounded-md  px-3 py-2"
            >
              <span className="font-mono text-[14px] font-medium text-headerColor">
                {code}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full cursor-pointer rounded-lg bg-primaryColor px-4 py-2 text-center text-[14px] font-semibold leading-[140%] tracking-[0.07px] text-white"
      >
        Done
      </button> */}
    </div>
  );
}
