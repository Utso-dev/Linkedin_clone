"use client";

import { useState } from "react";
import SecurityOverview from "./SecurityOverview";
import ChangePassword from "./ChangePassword";
import ActiveSessions from "./ActiveSessions";
import TwoFactorAuthentication from "./TwoFactorAuthentication";
import AuthenticationMethods from "./AuthenticationMethods";

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <main className="min-h-screen  ">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-headerColor font-['Segoe_UI'] text-2xl font-semibold leading-[130%] tracking-[0.12px]">
            Security Settings
          </h1>

          <p className="mt-1 text-[#4A4C56] font-['Segoe_UI'] text-base font-normal leading-[150%] tracking-[0.08px]">
            Manage your account security, access, and authentication settings.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Security Overview */}
        <SecurityOverview twoFactorEnabled={twoFactorEnabled} />

        {/* Password + Sessions */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChangePassword />
          <ActiveSessions />
        </div>

        {/* 2FA + Authentication Methods */}
        <div className=" ">
          <TwoFactorAuthentication />
        </div>
      </div>
    </main>
  );
}
