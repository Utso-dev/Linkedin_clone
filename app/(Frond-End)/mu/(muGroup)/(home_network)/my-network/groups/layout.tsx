import GroupHeader from "@/app/(Frond-End)/_components/mainPage/group/GroupHeader";
import GroupSidbarWrapper from "@/app/(Frond-End)/_components/mainPage/GroupSidbarWrapper";
import ResuableMenu from "@/components/reusable/ResuableMenu";
import React from "react";

function GroupLayout({ children }: { children: React.ReactNode }) {
  const candidateJobMenus = [
    {
      id: 1,
      title: "Group Invitation",
      href: "/mu/my-network/groups/group-invitation",
    },
    {
      id: 2,
      title: "Groups you Connected",
      href: "/mu/my-network/groups",
    },
    {
      id: 3,
      title: "Groups you Created",
      href: "/mu/my-network/groups/group-created",
    },
  ];
  return (
    <div>
      <div className="md:grid grid-cols-12 gap-6">
        <div className="md:col-span-8 col-span-12 space-y-6">
          <div>
            <GroupHeader />
          </div>
          <div>
            <ResuableMenu
              initialPath="/mu/my-network/groups"
              menuData={candidateJobMenus}
            />
            {children}
          </div>
        </div>
        <div className="col-span-4 hidden md:block border-l border-[#D2D2D5] md:sticky md:top-25  md:overflow-y-auto self-start pl-4 lg:pl-6 h-full">
          <GroupSidbarWrapper />
        </div>
      </div>
    </div>
  );
}

export default GroupLayout;
