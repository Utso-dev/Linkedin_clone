import { ArrowRight } from 'lucide-react';
import React from 'react';

export default function PendingApproval() {

    const pendingData = [
        {
            title: "Products Pending",

            date: "11"
        },
        {
            title: "Jobs Pending",

            date: "13"
        },
        {
            title: "Advertisements pending",

            date: "35"
        },
        {
            title: "Reports",

            date: "17"
        }

    ]
    return (
        <div className='flex flex-col h-full'>
            <div className='border p-3 rounded-lg w-full h-full flex flex-col justify-between'>
                <p className="text-headerColor  text-[18px] font-semibold leading-[160%] pb-2">Pending Approval</p>


                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 h-full'>
                    {
                        pendingData.map((item, index) => {
                            return (
                                <div key={index} className='px-4 pt-4 pb-1 border border-[#DFDFDF] rounded-lg flex flex-col justify-between'>
                                    <div>
                                        <p className="text-[#777980]  text-[14px] font-normal leading-[140%] tracking-[0.07px]">{item.title}</p>
                                        <p className="text-headerColor  text-[24px] font-semibold leading-[130%] tracking-[0.12px] py-3">{item.date}</p>
                                    </div>
                                    <button className="text-primaryColor flex justify-center items-center bg-[#E9FAF7] w-full py-1 rounded-md  text-[14px] font-semibold leading-[140%] tracking-[0.07px] mt-auto">
                                        View Details <ArrowRight className='w-4 h-4 ml-1' />
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
