import MainFooter from "@/components/reusable/MainFooter";

import { getToken } from "@/lib/token";
import React from "react";
import Footer from "../_components/Footer";
import Navbar from "../_components/Navbar";
import MainNavbar from "../_components/mainPage/MainNavbar";

async function layout({ children }: { children: React.ReactNode }) {
  const token = await getToken();

  return (
    <div className="min-h-screen">
      {token ? <MainNavbar /> : <Navbar />}

      <div className="container h-full w-full">{children}</div>
      {token ? <MainFooter /> : <Footer />}
    </div>
  );
}

export default layout;
