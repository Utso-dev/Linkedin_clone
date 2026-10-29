"use client";
import ProfileUserSkleton from "@/components/reusable/All Skleton/ProfileUserSkleton";
import { useGetMyConnectionSuggestionsQuery } from "@/feature/slice/connect/connectSlice";
import ProfileUserConnectCard from "./ProfileUserConnectCard";

function ProfileSidebar() {
  const { data, isLoading } = useGetMyConnectionSuggestionsQuery(
    "my-connection-suggestions",
  );
  const peopleYouMayKnow = data?.data?.slice(0, 6);

  return (
    <aside className="w-full  bg-white  py-3">
      <div className="border-b border-borderColor pb-3">
        <h3 className="text-base md:text-lg font-semibold leading-[120%] text-headerColor">
          People you may know
        </h3>
      </div>

      <div>
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => (
              <ProfileUserSkleton key={`skeleton-${i}`} />
            ))
          : peopleYouMayKnow?.map((profile, index) => (
              <ProfileUserConnectCard
                key={profile?.id || `profile-${index}`}
                profile={profile}
              />
            ))}
      </div>
    </aside>
  );
}

export default ProfileSidebar;
