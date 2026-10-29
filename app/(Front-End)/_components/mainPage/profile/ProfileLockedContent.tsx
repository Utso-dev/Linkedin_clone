"use client";
import ProfileUserSkleton from "@/components/reusable/All Skleton/ProfileUserSkleton";
import { useGetProfileByIdQuery } from "@/feature/slice/user/userSlice";
import ProfileEducationList from "./Education/ProfileEducationList";
import ProfileAbout from "./ProfileAbout";
import ProfileLockDesign from "./ProfileLockDesign";
import ProfilePostList from "./ProfilePostList";
import ProfileExpreance from "./expreance/ProfileExpreance";

function ProfileLockedContent({ userId }: { userId: string }) {
  const { data, isLoading } = useGetProfileByIdQuery(userId);
  const isPrivate = data?.data?.is_private_profile;
  const isOwn = data?.is_own_profile || data?.data?.is_own_profile;

  if (isLoading) {
    return <ProfileUserSkleton />;
  }

  if (isPrivate && !isOwn) {
    return <ProfileLockDesign />;
  }

  return (
    <div>
      <ProfileAbout userId={userId} />
      <ProfilePostList />
      <ProfileExpreance userId={userId} />
      <ProfileEducationList userId={userId} />
    </div>
  );
}

export default ProfileLockedContent;