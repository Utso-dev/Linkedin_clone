import Image from "next/image";
import React from "react";

import person1 from "@/public/images/aboutUs/Person card.png";
import person2 from "@/public/images/aboutUs/Person card (1).png";
import person3 from "@/public/images/aboutUs/Person card (2).png";
import person4 from "@/public/images/aboutUs/Person card (3).png";
import person5 from "@/public/images/aboutUs/Person card (4).png";
import person6 from "@/public/images/aboutUs/Person card (5).png";
import person7 from "@/public/images/aboutUs/Person card (6).png";
import person8 from "@/public/images/aboutUs/Person card (7).png";
import person9 from "@/public/images/aboutUs/Person card (8).png";
import person10 from "@/public/images/aboutUs/Person card (9).png";
import person11 from "@/public/images/aboutUs/Person card (10).png";
import person12 from "@/public/images/aboutUs/Person card (11).png";
import person13 from "@/public/images/aboutUs/Person card (12).png";
import person14 from "@/public/images/aboutUs/Person card (13).png";
import person15 from "@/public/images/aboutUs/Person card (14).png";
import person16 from "@/public/images/aboutUs/Person card (15).png";

const demoImages = [
    person1,
    person2,
    person3,
    person4,
    person5,
    person6,
    person7,
    person8,
    person9,
    person10,
    person11,
    person12,
    person13,
    person14,
    person15,
    person16,
];

export default function MeetTheTeam() {
    return (
        <section className="py-8 md:py-20">
            <div className="grid grid-cols-1 overflow-hidden md:grid-cols-2">
                {/* Left */}
                <div className="flex min-h-[370px] items-center bg-[#021311] px-5  lg:px-16">
                    <div className="max-w-md">
                        <p className="mb-2 text-primaryColor font-semibold">
                            Meet Our Team
                        </p>

                        <h2 className=" text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.2] text-white">
                            Meet The
                            <br />
                            <span className="text-primaryColor">Mind Unite Team</span>
                        </h2>

                        <p className="mt-2 text-base leading-7 text-[#D2D2D5]">
                            Our leadership team is a collective of highly motivated
                            professionals who...
                        </p>

                        <button className="mt-8 rounded-lg bg-primaryColor px-6 py-3 text-white cursor-pointer">
                            Meet the team →
                        </button>
                    </div>
                </div>

                {/* Right */}
                <div className="flex min-h-[550px] items-center justify-center bg-[#F6F8FA] p-5  md:p-10">
                    <div className="grid grid-cols-4 gap-[2px]">
                        {demoImages.map((image, index) => (
                            <Image
                                key={index}
                                src={image}
                                alt={`Team ${index + 1}`}
                                className="h-[120px] w-[120px] object-cover"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}