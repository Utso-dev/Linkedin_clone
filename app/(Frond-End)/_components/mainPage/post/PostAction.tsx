import RootDialog from "@/components/reusable/RootDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSendRequestMutation } from "@/feature/slice/connect/connectSlice";
import { setPostType } from "@/feature/slice/postCompose/postComposeSlice";
import { useGetProfileByIdQuery } from "@/feature/slice/user/userSlice";
import { PostFeedType } from "@/lib/type";
import {
  DeleteIcon,
  DotIcon,
  PencileIcon,
  UserBanIcon,
} from "@/public/svgIcons/Icons";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import DeleteGroup from "../group/DeleteGroup";
import GroupPostCreateDialog from "../group/GroupPostCreateDialog";
import GroupUserBanDialog from "../group/GroupUserBanDialog";
import PostAccessModal from "./PostAccessModal";
import PostGroupListModal from "./PostGroupListModal";
import PostModal from "./PostModal";
type PostCardProps = {
  post?: PostFeedType;
  meta?: any;
};
function PostAction({ post, meta }: PostCardProps) {
  const { can_edit, media, can_delete, relationship_status, user } = post || {};
  const { id: userId } = user || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isGroupEdited, setIsGroupEdited] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [action_label, setActionLabel] = useState("Connect");
  const dispatch = useDispatch();
  const { postType } = useSelector((state: any) => state.postCompose);
  const [sendRequest, { isLoading }] = useSendRequestMutation();
  const { data: userProfile } = useGetProfileByIdQuery(userId);
  const handleSetPostType = (type: string) => {
    dispatch(setPostType(type as any));
  };
  const [isBanUser, setIsBanUser] = useState(false);

  const handleConnect = async () => {
    const payload = {
      user_id: user.id,
    };

    try {
      const result = await sendRequest({ payload }).unwrap();
      toast.success(result.message || "Connection request sent!");
      setActionLabel("Sent request");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send connection request.");
    }
  };

  const isRequestSent = (() => {
    const actionLabel = (
      userProfile?.data?.connection_status?.action_label || ""
    )
      .toString()
      .toLowerCase();

    return (
      actionLabel === "pending" || String(relationship_status) === "pending"
    );
  })();

  return (
    <div>
      <div className="flex items-center relative gap-1.5">
        {((relationship_status === "not_connected" &&
          !meta?.is_own_profile &&
          !meta?.is_connected) ||
          isRequestSent) && (
          <button
            onClick={handleConnect}
            disabled={isLoading || action_label !== "Connect" || isRequestSent}
            type="button"
            className={`h-7 disabled:bg-bgColor text-nowrap disabled:cursor-not-allowed disabled:tracking-normal disabled:text-grayColor1 disabled:border-0  rounded-full border px-3 text-sm font-medium transition-all duration-200 hover:tracking-widest cursor-pointer 
             hover:border-buttonColor hover:bg-buttonColor hover:text-whiteColor
               
            `}
          >
            {isLoading
              ? "Sending..."
              : isRequestSent
                ? "Request sent"
                : action_label}
          </button>
        )}
        {(can_edit ||
          can_delete ||
          meta?.is_creator ||
          meta?.is_own_profile) && (
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="cursor-pointer rounded-sm border p-1.5 focus:outline-0"
                aria-label="Open post actions"
              >
                <DotIcon className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-3    w-full">
              <h4 className="text-base font-semibold leading-[140%] text-headerColor md:text-lg">
                Action
              </h4>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setMenuOpen(false);
                  setIsDeleted(true);
                }}
                className={"cursor-pointer px-1 text-nowrap "}
              >
                <DeleteIcon />
                Delete post
              </DropdownMenuItem>
              {post?.visibility === "groups" && can_edit && (
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    setMenuOpen(false);
                    setIsGroupEdited(true);
                  }}
                  className={"cursor-pointer px-1"}
                >
                  <PencileIcon />
                  Edit post
                </DropdownMenuItem>
              )}

              {post?.visibility !== "groups" && (
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    setMenuOpen(false);
                    setIsEdited(true);
                  }}
                  className={"cursor-pointer px-1"}
                >
                  <PencileIcon />
                  Edit post
                </DropdownMenuItem>
              )}
              {post?.visibility === "groups" &&
                meta?.is_creator &&
                !post?.can_edit && (
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      setMenuOpen(false);
                      setIsBanUser(true);
                    }}
                    className="cursor-pointer px-1"
                  >
                    <UserBanIcon /> Ban User
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {isBanUser && (
        <GroupUserBanDialog open={isBanUser} setOpen={setIsBanUser} />
      )}
      {isDeleted && (
        <DeleteGroup
          open={isDeleted}
          setOpen={setIsDeleted}
          groupId={meta?.group_id || post?.group?.id}
          postId={post?.id}
        />
      )}
      {isEdited && (
        <RootDialog open={isEdited} setOpen={setIsEdited}>
          {postType == "Post_write" ? (
            <PostModal
              setOpen={setIsEdited}
              setPostType={handleSetPostType}
              postData={post}
            />
          ) : postType == "post_access" ? (
            <PostAccessModal postData={post} setPostType={handleSetPostType} />
          ) : (
            <PostGroupListModal
              postData={post}
              setPostType={handleSetPostType}
            />
          )}
        </RootDialog>
      )}
      {isGroupEdited && (
        <GroupPostCreateDialog
          open={isGroupEdited}
          groupId={post?.group?.id}
          setOpen={setIsGroupEdited}
          postData={post}
        />
      )}
    </div>
  );
}

export default PostAction;
