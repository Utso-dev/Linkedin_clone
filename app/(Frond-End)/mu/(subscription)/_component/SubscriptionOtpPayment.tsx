"use client";
import RootDialog from "@/components/reusable/RootDialog";
import {
  useGetSubscriptionSinglePlansQuery,
  useSendSubscriptionConfirmationMutation,
} from "@/feature/slice/subscriptionSlice";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PaymentProcessModal } from "./PaymentProcessModal";
import ButtonReuseable from "@/components/reusable/CustomButton";
interface FormData {
  otp: string;
}
export default function SubscriptionOtpPayment({
  paymentId,
}: {
  paymentId: string;
}) {
  const { data: planData } = useGetSubscriptionSinglePlansQuery(paymentId);
  const planDetails = planData?.data?.plan;
  const params = useSearchParams();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const [isProcessingOpen, setIsProcessingOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"loading" | "error">(
    "loading",
  );
  const paymentMethodId = params?.get("paymentMethodId") as string;
  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { otp: "6381" },
  });

  const [sendSubscriptionConfirmation, { isLoading: isVerifying , isError, isSuccess }] =
    useSendSubscriptionConfirmationMutation();

  const handleOtpChange = (val: string, index: number) => {
    if (!/^\d?$/.test(val)) return;

    clearErrors("otp");
    setIsVerified(false);

    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
    setValue("otp", updated.join(""));

    if (val && index < 3) {
      document.getElementById(`payment-otp-${index + 1}`)?.focus();
    }
  };
  console.log(paymentMethodId, "paymentMethodId");

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (!pastedData) return;

    clearErrors("otp");
    setIsVerified(false);

    const updated = ["", "", "", ""];
    pastedData.split("").forEach((digit, idx) => {
      updated[idx] = digit;
    });

    setOtp(updated);
    setValue("otp", pastedData);

    const targetIdx = Math.min(pastedData.length, 4) - 1;
    if (targetIdx >= 0) {
      document.getElementById(`payment-otp-${targetIdx}`)?.focus();
    }
  };

  const handlePaymentSubmit = async (data: FormData) => {
    if (data.otp.length !== 4) {
      setError("otp", {
        type: "manual",
        message: "Please enter a complete 4-digit OTP.",
      });
      return;
    }

    setModalStatus("loading");
    setIsProcessingOpen(true);

    try {
      await sendSubscriptionConfirmation({
        plan_id: planDetails?.id || Number(paymentId),
        otp: data.otp,
        payment_method: paymentMethodId,
        checkout_type: "stripe",
      }).unwrap();
      setIsVerified(true);
    } catch (err: any) {
      toast.error("Payment process failed. Please try again.");

      setModalStatus("error");
      const msg = err?.data?.message || "Payment process failed try again!";
      setError("otp", { type: "manual", message: msg });
    }
  };
  const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  index: number
) => {
  if (e.key === "Backspace") {
   
    if (!otp[index] && index > 0) {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      document.getElementById(`payment-otp-${index - 1}`)?.focus();
    }
  } else if (e.key === "ArrowLeft" && index > 0) {
    e.preventDefault();
    document.getElementById(`payment-otp-${index - 1}`)?.focus();
  } else if (e.key === "ArrowRight" && index < otp.length - 1) {
    e.preventDefault();
    document.getElementById(`payment-otp-${index + 1}`)?.focus();
  }
};

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left Side: OTP Verification */}
        <div className="md:col-span-7">
          <h2 className="text-2xl font-semibold text-headerColor mb-3">
            Payment
          </h2>
          <div className="w-full h-px bg-borderColor mb-8" />

          <div className="space-y-6 text-center">
            <p className="text-sm md:text-base lg:text-lg font-medium text-headerColor">
              Enter your 4-digit OTP to confirm this payment
            </p>

            {/* OTP Input Fields */}
            <div className="w-full flex justify-center items-center flex-col mb-10">
              <div className="flex items-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`payment-otp-${index}`}
                    value={digit}
                    maxLength={1}
                    inputMode="numeric"
                    onKeyDown={(e) => handleKeyDown(e, index)} 
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onPaste={handlePaste}
                    className={`w-12 h-14 bg-white border text-center text-lg font-semibold rounded-xl outline-none transition-all ${
                      errors.otp
                        ? "border-redColor text-redColor ring-1 ring-redColor"
                        : isVerified
                          ? "border-lightGreenColor text-headerColor ring-lightGreenColor/20"
                          : "border-borderColor text-headerColor focus:border-lightGreenColor focus:ring-1 focus:ring-lightGreenColor"
                    }`}
                  />
                ))}
              </div>

              {/* Verified Badge */}
              {isVerified && !errors.otp && (
                <div className="flex items-center gap-1.5 mt-4 text-lightGreenColor text-sm font-medium">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Verified</span>
                </div>
              )}

              {errors.otp && (
                <p className="mt-2 text-sm text-redColor font-medium">
                  {errors.otp.message}
                </p>
              )}
            </div>

            {/* Pay Button */}
            
            <ButtonReuseable  type="button"
              onClick={handleSubmit(handlePaymentSubmit)}
              disabled={isVerifying } 
              loading={isVerifying }
              sendingMsg={"Processing your payment..."}
              title={ `Pay USD $${planDetails?.billing_rate || "6.99"}`}
              className="w-full"
              />

            {/* Privacy Policy */}
            <p className="text-sm text-grayColor1 leading-relaxed pt-2">
              Your personal data will be used to process your order, support
              your experience throughout this website, and for other purposes
              described in our privacy policy.
            </p>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="md:col-span-5 bg-bgLightColor p-6 md:p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-headerColor mb-3">
            Order Summary
          </h2>
          <div className="w-full h-px bg-borderColor mb-6" />

          {/* Plan Info */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-base lg:text-lg font-bold text-headerColor">
                {planDetails?.name || "Premium Individual"}
              </p>
              <p className="text-sm md:text-base text-grayColor1 mt-0.5">
                Unlimited Access
              </p>
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
              <p className="text-sm text-grayColor1 mt-0.5">
                Including $0.00 in taxes
              </p>
            </div>
            <span className="text-2xl font-bold text-headerColor">
              ${planDetails?.billing_rate || "6.99"}
            </span>
          </div>
        </div>
      </div>

      {/* RootDialog Modal */}
      <RootDialog
        open={isProcessingOpen}
        setOpen={setIsProcessingOpen}
        ariaLabel="Payment Process"
        ariaDescription="Payment status notification"
      >
        <PaymentProcessModal
          status={modalStatus}
          isSuccess={isSuccess}
          onClose={() => setIsProcessingOpen(false)}
        />
      </RootDialog>
    </div>
  );
}
