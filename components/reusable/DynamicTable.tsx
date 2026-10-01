"use client";

import Image from "next/image";
import React from "react";
import { BsSortUp, BsSortUpAlt } from "react-icons/bs";
import { HiOutlineSelector } from "react-icons/hi";

interface ColumnConfig {
  label: React.ReactNode;
  position?: "justify-center" | "justify-start" | "justify-end" | string;
  width?: any;
  accessor: string;
  sortable?: boolean;
  sortFunction?: () => void;
  formatter?: (value: any, row: any, i: number) => React.ReactNode;
}

interface SortConfig {
  key: string;
  direction: "ascending" | "descending";
}

interface DynamicTableProps {
  columns: ColumnConfig[];
  data: any[];
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onView?: (row: any) => void;
  onDelete?: (id: any) => void;
  noDataMessage?: string;
  sortConfig?: SortConfig | null;
  onSort?: (key: string) => void;
  header?: {
    bg?: string;
    padding?: string;
    text?: string;
    rounded?: string;
    fontWeight?: string;
    fontSize?: string;
    position?: "justify-center" | "justify-start" | "justify-end";
  };
  tableMinWidth?: string;
  tableMaxWidth?: string;
  rowStyle?: {
    hover?: boolean;
    hoverbg?: string;
    bg?: string;
    border?: string;
    spaceing?: string;
    rowClickable?: boolean;
    rowClick?: (row: any) => void;
    cursorStype?: string;
    rowClickCheck?: string;
  };
}

export default function DynamicTable({
  columns,
  data,
  currentPage,
  itemsPerPage,
  onPageChange,
  onView,
  onDelete,
  noDataMessage = "No data found.",
  sortConfig,
  onSort,
  header = {
    position: "justify-start",
  },
  rowStyle,
}: DynamicTableProps) {
  // const totalPages = Math.ceil(data.length / itemsPerPage);
  // const data = data.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  const renderSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <HiOutlineSelector className="w-5 h-5 text-headerColor" />;
    }
    if (sortConfig.direction === "ascending") {
      return <BsSortUpAlt className="w-4.5 h-4.5" />;
    }
    return <BsSortUp className="w-4.5 h-4.5" />;
  };

  return (
    <div className="w-full h-full grid">
      {/* Table Wrapper with Border & Radius */}
      <div className="overflow-hidden h-full">
        <div className="overflow-x-auto">
          <table className={`w-full text-left ${rowStyle?.spaceing || ""}`}>
            <thead className="sticky top-0">
              <tr style={{ borderRadius: "100%" }} className="text-center">
                {columns.map((col, index) => (
                  <th
                    key={index}
                    style={{ minWidth: col.width || "auto" }}
                    className="whitespace-nowrap text-sm font-normal capitalize  text-descriptionColor"
                    // onClick={() =>
                    //   col.sortable && onSort && onSort(col.accessor)
                    // }
                  >
                    <div
                      className={`flex gap-1.5 ${col?.position} ${col.sortable ? "cursor-pointer" : ""} ${index === 0 ? "rounded-tl-lg" : ""} ${index === columns.length - 1 ? "rounded-tr-lg" : ""}`}
                      style={{
                        background: header?.bg,
                        padding: header?.padding,
                        color: header?.text,
                        fontWeight: header?.fontWeight,
                        fontSize: header?.fontSize,
                      }}
                    >
                      {col?.sortable && (
                        <button
                          onClick={col.sortFunction}
                          className="cursor-pointer p-px rounded hover:bg-gray-300 transition-colors duration-300"
                        >
                          {renderSortIcon(col.accessor)}
                        </button>
                      )}
                      {col.label}
                    </div>
                  </th>
                ))}
                {(onView || onDelete) && (
                  <th className="px-4 py-3 text-base font-medium text-Gray-Black-400 border-b border-border">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, i) => (
                  <tr
                    key={i}
                    className={`w-full h-full ${rowStyle?.hover ? rowStyle.hoverbg : ""} ${rowStyle?.bg || "bg-white"} ${rowStyle?.border ? `border ${rowStyle.border}` : ""} ${(rowStyle?.rowClickable && rowStyle.rowClickCheck ? row?.[rowStyle.rowClickCheck?.split(",")?.[0]] && row?.[rowStyle.rowClickCheck?.split(",")?.[1]] : true) ? "cursor-pointer" : "cursor-default"}`}
                    onClick={() =>
                      rowStyle?.rowClickable && rowStyle.rowClick
                        ? rowStyle.rowClick(row)
                        : null
                    }
                  >
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        style={{ width: col.width || "auto" }}
                        className="text-Gray-Black-400"
                      >
                        {col.formatter
                          ? col.formatter(row[col.accessor], row, i)
                          : row[col.accessor]}
                      </td>
                    ))}
                    {(onView || onDelete) && (
                      <td className="px-4 py-3 flex gap-4 items-center">
                        {onView && (
                          <span
                            className="text-sm underline text-Gray-Black-400  cursor-pointer"
                            onClick={() => onView(row)}
                          >
                            View details
                          </span>
                        )}
                        {onDelete && (
                          <Image
                            onClick={() => onDelete(row.id)}
                            src="/dashboard/icon/delete.svg"
                            alt="delete"
                            width={16}
                            height={16}
                            className="cursor-pointer"
                          />
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-10 text-center text-Gray-Black-400 text-sm"
                  >
                    {noDataMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
