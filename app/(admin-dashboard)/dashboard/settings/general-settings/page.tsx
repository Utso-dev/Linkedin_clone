"use client";

import { useRef, useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";

export default function GeneralSettings() {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    platformName: "Mind Unite",
    adminEmail: "admin@mindunite.com",
    platformTagline:
      "The networking platform for brain health professionals and students.",
    platformLanguage: "en-US",
    timezone: "UTC-05:00",
    dateFormat: "20 July, 2026",
    footerText: "@2026 Mind Unite. All rights reserved.",
  });

  const [siteLogo, setSiteLogo] = useState<string>("/images/logo.png");

  const [favicon, setFavicon] = useState<string>("/images/favicon.png");

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "favicon",
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    if (type === "logo") {
      setSiteLogo(imageUrl);
    } else {
      setFavicon(imageUrl);
    }
  };

  const handleSave = () => {
    console.log("Settings:", formData);
    console.log("Site Logo:", siteLogo);
    console.log("Favicon:", favicon);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#EEEEEE] pb-4">
        <div>
          <CustomTitleDescription
            title="Settings"
            description="Manage your platform settings and preferences."
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="cursor-pointer rounded-lg bg-primaryColor px-4 py-2.5 text-sm font-semibold text-white"
        >
          Save Changes
        </button>
      </div>

      {/* General Settings */}
      <div className="mt-4 rounded-xl border border-[#E1E1E1] p-3.5">
        <h2 className="text-headerColor  text-[24px] font-semibold leading-[130%] tracking-[0.12px] mb-4">
          General Settings
        </h2>

        {/* Row 1 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CustomInput
            label="Platform Name"
            value={formData.platformName}
            onChange={(e) => handleChange("platformName", e.target.value)}
          />

          <CustomInput
            label="Admin Email"
            value={formData.adminEmail}
            onChange={(e) => handleChange("adminEmail", e.target.value)}
          />
        </div>

        {/* Row 2 */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <CustomInput
            label="Platform Tagline"
            value={formData.platformTagline}
            onChange={(e) => handleChange("platformTagline", e.target.value)}
          />

          <CustomSelect
            label="Platform Language"
            value={formData.platformLanguage}
            onChange={(value) =>
              handleChange("platformLanguage", value as string)
            }
            options={[
              {
                label: "English (US)",
                value: "en-US",
              },
              {
                label: "English (UK)",
                value: "en-GB",
              },
              {
                label: "French",
                value: "fr",
              },
              {
                label: "German",
                value: "de",
              },
            ]}
          />
        </div>

        {/* Row 3 */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <CustomSelect
            label="Default Timezone"
            value={formData.timezone}
            onChange={(value) => handleChange("timezone", value as string)}
            options={[
              {
                label: "(UTC-05:00) Eastern Time (US & Canada)",
                value: "UTC-05:00",
              },
              {
                label: "(UTC-06:00) Central Time (US & Canada)",
                value: "UTC-06:00",
              },
              {
                label: "(UTC-07:00) Mountain Time (US & Canada)",
                value: "UTC-07:00",
              },
              {
                label: "(UTC-08:00) Pacific Time (US & Canada)",
                value: "UTC-08:00",
              },
            ]}
          />

          <CustomSelect
            label="Date Format"
            value={formData.dateFormat}
            onChange={(value) => handleChange("dateFormat", value as string)}
            options={[
              {
                label: "20 July, 2026",
                value: "20 July, 2026",
              },
              {
                label: "July 20, 2026",
                value: "July 20, 2026",
              },
              {
                label: "20/07/2026",
                value: "20/07/2026",
              },
              {
                label: "07/20/2026",
                value: "07/20/2026",
              },
            ]}
          />
        </div>

        {/* Site Logo */}
        <div className="mt-4 border-b border-[#E5E5E5] pb-4">
          <p className="text-grayColor1  text-[16px] font-semibold leading-[150%] tracking-[0.08px]">
            Site logo
          </p>

          <p className="mt-1 text-[#8C8C8C]  text-[14px] leading-[150%] tracking-[0.07px]">
            Upload your platform logo. This will be displayed in the admin panel
            and platform.
          </p>

          <div className="mt-3 flex items-center gap-4">
            {/* Preview */}
            <div className="flex h-[96px] w-[278px] items-center justify-center rounded-lg border border-dashed border-[#C8C8C8] bg-[#F8FAFB] p-3">
              {siteLogo ? (
                <img
                  src={siteLogo}
                  alt="Site Logo"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-sm text-[#999999]">No logo</span>
              )}
            </div>

            <div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
                onChange={(e) => handleImageChange(e, "logo")}
              />

              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#E0E0E0] px-3 py-2 text-grayColor1 text-center  text-[14px] font-normal leading-[140%] tracking-[0.07px]"
              >
                ↻ Change Logo
              </button>

              <p className="mt-2 text-[#A5A5AB]  text-[16px] font-normal leading-[150%] tracking-[0.08px]">
                Recommended size: 512x512px
              </p>

              <p className="text-[#A5A5AB]  text-[16px] font-normal leading-[150%] tracking-[0.08px]">
                (PNG, JPG or SVG 2MB)
              </p>
            </div>
          </div>
        </div>

        {/* Fav Icon */}
        <div className="border-b border-[#E5E5E5] py-4">
          <p className="text-grayColor1  text-[16px] font-semibold leading-[150%] tracking-[0.08px]">
            Fav Icon
          </p>

          <p className="mt-1 text-[#8C8C8C]  text-[14px] leading-[150%] tracking-[0.07px]">
            Upload your platform favicon. This will be displayed in the browser
            tab.
          </p>

          <div className="mt-3 flex items-center gap-4">
            {/* Preview */}
            <div className="flex h-[82px] w-[82px] items-center justify-center rounded-lg border border-dashed border-[#C8C8C8] bg-[#F8FAFB] p-3">
              {favicon ? (
                <img
                  src={favicon}
                  alt="Favicon"
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <span className="text-xs text-[#999999]">No icon</span>
              )}
            </div>

            <div>
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/x-icon"
                className="hidden"
                onChange={(e) => handleImageChange(e, "favicon")}
              />

              <button
                type="button"
                onClick={() => faviconInputRef.current?.click()}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm text-grayColor1"
              >
                ↻ Change Logo
              </button>

              <p className="mt-2 text-[#A5A5AB]  text-[16px] font-normal leading-[150%] tracking-[0.08px]">
                Recommended size: 32x32px
              </p>

              <p className="text-[#A5A5AB]  text-[16px] font-normal leading-[150%] tracking-[0.08px]">
                (PNG, JPG or SVG, Max 1MB)
              </p>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="pt-4">
          <CustomInput
            label="Footer Text"
            value={formData.footerText}
            onChange={(e) => handleChange("footerText", e.target.value)}
          />

          <p className="mt-1 text-sm text-[#8C8C8C]  text-[14px] leading-[150%] tracking-[0.07px]">
            This text will be displayed in the platform footer.
          </p>
        </div>
      </div>
    </div>
  );
}
