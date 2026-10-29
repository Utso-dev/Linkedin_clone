"use client";

import { TwoFactorSuccessIcon } from "@/public/svgIcons/AdminIcon";

interface Props {
  onClose: () => void;
}

export default function Success({ onClose }: Props) {
  return (
    <div className="px-3 text-center">
      <div className="flex flex-col items-center">
        <div>
          <TwoFactorSuccessIcon />
        </div>

        <p className="text-headerColor text-center text-[20px] font-semibold leading-[130%] tracking-[0.1px]">
          You Recovery Email OTP is Verified!
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-lg bg-primaryColor px-4 py-2 text-[14px] font-semibold text-white"
      >
        Continue
      </button>
    </div>
  );
}
