"use client"

import React from 'react';

const MapSkeleton = () => {
  // Polygon points as a single string for CSS clip-path
  const clipPathPolygon = `polygon(
    13% 13%, 15% 17%, 15% 12%, 29% 17%, 39% 19%, 51% 20%, 58% 23%, 54% 28%, 59% 26%,
    61% 23%, 62% 27%, 66% 26%, 62% 29%, 62% 38%, 63% 41%, 64% 39%, 63% 34%, 65% 29%,
    68% 29%, 68% 41%, 71% 40%, 74% 36%, 78% 31%, 79% 26%, 84% 25%, 90% 22%, 86% 29%,
    87% 34%, 82% 38%, 81% 49%, 82% 56%, 77% 64%, 74% 72%, 78% 82%, 78% 89%, 74% 85%,
    73% 80%, 71% 75%, 68% 76%, 67% 75%, 64% 75%, 61% 76%, 62% 79%, 60% 79%, 57% 78%,
    53% 78%, 48% 84%, 47% 90%, 44% 87%, 41% 77%, 39% 77%, 37% 79%, 34% 74%, 32% 70%,
    29% 70%, 29% 72%, 22% 68%, 18% 64%, 15% 64%, 15% 61%, 12% 56%, 10% 54%, 9% 46%,
    8% 36%, 10% 31%, 12% 20%
  )`;

  return (
    <div className="flex flex-col items-center justify-center bg-[#F8FAFC] p-4">
      {/* Centered Title Bar Skeleton */}

      {/* Main Map Container */}
      <div className="relative w-full aspect-959/593 bg-white rounded-xl border border-blue-50 flex flex-col items-center justify-center overflow-hidden p-8 md:p-16">

        <div className="h-9 w-40 bg-gray-200 rounded-full mb-10 animate-pulse"></div>
        {/* Clipped Silhouette Div */}
        <div
          className="w-full h-full bg-gray-200 animate-pulse"
          style={{ clipPath: clipPathPolygon }}
        />

        {/* Shimmer Overlay: Moving light effect across the map */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-[20%] bg-linear-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default MapSkeleton;