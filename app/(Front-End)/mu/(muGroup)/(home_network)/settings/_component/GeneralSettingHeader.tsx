import { UserProfileType } from "@/lib/type";
import emptyUser from "@/public/empty_user.jpg";
import dayjs from "dayjs";
import Image from "next/image";

function GeneralSettingHeader({ data }: { data: UserProfileType }) {
  return (
    <div>
      <div className="flex items-center gap-4 pb-6 border-b border-border">
        <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-gray-100">
          <Image
            src={data?.user?.profile_image_url || emptyUser}
            alt="User profile"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-headerColor">
            {data?.user?.first_name} {data?.user?.last_name}
          </h2>
          <p className="text-base text-grayColor1">
            {data?.user?.email || "No email available"}
          </p>
          <p className="text-base text-grayColor1 ">
            {data?.user?.profile?.address || "No address available"}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 text-sm">
        <div>
          <h4 className="text-base font-semibold text-headerColor block">
            Member Since
          </h4>
          <p className="font-medium text-grayColor1 mt-1">
            {dayjs(data?.user?.member_since || "Unknown").format(
              "MMM DD, YYYY",
            )}
          </p>
        </div>
        <div className="text-start">
          <span className="text-base text-headerColor font-semibold block mb-1.5">
            Account Type
          </span>
          <span className="inline-block bg-lightGreenColor text-primaryColor font-medium text-sm md:text-base px-3 py-1 rounded">
            {data?.subscription?.plan_name || "Basic"} Member
          </span>
        </div>
      </div>
    </div>
  );
}

export default GeneralSettingHeader;
