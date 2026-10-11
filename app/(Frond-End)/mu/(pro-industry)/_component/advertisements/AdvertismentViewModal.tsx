"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import RootDialog from "@/components/reusable/RootDialog";
import { useGetAdvertisemetEditeQuery } from "@/feature/slice/jobs/advertisementSlice";
import dayjs from "dayjs";
import { X } from "lucide-react";
import Image from "next/image";

interface AdvertismentViewModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  adId?: string | number | null;
}

export default function AdvertismentViewModal({
  open,
  setOpen,
  adId,
}: AdvertismentViewModalProps) {
  const { data: response, isLoading } = useGetAdvertisemetEditeQuery(adId, {
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
                      icon={<X size={20}/>}
                      
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
            <div className=" flex flex-col sm:flex-row gap-3">
              {/* Product Image */}
              <div className="w-full sm:w-48 h-44 sm:h-auto rounded-xl bg-gray-100 overflow-hidden relative shrink-0 border border-borderColor/60 flex items-center justify-center">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={ad.product_name || "Product"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-descriptionColor font-bold text-2xl">
                    {(ad.product_name || "P").charAt(0)}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 bg-bgLightColor p-3 rounded-xl flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base md:text-lg font-semibold text-descriptionColor leading-tight">
                      {ad.product_name || "Product Name"}
                    </h3>
                    <span className="inline-flex items-center gap-1 leading-[130%] text-sm font-medium px-2.5 py-0.5 rounded-sm capitalize shrink-0 bg-lightGreenColor2/10 text-lightGreenColor2 border border-lightGreenColor2/30">
                      + {ad.status || "Active"}
                    </span>
                  </div>

                  {/* Attributes */}
                  <div className="mt-2.5 space-y-1 text-xs md:text-sm text-grayColor1">
                    <p>
                      <span className="">Network Type: </span>
                      <span className=" font-semibold capitalize">
                        {ad.network_type || "N/A"}
                      </span>
                    </p>
                    <p>
                      <span className="">Industry Type : </span>
                      <span className="font-semibold capitalize">
                        {ad.industry_type || "N/A"}
                      </span>
                    </p>
                    <p>
                      <span className="">Section: </span>
                      <span className="font-semibold capitalize">
                        {ad.section_name || ad.section?.name || "N/A"}
                      </span>
                    </p>
                    <p>
                      <span className="">Category : </span>
                      <span className="font-semibold capitalize">
                        {ad.category_name || ad.category?.name || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* View, Like, Published On */}
                <div className="pt-2 border-t border-borderColor/60 flex flex-wrap items-center justify-between gap-2 text-sm text-descriptionColor">
                  <div className="flex items-center gap-3">
                    <p>
                      View:{" "}
                      <span className="font-semibold">
                        {(ad.views_count ?? 0).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      Like:{" "}
                      <span className=" font-semibold">
                        {(ad.likes_count ?? 0).toLocaleString()}
                      </span>
                    </p>
                  </div>

                  <p>
                    Published on:{" "}
                    <span className=" font-semibold">
                      {dayjs(ad.created_at).format("DD MMM YYYY, hh:mm A") ||
                        "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-1.5">
              <h4 className="text-sm md:text-base font-semibold text-descriptionColor tracking-wider">
                Description
              </h4>
              {ad.short_description && (
                <h5 className="text-sm md:text-base lg:text-lg font-semibold text-headerColor leading-[160%]">
                  {ad.short_description}
                </h5>
              )}
              {ad.description && (
                <div
                  className="text-xs md:text-sm text-descriptionColor prose prose-sm max-w-none leading-[160%]"
                  dangerouslySetInnerHTML={{ __html: ad.description }}
                />
              )}
            </div>

            {/* Product URL */}
            <div className="space-y-4">
              <h4 className="text-sm md:text-base font-semibold text-descriptionColor  ">
                Product URL *
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
              <div className="grid grid-cols-1 text-sm md:text-base sm:grid-cols-3 gap-3 md:gap-4">
                <div>
                  <p className=" font-semibold text-descriptionColor">Name</p>
                  <p className="  text-descriptionColor mt-4 truncate">
                    {ad.poc_name ||
                      ad.contact_name ||
                      ad.creator?.name ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-descriptionColor ">Email</p>
                  <p className=" text-descriptionColor mt-4 truncate">
                    {ad.poc_email || ad.contact_email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className=" text-descriptionColor font-semibold">
                    Phone Number
                  </p>
                  <p className="  text-descriptionColor mt-4 truncate">
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
