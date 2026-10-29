"use client";
import { useGetSinglePublicationQuery } from "@/feature/slice/jobs/publicationSlice";
import { useParams } from "next/navigation";
import PublicationsDetails from "../../../_components/PublicationsDetails";

function page() {
  const params = useParams();
  const id = params.id as string;
  const { data: response, isLoading } = useGetSinglePublicationQuery(id, {
    skip: !id,
  });
  

  return (
    <div>
      {isLoading ? (
        <div className="flex-1 py-20 flex flex-col items-center justify-center space-y-3">
          <span className="inline-block w-8 h-8 border-3 border-primaryColor border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-descriptionColor">
            Loading publication details...
          </p>
        </div>
      ) : !response?.data ? (
        <div className="flex-1 py-16 flex items-center justify-center text-sm text-descriptionColor">
          Publication not found.
        </div>
      ) : (
        <PublicationsDetails publication={response?.data} />
      )}
    </div>
  );
}

export default page;
