import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.svg";

export default function Navbar() {
  return (
    <header
      className={`w-full bg-[#043940] text-[#07C3BB] font-normal leading-[150%] tracking-[0.08px]`}
    >
      <div className="container grid grid-cols-[auto_auto] items-center justify-between gap-4">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            width={156}
            height={50}
            className="w-50 sm:w-72.5"
          />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base py-4!">
          <Link href="/login" className="px-2 sm:px-4 py-0.5 sm:py-2 border border-[#07C3BB] rounded-lg sm:rounded-xl hover:rounded-md hover:bg-[#07C3BB] hover:text-white transition-all duration-300">
            Sign in
          </Link>
          <Link href="/sign-up" className="px-2 sm:px-4 py-0.5 sm:py-2 border border-[#07C3BB] bg-[#07C3BB] text-white rounded-lg sm:rounded-xl hover:rounded-md hover:bg-transparent hover:text-[#07C3BB] transition-all duration-300">
            Join Now
          </Link>
        </div>
      </div>
    </header>
  );
}
