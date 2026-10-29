import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

export interface CommonStateCardProps {
  title: string;
  total: number | string;
  growthPercentage?: number | string;
  badgeText?: string;
  isPositive?: boolean;
  growthText?: string;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  className?: string;
}

export default function CommonStateCard({
  title,
  total,
  growthPercentage,
  badgeText,
  isPositive = true,
  growthText = "From last month",
  icon: Icon,
  className = "",
}: CommonStateCardProps) {
  const displayTotal =
    typeof total === "number" ? total.toLocaleString() : total;

  return (
    <div
      className={`bg-white rounded-2xl border border-borderColor/80 p-3 lg:gap-4 hover:shadow-xs transition-shadow ${className}`}
    >
      {/* Header: Icon + Label */}
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div
            className={`w-8 h-8 rounded-lg bg-primaryColor/10 text-primaryColor flex items-center justify-center shrink-0`}
          >
            {React.isValidElement(Icon) ? (
              Icon
            ) : (
              // @ts-ignore
              <Icon className="w-4 h-4" />
            )}
          </div>
        )}
        <span className="text-base font-semibold text-grayColor1">{title}</span>
      </div>

      {/* Total Number */}
      <h3 className="text-3xl font-bold text-headerColor mt-3">
        {displayTotal}
      </h3>

      {/* Growth Badge + Description */}
      {(growthPercentage !== undefined || badgeText) && (
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-xs ${
              isPositive
                ? "bg-primaryColor/10 text-primaryColor"
                : "bg-red-50 text-red-500"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {badgeText ?? `${isPositive ? "+" : "-"}${growthPercentage}%`}
            </span>
          </span>
          {growthText && (
            <span className="text-xs text-grayColor1">{growthText}</span>
          )}
        </div>
      )}
    </div>
  );
}
