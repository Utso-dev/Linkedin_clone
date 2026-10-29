import RootDialog from "@/components/reusable/RootDialog";
import {
  useDeleteGroupPostMutation,
  useDeletePostMutation,
} from "@/feature/slice/post/postSlice";
import { useDeleteIndustryPostMutation } from "@/feature/slice/jobs/industrySlice";
import { DeleteIcon } from "@/public/svgIcons/Icons";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function DeleteGroup({
  open,
  setOpen,
  postId,
  groupId,
  isIndustryPost = false,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  postId?: number;
  groupId?: string;
  isIndustryPost?: boolean;
}) {
  const router = useRouter();
  const [deletePost, { isLoading: isDeletingProfilePost }] =
    useDeletePostMutation();
  const [deleteGroupPost, { isLoading: isDeletingGroupPost }] =
    useDeleteGroupPostMutation();
  const [deleteIndustryPost, { isLoading: isDeletingIndustryPost }] =
    useDeleteIndustryPostMutation();
  const isLoading =
    isDeletingProfilePost || isDeletingGroupPost || isDeletingIndustryPost;

  const handleDeletePost = async () => {
    try {
      const response = isIndustryPost
        ? await deleteIndustryPost(postId).unwrap()
        : groupId
          ? await deleteGroupPost({ groupId, postId }).unwrap()
          : await deletePost(postId).unwrap();
      toast.success(response?.message || "Post deleted successfully");
      setOpen(false);
      // ask server to revalidate the newsfeed path so server components refresh
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "/mu" }),
        });
      } catch (err) {
        console.warn("Revalidate request failed", err);
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error(error?.data?.message || "Failed to delete post");
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
              Delete Post
            </h2>
            <p className="text-sm text-descriptionColor leading-[140%] mt-1">
              Are you sure you want to delete the post? Connection of these
              group no longer be able see the post in this group!
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

export default DeleteGroup;
