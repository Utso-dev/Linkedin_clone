"use client";

import AdvertismentViewModal from "@/app/(Frond-End)/mu/(pro-industry)/_component/advertisements/AdvertismentViewModal";
import { useLikebyIndustryProductMutation } from "@/feature/slice/jobs/industrySlice";
import { IndustryItemType } from "@/lib/type";
import { LikeIcon, OpenEyeIcon } from "@/public/svgIcons/Icons";
import image1 from "@/public/xray.jpg";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
interface EquipmentCardProps {
  card: IndustryItemType;
  priority?: boolean;
}

export const EquipmentCard = ({
  card,
  priority = false,
}: EquipmentCardProps) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [likebyIndustryProduct] = useLikebyIndustryProductMutation();
  const handleLike = async (productId: string | number) => {
    try {
      await likebyIndustryProduct(productId).unwrap();
    } catch (error) {
      console.error("Error liking product:", error);
    }
  };
console.log(card);

  
  return (
    <div>
      <div
        className={`flex w-full h-full flex-col justify-between items-start gap-3 rounded-[10px] border border-[#ECEFF3] bg-white ${card.image_url ? "pt-0" : "pt-2"} pb-2 pr-px`}
      >
        {card.image_url && (
          <div className="relative h-45 w-full overflow-hidden rounded-[10px]">
            <Image
              src={card.image_url || image1}
              alt={card.title}
              width={400}
              height={300}
              className="h-full w-full object-cover"
              unoptimized
              priority={priority}
              loading={priority ? undefined : "lazy"}
            />
          </div>
        )}

        <div className="flex w-full items-center justify-between px-3">
          <h4 className="font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
            {card.title || card.product_name || "Equipment Title"}
          </h4>
          {card.tag && (
            <span className="rounded-full bg-[#E9E9EA] px-2.5 py-1 font-['Segoe_UI'] text-xs font-normal text-[#4A4C56]">
              {card.tag}
            </span>
          )}
        </div>

        {card.sub_title && (
          <p className="self-stretch px-3 font-['Segoe_UI'] text-xs font-normal leading-[132%] tracking-[0.06px] text-grayColor1">
            {card.sub_title}
          </p>
        )}

        <p className="self-stretch px-3 font-['Segoe_UI'] text-sm line-clamp-2 font-normal leading-[140%] tracking-[0.07px] text-grayColor1">
          {card.description}
        </p>

        <button
          onClick={() => setViewModalOpen(true)}
          className="flex cursor-pointer items-center gap-1 px-3 text-black hover:underline"
        >
          <span className="font-['Segoe_UI'] text-sm font-medium">
            Learn more
          </span>
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className=" flex justify-between items-center px-10 w-full ">
          <button
            type="button"
            onClick={() => handleLike(card?.id)}
            className={`${card?.is_liked ? " text-primaryColor" : ""} flex items-center justify-center gap-2 py-1.5 text-[16px]  text-headerColor/90 cursor-pointer hover:opacity-80`}
          >
            <LikeIcon
              className={` ${card?.is_liked ? " stroke-primaryColor" : ""} h-4.5 w-4.5`}
            />
            <span>{card?.likes_count}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewModalOpen(true)}
            className="flex items-center justify-center gap-2 py-1.5 text-[16px]  text-headerColor/90 cursor-pointer hover:opacity-80"
          >
            <OpenEyeIcon className="h-4.5 w-4.5" />
            <span>{card?.views_count}</span>
            <span>Views</span>
          </button>
        </div>
      </div>
      <AdvertismentViewModal
        open={viewModalOpen}
        setOpen={setViewModalOpen}
        adId={card.id}
         is_owner={card?.industry?.is_own_industry}
      />
    </div>
  );
};
