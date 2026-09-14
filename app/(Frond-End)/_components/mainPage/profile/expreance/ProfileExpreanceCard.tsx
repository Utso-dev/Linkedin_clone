import { DeleteIcon, EditeIcon, PencileIcon } from "@/public/svgIcons/Icons";
import { useState } from "react";
import ExpreanceAddFrom from "./ExpreanceAddFrom";
import ExpreanceDataDelete from "./ExpreanceDataDelete";

function ProfileExpreanceCard({
  item,
  borderb,
  is_own_experience,
}: {
  item: any;
  borderb: boolean;
  is_own_experience?: boolean;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div>
      {" "}
      <article
        className={`py-4 relative ${borderb ? "border-b border-borderColor" : ""}`}
      >
        <div className="flex items-start gap-2.5">
          <div className="">
            <div className="mt-4 text-base md:text-lg font-semibold leading-[1.2] text-descriptionColor relative">
              <div className="h-3 w-3 absolute rounded-full -left-10 top-1/2  -translate-y-1/2 shrink-0 bg-liteDescriptionColor" />

              <div className="flex items-center gap-4 ">
                <h3 className="text-base font-semibold leading-[1.2] text-descriptionColor">
                  {item?.title || "Job Title"}
                </h3>

                {is_own_experience && (
                  <button
                    onClick={() => setIsEditOpen(true)}
                    type="button"
                    className="cursor-pointer"
                  >
                    <PencileIcon className="h-4 w-4 text-descriptionColor" />
                  </button>
                )}
                {is_own_experience && (
                  <button
                    onClick={() => setIsDeleteOpen(true)}
                    type="button"
                    className="cursor-pointer"
                  >
                    <DeleteIcon className="h-4 w-4 text-redColor" />
                  </button>
                )}
              </div>
            </div>
            <p className="mt-1 flex items-center gap- text-sm text-descriptionColor">
              {item.timeline}
            </p>
            <p className="mt-0.5 capitalize text-sm text-descriptionColor">
              {item.location || "Location"}
            </p>
          </div>
        </div>

        {item.description && (
          <div className="mt-4 ">
            <h5 className="text-sm font-semibold text-descriptionColor">
              Description
            </h5>
            <p className="mt-1.5 text-base leading-[1.45] text-descriptionColor">
              {item.description}
            </p>
          </div>
        )}

        {item.skills_data.length > 0 && (
          <div className="mt-4 ">
            <h5 className="text-sm font-semibold text-descriptionColor">
              Skills
            </h5>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.skills_data.map((skill, skillIndex) => (
                <span
                  key={`${item.id}-${skill}-${skillIndex}`}
                  className="rounded-full bg-bgLightColor px-4 py-1.5 text-base font-medium text-headerColor"
                >
                  {skill?.name || "Skill Name"}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
      {isEditOpen && (
        <ExpreanceAddFrom
          open={isEditOpen}
          setOpen={setIsEditOpen}
          initialValues={item}
        />
      )}
      {isDeleteOpen && (
        <ExpreanceDataDelete
          groupId={item.id}
          setIsOpen={setIsDeleteOpen}
          open={isDeleteOpen}
        />
      )}
    </div>
  );
}

export default ProfileExpreanceCard;
