"use client";

import RootDialog from "@/components/reusable/RootDialog";
import { useGetSinglePublicationQuery } from "@/feature/slice/jobs/publicationSlice";
import { PdfIcon } from "@/public/svgIcons/Icons";
import dayjs from "dayjs";
import { Download, Eye, ThumbsUp, X } from "lucide-react";
import Link from "next/link";

interface PublicationViewModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  publicationId?: string | number | null;
}

export default function PublicationViewModal({
  open,
  setOpen,
  publicationId,
}: PublicationViewModalProps) {
  const { data: response, isLoading } = useGetSinglePublicationQuery(
    publicationId ?? "",
    {
      skip: !publicationId || !open,
    },
  );

  const publication = response?.data || response;

  const attachmentName = () => {
    if (publication?.attachment_name) return publication.attachment_name;
    if (publication?.attachment) {
      const filename = String(publication.attachment).split("/").pop();
      if (filename) return filename;
    }
    if (publication?.attachment_url) {
      const filename = String(publication.attachment_url)
        .split("/")
        .pop()
        ?.split("?")[0];
      if (filename) return filename;
    }
    return publication?.title
      ? `${publication.title.slice(0, 35)}.pdf`
      : "document.pdf";
  };

  const rawAbstract =
    publication?.abstract ||
    publication?.short_abstract ||
    "No abstract provided.";

  const isHtml = /<[a-z][\s\S]*>/i.test(rawAbstract);

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="sm:max-w-xl md:max-w-2xl rounded-2xl overflow-hidden p-0 h-[80vh] max-h-[88vh]"
      ariaLabel="View Publication Details"
      ariaDescription="Detailed view of selected publication"
    >
      <div className="flex h-full flex-col overflow-hidden bg-white">
        {/* 1. TOP STICKY HEADER */}
        <div className="sticky top-0 z-10 shrink-0 border-b border-borderColor/60 bg-white px-5 py-4 md:px-7 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-headerColor">
            Publication Details
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. BODY / LOADING / NOT FOUND */}
        {isLoading ? (
          <div className="flex-1 py-20 flex flex-col items-center justify-center space-y-3">
            <span className="inline-block w-8 h-8 border-3 border-primaryColor border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-descriptionColor">
              Loading publication details...
            </p>
          </div>
        ) : !publication ? (
          <div className="flex-1 py-16 flex items-center justify-center text-sm text-descriptionColor">
            Publication not found.
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 space-y-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-headerColor leading-snug">
                  {publication.title}
                </h3>
              </div>
              {publication.authors.length > 0 && (
                <p className="text-xs sm:text-sm text-descriptionColor leading-relaxed">
                  <span className="font-semibold text-headerColor">
                    Authors:
                  </span>{" "}
                  {publication.authors.join(", ")}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs sm:text-sm text-descriptionColor">
                {publication.network_type && (
                  <div>
                    <span className="font-semibold text-headerColor">
                      Network:
                    </span>{" "}
                    <span className="capitalize">
                      {publication.network_type}
                    </span>
                  </div>
                )}

                <div>
                  <span className="font-semibold text-headerColor">
                    Publication Date:
                  </span>{" "}
                  <span>
                    {publication.created_at
                      ? dayjs(publication.created_at).format("DD MMM YYYY")
                      : "05 Feb 2026"}
                  </span>
                </div>

                {publication.website_url && (
                  <div>
                    <span className="font-semibold text-headerColor">
                      Reference:
                    </span>{" "}
                    <Link
                      href={
                        publication.website_url.startsWith("http")
                          ? publication.website_url
                          : `https://${publication.website_url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00A0B0] hover:underline font-normal cursor-pointer"
                    >
                      View Reference
                    </Link>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-5 text-xs sm:text-sm text-headerColor font-medium pt-0.5">
                <div className="flex items-center gap-1.5 text-[#00A0B0]">
                  <Eye className="w-4 h-4" />
                  <span className="text-headerColor">
                    {(publication.views_count ?? 55676).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#00A0B0]">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-headerColor">
                    {(publication.likes_count ?? 475).toLocaleString()}
                  </span>
                </div>
              </div>
              <hr className="border-borderColor/60" />
              <div>
                <h4 className="text-base sm:text-lg font-bold text-headerColor mb-2.5">
                  Abstract
                </h4>
                <div className="text-xs sm:text-sm text-descriptionColor leading-relaxed">
                  {isHtml ? (
                    <div
                      className="prose prose-sm max-w-none text-descriptionColor leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: rawAbstract }}
                    />
                  ) : (
                    <p className="whitespace-pre-line">{rawAbstract}</p>
                  )}
                </div>
              </div>
            </div>

            {(publication.attachment_url || publication.attachment) && (
              <div className="sticky bottom-0 z-10 shrink-0 border-t border-borderColor/60 bg-white p-4 sm:px-7">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-[#F8FAFC] border border-gray-100 p-3 sm:p-3.5 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <PdfIcon />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-headerColor truncate max-w-xs sm:max-w-md">
                        {attachmentName()}
                      </p>
                      <p className="text-xs text-descriptionColor mt-0.5">
                        {publication?.attachment_size}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={publication.attachment_url || "#"}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00A0B0] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#008d9b] transition-colors shadow-2xs shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Now</span>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </RootDialog>
  );
}
