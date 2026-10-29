"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import RootDialog from "@/components/reusable/RootDialog";
import {
  useGetAdvertisemetDetailsQuery,
  useGetAdvertisemetEditeQuery,
} from "@/feature/slice/jobs/advertisementSlice";
import dayjs from "dayjs";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AdvertismentViewModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  adId?: string | number | null;
  is_owner?: boolean;
}

export default function AdvertismentViewModal({
  open,
  setOpen,
  adId,
  is_owner,
}: AdvertismentViewModalProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    setIsDescriptionExpanded(false);
  }, [adId, open]);

  const { data: response, isLoading } = !is_owner
    ? useGetAdvertisemetDetailsQuery(adId, {
        skip: !adId || !open,
      })
    : useGetAdvertisemetEditeQuery(adId, {
        skip: !adId || !open,
      });

  const ad = response?.data || response;

  const imageSrc = ad?.image_url;


  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="sm:max-w-2xl md:max-w-3xl rounded-2xl overflow-hidden p-0 max-h-[92vh]"
      ariaLabel="View Product Advertisement"
      ariaDescription="Detailed view of product advertisement"
    >
      <div className="flex max-h-[90vh] flex-col overflow-hidden">
        {/* Header Title */}
        <div className="sticky top-0 z-10 shrink-0 border-b flex justify-between items-center border-borderColor/60 bg-white px-5 py-4 md:px-7">
          <h2 className="text-lg md:text-xl font-bold text-headerColor">
            View Product
          </h2>
          <ButtonReuseable
            type="button"
            onClick={() => setOpen(false)}
            icon={<X size={20} />}
            className="w-10 h-10 p-0! rounded-full bg-transparent! text-descriptionColor! shadow-none! hover:bg-bgColor transition-colors "
          />
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-7">
          <div className="space-y-6">
            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-3">
                <span className="inline-block w-8 h-8 border-3 border-primaryColor border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-descriptionColor">
                  Loading advertisement details...
                </p>
              </div>
            ) : ad ? (
              <>
                {/* Top Product Summary Card */}
                <div className="grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)]">
                  {/* Product Image */}
                  <div className="relative aspect-5/4 overflow-hidden rounded-lg border border-borderColor/60 bg-bgLightColor sm:aspect-auto sm:min-h-60">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={ad.product_name || "Product"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 200px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-descriptionColor">
                        {(ad.product_name || "P").charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex min-w-0 flex-col justify-between gap-5 rounded-lg border border-borderColor bg-bgLightColor p-4 md:p-5">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="min-w-0 wrap-break-word text-lg font-semibold leading-tight text-headerColor md:text-xl">
                          {ad.product_name || "Product Name"}
                        </h3>
                        <span className="inline-flex shrink-0 items-center rounded-full border border-lightGreenColor2/30 bg-lightGreenColor2/10 px-3 py-1 text-xs font-semibold capitalize text-lightGreenColor2">
                          {ad.status || "Active"}
                        </span>
                      </div>

                      {/* Attributes */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                          ["Network Type", ad.network_type],
                          ["Industry Type", ad.industry_type],
                          ["Section", ad.section_name || ad.section?.name],
                          ["Category", ad.category_name || ad.category?.name],
                        ].map(([label, value]) => (
                          <div key={label} className="min-w-0">
                            <p className="text-xs text-grayColor1">{label}</p>
                            <p className="mt-0.5 truncate text-sm font-semibold capitalize text-descriptionColor">
                              {value || "N/A"}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs  text-grayColor1">
                        Published{" "}
                        <span className="font-medium text-descriptionColor">
                          {dayjs(ad.created_at).format(
                            "DD MMM YYYY, hh:mm A",
                          ) || "N/A"}
                        </span>
                      </p>
                    </div>

                    {/* View, Like, Published On */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-borderColor/60 pt-3 text-sm text-descriptionColor">
                      <div className="flex items-center gap-4">
                        <p>
                          <span className="text-grayColor1">Total Views</span>{" "}
                          <span className="font-semibold text-descriptionColor">
                            {(ad.views_count ?? 0).toLocaleString()}
                          </span>
                        </p>
                        {is_owner && (
                          <p>
                            <span className="text-grayColor1">
                              Unique Views
                            </span>{" "}
                            <span className="font-semibold text-descriptionColor">
                              {(ad.unique_views_count ?? 0).toLocaleString()}
                            </span>
                          </p>
                        )}

                        <p>
                          <span className="text-grayColor1">Likes</span>{" "}
                          <span className="font-semibold text-descriptionColor">
                            {(ad.likes_count ?? 0).toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-1.5 rounded-lg border border-borderColor bg-bgLightColor p-4">
                  <h4 className="text-base md:text-lg font-semibold text-headerColor tracking-wider">
                    Description
                  </h4>
                  {ad.description && (
                    <>
                      <div
                        className={`text-xs md:text-sm text-descriptionColor prose prose-sm max-w-none leading-[160%] ${isDescriptionExpanded ? "" : "line-clamp-4 overflow-hidden"}`}
                        dangerouslySetInnerHTML={{ __html: ad.description }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setIsDescriptionExpanded((expanded) => !expanded)
                        }
                        className="mt-1 cursor-pointer text-sm font-semibold text-primaryColor hover:underline"
                      >
                        {isDescriptionExpanded ? "See less" : "See more"}
                      </button>
                    </>
                  )}
                </div>

                {/* Product URL */}
                <div className="space-y-1">
                  <h4 className="text-sm md:text-base font-semibold text-descriptionColor">
                    Product Link
                  </h4>
                  {ad.product_url ? (
                    <a
                      href={
                        ad.product_url.startsWith("http")
                          ? ad.product_url
                          : `https://${ad.product_url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primaryColor hover:underline text-xs md:text-sm font-medium break-all block"
                    >
                      {ad.product_url}
                    </a>
                  ) : (
                    <p className="text-xs md:text-sm text-grayColor1">N/A</p>
                  )}
                </div>

                {/* Product Tags */}
                {ad?.tags?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm md:text-base font-semibold text-descriptionColor  ">
                      Product Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {ad?.tags.map((tag: string, index: number) => (
                        <span
                          key={`${tag}-${index}`}
                          className="inline-block px-3 py-1 rounded-full border leading-[140%] border-borderColor bg-bgLightColor text-sm text-descriptionColor font-normal"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Person of Contact */}
                <div className="space-y-4 pt-1">
                  <h4 className="text-sm md:text-base font-semibold text-descriptionColor">
                    Person of Contact
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3 md:gap-4">
                    <div className="min-w-0 rounded-lg border border-borderColor bg-bgLightColor p-4">
                      <p className="font-semibold text-descriptionColor">
                        Name
                      </p>
                      <p className="mt-2 truncate text-descriptionColor">
                        {ad.poc_name ||
                          ad.contact_name ||
                          ad.creator?.name ||
                          "N/A"}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-lg border border-borderColor bg-bgLightColor p-4">
                      <p className="font-semibold text-descriptionColor">
                        Email
                      </p>
                      <p className="mt-2 truncate text-descriptionColor">
                        {ad.poc_email || ad.contact_email || "N/A"}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-lg border border-borderColor bg-bgLightColor p-4">
                      <p className="font-semibold text-descriptionColor">
                        Phone Number
                      </p>
                      <p className="mt-2 truncate text-descriptionColor">
                        {ad.poc_phone || ad.contact_phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-sm text-gray-500">
                No details found for this advertisement.
              </div>
            )}
          </div>
        </div>
      </div>
    </RootDialog>
  );
}
