import ResuableMenu from "@/components/reusable/ResuableMenu";
import React from "react";

function FollowingLayout({ children }: { children: React.ReactNode }) {
  const candidateJobMenus = [
    {
      id: 1,
      title: "Following",
      href: "/mu/my-network/following",
    },
    {
      id: 2,
      title: "Followers",
      href: "/mu/my-network/following/followers",
    },
  ];
  return (
    <div>
      <ResuableMenu
        initialPath="/mu/my-network/following"
        menuData={candidateJobMenus}
      />
      {children}
    </div>
  );
}

export default FollowingLayout;
