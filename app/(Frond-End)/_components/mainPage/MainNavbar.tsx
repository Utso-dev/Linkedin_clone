"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { cn } from "@/lib/utils";
import mainLogo from "@/public/logo.png";
import {
  AboutIcon,
  ClinicalIcon,
  ContactUsIcon,
  GlobalIcon,
  HomeIcon,
  JobsIcon,
  MenueArrowDownIcon,
  MultiUserIcon,
  PsychologyMenuIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState, type ComponentType } from "react";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { useRealtimeNotifications } from "../../mu/(muGroup)/(home_network)/notification/_components/useRealtimeNotifications";
import UserHeaderInfo from "./UserHeaderInfo";

type MenuItem = {
  label: string;
  slug: string;
  icon: ComponentType<{ className?: string }>;
  isDropdown?: boolean;
  dropdownItems?: Array<{ label: string; slug: string }>;
};

export default function  MainNavbar() {
  const pathname = usePathname();
  const params = useParams();

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdownSlug, setOpenDropdownSlug] = useState<string | null>(null);
  const [openMobileDropdownSlug, setOpenMobileDropdownSlug] = useState<
    string | null
  >(null);

  const user = useGetUserProfileQuery("userProfile").data;

  useRealtimeNotifications(user?.user.id);

  const menuItems: MenuItem[] = [
    { label: "Home", slug: "/mu/home", icon: HomeIcon },
    { label: "About Us", slug: "/mu/about-us", icon: AboutIcon },

    { label: "Academia", slug: "/mu/academia?redirect=home", icon: GlobalIcon },
    {
      label: "My Network",
      slug: "/mu/my-network/my-connection",
      icon: MultiUserIcon,
    },
    {
      label: "Psychology Network",
      slug: "/mu/psychology-network",
      icon: PsychologyMenuIcon,
      isDropdown: true,
      dropdownItems: [
        { label: "Psychology Fields", slug: "/mu/psychology-network/fields" },
        {
          label: "Psychology Careers",
          slug: "/mu/psychology-network/careers",
        },
        {
          label: "Industry",
          slug: "/mu/psychology-network/industry/biotechnology",
        },
        { label: "Jobs", slug: "/mu/psychology-network/jobs" },
      ],
    },
    {
      label: "Neuroscience Network",
      slug: "/mu/neuroscience-network",
      icon: ClinicalIcon,
      isDropdown: true,
      dropdownItems: [
        {
          label: "Neuroscience Fields",
          slug: "/mu/neuroscience-network/fields",
        },
        {
          label: "Neuroscience Careers",
          slug: "/mu/neuroscience-network/careers",
        },
        {
          label: "Industry",
          slug: "/mu/neuroscience-network/industry/biotechnology",
        },
        { label: "Jobs", slug: "/mu/neuroscience-network/jobs" },
      ],
    },
    { label: "Jobs", slug: "/mu/jobs", icon: JobsIcon },
    { label: "Contact Us", slug: "/mu/contact-us", icon: ContactUsIcon },
  ];

  const isActive = (href: string): boolean => {
    if (href === "/mu/home") {
      return pathname === "/mu/home";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="py-2.5 md:px-4 sticky top-0 left-0 w-full bg-whiteColor shadow-[0_2px_4px_0_rgba(0,0,0,0.03),0_16px_24px_0_rgba(0,0,0,0.01)] z-99">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/mu/home">
          <Image
            src={mainLogo}
            alt="Logo"
            width={250}
            height={150}
            className="md:max-w-59.5 max-w-40 w-full h-auto"
            priority
          />
        </Link>

        <nav className="hidden space-x-6 text-base min-[1132px]:flex">
          {menuItems.map((item) => {
            if (item.isDropdown) {
              const isDropdownOpen = openDropdownSlug === item.slug;

              return (
                <DropdownMenu
                  key={item.slug}
                  modal={false}
                  open={isDropdownOpen}
                  onOpenChange={(open) =>
                    setOpenDropdownSlug(open ? item.slug : null)
                  }
                >
                  <DropdownMenuTrigger asChild className="focus:outline-0">
                    <button
                      type="button"
                      className={cn(
                        "group flex w-fit flex-col items-center gap-1 text-sm transition cursor-pointer hover:text-headerColor",
                        isActive(item.slug) || isDropdownOpen
                          ? "text-headerColor"
                          : "text-grayColor1",
                      )}
                    >
                      <item.icon className="h-4.5 w-4.5" />
                      <span className="flex items-center gap-1">
                        {item.label}
                        <MenueArrowDownIcon
                          className={cn(
                            "inline-block h-3 w-3 transition-transform duration-200",
                            isDropdownOpen
                              ? "rotate-180 text-headerColor"
                              : "text-grayColor1",
                          )}
                        />
                      </span>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="center"
                    className="mt-3 w-51.25  rounded-xl bg-whiteColor p-2 shadow-[0_10px_25px_rgba(0,0,0,0.08)]"
                  >
                    {item.dropdownItems?.map((dropdownItem, index) => (
                      <DropdownMenuItem
                        key={dropdownItem.slug}
                        asChild
                        className={cn(
                          "cursor-pointer hover:bg-bgLightColor rounded-none px-3 py-2! text-base font-medium text-headerColor focus:bg-transparent",
                          index !== item.dropdownItems!.length - 1
                            ? "border-b border-borderColor"
                            : "",
                        )}
                      >
                        <Link href={dropdownItem.slug}>
                          {dropdownItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={item.slug}
                href={item.slug}
                className={cn(
                  "flex w-fit flex-col items-center gap-1 text-sm transition hover:text-headerColor",
                  isActive(item.slug) ? "text-headerColor" : "text-grayColor1",
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center space-x-3.5 min-[1132px]:flex">
          <UserHeaderInfo />
        </div>

        <div className="flex items-center gap-2 min-[1132px]:hidden">
          <UserHeaderInfo />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl border p-0.5 rounded text-headerColor focus:outline-none"
          >
            {menuOpen ? <HiX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-screen w-full space-y-3 bg-blackColor/20 backdrop-blur-xs transform transition-transform duration-300 ease-in-out min-[1132px]:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="absolute top-0 right-0 h-full max-w-[320px] w-[80%] bg-primaryColor p-4">
          <div className="mb-2 flex w-full items-center justify-between">
            <Image src={mainLogo} alt="Logo" width={150} height={150} />
            <button
              aria-label="close-menu"
              className="absolute top-4  right-4 z-10 text-white"
              onClick={() => setMenuOpen(false)}
            >
              <HiX className="text-2xl text-whiteColor" />
            </button>
          </div>

          {menuItems.map((item) => {
            const isMobileDropdownOpen = openMobileDropdownSlug === item.slug;

            if (item.isDropdown) {
              return (
                <div key={item.slug} className="py-1">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMobileDropdownSlug((previous) =>
                        previous === item.slug ? null : item.slug,
                      )
                    }
                    className={cn(
                      "flex w-full items-center rounded-sm justify-between gap-2 p-2 text-base",
                      isActive(item.slug)
                        ? "text-primaryColor bg-whiteColor"
                        : "text-white",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4.5 w-4.5" />
                      {item.label}
                    </span>
                    <MenueArrowDownIcon
                      className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        isMobileDropdownOpen
                          ? "rotate-180 text-primaryColor"
                          : isActive(item.slug)
                            ? "text-primaryColor bg-whiteColor"
                            : "text-white",
                      )}
                    />
                  </button>

                  {isMobileDropdownOpen && (
                    <div className="ml-6 mt-1 space-y-0.5  border-l border-white/20 pl-3">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.slug}
                          href={dropdownItem.slug}
                          className={cn(
                            "block p-1.5 rounded-sm text-sm text-white/90 transition hover:text-primaryColor hover:bg-white",
                            pathname === dropdownItem.slug
                              ? "text-primaryColor bg-whiteColor"
                              : "text-white/90",
                          )}
                          onClick={() => {
                            setMenuOpen(false);
                            setOpenMobileDropdownSlug(null);
                          }}
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.slug}
                href={item.slug}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-sm text-base",
                  pathname === item.slug
                    ? "text-primaryColor bg-whiteColor"
                    : "text-white",
                )}
                onClick={() => {
                  setMenuOpen(false);
                  setOpenMobileDropdownSlug(null);
                }}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
