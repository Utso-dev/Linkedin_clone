import RootDialog from "@/components/reusable/RootDialog";
import { VerifyBadgeIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";

function JobPostConfirmation({
  open,
  setOpen,
  jobId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
    jobId: string | number;
}) {
  return (
    <RootDialog open={open} setOpen={setOpen}>
      <h2>Your have create job post</h2>
      <VerifyBadgeIcon className="text-lightGreenColor2 w-16 h-16 " />
      <p className="text-lightGreenColor2">Post Successfully Created</p>
      <Link className="w-full px-4 py-2 md:py-3" href={`/mu/job-listing/${jobId}/job-details`} > View Job Details</Link>
    </RootDialog>
  );
}

export default JobPostConfirmation;
