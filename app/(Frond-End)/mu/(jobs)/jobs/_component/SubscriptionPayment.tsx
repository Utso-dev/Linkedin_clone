"use client";
import {
  useGetSubscriptionSinglePlansQuery,
  useSendSubscriptionOTPRequestMutation,
} from "@/feature/slice/subscriptionSlice";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import PaymentSkeleton from "./PaymentSkeleton";
// আপনার API slice পাথ অনুযায়ী import করুন
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY;
// আপনার Stripe Publishable Key দিন
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// Stripe Element-এর কমন স্টাইল কনফিগ
const elementOptions = {
  style: {
    base: {
      fontSize: "14px",
      color: "#111827",
      fontFamily: "inherit",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#ef4444",
    },
  },
};

const CheckoutForm = ({ planDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [saveCard, setSaveCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const route = useRouter();
  const pathName = usePathname();
  // RTK Query Mutation Hook
  const [sendSubscriptionOTP, { isLoading: isOtpSending }] =
    useSendSubscriptionOTPRequestMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    try {
      setErrorMessage("");

      // ১. Stripe Token/PaymentMethod তৈরি
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }
      const response = await sendSubscriptionOTP({
        plan_id: planDetails?.id,
      }).unwrap();
      console.log("OTP Sent Successfully:", response);
      route.push(
        `${pathName}/pymant-confirmation?paymentMethodId=${paymentMethod.id}`,
      );
    } catch (err) {
      setErrorMessage(
        err?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left Side: Payment Form */}
        <div className="md:col-span-7">
          <h2 className="text-2xl font-semibold text-headerColor mb-3">
            Payment
          </h2>
          <div className="w-full h-px bg-borderColor mb-8" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-headerColor mb-2">
                Card Number
              </label>
              <div className="w-full px-3.5 py-3 border border-borderColor rounded-lg bg-white focus-within:ring-1 focus-within:ring-primaryColor focus-within:border-primaryColor">
                <CardNumberElement
                  options={{
                    ...elementOptions,
                    showIcon: true,
                  }}
                />
              </div>
            </div>

            {/* Expiration Date & CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-headerColor mb-2">
                  Expiration Date
                </label>
                <div className="w-full px-3.5 py-3 border border-borderColor rounded-lg bg-white focus-within:ring-1 focus-within:ring-primaryColor focus-within:border-primaryColor">
                  <CardExpiryElement options={elementOptions} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-headerColor mb-2">
                  CVC
                </label>
                <div className="w-full px-3.5 py-3 border border-borderColor rounded-lg bg-white focus-within:ring-1 focus-within:ring-primaryColor focus-within:border-primaryColor">
                  <CardCvcElement options={elementOptions} />
                </div>
              </div>
            </div>

            {/* Save Card Checkbox */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                id="saveCard"
                type="checkbox"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="w-4 h-4 rounded border-borderColor text-primaryColor focus:ring-primaryColor cursor-pointer"
              />
              <label
                htmlFor="saveCard"
                className="text-sm text-gray-500 cursor-pointer"
              >
                Save card details
              </label>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
            )}

            {/* Pay Button */}
            <button
              type="submit"
              disabled={!stripe || isOtpSending}
              className="w-full py-3 px-4 bg-primaryColor text-white font-medium rounded-lg text-sm hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {isOtpSending
                ? "Processing..."
                : `Pay USD $${planDetails?.billing_rate || "6.99"}`}
            </button>

            {/* Disclaimer */}
            <p className="text-xs text-gray-400 leading-relaxed pt-2">
              Your personal data will be used to process your order, support
              your experience throughout this website, and for other purposes
              described in our privacy policy.
            </p>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="md:col-span-5 bg-gray-50/50 p-6 md:p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-headerColor mb-3">
            Order Summary
          </h2>
          <div className="w-full h-px bg-borderColor mb-6" />

          {/* Plan Info */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-bold text-headerColor">
                {planDetails?.name || "Premium Individual"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Unlimited Access</p>
            </div>
            <span className="text-sm font-semibold text-headerColor">
              ${planDetails?.billing_rate || "6.99"}
            </span>
          </div>

          <div className="w-full h-px bg-borderColor mb-6" />

          {/* Subtotal & VAT */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-headerColor">Subtotal</span>
              <span className="font-semibold text-headerColor">
                ${planDetails?.billing_rate || "6.99"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-headerColor">VAT</span>
              <span className="font-semibold text-headerColor">$0.00</span>
            </div>
          </div>

          <div className="w-full h-px bg-borderColor mb-6" />

          {/* Total */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-headerColor">Total</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Including $0.00 in taxes
              </p>
            </div>
            <span className="text-2xl font-bold text-headerColor">
              ${planDetails?.billing_rate || "6.99"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SubscriptionPayment({ pymentId }) {
  console.log(pymentId, "id");

  const {
    data: planDetails,
    isLoading,
    isError,
  } = useGetSubscriptionSinglePlansQuery(pymentId);
  if (!stripePromise) {
    return (
      <div className="text-center py-10 text-red-500 font-medium">
        Stripe Public Key is missing! Check your .env.local file.
      </div>
    );
  }

  if (isLoading) {
    return <PaymentSkeleton />;
  }
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm planDetails={planDetails?.data?.plan} />
    </Elements>
  );
}
