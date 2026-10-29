import React from "react";
import MyJobApplicationsApply from "../_component/MyJobApplicationsApply";

export default function MyApplicationsPage() {
  return (
    <main className="w-full">
      <header className="mb-6">
        <h1 className="sm:text-2xl text-xl font-bold text-headerColor">
          My Applications
        </h1>
        <p className="text-sm sm:text-base text-grayColor1 mt-1">
          Track and manage your applied jobs and application statuses.
        </p>
      </header>
      <MyJobApplicationsApply />
    </main>
  );
}
