"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import RootDialog from "@/components/reusable/RootDialog";
import { useApplyUserJobMutation } from "@/feature/slice/jobs/userJobSlice";
import {
  useGetMyProfileQuery,
  useGetUserProfileQuery,
} from "@/feature/slice/user/userSlice";
import { cn } from "@/lib/utils";
import emptyImage from "@/public/empty_user.jpg";
import { CloudUpload, FileText, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ApplyActionType } from "./JobApplyAaction";

export interface QuickApplyModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  jobData?: ApplyActionType;
  onSuccess?: () => void;
}

interface QuickApplyFormData {
  email: string;
  phone: string;
  resume: File | null;
  salaryExpectation: string;
}

function QuickApplyModal({
  open,
  setOpen,
    jobData,
  onSuccess,
}: QuickApplyModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch logged in user profile if available
  const { data: userProfileData } = useGetUserProfileQuery("user");
  const { data: myProfileData } = useGetMyProfileQuery("profile");
  const [applyUserJob, { isLoading: isApplying }] = useApplyUserJobMutation();

  const user = userProfileData?.user || myProfileData?.data;
  const userName =
    user?.name ||
    (user?.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : null) ||
    "Sheikh Muhammad Ashik";

  const userHeadline =
    user?.title ||
    user?.headline ||
    user?.about ||
    "UI/UX Designer at Softvence Delta | SaaS & Fintech Product Designer | Turning Complex User Needs into Clear, Accessible Experiences Dhaka, Bangladesh";

  const userAvatar = user?.profile_image_url || emptyImage;
  const userEmail = user?.email || "";
  const userPhone = user?.phone || "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuickApplyFormData>({
    defaultValues: {
      email: "",
      phone: "",
      resume: null,
      salaryExpectation: "",
    },
  });

  const resumeFile = watch("resume");

  // Pre-fill user data when available
  useEffect(() => {
    if (userEmail) {
      setValue("email", userEmail);
    }
    if (userPhone) {
      setValue("phone", userPhone);
    }
  }, [userEmail, userPhone, setValue]);

  // Register resume validation rule
  useEffect(() => {
    register("resume", {
      required: "Resume is required",
    });
  }, [register]);

  const handleSelectFile = (file: File | undefined | null) => {
    if (!file) return;

    const validExtensions = [".pdf", ".doc", ".docx"];
    const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      toast.error("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }

    setValue("resume", file, { shouldValidate: true });
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("resume", null, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: QuickApplyFormData) => {
    try {
      if (jobData?.jobId) {
        const formData = new FormData();
        formData.append("application_type", "quick");
        formData.append("email", values.email);
        formData.append("phone_number", values.phone);
        formData.append("expected_salary", values.salaryExpectation);
        if (values.resume) {
          formData.append("resume", values.resume);
        }

        await applyUserJob({ id: jobData?.jobId, data: formData }).unwrap();
      }

      toast.success("Application submitted successfully!");
      reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit application");
    }
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="max-w-135! rounded-2xl! overflow-hidden"
      ariaLabel={`Apply to ${jobData?.industry_name || "Company"}?`}
    >
      <div className="flex h-[85vh] max-h-[85vh] flex-col bg-white">
        {/* Fixed Header (Does not scroll) */}
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-borderColor/60 pr-12 shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-headerColor">
            Apply to {jobData?.industry_name || "Company"}?
          </h3>
        </div>

        {/* Form container */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Scrollable Fields area */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 sm:px-6 py-4">
            {/* Contact info section */}
            <div>
              <h4 className="text-sm font-semibold text-headerColor mb-3">
                Contact info:
              </h4>
              <div className="flex items-start gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                  <Image
                    src={userAvatar}
                    alt={userName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-sm font-semibold text-headerColor leading-snug">
                    {userName}
                  </h5>
                  <p className="text-xs text-grayColor1 leading-relaxed mt-0.5 line-clamp-3">
                    {userHeadline}
                  </p>
                </div>
              </div>
            </div>

            {/* Enter your email using ReusableInput */}
            <ReusableInput
              id="email"
              label="Enter your email"
              type="email"
              placeholder="example@email.com"
              required
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="rounded-lg h-11! md:h-12!"
            />

            {/* Enter your Phone using ReusableInput */}
            <ReusableInput
              id="phone"
              label="Enter your Phone"
              type="tel"
              placeholder="+880 1234 567890"
              required
              error={errors.phone?.message}
              {...register("phone", {
                required: "Phone number is required",
              })}
              className="rounded-lg h-11! md:h-12!"
            />

            {/* Upload Resume/Curriculum Vitae */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-descriptionColor block">
                Upload Resume/Curriculum Vitae{" "}
                <span className="text-redColor">*</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSelectFile(file);
                  e.target.value = "";
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleSelectFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border border-dashed py-7 px-4 text-center cursor-pointer transition-colors",
                  isDragging
                    ? "border-primaryColor bg-primaryColor/5"
                    : errors.resume
                      ? "border-red-500 bg-red-50/20"
                      : "border-borderColor hover:border-primaryColor bg-white",
                )}
              >
                {resumeFile ? (
                  <div
                    className="flex items-center justify-between w-full max-w-md p-2.5 bg-gray-50 border border-borderColor rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-primaryColor shrink-0" />
                      <div className="min-w-0 text-left">
                        <p className="text-xs font-medium text-headerColor truncate max-w-55 sm:max-w-75">
                          {resumeFile.name}
                        </p>
                        <p className="text-[11px] text-grayColor1">
                          {(resumeFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-grayColor1 hover:text-red-500 p-1 rounded transition cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <CloudUpload
                      className="h-7 w-7 text-headerColor mb-2"
                      strokeWidth={1.5}
                    />
                    <p className="text-sm text-descriptionColor">
                      Drag and drop your file, or{" "}
                      <span className="font-medium text-[#009da0] hover:underline">
                        choose here
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-[#98A2B3]">
                      Support file: PDF, Word
                    </p>
                  </>
                )}
              </div>
              {errors.resume && (
                <p className="text-xs text-red-500">{errors.resume.message}</p>
              )}
            </div>

            {/* Additional Questions */}
            <div className="space-y-2 pt-1">
              <h4 className="text-sm sm:text-base font-semibold text-headerColor">
                Additional Questions
              </h4>
              <ReusableInput
                id="salaryExpectation"
                label="Your Salary Expectation?"
                placeholder="1-999999"
                required
                error={errors.salaryExpectation?.message}
                {...register("salaryExpectation", {
                  required: "Salary expectation is required",
                })}
                className="rounded-lg h-11! md:h-12!"
              />
            </div>
          </div>

          {/* Fixed Footer Buttons (Does not scroll) */}
          <div className="shrink-0 border-t border-borderColor px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-end gap-3 bg-white">
            <ButtonReuseable
              className="bg-white! py-2! px-4! text-grayColor1! border border-gray2Color!"
              title="Cancel"
              onClick={() => setOpen(false)}
            />

            <ButtonReuseable
              type="submit"
              className="px-4! py-2! bg-primaryColor!"
              disabled={isSubmitting || isApplying}
              title={
                isSubmitting || isApplying ? "Submitting..." : "Submit Now"
              }
            />
          </div>
        </form>
      </div>
    </RootDialog>
  );
}

export default QuickApplyModal;
