

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
  