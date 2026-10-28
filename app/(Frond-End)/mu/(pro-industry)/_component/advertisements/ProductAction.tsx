"use client";

import { Eye, Pencil, Trash2, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AdvertisementDeleteModal from "./AdvertisementDeleteModal";
import AdvertismentViewModal from "./AdvertismentViewModal";

interface ProductActionProps {
  row: any;
  onSuccess?: () => void;
  className?: string;
}

export default function ProductAction({
  row,
  onSuccess,
  className,
}: ProductActionProps) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const isBoosted = Boolean(
    row.is_boosted || (row.boost_days_left && row.boost_days_left > 0),
  );

  return (
    <>
      <div className={className || "flex items-center justify-end gap-2 pr-3"}>
        {/* Boost Now Button -> Navigate to dedicated Boosting Plan page */}
        {isBoosted ? (
          <button
            type="button"
            disabled
            className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-300" />
            <span>Boost Now</span>
          </button>
        ) : (
          <Link
            href={`/mu/products/${row.id}/boosting-plan`}
            className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition border-[#7C3AED] bg-white text-[#7C3AED] hover:bg-[#F5F3FF] cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-[#7C3AED]" />
            <span>Boost Now</span>
          </Link>
        )}

        {/* View Ad Button */}
        <button
          type="button"
          onClick={() => setViewModalOpen(true)}
          className="p-1.5 rounded-lg border border-borderColor hover:bg-bgColor text-gray-500 hover:text-primaryColor transition-colors cursor-pointer"
          title="View Ad"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Delete Ad Button */}
        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          className="p-1.5 rounded-lg border border-borderColor hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
          title="Delete Ad"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Edit Ad Button */}
        <Link
          href={`/mu/products/${row.id}/edit`}
          className="p-1.5 rounded-lg border border-borderColor hover:bg-bgColor text-gray-500 hover:text-primaryColor transition-colors cursor-pointer"
          title="Edit Ad"
        >
          <Pencil className="w-4 h-4" />
        </Link>
      </div>

      {/* View Modal */}
      {viewModalOpen && (
        <AdvertismentViewModal
          open={viewModalOpen}
          setOpen={setViewModalOpen}
          adId={row.id}
          is_owner={true}
        />
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <AdvertisementDeleteModal
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          adId={row.id}
        />
      )}
    </>
  );
}
