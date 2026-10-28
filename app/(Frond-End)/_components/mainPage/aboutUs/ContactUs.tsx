"use client";
import { Mail } from "lucide-react";
import Image from "next/image";

import { useGetAboutUsQuery } from "@/feature/slice/aboutUs/aboutUs";
import ContactForm from "../../ContactForm";

export default function ContactUs() {
  const { data, error, isLoading } = useGetAboutUsQuery({});
  const item = data?.data.leading_institutions || [];

  return (
    <div className="py-8 md:py-14 lg:py-25 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 container">
        <div className="">
          <h4 className="text-black text-[32px] md:text-4xl lg:text-5xl font-semibold leading-normal text-center md:text-start">
            Contact Us{" "}
          </h4>
          <p className="text-[#494949] text-xl font-normal leading-130% mt-2 max-w-130.5 ">
            Have a question or suggestion? Found a mistake?{" "}
          </p>

          <div className="py-3 md:py-6">
            <p className="text-[#777980] text-xl font-normal leading-normal flex gap-2 py-2.5">
              <span>
                <Mail className="text-primaryColor my-auto mt-1" />{" "}
              </span>{" "}
              contact@mindunite.com
            </p>
          </div>

          <p className="text-[#0B0B0B] text-base font-medium leading-6 tracking-[0.08px] mb-4">
            Trusted by Students/Graduates/Faculty of Leading Institutions
          </p>

          <div className="">
            <div className="flex flex-wrap gap-6">
              {item.map((coin, index) => (
                <div
                  key={index}
                  className="flex h-12 w-12 items-center justify-center relative group"
                >
                  <Image
                    src={coin?.logo_url}
                    alt={`Coin ${index + 1}`}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                  <div className="absolute bottom-13 left-1/2 -translate-x-1/4 opacity-0 group-hover:opacity-100 transition-opacity bg-primaryColor text-white text-xs px-2 py-1 rounded">
                    {coin.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-[#FFFFFF] w-full">
          {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <ReusableInput id="name" label="Full Name*" className='rounded-xl' placeholder='Your full name' />
                        <ReusableInput id="Phone" label="Phone*" className='rounded-xl' placeholder='+1 0000 000 000' />
                        <ReusableInput id="email" label="Email*" className='rounded-xl' placeholder='Enter your email' />
                        <ReusableInput id="address" label="Address*" className='rounded-xl' placeholder='123 Main Street, City, Country' />
                    </div>
                    <ReusableInput id="subject" label="Subject*" className='rounded-xl' placeholder='Your subject' />
                    <ReusableTextarea id="message" label="Message*" className='rounded-xl h-[140px] px-2 py-3 border w-full' placeholder='Your message here...' />
                    <button className="w-full py-3 bg-primaryColor rounded-xl text-white text-base font-medium">Send Message</button> */}

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
