import { Bookmark } from "lucide-react";
import Link from "next/link";

function SaveJobsNotFound() {
  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
          <Bookmark className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-headerColor">
          No saved jobs yet
        </h3>
        <p className="text-sm text-grayColor1 mt-1 mb-5">
          You haven't saved any jobs yet. When you find jobs you're interested
          in, save them to apply later.
        </p>
        <Link
          href="/mu/jobs"
          className="inline-block bg-primaryColor text-white text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition"
        >
          Explore Jobs
        </Link>
      </div>
    </div>
  );
}

export default SaveJobsNotFound;
