"use client";

import { TwoFactorSuccessIcon } from "@/public/svgIcons/AdminIcon";
import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface StepBackupCodesProps {
  codes: string[];
  onDone: () => void;
  onClose: () => void;
}

export default function StepBackupCodes({
  codes,
  onDone,
  onClose,
}: StepBackupCodesProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codes.join("\n"));
    setCopied(true);
    toast.success("Backup codes copied!");
  };

  const handleDownload = () => {
    if (!codes?.length) return;

    const blob = new Blob([codes.join("\n")], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "recovery-codes.txt";
    a.click();

    URL.revokeObjectURL(url);

    toast.success("Codes downloaded!");

    onDone();
  };

  return (
    <div className="space-y-4 px-3">
      <div className="flex flex-col items-center">
        <TwoFactorSuccessIcon />
        <p className="text-headerColor text-center text-[24px] font-semibold leading-[130%] tracking-[0.12px]">
          Verifyed Two-Factor Authentication
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-md border bg-gray-50 p-4 relative">
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-2 top-2 flex items-center justify-center rounded-md"
        >
          {copied ? (
            <Check size={18} className="text-primaryColor" />
          ) : (
            <Copy size={18} className="cursor-pointer text-primaryColor" />
          )}
        </button>
        {codes && codes.length > 0 ? (
          codes.map((code) => (
            <div
              key={code}
              className="text-center font-mono text-sm font-medium"
            >
              {code}
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-sm text-gray-500 py-2">
            No recovery codes available.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleDownload}
        disabled={!codes?.length}
        className="text-white text-[16px] font-medium leading-[160%] tracking-[0.08px]  py-2 cursor-pointer bg-primaryColor px-2 py-1 rounded-sm w-full flex items-center justify-center gap-2"
      >
        Download this backup codes
        <Download className=" cursor-pointer text-white" size={18} />
      </button>
    </div>
  );
}
