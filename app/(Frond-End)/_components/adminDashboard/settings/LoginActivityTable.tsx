"use client";

import AdminPagination from "@/components/reusable/dashboard/AdminPagination";
import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import Pagination from "@/components/reusable/Pagination";
import {
  useDeleteActiveSessionsMutation,
  useDeleteAllLoginActivityMutation,
  useDeleteLoginActivityMutation,
  useGetLoginActivityQuery,
  useLogoutActiveSessionsMutation,
  useSingeleSessionTrustedMutation,
} from "@/feature/slice/admin/securitySettings";
import { TikIcon } from "@/public/svgIcons/AdminIcon";
import { LogoutIcon } from "@/public/svgIcons/Icons";
import dayjs from "dayjs";
import { Delete, Monitor, Phone, Smartphone, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
dayjs.extend(utc);
dayjs.extend(timezone);

type LoginActivity = {
  id: number;
  device: string;
  browser: string;
  location: string;
  ip_address: string;
  status: "Successful" | "Failed";
  is_active: boolean;
  is_mobile: boolean;
  is_current: boolean;
  signin_status: string;
  login_at: string;
  created_at: string;
  is_suspicious: boolean;
  is_trusted: boolean;
  activity_status: string;
};

export default function LoginActivityTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data, isLoading } = useGetLoginActivityQuery({
    page,
    limit,
  });

  const loginActivities: LoginActivity[] = data?.data?.items || [];
  const [logoutActivity, { isLoading: logoutLoading }] =
    useDeleteLoginActivityMutation();

  const [deleteLoginActivity, { isLoading: deleteLoading }] =
    useLogoutActiveSessionsMutation();

  const [singeleSessionTrusted, { isLoading: singeleSessionTrustedLoading }] =
    useSingeleSessionTrustedMutation();

  const [deletAllAcitivity, { isLoading: deletAllAcitivityLoading }] =
    useDeleteAllLoginActivityMutation();

  const handleSingeleSessionTrusted = async (id: number) => {
    try {
      await singeleSessionTrusted(id).unwrap();
      toast.success("Session trusted successfully");
    } catch (error) {
      console.error("Session trusted failed:", error);
    }
  };

  const handleLogout = async (id: number) => {
    try {
      await logoutActivity(id).unwrap();
      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handelDelete = async (id: number) => {
    try {
      await deleteLoginActivity(id).unwrap();
      toast.success("Logout successful");
    } catch (error) {
      console.log(error);
    }
  };

  const handelDeleteAll = async () => {
    try {
      await deletAllAcitivity({}).unwrap();
      toast.success("All activity deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const columns: Column<LoginActivity>[] = [
    {
      header: "No.",
      cell: (row) => (
        <span className="text-[13px] font-medium text-[#4A4C56]">
          {(page - 1) * limit + loginActivities.indexOf(row) + 1}
        </span>
      ),
    },

    {
      header: "Device / Browser",
      cell: (row) => (
        <div className="flex items-center gap-2.5 whitespace-nowrap">
          <span>
            {row?.is_mobile === true ? (
              <Smartphone className="h-5 w-5 stroke-headerColor" />
            ) : (
              <Monitor className="h-5 w-5 stroke-headerColor" />
            )}
          </span>
          <div className="flex flex-col ">
            <div className="relative w-40 group">
              <span className="block w-40 truncate text-[13px] font-semibold text-[#0A0A0A]">
                {row.device} • {row.browser}
              </span>

              {/* <div className="absolute bottom-full left-1/2 z-[999] mb- hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-3 py-2 text-xs font-medium text-white shadow-lg group-hover:block">
                {row.device} • {row.browser}
              </div> */}
            </div>
            <span className="whitespace-nowrap text-[13px] font-semibold text-grayColor1">
              {row.location}
            </span>
          </div>
        </div>
      ),
    },

    {
      header: "IP Address",
      cell: (row) => (
        <span className="whitespace-nowrap text-[13px] font-medium text-headerColor">
          {row.ip_address}
        </span>
      ),
    },

    {
      header: "Date & Time",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="whitespace-nowrap text-[13px] font-medium text-headerColor">
            {dayjs
              .utc(row.login_at)
              .tz(userTimezone)
              .format("DD MMM YYYY")
              .toUpperCase()}
          </span>

          <span className="whitespace-nowrap text-[12px] text-[#A5A5AB]">
            {dayjs
              .utc(row.login_at)
              .tz(userTimezone)
              .format(" hh:mm A")
              .toUpperCase()}
          </span>
        </div>
      ),
    },

    {
      header: "Status",
      cell: (row) => (
        <CustomBadge
          color={
            row.signin_status === "Signed in" ||
            row.signin_status === "Current device"
              ? "active"
              : "logout"
          }
          className={
            row.signin_status === "Signed in" ||
            row.signin_status === "Current device"
              ? "rounded-sm border whitespace-nowrap border-[#72DED1] bg-[#F0FFFD] px-2 py-2 text-[12px] font-semibold text-[#22CAAD] text-right leading-[132%] tracking-[0.06px] "
              : "rounded-sm border whitespace-nowrap border-gray-400 bg-gray-100 px-2 py-2 text-[12px] font-semibold text-grayColor1"
          }
        >
          {row.signin_status}
        </CustomBadge>
      ),
    },

    {
      header: "Activity",
      cell: (row) => (
        <span
          className={`rounded-sm border font-['Segoe_UI'] px-2 py-2 whitespace-nowrap text-[13px] font-medium ${
            row.activity_status === "Trusted Device"
              ? "text-[#22CAAD] border-[#72DED1] bg-[#F0FFFD]"
              : row.activity_status === "Suspicious"
                ? "text-[#EB3D4D] border-[#F38B94] bg-[#FEECEE]"
                : "text-[#7B7B7B] border-[#D9D9D9] bg-[#F5F5F5]"
          }`}
        >
          {row.activity_status}
        </span>
      ),
    },

    {
      header: "Actions",
      cell: (row: LoginActivity) => {
        const isCurrentDevice = row.signin_status === "Current device";
        const isLoggedOut = row.signin_status === "Logged out";

        const isLogoutDisabled = isCurrentDevice || isLoggedOut;
        const isDeleteDisabled = isCurrentDevice;
        const isTrustedDisabled = isCurrentDevice || !row?.is_suspicious;

        return (
          <div className="flex items-center gap-2.5 whitespace-nowrap">
            {/* suspecious */}

            <button
              onClick={() => handleSingeleSessionTrusted(row.id)}
              disabled={isTrustedDisabled || singeleSessionTrustedLoading}
              className={`flex items-center gap-1  rounded-sm bg-[#E9FAF7] p-3 text-[12px] font-medium ${
                isTrustedDisabled || singeleSessionTrustedLoading
                  ? "cursor-not-allowed bg-[#F8F8F8] opacity-40"
                  : "cursor-pointer"
              }`}
            >
              <TikIcon
                className={`h-4 w-4 ${
                  isTrustedDisabled || singeleSessionTrustedLoading
                    ? "text-[#A0A0A0]"
                    : "text-[#1D1F2C]"
                }`}
              />
            </button>

            {/* Logout */}
            <button
              onClick={() => !isLogoutDisabled && handleLogout(row.id)}
              disabled={isLogoutDisabled}
              className={`flex items-center gap-1 rounded-sm bg-bgLightColor p-2 text-[12px] font-medium text-[#1D1F2C] ${
                isLogoutDisabled
                  ? "cursor-not-allowed bg-[#F8F8F8] opacity-40"
                  : "cursor-pointer"
              }`}
            >
              <LogoutIcon className="h-4 w-4" />
            </button>

            {/* Delete */}
            <button
              onClick={() => !isDeleteDisabled && handelDelete(row.id)}
              disabled={isDeleteDisabled}
              className={`flex items-center gap-1 rounded-sm p-2 text-[12px] font-medium text-red-500 ${
                isDeleteDisabled
                  ? "cursor-not-allowed bg-[#F8F8F8] opacity-40"
                  : "cursor-pointer bg-[#FEECEE]"
              }`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="py-6 flex justify-between">
        <div>
          <h2 className="text-headerColor text-[20px] font-semibold">
            Login Activity
          </h2>

          <p className="mt-1 text-[#4A4C56] text-[14px]">
            Review your recent account login activity.
          </p>
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={handelDeleteAll}
            className="cursor-pointer border border-[#FBD8DB] rounded-sm py-1 px-3 font-segoe text-[14px] font-normal leading-[140%] tracking-[0.07px] text-redColor"
          >
            <p>Clear all Session</p>
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={loginActivities} />

      {/* Backend Pagination */}
      <Pagination
        page={page}
        pageSize={limit}
        total={data?.total || 10}
        totalPages={data?.total_page || 1}
        onPageChange={(page) => setPage(page)}
      />

      {/* <CustomDeletModal
                isOpen={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedLogin(null);
                }}
                onConfirm={handleDelete}
                title="Do you want to delete this login activity?"
                description="Click “Delete Now” if you want to delete otherwise press cancel."
            /> */}
    </div>
  );
}
