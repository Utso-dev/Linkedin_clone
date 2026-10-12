import CreatePostSection from "@/app/(Frond-End)/_components/mainPage/post/CreatePostSection";
import IndustryHeroSection from "../_component/IndustryHeroSection";
import PostList from "@/app/(Frond-End)/_components/mainPage/post/PostList";

async function page({ params }: { params: Promise<{ industryId: string }> }) {
  const { industryId } = await params;
  return (
    <div>
      <IndustryHeroSection userId={industryId} />
      <div className="mt-4">
        <CreatePostSection />
      </div>
      <div>
        <PostList
          url={`/industry/post/view/${industryId}?page=1&per_page=10`}
        />
      </div>
    </div>
  );
}

export default page;
