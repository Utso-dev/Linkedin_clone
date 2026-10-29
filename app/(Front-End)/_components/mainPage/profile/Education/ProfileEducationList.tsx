"use client";

import ProfileEducationSkeleton from "@/components/reusable/All Skleton/ProfileEducationSkeleton";
import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import { useGetEducationListByIdQuery } from "@/feature/slice/user/experienceSlice";
import { useGetStudyQuery } from "@/feature/slice/user/studySlice";
import { EducationType } from "@/lib/type";
import { Plus } from "lucide-react";
import { useState } from "react";
import ProfileEducationCard from "./ProfileEducationCard";
import ProfileEducationForm from "./ProfileEducationForm";

function ProfileEducationList({ userId }: { userId?: string }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, isLoading } = userId
    ? useGetEducationListByIdQuery(userId)
    : useGetStudyQuery(userId);
  const educationItems: EducationType[] = data?.data || [];

  const openCreateForm = () => {
    setIsFormOpen(true);
  };


  return (
    <section className=" pb-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold leading-[120%] text-headerColor">
          Education
        </h2>
        {data?.is_own_education && (
          <button
            type="button"
            aria-label="Add education"
            onClick={openCreateForm}
            className="cursor-pointer text-headerColor hover:text-primaryColor"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      <div>
        {isLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <ProfileEducationSkeleton key={`education-skeleton-${index}`} />
          ))
        ) : educationItems.length > 0 ? (
          educationItems.map((item, index) => (
            <ProfileEducationCard
              is_own_experience={data?.is_own_education}
              key={item.id}
              item={item}
            />
          ))
        ) : (
          <div className="py-6 ">
            <h4 className="text-lg font-semibold text-headerColor mb-2">
              No Education added yet
            </h4>
            <p className="text-sm text-grayColor1">
              Start building your profile by adding your education.
            </p>
            {data?.is_own_education && (
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className={`${BUTTON_STYLES.primary} flex items-center justify-center gap-1 py-2! mt-3 text-sm! px-3! `}
              >
                <Plus className="h-4 w-4" />
                Add Education
              </button>
            )}
          </div>
        )}
      </div>

      {isFormOpen && (
        <ProfileEducationForm open={isFormOpen} setOpen={setIsFormOpen} />
      )}
    </section>
  );
}

export default ProfileEducationList;
