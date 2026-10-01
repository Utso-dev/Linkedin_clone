import { useGetSecurityOverviewQuery } from "@/feature/slice/admin/securitySettings";
import {
  CorrectIcon,
  CrossIcon,
  DangerIcon,
} from "@/public/svgIcons/AdminIcon";
import dayjs from "dayjs";
import { ShieldCheck } from "lucide-react";

interface SecurityOverviewProps {
  twoFactorEnabled: boolean;
}

interface SecurityStatusProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function SecurityStatus({ title, value, icon }: SecurityStatusProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#F1F1F1] px-4  py-5.5 last:border-0">
      <div className="flex items-center gap-2">
        {icon ? icon : <CorrectIcon />}

        <span
          className="overflow-hidden text-headerColor text-ellipsis text-sm font-semibold leading-[140%] tracking-[0.07px]
"
        >
          {title}
        </span>
      </div>

      <span
        className="overflow-hidden text-ellipsis text-[#4A4C56] text-[14px] font-normal leading-[140%] tracking-[0.07px]
"
      >
        {value}
      </span>
    </div>
  );
}

export default function SecurityOverview({
  twoFactorEnabled,
}: SecurityOverviewProps) {
  const { data, isLoading } = useGetSecurityOverviewQuery({});
  const OverviewData = data?.data || [];

  console.log(OverviewData);

  const rating = OverviewData?.security_score?.rating?.toLowerCase();

  const securityConfig = {
    weak: {
      progress: "#EF4444",
      track: "#FEE2E2",
      inner: "#FEF2F2",
      icon: "#EF4444",
    },

    medium: {
      progress: "#F59E0B",
      track: "#FEF3C7",
      inner: "#FFF8E7",
      icon: "#F59E0B",
    },
    strong: {
      progress: "#04A1B7",
      track: "#D9F4F7",
      inner: "#E6F6F8",
      icon: "#04A1B7",
    },
  };

  const config =
    securityConfig[rating as keyof typeof securityConfig] ||
    securityConfig.medium;

  const percentage = OverviewData?.security_score?.percentage ?? 0;
  const progressDegree = (percentage / 100) * 360;
  console.log(percentage, progressDegree);

  return (
    <section className="rounded-md  ">
      <div className=" border-[#EEEEEE] py-6">
        <h2 className="text-headerColor font-['Segoe_UI'] text-xl font-semibold leading-[130%] tracking-[0.1px]">
          Account Security Overview
        </h2>

        <p className="mt-1 text-[#4A4C56] font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px]">
          Review your account security status and take action to keep your
          account safe.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[328px_1fr]">
        {/* Security Score */}
        <div className="flex flex-col items-center justify-center border p-6 rounded-sm">
          <div className="relative flex h-38 w-38 items-center justify-center">
            {/* Progress Circle */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
        ${config.progress} 0deg ${progressDegree}deg,
        ${config.track} ${progressDegree}deg 360deg
      )`,
              }}
            />

            {/* Inner Background */}
            <div
              className="absolute inset-[10px] rounded-full"
              style={{
                backgroundColor: config.inner,
              }}
            />

            {/* Icon */}
            <div className="relative flex h-28 w-28 items-center justify-center">
              <ShieldCheck
                style={{ color: config.icon }}
                size={48}
                strokeWidth={2}
              />
            </div>
          </div>

          <p className="mt-4 text-[#4A4C56]  text-[14px] font-normal leading-[140%] tracking-[0.07px]">
            Security Score
          </p>

          <p
            className={` text-center text-2xl font-semibold leading-[130%] tracking-[0.12px] mt-1 ${OverviewData?.security_score?.rating === "Strong" ? "text-primaryColor" : OverviewData?.security_score?.rating === "Medium" ? "text-[#ffc107]" : "text-red-500"}`}
          >
            {OverviewData?.security_score?.rating}
          </p>

          <p className="text-[#4A4C56] text-sm font-normal leading-[140%] tracking-[0.07px] mt-1">
            Last checked:{" "}
            {dayjs(OverviewData?.security_score?.last_checked)
              .format("DD MMM YYYY, hh:mm A")
              .toUpperCase()}
          </p>
        </div>

        {/* Security Status */}
        <div className="space-y border rounded-sm">
          <SecurityStatus
            title="Password Strength"
            value={OverviewData?.password_strength}
            icon={<CorrectIcon />}
          />

          <SecurityStatus
            title="Two-Factor Authentication"
            value={OverviewData?.two_factor_auth}
            icon={
              OverviewData?.two_factor_enabled ? <CorrectIcon /> : <CrossIcon />
            }
          />

          <SecurityStatus
            title="Active Sessions"
            value={OverviewData?.active_sessions}
            icon={<CorrectIcon />}
          />

          <SecurityStatus
            title="Account Recovery"
            value={OverviewData?.account_recovery}
            icon={
              OverviewData?.recovery_email_verified ? (
                <CorrectIcon />
              ) : (
                <DangerIcon />
              )
            }
          />
          <SecurityStatus
            title="Login Activity"
            value={OverviewData?.login_activity}
            icon={
              OverviewData?.is_suspicious ? <DangerIcon /> : <CorrectIcon />
            }
          />
        </div>
      </div>
    </section>
  );
}
