"use client";

import { useState } from "react";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { CircleAlert } from "lucide-react";

type NotificationPreference = {
    id: string;
    title: string;
    description: string;
    inApp: boolean;
    email: boolean;
    push: boolean;
};

type NotificationSettingsData = {
    globalEnabled: boolean;
    preferences: NotificationPreference[];
    quietHours: {
        enabled: boolean;
        startTime: string;
        endTime: string;
        timezone: string;
    };
};

const initialSettings: NotificationSettingsData = {
    globalEnabled: true,

    preferences: [
        {
            id: "messages",
            title: "Messages",
            description: "New messages, replies and mentions",
            inApp: true,
            email: true,
            push: true,
        },
        {
            id: "job-alert",
            title: "Job Alert",
            description: "New job matches, saved searches and job alerts",
            inApp: true,
            email: true,
            push: true,
        },
        {
            id: "job-applications",
            title: "Job Applications",
            description: "Application updates, interviews and offers",
            inApp: true,
            email: true,
            push: true,
        },
        {
            id: "payments-subscriptions",
            title: "Payments & Subscriptions",
            description:
                "Payment confirmations, invoices and subscription updates",
            inApp: true,
            email: true,
            push: true,
        },
        {
            id: "subscription-membership",
            title: "Subscription & Membership",
            description:
                "Membership upgrades, renewals and plan changes",
            inApp: true,
            email: true,
            push: true,
        },
        {
            id: "connections",
            title: "Connections",
            description: "New connections, requests and endorsements",
            inApp: true,
            email: true,
            push: true,
        },
        {
            id: "system-updates",
            title: "System & Platform Updates",
            description:
                "Feature updates, announcements and maintenance",
            inApp: true,
            email: true,
            push: true,
        },
        {
            id: "security-alerts",
            title: "Security Alerts",
            description:
                "Feature updates, announcements and maintenance",
            inApp: true,
            email: true,
            push: true,
        },
        {
            id: "marketing-promotions",
            title: "Marketing & Promotions",
            description:
                "Tips, product updates and special offers",
            inApp: true,
            email: true,
            push: true,
        },
    ],

    quietHours: {
        enabled: true,
        startTime: "10:00 PM",
        endTime: "07:00 AM",
        timezone: "UTC-05:00",
    },
};

