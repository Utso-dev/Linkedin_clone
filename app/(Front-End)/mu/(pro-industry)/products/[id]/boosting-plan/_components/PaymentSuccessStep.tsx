"use client";

import { TwoFactorSuccessIcon } from "@/public/svgIcons/AdminIcon";
import { OrderSummary } from "@/types/boosting";
import Link from "next/link";

interface PaymentSuccessStepProps {
  productId: string | number;
  orderSummary: OrderSummary | null;
  onDone?: () => void;
}

export default function PaymentSuccessStep({
  productId,
  orderSummary,
  onDone,
}: PaymentSuccessStepProps) {
  return (
    <div className="max-w-xl mx-auto py-12 px-4 md:px-6 bg-white rounded-2xl border border-borderColor shadow-xs text-center space-y-6 animate-in zoom-in-95 duration-200">
      <div className="w-20 h-20 bg-primaryColor/10 p-4 rounded-full flex items-center justify-center text-4xl mx-auto shadow-xs">
        <TwoFactorSuccessIcon className="stroke-3" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-headerColor">Payment Process</h2>
        <p className="text-emerald-600 font-bold text-lg mt-1">
          Payment Successful
        </p>
      </div>

      <p className="text-sm text-descriptionColor leading-relaxed max-w-md mx-auto">
        Your product boost campaign is now active! It will receive priority
        visibility and outreach across the Mind Unite professional network.
      </p>

      {orderSummary && (
        <div className="bg-gray-50/70 border border-borderColor rounded-xl p-5 text-sm text-left space-y-2 text-headerColor ">
          <div className="flex justify-between gap-1">
            <h4 className="text-descriptionColor">Product:</h4>
            <p className="font-bold text-headerColor">
              {orderSummary.product_name}
            </p>
          </div>
          <div className="flex justify-between gap-1">
            <h4 className="text-descriptionColor">Product ID:</h4>
            <p className="font-semibold text-headerColor">
              {orderSummary.product_id}
            </p>
          </div>
          <div className="flex justify-between gap-1">
            <h4 className="text-descriptionColor">Plan:</h4>
            <p className="font-semibold text-headerColor">
              {orderSummary.plan_title}
            </p>
          </div>
          <div className="flex justify-between gap-1">
            <h4 className="text-descriptionColor">Duration:</h4>
            <p className="font-semibold text-headerColor">
              {orderSummary.duration_text}
            </p>
          </div>
          <div className="flex justify-between pt-2 border-t border-borderColor font-bold text-sm">
            <h4 className="text-descriptionColor">Total Paid:</h4>
            <p className="text-primaryColor">{orderSummary.total_formatted}</p>
          </div>
        </div>
      )}

      <div className="pt-2">
        <Link
          href="/mu/products"
          onClick={() => onDone?.()}
          className="inline-flex w-full  items-center justify-center py-3.5 rounded-lg bg-primaryColor hover:bg-primaryColor/90 text-white font-bold text-sm transition shadow-xs cursor-pointer"
        >
          Return to Product Dashboard
        </Link>
      </div>
    </div>
  );
}
