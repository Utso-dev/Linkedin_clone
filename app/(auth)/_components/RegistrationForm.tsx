"use client";

import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import { Checkbox } from "@/components/ui/checkbox";
import { useRegistrationMutation } from "@/feature/slice/auth/authSlice";
import { OpenEyeIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiEyeOff } from "react-icons/fi";
import SocialShare from "./SociaShare";
interface RegFromData {
  email: string;
  password: string;
  terms: boolean;
}
function RegistrationForm() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<RegFromData>({
    defaultValues: {
      email: "",
      password: "",
      terms: false,
    },
  });
  const [registration, { isLoading }] = useRegistrationMutation();
  const [showPassword, setShowPassword] = useState(false);
  const route = useRouter();
  const onSubmit = async (data: RegFromData) => {
  

    try {
      const response = await registration(data).unwrap();
      if (response.error) {
        const status =
          "status" in response.error ? response.error.status : undefined;
        if (status === 401) {
          toast.error("Invalid email or password");
        }
      }

      toast.success("Registration successful!");
      localStorage.setItem("regEmail", data.email);
      route.push("/sign-up/verify-email");
    } catch (error) {
      toast.error(
        error?.data?.message || "Registration failed. Please try again.",
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <div className=" space-y-4 md:space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
          <div>
            <ReusableInput
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className=" rounded-lg "
            />
            {errors.email && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-descriptionColor mb-2"
            >
              Password{" "}
              <span className="font-normal"> (6 or more characters)</span>
            </label>
            <div className="relative">
              <ReusableInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className=" rounded-lg "
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 cursor-pointer active:scale-95 -translate-y-1/2 text-[#4A4C56] hover:text-primaryColor transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <OpenEyeIcon />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>
          <div>
            <div className="flex gap-2">
              <div className="mt-1">
                <Controller
                  name="terms"
                  control={control} // useForm() থেকে control ডি estructuring করে নেবেন
                  rules={{
                    required: "You must agree to the terms and conditions",
                  }}
                  render={({ field }) => (
                    <Checkbox
                      id="terms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="  text-sm  text-descriptionColor pt-1">
                By clicking <span className="font-medium">Join Now</span>, you
                agree to the <span className="font-medium">MindUnite</span>{" "}
                <Link href={"/terms-conditions"} className="text-primaryColor">
                  Terms & Condition
                </Link>{" "}
                &{" "}
                <Link href={"/privacy-policy"} className="text-primaryColor">
                  Privacy Policy
                </Link>
                {/* <Link href={"#"} className="text-primaryColor">
              and Cookie Policy.
            </Link> */}
              </div>
            </div>
            {errors.terms && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.terms.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 active:scale-95 cursor-pointer disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg bg-buttonColor text-white font-medium hover:opacity-90 transition-opacity"
          >
            {isLoading ? "Connecting..." : "Register"}
          </button>
        </form>
        <div className=" relative h-px w-full bg-borderColor">
          <p className="text-center absolute left-1/2 top-1/2 text-base text-descriptionColor -translate-x-1/2 -translate-y-1/2 bg-white px-4">
            or
          </p>
        </div>
        <div className="">
          <SocialShare />
        </div>
        <div>
          <p className="text-center text-sm md:text-base text-grayColor1">
            Don’t have an account?{" "}
            <Link href="/login" className="text-primaryColor hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
