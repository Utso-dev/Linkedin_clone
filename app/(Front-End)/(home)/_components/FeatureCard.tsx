import { UsersIcon } from "@/public/svgIcons/Icons"

type PropType = {
    data: {
        id: number,
        title: string,
        description: string,
        icon: React.ElementType,
        iconBgColor: string,
        cardBgColor: string
    }
}

export default function FeatureCard({ data }: PropType){
    return(
        <div className={`space-y-3 sm:space-y-5 md:space-y-3 xl:space-y-5 p-3 sm:p-6 md:p-3 xl:p-6 ${data.cardBgColor} rounded-lg sm:rounded-2xl`}>
            <div className={`p-2 sm:p-3 md:p-2 xl:p-3 rounded-md sm:rounded-lg ${data.iconBgColor} w-fit`}>
                <data.icon className="w-6 sm:w-8 md:w-6 xl:w-8 h-6 sm:h-8 md:h-6 xl:h-8" />
            </div>
            <div className="space-y-3">
                <h3 className="text-balckColor text-lg sm:text-2xl md:text-lg xl:text-xl font-semibold leading-[130%] tracking-[0.1px]">{data.title}</h3>
                <p className="text-[#404040] text-xs sm:text-base md:text-xs xl:text-sm font-normal leading-[140%] -tracking-[0.07px]">{data.description}</p>
            </div>
        </div>
    )
}