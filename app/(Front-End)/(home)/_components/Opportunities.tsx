import WrapperContainer from "../../_components/WrapperContainer";
import { ClockIcon, GraduationCapIcon, MapLocationIcon, SavedIcon } from "@/public/svgIcons/Icons";
import { opportunities } from "@/public/staticData";
import Image from "next/image";

function getDaysAgo(dateString: string): string {
    if (!dateString) return "";
    const createdDate = new Date(dateString);
    const now = new Date();
    // Zero out the time for both dates
    createdDate.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    const diffTime = now.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
}

export default function Opportunities() {
    return (
        <div className="bg-[#FAFBFC]">
            <WrapperContainer>
                <div className="space-y-6 sm:space-y-12">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-primaryColor text-sm sm:text-base md:text-sm xl:text-xl font-semibold leading-[130%] tracking-[0.1px]">Opportunities</h2>
                            <h1 className="text-blackColor text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-[130%]">Explore <span className="text-primaryColor">Opportunities</span></h1>
                        </div>
                        <p className="text-[#404040] text-sm md:text-base xl:text-lg font-light leading-[160%]">Discover curated positions from leading institutions in psychology and neuroscience</p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-3 sm:gap-6">
                        {opportunities.map((opportunity, index) => (
                            <div key={index} className="p-2 sm:p-4 lg:p-6 border  border-[#D7F2F2] bg-white rounded-2xl grid grid-cols-[1fr_auto] gap-2 sm:gap-4">
                                <div className="grid grid-cols-[auto_1fr] gap-2 sm:gap-3">
                                    <Image
                                        src={opportunity?.company_logo}
                                        alt={opportunity?.company_name}
                                        width={100}
                                        height={100}
                                        className="w-10 sm:w-15 h-10 sm:h-15 rounded-lg object-cover"
                                        priority
                                    />
                                    <div className="grid grid-cols-1 space-y-4 sm:space-y-5">
                                        <div className="space-y-2 sm:space-y-3">
                                            <h2 className="text-blackColor text-base sm:text-xl font-semibold leading-[130%] tracking-[0.1px] text-wrap">{opportunity?.job_title}</h2>
                                            <div className="text-[#404040] text-xs sm:text-base font-light leading-[150%] tracking-[0.08px]">
                                                <div className="grid grid-cols-[auto_1fr] items-center gap-1">
                                                    < GraduationCapIcon className="w-4 sm:w-5 h-4 sm:h-5"/>
                                                    <span>{opportunity?.company_name}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="grid grid-cols-[auto_1fr] items-center gap-1">
                                                        <MapLocationIcon className="w-4 sm:w-5 h-4 sm:h-5"/>
                                                        <span>{opportunity?.location}</span>
                                                    </div>
                                                    <div className="grid grid-cols-[auto_1fr] items-center gap-1">
                                                        <ClockIcon className="w-4 sm:w-5 h-4 sm:h-5"/>
                                                        <span className="whitespace-nowrap">{getDaysAgo(opportunity?.created_at)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 capitalize">
                                            <p className="px-2 py-0.25 sm:py-0.5 bg-[#04A1B71A] border border-[#04A1B71A] rounded-lg text-primaryColor text-xs sm:text-base font-normal leading-[150%] tracking-[0.08px]">{opportunity?.job_field}</p>
                                            <p className="px-2 py-0.25 sm:py-0.5 bg-[#04A1B71A] border border-[#04A1B71A] rounded-lg text-primaryColor text-xs sm:text-base font-normal leading-[150%] tracking-[0.08px]">{opportunity?.job_position}</p>
                                            <p className="px-2 py-0.25 sm:py-0.5 bg-white border border-[#E5E5E5] rounded-lg text-blackColor text-xs sm:text-base font-normal leading-[150%] tracking-[0.08px]">{opportunity?.job_type}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <SavedIcon className="w-4 sm:w-5 h-4 sm:h-5"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ WrapperContainer>
        </div>
    )
}