"use client";

import RootDialog from "@/components/reusable/RootDialog";
import { useDeleteCommentMutation, useDeleteReplyMutation } from "@/feature/slice/post/commentSlice";
import { useDeletePostMutation } from "@/feature/slice/post/postSlice";
import { DeleteIcon } from "@/public/svgIcons/Icons";
import toast from "react-hot-toast";

function CommentReplyDeleteDialog({
  open,
  setOpen,
  commentId,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  commentId?: number ;
}) {
  const [deleteReply, { isLoading }] = useDeleteReplyMutation();
  const handleDeletePost = async () => {
    try {
      const response = await deleteReply(commentId ?? "").unwrap();
      toast.success(response?.message || "Reply deleted successfully");
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete reply:", error);
      toast.error(error?.data?.message || "Failed to delete reply");
    }
  };
  return (
    <RootDialog open={open} setOpen={setOpen}>
      <div className="md:p-6 p-4">
        <div className="text-center flex flex-col items-center justify-center">
          <div className="flex justify-center items-center w-18 h-18 rounded-full bg-bgColor border border-borderColor/20 ">
            <DeleteIcon className="w-6 h-6 text-redColor" />
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-headerColor">
              Delete Reply
            </h2>
            <p className="text-sm text-descriptionColor leading-[140%] mt-1">
              Are you sure you want to delete the reply? Connection of these
              group no longer be able see the reply in this group!
            </p>
          </div>
          <div className="flex mt-6 items-center justify-center gap-3">
            <button
              className="px-6 rounded-full py-2 cursor-pointer  text-base font-semibold text-descriptionColor transition-all hover:bg-bgLightColor hover:shadow active:scale-95"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-6 rounded-full bg-redColor py-2 cursor-pointer disabled:bg-bgColor disabled:cursor-not-allowed disabled:text-grayColor1 text-base font-semibold text-white transition-all hover:bg-red-600 active:scale-95"
              onClick={handleDeletePost}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </RootDialog>
  );
}

export default CommentReplyDeleteDialog;
