"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostActivity from "./PostActivity";

interface Post {
  id: number;
  title?: string;
  content?: string;
}

interface BasicUserActivityProps {
  user: {};
}

export default function BasicUserActivity({ user }: BasicUserActivityProps) {
  const postList = user;

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-[#1D1F2C]">Activity</p>

        <button
          type="button"
          className="rounded-full border border-[#686868] px-3 py-1 text-sm"
        >
          See all Post
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-4">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>

            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          {/* Posts */}
          <TabsContent value="posts">
            <div>
              <PostActivity />
            </div>
          </TabsContent>

          {/* Comments */}
          <TabsContent value="comments">
            <p className="py-8 text-center text-sm text-gray-400">
              No comments found
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
