import CustomInput from "@/components/reusable/dashboard/CustomInput";
import Loading from "@/components/reusable/Loader";
import { useGenerateCodeMutation } from "@/feature/slice/admin/securitySettings";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormData {
  password: string;
}

interface GenerateNewCodeProps {
  onSuccess: (codes: string[]) => void;
}

export default function GenerateNewCode({ onSuccess }: GenerateNewCodeProps) {
  const [generateNewCode, { isLoading }] = useGenerateCodeMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await generateNewCode(data).unwrap();

      toast.success(res?.message || "Success");

      if (res?.recovery_codes) {
        onSuccess(res.recovery_codes);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="px-3">
      <p className="mb-6 text-[14px] font-normal leading-[140%] tracking-[0.07px] text-[#4A4C56]">
        Generate 10 backup codes for verification purpose
      </p>

      <div className="relative">
        <CustomInput
          label="Enter your Password"
          placeholder="⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆"
          type={showPassword ? "text" : "password"}
          {...register("password", {
            required: "Password is required",
          })}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-11 cursor-pointer text-end"
        >
          {showPassword ? (
            <Eye className="h-5 w-5 text-grayColor1" />
          ) : (
            <EyeOff className="h-5 w-5 text-grayColor1" />
          )}
        </button>
      </div>

      {errors.password && (
        <p className="text-[14px] font-normal leading-[140%] tracking-[0.07px] text-red-500">
          {errors.password.message}
        </p>
      )}

      <div className="mt-4">
        {isLoading ? (
          <Loading />
        ) : (
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="w-full cursor-pointer rounded-lg bg-primaryColor px-4 py-2 text-center text-[14px] font-semibold leading-[140%] tracking-[0.07px] text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
