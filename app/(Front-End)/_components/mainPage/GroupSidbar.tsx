import { GroupDetailType } from "@/lib/type";
import groupImage from "@/public/images/company-logo-1.png";
import { GroupUserIcon } from "@/public/svgIcons/Icons";
import { fetchWrapper } from "@/src/utils/fetchWrapper";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import JoinGroupAction from "./group/JoinGroupAction";

async function GroupSidbar() {
  let groups: GroupDetailType[] = [];

  try {
    const data = await fetchWrapper("/groups-suggestions?page=1&limit=5");
    groups = data?.data || [];
  } catch (error) {
    groups = [];
  }

  return (
    <aside className="rounded-md ">
      <h3 className="text-base lg:text-lg py-3 font-semibold text-headerColor">
        Groups you might be Interested
      </h3>

      <div className=" space-y-0">
        {groups.length > 0 &&
          groups.map((group: GroupDetailType) => (
            <div
              key={group.id}
              className="border-t border-borderColor py-4 first:pt-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex xl:h-14 xl:w-14 w-11 h-11 lg:w-14 lg:h-14 shrink-0 items-center justify-center rounded-md bg-bgColor text-[#70757f]">
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

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/mu/my-network/group/${group?.id}`}
                    className="text-base  leading-[150%]  font-semibold text-headerColor"
                  >
                    {group.name}
                  </Link>

                  <div className="mt-1.5 flex items-center gap-2 text-grayColor1">
                    <GroupUserIcon />
                    <span className="text-[13px] leading-5">
                      {group?.total_member} Group members
                    </span>
                  </div>
                </div>
              </div>
              <JoinGroupAction groupID={group.id} />
            </div>
          ))}
        {groups.length === 0 && (
          <div className="py-10 border border-dashed rounded-sm font-semibold border-primaryColor  text-center text-base text-primaryColor">
            No group suggestions available.
          </div>
        )}
      </div>
    </aside>
  );
}

export default GroupSidbar;
