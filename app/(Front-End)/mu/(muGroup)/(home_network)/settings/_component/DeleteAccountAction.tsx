"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import { DeleteIcon } from "@/public/svgIcons/Icons";
import { useState } from "react";
import DeleteResoneModal from "./DeleteResoneModal";

function DeleteAccountAction() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h4 className="text-lg md:text-xl font-semibold text-redColor">
        Dangerous Area
      </h4>
      <div className="flex justify-between items-end flex-col md:flex-row gap-4 mt-4">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-headerColor">
            Close and delete account
          </h3>
          <p className="text-descriptionColor">
            Are you sure you want to close your account? You’ll lose your
            connections, messages, endorsements, and recommendations.
          </p>
        </div>
        <ButtonReuseable
          title="Delete Account"
          icon={<DeleteIcon />}
          className="bg-redColor! text-whiteColor"
          onClick={() => setOpen(true)}
        />
      </div>

      <DeleteResoneModal open={open} setOpen={setOpen} />
    </div>
  );
}

export default DeleteAccountAction;
