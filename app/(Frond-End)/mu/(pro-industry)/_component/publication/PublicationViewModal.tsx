"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import RootDialog from "@/components/reusable/RootDialog";
import { useGetSinglePublicationQuery } from "@/feature/slice/jobs/publicationSlice";
import dayjs from "dayjs";
import { ArrowUpRight, Calendar, Download, Eye, FileText, Heart, Globe, User, X } from "lucide-react";
import Image from "next/image";

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

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="sm:max-w-2xl md:max-w-3xl rounded-2xl overflow-hidden p-0 max-h-[92vh]"
      ariaLabel="View Publication Details"
      ariaDescription="Detailed view of selected publication"
    >
      <div className="flex max-h-[90vh] flex-col overflow-hidden bg-white">
        {/* Header Title */}
        <div className="sticky top-0 z-10 shrink-0 border-b flex justify-between items-center border-borderColor/60 bg-white px-5 py-4 md:px-7">
          <h2 className="text-lg md:text-xl font-bold text-headerColor">
            Publication Details
          </h2>
          <ButtonReuseable
            type="button"
            onClick={() => setOpen(false)}
            icon={<X size={20} />}
            className="w-10 h-10 p-0! rounded-full bg-transparent! text-descriptionColor! shadow-none! hover:bg-bgColor transition-colors"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-7">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <span className="inline-block w-8 h-8 border-3 border-primaryColor border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-descriptionColor">
                Loading publication details...
              </p>
            </div>
          ) : !publication ? (
            <div className="py-12 text-center text-sm text-descriptionColor">
              Publication not found.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Badges & ID */}
              <div className="flex flex-wrap items-center gap-2">
                {publication.publication_id && (
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-gray-100 text-gray-700">
                    ID: {publication.publication_id}
                  </span>
                )}
                {publication.network_type && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFF4ED] text-[#FF6A55] border border-[#FF6A55]/30 capitalize">
                    {publication.network_type}
                  </span>
                )}
                {publication.publication_type && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E6F8F6] text-primaryColor border border-primaryColor/30 capitalize">
                    {publication.publication_type}
                  </span>
                )}
                {publication.status && (
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                      publication.status === "active"
                        ? "bg-[#E6F8F6] text-[#25C86D]"
                        : publication.status === "inactive"
                          ? "bg-[#FEECEC] text-[#EB3D4D]"
                          : "bg-[#FEF6E6] text-[#E59800]"
                    }`}
                  >
                    • {publication.status}
                  </span>
                )}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-headerColor leading-snug">
                  {publication.title}
                </h1>
                {publication.created_at && (
                  <div className="flex items-center gap-1.5 text-xs text-descriptionColor mt-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Published on{" "}
                      {dayjs(publication.created_at).format("DD MMMM, YYYY")}
                    </span>
                  </div>
                )}
              </div>

              {/* Authors */}
              {Array.isArray(publication.authors) && publication.authors.length > 0 && (
                <div className="bg-bgColor/50 rounded-xl p-4 border border-borderColor/60">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-grayColor1 mb-2">
                    Authors
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {publication.authors.map((author: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-white border border-borderColor/80 rounded-md px-3 py-1 text-xs font-medium text-headerColor shadow-2xs"
                      >
                        <User className="w-3.5 h-3.5 text-primaryColor" />
                        <span>{author}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Abstract */}
              <div>
                <h4 className="text-sm font-bold text-headerColor mb-2">
                  Abstract
                </h4>
                <div className="text-sm text-descriptionColor leading-relaxed bg-white rounded-xl border border-borderColor/60 p-4">
                  {/<[a-z][\s\S]*>/i.test(publication.abstract || "") ? (
                    <div
                      className="prose prose-sm max-w-none text-descriptionColor leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: publication.abstract,
                      }}
                    />
                  ) : (
                    <p className="whitespace-pre-line">
                      {publication.abstract ||
                        publication.short_abstract ||
                        "No abstract provided."}
                    </p>
                  )}
                </div>
              </div>

              {/* References & Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {publication.website_url && (
                  <a
                    href={publication.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl border border-borderColor hover:border-primaryColor bg-white hover:bg-bgColor transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-headerColor group-hover:text-primaryColor transition-colors">
                          Official Article Website
                        </p>
                        <p className="text-xs text-descriptionColor truncate">
                          {publication.website_url}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-primaryColor shrink-0 ml-2" />
                  </a>
                )}

                {publication.attachment_url && (
                  <a
                    href={publication.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl border border-borderColor hover:border-primaryColor bg-white hover:bg-bgColor transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-primaryColor/10 text-primaryColor flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-headerColor group-hover:text-primaryColor transition-colors">
                          Attachment Document (PDF)
                        </p>
                        <p className="text-xs text-descriptionColor">
                          Click to view or download
                        </p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-primaryColor shrink-0 ml-2" />
                  </a>
                )}
              </div>

              {/* Stats Footer */}
              <div className="flex items-center justify-between border-t border-borderColor/60 pt-4 text-xs font-medium text-descriptionColor">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-primaryColor" />
                    <span>{(publication.views_count ?? 0).toLocaleString()} Views</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-redColor" />
                    <span>{(publication.likes_count ?? 0).toLocaleString()} Likes</span>
                  </span>
                </div>

                {publication.creator && (
                  <div className="flex items-center gap-2">
                    {publication.creator.profile_image && (
                      <Image
                        src={publication.creator.profile_image}
                        alt={publication.creator.name || "Creator"}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    <span>{publication.creator.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </RootDialog>
  );
}
