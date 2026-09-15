import { StaticImageData } from "next/image";

export type Testimonial = {
  id: string;
  review: string;
  rating: number;
  imgUrl: StaticImageData;
  reviewer: {
    name: string;
    occupation: string;
    location: string;
    avatarUrl: any;
  };
};

export type OurImpactType = {
  id: string;
  title: string;
  description: string;
  Icon: any;
  value: string;
  uniqueKey: string;
  bgColor: string;
  IconBgColor: string;
};

export interface UserProfileType {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  title: string | null;
  profile_image: string | null;
  profile_image_url: string | null;
  subscription: {
    plan_name: string;
    status: string;
    will_renew: boolean;
    is_subscribed: boolean;
    features: string[];
  };
  cover_image: string | null;
  username: string;
  user: any;
  cover_image_url: string | null;
}

export interface ConnectionRequestType {
  id: number;
  status: "pending" | "accepted" | "ignored" | "declined";
  status_label: string;
  action_label: string;
  is_incoming: boolean;
  is_outgoing: boolean;
  is_connectable: boolean;
  is_following_back: boolean;
  is_followed_back: boolean;
  can_accept: boolean;
  can_ignore: boolean;
  connected_since: string | null;
  user: UserProfileType;
  mutual_connections_count: number;
  mutual_connections: any[];
  message: string;
  direction: "incoming" | "outgoing";
  requested_at: string;
  responded_at: string | null;
}

export type EmpOpportunityType = {
  id: string;
  title: string;
  location: string;
  company: string;
  type: "Full Time" | "Part Time" | "Internship" | "Contract";
  mode: "Remote" | "On-site" | "Hybrid";
  salaryRange: string;
  postedTime: string;
};

export type USAMapType = {
  id: number;
  name: string;
  code: string;
  slug: string;
  total_resources: number;
};

export type InstitutionType =
  | "university_hospital"
  | "state_institution"
  | "residency_program";

export type HospitalType = {
  id: number;
  state_id: number;
  name: string;
  location: string;
  type: InstitutionType;
  university_id: number | null;
  created_at: string;
  updated_at: string;
};

export interface GroupMembershipPivotType {
  user_id: number;
  group_id: number;
  role: "admin" | "member" | "moderator";
  created_at: string;
  updated_at: string;
}

export interface GroupDetailType {
  id: number;
  name: string;
  description: string;
  logo: string;
  cover_photo: string;
  total_member: number;
  industry: string[];
  location: string;
  rules: string;
  creator_id: number;
  type: "public" | "private";
  discoverability: "listed" | "unlisted";
  allow_member_invites: boolean;
  require_post_approval: boolean;
  created_at: string;
  updated_at: string;
  members_count: number;
  logo_url: string;
  cover_photo_url: string;

  // Relations
  creator: UserProfileType;
  pivot?: GroupMembershipPivotType;
}

export interface Institution {
  id: number;
  name: string;
}

export interface EducationType {
  id: number;
  user_id: number;
  institution_id: number;
  is_own_profile: boolean;
  degree: string;
  field_study: string;
  start_month: string;
  start_year: string;
  end_month: string | null;
  end_year: string | null;
  grade: string | null;
  description: string | null;
  activities: string | null;
  is_current: boolean;
  skills_id: number[];
  created_at: string;
  updated_at: string;
  skills_data: any[];
  status: "Complete" | "Ongoing" | "Incomplete";
  institution: Institution;
}

export interface PostMediaType {
  id: number;
  post_id: number;
  file_path: string;
  type: "image" | "video";
  order: number;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface PostFeedType {
  id: number;
  user: UserProfileType;
  description: string;
  relationship_status: "connected" | "not_connected" | "pending" | "declined";
  visibility: "public" | "groups" | "connections";
  who_can_comment: "anyone" | "connections" | "no_one";
  total_like: number;
  liked_by_me: boolean;
  total_comment: number;
  is_connected: boolean;
  media: PostMediaType[];
  group: any;
  created_at: string;
  can_edit: boolean;
  can_delete: boolean;
}

export interface IndustryItemType {
  id: number;
  category_id: number;
  title: string;
  tag: string | null;
  sub_title: string;
  description: string;
  image: string;
  extra_tag: string | null;
  pub_date: string;
  moa: string;
  indication: string;
  image_url: string;
  link: string;
}

export interface IndustryCategoryType {
  id: number;
  section_id: number;
  category_name: string;
  industry_item: IndustryItemType[];
}

export interface IndustryDataType {
  id: number;
  network_type: string;
  industry_type: string;
  name: string;
  created_at: string; // ISO Date String
  updated_at: string; // ISO Date String
  industry_category: IndustryCategoryType[];
}
