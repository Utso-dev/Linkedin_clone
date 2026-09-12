

export interface Subscriber {
  name: string;
  image: string;
}

export interface SubscriptionPlan {
  name: string;
  amount: string;
  billing_cycle: "monthly" | "yearly";
}

export interface Subscription {
  id: number;
  subscriber: Subscriber;
  plan: SubscriptionPlan;
  status: "active" | "cancelled" | "expired" | "past_due";
  billing_cycle: "monthly" | "yearly";
  next_billing_date: string;
  days_left: number;
  cancel_at_period_end: boolean;
  joined_at: string;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface GetSubscriptionsResponse {
  success: boolean;
  data: Subscription[];
  pagination: Pagination;
}

export interface GetSubscriptionsParams {
  query?: {
    page?: number;
    per_page?: number;
    status?: Subscription["status"];
    [key: string]: unknown;
  };
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message?: string;
}

// Transaction Stats Type

export type StatDirection = "up" | "down" | "flat";

export interface TransactionStatus {
  label: string;
  value: number;
  previous_value: number;
  difference: number;
  change_percent: number | null;
  direction: StatDirection;
}

export interface GetTransactionStatusResponse {
  success: boolean;
  data: TransactionStatus[];
}


// Transaction History Table

export interface TransactionSubscriber {
  name: string;
  image: string;
}

export interface TransactionPlan {
  name: string;
  amount: string;
  billing_cycle: "monthly" | "yearly";
}

export type TransactionStatusType =
  | "pending"
  | "succeeded"
  | "failed"
  | "refunded"
  | "partially_refunded";

export interface Transaction {
  id: number;
  transaction_id: string;
  subscriber: TransactionSubscriber;
  plan: TransactionPlan;
  amount: string;
  currency: string;
  status: TransactionStatusType;
  card_brand: string;
  card_last4: string;
  refunded_amount: string;
  purchased_at: string;
}

export interface GetTransactionsResponse {
  success: boolean;
  data: Transaction[];
  pagination: Pagination;
}

export interface GetTransactionsParams {
  query?: {
    page?: number;
    per_page?: number;
    status?: TransactionStatusType;
    [key: string]: unknown;
  };
}


// plan and pricing

export type PlanBillingCycle = "monthly" | "yearly";
export type PlanStatus = "active" | "inactive";

export interface Plan {
  id: number;
  name: string;
  short_description: string;
  billing_rate: string;
  billing_cycle: PlanBillingCycle;
  discount_percent: string;
  discount_duration: string; // ISO datetime
  badge_color: string;
  status: PlanStatus;
  features: string[];
  subscribers?: number;
  created_at: string;
  updated_at: string;
}

export interface GetPlansResponse {
  success: boolean;
  data: Plan[];
}

export interface PlanPayload {
  name: string;
  short_description: string;
  billing_rate: number;
  billing_cycle: PlanBillingCycle;
  discount_percent: number;
  discount_duration: string; // "YYYY-MM-DD"
  badge_color: string;
  status: PlanStatus;
  features: PlanFeatureValue[];
}

export interface CreatePlanResponse {
  success: boolean;
  data: Plan;
}

export interface UpdatePlanResponse {
  success: boolean;
  data: Plan;
}

export interface UpdatePlanArgs {
  id: number | string;
  body: PlanPayload;
}

export interface DeletePlanResponse {
  success: boolean;
  message?: string;
}


// features list:
export type PlanFeatureValue =
  | "company_profile"
  | "build_network"
  | "collaboration_groups"
  | "direct_messaging"
  | "posts_articles_photos_videos"
  | "profile_views_insights"
  | "job_applications"
  | "connect_organizations"
  | "product_advertisement";

export interface PlanFeatureOption {
  value: PlanFeatureValue;
  label: string;
}

export interface GetPlanFeaturesResponse {
  success: boolean;
  data: PlanFeatureOption[];
}