"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// @ts-ignore - Swiper CSS imports
import "swiper/css";
// @ts-ignore - Swiper CSS imports
import "swiper/css/navigation";
// @ts-ignore - Swiper CSS imports
import { Testimonial } from "@/lib/type";
import { FullStarIcon, RightArrowIcon } from "@/public/svgIcons/Icons";
import "swiper/css/pagination";

type PropType = {
  data: Testimonial[];
};

export default function TestSlide({ data }: PropType) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const swiperRef = useRef<any>(null);

  const goNext = () => swiperRef.current?.slideNext();
  const goPrev = () => swiperRef.current?.slidePrev();

  return (
    <section className="">
      <div className="">
        <div className="relative grid grid-cols-12">
          <div className="col-span-1 flex justify-center w-full">
            <button onClick={goPrev}>
              <div className=" z-10 flex items-center group justify-center cursor-pointer w-10 h-10 rounded-full bg-white/20 border border-primaryColor hover:bg-primaryColor shadow shadow-stone-300 transition-all backdrop-blur-[5px]">
                <RightArrowIcon className="text-primaryColor group-hover:text-whiteColor w-6 h-5.5 leading-0 rotate-180" />
              </div>
            </button>
          </div>
          <div className="col-span-10">
            <div>
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                speed={1000}
                autoplay={{
                  delay: 300000,
                  disableOnInteraction: false,
                }}
                modules={[Navigation, Autoplay, Pagination]}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={(swiper) =>
                  setCurrentIndex(swiper.realIndex + 1)
                }
                className="w-full"
                pagination={{
                  clickable: true,
                  bulletClass: "hero-bullet",
                  bulletActiveClass: "hero-bullet-active",
                }}
              >
                {data.map((testimonial, index) => (
                  <SwiperSlide key={testimonial.id}>
                    <div className="w-full md:p-6 p-4  rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[auto_1fr] items-center gap-6">
                        <Image
                          src={testimonial.imgUrl}
                          alt={testimonial.review}
                          width={550}
                          height={150}
                          className="w-full h-auto rounded-md object-cover md:max-w-[500px]"
                          priority
                        />
                        <div className="space-y-6">
                          <div className="w-full space-y-3">
                            <div className="flex items-center gap-1 select-none">
                              <FullStarIcon className="w-6 h-6 text-[#F9C80E]" />
                              <FullStarIcon className="w-6 h-6 text-[#F9C80E]" />
                              <FullStarIcon className="w-6 h-6 text-[#F9C80E]" />
                              <FullStarIcon className="w-6 h-6 text-[#F9C80E]" />
                              <FullStarIcon className="w-6 h-6 text-[#F9C80E]" />
                            </div>
                            <em className="text-[#3A3A3A] text-base font-light leading-[160%] tracking-[0.08px]">
                              "{testimonial.review}"
                            </em>
                          </div>
                          <div
                            title={testimonial?.reviewer?.name}
                            className="flex items-center gap-4"
                          >
                            <Image
                              src={testimonial?.reviewer?.avatarUrl}
                              alt={testimonial?.reviewer?.name}
                              width={60}
                              height={60}
                              className="w-15 h-15 rounded-full object-cover"
                            />
                            <div className="w-full grid grid-cols-1 justify-between gap-1.5">
                              <div className="flex items-center text-[#101010] text-lg lg:text-2xl font-semibold leading-[130%] tracking-[0.12px]">
                                <h2
                                  title={testimonial?.reviewer?.name}
                                  className="whitespace-nowrap truncate"
                                >
                                  {testimonial?.reviewer?.name}
                                </h2>
                                <p
                                  title={testimonial?.reviewer?.location}
                                  className="whitespace-nowrap truncate"
                                >
                                  ,{" "}
                                  {testimonial?.reviewer?.location
                                    ?.split(",")
                                    ?.pop()}
                                </p>
                              </div>
                              <p className="text-[#3A3A3A] text-sm lg:text-base font-normal leading-[150%] tracking-[0.08px]">
                                {testimonial?.reviewer?.occupation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className="col-span-1 flex justify-center w-full">
            <button onClick={goNext}>
              <div className=" z-10 flex items-center group justify-center cursor-pointer w-10 h-10 rounded-full bg-[#FBFBFB] border border-primaryColor hover:bg-primaryColor shadow shadow-stone-300 transition-all backdrop-blur-[5px]">
                <RightArrowIcon className="text-primaryColor group-hover:text-whiteColor w-6 h-5.5 leading-0" />
              </div>
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .hero-bullet {
          width: 20px !important;
          height: 8px !important;
          transition: all 0.3s ease;
          margin: 0px 5px;
          display: inline-block;
          cursor: pointer;

          // padding:10px;
        }

        .hero-bullet-active {
          position: relative;
          // transform: scale(1.1);
        }
      `}</style>
    </section>
  );
}
// css active color and center==========
//  .swiper-pagination-bullets{
//   display: flex !important;
//   justify-content: center !important;
// }
// .hero-bullet {
//       background-color: var(--grayColor1) !important;
//       border-radius: 4px;
//     }
//     .hero-bullet-active {
//       background-color: #45CCD2 !important;
//     }
