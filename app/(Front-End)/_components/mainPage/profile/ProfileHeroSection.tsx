"use client";
import ProfileHeroSkeleton from "@/components/reusable/All Skleton/ProfileHeroSkeleton";
import RootDialog from "@/components/reusable/RootDialog";
import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import {
  useGetMyProfileQuery,
  useGetProfileByIdQuery,
  useProfileImageUpdateMutation,
} from "@/feature/slice/user/userSlice";
import logoPreview from "@/public/empty_user.jpg";
import coverPreview from "@/public/images/cover imager.png";
import {
  EditeSquareIcon,
  GroupUserIcon,
  PencileIcon,
} from "@/public/svgIcons/Icons";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdWorkOutline } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import ProfileEducationForm from "./Education/ProfileEducationForm";
import ProfileConnectionAction from "./ProfileConnectionAction";
import ProfileUpdateForm from "./ProfileUpdateForm";
import ExpreanceAddFrom from "./expreance/ExpreanceAddFrom";

function ProfileHeroSection({ userId }: { userId?: string }) {
  const { data, isLoading } = userId
    ? useGetProfileByIdQuery(userId)
    : useGetMyProfileQuery("profile");
  const [profileImageUpdate] = useProfileImageUpdateMutation();
  const [openEducationForm, setOpenEducationForm] = useState(false);
  const [openExperienceForm, setOpenExperienceForm] = useState(false);
  const profileData = data?.data || {};
  const [isNotify, setIsNotify] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const coverImgRef = useRef<HTMLInputElement>(null);
  const profileImgRef = useRef<HTMLInputElement>(null);
  

  useEffect(() => {
    if (!coverImageFile) {
      setCoverImage(profileData?.cover_image_url || null);
    }
  }, [profileData?.cover_image_url, coverImageFile]);

  useEffect(() => {
    if (!profileImageFile) {
      setProfileImage(profileData?.profile_image_url || null);
    }
  }, [profileData?.profile_image_url, profileImageFile]);

  useEffect(() => {
    if (!coverImageFile && !profileImageFile) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      const formData = new FormData();

      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }

      if (coverImageFile) {
        formData.append("cover_image", coverImageFile);
      }

      try {
        await profileImageUpdate(formData).unwrap();
        setProfileImageFile(null);
        toast.success("Succesfully Update Profile Image");
        setCoverImageFile(null);
      } catch (error) {
        toast.error(error?.data?.message || "Failed to update profile image");
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [coverImageFile, profileImageFile, profileImageUpdate]);

  const handleCoverImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCoverImageFile(file);
    setCoverImage(URL.createObjectURL(file));
  };

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setProfileImageFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ProfileHeroSkeleton />
      </div>
    );
  }

  return (
    <section>
      <div className=" relative h-40 md:h-48 w-full bg-linear-to-r rounded-md from-cyan-100 to-blue-200">
        <Image
          src={coverImage || coverPreview}
          className="w-full h-full object-cover rounded-md"
          alt="Cover"
          width={1200}
          height={400}
        />
        <input
          type="file"
          ref={coverImgRef}
          accept="image/*,video/*"
          className="hidden"
          onChange={handleCoverImageChange}
        />
        {profileData?.is_own_profile && (
          <button
            onClick={() => coverImgRef.current?.click()}
            className="absolute top-2 right-2 cursor-pointer p-1 rounded-full bg-primaryColor"
          >
            <EditeSquareIcon className="text-whiteColor" />
          </button>
        )}

        {/* Floating Logo Box */}
        <div className="flex px-4 justify-between w-full">
          <div className="-mt-11 relative  border-2 border-white h-20 w-20 bg-bgLightColor rounded-full flex items-center justify-center">
            <button
              type="button"
              onClick={() => setShowImagePreview(true)}
              className="w-full h-full cursor-pointer"
            >
              <Image
                src={profileImage || logoPreview}
                className="w-full rounded-full h-full object-cover"
                alt="Logo"
                width={80}
                height={80}
              />
            </button>
            <input
              type="file"
              accept="image/*,video/*"
              ref={profileImgRef}
              className="hidden"
              onChange={handleProfileImageChange}
            />
            {profileData?.is_own_profile && (
              <button
                onClick={() => profileImgRef.current.click()}
                className="absolute bottom-0 right-0 bg-primaryColor p-1 rounded-full cursor-pointer"
              >
                <EditeSquareIcon className="text-whiteColor" />
              </button>
            )}
          </div>
          {profileData?.is_own_profile && (
            <div className="flex gap-6 ">
              <button
                aria-label="notify-open"
                onClick={() => setIsNotify(true)}
                className="cursor-pointer"
              >
                <PencileIcon />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-12 border-b border-borderColor pb-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="col-span-2">
            <h4 className="text-lg font-semibold text-headerColor leading-[150%]">
              {profileData?.first_name + " " + profileData?.last_name ||
                "Vin Intini"}
            </h4>
            <p className="text-grayColor1 text-sm">
              {profileData?.title || "Software Engineer at Betopia Group"}
            </p>
            <p className="text-grayColor1 text-sm">
              {profileData?.country || ""}
            </p>
            <div className="flex items-center gap-2.5 my-2 text-grayColor1">
              <GroupUserIcon />
              <p className="text-sm   line-clamp-3">
                {profileData?.total_connections || 0} Connection
              </p>
            </div>
          </div>
          <div className="space-y-3 col-span-1">
            <div className="flex items-center text-descriptionColor font-semibold gap-2">
              <MdWorkOutline size={22} />
              {!profileData?.is_own_profile &&
              !profileData?.current_position ? (
                <div>---</div>
              ) : profileData?.current_position ? (
                <p>
                  {profileData?.current_position?.company_name ||
                    profileData?.current_position?.name ||
                    "Software Engineer at Betopia Group"}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpenExperienceForm(true)}
                  className={`${BUTTON_STYLES.primary} flex items-center gap-1 py-1.5! text-sm! px-2.5! `}
                >
                  <Plus className="h-4 w-4" />
                  Add Experience
                </button>
              )}
            </div>
            <div className="flex items-center text-descriptionColor font-semibold gap-1.5">
              <PiStudent size={24} className="" />

              {!profileData?.is_own_profile &&
              !profileData?.current_institute ? (
                <div>---</div>
              ) : profileData?.current_institute ? (
                <p>{profileData?.current_institute?.name}</p>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpenEducationForm(true)}
                  className={`${BUTTON_STYLES.primary} flex items-center gap-1 py-1.5! text-sm! px-2.5! `}
                >
                  <Plus className="h-4 w-4" />
                  Add Institute
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 lg:mt-5">
        <ProfileConnectionAction profileData={profileData} userId={userId} />
      </div>

      {showImagePreview && (
        <RootDialog
          open={showImagePreview}
          setOpen={setShowImagePreview}
          className="sm:max-w-lg overflow-hidden max-w-[90vw]"
        >
          <div className="p-2">
            <Image
              src={profileImage || logoPreview}
              alt="Profile"
              width={400}
              height={400}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </RootDialog>
      )}

      {openEducationForm && (
        <ProfileEducationForm
          open={openEducationForm}
          setOpen={setOpenEducationForm}
        />
      )}
      {openExperienceForm && (
        <ExpreanceAddFrom
          open={openExperienceForm}
          setOpen={setOpenExperienceForm}
        />
      )}
      {isNotify && (
        <ProfileUpdateForm
          profileData={profileData}
          open={isNotify}
          setOpen={setIsNotify}
        />
      )}
    </section>
  );
}

export default ProfileHeroSection;
