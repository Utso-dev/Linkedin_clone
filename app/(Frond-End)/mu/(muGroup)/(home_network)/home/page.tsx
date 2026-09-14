export const dynamic = "force-dynamic";
import GroupSidbarWrapper from "@/app/(Frond-End)/_components/mainPage/GroupSidbarWrapper";
import CreatePostSection from "@/app/(Frond-End)/_components/mainPage/post/CreatePostSection";
import PostList from "@/app/(Frond-End)/_components/mainPage/post/PostList";

function page() {
  return (
    <div className="md:grid grid-cols-12 gap-6">
      <div className="md:col-span-8 col-span-12 space-y-6">
        <CreatePostSection />
        <div>
          <PostList />
        </div>
      </div>
      <div className="col-span-4 hidden md:block border-l border-[#D2D2D5] pl-4 md:pl-6 h-full md:sticky md:top-25 md:h-[calc(100vh-5rem)] md:overflow-y-auto self-start">
        <GroupSidbarWrapper />
      </div>
    </div>
  );
}

export default page;
