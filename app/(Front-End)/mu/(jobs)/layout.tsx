import React from "react";
import Breadcrumb from "../../_components/Breadcrumb";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Breadcrumb />
      <div>
        <div>{children}</div>
      </div>
      {/* <div>{children}</div> */}
    </div>
  );
}

export default layout;
