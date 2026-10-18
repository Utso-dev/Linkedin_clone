import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { ProIndustryIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";
import { FaCrown } from "react-icons/fa";

function SubscriptionCard() {
  const { data, isLoading, isError } = useGetUserProfileQuery("");
  const isPremium = data?.subscription?.plan_type === "premium";
  const isIndustry = data?.subscription?.plan_type === "industry";

  const planName = data?.subscription?.plan_name;

  return (
    <div
      className={`${isIndustry ? "border-[#F9C80E]/20 bg-[#C2B32A]" : isPremium ? "border-[#04A1B7]/20 bg-[#04A1B7]" : "border-primaryColor/20 bg-primaryColor"} flex flex-col justify-center gap-1 rounded-xl border p-3 text-center shadow-sm md:p-4`}
    >
      {isIndustry || isPremium ? (
        <div>
          <div className="flex items-center text-whiteColor justify-center gap-2 pb-2">
            {isIndustry ? (
              <ProIndustryIcon className="w-6 h-6" />
            ) : (
              <FaCrown size={24} />
            )}
            <span className="font-bold text-whiteColor tracking-wide">
              {planName}
            </span>
          </div>
          <p className="text-sm text-whiteColor">
            Experience with {data?.subscription?.plan_type} features.
          </p>
        </div>
      ) : (
        <div>
          <h3 className="text-lg text-whiteColor font-semibold">
            Subscription{" "}
          </h3>
          <p className="text-sm text-whiteColor">
            Try your experience for using more features
          </p>
        </div>
      )}

      {!data?.subscription?.is_subscribed && (
        <Link
          href="/mu/subscription?billing=monthly"
          className={`text-sm  bg-whiteColor font-semibold px-4 py-3 rounded-md mt-2  text-primaryColor `}
        >
          {"Upgrade Now"}
        </Link>
      )}
    </div>
  );
}

export default SubscriptionCard;
