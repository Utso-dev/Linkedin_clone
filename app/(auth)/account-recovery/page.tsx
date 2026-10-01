"use client";
import ButtonReuseable from "@/components/reusable/CustomButton";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import { useRecoverYourAccountMutation } from "@/feature/slice/auth/authSlice";
import { clearToken, setToken } from "@/lib/token";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function page() {
  const [recoverYourAccount, { isLoading }] = useRecoverYourAccountMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      password: "",
    },
  });
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");

  const [message, setMessage] = useState(searchParams.get("message") || "");
  const route = useRouter();
  const onSubmit = async (data: any) => {
    try {
      const response = await recoverYourAccount({
        email,
        password: data.password,
      }).unwrap();
      toast.success("Login successful!");
      await setToken(response?.token || response.data.token);
      if (response?.user?.role === "admin") {
        route.push(`/dashboard`);
      } else {
        route.push(`/mu/home`);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Email or password is incorrect.");
    }
  };

  const handleDeleteAccount = async () => {
    await clearToken();
    route.push(`/login`);
  };
  return (
    <div className="space-y-4 ">
      <div className="flex  justify-between items-start">
        <div>
          <h4 className="text-headerColor text-base font-semibold">
            ⚠️ Account Recovery Confirmation
          </h4>
          {/* <p className="text-sm text-grayColor1 mt-0.5">
            Your account has been scheduled for deletion.
          </p> */}
        </div>
        <Link href="/login">
          <X className="w-6 h-6" />
        </Link>
      </div>
      <p className="text-sm text-grayColor1">{message}</p>
      <h4 className="text-headerColor text-base font-semibold">
        Do you want to keep your account?
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <ReusableInput
            type="password"
            id="password"
            required={true}
            placeholder="Enter your current password"
            label="Current Password"
            error={errors.password?.message as string}
            {...register("password", {
              required: "Type your password",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="rounded-md!"
          />
        </div>
        <div className="flex items-center mt-4 gap-4">
          <ButtonReuseable
            title="Keep My Account"
            type="submit"
            disabled={isLoading}
            loading={isLoading}
            sendingMsg={"Restoring..."}
            className="py-2! "
          />
          <ButtonReuseable
            title="Delete Permanently"
            type="button"
            className="py-2! border border-redColor! text-redColor! bg-whiteColor! "
            onClick={handleDeleteAccount}
          />
        </div>
      </form>

      <p className="text-redColor text-sm leading-[140%]">
        Note: If you choose Delete Permanently, all account data may be
        permanently removed and cannot be recovered after the recovery period.
      </p>
    </div>
  );
}

export default page;
