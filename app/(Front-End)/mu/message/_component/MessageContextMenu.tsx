"use client";

import { useEffect, useRef } from "react";
import { IoArrowUndoOutline, IoTrashOutline } from "react-icons/io5";

interface MessageContextMenuProps {
  x: number;
  y: number;
  canDelete?: boolean;
  onClose: () => void;
  onReply: () => void;
  onDelete: () => void;
}

export default function MessageContextMenu({
  x,
  y,
  canDelete,
  onClose,
  onReply,
  onDelete,
}: MessageContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) onClose();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{
        left: Math.min(x, window.innerWidth - 170),
        top: Math.min(y, window.innerHeight - 110),
      }}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-36"
    >
      <button
        onClick={onReply}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
      >
        <IoArrowUndoOutline className="text-base" />
        Reply
      </button>
      {canDelete && (
        <button
          onClick={onDelete}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer"
        >
          <IoTrashOutline className="text-base" />
          Delete
        </button>
      )}
    </div>
  );
}
