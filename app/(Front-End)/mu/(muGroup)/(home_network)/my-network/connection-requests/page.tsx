import ConnectionRequestHeader from "@/app/(Front-End)/_components/mainPage/network/connectionRequests/ConnectionRequestHeader";
import ConnectionRequestList from "@/app/(Front-End)/_components/mainPage/network/connectionRequests/ConnectionRequestList";
import SuggestConnectionList from "@/app/(Front-End)/_components/mainPage/network/connectionUsers/SuggestConnectionList";

async function page({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = (await searchParams) || {};
  const rawSearch = params.search;
  const searchQuery = Array.isArray(rawSearch)
    ? rawSearch[0] || ""
    : rawSearch || "";
  return (
    <div>
      <ConnectionRequestHeader />
      <div>
        <ConnectionRequestList isNetwork={true} />
      </div>
      <div className="mt-10">
        <h3 className="mb-5 text-xl font-semibold leading-[120%] text-headerColor">
          Connect With New Network
        </h3>

        <SuggestConnectionList searchQuery={searchQuery} />
      </div>
    </div>
  );
}

export default page;
