"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContactSubmitMutation } from "@/feature/slice/auth/authSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormValues = {
  fullName: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
  address: string;
  subject?: string;
};

export default function ContactForm() {
  const { data } = useGetUserProfileQuery("profile");
  const [contactSubmit, { isLoading }] = useContactSubmitMutation();

  const userFullName =
    (data?.user?.first_name || "") +
    (data?.user?.last_name ? " " + data?.user?.last_name : "");
  const {
    register,
    handleSubmit,
    formState: { errors },

    reset,
  } = useForm<FormValues>({
    defaultValues: {
      fullName: userFullName || "",
      phone: "",
      email: data?.user?.email || "",
      topic: "",
      message: "",
      address: "",
      subject: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        fullName: userFullName || "",
        email: data?.user?.email || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (data: FormValues) => {
    const formData = {
      name: data.fullName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      subject: data.subject,
      message: data.message,
    };
    try {
      let response = await contactSubmit({ payload: formData }).unwrap();
      toast.success(response?.message || "Message sent successfully");
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="w-full bg-whiteColor p-4 py-6 rounded-sm lg:p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 md:space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="fullName"
              className="block text-base font-medium mb-1"
            >
              Full Name <span className="text-redColor">*</span>
            </label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              {...register("fullName", { required: "Full name is required" })}
              className={`w-full py-6 ${errors.fullName ? "border-redColor text-redColor py-6 " : ""}`}
            />
            {errors.fullName && (
              <p className="text-redColor text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-base font-medium mb-1">
              Phone
            </label>
            <Input
              id="phone"
              placeholder="(000) 000-0000 "
              {...register("phone")}
              className={`w-full py-6`}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="email" className="block text-base font-medium mb-1">
              Email <span className="text-redColor">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`w-full  py-6 ${errors.email ? "border-redColor text-redColor" : ""}`}
            />
            {errors.email && (
              <p className="text-redColor text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-base font-medium mb-1">
              Address
            </label>
            <Input
              id="address"
              type="text"
              placeholder="123 Main Street, City, Country"
              {...register("address")}
              className={`w-full  py-6 `}
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-base font-medium mb-1">
            Subject <span className="text-redColor">*</span>
          </label>
          <Input
            id="subject"
            type="text"
            placeholder="Enter subject"
            {...register("subject", {
              required: "Subject is required",
            })}
            className={`w-full  py-6 ${errors.subject ? "border-red text-redColor" : ""}`}
          />
          {errors.subject && (
            <p className="text-redColor text-xs mt-1">
              {errors.subject.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="message" className="block text-base font-medium mb-1">
            Message <span className="text-redColor">*</span>
          </label>
          <Textarea
            id="message"
            rows={5}
            placeholder="Your message here..."
            {...register("message", { required: "Message is required" })}
            className={`w-full h-37 ${errors.message ? "border-redColor text-redColor" : ""}`}
          />
          {errors.message && (
            <p className="text-redColor text-xs mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <ButtonReuseable
          type="submit"
          className="w-full cursor-pointer bg-primaryColor text-base   text-white py-6 rounded"
          disabled={isLoading}
          title="Send Message"
          sendingMsg="Sending..."
        />
      </form>
    </div>
  );
}
