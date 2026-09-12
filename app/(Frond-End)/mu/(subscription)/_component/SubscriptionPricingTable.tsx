"use client";
import { useGetSubscriptionPlansQuery } from "@/feature/slice/subscriptionSlice";
import Link from "next/link";
import { HiBadgeCheck } from "react-icons/hi";
import SubscriptionSkeleton from "./SubscriptionSkeleton";
// আপনার API slice পাথ অনুযায়ী import করুন

const CrossIcon = () => (
  <svg
    className="w-4 h-4 text-red-500 inline-block"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function SubscriptionCards() {
  const { data, isLoading, isError } = useGetSubscriptionPlansQuery("");

  if (isLoading) {
    return <SubscriptionSkeleton />;
  }

  if (isError || !data?.success) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-red-500 font-medium">
          Failed to load subscription plans.
        </p>
      </div>
    );
  }

  const plans = data?.data?.plans || [];

  const renderValue = (val) => {
    if (typeof val === "boolean") {
      return val ? (
        <HiBadgeCheck className="text-primaryColor text-xl" />
      ) : (
        <CrossIcon />
      );
    }
    return <span className="text-gray-700 text-xs font-medium">{val}</span>;
  };
  const handleClick = () => {
    // Handle button click logic here
    console.log("Button clicked");
  };
  return (
    <div className="w-full  ">
      {/* 3 Grid layout for 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {plans.map((plan, index) => {
          const isFree = parseFloat(plan.billing_rate) === 0;

          return (
            <div
              key={plan.id}
              className="bg-white border border-borderColor rounded-2xl hover:shadow-md overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div className="p-6 text-center border-b border-borderColor">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-headerColor mb-3">
                  {plan.name}
                </h3>

                {isFree ? (
                  <button className="w-full py-2.5 px-4 border border-primaryColor text-gray-800 font-semibold rounded-lg text-sm hover:bg-teal-50 transition-colors">
                    Free
                  </button>
                ) : (
                  <Link
                    onClick={handleClick}
                    className="w-full py-2.5 px-4 block hover:shadow-md  bg-primaryColor text-white font-semibold rounded-lg text-sm hover:opacity-95 transition-opacity"
                    href={`/mu/subscription/${plan.id}`}
                  >
                    <div>
                      <span className="text-base md:text-lg lg:text-xl font-semibold">
                        ${plan.billing_rate}
                      </span>
                      <span className="text-sm font-normal opacity-90 capitalize">
                        /{plan.billing_cycle === "monthly" ? "Month" : "Year"}
                      </span>
                    </div>
                  </Link>
                )}
              </div>

              {/* Feature List */}
              <div className="divide-y divide-borderColor flex-1">
                {plan.features?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div>
                      <span className="text-sm md:text-base  font-medium text-headerColor pr-3 ">
                        {item.key}
                      </span>
                    </div>
                    <div className="shrink-0 flex items-center justify-center">
                      {renderValue(item.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
