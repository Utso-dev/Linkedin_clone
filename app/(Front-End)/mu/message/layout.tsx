"use client";
import { useParams } from "next/navigation";
import Breadcrumb from "../../_components/Breadcrumb";
import MessageUserSection from "./_component/MessageUserSection";

function layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  return (
    <div className="pb-6 md:pb-8">
      <div>
        <Breadcrumb />
      </div>
      <div className="h-full md:bg-white md:p-4 rounded-xl flex">
        {/* Sidebar */}
        <div
          className={`md:max-w-80 lg:max-w-90 md:border-r ${params?.id ? "hidden" : "block"} md:pr-4 w-full md:flex flex-col`}
        >
          <MessageUserSection />
        </div>
        <div className={`w-full ${params?.id ? "block" : "hidden"} md:block`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default layout;
