import JobListFilterSection from "../../_component/jobs/JobListFilterSection";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <JobListFilterSection />
      {children}
    </div>
  );
}

export default layout;
