import { Suspense } from "react";
import ConnectionRequestLoading from "./ConnectionRequestLoading";
import ConnectionRequestHeader from "./connectionRequests/ConnectionRequestHeader";
import SuggestConnectionList from "./connectionUsers/SuggestConnectionList";
import CurrentConnectionRequest from "./CurrentConnectionRequest";

function ConnectionRequestSection({ searchQuery }: { searchQuery?: string }) {
  return (
    <section className="w-full bg-white  pb-4 pt-2 md:px-3">
      <ConnectionRequestHeader />
      <Suspense fallback={<ConnectionRequestLoading length={5} />}>
        <CurrentConnectionRequest searchQuery={searchQuery} />
      </Suspense>
      <div className="mt-10">
        <h3 className="mb-5 text-xl font-semibold leading-[120%] text-headerColor">
          Connect With New Network
        </h3>

        <SuggestConnectionList searchQuery={searchQuery} />
      </div>
    </section>
  );
}

export default ConnectionRequestSection;
