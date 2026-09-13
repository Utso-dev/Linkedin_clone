import SubscriptionSkeleton from "../_component/SubscriptionSkeleton";

export default function Loading() {
  return (
    <div className="my-14 md:my-20">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-headerColor text-center">
          Choose your subscription plan
        </h1>
      </div>
      <SubscriptionSkeleton />
    </div>
  );
}
