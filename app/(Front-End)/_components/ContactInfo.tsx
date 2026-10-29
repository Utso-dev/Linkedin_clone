import { IoMailSharp } from "react-icons/io5";

import SocialShare from "@/components/reusable/SocialShare";

function ContactInfo() {
  return (
    <div>
      <div className="w-full   p-4 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <h2 className="text-3xl lg:text-5xl font-semibold ">
              Get in Touch
            </h2>
            <p className="text-descriptionColor mt-2 text-base md:text-lg">
              Have a question or suggestion?
            </p>
            <p className="text-descriptionColor mt-2 text-base md:text-lg md:ml-14">
              Found a mistake?
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className=" p-2 bg-white rounded-full">
                <IoMailSharp className=" text-primaryColor" />
              </div>
              <span className="text-gray-600">contact@mindunite.com</span>
            </div>
            {/* <div className="flex items-center gap-3">
              <div className=" p-2 bg-white rounded-full">
                <MdCall size={18} className="  text-primaryColor" />
              </div>
              <span className="text-gray-600">+6726 664 074</span>
            </div> */}
          </div>
        </div>
        <div className="mt-4">
          <SocialShare />
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
