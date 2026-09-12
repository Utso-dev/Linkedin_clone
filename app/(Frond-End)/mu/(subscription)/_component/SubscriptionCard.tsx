import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import Link from "next/link";

function SubscriptionCard() {
  const { data, isLoading, isError } = useGetUserProfileQuery("");
  const isSubscribed = data?.subscription?.is_subscribed;
  const planName = data?.subscription?.plan_name;

  return (
    <div className="bg-primaryColor  flex flex-col justify-center text-center gap-1 rounded-2xl md:p-4 p-3">
      <h3 className="text-lg text-whiteColor font-semibold">Subscription </h3>
      {isSubscribed ? (
        <div>
          <div className=" bg-white/10 border border-white/20 px-4 py-1.5 rounded-full">
            <div className="flex items-center gap-2 justify-center">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <p className="text-sm text-whiteColor">Active Plan </p>
            </div>
            <span className="font-bold text-whiteColor tracking-wide">
              {planName}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-whiteColor">
          Try your experience for using more features
        </p>
      )}

      {isSubscribed ? (
        <div
          className={`text-sm  bg-whiteColor/80 cursor-not-allowed  font-semibold px-4 py-3 rounded-md mt-2  text-primaryColor `}
        >
          {"Active"}
        </div>
      ) : (
        <Link
          href="/mu/subscription"
          className={`text-sm  bg-whiteColor font-semibold px-4 py-3 rounded-md mt-2  text-primaryColor `}
        >
          {"Upgrade Now"}
        </Link>
      )}
    </div>
  );
}

export default SubscriptionCard;
