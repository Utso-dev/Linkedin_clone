import CreateCompanyPage from "../_component/company/CompanyCreatePage";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <div>
        <CreateCompanyPage UId={id} />
      </div>
    </div>
  );
}

export default page;
