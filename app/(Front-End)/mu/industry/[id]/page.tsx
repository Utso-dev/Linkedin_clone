import PostList from "@/app/(Front-End)/_components/mainPage/post/PostList";
import RelatedIndustry from "../../(pro-industry)/_component/RelatedIndustry";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="">
      <div className="mt-4 grid-cols-1 md:grid-cols-5  gap-4  xl:gap-6 grid">
        <div className="md:col-span-3  col-span-1">
          <PostList url={`/industry/post/view/${id}?page=1&per_page=10`} />
        </div>
        <div className="md:col-span-2 md:block hidden ">
          <RelatedIndustry industryId={id} />
        </div>
      </div>
    </div>
  );
}

export default page;
