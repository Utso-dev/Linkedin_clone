import JobListFilterSection from "../_component/JobListFilterSection";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <JobListFilterSection />
      {children}
    </div>
  );
}

export default layout;
