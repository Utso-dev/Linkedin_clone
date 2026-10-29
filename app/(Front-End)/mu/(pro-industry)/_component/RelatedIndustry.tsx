import { fetchWrapper } from "@/src/utils/fetchWrapper";
import Image from "next/image";
import { GrLocation } from "react-icons/gr";
import RelatedIndustryFollowButton from "./RelatedIndustryFollowButton";
import Link from "next/link";

type RelatedIndustryProps = {
  industryId: string;
};

type RelatedIndustryItem = {
  id: number;
  name: string;
  industry?: string;
  tagline?: string;
  address?: string;
  logo?: string | null;
  followers_count?: number;
  is_following?: boolean;
};

export default async function RelatedIndustry({
  industryId,
}: RelatedIndustryProps) {
  let response: { data?: RelatedIndustryItem[] } = { data: [] };

  try {
    response = await fetchWrapper(
      `/industry/${industryId}/related?per_page=5`,
      {
        next: { tags: ["related-industries"] },
      },
    );
  } catch (error) {
    console.error("RelatedIndustry server fetch error:", error);
  }

  const industries = response?.data || [];

  if (industries.length === 0) return null;

  return (
    <section className=" rounded-xl border border-borderColor bg-white px-3 py-3">
      <h2 className="lg:text-xl text-base  font-semibold text-headerColor">
        Related Industry picks for you
      </h2>
      <p className="mt-2 text-sm leading-5 text-grayColor1">
        Explore relevant Industry openings across similar sectors.
      </p>

      <div className="mt-4 border-t border-borderColor">
        {industries.map((industry) => (
          <article
            key={industry.id}
            className="border-b border-borderColor py-4 last:border-b-0"
          >
            <Link href={`/mu/industry/${industry.id}`} className="flex items-center gap-2">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#1D1F2C]">
                <Image
                  src={industry.logo || "/empty_user.jpg"}
                  alt={industry.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-headerColor">
                  {industry.name}
                </h3>
                <p className="truncate text-sm capitalize text-grayColor1">
                  {industry.industry || "Industry"}
                </p>
                <p className="truncate text-sm text-grayColor1">
                  {industry.tagline || "Tagline unavailable"}
                </p>
              </div>
            </Link>

            <div className="mt-3 flex items-center gap-1 text-sm text-grayColor1">
              <GrLocation className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {industry.address || "Location unavailable"} • Followers{" "}
                {industry.followers_count ?? 0}
              </span>
            </div>

            <RelatedIndustryFollowButton
              industryId={industry.id}
              initialFollowing={Boolean(industry.is_following)}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
