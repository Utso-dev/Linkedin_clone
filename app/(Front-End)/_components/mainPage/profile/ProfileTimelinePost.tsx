"use client";
import { useGetProfileTimelineQuery } from "@/feature/slice/post/postSlice";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CreatePostSection from "../post/CreatePostSection";
import PostCardSkleton from "../post/PostCardSkleton";
import ProfilePostCard from "./ProfilePostCard";
function ProfileTimelinePost({ userId }: { userId: string | number }) {
  const params = useParams();
  const { id } = params;
  const [currentIndex, setCurrentIndex] = useState(1);
  const { data, isLoading } = useGetProfileTimelineQuery({
    userId: id ? id : userId,
    query: `page=1&per_page=10`,
  });

  const posts = data?.data || [];
  const swiperRef = useRef<any>(null);

  const goNext = () => swiperRef.current?.slideNext();
  const goPrev = () => swiperRef.current?.slidePrev();

  return (
    <div className="w-full relative grid  h-full">
      {posts.length > 2 && (
        <button onClick={goPrev}>
          <div className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-white">
            <ChevronLeft className="h-5 w-5" />
          </div>
        </button>
      )}

      {isLoading ? (
        <div className="text-center flex  py-10">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className=" rounded-md mb-4">
              <PostCardSkleton />
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 300000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {  
              slidesPerView: 2,
              spaceBetween: 10,
            },
          }}
          modules={[Navigation, Autoplay, Pagination]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex + 1)}
          className="w-full"
          pagination={{
            clickable: true,
            bulletClass: "hero-bullet",
            bulletActiveClass: "hero-bullet-active",
          }}
        >
          {posts.map((post) => (
            <SwiperSlide className="" key={post.id}>
              <ProfilePostCard post={post} meta={data?.meta} userId={userId} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : !data?.meta?.is_own_profile ? (
        <p className="text-center text-grayColor1">No posts available</p>
      ) : (
        <div className=" py-6">
          <h4 className="text-lg font-semibold text-headerColor mb-4">
            Publish your first post
          </h4>
          <CreatePostSection />
        </div>
      )}
      {posts.length > 2 && (
        <button onClick={goNext}>
          <div className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-white">
            <ChevronRight className="h-5 w-5" />
          </div>
        </button>
      )}
    </div>
  );
}

export default ProfileTimelinePost;
