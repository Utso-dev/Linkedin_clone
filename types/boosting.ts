// Preset Boost Packages
export interface BoostPackage {
  id: number;
  name: string;
  duration_days: number;
  price: number;
  daily_price: number;
  estimated_impressions: string;
  badge: string; // e.g. "Basic Free", "Most Popular Plan", "Best Value"
  features: string[];
  status?: "active" | "inactive";
  description?: string;
  target_entity?: string;
  promotion_highlight?: string;
}

// Custom Duration Slider
export interface CustomSliderConfig {
  enabled: boolean;
  daily_rate: number; // e.g. 3.00
  min_days: number;   // e.g. 3
  max_days: number;   // e.g. 60
  daily_estimated_impressions?: string;
  daily_estimated_impressions_min?: number;
  daily_estimated_impressions_max?: number;
}

// Packages API Response
export interface BoostPackagesResponse {
  success: boolean;
  data: {
    stripe_public_key: string;
    preset_packages: BoostPackage[];
    custom_slider: CustomSliderConfig;
  };
}

// Order Summary (Screen 3 & Screen 4)
export interface OrderSummary {
  product_id: string;          // e.g. "10XEYC"
  product_name: string;        // e.g. "BioPac MP160"
  product_image: string | null;
  plan_title: string;          // e.g. "Basic Free Boosting" or "Custom Boosting (20 Days)"
  duration_days: number;       // e.g. 7
  duration_text: string;       // e.g. "7 Days"
  estimated_impressions: string; // e.g. "Est. 5k – 10k Impression"
  subtotal: number;            // e.g. 19.99
  subtotal_formatted: string;  // e.g. "$19.99"
  vat: number;                 // e.g. 0.00
  vat_formatted: string;       // e.g. "$0.00"
  total: number;               // e.g. 19.99
  total_formatted: string;     // e.g. "$19.99"
  currency: string;            // "USD"
}

// Order Summary API Response
export interface OrderSummaryResponse {
  success: boolean;
  message: string;
  data: {
    product: {
      id: number;
      product_id: string;
      product_name: string;
      slug?: string;
      image_url: string | null;
    };
    order_summary: OrderSummary;
  };
}

// Send OTP Response
export interface SendOtpResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    requires_verification: boolean;
    product: {
      id: number;
      product_id: string;
      product_name: string;
      image_url: string | null;
    };
    order_summary: OrderSummary;
    cooldown_seconds?: number;
  };
}

// Purchase Success Response
export interface PurchaseBoostSuccessResponse {
  success: boolean;
  message: string;
  data: {
    requires_action: false;
    campaign: {
      id: number;
      boostable_id: number;
      ad_type: "product";
      amount_paid: string | number;
      duration_days: number;
      status: "active";
      starts_at: string;
      ends_at: string;
    };
    product: {
      id: number;
      product_name: string;
      is_boosted: boolean;
      boost_days_left: number;
      boost_remaining_text: string; // e.g. "7 days left"
    };
  };
}

// 3D Secure Action Response
export interface PurchaseRequiresActionResponse {
  success: boolean;
  message: string;
  data: {
    requires_action: true;
    payment_intent_client_secret: string;
    payment_status: "requires_action";
    campaign_id: number;
  };
}
