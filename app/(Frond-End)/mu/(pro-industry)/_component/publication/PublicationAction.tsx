"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import PublicationDeleteModal from "./PublicationDeleteModal";
import PublicationViewModal from "./PublicationViewModal";

interface PublicationActionProps {
  row: { id: string | number; [key: string]: any };
  ispremium: boolean;
}

export default function PublicationAction({ row, ispremium }: PublicationActionProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-1.5 pr-3">
        {/* Edit Button */}
        <Link
          href={ispremium ? `/mu/premium/publications/${row.id}/edit` : `/mu/publications/${row.id}/edit`}
          className="w-8 h-8 rounded-md border border-borderColor hover:bg-bgColor flex items-center justify-center text-gray-500 hover:text-primaryColor hover:border-primaryColor transition-colors cursor-pointer"
          title="Edit Publication"
        >
          <Pencil className="w-3.5 h-3.5" />
        </Link>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          className="w-8 h-8 rounded-md border border-borderColor hover:bg-red-50 flex items-center justify-center text-gray-500 hover:text-redColor hover:border-redColor transition-colors cursor-pointer"
          title="Delete Publication"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* View Details Button */}
        <button
          type="button"
          onClick={() => setViewModalOpen(true)}
          className="w-8 h-8 rounded-md border border-borderColor hover:bg-bgColor flex items-center justify-center text-gray-500 hover:text-primaryColor hover:border-primaryColor transition-colors cursor-pointer"
          title="View Publication"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <PublicationDeleteModal
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          publicationId={row.id}
        />
      )}

      {/* View Details Modal */}
      {viewModalOpen && (
        <PublicationViewModal
          open={viewModalOpen}
          setOpen={setViewModalOpen}
          publicationId={row.id}
        />
      )}
    </>
  );
}