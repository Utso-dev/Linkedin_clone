"use client";

import GroupSkleton from "@/components/reusable/All Skleton/GroupSkleton";
import { useGetGroupListQuery } from "@/feature/slice/post/postSlice";
import { setSelectedGroupIds } from "@/feature/slice/postCompose/postComposeSlice";
import groupImage from "@/public/images/company-logo-1.png";
import { GroupUserIcon } from "@/public/svgIcons/Icons";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";

function PostGroupListModal({
  setPostType,
  postData,
}: {
  setPostType: (type: string) => void;
  postData?: any;
}) {
  const [localSelectedGroupIds, setLocalSelectedGroupIds] = useState<number[]>(
    [],
  );
  const dispatch = useDispatch();
  const { data, isLoading } = useGetGroupListQuery("groupList");

  const groups = data?.data || [];
  const handleToggleGroup = (id: number) => {
    setLocalSelectedGroupIds((previous) => {
      if (previous.includes(id)) {
        return previous.filter((groupId) => groupId !== id);
      }
      return [...previous, id];
    });
  };

  const handleSelectGroups = () => {
    dispatch(setSelectedGroupIds(localSelectedGroupIds));
    setPostType("Post_write");
  };

  return (
    <section className="flex flex-col max-h-[90vh] py-4 ">
      <div className="border-b  border-borderColor px-4 pb-3">
        <button
          type="button"
          onClick={() => setPostType("post_access")}
          className="text-lg leading-10 font-semibold text-descriptionColor"
        >
          Select a Group
        </button>
      </div>

      <div className="flex-1 overflow-y-auto   px-4 py-4">
        <div className="space-y-3 ">
          {isLoading ? (
            <div>
              {Array.from({ length: 5 }).map((_, index) => (
                <GroupSkleton key={`gorup-${index}`} />
              ))}
            </div>
          ) : (
            groups.map((group: any) => {
              const isSelected = localSelectedGroupIds.includes(group.id);

              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => handleToggleGroup(group.id)}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md py-2 text-left"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex xl:h-18 xl:w-18 w-12 h-12 lg:w-14 lg:h-14 shrink-0 items-center justify-center rounded-md bg-bgColor text-[#70757f]">
                      {!group.logo_url ? (
                        <ImageIcon size={30} strokeWidth={1.8} />
                      ) : (
                        <Image
                          src={group.logo_url || groupImage}
                          alt="Group placeholder"
                          width={72}
                          height={72}
                          className="w-full h-full object-cover rounded-md"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate text-lg leading-8 font-semibold text-descriptionColor">
                        {group.name}
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-descriptionColor">
                        <GroupUserIcon className="h-4.5 w-4.5" />
                        <span className="text-[13px]">{group.subtitle}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected ? "border-buttonColor" : "border-grayColor1"
                    }`}
                  >
                    {isSelected && (
                      <span className="h-2.5 w-2.5 rounded-full bg-buttonColor" />
                    )}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
      <div className=" px-4 flex justify-end border-t pt-4 gap-4">
        <button
          onClick={() => setPostType("Post_write")}
          className="rounded-md bg-bgLightColor cursor-pointer active:scale-95 px-4 py-2 text-descriptionColor hover:bg-grayColor2"
        >
          Back
        </button>
        <button
          onClick={handleSelectGroups}
          className="rounded-md bg-buttonColor cursor-pointer active:scale-95 px-4 py-2 text-whiteColor hover:bg-buttonHover"
        >
          Done
        </button>
      </div>
    </section>
  );
}

export default PostGroupListModal;
