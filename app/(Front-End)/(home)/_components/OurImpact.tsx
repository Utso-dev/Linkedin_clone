"use client";
import { useGetAboutUsQuery } from "@/feature/slice/aboutUs/aboutUs";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import WrapperContainer from "../../_components/WrapperContainer";
export default function OurImpact() {
  const { data, error, isLoading } = useGetAboutUsQuery({});
  const item = data?.data.leading_institutions || [];
  return (
    <div className="w-full ">
      <WrapperContainer>
        <div className="space-y-8">
          {/* <div className="space-y-12">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-center text-primaryColor text-sm sm:text-base md:text-sm xl:text-xl font-semibold leading-[130%] tracking-[0.1px]">
                                    Our Impact
                                </h3>
                                <h2 className="text-blackColor text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-[130%] text-center">Build Your Career with <span className="text-primaryColor">Mind Unite</span></h2>
                            </div>
                            <p className="text-[#404040] text-sm md:text-base xl:text-lg text-center font-light leading-[160%]">Join a thriving community dedicated to advancing networking in the brain health fields.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
                            {ourImpactData.map((impact) => (
                                <div key={impact?.id} className={`p-6 space-y-3 rounded-xl ${impact.bgColor} flex flex-col items-center text-center`}>
                                    <div className={`p-3 ${impact?.IconBgColor} rounded-lg`}>
                                        <impact.Icon className="w-8 h-8" />
                                    </div>
                                    <h1 className="text-blackColor text-2xl md:text-3xl lg:text-4xl xl:text-[40px] font-bold">{impact?.value}{impact?.uniqueKey === "satisfaction_rate" ? "%" : "+"}</h1>
                                    <div className="space-y-1">
                                        <h4 className="text-blackColor text-sm sm:text-lg lg:text-base xl:text-lg 2xl:text-xl font-semibold leading-[130%] tracking-[0.1px]">{impact?.title}</h4>
                                        <p className="text-[#404040] lg:text-sm xl:text-base font-light leading-[150%] tracking-[0.08px]">{impact?.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-6">
            <div className=" w-full pb-4 md:pb-0">
              <h3 className="text-blackColor  text-center md:text-start text-2xl md:text-xl xl:text-2xl 2xl:text-[32px] font-semibold leading-[130%]">
                Trusted by Students/Graduates/Faculty of Leading Institutions
              </h3>
            </div>
            <div className=" w-full ">
              <Marquee
                gradient={false}
                speed={50}
                pauseOnHover={true}
                className=" "
              >
                {item.map((coin, index) => (
                  <div
                    key={index}
                    title={coin.name}
                    className=" h-12 w-12 items-center mx-4  relative cursor-pointer "
                  >
                    <Image
                      src={coin?.logo_url}
                      alt={`Coin ${index + 1}`}
                      width={60}
                      height={60}
                      className="w-full h-full object-contain"
                    />
                    {/* <div className="absolute bottom-13 left-1/2 -translate-x-1/4 opacity-0 group-hover:opacity-100 transition-opacity bg-primaryColor text-white text-xs px-2 py-1 rounded">
                      {coin.name}
                    </div> */}
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </WrapperContainer>
    </div>
  );
}
