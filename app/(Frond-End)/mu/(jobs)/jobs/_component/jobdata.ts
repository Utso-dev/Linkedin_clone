export interface FilterOption {
  label: string;
  value: string;
}

export interface JobItem {
  id: string | number;
  title: string;
  company: string;
  companyUrl?: string;
  logo: string;
  location: string;
  jobType: "full-time" | "part-time" | "remote" | "short-term";
  workplaceType: "On-site" | "Remote" | "Hybrid";
  postedTime: string;
  easyApply: boolean;
  isVerified?: boolean;
  appliedCount: number;
}

export const JOB_TYPE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Full-Time", value: "full_time" },
  { label: "Part-Time", value: "part_time" },
  { label: "Internship", value: "internship" },
  { label: "Short-Term", value: "short_term" },
  { label: "Contract", value: "contract" },
];
export const WORKPLACE_TYPE_OPTIONS = [
  { label: "On-site", value: "on_site" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
];


export const INDUSTRY_OPTIONS = [
  { label: "Psychology", value: "psychology" },
  { label: "Neuroscience", value: "neuroscience" },
];

export const EXPERIENCE_LEVEL_OPTIONS = [
  { label: "Entry-level", value: "entry_level" },
  { label: "Senior-level", value: "senior_level" },
  { label: "Mid-level", value: "mid_level" },
  { label: "Executive-level", value: "executive_level" },
];

export const INITIAL_JOB_DATA: JobItem[] = [
  {
    id: 1,
    title: "UI/UX Designer- Betopia Group- Job ID:1496956",
    company: "www.betopiagroup.com/career",
    companyUrl: "https://betopiagroup.com",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
    location: "Dhaka, Gulshan 1 (On-site)",
    jobType: "full-time",
    workplaceType: "Remote",
    postedTime: "1 Week ago",
    easyApply: true,
    isVerified: true,
    appliedCount: 455,
  },
  {
    id: 2,
    title: "Consultant - Job ID:1345634",
    company: "HCL Financial Services",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=60",
    location: "Ontario CA",
    jobType: "full-time",
    workplaceType: "Remote",
    postedTime: "1 Week ago",
    easyApply: true,
    isVerified: false,
    appliedCount: 455,
  },
  {
    id: 3,
    title: "Entry Level Financial Advisor (Remote)",
    company: "Financial Fire",
    logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=60",
    location: "United States (Remote)",
    jobType: "remote",
    workplaceType: "Remote",
    postedTime: "1 Week ago",
    easyApply: true,
    isVerified: false,
    appliedCount: 455,
  },
  {
    id: 4,
    title: "Remote Travel Agent",
    company: "Exhilarating Getaways Travel",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&auto=format&fit=crop&q=60",
    location: "San Jose, CA (Remote)",
    jobType: "remote",
    workplaceType: "Remote",
    postedTime: "2 Week ago",
    easyApply: true,
    isVerified: false,
    appliedCount: 455,
  },
];
