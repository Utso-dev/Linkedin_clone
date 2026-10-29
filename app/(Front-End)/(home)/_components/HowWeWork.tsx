import { RightArrowIcon } from "@/public/svgIcons/Icons";
import WrapperContainer from "../../_components/WrapperContainer";
import { howWeWorkSteps } from "@/public/staticData";
import JoinButton from "@/components/reusable/JoinButton";

export default function HowWeWork() {
    return (
        <div className="bg-[#F8FBFF]">
            <WrapperContainer>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] justify-between gap-12">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-2 sm:space-y-4">
                            <div>
                                <h3 className="text-primaryColor text-sm sm:text-base md:text-sm xl:text-xl font-semibold leading-[130%] tracking-[0.1px]">Process</h3>
                                <h2 className="text-blackColor text-3xl sm:text-5xl font-semibold leading-[130%]">How <span className="text-primaryColor">Mind Unite</span> Works</h2>
                            </div>
                            <p className="w-full max-w-[364px] text-[#404040] text-base font-normal leading-[150%] tracking-[0.08px]">Discover programs, connect with professionals, & grow your career in one focused platform.</p>
                        </div>
                        <JoinButton title="Join Now It’s Free"/>
                    </div>
                    <div className="pl-6 lg:pl-0">
                        {howWeWorkSteps.map((step, index) => (
                            <div className={`pl-6.5 sm:pl-9 pb-2.5 sm:pb-6 relative ${step?.id !== "4" ? step?.id === "1" ? "border-l-2 border-primaryColor" : "border-l-2 border-[#4040404D]" : ""}`} key={step.id}>
                                <div className="space-y-1 sm:space-y-3">
                                    <h3 className="text-lg sm:text-2xl text-blackColor font-semibold leading-[130%] tracking-[0.12px]">{step.title}</h3>
                                    <p className="text-[#404040] text-sm sm:text-lg font-light leading-[160%] max-w-[500px]">{step.description}</p>
                                </div>
                                <div className={`w-9 sm:w-12 h-9 sm:h-12 flex items-center justify-center rounded-full absolute -top-1.75 -left-5 sm:-left-6.5 border text-base sm:text-xl ${step?.id === "1" ? "bg-primaryColor text-white" : " bg-white border-primaryColor text-[#404040]"}`}>
                                    {step?.id}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </WrapperContainer>
        </div>
    )
}