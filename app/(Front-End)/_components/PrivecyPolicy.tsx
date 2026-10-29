"use client";
import TermsSkeletonLoader from "@/components/reusable/All Skleton/TermsSkeletonLoader";
import { useGetPrivecyPolicyQuery } from "@/feature/slice/aboutUs/aboutUs";

export default function PrivecyPolicy() {
  const { data, isLoading, isError, error } = useGetPrivecyPolicyQuery({});

  if (isError) {
    return <div>Error loading privacy policy</div>;
  }

  // data structure: { success: true, data: { title, content } }
  const policy = data?.data;
  if (isLoading) {
    return <TermsSkeletonLoader />;
  }
  return (
    <div className="privacy-policy  py-8 md:py-12  lg:py-15">
      <div className="border rounded-2xl overflow-hidden  border-primaryColor">
        <div className="p-4 md:p-6 bg-primaryColor lg:p-8">
          <h1 className="text-center items-center font-semibold text-2xl lg:text-3xl text-whiteColor">
            {policy?.title}
          </h1>
        </div>
        {/* Render the HTML content safely */}
        <div className="p-4 md:p-6 lg:p-8 ">
          <div dangerouslySetInnerHTML={{ __html: policy?.content || "" }} />
        </div>
      </div>
    </div>
  );
}
