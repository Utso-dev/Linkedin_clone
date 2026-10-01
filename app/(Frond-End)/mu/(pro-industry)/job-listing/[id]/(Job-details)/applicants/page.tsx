import AplicantDetailsPage from "../../../../_component/applicant/AplicantDetailsPage";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <AplicantDetailsPage id={id} />
    </div>
  );
}

export default page;