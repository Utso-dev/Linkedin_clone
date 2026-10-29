"use client";

import AdvertismentViewModal from "@/app/(Front-End)/mu/(pro-industry)/_component/advertisements/AdvertismentViewModal";
import { useLikebyIndustryProductMutation } from "@/feature/slice/jobs/industrySlice";
import { useAdvertisementsImpressionMutation } from "@/feature/slice/post/postSlice";
import { IndustryItemType } from "@/lib/type";
import { LikeIcon, OpenEyeIcon } from "@/public/svgIcons/Icons";
import image1 from "@/public/xray.jpg";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface EquipmentCardProps {
  card: IndustryItemType | any;
  priority?: boolean;
}

const toBool = (val: any) => Boolean(val && val !== "0" && val !== "false");

export const EquipmentCard = ({
  card,
  priority = false,
}: EquipmentCardProps) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [likebyIndustryProduct] = useLikebyIndustryProductMutation();
  const [sendImpression] = useAdvertisementsImpressionMutation();
  const cardRef = useRef<HTMLDivElement>(null);
  const impressionSentRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasUserScrolledRef = useRef(false);

  const title = card?.title || card?.product_name || "Product Title";
  const primaryTag =
    card?.tag ||
    (Array.isArray(card?.tags) ? card.tags[0] : null) ||
    (typeof card?.tags === "string" ? card.tags.split(",")[0]?.trim() : null) ||
    card?.category_name ||
    null;
  const subTitle =
    card?.sub_title || card?.industry?.name || card?.creator?.name || "";
  const description = card?.short_description || card?.description || "";
  const displayImage =
    card?.image_url || card?.image || card?.product_image || image1;
  const viewsCount = Number(card?.views_count) || 0;

  const isBoosted = toBool(card?.is_boosted);
  const isNewRelease = toBool(card?.is_new_release);
  const badgeLabel =
    typeof card?.badge === "string" && card.badge.trim()
      ? card.badge.trim()
      : null;

  const badgeText = isBoosted
    ? badgeLabel || "Sponsored"
    : isNewRelease
      ? badgeLabel || "New Release"
      : badgeLabel;
  const badgeGradient = isNewRelease
    ? "from-amber-400 to-orange-400"
    : "from-cyan-500 to-blue-500";

  const [isLiked, setIsLiked] = useState<boolean>(toBool(card?.is_liked));
  const [likesCount, setLikesCount] = useState<number>(
    Number(card?.likes_count) || 0,
  );
  const [isLiking, setIsLiking] = useState<boolean>(false);

  useEffect(() => {
    setIsLiked(toBool(card?.is_liked));
    setLikesCount(Number(card?.likes_count) || 0);
  }, [card?.is_liked, card?.likes_count]);

  // IAB Viewable Impression Logging for Boosted Products (matching PostAddedCard)
  useEffect(() => {
    const element = cardRef.current;
    if (
      !element ||
      impressionSentRef.current ||
      !isBoosted ||
      !card?.ad_campaign_id
    ) {
      return;
    }

    const clearVisibilityTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const isAtLeastHalfVisible = () => {
      const rect = element.getBoundingClientRect();
      const visibleWidth = Math.max(
        0,
        Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0),
      );
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
      );
      const elementArea = rect.width * rect.height;

      return (
        document.visibilityState === "visible" &&
        elementArea > 0 &&
        (visibleWidth * visibleHeight) / elementArea >= 0.5
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!hasUserScrolledRef.current) {
          clearVisibilityTimer();
          return;
        }

        if (
          entry?.isIntersecting &&
          entry.intersectionRatio >= 0.5 &&
          !timerRef.current
        ) {
          timerRef.current = setTimeout(() => {
            timerRef.current = null;
            if (impressionSentRef.current || !isAtLeastHalfVisible()) return;
            impressionSentRef.current = true;
            sendImpression({
              campaign_ids: [card.ad_campaign_id],
              placement: "industry_product_feed",
            })
              .unwrap()
              .catch((error) => {
                impressionSentRef.current = false;
                console.error(
                  "Failed to record advertisement impression:",
                  error,
                );
              });
          }, 1000);
        } else if (!entry?.isIntersecting || entry.intersectionRatio < 0.5) {
          clearVisibilityTimer();
        }
      },
      { threshold: 0.5 },
    );

    const handleScroll = () => {
      if (hasUserScrolledRef.current) return;
      hasUserScrolledRef.current = true;
      observer.unobserve(element);
      observer.observe(element);
    };

    observer.observe(element);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      clearVisibilityTimer();
    };
  }, [card?.ad_campaign_id, isBoosted, sendImpression]);

  const handleLike = async (productId: string | number) => {
    if (!productId || isLiking) return;

    const prevLiked = isLiked;
    const prevCount = likesCount;
    const nextLiked = !prevLiked;

    setIsLiked(nextLiked);
    setLikesCount(nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1));
    setIsLiking(true);

    try {
      const response = await likebyIndustryProduct(productId).unwrap();
      const payload = response?.data || response;
      if (payload && typeof payload.is_liked !== "undefined") {
        setIsLiked(toBool(payload.is_liked));
      }
      if (payload && typeof payload.likes_count !== "undefined") {
        setLikesCount(Number(payload.likes_count));
      }
    } catch (error) {
      console.error("Error liking product:", error);
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div ref={cardRef}>
      <div className="flex w-full h-full flex-col justify-between items-start gap-3 rounded-[10px] border border-[#ECEFF3] bg-white pt-0 pb-2 pr-px">
        <div className="relative h-45 w-full overflow-hidden rounded-[10px]">
          {badgeText && (
            <div
              className={`absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-linear-to-r ${badgeGradient} text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm`}
            >
              <span>{badgeText}</span>
            </div>
          )}

          <Image
            src={displayImage}
            alt={title}
            width={400}
            height={300}
            className="h-full w-full object-cover"
            unoptimized
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
        </div>

        <div className="flex w-full items-center justify-between gap-2 px-3">
          <h4 className="flex-1 font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C] line-clamp-1">
            {title}
          </h4>
          {primaryTag && (
            <span className="shrink-0 rounded-full bg-[#E9E9EA] px-2.5 py-1 font-['Segoe_UI'] text-xs font-normal text-[#4A4C56]">
              {primaryTag}
            </span>
          )}
        </div>

        {subTitle && (
          <p className="self-stretch px-3 font-['Segoe_UI'] text-xs font-normal leading-[132%] tracking-[0.06px] text-grayColor1">
            {subTitle}
          </p>
        )}

        <p className="self-stretch px-3 font-['Segoe_UI'] text-sm line-clamp-2 font-normal leading-[140%] text-grayColor1">
          {description}
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

        <div className="flex justify-between items-center px-10 w-full">
          <button
            type="button"
            onClick={() => handleLike(card?.id || card?.product_id)}
            disabled={isLiking}
            className={`${
              isLiked ? " text-primaryColor font-medium" : "text-headerColor/90"
            } flex items-center justify-center gap-2 py-1.5 text-[16px] cursor-pointer hover:opacity-80 transition-colors`}
          >
            <LikeIcon
              className={`${isLiked ? " text-primaryColor" : ""} h-4.5 w-4.5 transition-colors`}
            />
            <span>{likesCount}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewModalOpen(true)}
            className="flex items-center justify-center gap-2 py-1.5 text-[16px] text-headerColor/90 cursor-pointer hover:opacity-80"
          >
            <OpenEyeIcon className="h-4.5 w-4.5" />
            <span>{viewsCount}</span>
            <span>Views</span>
          </button>
        </div>
      </div>
      <AdvertismentViewModal
        open={viewModalOpen}
        setOpen={setViewModalOpen}
        adId={card?.id}
        is_owner={card?.industry?.is_own_industry}
      />
    </div>
  );
};
