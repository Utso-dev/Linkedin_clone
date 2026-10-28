"use client";

import {
  useFollowIndustryMutation,
  useLikebyIndustryProductMutation,
} from "@/feature/slice/jobs/industrySlice";
import {
  useAdvertisementsClickMutation,
  useAdvertisementsImpressionMutation,
} from "@/feature/slice/post/postSlice";
import emptyImage from "@/public/empty_user.jpg";
import { LikeIcon, OpenEyeIcon } from "@/public/svgIcons/Icons";
import fallbackProductImage from "@/public/xray.jpg";
import { ExternalLink, Globe2, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SponsoredAd = {
  id: string | number;
  ad_campaign_id: number;
  badge?: string;
  product_id?: number;
  product_code?: string;
  product_name?: string;
  title?: string;
  description?: string;
  image_url?: string;
  destination_url?: string;
  destination_domain?: string;
  cta_text?: string;
  likes_count?: number;
  views_count?: number;
  is_liked?: boolean;
  company?: { name?: string; logo?: string; tagline?: string };
  industry?: {
    id?: number;
    name?: string;
    logo?: string;
    tagline?: string;
    is_following?: boolean;
  };
  section_name?: string;
  category_name?: string;
  tags?: string[];
  is_new_release?: boolean;
};

function PostAddedCard({ ad }: { ad: SponsoredAd }) {
  const cardRef = useRef<HTMLElement | null>(null);
  const impressionSentRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasUserScrolledRef = useRef(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(Boolean(ad.is_liked));
  const [likesCount, setLikesCount] = useState(ad.likes_count || 0);
  const [companyLogo, setCompanyLogo] = useState(
    ad.industry?.logo || emptyImage,
  );
  const [productImage, setProductImage] = useState(
    ad.image_url || fallbackProductImage,
  );
  const [sendClick] = useAdvertisementsClickMutation();
  const [sendImpression] = useAdvertisementsImpressionMutation();
  const [likeIndustryProduct] = useLikebyIndustryProductMutation();
  const [followIndustry, { isLoading: isFollowingIndustry }] =
    useFollowIndustryMutation();
  const [isFollowing, setIsFollowing] = useState(
    Boolean(ad.industry?.is_following),
  );
  const description = ad.description || "";
  const shortDescription =
    description.length > 180 ? `${description.slice(0, 180)}...` : description;

  useEffect(() => {
    setIsLiked(Boolean(ad.is_liked));
    setLikesCount(ad.likes_count || 0);
    setCompanyLogo(ad.industry?.logo || emptyImage);
    setProductImage(ad.image_url || fallbackProductImage);
    setIsFollowing(Boolean(ad.industry?.is_following));
  }, [
    ad.industry?.logo,
    ad.image_url,
    ad.is_liked,
    ad.likes_count,
    ad.industry?.is_following,
  ]);

  useEffect(() => {
    const element = cardRef.current;
    if (!element || impressionSentRef.current) return;

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
              campaign_ids: [ad.ad_campaign_id],
              placement: "newsfeed",
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
  }, [ad.ad_campaign_id, sendImpression]);

  const openDestination = async (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      const response = await sendClick({
        id: ad.ad_campaign_id,
        placement: "newsfeed",
      }).unwrap();
      const url = response?.data?.destination_url || ad.destination_url;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to record advertisement click:", error);
      if (ad.destination_url) {
        window.open(ad.destination_url, "_blank", "noopener,noreferrer");
      }
    }
  };

  const handleLike = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!ad.product_id) return;

    const previousLiked = isLiked;
    const previousCount = likesCount;
    setIsLiked(!previousLiked);
    setLikesCount(
      previousLiked ? Math.max(0, previousCount - 1) : previousCount + 1,
    );

    try {
      await likeIndustryProduct(ad.product_id).unwrap();
    } catch (error) {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      console.error("Failed to like sponsored product:", error);
    }
  };

  const handleFollow = async () => {
    if (!ad.industry?.id || isFollowing || isFollowingIndustry) return;
    try {
      await followIndustry({ id: ad.industry.id }).unwrap();
      setIsFollowing(true);
    } catch (error) {
      console.error("Failed to follow industry:", error);
    }
  };

  return (
    <article
      ref={cardRef}
      className="overflow-hidden rounded-xl border border-borderColor bg-white"
    >
      <div className="flex items-start justify-between gap-3 p-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="h-12 w-12 overflow-hidden rounded-lg border border-borderColor bg-gray-50">
            <Image
              src={companyLogo}
              alt={ad.industry?.name || "Advertiser"}
              width={96}
              height={96}
              className="h-full w-full object-cover"
              unoptimized
              onError={() => setCompanyLogo(emptyImage)}
            />
          </div>
          <div className="min-w-0">
            <Link
              href={`/mu/industry/${ad?.industry?.id}`}
              className="truncate font-semibold text-slate-900"
            >
              {ad.industry?.name || "Sponsored"}
            </Link>
            <p className="truncate text-xs flex items-center gap-1 text-slate-500">
              {ad.industry?.tagline || "Sponsored"}
              <Globe2 className="inline h-3 w-3" />
            </p>
            <p className="text-xs font-medium text-primaryColor">Promoted</p>
          </div>
        </div>
        {ad.industry?.id && (
          <button
            type="button"
            onClick={handleFollow}
            disabled={isFollowing || isFollowingIndustry}
            className="h-8 rounded-full border border-primaryColor px-3 text-sm font-medium text-primaryColor transition hover:bg-primaryColor hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFollowingIndustry
              ? "Updating..."
              : isFollowing
                ? "Following"
                : "Follow"}
          </button>
        )}
      </div>

      <div className="px-3 pb-3">
        {description && (
          <div className="mt-2 text-sm leading-6 text-headerColor">
            {isExpanded ? description : shortDescription}
            {description.length > 180 && (
              <button
                type="button"
                onClick={() => setIsExpanded((expanded) => !expanded)}
                className="ml-1 font-medium text-primaryColor"
              >
                {isExpanded ? "see less" : "see more"}
              </button>
            )}
          </div>
        )}
      </div>

      <button type="button" onClick={openDestination} className="block w-full">
        <Image
          src={productImage}
          alt={ad.product_name || ad.title || "Sponsored product"}
          width={1200}
          height={628}
          className="aspect-[1.91/1] w-full object-cover"
          unoptimized
          onError={() => setProductImage(fallbackProductImage)}
        />
      </button>

      <div className="border-t bg-slate-50 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-slate-500">
              {ad.destination_domain || "Product"}{" "}
              {ad.product_code && (
                <span className="ml-1 rounded bg-slate-200 px-1.5 py-0.5">
                  ID: #{ad.product_code}
                </span>
              )}
              {ad.is_new_release && (
                <span className="ml-1 text-orange-600">🔥 New</span>
              )}
            </p>
            <button
              type="button"
              onClick={openDestination}
              className="mt-1 text-left text-base font-bold text-slate-900 hover:text-primaryColor"
            >
              {ad.product_name || ad.title}
            </button>
            {(ad.section_name || ad.category_name) && (
              <p className="mt-1 text-xs text-cyan-700">
                {ad.section_name}
                {ad.section_name && ad.category_name && " • "}
                {ad.category_name}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={openDestination}
            className="flex shrink-0 items-center gap-1 rounded-md bg-primaryColor px-3 py-2 text-xs font-semibold text-white"
          >
            {ad.cta_text || "View Product"}{" "}
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>

        {ad.tags && ad.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ad.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs text-slate-600"
              >
                <Tag className="h-3 w-3" />#{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-2 text-sm transition-colors ${
              isLiked ? "text-primaryColor" : "text-headerColor/90"
            }`}
          >
            <LikeIcon className="h-5 w-5" />
            <span>{likesCount}</span>
            <span>Likes</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-headerColor/90">
            <OpenEyeIcon className="h-5 w-5" />
            <span>{ad.views_count || 0}</span>
            <span>Views</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PostAddedCard;
