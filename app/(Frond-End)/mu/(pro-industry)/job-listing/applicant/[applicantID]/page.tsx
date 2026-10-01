import ApplicantUserDetails from "../../../_component/applicant/ApplicantUserDetails";

async function page({ params }: { params: Promise<{ applicantID: string }> }) {
  const { applicantID } = await params;
  return (
    <div>
     <ApplicantUserDetails applicantId={applicantID} />  
    
    </div>
  );
}

export default page;
