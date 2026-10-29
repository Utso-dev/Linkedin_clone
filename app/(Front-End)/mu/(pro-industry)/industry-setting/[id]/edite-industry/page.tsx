import CreateCompanyPage from "../../../../create-company-page/_component/company/CompanyCreatePage";

async function page({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  return (
    <div>
      <CreateCompanyPage UId={id} />
    </div>
  );
}

export default page;
