import { RightArrowIcon } from "@/public/svgIcons/Icons";
import Image from "next/image";
import FeatureCard from "./FeatureCard";
import { landingPageFeatures } from "@/public/staticData";
import WrapperContainer from "../../_components/WrapperContainer";
import JoinButton from "@/components/reusable/JoinButton";
import featureGroupImage from "@/public/images/feature-img.jpg";


export default function Features() {
    return (
        <div className="w-full bg-white">
            <WrapperContainer>
                <div className="grid md:grid-cols-8 xl:grid-cols-7 gap-2.5 sm:gap-4 md:gap-2.5 xl:gap-4">
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-2.5 xl:gap-4 md:col-span-4">
                        <div className="grid grid-rows-[1fr_auto] gap-8 justify-between p-6 md:p-4 xl:p-6 bg-primaryColor/10 rounded-2xl md:rounded-lg xl:rounded-2xl">
                            <div className="space-y-3">
                                <h2 className="text-primaryColor text-sm sm:text-base md:text-sm xl:text-xl font-semibold leading-[130%] tracking-[0.1px]">Features</h2>
                                <h1 className="text-blackColor text-lg sm:text-3xl md:text-lg lg:text-3xl xl:text-5xl font-semibold leading-[130%] tracking-[-0.96px] max-w-72.5">Why Choose Mind Unite?</h1>
                                <p className="text-[#404040] text-xs sm:text-base md:text-xs xl:text-sm font-normal leading-[160%] tracking-[-0.5px] max-w-72.5">Everything you need to build your career in the mind sciences, all in one platform.</p>
                            </div>
                            <JoinButton title="Join Now" redirectUrl="/sign-up" />
                        </div>
                        <div className="">
                            <Image
                                src={featureGroupImage}
                                alt="Feature Image"
                                width={500}
                                height={300}
                                className="w-full h-full object-cover rounded-2xl md:rounded-lg xl:rounded-2xl"
                                priority
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-2.5 xl:gap-4 md:col-span-4 xl:col-span-3">
                        {landingPageFeatures?.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                data={feature}
                            />
                        ))}
                    </div>
                </div>
            </WrapperContainer>
        </div>
    )
}