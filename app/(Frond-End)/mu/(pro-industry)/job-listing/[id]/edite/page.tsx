import CreateJobsFrom from "../../../_component/jobs/CreateJobsFrom";

async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  return (
    <div>
      <CreateJobsFrom id={id} />
    </div>
  );
}

export default page;
