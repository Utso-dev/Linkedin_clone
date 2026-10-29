"use client";
import TermsSkeletonLoader from "@/components/reusable/All Skleton/TermsSkeletonLoader";
import { useGetTermsAndConditionsQuery } from "@/feature/slice/aboutUs/aboutUs";

export default function TermsConditon() {
  const { data, isLoading, isError } = useGetTermsAndConditionsQuery({});

  if (isError) {
    return <div>error</div>;
  }
  const terms = data?.data;
  if (isLoading) {
    return <TermsSkeletonLoader />;
  }
  return (
    <div className="privacy-policy  py-8 md:py-12  lg:py-15">
      <div className="border rounded-2xl overflow-hidden  border-primaryColor">
        <div className="p-4 md:p-6 bg-primaryColor lg:p-8">
          <h1 className="text-center items-center font-semibold text-2xl lg:text-3xl text-whiteColor">
            {terms?.title}
          </h1>
        </div>
        {/* Render the HTML content safely */}
        <div className="p-4 md:p-6 lg:p-8 ">
          <div dangerouslySetInnerHTML={{ __html: terms?.content || "" }} />
        </div>
      </div>
    </div>
  );
}