export default function NotificationSettings() {
    const [settings, setSettings] =
        useState<NotificationSettingsData>(initialSettings);

    /* --------------------------------
       Global Notification
    -------------------------------- */

    const toggleGlobalNotification = () => {
        setSettings((prev) => ({
            ...prev,
            globalEnabled: !prev.globalEnabled,
        }));
    };

    /* --------------------------------
       Individual Notification
    -------------------------------- */

    const toggleNotification = (
        id: string,
        field: "inApp" | "email" | "push"
    ) => {
        setSettings((prev) => ({
            ...prev,
            preferences: prev.preferences.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        [field]: !item[field],
                    }
                    : item
            ),
        }));
    };

    const toggleQuietHours = () => {
        setSettings((prev) => ({
            ...prev,
            quietHours: {
                ...prev.quietHours,
                enabled: !prev.quietHours.enabled,
            },
        }));
    };

    const updateQuietHours = (
        field: "startTime" | "endTime" | "timezone",
        value: string
    ) => {
        setSettings((prev) => ({
            ...prev,
            quietHours: {
                ...prev.quietHours,
                [field]: value,
            },
        }));
    };



    const handleSave = async () => {
        console.log("Notification Settings:", settings);

        /*
        Future API:

        await updateNotificationSettings(settings).unwrap();
        */
    };

    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#EEEEEE] pb-3">
                <div>
                    <h1 className="text-headerColor  text-[24px] font-semibold leading-[130%] tracking-[0.12px]">
                        Notification Settings
                    </h1>

                    <p className="text-grayColor1  text-[16px] font-normal leading-[150%] tracking-[0.08px] mt-2">
                        Manage how you and your users receive notifications
                        across the platform.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    className="cursor-pointer rounded-md bg-primaryColor px-3 py-2 text-[14px] font-semibold text-[#FFF]"
                >
                    Save Changes
                </button>
            </div>

            {/* Notification Preferences */}
            <div className="mt-3">

                <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-4">

                    <div>
                        <h2 className="text-headerColor  text-[20px] font-semibold leading-[130%] tracking-[0.1px]">
                            Notification Preferences
                        </h2>

                        <p className="text-grayColor1  text-[14px] font-normal leading-[140%] tracking-[0.07px] mt-2">
                            Choose which notifications you want to receive
                            and how.
                        </p>
                    </div>

                    {/* Global Enable / Disable */}
                    <div className="flex items-center gap-2 text-[9px] text-grayColor1">

                        <span className="text-grayColor1  text-[16px] font-normal leading-[150%] tracking-[0.08px]">Enable all</span>

                        <button
                            type="button"
                            onClick={toggleGlobalNotification}
                            className={`relative h-4 w-7 rounded-full transition ${settings.globalEnabled
                                ? "bg-primaryColor"
                                : "bg-[#B6B6B6]"
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${settings.globalEnabled
                                    ? "left-3.5"
                                    : "left-0.5"
                                    }`}
                            />
                        </button>

                        <div className="h-4 w-px bg-[#B6B6B6]" />

                        <span className="text-grayColor1  text-[16px] font-normal leading-[150%] tracking-[0.08px]">Disable all</span>

                        <button
                            type="button"
                            onClick={() =>
                                setSettings((prev) => ({
                                    ...prev,
                                    globalEnabled: false,
                                    preferences:
                                        prev.preferences.map(
                                            (item) => ({
                                                ...item,
                                                inApp: false,
                                                email: false,
                                                push: false,
                                            })
                                        ),
                                }))
                            }
                            className={`relative h-4 w-7 rounded-full transition ${!settings.globalEnabled
                                ? "bg-primaryColor"
                                : "bg-[#B6B6B6]"
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${!settings.globalEnabled
                                    ? "left-3.5"
                                    : "left-0.5"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className=" overflow-hidden border border-[#E5E5E5] rounded-xl mt-4 p-3">

                    {/* Header */}
                    <div className="grid grid-cols-[5fr_1fr_1fr_1fr] bg-[#F8F8F8] px-2 py-2 text-[9px] text-[#777980]">
                        <div className="text-[#737373]  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">Notification Type</div>
                        <div className="text-center  text-[#737373]  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">In App</div>
                        <div className="text-center text-[#737373]  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">Email</div>
                        <div className="text-center text-[#737373]  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">Push</div>
                    </div>

                    {/* Rows */}
                    {settings.preferences.map((item) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-[5fr_1fr_1fr_1fr] items-center border-t border-[#E5E5E5] px-2 py-2"
                        >
                            <div>
                                <p className="overflow-hidden text-ellipsis text-grayColor1  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
                                    {item.title}
                                </p>

                                <p className="overflow-hidden text-ellipsis text-[#777980]  text-[12px] font-normal leading-[132%] tracking-[0.06px] mt-0.5">
                                    {item.description}
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <BooleanCheckbox
                                    checked={item.inApp}
                                    onChange={() =>
                                        toggleNotification(
                                            item.id,
                                            "inApp"
                                        )
                                    }
                                />
                            </div>

                            <div className="flex justify-center">
                                <BooleanCheckbox
                                    checked={item.email}
                                    onChange={() =>
                                        toggleNotification(
                                            item.id,
                                            "email"
                                        )
                                    }
                                />
                            </div>

                            <div className="flex justify-center">
                                <BooleanCheckbox
                                    checked={item.push}
                                    onChange={() =>
                                        toggleNotification(
                                            item.id,
                                            "push"
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quiet Hours */}
            <div className="py-6">

                <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-2">

                    <div>
                        <h2 className="text-headerColor  text-[20px] font-semibold leading-[130%] tracking-[0.1px]">
                            Quiet Hours
                        </h2>

                        <p className="text-grayColor1  text-[14px] font-normal leading-[140%] tracking-[0.07px] mt-2">
                            Pause non-urgent notifications during specific
                            hours.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={toggleQuietHours}
                        className={`relative h-4 w-7 rounded-full transition ${settings.quietHours.enabled
                            ? "bg-primaryColor"
                            : "bg-[#B6B6B6]"
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${settings.quietHours.enabled
                                ? "left-3.5"
                                : "left-0.5"
                                }`}
                        />
                    </button>
                </div>

                {/* Quiet Hours Fields */}
                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">

                    <CustomSelect
                        label="Start Time"
                        value={settings.quietHours.startTime}
                        onChange={(value) =>
                            updateQuietHours(
                                "startTime",
                                value as string
                            )
                        }
                        options={[
                            {
                                label: "10:00 PM",
                                value: "10:00 PM",
                            },
                            {
                                label: "11:00 PM",
                                value: "11:00 PM",
                            },
                            {
                                label: "12:00 AM",
                                value: "12:00 AM",
                            },
                            {
                                label: "01:00 AM",
                                value: "01:00 AM",
                            },
                        ]}
                    />

                    <CustomSelect
                        label="End Time"
                        value={settings.quietHours.endTime}
                        onChange={(value) =>
                            updateQuietHours(
                                "endTime",
                                value as string
                            )
                        }
                        options={[
                            {
                                label: "06:00 AM",
                                value: "06:00 AM",
                            },
                            {
                                label: "07:00 AM",
                                value: "07:00 AM",
                            },
                            {
                                label: "08:00 AM",
                                value: "08:00 AM",
                            },
                            {
                                label: "09:00 AM",
                                value: "09:00 AM",
                            },
                        ]}
                    />

                    <CustomSelect
                        label="Timezone"
                        value={settings.quietHours.timezone}
                        onChange={(value) =>
                            updateQuietHours(
                                "timezone",
                                value as string
                            )
                        }
                        options={[
                            {
                                label:
                                    "(UTC-05:00) Eastern Time (US & Canada)",
                                value: "UTC-05:00",
                            },
                            {
                                label:
                                    "(UTC-06:00) Central Time (US & Canada)",
                                value: "UTC-06:00",
                            },
                            {
                                label:
                                    "(UTC-07:00) Mountain Time (US & Canada)",
                                value: "UTC-07:00",
                            },
                            {
                                label:
                                    "(UTC-08:00) Pacific Time (US & Canada)",
                                value: "UTC-08:00",
                            },
                        ]}
                    />
                </div>

                {/* Info */}
                <div className="mt-6 flex items-center gap-2 text-grayColor1  text-[12px] font-normal leading-[132%] tracking-[0.06px]">
                    <CircleAlert className="rotate-180" size={16} />
                    During quiet hours, you’ll still receive important
                    alerts like security notifications and direct messages.
                </div>
            </div>
        </div>
    );
}


/* --------------------------------
   Boolean Checkbox
-------------------------------- */

interface BooleanCheckboxProps {
    checked: boolean;
    onChange: () => void;
}

function BooleanCheckbox({
    checked,
    onChange,
}: BooleanCheckboxProps) {
    return (
        <button
            type="button"
            onClick={onChange}
            aria-pressed={checked}
            className={`flex h-3 w-3 cursor-pointer items-center justify-center rounded-[2px] border ${checked
                ? "border-primaryColor bg-primaryColor"
                : "border-[#B6B6B6] bg-white"
                }`}
        >
            {checked && (
                <span className="text-[8px] font-bold text-white">
                    ✓
                </span>
            )}
        </button>
    );
}