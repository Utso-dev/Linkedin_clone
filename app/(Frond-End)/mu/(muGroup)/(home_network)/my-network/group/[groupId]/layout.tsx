import GroupMemberList from "@/app/(Frond-End)/_components/mainPage/group/GroupMemberList";
import GroupSidbarWrapper from "@/app/(Frond-End)/_components/mainPage/GroupSidbarWrapper";
import React from "react";

async function GroupLayout({
  params,
  children,
}: {
  params: Promise<{ groupId: string }>;
  children: React.ReactNode;
}) {
  const { groupId } = await params;

  return (
    <div>
      <div className="md:grid grid-cols-12 gap-6">
        <div className="md:col-span-8 col-span-12 space-y-6">
          <div>{children}</div>
        </div>
        <div className="col-span-4 hidden md:block border-l border-[#D2D2D5] pl-4 lg:pl-6 lg:sticky lg:top-25  lg:overflow-y-auto self-start h-full">
          <GroupMemberList groupId={groupId} />
          <GroupSidbarWrapper />
        </div>
      </div>
    </div>
  );
}

export default GroupLayout;
