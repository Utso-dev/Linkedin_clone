import { Suspense } from "react";
import GroupSidbar from "./GroupSidbar";
import GroupSidbarSkeleton from "./GroupSidbarSkeleton";

export default function GroupSidbarWrapper() {
  return (
    <Suspense fallback={<GroupSidbarSkeleton />}>
      <GroupSidbar />
    </Suspense>
  );
}
