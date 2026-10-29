import RootDialog from "@/components/reusable/RootDialog";
import { DeleteIcon } from "@/public/svgIcons/Icons";

function GroupUserBanDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  return (
    <RootDialog open={open} setOpen={setOpen}>
      <div className="md:p-6 p-4">
        <div className="text-center flex flex-col items-center justify-center">
          <div className="flex justify-center items-center w-18 h-18 rounded-full bg-bgColor border border-borderColor/20 ">
            <DeleteIcon className="w-6 h-6 text-redColor" />
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-headerColor">Ban User</h2>
            <p className="text-sm text-descriptionColor leading-[140%] mt-1">
              Are you sure you want to ban this user? The user no longer be able
              publish/ see posts in this group!
            </p>
          </div>
          <div className="flex mt-6 items-center justify-center gap-3">
            <button
              className="px-6 rounded-full py-2 cursor-pointer  text-base font-semibold text-descriptionColor transition-all hover:bg-bgLightColor hover:shadow active:scale-95"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button className="px-6 rounded-full bg-redColor py-2 cursor-pointer  text-base font-semibold text-white transition-all hover:bg-red-600 active:scale-95">
              Yes, Ban User
            </button>
          </div>
        </div>
      </div>
    </RootDialog>
  );
}

export default GroupUserBanDialog;
