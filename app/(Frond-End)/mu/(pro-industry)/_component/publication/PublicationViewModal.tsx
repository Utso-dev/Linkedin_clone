"use client";

import RootDialog from "@/components/reusable/RootDialog";
import { useGetSinglePublicationQuery } from "@/feature/slice/jobs/publicationSlice";
import dayjs from "dayjs";
import { Download, Eye, ThumbsUp, X } from "lucide-react";
import { useMemo } from "react";

interface PublicationViewModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  publicationId?: string | number | null;
}

function PdfIcon() {
  return (
    <div className="relative w-10 h-12 shrink-0 flex items-center justify-center select-none">
      <svg
        viewBox="0 0 38 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xs"
      >
        {/* Document sheet */}
        <path
          d="M0 4C0 1.79086 1.79086 0 4 0H24L38 14V42C38 44.2091 36.2091 46 34 46H4C1.79086 46 0 44.2091 0 42V4Z"
          fill="#ECEFF1"
        />
        {/* Folded corner */}
        <path
          d="M24 0L38 14H28C25.7909 14 24 12.2091 24 10V0Z"
          fill="#CFD8DC"
        />
        {/* Red PDF banner */}
        <rect x="2" y="27" width="22" height="12" rx="2" fill="#E53935" />
        <text
          x="13"
          y="36"
          fill="white"
          fontSize="7"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
        >
          PDF
        </text>
      </svg>
    </div>
  );
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

  const authorsList = useMemo(() => {
    if (!publication?.authors) return [];
    if (Array.isArray(publication.authors)) return publication.authors;
    if (typeof publication.authors === "string") {
      try {
        const parsed = JSON.parse(publication.authors);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [publication.authors];
      }
    }
    return [];
  }, [publication?.authors]);

  const attachmentName = useMemo(() => {
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
  }, [publication]);

  const attachmentSize = useMemo(() => {
    if (publication?.attachment_size) {
      const bytes = Number(publication.attachment_size);
      if (!isNaN(bytes) && bytes > 0) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
      }
      return String(publication.attachment_size);
    }
    return "450KB";
  }, [publication?.attachment_size]);

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
            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 space-y-4">
              {/* Title + Status */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-headerColor leading-snug">
                  {publication.title}
                </h3>
              </div>

              {/* Authors */}
              {authorsList.length > 0 && (
                <p className="text-xs sm:text-sm text-descriptionColor leading-relaxed">
                  <span className="font-semibold text-headerColor">
                    Authors:
                  </span>{" "}
                  {authorsList.join(", ")}
                </p>
              )}

              {/* Network, Date, Reference */}
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
                    <a
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
                    </a>
                  </div>
                )}
              </div>

              {/* Stats: Views & Likes */}
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

              {/* Divider */}
              <hr className="border-borderColor/60" />

              {/* Abstract */}
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

            {/* 3. BOTTOM STICKY FOOTER (Attachment Download Card) */}
            {(publication.attachment_url || publication.attachment) && (
              <div className="sticky bottom-0 z-10 shrink-0 border-t border-borderColor/60 bg-white p-4 sm:px-7">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-[#F8FAFC] border border-gray-100 p-3 sm:p-3.5 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <PdfIcon />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-headerColor truncate max-w-xs sm:max-w-md">
                        {attachmentName}
                      </p>
                      <p className="text-xs text-descriptionColor mt-0.5">
                        {attachmentSize}
                      </p>
                    </div>
                  </div>

                  <a
                    href={publication.attachment_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00A0B0] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#008d9b] transition-colors shadow-2xs shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Now</span>
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </RootDialog>
  );
}
