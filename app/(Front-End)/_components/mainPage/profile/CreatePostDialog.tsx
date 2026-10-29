import RootDialog from "@/components/reusable/RootDialog";
import {
  resetPostComposeState,
  setPostType,
} from "@/feature/slice/postCompose/postComposeSlice";
import { useDispatch, useSelector } from "react-redux";
import PostAccessModal from "../post/PostAccessModal";
import PostGroupListModal from "../post/PostGroupListModal";
import PostModal from "../post/PostModal";

function CreatePostDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const dispatch = useDispatch();
  const { postType } = useSelector((state: any) => state.postCompose);
  const handleSetPostType = (type: string) => {
    dispatch(setPostType(type as any));
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      dispatch(resetPostComposeState());
    }
    setIsOpen(open);
  };

  return (
    <div>
      <RootDialog open={isOpen} setOpen={handleClose}>
        <div className={postType !== "Post_write" ? "hidden" : ""}>
          <PostModal setOpen={setIsOpen} setPostType={handleSetPostType} />
        </div>
        <div className={postType !== "post_access" ? "hidden" : ""}>
          <PostAccessModal setPostType={handleSetPostType} />
        </div>
        {postType === "post_group" && (
          <PostGroupListModal setPostType={handleSetPostType} />
        )}
      </RootDialog>
    </div>
  );
}

export default CreatePostDialog;
