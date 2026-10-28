"use client";

import { OrderSummary } from "@/types/boosting";
import Image from "next/image";

interface OrderSummaryCardProps {
  orderSummary: OrderSummary;
}

export default function OrderSummaryCard({
  orderSummary,
}: OrderSummaryCardProps) {
  return (
    <div className="bg-gray-50/70 border border-borderColor rounded-xl p-4 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-headerColor mb-3">
          Order Summary
        </h2>
        <div className="w-full h-px bg-borderColor" />
      </div>

      {/* Product Information */}
      <div className="flex items-center gap-3.5 bg-white p-3.5 rounded-lg border border-borderColor/80 shadow-xs">
        <div className="w-14 h-12 rounded-lg bg-bgColor overflow-hidden shrink-0 flex items-center justify-center border border-borderColor/60">
          {orderSummary.product_image ? (
            <Image
              src={orderSummary.product_image}
              alt={orderSummary.product_name}
              width={56}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-primaryColor">
              {(orderSummary.product_name || "P").charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-headerColor truncate">
            {orderSummary.product_name}
          </p>
          <p className="text-xs text-descriptionColor font-medium mt-0.5">
            Product ID: {orderSummary.product_id}
          </p>
        </div>
      </div>

      {/* Plan Info */}
      <div className="flex justify-between items-start pt-1">
        <div>
          <p className="text-base font-bold text-headerColor">
            {orderSummary.plan_title}
          </p>
          <p className="text-xs text-primaryColor font-semibold mt-1">
            {orderSummary.estimated_impressions} • {orderSummary.duration_text}
          </p>
        </div>
        <span className="text-base font-semibold text-headerColor">
          {orderSummary.subtotal_formatted}
        </span>
      </div>

      <div className="w-full h-px bg-borderColor" />

      {/* Subtotal & VAT */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm md:text-base">
          <span className="font-medium text-headerColor">Subtotal</span>
          <span className="font-semibold text-headerColor">
            {orderSummary.subtotal_formatted}
          </span>
        </div>
        <div className="flex justify-between text-sm md:text-base">
          <span className="font-medium text-headerColor">VAT</span>
          <span className="font-semibold text-headerColor">
            {orderSummary.vat_formatted}
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-borderColor" />

      {/* Total */}
      <div className="flex justify-between items-start pt-1">
        <div>
          <p className="text-base font-semibold text-headerColor">Total</p>
          <p className="text-xs text-gray-400 mt-0.5">Including taxes</p>
        </div>
        <span className="text-2xl font-bold text-primaryColor">
          {orderSummary.total_formatted}
        </span>
      </div>
    </div>
  );
}
