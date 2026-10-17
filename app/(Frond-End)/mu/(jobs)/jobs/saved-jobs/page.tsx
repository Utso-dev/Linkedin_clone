import Search from "@/components/reusable/Search";
import SaveJobsList from "../_component/SaveJobsList";

export default function SavedJobsPage() {
  return (
    <main className="w-full">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="sm:text-2xl text-xl font-bold text-headerColor">
            Saved Jobs
          </h1>
          <p className="text-sm sm:text-base text-grayColor1 mt-1">
            Saved your most favorite jobs.
          </p>
        </div>
        <div className=" w-auto sm:w-65">
          <Search placeHolder="Search Job..." />
        </div>
      </header>
      <div>
        <SaveJobsList />
      </div>
    </main>
  );
}
