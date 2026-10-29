import { EducationType } from "@/lib/type";
import { DeleteIcon, PencileIcon } from "@/public/svgIcons/Icons";
import { useState } from "react";
import { PiStudent } from "react-icons/pi";
import EducationDelete from "./EducationDelete";
import ProfileEducationForm from "./ProfileEducationForm";

function ProfileEducationCard({
  item,
  is_own_experience,
}: {
  item: EducationType;
  is_own_experience?: boolean;
}) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleEdite = (item: EducationType) => {
    setIsEditOpen(true);
  };

  return (
    <article className={`py-4  border-b border-borderColor`}>
      <div className="flex items-start gap-2.5">
        <div className="h-11 w-11 shrink-0 flex items-center justify-center bg-primaryColor rounded-md">
          <PiStudent className="text-whiteColor w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-semibold leading-[1.2] text-descriptionColor">
              {item.institution?.name || "Institution Name"}
            </h3>
            {is_own_experience && (
              <button
                type="button"
                onClick={() => handleEdite(item)}
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

          <p className="mt-1 text-sm text-descriptionColor">
            {item.degree} • {item.field_study}
          </p>
          <p className="mt-1 text-sm text-descriptionColor">
            {item.start_year} •{" "}
            {item?.is_current ? item?.status : item.end_year}
          </p>
          {item.grade && (
            <p className="mt-0.5 text-sm text-descriptionColor">
              GPA: {item.grade}
            </p>
          )}
        </div>
      </div>

      {item.description && (
        <div className="mt-4 pl-13">
          <h5 className="text-sm font-semibold text-descriptionColor">
            Description
          </h5>
          <p className="mt-1.5 text-base leading-[1.45] text-descriptionColor">
            {item.description}
          </p>
        </div>
      )}

      {item.activities && (
        <div className="mt-4 pl-13">
          <h5 className="text-sm font-semibold text-descriptionColor">
            Activities and societies
          </h5>
          <p className="mt-1.5 text-base leading-[1.45] text-descriptionColor">
            {item.activities}
          </p>
        </div>
      )}

      {item.skills_data.length > 0 && (
        <div className="mt-4 pl-13">
          <h5 className="text-sm font-semibold text-descriptionColor">
            Skills
          </h5>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.skills_data.map((skill, skillIndex) => (
              <span
                key={`${item.id}-${skill}-${skillIndex}`}
                className="rounded-full bg-bgLightColor px-4 py-1.5 text-base font-medium text-headerColor"
              >
                {skill?.name}
              </span>
            ))}
          </div>
        </div>
      )}
      {isEditOpen && (
        <ProfileEducationForm
          open={isEditOpen}
          setOpen={setIsEditOpen}
          initialValues={item}
        />
      )}
      {isDeleteOpen && (
        <EducationDelete
          educationId={item.id}
          setIsOpen={setIsDeleteOpen}
          open={isDeleteOpen}
        />
      )}
    </article>
  );
}

export default ProfileEducationCard;
