import {
  AboutIcon,
  AdvertisementIcon,
  BarChartIcon,
  BillingIcon,
  ClinicalIcon,
  ContactUsIcon,
  DashboardIcon,
  GeneralSettingIcon,
  GlobalIcon,
  GroupUserIcon,
  HomeIcon,
  JobsIcon,
  MenueArrowDownIcon,
  MessageIcon,
  MultiUserIcon,
  PencileIcon,
  PlusUserIcon,
  PsychologyMenuIcon,
  PublicationsMenueIcon,
  RecommendedJobIcon,
  SaveJobIcon,
  SecurityIcon,
  SettingIcon,
  SingleUserIcon,
} from "@/public/svgIcons/Icons";
import { Plus } from "lucide-react";
import type { ComponentType } from "react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuShoppingBag } from "react-icons/lu";

export type MenuItem = {
  label: string;
  slug: string;
  icon: ComponentType<{ className?: string }>;
  isDropdown?: boolean;
  dropdownItems?: Array<{ label: string; slug: string }>;
};

export const mainMenuItems: MenuItem[] = [
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
      { label: "Psychology Careers", slug: "/mu/psychology-network/careers" },
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
      { label: "Neuroscience Fields", slug: "/mu/neuroscience-network/fields" },
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

export const networkMenuItems: MenuItem[] = [
  {
    label: "My Connections",
    slug: "/mu/my-network/my-connection",
    icon: MultiUserIcon,
  },
  {
    label: "Connection Requests",
    slug: "/mu/my-network/connection-requests",
    icon: PlusUserIcon,
  },
  {
    label: "Following & Followers",
    slug: "/mu/my-network/following",
    icon: SingleUserIcon,
  },
  { label: "Groups", slug: "/mu/my-network/groups", icon: GroupUserIcon },
];

export const jobsMenuItems: MenuItem[] = [
  { label: "All Jobs", slug: "/mu/jobs", icon: JobsIcon },
  {
    label: "Recommended Jobs",
    slug: "/mu/jobs/recommended-jobs",
    icon: RecommendedJobIcon,
  },
  {
    label: "Recently added jobs",
    slug: "/mu/jobs/recent-jobs",
    icon: Plus,
  },
  { label: "Saved job", slug: "/mu/jobs/saved-jobs", icon: SaveJobIcon },
];

export function getProIndustryMenuItems(
  industryId?: string | number | null,
): MenuItem[] {
  return [
    {
      label: "Industry Profile",
      slug: `/mu/industry-profile/${industryId ?? ""}`,
      icon: HiOutlineBuildingOffice2,
    },
    {
      label: "Recruiter Dashboard",
      slug: "/mu/recruiter-dashboard",
      icon: DashboardIcon,
    },
    { label: "Products", slug: "/mu/products", icon: LuShoppingBag },
    {
      label: "Advertisement",
      slug: "/mu/advertisment",
      icon: AdvertisementIcon,
    },
    {
      label: "Publications",
      slug: "/mu/publications",
      icon: PublicationsMenueIcon,
    },
    { label: "Job Listing", slug: "/mu/job-listing", icon: JobsIcon },
    { label: "Analytics", slug: "/mu/analytics", icon: BarChartIcon },
    { label: "Message", slug: "/mu/message", icon: MessageIcon },
    {
      label: "Post a job position",
      slug: "/mu/post-job-position",
      icon: PencileIcon,
    },
  ];
}

export const settingsMenuItems: MenuItem[] = [
  {
    label: "General Settings",
    slug: "/mu/settings/general",
    icon: GeneralSettingIcon,
  },
  {
    label: "Security Settings",
    slug: "/mu/settings/security",
    icon: SecurityIcon,
  },
  {
    label: "Billing History",
    slug: "/mu/settings/billing-history",
    icon: BillingIcon,
  },
];

export const sectionMenuIcons = {
  network: MultiUserIcon,
  jobs: JobsIcon,
  proIndustry: DashboardIcon,
  settings: SettingIcon,
};

export { MenueArrowDownIcon };
