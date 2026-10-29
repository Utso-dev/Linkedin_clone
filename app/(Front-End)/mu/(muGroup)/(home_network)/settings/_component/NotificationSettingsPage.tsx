"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import { Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  in_app: boolean;
  email: boolean;
  push: boolean;
}

const defaultNotifications: NotificationItem[] = [
  {
    id: "messages",
    title: "Messages",
    description: "New messages, replies and mentions",
    in_app: true,
    email: true,
    push: true,
  },
  {
    id: "job_alert",
    title: "Job Alert",
    description: "New job matches, saved searches and job alerts",
    in_app: true,
    email: true,
    push: true,
  },
  {
    id: "job_applications",
    title: "Job Applications",
    description: "Application updates, interviews and offers",
    in_app: true,
    email: true,
    push: true,
  },
  {
    id: "payments_subscriptions",
    title: "Payments & Subscriptions",
    description: "Payment confirmations, invoices and subscription updates",
    in_app: true,
    email: true,
    push: true,
  },
  {
    id: "subscription_membership",
    title: "Subscription & Membership",
    description: "Membership updates, renewals and plan changes",
    in_app: true,
    email: true,
    push: true,
  },
  {
    id: "connections",
    title: "Connections",
    description: "New connections, requests and endorsements",
    in_app: true,
    email: true,
    push: true,
  },
  {
    id: "system_updates",
    title: "System & Platform Updates",
    description: "Feature updates, announcements and maintenance",
    in_app: true,
    email: true,
    push: true,
  },
  {
    id: "security_alerts",
    title: "Security Alerts",
    description: "Feature updates, announcements and maintenance",
    in_app: true,
    email: true,
    push: true,
  },
  {
    id: "marketing_promotions",
    title: "Marketing & Promotions",
    description: "Tips, product updates and special offers",
    in_app: true,
    email: true,
    push: true,
  },
];

export default function NotificationSettingsPage() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(defaultNotifications);
  const [disableAll, setDisableAll] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Single Checkbox Toggle Handler
  const handleCheckboxChange = (
    id: string,
    channel: "in_app" | "email" | "push",
  ) => {
    if (disableAll) return;
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [channel]: !item[channel] } : item,
      ),
    );
  };

  // "Disable All" Master Switch Toggle Handler
  const handleToggleDisableAll = () => {
    const nextState = !disableAll;
    setDisableAll(nextState);

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        in_app: !nextState,
        email: !nextState,
        push: !nextState,
      })),
    );
  };

  // API Call on Save Button
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const payload = {
        disable_all: disableAll,
        preferences: notifications.map((item) => ({
          type: item.id,
          in_app: item.in_app,
          email: item.email,
          push: item.push,
        })),
      };

      // Replace with your RTK Query or API Call:
      // await updateNotificationPreferences(payload).unwrap();


      toast.success("Notification preferences updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      {/* ----------------- Top Header Section ----------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your account, privacy, and preferences.
          </p>
        </div>

        <ButtonReuseable
          type="button"
          onClick={handleSaveChanges}
          disabled={isSaving}
          title="Save Changes"
          sendingMsg={"Saving..."}
        />
      </div>

      {/* ----------------- Notification Preferences Header ----------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Notification Preferences
          </h2>
          <p className="text-sm text-gray-500">
            Choose which notifications you want to receive and how.
          </p>
        </div>

        {/* Disable All Toggle Switch */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-sm text-gray-600 font-medium">Disable all</span>
          <button
            type="button"
            role="switch"
            aria-checked={disableAll}
            onClick={handleToggleDisableAll}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
              disableAll ? "bg-primaryColor" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out mt-0.5 ${
                disableAll ? "translate-x-5.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* ----------------- Notification Table ----------------- */}
      <div className="bg-white border  border-gray-200/80 rounded-2xl overflow-hidden ">
        <div className="overflow-x-auto">
          <table className=" min-w-xl w-full text-left border-collapse">
            {/* Table Head */}
            <thead>
              <tr className="bg-[#F8F8F8] border-b border-gray-100 text-base font-medium text-gray-500">
                <th className="py-3.5 px-6 font-medium">Notification Type</th>
                <th className="py-3.5 px-4 font-medium text-center w-28">
                  In App
                </th>
                <th className="py-3.5 px-4 font-medium text-center w-28">
                  Email
                </th>
                <th className="py-3.5 px-6 font-medium text-center w-28">
                  Push
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 text-base">
              {notifications.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/40 transition-colors"
                >
                  {/* Title & Description */}
                  <td className="py-4 px-6">
                    <p className="font-semibold text-descriptionColor text-sm">
                      {row.title}
                    </p>
                    <p className="text-xs text-grayColor1 mt-0.5">
                      {row.description}
                    </p>
                  </td>

                  {/* In App Checkbox */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex justify-center items-center">
                      <button
                        type="button"
                        onClick={() => handleCheckboxChange(row.id, "in_app")}
                        disabled={disableAll}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          row.in_app
                            ? "border-primaryColor bg-white text-primaryColor"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {row.in_app && (
                          <Check className="w-3.5 h-3.5 stroke-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Email Checkbox */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex justify-center items-center">
                      <button
                        type="button"
                        onClick={() => handleCheckboxChange(row.id, "email")}
                        disabled={disableAll}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          row.email
                            ? "border-primaryColor bg-white text-primaryColor"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {row.email && (
                          <Check className="w-3.5 h-3.5 stroke-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Push Checkbox */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center items-center">
                      <button
                        type="button"
                        onClick={() => handleCheckboxChange(row.id, "push")}
                        disabled={disableAll}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          row.push
                            ? "border-primaryColor bg-white text-primaryColor"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {row.push && <Check className="w-3.5 h-3.5 stroke-3" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
