import React from 'react'
import Image from 'next/image'

import connectingImage from "@/public/images/aboutUs/connecting.png";

export default function ConnectingExpertise() {
    return (
        <div className='bg-[#F8FBFF]'>
            <div className='container'>
                <div className='py-8 md:py-12 lg:py-25 grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className='flex flex-col justify-center items-center md:items-start '>
                        <p className="text-primaryColor text-[18.804px] font-semibold leading-[130%] tracking-[0.094px]">What we do?</p>
                        <p className="text-[#0B0B0B] text-[32px] md:text-[38px] lg:text-[52.65px] font-semibold leading-[130%] mt-4 mb-8">
                            Connecting Expertise.
                            <span className='text-primaryColor'> Creating Opportunities.</span>
                        </p>


                        <p className="text-[#404040] text-2xl font-normal leading-[130%] tracking-[0.12px]">At Mind Unite, we attract Brain Health professionals and partner with Biotech,
                            Psychotropic, and Publication Companies to create an environment for
                            collaboration, resource optimization, and opportunity sharing in one location. ​</p>
                    </div>
                    <div>
                        <Image
                            src={connectingImage}
                            alt="Connecting Expertise"
                            className="w-full  "
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
