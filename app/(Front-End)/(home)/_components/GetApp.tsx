import Image from "next/image";
import { CheckMarkWithCircleIcon } from "@/public/svgIcons/Icons";
import { features } from "@/public/staticData";
import Link from "next/link";
import playStoreQR from "@/public/images/appdownload-qr.png";
import playStoreLogo from "@/public/images/playstore.svg";
import appStoreLogo from "@/public/images/appstore.svg";

export default function GetApp() {
    return (
        <div className="py-4! container">
            <div className="p-12 bg-[#E4EEFF] rounded-2xl flex flex-col-reverse sm:grid grid-cols-[1fr_auto] gap-6">
                <div className="w-full max-w-[600px] grid grid-cols-1 justify-between gap-5">
                    <div className="space-y-5">
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-blackColor font-semibold leading-[130%]">Ready to Unite with Like-Minded <span className="text-primaryColor">Professionals?</span></h2>
                            <p className="text-[#404040] text-lg font-light leading-[160%] ">Sign up today to grow your brain health network.</p>
                        </div>
                        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {features.map((feature) => (
                                <li key={feature} className="grid grid-cols-[auto_1fr] gap-2">
                                    <CheckMarkWithCircleIcon className="w-5" />
                                    <span className="text-[#404040] text-base font-light leading-[150%] tracking-[0.08px]">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <Image
                                src={playStoreLogo}
                                alt="App Store Badge"
                                width={150}
                                height={50}
                                className="w-[120px] h-auto sm:w-[150px] lg:w-[180px] cursor-pointer"
                                priority
                            />
                        </Link>
                        <Link href="/" className="">
                            <Image
                                src={appStoreLogo}
                                alt="App Store Badge"
                                width={150}
                                height={50}
                                className="w-[120px] h-auto sm:w-[150px] lg:w-[180px] cursor-pointer"
                                priority
                            />
                        </Link>
                    </div>
                </div>
                <div className="border-2 border-blue-400 w-fit h-fit">
                    <Image
                        src={playStoreQR}
                        alt="QR code for app download"
                        width={400}
                        height={400}
                        className="w-full h-auto sm:w-[200px] lg:w-[310px] xl:w-[400px]"
                        priority
                    />
                </div>
            </div>
        </div>
    )
}