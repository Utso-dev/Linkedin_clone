import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function GraphSkeleton() {
  return (
    <div>
        <div className="bg-white rounded-2xl border border-borderColor/80 p-6 h-96 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <Skeleton className="w-40 h-6 bg-gray-100 rounded" />
            <Skeleton className="w-28 h-8 bg-gray-100 rounded" />
          </div>
          <Skeleton className="w-full h-64 bg-gray-50 rounded-xl" />
        </div>
    </div>
  )
}

export default GraphSkeleton