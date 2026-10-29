import ProfileSidebar from "@/app/(Front-End)/_components/mainPage/profile/profileSidbar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="lg:grid lg:grid-cols-9 xl:grid-cols-11 sm:py-8 py-6 gap-6  md:py-10 mb-10">
        <div className="xl:col-span-8 lg:col-span-6 col-span-12 ">
          {children}
        </div>
        <div className="hidden lg:block col-span-3  lg:h-[calc(100vh-5rem)] lg:sticky lg:top-19  lg:overflow-y-auto scrollbar-hide self-start border-l border-[#D2D2D5] pl-6 h-full">
          <ProfileSidebar />
        </div>
      </div>
    </div>
  );
}

export default layout;
