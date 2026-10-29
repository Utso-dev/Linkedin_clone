"use client";

import { useToggleGroupNotificationMutation } from "@/feature/slice/group/groupSlice";
import {
  NotificationOffIcon,
  NotificationOnIcon,
} from "@/public/svgIcons/Icons";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type NotificationForm = {
  notificationType: "true" | "false";
};

export default function GroupNotifySetting({
  setIsNotify,
  groupId,
  groupNotification,
}: {
  setIsNotify: (value: boolean) => void;
  groupId: string;
  groupNotification?: boolean | undefined;
}) {
  const { register, handleSubmit } = useForm<NotificationForm>({
    defaultValues: {
      notificationType: groupNotification ? "true" : "false",
    },
  });
  const [toggleGroupNotification, { isLoading }] =
    useToggleGroupNotificationMutation();

  const onSubmit = async (data: NotificationForm) => {
    try {
      const payload = {
        notification_status: data.notificationType === "true",
      };
      const response = await toggleGroupNotification({
        groupId,
        payload,
      }).unwrap();
      toast.success(
        response?.message || "Notification setting updated successfully!",
      );
      setIsNotify(false);
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to update notification setting.",
      );
   
    }
  };

  return (
    <div className=" p-4 md:p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-headerColor">
            Manage Notification
          </h2>
          <hr className="mt-3 border-borderColor" />
        </div>
        <div className="space-y-5 py-4">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <NotificationOnIcon className="w-5 h-5 text-descriptionColor" />
              <span className="text-base text-descriptionColor font-medium">
                Send All Notification
              </span>
            </div>
            <input
              type="radio"
              value="true"
              {...register("notificationType")}
              className="w-5 h-5 accent-primaryColor cursor-pointer"
            />
          </label>

          {/* Turned off Notification */}
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <NotificationOffIcon className="w-5 h-5 text-descriptionColor" />
              <span className="text-base text-descriptionColor font-medium">
                Turned of Notification
              </span>
            </div>
            <input
              type="radio"
              value="false"
              {...register("notificationType")}
              className="w-5 h-5 accent-primaryColor cursor-pointer"
            />
          </label>
        </div>

        {/* Action Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primaryColor
            cursor-pointer text-white disabled:text-grayColor1 disabled:bg-bgColor disabled:cursor-not-allowed  px-10 py-2.5 rounded-full font-semibold text-[16px] hover:bg-[#008c99] transition-all tracking-wide 
             active:scale-95 shadow-sm"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
