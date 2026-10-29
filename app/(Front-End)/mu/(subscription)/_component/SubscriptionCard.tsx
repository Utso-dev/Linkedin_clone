import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import Image from "next/image";
import Link from "next/link";
import { FaCrown } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi2";

function SubscriptionCard() {
  const { data } = useGetUserProfileQuery("");
  const isPremium = data?.subscription?.plan_type === "premium";
  const isIndustry = data?.subscription?.plan_type === "industry";

  const planName = data?.subscription?.plan_name;
  const industry = data?.industry;
  const company = industry?.company;
  const companyName = company?.name || industry?.name || "Your company";
  const companyTagline =
    company?.company_tag ||
    company?.tagline ||
    industry?.company_tag ||
    industry?.tagline ||
    companyName;
  const hasCompany =
    industry?.has_company === true ||
    industry?.has_company === "true" ||
    Boolean(company);
  const canCreateCompany =
    !hasCompany &&
    (industry?.can_create_company_page === true ||
      industry?.can_create_company_page === "true");

  if (isIndustry) {
    return (
      <div className="w-full min-w-0 overflow-hidden rounded-xl border border-[#D9D5B0] bg-white text-sm shadow-sm transition-shadow hover:shadow-md">
        <div className="p-3">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-proIdustryColor/70 ring-offset-2">
              {company?.logo || industry?.logo ? (
                <Image
                  src={company?.logo || industry?.logo}
                  alt={`${companyName} logo`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-semibold text-proIdustryColor">
                  {companyName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 line-clamp-1 text-sm font-semibold text-headerColor">
                {companyName}
              </p>
              <h3 className="line-clamp-1 leading-tight text-grayColor1">
                {companyTagline}
              </h3>
            </div>
          </div>
          <div className="mt-3 border-t border-[#ECE9D8] pt-2.5">
            <div className="flex items-center justify-between gap-2">
              {hasCompany && (
                <div className="flex items-center gap-1.5 text-grayColor1">
                  <HiOutlineUsers className="h-4 w-4 text-proIdustryColor" />
                  <span className="font-semibold text-headerColor">
                    {Number(
                      industry?.total_followers ?? industry?.followers_count ?? 0,
                    ).toLocaleString()}
                  </span>
                  <span>followers</span>
                </div>
              )}
              <Link
                href={canCreateCompany ? "/mu/create-company-page/" : "/mu/recruiter-dashboard"}
                className={`rounded-lg px-3 py-2 text-center font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-proIdustryColor focus-visible:ring-offset-2 ${canCreateCompany ? "w-full bg-[#C2B32A] text-white shadow-sm hover:bg-[#AFA21E]" : "text-[#BB960B] hover:bg-[#BB960B]/10"}`}
              >
                {canCreateCompany ? "Create Company" : "Dashboard"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${isPremium ? "border-primaryColor/20 bg-primaryColor" : "border-primaryColor/20 bg-primaryColor"} flex flex-col justify-center gap-1 rounded-xl border p-3 text-center text-sm shadow-sm md:p-4`}
    >
      {isPremium ? (
        <div>
          <div className="flex items-center text-whiteColor justify-center gap-2 pb-2">
            <FaCrown size={24} />
            <span className="text-sm font-bold tracking-wide text-whiteColor">
              {planName}
            </span>
          </div>
          <p className="text-sm text-whiteColor">
            Experience with {data?.subscription?.plan_type} features.
          </p>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-whiteColor">
            Subscription{" "}
          </h3>
          <p className="text-sm leading-5 text-white/90">
            Try your experience for using more features
          </p>
        </div>
      )}

      {!data?.subscription?.is_subscribed && (
        <Link
          href="/mu/subscription?billing=monthly"
          className={`mt-2 rounded-md bg-whiteColor px-4 py-3 font-semibold text-primaryColor`}
        >
          {"Upgrade Now"}
        </Link>
      )}
    </div>
  );
}

export default SubscriptionCard;
