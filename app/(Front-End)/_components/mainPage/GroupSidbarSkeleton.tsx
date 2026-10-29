import { GroupCardSkeleton } from "@/components/reusable/All Skleton/GroupCardSkeleton";

export default function GroupSidbarSkeleton() {
  return (
    <aside className="rounded-md ">
      <h3 className="text-base lg:text-lg py-3 font-semibold text-headerColor">
        Groups you might be Interested
      </h3>

      <div className=" space-y-0">
        {Array.from({ length: 3 }).map((_, idx) => (
          <GroupCardSkeleton key={idx} />
        ))}
      </div>
    </aside>
  );
}
