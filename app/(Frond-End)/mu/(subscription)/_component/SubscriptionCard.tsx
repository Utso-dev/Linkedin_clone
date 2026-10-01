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
      className={`${isIndustry ? "bg-[#B7A504]" : isPremium ? "bg-primaryColor" : "bg-primaryColor"}  flex flex-col justify-center text-center gap-1 rounded-2xl md:p-4 p-3`}
    >
      {isIndustry || isPremium ? (
        <div>
          <div className="flex items-center text-whiteColor justify-center gap-2 pb-2">
            {isIndustry ? (
              <FaCrown size={24} />
            ) : (
              <ProIndustryIcon className="w-6 h-6" />
            )}
            <span className="font-bold text-whiteColor tracking-wide">
              {planName}
            </span>
          </div>
          <p className="text-sm text-whiteColor">
            Your’e experiencing {data?.subscription?.plan_type} subscription.
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
