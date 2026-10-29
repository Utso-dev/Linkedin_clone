import RootDialog from "@/components/reusable/RootDialog";
import { VerifyBadgeIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";

function JobPostConfirmation({
  open,
  setOpen,
  jobId,
  title 
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  jobId: string | number;
    title: string;
}) {
  return (
    <RootDialog open={open} setOpen={setOpen}>
      <div className="text-center flex flex-col justify-center items-center gap-4 p-4 md:p-6">
        <h2 className="text-lg md:text-2xl text-headerColor font-semibold">
          Your have Posted {title} successfully
        </h2>
        <div className="flex flex-col justify-center items-center">
          <VerifyBadgeIcon className="text-lightGreenColor2 w-16 h-16 " />
          <p className="text-lightGreenColor2 pt-4">
            Post Successfully {title}
          </p>
        </div>
        <Link
          className="w-full px-4 py-2 md:py-3 mt-6 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition text-sm md:text-base font-medium"
          href={`/mu/job-listing/${jobId}/job-details`}
        >
          {" "}
          View Job Details
        </Link>
      </div>
    </RootDialog>
  );
}

export default JobPostConfirmation;
