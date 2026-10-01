"use client";

import { useState } from "react";
import { Monitor, MoreHorizontal, Smartphone } from "lucide-react";
import {
  useDeletAllSessionsMutation,
  useDeleteActiveSessionsMutation,
  useGetActiveSessionsQuery,
} from "@/feature/slice/admin/securitySettings";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import { BiMobile } from "react-icons/bi";

interface Session {
  id: number;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  current?: boolean;
}

export default function ActiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );
  const [showDeleteSingleModal, setShowDeleteSingleModal] = useState(false);

  const { data, isLoading, error } = useGetActiveSessionsQuery({});
  const ActiveSession = data?.data || [];
  console.log(ActiveSession);

  const [DeleteActiveSessions] = useDeleteActiveSessionsMutation();
  const [DeleteAllSessions] = useDeletAllSessionsMutation();

  const removeSession = (id: number) => {
    DeleteActiveSessions(id);
    setSessions((prev) => prev.filter((session) => session.id !== id));
    toast.success("Session Terminated successfully");
  };

  const logoutAllSessions = () => {
    DeleteAllSessions({}).unwrap();
    toast.success("All sessions terminated successfully");
    setSessions([]);
  };

  return (
    <div>
      <section className="rounded-md border border-[#E8E8E8]   p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-headerColor  text-[20px] font-semibold leading-[130%] tracking-[0.1px]">
              Active Session
            </h2>

            <p className=" mt-2  text-sm font-normal leading-[150%] tracking-[0.08px] text-[#4A4C56]">
              Manage devices that are currently signed in to your account.
            </p>
          </div>
        </div>

        <div className="space-y-2 h-[250px] pr-4 overflow-y-auto">
          {ActiveSession.map((session) => (
            <div
              key={session.id}
              className="flex justify-between  gap-3   pb-3 last:border-0"
            >
              <div className="flex h-8 w-8 shrink-0  ">
                {session?.is_mobile === true ? (
                  <Smartphone size={16} className="text-black" />
                ) : (
                  <div>
                    <Monitor size={16} className="text-black" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className="text-black text-[16px] font-semibold leading-[150%] tracking-[0.08px]
"
                  >
                    {session.device}
                  </p>
                </div>

                <p
                  className="mt-1 text-[#7B7B7B] text-[14px] font-normal leading-[140%] tracking-[0.07px]
"
                >
                  {session.location} • {session.ip_address} •{" "}
                  {dayjs(session.login_at)
                    .format("DD MMM YYYY, hh:mm A")
                    .toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-2 justify-end">
                {session?.is_current && (
                  <span
                    className="rounded-full border border-[#287F6E] px-2 py-1 text-[#287F6E] text-center text-[12px] font-semibold leading-[132%] tracking-[0.06px]
"
                  >
                    Active now
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedSessionId(session.id);
                    setShowDeleteSingleModal(true);
                  }}
                  disabled={session.is_current}
                  className="text-[#888] disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                >
                  <MoreHorizontal size={17} className="text-[#000]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={logoutAllSessions}
          className="mt-4 w-full rounded-md border border-[#F38B94] bg-[#FBD8DB] cursor-pointer py-2 text-center text-[14px] font-semibold leading-[140%] tracking-[0.07px] text-redColor"
        >
          Sign out all the sessions
        </button>
      </section>

      <CustomModal
        open={showDeleteSingleModal}
        onOpenChange={setShowDeleteSingleModal}
        title="Terminate Session"
        size="xsm"
      >
        <div className="w-full px-3">
          <p className="text-sm text-[#4A4C56]">
            Are you sure you want to terminate this session?
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteSingleModal(false)}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={async () => {
                if (!selectedSessionId) return;

                try {
                  await DeleteActiveSessions(selectedSessionId).unwrap();

                  toast.success("Session terminated successfully");

                  setShowDeleteSingleModal(false);
                  setSelectedSessionId(null);
                } catch (error) {
                  toast.error("Failed to terminate session");
                }
              }}
              className="rounded-md bg-[#EB3D4D] px-4 py-2 text-sm text-white"
            >
              Terminate
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}
