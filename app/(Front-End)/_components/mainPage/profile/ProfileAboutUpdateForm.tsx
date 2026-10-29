"use client";

import ReusableTextarea from "@/components/reusable/InputFiled/TextAreaField";
import RootDialog from "@/components/reusable/RootDialog";
import { useProfileAboutUpdateMutation } from "@/feature/slice/user/userSlice";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type ProfileAboutUpdateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialAbout?: string;
};

type AboutFormValues = {
  about: string;
};

function ProfileAboutUpdateForm({
  open,
  setOpen,
  initialAbout = "",
}: ProfileAboutUpdateFormProps) {
  const { register, handleSubmit, watch, reset } = useForm<AboutFormValues>({
    defaultValues: {
      about: initialAbout,
    },
  });
  const [profileAboutUpdate, { isLoading }] = useProfileAboutUpdateMutation();

  useEffect(() => {
    if (open) {
      reset({ about: initialAbout });
    }
  }, [open, initialAbout, reset]);

  const aboutValue = watch("about") || "";

  const onSubmit = async (values: AboutFormValues) => {
    try {
      const response = await profileAboutUpdate({
        about: values.about,
      }).unwrap();
      toast.success(response.message || "Profile about updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile about:", error);
      toast.error(error?.data?.message || "Failed to update profile about.");
    }
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      aria-label="edit-about-dialog"
      className="sm:max-w-160 rounded-xl"
    >
      <div className="max-h-[90vh] overflow-y-auto p-4 sm:p-5">
        <h2 className="text-base md:text-lg font-semibold leading-[1.1] text-headerColor ">
          Edit About
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <ReusableTextarea
            label="About"
            placeholder="Tell us about yourself..."
            maxLength={2500}
            {...register("about")}
            className="min-h-48 w-full rounded-lg border border-borderColor bg-white px-3 py-2 text-base text-descriptionColor outline-none transition focus:ring-2! focus:ring-primaryColor/20!"
          />

          <p className="-mt-2 text-sm text-descriptionColor">
            {aboutValue.length}/2500
          </p>

          <div className="border-t border-borderColor pt-5">
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="min-w-28 disabled:bg-bgColor disabled:text-grayColor1 disabled:cursor-not-allowed cursor-pointer rounded-full bg-primaryColor px-8 py-2 text-base font-semibold text-whiteColor transition-opacity hover:opacity-90"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </RootDialog>
  );
}

export default ProfileAboutUpdateForm;
