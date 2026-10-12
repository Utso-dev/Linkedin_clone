import PostList from "@/app/(Frond-End)/_components/mainPage/post/PostList";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="">
      <div className="mt-4 grid-cols-2 gap-4 grid">
        <PostList url={`/industry/post/view/${id}?page=1&per_page=10`} />
        <div>
        
      </div>
      </div>
      
    </div>
  );
}

export default page;
