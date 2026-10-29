import RootDialog from "@/components/reusable/RootDialog";
import { UserMinusIcon } from "@/public/svgIcons/Icons";

function UserUnfollowDialog({
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
            <UserMinusIcon className="w-6 h-6 text-descriptionColor" />
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-headerColor">Unfollow</h2>
            <p className="text-sm text-descriptionColor leading-[140%] mt-1">
              Are you sure you want to unfollow User Name?
            </p>
          </div>
          <div className="flex mt-6 items-center justify-center gap-3">
            <button
              className="px-6 rounded-full py-2 cursor-pointer  text-base font-semibold text-descriptionColor transition-all hover:bg-bgLightColor hover:shadow active:scale-95"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button className="px-6 rounded-full bg-primaryColor py-2 cursor-pointer  text-base font-semibold text-white transition-all hover:bg-[#008c99] active:scale-95">
              Yes, Unfollow
            </button>
          </div>
        </div>
      </div>
    </RootDialog>
  );
}

export default UserUnfollowDialog;
