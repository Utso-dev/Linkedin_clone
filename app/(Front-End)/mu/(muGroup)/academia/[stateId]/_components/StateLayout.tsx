"use client"

import { IoMenu } from "react-icons/io5";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { useAcademiaContext } from "../../_components/AcademiaContext";


export default function StateLayout({ children }: { children: React.ReactNode }) {
    const { isOpen, setIsOpen } = useAcademiaContext();
    return (
        <div className="relative grid grid-cols-1 xl:grid-cols-[auto_1fr] grid-rows-1 xl:grid-rows-1 h-full min-h-0">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="h-full grid">
                {children}
            </div>
        </div>
    )
}