"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import { Switch } from "@/components/ui/switch";
import { useGetSuggestionGroupsQuery } from "@/feature/slice/group/groupSlice";
import { useProfileSetupMutation } from "@/feature/slice/user/userSlice";
import {
  EmailIcon,
  GroupUserIcon,
  PremiumIcon,
  ProgramIcon,
  PublicationIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import OnboardingWrapper from "../../_component/OnboardingWrapper";

type ProfileImageDraft = {
  dataUrl: string;
  name: string;
  type: string;
};

const notificationLabels: Array<{
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}> = [
  {
    key: "new_jobs",
    icon: EmailIcon,
    label: "Email me about new jobs in my field",
  },
  {
    key: "publications_alerts",
    icon: PublicationIcon,
    label: "Latest publications and research alerts",
  },
  {
    key: "program_updates",
    icon: ProgramIcon,
    label: "Program and residency updates",
  },
  {
    key: "premium_offers",
    icon: PremiumIcon,
    label: "Premium features and special offers",
  },
];

const resolveProfileImageFile = async (
  profileImage: unknown,
): Promise<File | null> => {
  if (!profileImage) {
    return null;
  }

  if (profileImage instanceof File) {
    return profileImage;
  }

  if (typeof profileImage === "object") {
    const draft = profileImage as ProfileImageDraft;

    if (
      typeof draft.dataUrl === "string" &&
      draft.dataUrl.startsWith("data:")
    ) {
      const response = await fetch(draft.dataUrl);
      const blob = await response.blob();
      const fallbackType = draft.type || blob.type || "image/png";
      const extension = fallbackType.split("/")[1] || "png";

      return new File([blob], draft.name || `profile-image.${extension}`, {
        type: fallbackType,
      });
    }
  }

  if (typeof profileImage === "string" && profileImage.startsWith("data:")) {
    const response = await fetch(profileImage);
    const blob = await response.blob();
    const fallbackType = blob.type || "image/png";
    const extension = fallbackType.split("/")[1] || "png";

    return new File([blob], `profile-image.${extension}`, {
      type: fallbackType,
    });
  }

  return null;
};

function page() {
  const router = useRouter();

  const stepSixData = useSelector((state: any) => state.onboarding.formData);

  const { data: groupData } = useGetSuggestionGroupsQuery("group-suggestions");
  const [profileSetup, { isLoading }] = useProfileSetupMutation();
  const defaultPreferences = useMemo(
    () => ({
      new_jobs: stepSixData?.notification_preferences?.new_jobs ?? true,
      publications_alerts:
        stepSixData?.notification_preferences?.publications_alerts ?? true,
      program_updates:
        stepSixData?.notification_preferences?.program_updates ?? true,
      premium_offers:
        stepSixData?.notification_preferences?.premium_offers ?? true,
    }),
    [stepSixData],
  );

  const [notificationPreferences, setNotificationPreferences] =
    useState(defaultPreferences);

  const defaultFollowedIds = useMemo(() => {
    const values = stepSixData?.followed_entities;
    if (!Array.isArray(values)) {
      return [] as number[];
    }

    return groupData?.data
      .filter((item) => values.includes(item.title))
      .map((item) => item.id) as number[];
  }, [stepSixData, groupData]);

  const [selectedFollowIds, setSelectedFollowIds] =
    useState<number[]>(defaultFollowedIds);

  useEffect(() => {
    setNotificationPreferences(defaultPreferences);
  }, [defaultPreferences]);

  useEffect(() => {
    setSelectedFollowIds(defaultFollowedIds);
  }, [defaultFollowedIds]);

  const handleToggleFollow = (id: number) => {
    setSelectedFollowIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const handleFinish = async () => {
    try {
      const formData = new FormData();
      const profileImageFile = await resolveProfileImageFile(
        stepSixData?.profile_image,
      );

      Object.entries(stepSixData || {}).forEach(([key, value]) => {
        if (key === "profile_image") return;
        if (key === "notification_preferences") return;
        if (key === "followed_entities") return;
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
          return;
        }
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
          return;
        }
        formData.append(key, String(value));
      });

      if (profileImageFile) {
        formData.set("profile_image", profileImageFile);
      }

      formData.set("notify_jobs", String(notificationPreferences.new_jobs));
      formData.set(
        "notify_publications",
        String(notificationPreferences.publications_alerts),
      );
      formData.set(
        "notify_residency",
        String(notificationPreferences.program_updates),
      );
      formData.set(
        "notify_offers",
        String(notificationPreferences.premium_offers),
      );

      if (selectedFollowIds.length > 0) {
        formData.set("group_ids", selectedFollowIds.join(","));
      }

      const result = await profileSetup(formData).unwrap();
      toast.success(result?.message || "Profile setup completed successfully!");
      router.push(`/mu/home`);
    } catch (error) {
      console.error("Profile setup failed:", error);
      toast.error("Failed to complete profile setup. Please try again.");
    }
  };

  return (
    <div>
      <OnboardingWrapper
        title="Let's Get You Started"
        description="Customize your experience on Mind Unite."
      >
        <div className="mt-6 md:mt-10 space-y-6 md:space-y-7">
          <div>
            <h3 className="text-base font-semibold text-headerColor">
              Notification Preferences
            </h3>

            <div className="mt-2 divide-y divide-borderColor/80">
              {notificationLabels.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-3 pb-4"
                >
                  <div className="text-sm flex items-center gap-2 md:text-[15px] text-descriptionColor">
                    <item.icon className="h-4 w-4  " />
                    <span> {item.label}</span>
                  </div>

                  <Switch
                    checked={notificationPreferences[item.key]}
                    onCheckedChange={(checked) =>
                      setNotificationPreferences((previous) => ({
                        ...previous,
                        [item.key]: checked,
                      }))
                    }
                    className="cursor-pointer"
                    aria-label={item.label}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-descriptionColor">
              Join Groups to Get Started
              <span className="ml-1 text-sm font-normal text-liteDescriptionColor">
                (Optional)
              </span>
            </h3>

            <div className="mt-3 flex flex-col gap-3 ">
              {groupData?.data.map((option) => {
                const isSelected = selectedFollowIds.includes(option.id);

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleToggleFollow(option.id)}
                    className={`w-full rounded-lg  border px-3.5 py-3 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "border-buttonColor bg-buttonColor/10 ring-2 ring-buttonColor/20"
                        : "border-[#dde4e8] bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#dff4f4] text-buttonColor">
                        {option?.logo_url ? (
                          <Image
                            src={option?.logo_url}
                            alt={option.name}
                            width={48}
                            height={48}
                            className="rounded-md w-full h-full object-cover"
                          />
                        ) : (
                          <GroupUserIcon className="h-6 w-6" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-headerColor ">
                          {option.name}
                        </p>
                        <p className="text-xs text-grayColor1 mt-1 ">
                          {option.subtitle}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <ButtonReuseable
            type="button"
            onClick={handleFinish}
            loading={isLoading}
            sendingMsg="Finishing..."
            title="Finish & Explore"
            className="w-full lg:py-4!"
          />
        </div>
      </OnboardingWrapper>
    </div>
  );
}

export default page;
