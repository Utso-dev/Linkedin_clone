import JoinButton from "@/components/reusable/JoinButton";
import heroImage from "@/public/images/hero-img.png";
import { DiamondIcon } from "@/public/svgIcons/Icons";
import Image from "next/image";
import WrapperContainer from "../../_components/WrapperContainer";

export default function Hero() {
  return (
    <div
      className="w-full"
      style={{
        background:
          "linear-gradient(179deg, rgba(253, 253, 253, 0.10) -63.29%, rgba(1, 120, 242, 0.10) 98.84%)",
      }}
    >
      <WrapperContainer>
        <div className="w-full grid grid-rows-2 lg:grid-rows-1 grid-cols-1 lg:grid-cols-2 xl:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="space-y-4 sm:space-y-8 w-full max-w-150">
            <div className="space-y-3 sm:space-y-4">
              <div className="px-2 sm:px-4 py-1 sm:py-1.5 flex items-center gap-2 bg-[#0145DB1A] rounded-full w-fit">
                <DiamondIcon className="w-4 h-4 text-primaryColor" />
                <p className="text-xs sm:text-sm md:text-base text-primaryColor font-semibold leading-[150%] tracking-[0.08px]">
                  Platform for Mind Sciences
                </p>
              </div>
              <h1 className="text-black text-[32px] sm:text-[48px] xl:text-[56px] font-semibold leading-[120%] tracking-[-0.56px]">
                <p>Connect, Grow, &</p>
                <p>
                  <span className="thrive">Thrive</span> in Psychology
                </p>
                <p>& Neuroscience</p>
              </h1>
              <p className="text-sm sm:text-lg text-[#404040] font-normal leading-[160%] tracking-[-0.5px]">
                A professional networking platform designed exclusively for
                current and future Brain Health Professionals, and the industry
                partners who support them.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <JoinButton title="Join Now" redirectUrl="/sign-up" />
              <button
                type="button"
                className="flex items-center px-3 sm:px-6 md:px-3 lg:px-6 py-1.5 sm:py-3 md:py-1.5 lg:py-3 gap-1.5 sm:gap-3 rounded-lg sm:rounded-xl md:rounded-lg lg:rounded-xl bg-transparent text-primaryColor border border-primaryColor hover:bg-primaryColor/10 hover:rounded transition-all duration-300 cursor-pointer"
              >
                <span className="text-xs sm:text-base md:text-sm lg:text-lg font-semibold leading-[160%]">
                  Explore Features
                </span>
              </button>
            </div>
          </div>
          <div className="w-full h-full relative">
            <Image
              src={heroImage}
              alt="Hero Image"
              fill
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>
      </WrapperContainer>
    </div>
  );
}
