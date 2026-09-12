import Link from "next/link";

function SubscriptionCard() {
  return (
    <div className="bg-primaryColor  flex flex-col justify-center text-center gap-1 rounded-2xl md:p-4 p-3">
      <h3 className="text-lg text-whiteColor font-semibold">Subscription </h3>
      <p className="text-sm text-whiteColor">
        Try your experience for using more features
      </p>
      <Link
        href="/mu/subscription"
        className="text-sm font-semibold px-4 py-3 rounded-md mt-2 bg-whiteColor text-primaryColor "
      >
        Upgrade Now
      </Link>
    </div>
  );
}

export default SubscriptionCard;
