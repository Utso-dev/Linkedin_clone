"use client";

import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import CreatableSelectField from "@/components/reusable/InputFiled/CreatableSelectField";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import RootDialog from "@/components/reusable/RootDialog";
import {
  useGetExperienceQuery,
  useGetSkillSuggestionsQuery,
} from "@/feature/slice/user/experienceSlice";
import { useGetStudyQuery } from "@/feature/slice/user/studySlice";
import { useProfileAboutUpdateMutation } from "@/feature/slice/user/userSlice";
import { normalizeSkillsList } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ProfileEducationForm from "./Education/ProfileEducationForm";
import ExpreanceAddFrom from "./expreance/ExpreanceAddFrom";

type ProfileUpdateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  title: string;
  location: string;
  current_position_id: string;
  current_institute_id: string;
  skills: string[];
};

function ProfileUpdateForm({
  open,
  setOpen,
  profileData,
}: ProfileUpdateFormProps & { profileData: any }) {
  const [showSkillsPicker, setShowSkillsPicker] = useState(false);
  const [openExperienceForm, setOpenExperienceForm] = useState(false);
  const [openEducationForm, setOpenEducationForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: companyData, isLoading } = useGetExperienceQuery(
    "company-suggestions",
  );
  const { data: skillsData } = useGetSkillSuggestionsQuery("skill-suggestions");
  const { data: institutionData, isLoading: isInstitutionLoading } =
    useGetStudyQuery("institution-suggestions");
  const [profileAboutUpdate, { isLoading: isProfileAboutUpdating }] =
    useProfileAboutUpdateMutation();
  const { control, register, handleSubmit, watch, reset } =
    useForm<ProfileFormValues>({
      defaultValues: {
        firstName: profileData?.first_name || "Vin",
        lastName: profileData?.last_name || "Intini",
        title: profileData?.title || "CEO at MindUnite",
        location: profileData?.country || "United States",
        current_position_id: profileData?.current_position?.id || "",
        current_institute_id: profileData?.current_institute?.id || "",
        skills: normalizeSkillsList(profileData?.skills) || [],
      },
    });

  useEffect(() => {
    if (!open) return;

    reset({
      firstName: profileData?.first_name || "",
      lastName: profileData?.last_name || "",
      title: profileData?.title || "",
      location: profileData?.country || "",
      current_position_id: profileData?.current_position?.id || "",
      current_institute_id: profileData?.current_institute?.id || "",
      skills: normalizeSkillsList(profileData?.skills) || [],
    });

    setShowSkillsPicker(normalizeSkillsList(profileData?.skills).length > 0);
  }, [open, profileData, reset]);

  const selectedSkills = watch("skills") || [];

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const payload = {
        first_name: values.firstName,
        last_name: values.lastName,
        title: values.title,
        country: values.location,
        current_position_id: values.current_position_id || null,
        current_institute_id: values.current_institute_id || null,
        skills: values.skills,
      };
      const response: any = await profileAboutUpdate(payload);
      toast.success(response.message || "Profile updated successfully!");
      setOpen(false);
    } catch (error) {
      setError(error?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div>
      <RootDialog
        open={open}
        setOpen={setOpen}
        className="sm:max-w-205 rounded-xl"
      >
        <div className="flex h-[85vh] max-h-[85vh] flex-col">
          <h2 className="md:text-[32px] text-lg font-semibold leading-[1.1] px-4 pt-4 md:pt-5 sm:px-5 text-headerColor sm:text-[30px]">
            Edit Profile
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
              <div>
                <label className="mb-1.5 block text-[14px] font-semibold text-descriptionColor">
                  First Name <span className="text-redColor">*</span>
                </label>
                <ReusableInput
                  id="firstName"
                  {...register("firstName")}
                  className="h-12 w-full rounded-lg border border-borderColor px-4 text-base text-headerColor outline-none transition focus:ring-2 focus:ring-primaryColor/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[14px] font-semibold text-descriptionColor">
                  Last Name <span className="text-redColor">*</span>
                </label>
                <ReusableInput
                  id="lastName"
                  {...register("lastName")}
                  className="h-12 w-full rounded-lg border border-borderColor px-4 text-base text-headerColor outline-none transition focus:ring-2 focus:ring-primaryColor/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[14px] font-semibold text-descriptionColor">
                  Title <span className="text-redColor">*</span>
                </label>
                <ReusableInput
                  id="title"
                  {...register("title")}
                  className="h-12 w-full rounded-lg border border-borderColor px-4 text-base text-headerColor outline-none transition focus:ring-2 focus:ring-primaryColor/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[14px] font-semibold text-descriptionColor">
                  Location <span className="text-redColor">*</span>
                </label>
                <ReusableInput
                  id="location"
                  {...register("location")}
                  className="h-12 w-full rounded-lg border border-borderColor px-4 text-base text-headerColor outline-none transition focus:ring-2 focus:ring-primaryColor/20"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[14px] font-semibold text-descriptionColor">
                  Current Position
                </label>

                <Controller
                  name={`current_position_id`}
                  control={control}
                  render={({ field }) => (
                    <CreatableSelectField
                      value={field.value || undefined}
                      onChange={field.onChange}
                      options={
                        companyData?.data?.map((company: any) => ({
                          value: company.company?.id,
                          label: company.company?.name,
                        })) || []
                      }
                      placeholder="Select Role here..."
                      allowCustomInput
                    />
                  )}
                />

                <button
                  type="button"
                  onClick={() => setOpenExperienceForm(true)}
                  className={`${BUTTON_STYLES.primary} flex items-center gap-1 py-2! mt-3! px-3! `}
                >
                  <Plus className="h-4 w-4" />
                  Add new position
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-[14px] font-semibold text-descriptionColor">
                  School
                </label>

                <Controller
                  name={`current_institute_id`}
                  control={control}
                  render={({ field }) => (
                    <CreatableSelectField
                      value={field.value || undefined}
                      onChange={field.onChange}
                      options={
                        institutionData?.data?.map((institution: any) => ({
                          value: institution.institution_id,
                          label: institution.institution?.name,
                        })) || []
                      }
                      placeholder="Select Role here..."
                      allowCustomInput
                    />
                  )}
                />

                <button
                  type="button"
                  onClick={() => setOpenEducationForm(true)}
                  className={`${BUTTON_STYLES.primary} flex items-center gap-1 py-2! mt-3! px-3! `}
                >
                  <Plus className="h-4 w-4" />
                  Add new school
                </button>
              </div>

              <div className="">
                <label className="mb-0.5 block text-[14px] font-semibold text-descriptionColor">
                  Skills
                </label>
                <p className="mb-2 text-sm text-descriptionColor">
                  Up to 5 skills in this experience.
                </p>

                {showSkillsPicker && (
                  <Controller
                    name="skills"
                    control={control}
                    render={({ field }) => (
                      <CreatableSelectField
                        isMulti
                        allowCustomInput
                        maxCount={5}
                        values={field.value || []}
                        onChangeValues={field.onChange}
                        options={
                          skillsData?.data?.map((skill: { name: string }) => ({
                            value: skill.name,
                            label: skill.name,
                          })) || []
                        }
                        placeholder="Select skill here..."
                        className="mb-2.5 w-full  [&_.ant-select-selector]:min-h-13! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3! [&_.ant-select-selection-placeholder]:text-descriptionColor!"
                      />
                    )}
                  />
                )}
                {!showSkillsPicker && (
                  <button
                    type="button"
                    onClick={() => setShowSkillsPicker(true)}
                    disabled={selectedSkills.length >= 5}
                    className="mt-3 inline-flex cursor-pointer items-center gap-1 rounded-full border border-primaryColor px-4 py-1.5 text-base font-semibold text-primaryColor transition-colors hover:bg-primaryColor hover:text-whiteColor disabled:cursor-not-allowed disabled:border-borderColor disabled:text-descriptionColor"
                  >
                    <Plus className="h-4 w-4" />
                    Add skill
                  </button>
                )}
              </div>
            </div>
            <div className="border-t border-borderColor py-2 md:py-4">
              {error && (
                <p className="mb-2 text-center text-sm text-redColor">
                  {error}
                </p>
              )}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isProfileAboutUpdating}
                  className="min-w-28 disabled:bg-bgColor disabled:text-grayColor1 disabled:cursor-not-allowed cursor-pointer rounded-full bg-primaryColor px-8 py-2 text-base font-semibold text-whiteColor transition-opacity hover:opacity-90"
                >
                  {isProfileAboutUpdating ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </RootDialog>
      {openExperienceForm && (
        <ExpreanceAddFrom
          open={openExperienceForm}
          setOpen={setOpenExperienceForm}
        />
      )}
      {openEducationForm && (
        <ProfileEducationForm
          open={openEducationForm}
          setOpen={setOpenEducationForm}
        />
      )}
    </div>
  );
}

export default ProfileUpdateForm;
