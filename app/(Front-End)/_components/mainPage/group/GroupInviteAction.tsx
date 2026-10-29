import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import {
  useAcceptGroupInvitationMutation,
  useRemoveGroupInvitationMutation,
} from "@/feature/slice/group/groupSlice";
import { OpenEyeIcon } from "@/public/svgIcons/Icons";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function GroupInviteAction({
  invitationId,
  groupId,
  userId,
}: {
  invitationId: number;
  groupId: number;
  userId: number;
}) {
  const [acceptGroupInvitation, { isLoading: isAccepting, isSuccess }] =
    useAcceptGroupInvitationMutation();
  const [
    removeGroupInvitation,
    { isLoading: isRemoving, isSuccess: isRemoved },
  ] = useRemoveGroupInvitationMutation();

  const router = useRouter();
  const handleConnectionAction = async (action: "accept" | "ignore") => {
    if (action === "accept") {
      try {
        const response = await acceptGroupInvitation({ invitationId }).unwrap();
        router.refresh();
        toast.success(
          response?.message || "Group invitation accepted successfully!",
        );
      } catch (error) {
        console.error("Error accepting group invitation:", error);
        toast.error(
          error?.data?.message ||
            "Failed to accept the group invitation. Please try again.",
        );
      }
    } else {
      try {
        const response = await removeGroupInvitation({ invitationId }).unwrap();
        try {
          await fetch("/api/revalidate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              path: "/mu/my-network/groups/",
            }),
          });
        } catch (err) {
          console.warn("Revalidate request failed", err);
        }
        router.refresh();
        toast.success(
          response?.message || "Group invitation ignored successfully!",
        );
      } catch (error) {
        console.error("Error ignoring group invitation:", error);
        toast.error(
          error?.data?.message ||
            "Failed to ignore the group invitation. Please try again.",
        );
      }
    }
  };
  return (
    <div>
      {isSuccess ? (
        <Link
          href={`/mu/my-network/group/${groupId}`}
          className={`${BUTTON_STYLES.primary} flex items-center gap-1 px-2.5!`}
        >
          <OpenEyeIcon className="w-4 h-4" /> View
        </Link>
      ) : isRemoved ? (
        <p className="text-redColor">Invitation ignored</p>
      ) : (
        <div className="flex items-center gap-2">
          <button
            disabled={isRemoving}
            onClick={() => handleConnectionAction("ignore")}
            className={`${BUTTON_STYLES.secondary} disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-bgColor`}
          >
            {isRemoving ? (
              <span className="">
                <Loader className="w-4.5 animate-spin h-4.5 " />
              </span>
            ) : (
              "Ignore"
            )}
          </button>
          <button
            disabled={isAccepting}
            onClick={() => handleConnectionAction("accept")}
            className={`${BUTTON_STYLES.primary} disabled:cursor-not-allowed! disabled:opacity-50! disabled:bg-gray-bgColor!`}
          >
            {isAccepting ? (
              <span className="">
                <Loader className="w-4.5 animate-spin h-4.5 " />
              </span>
            ) : (
              "Accept"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default GroupInviteAction;
