import WrapperContainer from "../../_components/WrapperContainer";
import TestSlide from "./TestSlide";
import { testimonials } from "@/public/demoData/DemoData";

export default function Testimonials() {
  return (
    <div className="bg-white w-full">
      <WrapperContainer>
        <div className="space-y-12 w-full grid grid-cols-1">
          <div className="space-y-3 text-center">
            <h3 className="text-primaryColor text-sm sm:text-base md:text-sm xl:text-xl font-semibold leading-[130%] tracking-[0.1px]">
              Testimonials
            </h3>
            <h2 className="text-blackColor text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-[130%]">
              Hear from <span className="text-primaryColor">Our Community</span>
            </h2>
          </div>
          <div className="w-full grid grid-cols-1">
            <TestSlide data={testimonials} />
          </div>
        </div>
      </WrapperContainer>
    </div>
  );
}
