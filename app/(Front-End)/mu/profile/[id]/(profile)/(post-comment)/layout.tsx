"use client";
import { useGetProfileByIdQuery } from "@/feature/slice/user/userSlice";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  const params = useParams();

  const { data: userProfile } = useGetProfileByIdQuery(params.id, {
    skip: !params.id,
  });

  const profileFilter = userProfile?.data?.is_own_profile
    ? [
        { id: 1, name: "Post", pathName: `/mu/profile/${params.id}/posts` },
        {
          id: 2,
          name: "Comments",
          pathName: `/mu/profile/${params.id}/comments`,
        },
      ]
    : [{ id: 1, name: "Post", pathName: `/mu/profile/${params.id}/posts` }];
  const pathName = usePathname();
  const isActive = (href: string): boolean => {
    if (href === `/mu/profile/${params.id}/posts`) {
      return pathName === `/mu/profile/${params.id}/posts`;
    }
    return pathName.startsWith(href);
  };
  return (
    <div>
      <div className="mb-3">
        <h2 className="text-lg md:text-xl font-semibold text-headerColor">
          All Activity
        </h2>
      </div>
      <div className="w-full overflow-x-auto border-y flex  border-borderColor">
        {profileFilter.map((filter) => (
          <Link
            href={filter.pathName}
            className={`flex items-center justify-center whitespace-nowrap px-5 py-2 text-sm font-medium transition-colors cursor-pointer ${
              isActive(filter.pathName)
                ? "bg-bgLightColor border-t border-grayColor1 border-b text-headerColor"
                : "bg-white text-descriptionColor hover:bg-bgLightColor hover:text-headerColor"
            }`}
          >
            {filter.name}
          </Link>
        ))}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default layout;
