import React from "react";
import PublicationPage from "../_component/publication/PublicationPage";

export const metadata = {
  title: "Pro Industry Publication | MindUnite",
  description: "Add and manage your publications in the Industry",
};

export default function page() {
  return (
    <div>
      <PublicationPage />
    </div>
  );
}