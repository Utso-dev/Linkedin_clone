import { headers } from "next/headers";
import React from "react";
import RootProtectedLayout from "../_components/RootProtectedLayout";

async function layout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  return (
    <div
      className={`${pathname.includes("/mu/settings/") || pathname.includes("/mu/message/") ? "bg-bgLightColor" : "bg-white"}`}
    >
      <RootProtectedLayout>{children}</RootProtectedLayout>
    </div>
  );
}

export default layout;
