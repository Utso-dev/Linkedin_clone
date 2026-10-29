import JobsDetailsPage from "../../../../_component/jobs/JobsDetailsPage";


async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <JobsDetailsPage id={id} />
    </div>
  );
}

export default page;
