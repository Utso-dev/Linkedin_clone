"use client";

import { useLikeSinglePublicationMutation } from "@/feature/slice/jobs/publicationSlice";
import { cn } from "@/lib/utils";
import { LikeIcon, OpenEyeIcon, PdfIcon } from "@/public/svgIcons/Icons";
import dayjs from "dayjs";
import { Download } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

interface PublicationsDetailsProps {
  publication: any;
}

export default function PublicationsDetails({
  publication,
}: PublicationsDetailsProps) {
  const pathname = usePathname();
  const [likeSinglePublication, { isLoading: isLiking }] =
    useLikeSinglePublicationMutation();

  const [isLiked, setIsLiked] = useState<boolean>(false);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleLike = async () => {
    if (!publication?.id) return;

    try {
      const res = await likeSinglePublication(publication.id).unwrap();
    } catch (error) {
      console.error("Failed to like publication:", error);
    }
  };


  const attachmentUrl =
    publication?.attachment_url || publication?.attachment || "#";

  const rawAbstract =
    publication?.abstract ||
    publication?.short_abstract ||
    "No abstract provided.";

  const isHtml = /<[a-z][\s\S]*>/i.test(rawAbstract);

  const paragraphs = useMemo(() => {
    if (isHtml) return [];
    return rawAbstract
      .split(/\r?\n+/)
      .map((p: string) => p.trim())
      .filter(Boolean);
  }, [rawAbstract, isHtml]);

  const isLongAbstract = isHtml
    ? rawAbstract.length > 400
    : paragraphs.length > 2 || rawAbstract.length > 450;

  if (!publication) return null;

  return (
    <div className="w-full bg-white rounded-xl sm:rounded-2xl border border-borderColor/60 p-3 md:p-4 lg:p-6 my-4 shadow-xs">
      {/* 1. Header Section */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-headerColor">
          Publications for{" "}
          {pathname.includes("psychology") ? "Psychology" : "Neuroscience"}{" "}
          Networks
        </h1>
        <p className="text-xs sm:text-sm text-descriptionColor mt-1">
          Explore the latest publications and advancing brain health research
          and treatment.
        </p>
      </div>

      <hr className="border-borderColor/60 my-5 sm:my-6" />

      {/* 2. Publication Title & Authors */}
      <h2 className="text-2xl sm:text-3xl font-bold text-headerColor leading-tight mb-3">
        {publication.title}
      </h2>

      {publication?.authors?.length > 0 && (
        <p className="text-xs sm:text-sm text-descriptionColor leading-relaxed mb-4">
          <span className="font-semibold text-headerColor">Authors: </span>
          <span>{publication?.authors.join(", ")}</span>
        </p>
      )}

      {/* 3. Metadata Row (Network, Date, Reference) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-2 text-xs sm:text-sm mb-6">
        <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-1.5 text-descriptionColor">
          <div>
            <span className="font-semibold text-headerColor">Network: </span>
            <span className="capitalize text-descriptionColor">
              {publication.network_type || "Neuroscience"}
            </span>
          </div>

          <div>
            <span className="font-semibold text-headerColor">
              Publication Date:{" "}
            </span>
            <span className="text-descriptionColor">
              {publication.created_at || publication.publication_date
                ? dayjs(
                    publication.created_at || publication.publication_date,
                  ).format("DD MMM YYYY")
                : "05 Feb 2026"}
            </span>
          </div>
        </div>

        <div>
          <span className="font-semibold text-headerColor">Reference: </span>
          <Link
            href={
              publication.website_url
                ? publication.website_url.startsWith("http")
                  ? publication.website_url
                  : `https://${publication.website_url}`
                : "#"
            }
            target={publication.website_url ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="text-primaryColor hover:underline font-normal cursor-pointer"
          >
            View Reference
          </Link>
        </div>
      </div>

      <hr className="border-borderColor/60 mb-6" />

      {/* 4. Abstract Section */}
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-headerColor mb-3.5">
          Abstract
        </h3>

        {isHtml ? (
          <div className="relative">
            <div
              className={cn(
                "prose prose-sm max-w-none text-descriptionColor leading-relaxed text-xs sm:text-sm",
                !isExpanded && isLongAbstract && "line-clamp-6",
              )}
              dangerouslySetInnerHTML={{ __html: rawAbstract }}
            />
            {isLongAbstract && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primaryColor hover:underline text-xs sm:text-sm font-medium mt-2 inline-block cursor-pointer"
              >
                {isExpanded ? "Show Less" : "Show More..."}
              </button>
            )}
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-descriptionColor leading-relaxed space-y-4">
            {isExpanded || !isLongAbstract ? (
              <>
                {paragraphs.map((para: string, idx: number) => (
                  <p key={idx}>
                    {para}
                    {idx === paragraphs.length - 1 && isLongAbstract && (
                      <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="text-primaryColor hover:underline font-medium ml-1 cursor-pointer"
                      >
                        Show Less
                      </button>
                    )}
                  </p>
                ))}
              </>
            ) : (
              <>
                {paragraphs.slice(0, 2).map((para: string, idx: number) => (
                  <p key={idx}>
                    {para}
                    {idx === 1 && (
                      <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        className="text-primaryColor hover:underline font-medium ml-1 cursor-pointer"
                      >
                        Show More...
                      </button>
                    )}
                  </p>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* 5. Attachment / PDF Download Card */}
      <div className="rounded-xl sm:rounded-2xl bg-[#F8FAFC] border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6 sm:my-8">
        <div className="flex items-center gap-3.5 min-w-0">
          <PdfIcon />
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-semibold text-headerColor truncate max-w-xs sm:max-w-md md:max-w-lg">
              {`${publication?.title}.${publication?.file_extension}` || "New wearable scanner a game-changer.pdf"}
            </p>
            <p className="text-xs sm:text-sm text-descriptionColor mt-0.5">
              {publication?.attachmentSize}
            </p>
          </div>
        </div>

        <Link
          href={attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primaryColor px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#03899c] transition-colors shadow-2xs shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Download Now</span>
        </Link>
      </div>

      <hr className="border-borderColor/60 my-5" />

      {/* 6. Footer Section (Like Button & Views Count) */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          disabled={isLiking}
          onClick={handleLike}
          className="flex items-center gap-2 cursor-pointer transition active:scale-95 disabled:opacity-60"
          title={publication?.is_liked ? "Unlike" : "Like"}
        >
          <LikeIcon
            className={`w-5 h-5 ${
              publication?.is_liked
                ? "text-primaryColor fill-primaryColor"
                : "text-grayColor1"
            }`}
          />
          <span
            className={`text-sm sm:text-base font-semibold ${
              publication?.is_liked ? "text-primaryColor" : "text-grayColor1"
            }`}
          >
            {publication?.likes_count}
          </span>
        </button>

        <div className="flex items-center gap-2 text-descriptionColor text-sm sm:text-base">
          <OpenEyeIcon className="w-4.5 h-4.5 text-descriptionColor shrink-0" />
          <span>
            {(publication?.views_count ?? 5623).toLocaleString()} Views
          </span>
        </div>
      </div>
    </div>
  );
}
