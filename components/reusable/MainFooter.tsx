import Image from "next/image";
import Link from "next/link";

import SocialShare from "./SocialShare";
import balckImage from "@/public/black_Logo.png";

function MainFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="  border-t border-[#DFE1E7] bg-whiteColor py-10">
      <div className="container py-5 sm:py-6">
        <div className="flex flex-col gap-5 sm:gap-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start sm:gap-8">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Image
                  src={balckImage}
                  alt="Logo"
                  width={296}
                  height={50}
                  className="w-full max-w-32.5 lg:max-w-60.5 h-auto "
                  priority
                />
              </Link>
            </div>

            <p className="max-w-100.25 text-left text-base md:text-xl lg:text-2xl leading-tight text-[#54565a]">
              The networking platform for brain health professionals and
              students.
            </p>
          </div>

          <div className="h-px w-full bg-[#c9cccf]" />

          <div className="flex flex-col gap-4 sm:flex-row justify-center sm:items-end sm:justify-between">
            <div className="flex flex-col items-center sm:items-start space-y-2">
              <p className="mb-3 text-[14px] md:text-base font-medium text-primaryColor">
                Communicate. Collaborate. Connect.
              </p>
              <SocialShare />
            </div>

            <div className="flex flex-col md:flex-row  items-center gap-1.5" >
              <p className="sm:text-right text-center text-sm text-[#A5A5AB] hidden md:block"> &copy; {year} Mind Unite, All Rights Reserved.</p>

              <div className="flex gap-1.5">
                <Link href="/terms-conditions" className=" text-sm font-normal text-primaryColor">
                  Terms & Conditions
                </Link>
                <hr className="h-5 border-[#4A4C56] border w-[2px]" />
                <Link href="/privacy-policy" className=" text-sm font-normal text-primaryColor">
                  Privacy Policy
                </Link>
              </div>
              <p className="sm:text-right text-center text-sm text-[#A5A5AB] block md:hidden"> &copy; {year} Mind Unite, All Rights Reserved.</p>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MainFooter;
