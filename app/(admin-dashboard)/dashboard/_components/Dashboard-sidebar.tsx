import { AcademicIcon, AdvertizementIcon, BasicUserIcon, CategoryIcon, EmploymentIcon, FacilitesIcon, NeuroscienceIcon, PartnerIcon, PaymentManagementIcon, PlatFromIcon, PremiumUserIcon, ProUserIcon, PsychologyIcon, ResendenceIcon, SubPlanIcon, SubscriptIcon, SubTranscIcon, UniversitiseIcon, UserManagementIcon } from "@/public/svgIcons/AdminIcon";
import {
  LayoutDashboard,
  UsersRound,
  Tag,
  DollarSign,
  Megaphone,
  List,
  Brain,
  BrainCircuit,
  Shapes,
  Settings,
  BarChart3,
  LogOut,
  GraduationCap,
  UserRound,
  Crown,
  BriefcaseBusiness,
  Bell,
  Shield,
} from "lucide-react";
import { LuChartNoAxesColumn, LuUsers } from "react-icons/lu";
import { MdOutlineDashboardCustomize } from "react-icons/md";

export interface SidebarChild {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
}

export interface SidebarItem {
  id: string;
  name: string;
  href?: string;
  icon: React.ElementType;
  children?: SidebarChild[];
}

export const SidebarData: SidebarItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: "/dashboard",
    icon: MdOutlineDashboardCustomize,
  },

  {
    id: "users",
    name: "Users Management",
    icon: UserManagementIcon,
    children: [
      {
        id: "basic-users",
        name: "Basic Users",
        href: "/dashboard/user-management/basic-user",
        icon: BasicUserIcon,
      },
      {
        id: "premium-users",
        name: "Premium Users",
        href: "/dashboard/user-management/premium-users",
        icon: PremiumUserIcon,
      },
      {
        id: "pro-users",
        name: "Pro Industry Users",
        href: "/dashboard/user-management/pro-users",
        icon: ProUserIcon,
      },
    ],
  },

  {
    id: "subscription",
    name: "Subscription",
    // href: "/dashboard/subscription",
    icon: SubscriptIcon,
    children: [
      {
        id: "subscription-overview",
        name: "Overview",
        href: "/dashboard/subscription/overview",
        icon: LuChartNoAxesColumn,
      },
      {
        id: "plan-pricing",
        name: "Plan and Pricing",
        href: "/dashboard/subscription/plan-pricing",
        icon: SubPlanIcon,
      },
      {
        id: "transactions",
        name: "Transactions",
        href: "/dashboard/subscription/transactions",
        icon: SubTranscIcon,
      },
    ]
  },

  {
    id: "payments",
    name: "Payment Management",
    href: "/dashboard/payments",
    icon: PaymentManagementIcon,
  },

  {
    id: "advertise",
    name: "Advertise Management",
    href: "/dashboard/advertisement",
    icon: AdvertizementIcon,
  },

  {
    id: "platform-content",
    name: "Platform Content",
    icon: PlatFromIcon,
    children: [
      {
        id: "content",
        name: "Content Management",
        href: "/dashboard/platform-content",
        icon: List,
      },
      {
        id: "categories",
        name: "Categories",
        href: "/dashboard/categories",
        icon: Shapes,
      },
    ],
  },

  {
    id: "academia",
    name: "Academia",
    icon: AcademicIcon,
    children: [
      {
        id: "universities",
        name: "Universities",
        href: "/dashboard/academia/universites",
        icon: UniversitiseIcon,
      },
      {
        id: "residencies",
        name: "Residencies",
        href: "/dashboard/academia/residencies",
        icon: ResendenceIcon,
      },
      {
        id: "facilities",
        name: "Facilities",
        href: "/dashboard/academia/facilities",
        icon: FacilitesIcon,
      },
      {
        id: "employment",
        name: "Employment",
        href: "/dashboard/academia/employment",
        icon: EmploymentIcon,
      },
    ],
  },

  {
    id: "categories",
    name: "Categories",
    icon: CategoryIcon,
    children: [
      {
        id: "psychology",
        name: "Psychology",
        href: "/dashboard/categories/psychology",
        icon: Brain,
      },

      {
        id: "neuroscience",
        name: "Neuroscience",
        href: "/dashboard/categories/neuroscience",
        icon: NeuroscienceIcon,
      },
    ],
  },

  {
    id: "psychology",
    name: "Psychology",
    icon: Brain,
    children: [
      {
        id: "biotechnology",
        name: "Biotechnology",
        href: "/dashboard/phychology/biotechnology",
        icon: Brain,
      },
      {
        id:  "psychotropics",
        name: "Psychotropics",
        href: "/dashboard/phychology/psychotropics",
        icon: Brain,
      },
      {
        id:  "publications",
        name: "Publications",
        href: "/dashboard/phychology/publications",
        icon: Brain,
      },
    ],
  },

  {
    id: "neuroscience",
    name: "Neuroscience",
    icon: NeuroscienceIcon,
    children: [
      {
        id: "neuroscience-content",
        name: "Neuroscience Content",
        href: "/dashboard/neuroscience",
        icon: BrainCircuit,
      },
    ],
  },

  {
    id: "partner-program",
    name: "Partners",
    href: "/dashboard/partners",
    icon: PartnerIcon,
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    children: [
      {
        id: "general-settings",
        name: "General Settings",
        href: "/dashboard/settings/general-settings",
        icon: Settings,
      },
      {
        id: "notification-settings",
        name: "Notification Settings",
        href: "/dashboard/settings/notification-settings",
        icon: Bell,
      },
      {
        id: "security-settings",
        name: "Security Settings",
        href: "/dashboard/settings/security",
        icon: Shield,
      },
    ],
  },
];