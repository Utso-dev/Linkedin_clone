"use client";
import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import {
  useGetExperienceListByIdQuery,
  useGetExperienceQuery,
} from "@/feature/slice/user/experienceSlice";
import { Plus } from "lucide-react";
import { useState } from "react";
import { MdWorkOutline } from "react-icons/md";
import ExpreanceAddFrom from "./ExpreanceAddFrom";
import ProfileExpreanceCard from "./ProfileExpreanceCard";

function ProfileExpreance({ userId }: { userId?: string }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { data, isLoading, isError } = userId
    ? useGetExperienceListByIdQuery(userId)
    : useGetExperienceQuery("experience");
  const profileData = data?.data || [];


  return (
    <section className=" pb-4 mt-6 lg:mt-8">
      <div className="mb-3 lg:mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold leading-[120%] text-headerColor">
          Experience
        </h2>
        <div className="flex items-center gap-3">
          {data?.is_own_experience && (
            <button
              type="button"
              aria-label="Add experience"
              onClick={() => setIsAddOpen(true)}
              className="cursor-pointer text-headerColor hover:text-primaryColor"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}

          {/* <button
            type="button"
            aria-label="Edit experience"
            className="cursor-pointer text-headerColor hover:text-primaryColor"
          >
            <EditeIcon className="h-4 w-4" />
          </button> */}
        </div>
      </div>

      <div>
        {profileData?.length > 0 ? (
          profileData?.map((experience: any, index: number) => (
            <div
              key={experience?.id || `experience-${index}`}
              className="border-b border-borderColor py-4"
            >
              <div className="flex items-start gap-2.5">
                <div className="h-11 w-11 shrink-0 flex items-center justify-center bg-primaryColor rounded-md">
                  <MdWorkOutline className="text-whiteColor" size={22} />
                </div>
                <div>
                  <div>
                    <h3 className="text-base font-semibold leading-[1.2] text-descriptionColor">
                      {experience?.company?.name}
                    </h3>

                    <p className="mt-1 text-sm text-descriptionColor">
                      {experience?.company?.meta || "Company Meta Information"}
                    </p>
                  </div>
                  {experience?.experiences?.map(
                    (item: any, itemIndex: number) => {
                      const isLast =
                        itemIndex === experience.experiences.length - 1;
                      const hasMultiple = experience.experiences.length > 1;

                      return (
                        <div
                          key={item.id || `item-${index}-${itemIndex}`}
                          className="relative"
                        >
                          {hasMultiple && !isLast && (
                            <div className="h-[90%] w-0.5 absolute rounded-full -left-8.75 top-14.5 shrink-0 bg-liteDescriptionColor" />
                          )}

                          <ProfileExpreanceCard
                            is_own_experience={data?.is_own_experience}
                            item={item}
                            borderb={false}
                          />
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6">
            <h4 className="text-lg font-semibold text-headerColor mb-2">
              No experience added yet
            </h4>

            {data?.is_own_experience && (
              <>
                <p className="text-sm text-grayColor1">
                  Start building your profile by adding your work experience.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(true)}
                  className={`${BUTTON_STYLES.primary} flex items-center justify-center gap-1 py-2! mt-3 text-sm! px-3! `}
                >
                  <Plus className="h-4 w-4" />
                  Add Experience
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isAddOpen && (
        <ExpreanceAddFrom open={isAddOpen} setOpen={setIsAddOpen} />
      )}
    </section>
  );
}

export default ProfileExpreance;
