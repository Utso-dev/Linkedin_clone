import RootDialog from "@/components/reusable/RootDialog";
import { useRemoveRequestMutation } from "@/feature/slice/connect/connectSlice";
import { UserMinusIcon } from "@/public/svgIcons/Icons";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

function ConnectionUnfriendDialog({
  open,
  setOpen,
  userId,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  userId: number | string;
}) {
  const [removeRequest, { isLoading: isRemoving }] = useRemoveRequestMutation();
  const handleUnfirend = async () => {
    try {
      const result = await removeRequest({ id: userId }).unwrap();

      toast.success(result.message || "Connection removed.");
    } catch (error) {
      console.error("Error opening unfollow dialog:", error);
    }
  };

  return (
    <RootDialog open={open} setOpen={setOpen}>
      <div className="md:p-6 p-4">
        <div className="text-center flex flex-col items-center justify-center">
          <div className="flex justify-center items-center w-18 h-18 rounded-full bg-bgColor border border-borderColor/20 ">
            <UserMinusIcon className="w-6 h-6 text-descriptionColor" />
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-headerColor">Unfriend</h2>
            <p className="text-sm text-descriptionColor leading-[140%] mt-1">
              Are you sure you want to unfriend User Name?
            </p>
          </div>
          <div className="flex mt-6 items-center justify-center gap-3">
            <button
              className="px-6 rounded-full py-2 cursor-pointer  text-base font-semibold text-descriptionColor transition-all bg-bgLightColor shadow hover:shadow-md active:scale-95"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              onClick={handleUnfirend}
              disabled={isRemoving}
              className="px-6 rounded-full disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-bgColor bg-primaryColor py-2 cursor-pointer  text-base font-semibold text-white transition-all hover:bg-[#008c99] active:scale-95"
            >
              {isRemoving ? (
                <span className="flex items-center gap-1">
                  <Loader className="w-4.5 animate-spin h-4.5 " />
                  Unfriend
                </span>
              ) : (
                "Yes, Unfriend"
              )}
            </button>
          </div>
        </div>
      </div>
    </RootDialog>
  );
}

export default ConnectionUnfriendDialog;
