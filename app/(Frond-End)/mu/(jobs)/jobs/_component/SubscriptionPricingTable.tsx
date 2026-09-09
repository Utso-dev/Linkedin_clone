import { HiBadgeCheck } from "react-icons/hi";

const plansData = {
  columns: [
    {
      key: "standard",
      title: "Standard",
      price: "Free",
      isButtonOutlined: true,
    },
    {
      key: "premium",
      title: "Premium",
      price: "$6.99",
      period: "/Month",
      isPrimary: true,
    },
    {
      key: "industryPro",
      title: "Industry Pro",
      price: "$9.99",
      period: "/Month",
      isPrimary: true,
    },
  ],
  features: [
    {
      name: "Create Your Professional Profile",
      standard: true,
      premium: true,
      industryPro: true,
    },
    {
      name: "Search Mind Unite Profiles",
      standard: true,
      premium: true,
      industryPro: true,
    },
    {
      name: "Profile View Visibility",
      standard: "Last 5 viewers",
      premium: "Unlimited",
      industryPro: "Unlimited",
    },
    {
      name: "Endorsements & Recommendations",
      standard: true,
      premium: true,
      industryPro: true,
    },
    {
      name: "Build Your Network",
      standard: "Up to 500 Users",
      premium: "Unlimited",
      industryPro: "Unlimited",
    },
    {
      name: "Send A Connection Request",
      standard: "Up to 10/day",
      premium: "Unlimited",
      industryPro: "Unlimited",
    },
    {
      name: "Unlimited Direct Messaging",
      standard: "Within Network",
      premium: "Across Mind Unite",
      industryPro: "Across Mind Unite",
    },
    {
      name: "Join a Collaboration Group",
      standard: "Up to 3 Groups",
      premium: "Unlimited",
      industryPro: "Unlimited",
    },
    {
      name: "Posts, Articles, Photos, Videos",
      standard: "Within Network",
      premium: "Across Mind Unite",
      industryPro: "Across Mind Unite",
    },
    {
      name: "Job Search",
      standard: true,
      premium: true,
      industryPro: true,
    },
    {
      name: "Job Applications- Submit a CV/Resume",
      standard: false,
      premium: true,
      industryPro: true,
    },
    {
      name: "Job Alerts",
      standard: false,
      premium: true,
      industryPro: true,
    },
    {
      name: "Unlimited InMail Messages",
      standard: false,
      premium: true,
      industryPro: true,
    },
    {
      name: "Saved Searches & Their Weekly Alerts",
      standard: false,
      premium: true,
      industryPro: true,
    },
    {
      name: "Interactive Media",
      standard: false,
      premium: true,
      industryPro: true,
    },
    {
      name: "Profile Viewer Insights",
      standard: false,
      premium: true,
      industryPro: true,
    },
    {
      name: "Receive Unlimited Messages",
      standard: false,
      premium: true,
      industryPro: true,
    },
    {
      name: "Connect with Organizations",
      standard: false,
      premium: true,
      industryPro: true,
    },
    {
      name: "Product Advertisement",
      standard: false,
      premium: false,
      industryPro: true,
    },
  ],
};

const CrossIcon = () => (
  <svg
    className="w-4 h-4 text-red-500 inline-block"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function SubscriptionPricingTable() {
  const renderCellContent = (value) => {
    if (typeof value === "boolean") {
      return value ? (
        <HiBadgeCheck className="text-primaryColor" />
      ) : (
        <CrossIcon />
      );
    }
    return <span className="text-headerColor text-sm font-normal">{value}</span>;
  };

  return (
    <div className="">
      <div className="border border-borderColor rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-borderColor">
              {/* Feature Header */}
              <th className="w-1/4 p-6 text-left align-top border-r border-borderColor">
                <h2 className="text-2xl font-bold text-headerColor tracking-tight">
                  Features
                </h2>
                <p className="text-sm text-grayColor1 mt-1 font-normal leading-relaxed">
                  Choose your workspace plan according to your organisational
                  plan
                </p>
              </th>

              {/* Plan Headers */}
              {plansData.columns.map((col, idx) => (
                <th
                  key={col.key}
                  className={`w-1/4 p-6 text-center align-top ${
                    idx < plansData.columns.length - 1
                      ? "border-r border-borderColor"
                      : ""
                  }`}
                >
                  <h3 className="text-xl font-bold text-headerColor mb-3">
                    {col.title}
                  </h3>
                  {col.isButtonOutlined ? (
                    <button className="w-full cursor-pointer py-2 border border-primaryColor text-headerColor font-medium rounded-md text-sm hover:bg-teal-50 transition-colors">
                      {col.price}
                    </button>
                  ) : (
                    <button className="w-full cursor-pointer py-2 bg-primaryColor text-white font-medium rounded-md text-sm hover:bg-primaryColorHover transition-colors">
                      <span>{col.price}</span>
                      <span className="text-[11px] font-light opacity-90">
                        {col.period}
                      </span>
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {plansData.features.map((row, index) => (
              <tr
                key={index}
                className={`transition-colors hover:bg-slate-50 ${
                  index !== plansData.features.length - 1
                    ? "border-b border-borderColor"
                    : ""
                }`}
              >
                {/* Feature Name */}
                <td className="p-4 px-6 text-sm font-semibold text-primaryColor border-r border-borderColor ">
                  {row.name}
                </td>
                {/* Plan Values */}
                {plansData.columns.map((col, cIdx) => (
                  <td
                    key={col.key}
                    className={`p-4 text-center  ${
                      cIdx < plansData.columns.length - 1
                        ? "border-r border-borderColor"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-center text-center ">
                    {renderCellContent(row[col.key])}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
