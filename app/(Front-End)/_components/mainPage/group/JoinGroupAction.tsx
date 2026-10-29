"use client";

import { Loader } from "lucide-react";
import { useTransition } from "react";
import { joinGroup } from "./joinGroupAction.server";

function JoinGroupAction({ groupID }: { groupID: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <form
        action={(formData) => {
          startTransition(() => joinGroup(formData));
        }}
      >
        <input type="hidden" name="group_id" value={groupID} />
        <button
          type="submit"
          disabled={isPending}
          className={`py-0.5! px-4! border rounded-full! disabled:bg-bgColor!  disabled:py-1! disabled:text-descriptionColor! disabled:border-none! disabled:border-borderColor!  ${!groupID ? "border-primaryColor! bg-primaryColor! text-whiteColor!" : "border-headerColor!  text-headerColor! bg-whiteColor! hover:border-primaryColor!  hover:text-primaryColor! hover:bg-primaryColor/10!"} mt-4! transition-opacity ${isPending ? "opacity-60" : ""}`}
        >
          {isPending ? <Loader className="animate-spin w-4 h-4" /> : "Join"}
        </button>
      </form>
    </div>
  );
}

export default JoinGroupAction;
