"use client";

import {
  setCommentControl,
  setPostVisibility,
} from "@/feature/slice/postCompose/postComposeSlice";
import {
  BanIcon,
  GlobalIcon,
  GroupUserIcon,
  MultiUserIcon,
} from "@/public/svgIcons/Icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type PostVisibility = "public" | "connections" | "group";
type CommentVisibility = "anyone" | "connections" | "no_one";

interface postAccessType {
  value: PostVisibility;
  label: string;
  icon: string | React.ComponentType<{ className?: string }>;
}

const postVisibilityOptions: postAccessType[] = [
  { value: "public", label: "Anyone", icon: GlobalIcon },
  { value: "connections", label: "Connections only", icon: MultiUserIcon },
  { value: "group", label: "Group", icon: GroupUserIcon },
];

const commentControlOptions: Array<{
  value: CommentVisibility;
  label: string;
  icon: postAccessType["icon"];
}> = [
    { value: "anyone", label: "Anyone", icon: GlobalIcon },
    { value: "connections", label: "Connections only", icon: MultiUserIcon },
    { value: "no_one", label: "No one", icon: BanIcon },
  ];

function PostAccessModal({
  setPostType,
  postData,
}: {
  setPostType: (type: string) => void;
  postData?: any;
}) {
  const dispatch = useDispatch();
  const { postVisibility, commentControl } = useSelector(
    (state: any) => state.postCompose,
  );

  const resolvePostVisibility = (value?: string): PostVisibility => {
    if (value === "groups") {
      return "group";
    }

    if (value === "public" || value === "connections" || value === "group") {
      return value;
    }

    return postVisibility;
  };

  const resolveCommentControl = (value?: string): CommentVisibility => {
    if (value === "anyone" || value === "connections" || value === "no_one") {
      return value;
    }

    return commentControl;
  };

  const [selectedPostVisibility, setSelectedPostVisibility] =
    useState<PostVisibility>(() => resolvePostVisibility(postData?.visibility));
  const [selectedCommentControl, setSelectedCommentControl] =
    useState<CommentVisibility>(() =>
      resolveCommentControl(postData?.who_can_comment),
    );

  useEffect(() => {
    setSelectedPostVisibility(resolvePostVisibility(postData?.visibility));
    setSelectedCommentControl(resolveCommentControl(postData?.who_can_comment));
  }, [postData?.visibility, postData?.who_can_comment]);

  const handlePostVisibilityChange = (value: PostVisibility) => {
    setSelectedPostVisibility(value);
    dispatch(setPostVisibility(value));

    if (value === "group") {
      setPostType("post_group");
      return;
    }

    setPostType("Post_write");
  };

  const handleCommentControlChange = (value: CommentVisibility) => {
    setSelectedCommentControl(value);
    dispatch(setCommentControl(value));
  };

  return (
    <section className=" flex flex-col max-h-[90vh] py-4 ">
      <div className="border-b border-borderColor px-4 pb-2">
        <h3 className="text-lg   leading-12 font-semibold text-descriptionColor">
          Post Setting
        </h3>
      </div>
      <div className=" flex-1 h-full overflow-y-auto">
        <div className="px-4 pb-4 pt-5">
          <h4 className="text-sm font-semibold text-descriptionColor">
            Select who can see your posts
          </h4>

          <div className="mt-4 space-y-1">
            {postVisibilityOptions.map((option) => {
              const isActive = selectedPostVisibility === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handlePostVisibilityChange(option.value)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-md py-2 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f3f5] text-descriptionColor">
                      <option.icon className="h-5 w-5" />
                    </div>
                    <span className="text-lg  font-semibold text-descriptionColor">
                      {option.label}
                    </span>
                  </div>

                  <span
                    className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 ${isActive ? "border-primaryColor" : "border-grayColor1"
                      }`}
                  >
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-primaryColor" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-borderColor px-4 pb-4 pt-5">
          <h4 className="text-sm font-semibold text-descriptionColor">
            Comment Control
          </h4>

          <div className="mt-4 space-y-1">
            {commentControlOptions.map((option) => {
              const isActive = selectedCommentControl === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleCommentControlChange(option.value)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-md py-2 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f3f5] text-descriptionColor">
                      <option.icon className="h-5 w-5" />
                    </div>
                    <span className="text-lg  font-semibold text-descriptionColor">
                      {option.label}
                    </span>
                  </div>

                  <span
                    className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 ${isActive ? "border-primaryColor" : "border-grayColor1"
                      }`}
                  >
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-primaryColor" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4 px-4">
        <button
          onClick={() => setPostType("Post_write")}
          className="rounded-md bg-bgLightColor px-4 hover:shadow-lg cursor-pointer py-2 text-descriptionColor hover:bg-bgColor"
        >
          Back
        </button>
        <button
          onClick={() => setPostType("Post_write")}
          className="rounded-md cursor-pointer hover:shadow-lg bg-buttonColor px-4 py-2 text-whiteColor hover:bg-buttonHover"
        >
          Done
        </button>
      </div>
    </section>
  );
}

export default PostAccessModal;
