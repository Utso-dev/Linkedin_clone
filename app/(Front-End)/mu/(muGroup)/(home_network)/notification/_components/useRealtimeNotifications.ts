import baseApiSlice from "@/feature/slice/baseApi";
import echo from "@/lib/echo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useRealtimeNotifications = (
  userId: string | number | undefined,
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId || !echo) return;
    const channelName = `App.Models.User.${userId}`;
    const channel = echo.private(channelName);

    channel.notification((data: any) => {
    

      dispatch(baseApiSlice.util.invalidateTags(["Notifications"]));
    });

    return () => {
      echo.leave(channelName);
    };
  }, [userId, dispatch]);
};
