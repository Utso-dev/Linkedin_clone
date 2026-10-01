"use client";
import ProfileHeroSkeleton from "@/components/reusable/All Skleton/ProfileHeroSkeleton";
import { useGetCompanyQuery } from "@/feature/slice/companySlice";
import logoPreview from "@/public/empty_user.jpg";
import coverPreview from "@/public/images/cover imager.png";
import {
    CompanyIcon,
    GroupUserIcon,
    PencileIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";
import { GrLocation } from "react-icons/gr";
import { IoPricetagsOutline } from "react-icons/io5";
function IndustryHeroSection({ userId }: { userId?: string }) {
  const UId = userId;
  const { data, isLoading } = useGetCompanyQuery(UId, {
    skip: !UId,
  });
  if (isLoading) {
    return (
      <div className="space-y-4">
        <ProfileHeroSkeleton />
      </div>
    );
  }
  const industryData = data?.data;
  console.log(industryData?.name);

  return (
    <div>
      <section>
        <div className=" relative h-40 md:h-48 w-full bg-linear-to-r rounded-md from-cyan-100 to-blue-200">
          <Image
            src={industryData?.cover_image || coverPreview}
            className="w-full h-full object-cover rounded-md"
            alt="Cover"
            width={1200}
            height={400}
          />

          {/* Floating Logo Box */}
          <div className="flex px-4 justify-between w-full">
            <div className="-mt-11 relative  border-2 border-white h-20 w-20 bg-bgLightColor rounded-full flex items-center justify-center">
              <Image
                src={industryData?.logo || logoPreview}
                className="w-full rounded-full h-full object-cover"
                alt="Logo"
                width={80}
                height={80}
              />
            </div>
            {industryData?.is_owner && (
              <div className="flex gap-6 mt-4">
                <Link
                  href={`/mu/create-company-page/${UId}`}
                  aria-label="notify-open"
                  className="cursor-pointer"
                >
                  <PencileIcon />
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="mt-12 border-b border-borderColor pb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="col-span-2">
              <h4 className="text-lg font-semibold text-headerColor leading-[150%]">
                {industryData?.name || "Vin Intini"}
              </h4>

              <div className="flex items-center gap-2.5 my-2 text-grayColor1">
                <CompanyIcon className="w-4 h-4" />
                <p className="text-sm   line-clamp-3">
                  {industryData?.industry || ""}
                </p>
              </div>
              <div className="flex items-center gap-2.5 my-2 text-grayColor1">
                <GrLocation className="w-4 h-4" />
                <p className="text-sm   line-clamp-3">
                  {industryData?.address || ""}
                </p>
              </div>
              <div className="flex items-center gap-2.5 my-2 text-grayColor1">
                <IoPricetagsOutline className="w-4 h-4" />
                <p className="text-sm   line-clamp-3">
                  {industryData?.tagline || ""}
                </p>
              </div>
              <div className="flex items-center gap-2.5 my-2 text-grayColor1">
                <GroupUserIcon />
                <p className="text-sm   line-clamp-3">
                  {industryData?.company_size || 0} Employees
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default IndustryHeroSection;
