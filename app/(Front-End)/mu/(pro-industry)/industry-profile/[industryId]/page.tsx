import CreatePostSection from "@/app/(Front-End)/_components/mainPage/post/CreatePostSection";
import PostList from "@/app/(Front-End)/_components/mainPage/post/PostList";
import IndustryHeroSection from "../_component/IndustryHeroSection";

async function page({ params }: { params: Promise<{ industryId: string }> }) {
  const { industryId } = await params;
  return (
    <div className="space-y-4">
      <IndustryHeroSection userId={industryId} />
      <div className="mt-4">
        <CreatePostSection />
      </div>
      <div className="mt-4">
        <PostList
          url={`/industry/post/view/${industryId}?page=1&per_page=10`}
        />
      </div>
    </div>
  );
}

export default page;
