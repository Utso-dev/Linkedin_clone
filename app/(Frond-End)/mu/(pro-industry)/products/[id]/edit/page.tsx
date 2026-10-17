import CreateAdvertisementForm from "../../../_component/advertisements/CreateAdvertisementForm";

async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <div>
      <CreateAdvertisementForm id={id} />
    </div>
  );
}

export default page;
