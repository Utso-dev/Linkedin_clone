"use server";

import { fetchWrapper } from "@/src/utils/fetchWrapper";
import { revalidatePath } from "next/cache";

export async function joinGroup(formData: FormData) {
  const groupId = Number(formData.get("group_id"));
  if (!Number.isFinite(groupId)) return;

  try {
    await fetchWrapper("/group/join", {
      method: "POST",
      body: JSON.stringify({ group_id: groupId }),
      next: { tags: ["posts"] },
    });

    revalidatePath("/mu");
  } catch (error) {
    console.error("Join group error:", error);
    return;
  }
}
